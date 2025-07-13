import React, { useState } from 'react'
import { PlantPost } from '@/types/database'
import { useComments, useLikesCount, useToggleLike } from '@/hooks/usePlantPosts'
import { useAuth } from '@/contexts/AuthContext'
import { getPlantTypeByName } from '@/data/plantTypes'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, MapPin, Calendar, X, Share } from 'lucide-react'
import { CommentSection } from '@/components/CommentSection'
import { ShareModal } from '@/components/ShareModal'

interface PostDetailModalProps {
  post: PlantPost | null
  isOpen: boolean
  onClose: () => void
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  isOpen,
  onClose
}) => {
  const { user } = useAuth()
  const { data: likesData } = useLikesCount(post?.id || '')
  const { data: commentsData } = useComments(post?.id || '')
  const toggleLikeMutation = useToggleLike()

  const [isLiked, setIsLiked] = useState(false)
  const [showComments, setShowComments] = useState(true)
  const [showShareModal, setShowShareModal] = useState(false)

  if (!post) return null

  // Safe data extraction with fallbacks
  const plantType = post.plant_type ? getPlantTypeByName(post.plant_type) : null
  const likesCount = likesData?.count || 0
  const commentsCount = commentsData?.count || commentsData?.length || 0
  const authorName = post.profiles?.username || '익명'
  const authorAvatar = post.profiles?.avatar_url || ''

  const handleLike = () => {
    if (!user) return
    setIsLiked(!isLiked)
    toggleLikeMutation.mutate({ postId: post.id })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative bg-black">
            <img
              src={post.image_url || '/placeholder.svg'}
              alt={post.title}
              className="w-full h-full object-cover min-h-[400px] md:min-h-[600px]"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content Section */}
          <div className="flex flex-col">
            {/* Header */}
            <DialogHeader className="p-6 pb-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={authorAvatar} />
                  <AvatarFallback className="bg-gradient-earth text-white">
                    {authorName[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <DialogTitle className="font-pretendard text-lg">
                    {authorName}
                  </DialogTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {formatDistanceToNow(new Date(post.created_at), { 
                      addSuffix: true, 
                      locale: ko 
                    })}
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* Post Content */}
            <div className="flex-1 p-6 space-y-4">
              {/* Title */}
              <h2 className="font-pretendard text-xl font-bold">{post.title}</h2>

              {/* Description */}
              {post.description && (
                <p className="font-pretendard text-muted-foreground whitespace-pre-wrap">
                  {post.description}
                </p>
              )}

              {/* Plant Type */}
              {post.plant_type && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">식물 종류:</span>
                  <Badge variant="secondary" className="font-pretendard">
                    {plantType?.emoji || '🌱'} {plantType?.name || post.plant_type}
                  </Badge>
                </div>
              )}

              {/* Location */}
              {post.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="font-pretendard">{post.location}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4 border-t">
                {/* Like Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  disabled={!user || toggleLikeMutation.isPending}
                  className={`flex items-center gap-2 transition-colors p-0 ${
                    isLiked
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-muted-foreground hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-pretendard">{likesCount}</span>
                </Button>

                {/* Comments Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors p-0"
                >
                  <MessageCircle className={`w-5 h-5 ${showComments ? 'fill-current text-primary' : ''}`} />
                  <span className="text-sm font-pretendard">{commentsCount}</span>
                </Button>

                {/* Share Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors p-0"
                >
                  <Share className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="border-t ml-6 mr-6">
                <CommentSection
                  postId={post.id}
                  isOpen={showComments}
                  onToggle={() => setShowComments(!showComments)}
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          post={post}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </Dialog>
  )
}
