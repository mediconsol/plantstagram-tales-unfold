import { Heart, MessageCircle, Share } from "lucide-react";

interface PlantPostProps {
  username: string;
  image: string;
  caption: string;
  hashtags: string[];
  likes: number;
  timeAgo: string;
  profileEmoji: string;
}

export const PlantPost = ({ 
  username, 
  image, 
  caption, 
  hashtags, 
  likes, 
  timeAgo, 
  profileEmoji 
}: PlantPostProps) => {
  return (
    <div className="bg-card rounded-lg shadow-card overflow-hidden max-w-md mx-auto animate-fade-in-up">
      {/* Post Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 bg-gradient-earth rounded-full flex items-center justify-center text-xl">
          {profileEmoji}
        </div>
        <div className="flex-1">
          <h3 className="font-pretendard font-medium text-foreground">{username}</h3>
          <p className="text-sm text-muted-foreground font-pretendard">{timeAgo}</p>
        </div>
      </div>

      {/* Post Image */}
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={image} 
          alt={caption}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* Post Actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <Heart className="w-6 h-6" />
          </button>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <MessageCircle className="w-6 h-6" />
          </button>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <Share className="w-6 h-6" />
          </button>
        </div>

        {/* Likes */}
        <p className="font-pretendard font-medium text-foreground">좋아요 {likes.toLocaleString()}개</p>

        {/* Caption */}
        <div className="space-y-2">
          <p className="text-foreground">
            <span className="font-pretendard font-medium">{username}</span>{" "}
            <span className="font-pretendard">{caption}</span>
          </p>
          <div className="flex flex-wrap gap-1">
            {hashtags.map((tag, index) => (
              <span key={index} className="text-primary font-pretendard text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};