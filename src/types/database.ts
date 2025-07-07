export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface PlantPost {
  id: string
  user_id: string
  title: string
  description: string | null
  image_url: string | null
  plant_type: string | null
  location: string | null
  created_at: string
  updated_at: string
  // Relations
  profiles?: Profile
  likes?: Like[]
  comments?: Comment[]
  _count?: {
    likes: number
    comments: number
  }
}

export interface Like {
  id: string
  user_id: string
  post_id: string
  created_at: string
  // Relations
  profiles?: Profile
}

export interface Comment {
  id: string
  user_id: string
  post_id: string
  content: string
  created_at: string
  updated_at: string
  // Relations
  profiles?: Profile
}

export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
  // Relations
  follower?: Profile
  following?: Profile
}

// API Response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number | null
  error: string | null
}
