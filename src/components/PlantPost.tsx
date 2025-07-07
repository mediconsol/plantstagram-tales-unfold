import React, { useState } from "react";
import { Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react";
import { PlantPost as PlantPostType } from "@/types/database";
import { useAuth } from "@/contexts/AuthContext";
import { useToggleLike, useLikesCount, useComments } from "@/hooks/usePlantPosts";
import { CommentSection } from "./CommentSection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface PlantPostProps {
  post: PlantPostType;
}

export const PlantPost = ({ post }: PlantPostProps) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { data: likesData } = useLikesCount(post.id);
  const { data: commentsData } = useComments(post.id);
  const toggleLikeMutation = useToggleLike();

  const likesCount = likesData?.data || 0;
  const commentsCount = commentsData?.count || 0;

  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ko,
  });

  const handleLike = () => {
    if (!user) return;
    setIsLiked(!isLiked); // Optimistic update
    toggleLikeMutation.mutate({ postId: post.id });
  };

  const extractHashtags = (text: string) => {
    const hashtags = text.match(/#[\w가-힣]+/g) || [];
    return hashtags.map(tag => tag.slice(1)); // Remove # symbol
  };

  const hashtags = post.description ? extractHashtags(post.description) : [];

  return (
    <div className="bg-card rounded-lg shadow-card overflow-hidden max-w-md mx-auto animate-fade-in-up">
      {/* Post Header */}
      <div className="flex items-center gap-3 p-4">
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={post.profiles?.avatar_url || undefined}
            alt={post.profiles?.username || 'User'}
          />
          <AvatarFallback className="bg-gradient-earth text-white">
            {post.profiles?.username?.[0]?.toUpperCase() || '🌱'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-pretendard font-medium text-foreground">
            {post.profiles?.username || '익명의 식물러버'}
          </h3>
          <p className="text-sm text-muted-foreground font-pretendard">{timeAgo}</p>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Post Image */}
      {post.image_url && (
        <div className="relative aspect-square overflow-hidden">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-4">
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
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors p-0"
          >
            <MessageCircle className={`w-6 h-6 ${showComments ? 'fill-current text-primary' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors p-0"
          >
            <Share className="w-6 h-6" />
          </Button>
        </div>

        {/* Likes */}
        <p className="font-pretendard font-medium text-foreground">
          좋아요 {likesCount.toLocaleString()}개
        </p>

        {/* Caption */}
        <div className="space-y-2">
          <p className="text-foreground">
            <span className="font-pretendard font-medium">
              {post.profiles?.username || '익명의 식물러버'}
            </span>{" "}
            <span className="font-pretendard">{post.title}</span>
          </p>
          {post.description && (
            <p className="font-pretendard text-sm text-muted-foreground">
              {post.description}
            </p>
          )}
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {hashtags.map((tag, index) => (
                <span key={index} className="text-primary font-pretendard text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {post.plant_type && (
            <p className="text-xs text-muted-foreground">
              🌿 {post.plant_type}
            </p>
          )}
          {post.location && (
            <p className="text-xs text-muted-foreground">
              📍 {post.location}
            </p>
          )}
        </div>

        {/* Comments Section */}
        <CommentSection
          postId={post.id}
          isOpen={showComments}
          onToggle={() => setShowComments(!showComments)}
        />
      </div>
    </div>
  );
};