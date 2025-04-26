export const apiDocs = {
  authentication: [
    {
      method: "POST",
      path: "/api/users/register/",
      description: "Register a new user",
      authentication: false,
      request: {
        contentType: "application/json",
        body: {
          username: "testuser",
          email: "test@example.com",
          password: "password123",
          password2: "password123",
          first_name: "Test",
          last_name: "User",
        },
      },
      response: {
        status: "201 Created",
        body: {
          user: {
            id: 1,
            username: "testuser",
            email: "test@example.com",
            first_name: "Test",
            last_name: "User",
          },
          refresh: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
          access: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        },
      },
      errors: [
        {
          status: "400 Bad Request",
          title: "Validation Error",
          description: "Username already exists, passwords don't match, or invalid email format",
        },
      ],
    },
    {
      method: "POST",
      path: "/api/token/",
      description: "Get JWT token for authentication",
      authentication: false,
      request: {
        contentType: "application/json",
        body: {
          username: "testuser",
          password: "password123",
        },
      },
      response: {
        status: "200 OK",
        body: {
          refresh: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
          access: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        },
      },
      errors: [
        {
          status: "401 Unauthorized",
          title: "Invalid Credentials",
          description: "No active account found with the given credentials",
        },
      ],
    },
    {
      method: "POST",
      path: "/api/token/refresh/",
      description: "Refresh JWT token",
      authentication: false,
      request: {
        contentType: "application/json",
        body: {
          refresh: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        },
      },
      response: {
        status: "200 OK",
        body: {
          access: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        },
      },
      errors: [
        {
          status: "401 Unauthorized",
          title: "Invalid Token",
          description: "Token is invalid or expired",
        },
      ],
    },
    {
      method: "POST",
      path: "/api/token/verify/",
      description: "Verify JWT token",
      authentication: false,
      request: {
        contentType: "application/json",
        body: {
          token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        },
      },
      response: {
        status: "200 OK",
        body: {},
      },
      errors: [
        {
          status: "401 Unauthorized",
          title: "Invalid Token",
          description: "Token is invalid or expired",
        },
      ],
    },
  ],
  posts: [
    {
      method: "GET",
      path: "/api/posts",
      description: "Get all posts",
      authentication: false,
      request: {},
      response: {
        status: "200 OK",
        body: [
          {
            id: 1,
            user: {
              id: 1,
              username: "testuser",
              email: "test@example.com",
              first_name: "Test",
              last_name: "User",
            },
            content: "This is a test post",
            image: "http://localhost:8000/media/post_images/test_image.jpg",
            status: "clean",
            reason: null,
            confidence: 0.95,
            like_count: 0,
            is_liked: false,
            comments: [],
            created_at: "2023-04-15T12:34:56.789Z",
            text_analysis: {
              success: true,
              prediction: "not_cyberbullying",
              status: "clean",
              confidence: 0.95,
              reason: null,
              processed_text: "this is a test post",
            },
            image_analysis: {
              success: true,
              prediction: "Non_Offensive",
              status: "clean",
              confidence: 0.95,
              reason: null,
              filename: "test_image.jpg",
            },
          },
        ],
      },
      errors: [],
    },
    {
      method: "POST",
      path: "/api/posts",
      description: "Create a new post",
      authentication: true,
      request: {
        contentType: "multipart/form-data",
        body: {
          content: "This is a test post",
          image: "[FILE]",
        },
      },
      response: {
        status: "201 Created",
        body: {
          id: 1,
          user: {
            id: 1,
            username: "testuser",
            email: "test@example.com",
            first_name: "Test",
            last_name: "User",
          },
          content: "This is a test post",
          image: "http://localhost:8000/media/post_images/test_image.jpg",
          status: "clean",
          reason: null,
          confidence: 0.95,
          like_count: 0,
          is_liked: false,
          comments: [],
          created_at: "2023-04-15T12:34:56.789Z",
          text_analysis: {
            success: true,
            prediction: "not_cyberbullying",
            status: "clean",
            confidence: 0.95,
            reason: null,
            processed_text: "this is a test post",
          },
          image_analysis: {
            success: true,
            prediction: "Non_Offensive",
            status: "clean",
            confidence: 0.95,
            reason: null,
            filename: "test_image.jpg",
          },
        },
      },
      errors: [
        {
          status: "400 Bad Request",
          title: "Validation Error",
          description: "Image is required",
        },
        {
          status: "401 Unauthorized",
          title: "Authentication Error",
          description: "Authentication credentials were not provided",
        },
      ],
      notes:
        "The image field is required. The content field is optional. The post will be analyzed for cyberbullying content and the status will be set accordingly.",
    },
    {
      method: "GET",
      path: "/api/posts/{id}",
      description: "Get a specific post",
      authentication: false,
      request: {
        params: {
          id: {
            description: "The ID of the post",
            required: true,
          },
        },
      },
      response: {
        status: "200 OK",
        body: {
          id: 1,
          user: {
            id: 1,
            username: "testuser",
            email: "test@example.com",
            first_name: "Test",
            last_name: "User",
          },
          content: "This is a test post",
          image: "http://localhost:8000/media/post_images/test_image.jpg",
          status: "clean",
          reason: null,
          confidence: 0.95,
          like_count: 0,
          is_liked: false,
          comments: [],
          created_at: "2023-04-15T12:34:56.789Z",
          text_analysis: {
            success: true,
            prediction: "not_cyberbullying",
            status: "clean",
            confidence: 0.95,
            reason: null,
            processed_text: "this is a test post",
          },
          image_analysis: {
            success: true,
            prediction: "Non_Offensive",
            status: "clean",
            confidence: 0.95,
            reason: null,
            filename: "test_image.jpg",
          },
        },
      },
      errors: [
        {
          status: "404 Not Found",
          title: "Not Found",
          description: "Post with the specified ID does not exist",
        },
      ],
    },
    {
      method: "PUT",
      path: "/api/posts/{id}",
      description: "Update a post",
      authentication: true,
      request: {
        contentType: "multipart/form-data",
        params: {
          id: {
            description: "The ID of the post",
            required: true,
          },
        },
        body: {
          content: "This is an updated post",
          image: "[FILE]",
        },
      },
      response: {
        status: "200 OK",
        body: {
          id: 1,
          user: {
            id: 1,
            username: "testuser",
            email: "test@example.com",
            first_name: "Test",
            last_name: "User",
          },
          content: "This is an updated post",
          image: "http://localhost:8000/media/post_images/test_image.jpg",
          status: "clean",
          reason: null,
          confidence: 0.95,
          like_count: 0,
          is_liked: false,
          comments: [],
          created_at: "2023-04-15T12:34:56.789Z",
          text_analysis: {
            success: true,
            prediction: "not_cyberbullying",
            status: "clean",
            confidence: 0.95,
            reason: null,
            processed_text: "this is an updated post",
          },
          image_analysis: {
            success: true,
            prediction: "Non_Offensive",
            status: "clean",
            confidence: 0.95,
            reason: null,
            filename: "test_image.jpg",
          },
        },
      },
      errors: [
        {
          status: "400 Bad Request",
          title: "Validation Error",
          description: "Image is required",
        },
        {
          status: "401 Unauthorized",
          title: "Authentication Error",
          description: "Authentication credentials were not provided",
        },
        {
          status: "403 Forbidden",
          title: "Permission Error",
          description: "You do not have permission to update this post",
        },
        {
          status: "404 Not Found",
          title: "Not Found",
          description: "Post with the specified ID does not exist",
        },
      ],
      notes:
        "The image field is required for full updates. The content field is optional. The post will be re-analyzed for cyberbullying content and the status will be updated accordingly.",
    },
    {
      method: "PATCH",
      path: "/api/posts/{id}",
      description: "Partially update a post",
      authentication: true,
      request: {
        contentType: "multipart/form-data",
        params: {
          id: {
            description: "The ID of the post",
            required: true,
          },
        },
        body: {
          content: "This is a partially updated post",
        },
      },
      response: {
        status: "200 OK",
        body: {
          id: 1,
          user: {
            id: 1,
            username: "testuser",
            email: "test@example.com",
            first_name: "Test",
            last_name: "User",
          },
          content: "This is a partially updated post",
          image: "http://localhost:8000/media/post_images/test_image.jpg",
          status: "clean",
          reason: null,
          confidence: 0.95,
          like_count: 0,
          is_liked: false,
          comments: [],
          created_at: "2023-04-15T12:34:56.789Z",
          text_analysis: {
            success: true,
            prediction: "not_cyberbullying",
            status: "clean",
            confidence: 0.95,
            reason: null,
            processed_text: "this is a partially updated post",
          },
          image_analysis: {
            success: true,
            prediction: "Non_Offensive",
            status: "clean",
            confidence: 0.95,
            reason: null,
            filename: "test_image.jpg",
          },
        },
      },
      errors: [
        {
          status: "401 Unauthorized",
          title: "Authentication Error",
          description: "Authentication credentials were not provided",
        },
        {
          status: "403 Forbidden",
          title: "Permission Error",
          description: "You do not have permission to update this post",
        },
        {
          status: "404 Not Found",
          title: "Not Found",
          description: "Post with the specified ID does not exist",
        },
      ],
      notes:
        "For partial updates, the image field is optional. If content is updated, it will be re-analyzed for cyberbullying content and the status will be updated accordingly.",
    },
    {
      method: "DELETE",
      path: "/api/posts/{id}",
      description: "Delete a post",
      authentication: true,
      request: {
        params: {
          id: {
            description: "The ID of the post",
            required: true,
          },
        },
      },
      response: {
        status: "204 No Content",
        body: {},
      },
      errors: [
        {
          status: "401 Unauthorized",
          title: "Authentication Error",
          description: "Authentication credentials were not provided",
        },
        {
          status: "403 Forbidden",
          title: "Permission Error",
          description: "You do not have permission to delete this post",
        },
        {
          status: "404 Not Found",
          title: "Not Found",
          description: "Post with the specified ID does not exist",
        },
      ],
    },
    {
      method: "POST",
      path: "/api/posts/{id}/like",
      description: "Like or unlike a post",
      authentication: true,
      request: {
        params: {
          id: {
            description: "The ID of the post",
            required: true,
          },
        },
      },
      response: {
        status: "200 OK",
        body: {
          status: "liked", // or 'unliked'
        },
      },
      errors: [
        {
          status: "401 Unauthorized",
          title: "Authentication Error",
          description: "Authentication credentials were not provided",
        },
        {
          status: "404 Not Found",
          title: "Not Found",
          description: "Post with the specified ID does not exist",
        },
      ],
      notes:
        "This endpoint toggles the like status. If the post is already liked by the user, it will be unliked, and vice versa.",
    },
  ],
  comments: [
    {
      method: "GET",
      path: "/api/comments",
      description: "Get all comments",
      authentication: false,
      request: {
        params: {
          post_id: {
            description: "Filter comments by post ID",
            required: false,
          },
        },
      },
      response: {
        status: "200 OK",
        body: [
          {
            id: 1,
            post: 1,
            user: {
              id: 1,
              username: "testuser",
              email: "test@example.com",
              first_name: "Test",
              last_name: "User",
            },
            content: "This is a test comment",
            status: "clean",
            reason: null,
            confidence: 0.95,
            created_at: "2023-04-15T12:34:56.789Z",
          },
        ],
      },
      errors: [],
    },
    {
      method: "POST",
      path: "/api/comments",
      description: "Create a new comment",
      authentication: true,
      request: {
        contentType: "application/json",
        body: {
          post: 1,
          content: "This is a test comment",
        },
      },
      response: {
        status: "201 Created",
        body: {
          id: 1,
          post: 1,
          user: {
            id: 1,
            username: "testuser",
            email: "test@example.com",
            first_name: "Test",
            last_name: "User",
          },
          content: "This is a test comment",
          status: "clean",
          reason: null,
          confidence: 0.95,
          created_at: "2023-04-15T12:34:56.789Z",
        },
      },
      errors: [
        {
          status: "400 Bad Request",
          title: "Validation Error",
          description: "Post ID and content are required",
        },
        {
          status: "401 Unauthorized",
          title: "Authentication Error",
          description: "Authentication credentials were not provided",
        },
        {
          status: "404 Not Found",
          title: "Not Found",
          description: "Post with the specified ID does not exist",
        },
      ],
      notes: "The comment will be analyzed for cyberbullying content and the status will be set accordingly.",
    },
    {
      method: "GET",
      path: "/api/comments/{id}",
      description: "Get a specific comment",
      authentication: false,
      request: {
        params: {
          id: {
            description: "The ID of the comment",
            required: true,
          },
        },
      },
      response: {
        status: "200 OK",
        body: {
          id: 1,
          post: 1,
          user: {
            id: 1,
            username: "testuser",
            email: "test@example.com",
            first_name: "Test",
            last_name: "User",
          },
          content: "This is a test comment",
          status: "clean",
          reason: null,
          confidence: 0.95,
          created_at: "2023-04-15T12:34:56.789Z",
        },
      },
      errors: [
        {
          status: "404 Not Found",
          title: "Not Found",
          description: "Comment with the specified ID does not exist",
        },
      ],
    },
    {
      method: "PUT",
      path: "/api/comments/{id}",
      description: "Update a comment",
      authentication: true,
      request: {
        contentType: "application/json",
        params: {
          id: {
            description: "The ID of the comment",
            required: true,
          },
        },
        body: {
          content: "This is an updated comment",
        },
      },
      response: {
        status: "200 OK",
        body: {
          id: 1,
          post: 1,
          user: {
            id: 1,
            username: "testuser",
            email: "test@example.com",
            first_name: "Test",
            last_name: "User",
          },
          content: "This is an updated comment",
          status: "clean",
          reason: null,
          confidence: 0.95,
          created_at: "2023-04-15T12:34:56.789Z",
        },
      },
      errors: [
        {
          status: "400 Bad Request",
          title: "Validation Error",
          description: "Content is required",
        },
        {
          status: "401 Unauthorized",
          title: "Authentication Error",
          description: "Authentication credentials were not provided",
        },
        {
          status: "403 Forbidden",
          title: "Permission Error",
          description: "You do not have permission to update this comment",
        },
        {
          status: "404 Not Found",
          title: "Not Found",
          description: "Comment with the specified ID does not exist",
        },
      ],
      notes: "The comment will be re-analyzed for cyberbullying content and the status will be updated accordingly.",
    },
    {
      method: "DELETE",
      path: "/api/comments/{id}",
      description: "Delete a comment",
      authentication: true,
      request: {
        params: {
          id: {
            description: "The ID of the comment",
            required: true,
          },
        },
      },
      response: {
        status: "204 No Content",
        body: {},
      },
      errors: [
        {
          status: "401 Unauthorized",
          title: "Authentication Error",
          description: "Authentication credentials were not provided",
        },
        {
          status: "403 Forbidden",
          title: "Permission Error",
          description: "You do not have permission to delete this comment",
        },
        {
          status: "404 Not Found",
          title: "Not Found",
          description: "Comment with the specified ID does not exist",
        },
      ],
    },
  ],
  analysis: [
    {
      method: "POST",
      path: "/api/analyze-text",
      description: "Analyze text for cyberbullying content",
      authentication: false,
      request: {
        contentType: "application/json",
        body: {
          text: "This is a test text for analysis",
        },
      },
      response: {
        status: "200 OK",
        body: {
          success: true,
          status: "clean", // or 'flagged', 'blocked'
          prediction: "not_cyberbullying", // or 'age', 'ethnicity', 'religion'
          confidence: 0.95,
          reason: null,
          processed_text: "this is a test text for analysis",
        },
      },
      errors: [
        {
          status: "400 Bad Request",
          title: "Validation Error",
          description: "Text is required",
        },
      ],
      notes:
        "The text will be analyzed for cyberbullying content and the status will be set accordingly. The prediction field indicates the specific type of content detected.",
    },
    {
      method: "POST",
      path: "/api/analyze-image",
      description: "Analyze image for cyberbullying content",
      authentication: false,
      request: {
        contentType: "multipart/form-data",
        body: {
          image: "[FILE]",
        },
      },
      response: {
        status: "200 OK",
        body: {
          success: true,
          prediction: "Non_Offensive", // or 'humour', 'negative', 'offensive', 'NSFW_Content'
          status: "clean", // or 'flagged', 'blocked'
          confidence: 0.95,
          reason: null,
          filename: "test_image.jpg",
        },
      },
      errors: [
        {
          status: "400 Bad Request",
          title: "Validation Error",
          description: "Image is required",
        },
      ],
      notes:
        "The image will be analyzed for cyberbullying content and the status will be set accordingly. The prediction field indicates the specific type of content detected.",
    },
  ],
  users: [
    {
      method: "GET",
      path: "/api/users/me/",
      description: "Get current user information",
      authentication: true,
      request: {},
      response: {
        status: "200 OK",
        body: {
          id: 1,
          user: {
            id: 1,
            username: "testuser",
            email: "test@example.com",
            first_name: "Test",
            last_name: "User",
          },
          bio: "This is a sample bio",
          profile_picture: "http://localhost:8000/media/profile_pics/test_image.jpg",
          follower_count: 0,
          following_count: 0,
          created_at: "2023-04-15T12:34:56.789Z",
          updated_at: "2023-04-15T12:34:56.789Z",
        },
      },
      errors: [
        {
          status: "401 Unauthorized",
          title: "Authentication Error",
          description: "Authentication credentials were not provided",
        },
      ],
    },
    {
      method: "PUT",
      path: "/api/users/me/",
      description: "Update current user profile",
      authentication: true,
      request: {
        contentType: "multipart/form-data",
        body: {
          bio: "This is an updated bio",
          profile_picture: "[FILE]",
        },
      },
      response: {
        status: "200 OK",
        body: {
          id: 1,
          user: {
            id: 1,
            username: "testuser",
            email: "test@example.com",
            first_name: "Test",
            last_name: "User",
          },
          bio: "This is an updated bio",
          profile_picture: "http://localhost:8000/media/profile_pics/test_image.jpg",
          follower_count: 0,
          following_count: 0,
          created_at: "2023-04-15T12:34:56.789Z",
          updated_at: "2023-04-15T12:34:56.789Z",
        },
      },
      errors: [
        {
          status: "401 Unauthorized",
          title: "Authentication Error",
          description: "Authentication credentials were not provided",
        },
      ],
    },
    {
      method: "GET",
      path: "/api/users/{username}/",
      description: "Get public user profile",
      authentication: false,
      request: {
        params: {
          username: {
            description: "The username of the user",
            required: true,
          },
        },
      },
      response: {
        status: "200 OK",
        body: {
          id: 1,
          user: {
            id: 1,
            username: "testuser",
            email: "test@example.com",
            first_name: "Test",
            last_name: "User",
          },
          bio: "This is a sample bio",
          profile_picture: "http://localhost:8000/media/profile_pics/test_image.jpg",
          follower_count: 0,
          following_count: 0,
          post_count: 5,
          is_following: false,
          created_at: "2023-04-15T12:34:56.789Z",
          updated_at: "2023-04-15T12:34:56.789Z",
        },
      },
      errors: [
        {
          status: "404 Not Found",
          title: "Not Found",
          description: "User with the specified username does not exist",
        },
      ],
    },
  ],
}
