"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { parseJwt, getTimeUntilExpiry, getTokenExpiryDate } from "@/utils/token-utils"
import { useToast } from "@/components/ui/use-toast"

export function TokenStatus() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<string>("Unknown")
  const [expiryDate, setExpiryDate] = useState<Date | null>(null)
  const [isExpired, setIsExpired] = useState<boolean>(false)
  const { toast } = useToast()

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return

    // Get tokens from localStorage
    const accessToken = localStorage.getItem("accessToken")
    const refreshToken = localStorage.getItem("refreshToken")

    setAccessToken(accessToken)
    setRefreshToken(refreshToken)

    if (accessToken) {
      // Parse token and get expiry info
      const payload = parseJwt(accessToken)
      if (payload) {
        const expiry = new Date(payload.exp * 1000)
        setExpiryDate(expiry)
        setIsExpired(Date.now() > expiry.getTime())
      }

      // Update time until expiry every second
      const interval = setInterval(() => {
        if (accessToken) {
          const timeLeft = getTimeUntilExpiry(accessToken)
          setTimeUntilExpiry(timeLeft)

          // Check if token is expired
          const expiry = getTokenExpiryDate(accessToken)
          if (expiry) {
            setIsExpired(Date.now() > expiry.getTime())
          }
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [])

  const handleManualRefresh = async () => {
    try {
      if (!refreshToken) {
        toast({
          title: "Error",
          description: "No refresh token available",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      })

      if (!response.ok) {
        throw new Error(`Refresh failed: ${response.status}`)
      }

      const data = await response.json()

      // Update tokens in localStorage
      localStorage.setItem("accessToken", data.access)
      if (data.refresh) {
        localStorage.setItem("refreshToken", data.refresh)
      }

      // Update state
      setAccessToken(data.access)
      if (data.refresh) {
        setRefreshToken(data.refresh)
      }

      // Update expiry info
      const payload = parseJwt(data.access)
      if (payload) {
        const expiry = new Date(payload.exp * 1000)
        setExpiryDate(expiry)
        setIsExpired(Date.now() > expiry.getTime())
      }

      toast({
        title: "Success",
        description: "Token refreshed successfully",
      })
    } catch (error) {
      console.error("Manual refresh error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to refresh token",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Status</CardTitle>
        <CardDescription>Information about your current authentication tokens</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">Access Token Status</h3>
          <p className={`text-sm ${isExpired ? "text-red-500" : "text-green-500"}`}>
            {accessToken ? (isExpired ? "Expired" : "Valid") : "Not available"}
          </p>
        </div>

        <div>
          <h3 className="font-medium">Time Until Expiry</h3>
          <p className="text-sm">{timeUntilExpiry}</p>
        </div>

        <div>
          <h3 className="font-medium">Expiry Date</h3>
          <p className="text-sm">{expiryDate ? expiryDate.toLocaleString() : "Unknown"}</p>
        </div>

        <div>
          <h3 className="font-medium">Refresh Token</h3>
          <p className="text-sm">{refreshToken ? "Available" : "Not available"}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleManualRefresh} disabled={!refreshToken}>
          Manually Refresh Token
        </Button>
      </CardFooter>
    </Card>
  )
}
