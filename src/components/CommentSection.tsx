import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useComments, useCreateComment, useUpdateComment, useDeleteComment } from '@/hooks/usePlantPosts'
import { Comment } from '@/types/database'
import { AI_PLANT_PERSONA_ID } from '@/lib/aiPlantPersona'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2, Send, MessageCircle, Sparkles, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
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
                      <CommentItem key={comment.id} comment={comment} postId={postId} />
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
  postId: string
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, postId }) => {
  const { user } = useAuth()
  const updateCommentMutation = useUpdateComment()
  const deleteCommentMutation = useDeleteComment()

  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: ko,
  })

  const isAIComment = comment.user_id === AI_PLANT_PERSONA_ID
  const isOwner = user?.id === comment.user_id
  const isUpdated = comment.updated_at !== comment.created_at

  const handleEdit = async () => {
    if (!editContent.trim()) return

    try {
      await updateCommentMutation.mutateAsync({
        id: comment.id,
        content: editContent.trim(),
        postId
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating comment:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteCommentMutation.mutateAsync({
        id: comment.id,
        postId
      })
      setShowDeleteDialog(false)
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditContent(comment.content)
    setIsEditing(false)
  }

  return (
    <>
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
          <div className="flex items-center justify-between">
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
                {isUpdated && ' (수정됨)'}
              </span>
            </div>

            {/* 본인 댓글에만 수정/삭제 메뉴 표시 */}
            {isOwner && !isAIComment && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    수정
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* 댓글 내용 또는 수정 폼 */}
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-20 font-pretendard resize-none"
                disabled={updateCommentMutation.isPending}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={updateCommentMutation.isPending}
                >
                  취소
                </Button>
                <Button
                  size="sm"
                  onClick={handleEdit}
                  disabled={updateCommentMutation.isPending || !editContent.trim()}
                >
                  {updateCommentMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  수정
                </Button>
              </div>
            </div>
          ) : (
            <p className={`font-pretendard text-sm leading-relaxed ${
              isAIComment ? 'text-green-800' : 'text-foreground'
            }`}>
              {comment.content}
            </p>
          )}
        </div>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>댓글 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 댓글을 삭제하시겠습니까? 삭제된 댓글은 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteCommentMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCommentMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
