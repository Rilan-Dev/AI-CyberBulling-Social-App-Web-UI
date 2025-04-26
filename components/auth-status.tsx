"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { LogIn, PlusIcon, UserIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function AuthStatus() {
  const { isAuthenticated, loading, userProfile } = useAuth()

  if (loading) {
    return <Skeleton className="h-9 w-[100px]" />
  }

  // In development, always show authenticated UI
  const showAuthenticatedUI = process.env.NODE_ENV === "development" || isAuthenticated

  if (showAuthenticatedUI) {
    return (
      <>
        <Button variant="outline" size="icon" asChild>
          <Link href={`/profile/${userProfile?.user.username}`}>
            <UserIcon className="h-4 w-4" />
            <span className="sr-only">Profile</span>
          </Link>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <Link href="/create-post">
            <PlusIcon className="h-4 w-4" />
            <span className="sr-only">Create post</span>
          </Link>
        </Button>
        <UserNav />
      </>
    )
  }

  return (
    <>
      <Button variant="outline" asChild>
        <Link href="/login">
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </Link>
      </Button>
      <Button asChild>
        <Link href="/register">Register</Link>
      </Button>
    </>
  )
}
