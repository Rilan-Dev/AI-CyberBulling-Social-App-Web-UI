"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Heart, MessageCircle, UserPlus } from "lucide-react"

// Mock notification data
const mockNotifications = [
  {
    id: "1",
    type: "like",
    user: {
      name: "John Doe",
      username: "johndoe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "liked your post",
    postId: "1",
    timestamp: "2h ago",
    read: false,
  },
  {
    id: "2",
    type: "comment",
    user: {
      name: "Jane Smith",
      username: "janesmith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: 'commented on your post: "Great photo!"',
    postId: "1",
    timestamp: "4h ago",
    read: true,
  },
  {
    id: "3",
    type: "follow",
    user: {
      name: "Alex Johnson",
      username: "alexj",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "started following you",
    timestamp: "1d ago",
    read: true,
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Fetch notifications
    const fetchNotifications = async () => {
      setLoading(true)
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/notifications')
        // const data = await response.json()

        // For demo, we'll use mock data with a delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setNotifications(mockNotifications)
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const getFilteredNotifications = () => {
    if (activeTab === "all") {
      return notifications
    } else {
      return notifications.filter((notification) => notification.type === activeTab)
    }
  }

  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    )

    // In a real app, you would call your API
    // await fetch('/api/notifications/read-all', { method: 'POST' })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "comment":
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const filteredNotifications = getFilteredNotifications()
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="like">Likes</TabsTrigger>
            <TabsTrigger value="comment">Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {renderNotificationsList()}
          </TabsContent>

          <TabsContent value="like" className="mt-6">
            {renderNotificationsList()}
          </TabsContent>

          <TabsContent value="comment" className="mt-6">
            {renderNotificationsList()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )

  function renderNotificationsList() {
    if (loading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }

    if (filteredNotifications.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="font-medium">No notifications</h3>
          <p className="text-sm text-muted-foreground mt-1">When you get notifications, they'll appear here</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <Card key={notification.id} className={notification.read ? "" : "border-primary bg-primary/5"}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Link href={`/profile/${notification.user.username}`}>
                  <Avatar>
                    <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                    <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Link href={`/profile/${notification.user.username}`} className="font-semibold hover:underline">
                      {notification.user.name}
                    </Link>
                    <span className="text-sm text-muted-foreground">{notification.content}</span>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
}
