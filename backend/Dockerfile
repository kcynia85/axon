# Use official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install uv
RUN pip install uv

# Copy the project files
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync --frozen

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 8080

# Command to run the application
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
