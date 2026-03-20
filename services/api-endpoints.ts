export const API_PATHS = {
  // Authentication
  LOGIN: 'token/',
  REFRESH_TOKEN: 'token/refresh/',
  REGISTER: 'users/register/',
  
  // User endpoints
  CURRENT_USER: 'users/me/',
  USER_PROFILE: (username: string) => `users/${username}/`,
  USER_FOLLOW: (username: string) => `users/${username}/follow/`,
  USER_UNFOLLOW: (username: string) => `users/${username}/unfollow/`,
  USER_FOLLOWERS: (username: string) => `users/${username}/followers/`,
  USER_FOLLOWING: (username: string) => `users/${username}/following/`,
  USER_POSTS: (username: string) => `users/${username}/posts/`,
  USER_SEARCH: 'users/search/',
  
  // Post endpoints
  POSTS: 'posts',
  POST_DELETE: `posts`,
  POST_EDIT: (id: number) => `posts/${id}`,
  POST_LIKE: (id: number) => `posts/${id}/like`,
  POST_LIKES: (id: number) => `posts/${id}/likes`,
  
  // Comment endpoints
  COMMENTS: 'comments',
  POST_COMMENTS: (postId: number) => `comments?post_id=${postId}`,
  
  // Feed
  FEED: 'feed/',
  
  // Analysis
  ANALYZE_TEXT: 'analyze-text/',
  ANALYZE_IMAGE: 'analyze-image/',
  TEXT_ANALYSIS_HISTORY: 'history/text/',
  IMAGE_ANALYSIS_HISTORY: 'history/image/',
};
