import React, { useState } from "react";
import { Heart, MessageCircle, Share, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { PlantPost as PlantPostType } from "@/types/database";
import { useAuth } from "@/contexts/AuthContext";
import { useToggleLike, useLikesCount, useComments, useDeletePlantPost } from "@/hooks/usePlantPosts";
import { getPlantTypeByName } from "@/data/plantTypes";
import { CommentSection } from "./CommentSection";
import { ShareModal } from "./ShareModal";
import { EditPostModal } from "./EditPostModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface PlantPostProps {
  post: PlantPostType;
}

export const PlantPost = ({ post }: PlantPostProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { data: likesData } = useLikesCount(post.id);
  const { data: commentsData } = useComments(post.id);
  const toggleLikeMutation = useToggleLike();
  const deletePostMutation = useDeletePlantPost();

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

  const handleDelete = async () => {
    try {
      await deletePostMutation.mutateAsync(post.id);
      toast({
        title: "포스트 삭제 완료",
        description: "포스트가 성공적으로 삭제되었습니다.",
      });
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "삭제 실패",
        description: "포스트 삭제 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    }
  };

  // Check if current user is the post owner
  const isOwner = user?.id === post.user_id;

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
        {isOwner ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setShowEditModal(true)}
                className="font-pretendard cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                수정하기
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="font-pretendard cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                삭제하기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="ghost" size="sm" disabled>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        )}
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
            onClick={() => setShowShareModal(true)}
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
              {getPlantTypeByName(post.plant_type)?.emoji || '🌿'} {post.plant_type}
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

      {/* Share Modal */}
      <ShareModal
        post={post}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      {/* Edit Modal */}
      {isOwner && (
        <EditPostModal
          post={post}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-pretendard">
              포스트를 삭제하시겠습니까?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-pretendard">
              이 작업은 되돌릴 수 없습니다. 포스트와 관련된 모든 댓글과 좋아요가 함께 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-pretendard">취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 font-pretendard"
              disabled={deletePostMutation.isPending}
            >
              {deletePostMutation.isPending ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};