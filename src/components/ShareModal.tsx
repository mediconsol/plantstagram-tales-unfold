import React, { useState } from 'react'
import { PlantPost } from '@/types/database'
import { 
  shareNative, 
  copyToClipboard, 
  getSocialShareUrls, 
  createPostShareOptions,
  isWebShareSupported 
} from '@/lib/share'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { 
  Share, 
  Copy, 
  Check, 
  X,
  MessageCircle,
  Mail,
  ExternalLink
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ShareModalProps {
  post: PlantPost
  isOpen: boolean
  onClose: () => void
}

export const ShareModal: React.FC<ShareModalProps> = ({
  post,
  isOpen,
  onClose
}) => {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  
  const shareOptions = createPostShareOptions(post)
  const socialUrls = getSocialShareUrls(shareOptions)

  const handleNativeShare = async () => {
    const success = await shareNative(shareOptions)
    if (success) {
      onClose()
      toast({
        title: "공유 완료",
        description: "포스트가 성공적으로 공유되었습니다!",
      })
    }
  }

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareOptions.url)
    if (success) {
      setCopied(true)
      toast({
        title: "링크 복사 완료",
        description: "링크가 클립보드에 복사되었습니다!",
      })
      setTimeout(() => setCopied(false), 2000)
    } else {
      toast({
        title: "복사 실패",
        description: "링크 복사에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive"
      })
    }
  }

  const handleSocialShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400')
    onClose()
  }

  const socialPlatforms = [
    {
      name: 'Twitter',
      icon: '🐦',
      url: socialUrls.twitter,
      color: 'hover:bg-blue-50 hover:text-blue-600'
    },
    {
      name: 'Facebook',
      icon: '📘',
      url: socialUrls.facebook,
      color: 'hover:bg-blue-50 hover:text-blue-700'
    },
    {
      name: 'KakaoTalk',
      icon: '💬',
      url: socialUrls.kakao,
      color: 'hover:bg-yellow-50 hover:text-yellow-600'
    },
    {
      name: 'LINE',
      icon: '💚',
      url: socialUrls.line,
      color: 'hover:bg-green-50 hover:text-green-600'
    },
    {
      name: 'Telegram',
      icon: '✈️',
      url: socialUrls.telegram,
      color: 'hover:bg-blue-50 hover:text-blue-500'
    },
    {
      name: 'WhatsApp',
      icon: '📱',
      url: socialUrls.whatsapp,
      color: 'hover:bg-green-50 hover:text-green-600'
    },
    {
      name: '이메일',
      icon: '📧',
      url: socialUrls.email,
      color: 'hover:bg-gray-50 hover:text-gray-600'
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-pretendard flex items-center gap-2">
            <Share className="w-5 h-5" />
            포스트 공유하기
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Post Preview */}
          <Card className="border-muted">
            <CardContent className="p-4">
              <div className="flex gap-3">
                {post.image_url && (
                  <img 
                    src={post.image_url} 
                    alt={post.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-pretendard font-medium text-sm text-foreground truncate">
                    {post.title}
                  </h3>
                  <p className="font-pretendard text-xs text-muted-foreground mt-1 line-clamp-2">
                    {post.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Native Share (Mobile) */}
          {isWebShareSupported() && (
            <Button 
              onClick={handleNativeShare}
              className="w-full font-pretendard"
              size="lg"
            >
              <Share className="w-4 h-4 mr-2" />
              공유하기
            </Button>
          )}

          {/* Copy Link */}
          <div className="space-y-2">
            <label className="font-pretendard text-sm font-medium text-foreground">
              링크 복사
            </label>
            <div className="flex gap-2">
              <Input 
                value={shareOptions.url}
                readOnly
                className="font-pretendard text-sm"
              />
              <Button 
                onClick={handleCopyLink}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Social Platforms */}
          <div className="space-y-3">
            <label className="font-pretendard text-sm font-medium text-foreground">
              소셜 미디어로 공유
            </label>
            <div className="grid grid-cols-2 gap-2">
              {socialPlatforms.map((platform) => (
                <Button
                  key={platform.name}
                  variant="outline"
                  onClick={() => handleSocialShare(platform.url)}
                  className={`font-pretendard justify-start ${platform.color} transition-colors`}
                >
                  <span className="text-lg mr-2">{platform.icon}</span>
                  {platform.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
