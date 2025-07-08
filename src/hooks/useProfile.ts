import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url?: string
  bio?: string
  location?: string
  website?: string
  created_at: string
  updated_at: string
}

export interface ProfileUpdateData {
  username?: string
  full_name?: string
  avatar_url?: string
  bio?: string
  location?: string
  website?: string
}

const QUERY_KEYS = {
  PROFILE: 'profile',
  USER_POSTS: 'userPosts',
  USER_STATS: 'userStats'
}

// Get user profile
export const useProfile = (userId?: string) => {
  const { user } = useAuth()
  const targetUserId = userId || user?.id

  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE, targetUserId],
    queryFn: async () => {
      if (!targetUserId) throw new Error('User ID is required')

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single()

      if (error) throw error
      return data as Profile
    },
    enabled: !!targetUserId
  })
}

// Update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (updates: ProfileUpdateData) => {
      if (!user?.id) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      return data as Profile
    },
    onSuccess: (data) => {
      // Update the profile cache
      queryClient.setQueryData([QUERY_KEYS.PROFILE, user?.id], data)
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] })
    }
  })
}

// Get user statistics
export const useUserStats = (userId?: string) => {
  const { user } = useAuth()
  const targetUserId = userId || user?.id

  return useQuery({
    queryKey: [QUERY_KEYS.USER_STATS, targetUserId],
    queryFn: async () => {
      if (!targetUserId) throw new Error('User ID is required')

      // Get posts count
      const { count: postsCount, error: postsError } = await supabase
        .from('plant_posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', targetUserId)

      if (postsError) throw postsError

      // Get total likes received
      const { data: likesData, error: likesError } = await supabase
        .from('plant_posts')
        .select('likes_count')
        .eq('user_id', targetUserId)

      if (likesError) throw likesError

      const totalLikes = likesData?.reduce((sum, post) => sum + (post.likes_count || 0), 0) || 0

      // Get total comments received
      const { data: commentsData, error: commentsError } = await supabase
        .from('plant_posts')
        .select('comments_count')
        .eq('user_id', targetUserId)

      if (commentsError) throw commentsError

      const totalComments = commentsData?.reduce((sum, post) => sum + (post.comments_count || 0), 0) || 0

      return {
        postsCount: postsCount || 0,
        totalLikes,
        totalComments
      }
    },
    enabled: !!targetUserId
  })
}

// Get user's posts
export const useUserPosts = (userId?: string) => {
  const { user } = useAuth()
  const targetUserId = userId || user?.id

  return useQuery({
    queryKey: [QUERY_KEYS.USER_POSTS, targetUserId],
    queryFn: async () => {
      if (!targetUserId) throw new Error('User ID is required')

      const { data, error } = await supabase
        .from('plant_posts')
        .select(`
          *,
          profiles:user_id(id, username, full_name, avatar_url)
        `)
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!targetUserId
  })
}

// Upload avatar
export const useUploadAvatar = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const updateProfile = useUpdateProfile()

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error('User not authenticated')

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('plant-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('plant-images')
        .getPublicUrl(filePath)

      // Update profile with new avatar URL
      await updateProfile.mutateAsync({ avatar_url: publicUrl })

      return publicUrl
    },
    onSuccess: () => {
      // Invalidate profile queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] })
    }
  })
}
