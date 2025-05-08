"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageIcon, Loader2, CheckCircle } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { toast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"
import { userService } from "@/services/user.service"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
}

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function SettingsForm() {
  const { userProfile } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === "dark"

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
  const [saveSuccess, setSaveSuccess] = useState(false)

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
    setSaveSuccess(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
        variant: "default",
      })

      setSaveSuccess(true)

      // Reset success state after 2 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 2000)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
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
    <div
      className={`min-h-screen ${isDark ? "bg-gradient-to-b from-gray-900 to-black" : "bg-gradient-to-b from-gray-50 to-white"}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-0 ${isDark ? "bg-[radial-gradient(circle_at_center,rgba(0,100,255,0.1),transparent_70%)]" : "bg-[radial-gradient(circle_at_center,rgba(0,100,255,0.05),transparent_70%)]"}`}
        ></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)"
              : "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="container py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            className={`text-3xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Settings
          </motion.h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <TabsList
                className={`grid w-full max-w-md grid-cols-3 ${isDark ? "bg-gray-800/50 border border-gray-700" : "bg-gray-100/80 border border-gray-200"}`}
              >
                <TabsTrigger
                  value="profile"
                  className={`${isDark ? "data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300 text-gray-300" : "data-[state=active]:bg-blue-100/70 data-[state=active]:text-blue-700 text-gray-600"}`}
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className={`${isDark ? "data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300 text-gray-300" : "data-[state=active]:bg-blue-100/70 data-[state=active]:text-blue-700 text-gray-600"}`}
                >
                  Notifications
                </TabsTrigger>
                <TabsTrigger
                  value="privacy"
                  className={`${isDark ? "data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300 text-gray-300" : "data-[state=active]:bg-blue-100/70 data-[state=active]:text-blue-700 text-gray-600"}`}
                >
                  Privacy
                </TabsTrigger>
              </TabsList>
            </motion.div>

            <TabsContent value="profile">
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card
                  className={`${isDark ? "bg-gray-900/70 backdrop-blur-lg border border-gray-800 text-gray-200" : "bg-white/90 backdrop-blur-lg border border-gray-200 text-gray-800"}`}
                >
                  <CardHeader>
                    <CardTitle className={isDark ? "text-white" : "text-gray-900"}>Profile Information</CardTitle>
                    <CardDescription className={isDark ? "text-gray-400" : "text-gray-500"}>
                      Update your profile information and how others see you on the platform.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <motion.div
                      className="flex flex-col sm:flex-row gap-6 items-center sm:items-start"
                      variants={slideUp}
                    >
                      <div className="relative">
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                          <Avatar className="h-24 w-24 border-4 border-blue-500/20 ring-2 ring-blue-500/10">
                            <AvatarImage src={profileImage || avatarUrl} alt={displayName} />
                            <AvatarFallback className="bg-blue-900/30 text-blue-200">
                              {displayName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </motion.div>
                        <motion.label
                          htmlFor="profile-image-upload"
                          className="absolute bottom-0 right-0 cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <input
                            id="profile-image-upload"
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfileImageChange}
                            disabled={uploadingImage}
                          />
                          <div className="rounded-full bg-blue-600 text-white p-2 shadow-lg hover:bg-blue-700 transition-colors">
                            {uploadingImage ? (
                              <span className="animate-spin block h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                            ) : (
                              <ImageIcon className="h-4 w-4" />
                            )}
                          </div>
                        </motion.label>
                      </div>

                      <div className="flex-1 space-y-1 text-center sm:text-left">
                        <h3 className="font-medium text-white">{profileForm.name}</h3>
                        <p className="text-sm text-blue-300">@{profileForm.username}</p>
                        <div className="mt-2 space-y-2">
                          <p className="text-sm text-gray-400">
                            Upload a new profile picture or change your profile details below.
                          </p>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploadingImage}
                              className={`${isDark ? "border-blue-500 text-blue-300 hover:bg-blue-900/20" : "border-blue-500 text-blue-600 hover:bg-blue-50"}`}
                            >
                              {uploadingImage ? "Uploading..." : "Change Avatar"}
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="grid gap-4 sm:grid-cols-2"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div className="space-y-2" variants={slideUp}>
                        <Label htmlFor="name" className={isDark ? "text-gray-300" : "text-gray-700"}>
                          Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={profileForm.name}
                          onChange={handleProfileChange}
                          className={`${isDark ? "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500" : "bg-white/50 border-gray-300 text-gray-900 placeholder:text-gray-400"} focus:border-blue-500 focus:ring-blue-500`}
                        />
                      </motion.div>

                      <motion.div className="space-y-2" variants={slideUp}>
                        <Label htmlFor="username" className={isDark ? "text-gray-300" : "text-gray-700"}>
                          Username
                        </Label>
                        <Input
                          id="username"
                          name="username"
                          value={profileForm.username}
                          onChange={handleProfileChange}
                          className={`${isDark ? "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500" : "bg-white/50 border-gray-300 text-gray-900 placeholder:text-gray-400"} focus:border-blue-500 focus:ring-blue-500`}
                        />
                      </motion.div>
                    </motion.div>

                    <motion.div className="space-y-2" variants={slideUp}>
                      <Label htmlFor="bio" className={isDark ? "text-gray-300" : "text-gray-700"}>
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profileForm.bio}
                        onChange={handleProfileChange}
                        rows={4}
                        className={`${isDark ? "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500" : "bg-white/50 border-gray-300 text-gray-900 placeholder:text-gray-400"} focus:border-blue-500 focus:ring-blue-500`}
                      />
                    </motion.div>

                    <motion.div
                      className="grid gap-4 sm:grid-cols-2"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div className="space-y-2" variants={slideUp}>
                        <Label htmlFor="website" className={isDark ? "text-gray-300" : "text-gray-700"}>
                          Website
                        </Label>
                        <Input
                          id="website"
                          name="website"
                          value={profileForm.website}
                          onChange={handleProfileChange}
                          className={`${isDark ? "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500" : "bg-white/50 border-gray-300 text-gray-900 placeholder:text-gray-400"} focus:border-blue-500 focus:ring-blue-500`}
                        />
                      </motion.div>

                      <motion.div className="space-y-2" variants={slideUp}>
                        <Label htmlFor="location" className={isDark ? "text-gray-300" : "text-gray-700"}>
                          Location
                        </Label>
                        <Input
                          id="location"
                          name="location"
                          value={profileForm.location}
                          onChange={handleProfileChange}
                          className={`${isDark ? "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500" : "bg-white/50 border-gray-300 text-gray-900 placeholder:text-gray-400"} focus:border-blue-500 focus:ring-blue-500`}
                        />
                      </motion.div>
                    </motion.div>

                    <motion.div className="space-y-2" variants={slideUp}>
                      <Label htmlFor="email" className={isDark ? "text-gray-300" : "text-gray-700"}>
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        className={`${isDark ? "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500" : "bg-white/50 border-gray-300 text-gray-900 placeholder:text-gray-400"} focus:border-blue-500 focus:ring-blue-500`}
                      />
                    </motion.div>
                  </CardContent>
                  <CardFooter>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : saveSuccess ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="notifications">
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card
                  className={`${isDark ? "bg-gray-900/70 backdrop-blur-lg border border-gray-800 text-gray-200" : "bg-white/90 backdrop-blur-lg border border-gray-200 text-gray-800"}`}
                >
                  <CardHeader>
                    <CardTitle className={isDark ? "text-white" : "text-gray-900"}>Notification Preferences</CardTitle>
                    <CardDescription className={isDark ? "text-gray-400" : "text-gray-500"}>
                      Manage how and when you receive notifications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <motion.div className="space-y-4" variants={staggerContainer} initial="hidden" animate="visible">
                      <motion.div className="flex items-center justify-between" variants={slideUp}>
                        <div>
                          <h4 className="font-medium text-white">Likes</h4>
                          <p className="text-sm text-gray-400">Notify when someone likes your post</p>
                        </div>
                        <Switch
                          checked={notificationSettings.likes}
                          onCheckedChange={(checked) => handleNotificationChange("likes", checked)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </motion.div>

                      <motion.div className="flex items-center justify-between" variants={slideUp}>
                        <div>
                          <h4 className="font-medium text-white">Comments</h4>
                          <p className="text-sm text-gray-400">Notify when someone comments on your post</p>
                        </div>
                        <Switch
                          checked={notificationSettings.comments}
                          onCheckedChange={(checked) => handleNotificationChange("comments", checked)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </motion.div>

                      <motion.div className="flex items-center justify-between" variants={slideUp}>
                        <div>
                          <h4 className="font-medium text-white">Follows</h4>
                          <p className="text-sm text-gray-400">Notify when someone follows you</p>
                        </div>
                        <Switch
                          checked={notificationSettings.follows}
                          onCheckedChange={(checked) => handleNotificationChange("follows", checked)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </motion.div>

                      <motion.div className="flex items-center justify-between" variants={slideUp}>
                        <div>
                          <h4 className="font-medium text-white">Mentions</h4>
                          <p className="text-sm text-gray-400">Notify when someone mentions you</p>
                        </div>
                        <Switch
                          checked={notificationSettings.mentions}
                          onCheckedChange={(checked) => handleNotificationChange("mentions", checked)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </motion.div>

                      <motion.div className="flex items-center justify-between" variants={slideUp}>
                        <div>
                          <h4 className="font-medium text-white">Direct Messages</h4>
                          <p className="text-sm text-gray-400">Notify when you receive a direct message</p>
                        </div>
                        <Switch
                          checked={notificationSettings.directMessages}
                          onCheckedChange={(checked) => handleNotificationChange("directMessages", checked)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </motion.div>

                      <motion.div className="flex items-center justify-between" variants={slideUp}>
                        <div>
                          <h4 className="font-medium text-white">Email Notifications</h4>
                          <p className="text-sm text-gray-400">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </motion.div>
                    </motion.div>
                  </CardContent>
                  <CardFooter>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => {
                          toast({
                            title: "Notification Settings Saved",
                            description: "Your notification preferences have been updated.",
                          })
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Save Preferences
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="privacy">
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card
                  className={`${isDark ? "bg-gray-900/70 backdrop-blur-lg border border-gray-800 text-gray-200" : "bg-white/90 backdrop-blur-lg border border-gray-200 text-gray-800"}`}
                >
                  <CardHeader>
                    <CardTitle className={isDark ? "text-white" : "text-gray-900"}>Privacy Settings</CardTitle>
                    <CardDescription className={isDark ? "text-gray-400" : "text-gray-500"}>
                      Control your privacy and security preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <motion.div className="space-y-4" variants={staggerContainer} initial="hidden" animate="visible">
                      <motion.div className="flex items-center justify-between" variants={slideUp}>
                        <div>
                          <h4 className="font-medium text-white">Private Account</h4>
                          <p className="text-sm text-gray-400">Only approved followers can see your posts</p>
                        </div>
                        <Switch
                          checked={privacySettings.privateAccount}
                          onCheckedChange={(checked) => handlePrivacyChange("privateAccount", checked)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </motion.div>

                      <motion.div className="flex items-center justify-between" variants={slideUp}>
                        <div>
                          <h4 className="font-medium text-white">Activity Status</h4>
                          <p className="text-sm text-gray-400">Show when you're active on the platform</p>
                        </div>
                        <Switch
                          checked={privacySettings.showActivity}
                          onCheckedChange={(checked) => handlePrivacyChange("showActivity", checked)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </motion.div>

                      <motion.div className="flex items-center justify-between" variants={slideUp}>
                        <div>
                          <h4 className="font-medium text-white">Allow Tagging</h4>
                          <p className="text-sm text-gray-400">Allow others to tag you in their posts</p>
                        </div>
                        <Switch
                          checked={privacySettings.allowTagging}
                          onCheckedChange={(checked) => handlePrivacyChange("allowTagging", checked)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </motion.div>

                      <motion.div className="flex items-center justify-between" variants={slideUp}>
                        <div>
                          <h4 className="font-medium text-white">Allow Mentions</h4>
                          <p className="text-sm text-gray-400">Allow others to mention you in comments</p>
                        </div>
                        <Switch
                          checked={privacySettings.allowMentions}
                          onCheckedChange={(checked) => handlePrivacyChange("allowMentions", checked)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </motion.div>
                    </motion.div>
                  </CardContent>
                  <CardFooter>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => {
                          toast({
                            title: "Privacy Settings Saved",
                            description: "Your privacy settings have been updated.",
                          })
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Save Settings
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
