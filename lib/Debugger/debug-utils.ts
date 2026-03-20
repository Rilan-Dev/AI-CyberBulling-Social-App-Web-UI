export function logRedirect(from: string, to: string, reason: string) {
    if (typeof window !== "undefined") {
      console.log(`Redirect: ${from} -> ${to} (${reason})`)
    }
  }
  
  export function logAuthState(isAuthenticated: boolean, isLoading: boolean, path: string) {
    if (typeof window !== "undefined") {
      console.log(`Auth State: authenticated=${isAuthenticated}, loading=${isLoading}, path=${path}`)
    }
  }
  