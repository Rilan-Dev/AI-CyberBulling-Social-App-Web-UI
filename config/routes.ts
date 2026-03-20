// // Define which routes require authentication
// export const protectedRoutes = [
//     "/dashboard",
//     "/create-post",
//     "/settings",
//     "/profile",
//     "/notifications",
//     "/explore",
//     "/text-analysis",
//     "/image-analysis",
//     "/", // Home page is protected
//   ]
  
//   // Define public routes that don't require authentication
//   export const publicRoutes = ["/login", "/register", "/forgot-password"]
  
//   // Function to check if a route is protected
//   export function isProtectedRoute(path: string): boolean {
//     // Check if the path exactly matches a protected route
//     if (protectedRoutes.includes(path)) {
//       return true
//     }
  
//     // Check if the path starts with any protected route prefix
//     return protectedRoutes.some((route) => {
//       // For routes like /profile/username, we need to check if it starts with /profile/
//       if (route.endsWith("/")) {
//         return path.startsWith(route)
//       }
//       // For other routes, we need to check if it starts with route/ or is exactly route
//       return path === route || path.startsWith(`${route}/`)
//     })
//   }
  
//   // Function to check if a route is public
//   export function isPublicRoute(path: string): boolean {
//     return publicRoutes.some((route) => path === route)
//   }
  
//   // Function to determine if navbar should be shown
//   export function shouldShowNavbar(path: string): boolean {
//     return !isPublicRoute(path)
//   }
  

// Define which routes require authentication
export const protectedRoutes = [
  "/dashboard",
  "/create-post",
  "/settings",
  "/profile",
  "/notifications",
  "/explore",
  "/text-analysis",
  "/image-analysis",
  "/", // Home page is protected
]

// Define public routes that don't require authentication
export const publicRoutes = ["/login", "/register", "/forgot-password", "/welcome"]

// Function to check if a route is protected
export function isProtectedRoute(path: string): boolean {
  // Check if the path exactly matches a protected route
  if (protectedRoutes.includes(path)) {
    return true
  }

  // Check if the path starts with any protected route prefix
  return protectedRoutes.some((route) => {
    // For routes like /profile/username, we need to check if it starts with /profile/
    if (route.endsWith("/")) {
      return path.startsWith(route)
    }
    // For other routes, we need to check if it starts with route/ or is exactly route
    return path === route || path.startsWith(`${route}/`)
  })
}

// Function to check if a route is public
export function isPublicRoute(path: string): boolean {
  return publicRoutes.some((route) => path === route)
}

// Function to determine if navbar should be shown
export function shouldShowNavbar(path: string): boolean {
  return !isPublicRoute(path) || path === "/welcome"
}
