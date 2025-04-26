"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CustomDropdown, CustomDropdownItem } from "@/components/ui/custom-dropdown"
import { LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"

export function UserNav() {
  const { userProfile, logout } = useAuth()

  if (!userProfile) {
    return null
  }

  const displayName = userProfile.user.firstName && userProfile.user.lastName ? `${userProfile.user.firstName} ${userProfile.user.lastName}` : userProfile.user.username

  const avatarUrl = userProfile.profile_picture || "/placeholder.svg?height=40&width=40"

  return (
    <CustomDropdown
      trigger={
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={displayName} />
            <AvatarFallback>{displayName?.charAt(0) ?? "" }</AvatarFallback>
          </Avatar>
        </Button>
      }
      align="right"
      className="w-56"
    >
      <div className="px-2 py-1.5 font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{displayName}</p>
          <p className="text-xs leading-none text-muted-foreground">@{userProfile.user.username}</p>
        </div>
      </div>
      <div className="h-px my-1 -mx-1 bg-muted"></div>
      <div>
        <CustomDropdownItem>
          <Link href={`/profile/${userProfile.user.username}`} className="flex items-center w-full">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </CustomDropdownItem>
        <CustomDropdownItem>
          <Link href="/settings" className="flex items-center w-full">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </CustomDropdownItem>
      </div>
      <div className="h-px my-1 -mx-1 bg-muted"></div>
      <CustomDropdownItem onClick={logout}>
        <div className="flex items-center w-full">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </div>
      </CustomDropdownItem>
    </CustomDropdown>
  )
}
