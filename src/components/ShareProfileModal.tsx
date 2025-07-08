import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Profile } from '@/hooks/useProfile'
import { shareNative, copyToClipboard, isWebShareSupported } from '@/lib/share'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  ExternalLink,
  MessageCircle,
  Send,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ShareProfileModalProps {
  isOpen: boolean
  onClose: () => void
  profile?: Profile
}

export const ShareProfileModal: React.FC<ShareProfileModalProps> = ({
  isOpen,
  onClose,
  profile
}) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const userInfo = {
    username: profile?.username || user?.user_metadata?.username || '사용자',
    fullName: profile?.full_name || user?.user_metadata?.full_name || '이름 없음',
    bio: profile?.bio || user?.user_metadata?.bio || ''
  }

  const profileUrl = `${window.location.origin}/profile`
  const shareText = `${userInfo.fullName}님의 Plantstagram 프로필을 확인해보세요! 🌱`
  const shareData = {
    title: `${userInfo.fullName} - Plantstagram`,
    text: shareText,
    url: profileUrl
  }

  const handleNativeShare = async () => {
    try {
      await shareNative(shareData)
      toast({
        title: "공유 완료",
        description: "프로필이 성공적으로 공유되었습니다!",
      })
    } catch (error) {
      console.error('Native share failed:', error)
      handleCopyLink()
    }
  }

  const handleCopyLink = async () => {
    try {
      await copyToClipboard(profileUrl)
      setCopied(true)
      toast({
        title: "링크 복사 완료",
        description: "프로필 링크가 클립보드에 복사되었습니다!",
      })
      
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "링크 복사 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(profileUrl)
    const encodedText = encodeURIComponent(shareText)
    
    let shareUrl = ''
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'kakao':
        // KakaoTalk sharing would require SDK integration
        toast({
          title: "카카오톡 공유",
          description: "링크가 복사되었습니다. 카카오톡에서 붙여넣기 해주세요.",
        })
        handleCopyLink()
        return
      case 'line':
        shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`
        break
      default:
        return
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  const socialPlatforms = [
    {
      name: 'Twitter',
      icon: Twitter,
      key: 'twitter',
      color: 'hover:bg-blue-50 hover:text-blue-600'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      key: 'facebook',
      color: 'hover:bg-blue-50 hover:text-blue-700'
    },
    {
      name: '카카오톡',
      icon: MessageCircle,
      key: 'kakao',
      color: 'hover:bg-yellow-50 hover:text-yellow-600'
    },
    {
      name: 'LINE',
      icon: Send,
      key: 'line',
      color: 'hover:bg-green-50 hover:text-green-600'
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-pretendard flex items-center gap-2">
            <Share className="w-5 h-5" />
            프로필 공유하기
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Preview */}
          <div className="text-center space-y-2">
            <h3 className="font-semibold font-pretendard">{userInfo.fullName}</h3>
            <p className="text-sm text-muted-foreground font-pretendard">@{userInfo.username}</p>
            {userInfo.bio && (
              <p className="text-sm text-muted-foreground font-pretendard">{userInfo.bio}</p>
            )}
          </div>

          {/* Link Copy Section */}
          <div className="space-y-3">
            <Label className="font-pretendard">프로필 링크</Label>
            <div className="flex gap-2">
              <Input
                value={profileUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Native Share Button */}
          {isWebShareSupported() && (
            <Button
              onClick={handleNativeShare}
              className="w-full font-pretendard"
            >
              <Share className="w-4 h-4 mr-2" />
              공유하기
            </Button>
          )}

          {/* Social Media Buttons */}
          <div className="space-y-3">
            <Label className="font-pretendard">소셜 미디어로 공유</Label>
            <div className="grid grid-cols-2 gap-2">
              {socialPlatforms.map((platform) => {
                const IconComponent = platform.icon
                return (
                  <Button
                    key={platform.key}
                    variant="outline"
                    onClick={() => handleSocialShare(platform.key)}
                    className={`font-pretendard ${platform.color} transition-colors`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {platform.name}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* QR Code Section (Future Enhancement) */}
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-muted-foreground font-pretendard">
              프로필을 공유해서 더 많은 식물 친구들과 소통해보세요! 🌱
            </p>
          </div>

          {/* Close Button */}
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full font-pretendard"
          >
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
