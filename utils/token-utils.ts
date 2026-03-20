// Parse JWT token to get expiry time and other claims
export function parseJwt(token: string): { exp: number; [key: string]: any } | null {
    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error("Error parsing JWT token:", error)
      return null
    }
  }
  
  // Check if token is expired or about to expire
  export function isTokenExpired(token: string, bufferMinutes = 5): boolean {
    const payload = parseJwt(token)
    if (!payload) return true
  
    const expiryTime = payload.exp * 1000 // Convert to milliseconds
    const currentTime = Date.now()
    const bufferTime = bufferMinutes * 60 * 1000 // Convert minutes to milliseconds
  
    return currentTime + bufferTime >= expiryTime
  }
  
  // Get time until token expiry in a human-readable format
  export function getTimeUntilExpiry(token: string): string {
    const payload = parseJwt(token)
    if (!payload) return "Unknown"
  
    const expiryTime = payload.exp * 1000 // Convert to milliseconds
    const currentTime = Date.now()
    const timeLeft = expiryTime - currentTime
  
    if (timeLeft <= 0) return "Expired"
  
    const minutes = Math.floor(timeLeft / 60000)
    const seconds = Math.floor((timeLeft % 60000) / 1000)
  
    return `${minutes}m ${seconds}s`
  }
  
  // Get token expiry date
  export function getTokenExpiryDate(token: string): Date | null {
    const payload = parseJwt(token)
    if (!payload) return null
  
    return new Date(payload.exp * 1000)
  }
  