import { supabase } from './supabase'
import { PlantPost, Profile, Like, Comment, ApiResponse, PaginatedResponse } from '@/types/database'

// Plant Posts API
export const plantPostsApi = {
  // Get all posts with pagination
  async getAll(page = 0, limit = 10): Promise<PaginatedResponse<PlantPost>> {
    try {
      const { data, error, count } = await supabase
        .from('plant_posts')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1)

      if (error) throw error

      return { data: data || [], count, error: null }
    } catch (error) {
      console.error('Error fetching posts:', error)
      return { data: [], count: null, error: (error as Error).message }
    }
  },

  // Get post by ID
  async getById(id: string): Promise<ApiResponse<PlantPost>> {
    try {
      const { data, error } = await supabase
        .from('plant_posts')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching post:', error)
      return { data: null, error: (error as Error).message }
    }
  },

  // Create new post
  async create(post: Omit<PlantPost, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<PlantPost>> {
    try {
      const { data, error } = await supabase
        .from('plant_posts')
        .insert([post])
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error creating post:', error)
      return { data: null, error: (error as Error).message }
    }
  },

  // Update post
  async update(id: string, updates: Partial<PlantPost>): Promise<ApiResponse<PlantPost>> {
    try {
      const { data, error } = await supabase
        .from('plant_posts')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error updating post:', error)
      return { data: null, error: (error as Error).message }
    }
  },

  // Delete post
  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('plant_posts')
        .delete()
        .eq('id', id)

      if (error) throw error

      return { data: true, error: null }
    } catch (error) {
      console.error('Error deleting post:', error)
      return { data: false, error: (error as Error).message }
    }
  }
}

// Likes API
export const likesApi = {
  // Toggle like
  async toggle(postId: string, userId: string): Promise<ApiResponse<boolean>> {
    try {
      // Check if like exists
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single()

      if (existingLike) {
        // Remove like
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId)

        if (error) throw error
        return { data: false, error: null } // unliked
      } else {
        // Add like
        const { error } = await supabase
          .from('likes')
          .insert([{ post_id: postId, user_id: userId }])

        if (error) throw error
        return { data: true, error: null } // liked
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      return { data: false, error: (error as Error).message }
    }
  },

  // Get likes count for post
  async getCount(postId: string): Promise<ApiResponse<number>> {
    try {
      const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)

      if (error) throw error

      return { data: count || 0, error: null }
    } catch (error) {
      console.error('Error getting likes count:', error)
      return { data: 0, error: (error as Error).message }
    }
  }
}

// Comments API
export const commentsApi = {
  // Get comments for post
  async getByPostId(postId: string): Promise<PaginatedResponse<Comment>> {
    try {
      const { data, error, count } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `, { count: 'exact' })
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (error) throw error

      return { data: data || [], count, error: null }
    } catch (error) {
      console.error('Error fetching comments:', error)
      return { data: [], count: null, error: (error as Error).message }
    }
  },

  // Create comment
  async create(comment: Omit<Comment, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Comment>> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([comment])
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error creating comment:', error)
      return { data: null, error: (error as Error).message }
    }
  },

  // Update comment
  async update(id: string, updates: { content: string }): Promise<ApiResponse<Comment>> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .update({
          content: updates.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error updating comment:', error)
      return { data: null, error: (error as Error).message }
    }
  },

  // Delete comment
  async delete(id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)

      if (error) throw error

      return { data: null, error: null }
    } catch (error) {
      console.error('Error deleting comment:', error)
      return { data: null, error: (error as Error).message }
    }
  }
}

// Profiles API
export const profilesApi = {
  // Get profile by user ID
  async getById(userId: string): Promise<ApiResponse<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching profile:', error)
      return { data: null, error: (error as Error).message }
    }
  },

  // Update profile
  async update(userId: string, updates: Partial<Profile>): Promise<ApiResponse<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select('*')
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { data: null, error: (error as Error).message }
    }
  }
}
