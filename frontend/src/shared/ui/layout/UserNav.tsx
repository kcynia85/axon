"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, LogIn, UserCircle } from "lucide-react"
import { createClient } from "@/shared/infrastructure/supabase/client"
import { Button } from "@/shared/ui/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/ui/Avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/ui/DropdownMenu"
import { cn } from "@/shared/lib/utils"

type UserNavProps = {
  readonly hideText?: boolean;
}

export const UserNav = ({ hideText }: UserNavProps) => {
  const [email, setEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email) {
          setEmail(user.email)
          const name = user.user_metadata?.full_name || user.email.split('@')[0]
          setUserName(name)
          setAvatarUrl(user.user_metadata?.avatar_url || null)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setIsLoading(false)
      }
    }
    getUser()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const handleSignIn = () => {
    router.push("/login")
  }

  if (isLoading) return <div className="h-14 w-full animate-pulse bg-zinc-100 dark:bg-zinc-900 rounded-xl" />

  if (!email) {
    return (
      <Button 
        variant="ghost" 
        onClick={handleSignIn}
        className={cn(
          "relative h-14 w-full justify-start gap-3 px-2 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl group",
          hideText && "justify-center px-0"
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-dashed border-zinc-300 dark:border-zinc-700 rounded-full bg-zinc-50 dark:bg-zinc-950">
          <UserCircle className="h-5 w-5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
        </div>
        {!hideText && (
          <div className="flex flex-col text-left truncate min-w-0">
            <span className="text-sm font-black text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 leading-none truncate">
              Guest User
            </span>
            <span className="text-xs font-bold text-zinc-400 mt-1.5 flex items-center gap-1">
              Sign in to Axon <LogIn className="h-2 w-2" />
            </span>
          </div>
        )}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            "relative h-14 w-full justify-start gap-3 px-2 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl",
            hideText && "justify-center px-0"
          )}
        >
          <Avatar className="h-10 w-10 shrink-0 border border-zinc-200 dark:border-zinc-800 rounded-full">
            {avatarUrl && (
              <AvatarImage src={avatarUrl} alt={userName || email} />
            )}
            <AvatarFallback className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-black text-xs rounded-full">
              {userName ? userName[0].toUpperCase() : email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!hideText && (
            <div className="flex flex-col text-left truncate min-w-0">
              <span className="text-sm font-black text-zinc-900 dark:text-zinc-100 leading-none truncate capitalize">
                {userName}
              </span>
              <span className="text-xs font-bold text-zinc-500 truncate mt-1.5">
                {email}
              </span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start" sideOffset={12} forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-black leading-none capitalize">{userName}</p>
            <p className="text-xs leading-none text-zinc-500 mt-1">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 font-bold">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
