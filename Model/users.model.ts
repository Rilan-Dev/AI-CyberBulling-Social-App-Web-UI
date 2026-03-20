export interface User {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
  }
  
  export interface UserProfile {
    id: number
    user: User
    bio: string | null
    profile_picture: string | null
    follower_count: number
    following_count: number
    post_count: number
    followers: User[]
    following: User[]
    is_following: boolean
    website: string | null
    location: string | null
    createdAt: string
    updatedAt: string
  }

  export interface AuthTokens {
    access: string
    refresh: string
  }
  
  export type UserModel = UserProfile
  