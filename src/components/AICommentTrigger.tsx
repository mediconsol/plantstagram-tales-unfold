import React, { useState } from 'react'
import { PlantPost } from '@/types/database'
import { createAIComment, hasAICommented } from '@/lib/aiPlantPersona'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/hooks/usePlantPosts'

interface AICommentTriggerProps {
  post: PlantPost
  className?: string
}

export const AICommentTrigger: React.FC<AICommentTriggerProps> = ({ 
  post, 
  className = '' 
}) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [hasCommented, setHasCommented] = useState(false)

  React.useEffect(() => {
    // Check if AI has already commented
    const checkAIComment = async () => {
      const commented = await hasAICommented(post.id)
      setHasCommented(commented)
    }
    checkAIComment()
  }, [post.id])

  const handleTriggerAI = async () => {
    if (hasCommented) return

    setIsLoading(true)
    
    try {
      const success = await createAIComment(post)
      
      if (success) {
        setHasCommented(true)
        toast({
          title: "식물 요정이 댓글을 남겼어요! 🧚‍♀️",
          description: "따뜻한 마음을 담은 댓글을 확인해보세요.",
        })
        
        // Invalidate comments to show the new AI comment
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.COMMENTS, post.id] 
        })
      } else {
        toast({
          title: "댓글 작성 실패",
          description: "식물 요정이 바쁜가봐요. 잠시 후 다시 시도해주세요.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error triggering AI comment:', error)
      toast({
        title: "오류 발생",
        description: "댓글 작성 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (hasCommented) {
    return null // Don't show button if AI has already commented
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleTriggerAI}
      disabled={isLoading}
      className={`font-pretendard text-green-600 border-green-300 hover:bg-green-50 ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Sparkles className="w-4 h-4 mr-2" />
      )}
      {isLoading ? '식물 요정 호출 중...' : '식물 요정 부르기'}
    </Button>
  )
}
