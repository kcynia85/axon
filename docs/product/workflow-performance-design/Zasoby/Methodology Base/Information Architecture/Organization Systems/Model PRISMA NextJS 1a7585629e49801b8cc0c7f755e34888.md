---
template_type: flow
---

# Model PRISMA / NextJS

## 1. Definicja schematu Prisma

```
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Float
  brand       Brand    @relation(fields: [brandId], references: [id])
  brandId     Int
  category    Category @relation(fields: [categoryId], references: [id])
  categoryId  Int
  tags        Tag[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Brand {
  id       Int       @id @default(autoincrement())
  name     String    @unique
  products Product[]
}

model Category {
  id       Int       @id @default(autoincrement())
  name     String    @unique
  products Product[]
}

model Tag {
  id       Int       @id @default(autoincrement())
  name     String    @unique
  products Product[]
}

```

## 2. API endpoint w Next.js do filtrowania produktów

```tsx
// pages/api/products.ts
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { 
    category, 
    brand, 
    minPrice, 
    maxPrice, 
    sortBy, 
    sortOrder,
    searchTerm 
  } = req.query

  // Budowa dynamicznych warunków filtrowania
  let whereClause: any = {}
  
  if (searchTerm) {
    whereClause.name = { contains: searchTerm as string, mode: 'insensitive' }
  }
  
  if (category) {
    whereClause.category = { name: category as string }
  }
  
  if (brand) {
    whereClause.brand = { name: brand as string }
  }
  
  if (minPrice || maxPrice) {
    whereClause.price = {}
    if (minPrice) whereClause.price.gte = parseFloat(minPrice as string)
    if (maxPrice) whereClause.price.lte = parseFloat(maxPrice as string)
  }
  
  // Dynamiczne sortowanie
  let orderBy = {}
  if (sortBy) {
    orderBy[sortBy as string] = sortOrder || 'asc'
  } else {
    orderBy = { name: 'asc' }
  }

  try {
    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy,
      include: {
        brand: true,
        category: true,
        tags: true
      }
    })
    
    res.status(200).json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
}

```

## 3. Komponent interfejsu użytkownika

```
// components/ProductSearch.tsx
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function ProductSearch() {
  const router = useRouter()
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name',
    sortOrder: 'asc',
    searchTerm: ''
  })
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [products, setProducts] = useState([])

  // Pobieranie kategorii i marek przy pierwszym renderowaniu
  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(setCategories)
    fetch('/api/brands').then(res => res.json()).then(setBrands)
  }, [])

  // Aktualizacja filtrów i URL przy zmianie filtrów
  useEffect(() => {
    const query = {...filters}
    
    // Usuwanie pustych parametrów
    Object.keys(query).forEach(key => 
      !query[key] && delete query[key]
    )
    
    router.push({
      pathname: '/products',
      query
    }, undefined, { shallow: true })
    
    // Pobieranie produktów z zastosowanymi filtrami
    const queryString = new URLSearchParams(query).toString()
    fetch(`/api/products?${queryString}`)
      .then(res => res.json())
      .then(setProducts)
  }, [filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="product-search">
      <div className="filters">
        <input
          type="text"
          name="searchTerm"
          placeholder="Szukaj produktów..."
          value={filters.searchTerm}
          onChange={handleFilterChange}
        />
        
        <select name="category" onChange={handleFilterChange} value={filters.category}>
          <option value="">Wszystkie kategorie</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        
        <select name="brand" onChange={handleFilterChange} value={filters.brand}>
          <option value="">Wszystkie marki</option>
          {brands.map(brand => (
            <option key={brand.id} value={brand.name}>{brand.name}</option>
          ))}
        </select>
        
        <div className="price-range">
          <input
            type="number"
            name="minPrice"
            placeholder="Min cena"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max cena"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
        </div>
        
        <div className="sorting">
          <select name="sortBy" onChange={handleFilterChange} value={filters.sortBy}>
            <option value="name">Nazwa</option>
            <option value="price">Cena</option>
            <option value="createdAt">Data dodania</option>
          </select>
          <select name="sortOrder" onChange={handleFilterChange} value={filters.sortOrder}>
            <option value="asc">Rosnąco</option>
            <option value="desc">Malejąco</option>
          </select>
        </div>
      </div>
      
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>Marka: {product.brand.name}</p>
            <p>Kategoria: {product.category.name}</p>
            <p>Cena: {product.price} zł</p>
            <div className="tags">
              {product.tags.map(tag => (
                <span key={tag.id} className="tag">{tag.name}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

```

Ten przykład ilustruje model bazodanowy, który:

- Automatycznie organizuje produkty według różnych metadanych (cena, marka, kategoria)
- Umożliwia filtrowanie i sortowanie według określonych kryteriów
- Pozwala na wyszukiwanie produktów w określonych kategoriach
- Dynamicznie wyświetla powiązane treści (tagi, informacje o marce, kategorii)
- Może automatycznie tworzyć listy produktów w porządku alfabetycznym

W ten sposób implementacja wykorzystuje podejście "oddolne", gdzie to właściwości samych danych i relacje między nimi determinują sposób organizacji i wyświetlania informacji.