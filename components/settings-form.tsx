"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageIcon } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { toast } from "@/components/ui/use-toast"
import { userService } from "@/services/user.service"

export default function SettingsForm() {
  const { userProfile } = useAuth()

  const [profileForm, setProfileForm] = useState({
    name:
      userProfile?.user.firstName && userProfile?.user.lastName
        ? `${userProfile.user.firstName} ${userProfile.user.lastName}`
        : userProfile?.user.username || "",
    username: userProfile?.user.username || "",
    bio: "This is a sample bio for the user profile. Here you can write about yourself and share your interests with others.",
    website: "https://example.com",
    location: "New York, USA",
    email: userProfile?.user.email || "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
    directMessages: true,
    emailNotifications: false,
  })

  const [privacySettings, setPrivacySettings] = useState({
    privateAccount: false,
    showActivity: true,
    allowTagging: true,
    allowMentions: true,
  })

  const [isSaving, setIsSaving] = useState(false)

  const [uploadingImage, setUploadingImage] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(
    userProfile?.profile_picture || "/placeholder.svg?height=40&width=40",
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: checked }))
  }

  const handlePrivacyChange = (key: string, checked: boolean) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: checked }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)

    try {
      // In a real app, you would call your API
      // await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profileForm)
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleProfileImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)

      // Show loading toast
      toast({
        title: "Uploading...",
        description: "Your profile picture is being updated",
      })

      // Create a preview
      const reader = new FileReader()
      reader.onload = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to server
      const formData = new FormData()
      formData.append("profile_picture", file)

      await userService.updateProfile(formData)

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile picture:", error)
      // Revert to original image
      setProfileImage(userProfile?.profile_picture || "/placeholder.svg?height=40&width=40")

      toast({
        title: "Error",
        description: "Failed to update profile picture",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const avatarUrl = userProfile?.profile_picture || "/placeholder.svg?height=40&width=40"
  const displayName =
    userProfile?.user.firstName && userProfile?.user.lastName
      ? `${userProfile?.user.firstName} ${userProfile?.user.firstName}`
      : userProfile?.user.username || ""

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile information and how others see you on the platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-background">
                      <AvatarImage src={profileImage || avatarUrl} alt={displayName} />
                      <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 cursor-pointer">
                      <input
                        id="profile-image-upload"
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageChange}
                        disabled={uploadingImage}
                      />
                      <div className="rounded-full bg-primary text-primary-foreground p-2 shadow-sm hover:bg-primary/90 transition-colors">
                        {uploadingImage ? (
                          <span className="animate-spin block h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        ) : (
                          <ImageIcon className="h-4 w-4" />
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <h3 className="font-medium">{profileForm.name}</h3>
                    <p className="text-sm text-muted-foreground">@{profileForm.username}</p>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Upload a new profile picture or change your profile details below.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                      >
                        {uploadingImage ? "Uploading..." : "Change Avatar"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={profileForm.name} onChange={handleProfileChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" value={profileForm.username} onChange={handleProfileChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" name="bio" value={profileForm.bio} onChange={handleProfileChange} rows={4} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" name="website" value={profileForm.website} onChange={handleProfileChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={profileForm.location} onChange={handleProfileChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how and when you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Likes</h4>
                      <p className="text-sm text-muted-foreground">Notify when someone likes your post</p>
                    </div>
                    <Switch
                      checked={notificationSettings.likes}
                      onCheckedChange={(checked) => handleNotificationChange("likes", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Comments</h4>
                      <p className="text-sm text-muted-foreground">Notify when someone comments on your post</p>
                    </div>
                    <Switch
                      checked={notificationSettings.comments}
                      onCheckedChange={(checked) => handleNotificationChange("comments", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Follows</h4>
                      <p className="text-sm text-muted-foreground">Notify when someone follows you</p>
                    </div>
                    <Switch
                      checked={notificationSettings.follows}
                      onCheckedChange={(checked) => handleNotificationChange("follows", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Mentions</h4>
                      <p className="text-sm text-muted-foreground">Notify when someone mentions you</p>
                    </div>
                    <Switch
                      checked={notificationSettings.mentions}
                      onCheckedChange={(checked) => handleNotificationChange("mentions", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Direct Messages</h4>
                      <p className="text-sm text-muted-foreground">Notify when you receive a direct message</p>
                    </div>
                    <Switch
                      checked={notificationSettings.directMessages}
                      onCheckedChange={(checked) => handleNotificationChange("directMessages", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => alert("Notification settings saved!")}>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your privacy and security preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Private Account</h4>
                      <p className="text-sm text-muted-foreground">Only approved followers can see your posts</p>
                    </div>
                    <Switch
                      checked={privacySettings.privateAccount}
                      onCheckedChange={(checked) => handlePrivacyChange("privateAccount", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Activity Status</h4>
                      <p className="text-sm text-muted-foreground">Show when you're active on the platform</p>
                    </div>
                    <Switch
                      checked={privacySettings.showActivity}
                      onCheckedChange={(checked) => handlePrivacyChange("showActivity", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Allow Tagging</h4>
                      <p className="text-sm text-muted-foreground">Allow others to tag you in their posts</p>
                    </div>
                    <Switch
                      checked={privacySettings.allowTagging}
                      onCheckedChange={(checked) => handlePrivacyChange("allowTagging", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Allow Mentions</h4>
                      <p className="text-sm text-muted-foreground">Allow others to mention you in comments</p>
                    </div>
                    <Switch
                      checked={privacySettings.allowMentions}
                      onCheckedChange={(checked) => handlePrivacyChange("allowMentions", checked)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => alert("Privacy settings saved!")}>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
