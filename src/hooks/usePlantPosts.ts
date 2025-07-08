import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { plantPostsApi, likesApi, commentsApi } from '@/lib/api'
import { PlantPost, Comment } from '@/types/database'
import { useAuth } from '@/contexts/AuthContext'
import { createAIComment } from '@/lib/aiPlantPersona'

// Query keys
export const QUERY_KEYS = {
  PLANT_POSTS: 'plant_posts',
  PLANT_POST: 'plant_post',
  LIKES_COUNT: 'likes_count',
  COMMENTS: 'comments',
} as const

// Get all plant posts
export const usePlantPosts = (page = 0, limit = 10) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PLANT_POSTS, page, limit],
    queryFn: () => plantPostsApi.getAll(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get single plant post
export const usePlantPost = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PLANT_POST, id],
    queryFn: () => plantPostsApi.getById(id),
    enabled: !!id,
  })
}

// Create plant post mutation
export const useCreatePlantPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: plantPostsApi.create,
    onSuccess: async (response) => {
      // Invalidate and refetch plant posts
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLANT_POSTS] })

      // Create AI comment after successful post creation
      if (response.data) {
        try {
          // Wait a bit for the post to be fully created
          setTimeout(async () => {
            await createAIComment(response.data!)
            // Invalidate comments for this post to show the new AI comment
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.COMMENTS, response.data!.id]
            })
          }, 2000) // 2 second delay for natural feel
        } catch (error) {
          console.error('Error creating AI comment:', error)
        }
      }
    },
  })
}

// Update plant post mutation
export const useUpdatePlantPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<PlantPost> }) =>
      plantPostsApi.update(id, updates),
    onSuccess: (data, variables) => {
      // Update specific post in cache
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLANT_POST, variables.id] })
      // Invalidate posts list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLANT_POSTS] })
    },
  })
}

// Delete plant post mutation
export const useDeletePlantPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: plantPostsApi.delete,
    onSuccess: () => {
      // Invalidate and refetch plant posts
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLANT_POSTS] })
    },
  })
}

// Get likes count
export const useLikesCount = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LIKES_COUNT, postId],
    queryFn: () => likesApi.getCount(postId),
    enabled: !!postId,
  })
}

// Toggle like mutation
export const useToggleLike = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => {
      if (!user) throw new Error('User not authenticated')
      return likesApi.toggle(postId, user.id)
    },
    onSuccess: (data, variables) => {
      // Invalidate likes count for this post
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.LIKES_COUNT, variables.postId] 
      })
    },
  })
}

// Get comments for post
export const useComments = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMENTS, postId],
    queryFn: () => commentsApi.getByPostId(postId),
    enabled: !!postId,
  })
}

// Create comment mutation
export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: commentsApi.create,
    onSuccess: (data, variables) => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMENTS, variables.post_id]
      })
    },
  })
}

// Update comment mutation
export const useUpdateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, content, postId }: { id: string; content: string; postId: string }) =>
      commentsApi.update(id, { content }),
    onSuccess: (data, variables) => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMENTS, variables.postId]
      })
    },
  })
}

// Delete comment mutation
export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, postId }: { id: string; postId: string }) =>
      commentsApi.delete(id),
    onSuccess: (data, variables) => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMENTS, variables.postId]
      })
    },
  })
}
