import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useComments, useCreateComment } from '@/hooks/usePlantPosts'
import { Comment } from '@/types/database'
import { AI_PLANT_PERSONA_ID } from '@/lib/aiPlantPersona'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Send, MessageCircle, Sparkles } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

interface CommentSectionProps {
  postId: string
  isOpen: boolean
  onToggle: () => void
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  isOpen,
  onToggle
}) => {
  const { user } = useAuth()
  const { data: commentsData, isLoading } = useComments(postId)
  const createCommentMutation = useCreateComment()
  
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const comments = commentsData?.data || []
  const commentsCount = commentsData?.count || 0

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !newComment.trim()) return

    setIsSubmitting(true)

    try {
      await createCommentMutation.mutateAsync({
        post_id: postId,
        user_id: user.id,
        content: newComment.trim()
      })
      
      setNewComment('')
    } catch (error) {
      console.error('Error creating comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Comments Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="text-muted-foreground hover:text-foreground p-0 h-auto font-pretendard text-sm"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        {commentsCount > 0 ? `댓글 ${commentsCount}개` : '댓글 달기'}
        {isOpen ? ' 숨기기' : ' 보기'}
      </Button>

      {/* Comments Section */}
      {isOpen && (
        <div className="border-t border-border pt-4 space-y-4">
            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleSubmitComment} className="space-y-3">
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage 
                      src={user.user_metadata?.avatar_url} 
                      alt={user.user_metadata?.username || 'User'} 
                    />
                    <AvatarFallback className="text-xs">
                      {user.user_metadata?.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="댓글을 입력하세요..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      disabled={isSubmitting}
                      className="min-h-20 font-pretendard resize-none"
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        size="sm"
                        disabled={!newComment.trim() || isSubmitting}
                        className="font-pretendard"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4 mr-2" />
                        )}
                        {isSubmitting ? '작성 중...' : '댓글 작성'}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground font-pretendard text-sm">
                  댓글을 작성하려면 로그인이 필요합니다.
                </p>
              </div>
            )}

            {/* Comments List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-4">
                <div className="border-t border-border pt-4">
                  <h4 className="font-pretendard font-medium text-foreground mb-3">
                    댓글 {commentsCount}개
                  </h4>
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <CommentItem key={comment.id} comment={comment} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 border-t border-border">
                <p className="text-muted-foreground font-pretendard text-sm">
                  아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요! 💬
                </p>
              </div>
            )}
        </div>
      )}
    </div>
  )
}

// Individual Comment Component
interface CommentItemProps {
  comment: Comment
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: ko,
  })

  const isAIComment = comment.user_id === AI_PLANT_PERSONA_ID

  return (
    <div className={`flex gap-3 p-3 rounded-lg transition-colors ${
      isAIComment
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 hover:from-green-100 hover:to-emerald-100'
        : 'bg-muted/30 hover:bg-muted/50'
    }`}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage
          src={comment.profiles?.avatar_url}
          alt={comment.profiles?.username || 'User'}
        />
        <AvatarFallback className={`text-xs text-white ${
          isAIComment ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-earth'
        }`}>
          {isAIComment ? '🧚‍♀️' : comment.profiles?.username?.[0]?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-pretendard font-medium text-sm text-foreground">
            {comment.profiles?.username || '익명 사용자'}
          </span>
          {isAIComment && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-300">
              <Sparkles className="w-3 h-3 mr-1" />
              식물 요정
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {timeAgo}
          </span>
        </div>
        <p className={`font-pretendard text-sm leading-relaxed ${
          isAIComment ? 'text-green-800' : 'text-foreground'
        }`}>
          {comment.content}
        </p>
      </div>
    </div>
  )
}
