"use client"

import { useState } from "react"
import SettingsForm from "@/components/settings-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TokenStatus } from "@/components/token-status"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className={`container mx-auto py-10 ${isDark ?  "text-gray-200": "text-gray-200"}`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-white"}`}>Settings</h1>
        <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>Manage your account settings and preferences.</p>
      </div>

      {/* <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab} className="space-y-4"> */}
        {/* <TabsList
          className={`${isDark ? "bg-gray-800/50 border border-gray-700" : "bg-gray-100 border border-gray-200"}`}
        >
          <TabsTrigger
            value="account"
            className={`${isDark ? "data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300 text-gray-300" : "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-gray-600"}`}
          >
            Account
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className={`${isDark ? "data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300 text-gray-300" : "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-gray-600"}`}
          >
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className={`${isDark ? "data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300 text-gray-300" : "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-gray-600"}`}
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className={`${isDark ? "data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300 text-gray-300" : "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-gray-600"}`}
          >
            Security
          </TabsTrigger>
        </TabsList> */}

        {/* <TabsContent value="account" className="space-y-4"> */}
          <SettingsForm />
        {/* </TabsContent> */}

        {/* <TabsContent value="appearance" className="space-y-4">
          <Card
            className={`${isDark ? "bg-gray-900/70 backdrop-blur-lg border border-gray-800" : "bg-white border border-gray-200"}`}
          >
            <CardHeader>
              <CardTitle className={isDark ? "text-white" : "text-gray-900"}>Appearance</CardTitle>
              <CardDescription className={isDark ? "text-gray-400" : "text-gray-500"}>
                Customize the appearance of the application. Choose between light and dark mode.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className={isDark ? "text-gray-300" : "text-gray-600"}>Appearance settings will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card
            className={`${isDark ? "bg-gray-900/70 backdrop-blur-lg border border-gray-800" : "bg-white border border-gray-200"}`}
          >
            <CardHeader>
              <CardTitle className={isDark ? "text-white" : "text-gray-900"}>Notifications</CardTitle>
              <CardDescription className={isDark ? "text-gray-400" : "text-gray-500"}>
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                Notification settings will be available soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <TokenStatus />

          <Card
            className={`${isDark ? "bg-gray-900/70 backdrop-blur-lg border border-gray-800" : "bg-white border border-gray-200"}`}
          >
            <CardHeader>
              <CardTitle className={isDark ? "text-white" : "text-gray-900"}>Password</CardTitle>
              <CardDescription className={isDark ? "text-gray-400" : "text-gray-500"}>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                Password change functionality will be available soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent> */}
      {/* </Tabs> */}
    </div>
  )
}
