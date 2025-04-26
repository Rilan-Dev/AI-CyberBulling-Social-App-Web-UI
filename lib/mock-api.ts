// // Mock data for posts
// const mockPosts = [
//   {
//     id: "1",
//     user: {
//       id: "user1",
//       name: "John Doe",
//       username: "johndoe",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     content: "Just had a great day at the beach! 🏖️ #summer #vacation",
//     image: "/placeholder.svg?height=400&width=600",
//     likes: 42,
//     comments: 5,
//     timestamp: "2h ago",
//     status: "clean",
//   },
//   {
//     id: "2",
//     user: {
//       id: "user2",
//       name: "Jane Smith",
//       username: "janesmith",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     content: "Working on a new project. Can't wait to share it with you all!",
//     image: null,
//     likes: 24,
//     comments: 3,
//     timestamp: "4h ago",
//     status: "clean",
//   },
//   {
//     id: "3",
//     user: {
//       id: "user3",
//       name: "Alex Johnson",
//       username: "alexj",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     content: "This is a flagged post that contains potentially negative content.",
//     image: "/placeholder.svg?height=400&width=600",
//     likes: 15,
//     comments: 2,
//     timestamp: "6h ago",
//     status: "flagged",
//     reason: "Potentially negative content detected",
//   },
// ]

// // Mock user data
// export const mockCurrentUser = {
//   id: "current-user",
//   username: "currentuser",
//   email: "user@example.com",
//   first_name: "Current",
//   last_name: "User",
//   profile: {
//     bio: "This is a sample bio for the user profile.",
//     profile_picture: "/placeholder.svg?height=40&width=40",
//   },
// }

// // Mock API functions
// export const mockGetPosts = async () => {
//   // Simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 500))

//   // Ensure we're returning the array of mock posts
//   return [...mockPosts]
// }

// export const mockGetCurrentUser = async () => {
//   // Simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 300))
//   return mockCurrentUser
// }

// export const mockCreatePost = async (postData: any) => {
//   // Simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 500))

//   // Create a new post with mock data
//   const newPost = {
//     id: `post-${Date.now()}`,
//     user: {
//       id: "current-user",
//       name: "Current User",
//       username: "currentuser",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     content: postData.content || "",
//     image: postData.image || null,
//     likes: 0,
//     comments: 0,
//     timestamp: "Just now",
//     status: postData.status || "clean",
//     reason: postData.reason || null,
//   }

//   return newPost
// }

// export const mockLikePost = async (id: string) => {
//   // Simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 300))
//   return { status: "liked" }
// }

// export const mockAddComment = async (postId: string, content: string) => {
//   // Simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 300))
//   return {
//     id: `comment-${Date.now()}`,
//     post: postId,
//     user: {
//       id: "current-user",
//       name: "Current User",
//       username: "currentuser",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     content,
//     status: "clean",
//     timestamp: "Just now",
//   }
// }

// export const mockAnalyzeText = async (text: string) => {
//   // Simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 800))

//   // Simple text analysis logic
//   if (
//     text.toLowerCase().includes("hate") ||
//     text.toLowerCase().includes("stupid") ||
//     text.toLowerCase().includes("idiot")
//   ) {
//     return {
//       prediction: "blocked",
//       confidence: 0.92,
//       reason: "Detected hate speech and offensive language",
//     }
//   } else if (
//     text.toLowerCase().includes("dislike") ||
//     text.toLowerCase().includes("not good") ||
//     text.toLowerCase().includes("bad")
//   ) {
//     return {
//       prediction: "flagged",
//       confidence: 0.78,
//       reason: "Potentially negative content detected",
//     }
//   } else {
//     return {
//       prediction: "clean",
//       confidence: 0.95,
//       reason: null,
//     }
//   }
// }

// export const mockAnalyzeImage = async (image: File) => {
//   // Simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 1000))

//   // Random prediction for demo purposes
//   const random = Math.random()

//   if (random < 0.33) {
//     return {
//       prediction: "blocked",
//       confidence: 0.89,
//       reason: "Detected inappropriate imagery and potential harassment content",
//     }
//   } else if (random < 0.66) {
//     return {
//       prediction: "flagged",
//       confidence: 0.72,
//       reason: "Potentially concerning visual elements detected",
//     }
//   } else {
//     return {
//       prediction: "clean",
//       confidence: 0.94,
//       reason: null,
//     }
//   }
// }

// // Mock authentication functions
// export const mockLogin = async (username: string, password: string) => {
//   // Simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 800))

//   // Simple validation
//   if (username === "demo" && password === "password") {
//     return { success: true }
//   }

//   // For demo purposes, accept any non-empty credentials
//   if (username && password) {
//     return { success: true }
//   }

//   throw new Error("Invalid credentials")
// }

// export const mockRegister = async (userData: any) => {
//   // Simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 1000))

//   // Simple validation
//   if (!userData.username || !userData.email || !userData.password) {
//     throw new Error("Missing required fields")
//   }

//   return { success: true }
// }

// export const mockLogout = async () => {
//   // Simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   return { success: true }
// }
