import React, { useState } from 'react'
import { shareNative, copyToClipboard, createAppShareOptions, isWebShareSupported } from '@/lib/share'
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
  Heart,
  MessageCircle,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Smartphone
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ShareAppModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({
  isOpen,
  onClose
}) => {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const shareOptions = createAppShareOptions()
  const appUrl = window.location.origin

  const handleNativeShare = async () => {
    try {
      await shareNative(shareOptions)
      toast({
        title: "공유 완료",
        description: "Plantstagram이 성공적으로 공유되었습니다!",
      })
      onClose()
    } catch (error) {
      console.error('Native share failed:', error)
      handleCopyLink()
    }
  }

  const handleCopyLink = async () => {
    try {
      await copyToClipboard(appUrl)
      setCopied(true)
      toast({
        title: "링크 복사 완료",
        description: "Plantstagram 링크가 클립보드에 복사되었습니다!",
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
    const encodedUrl = encodeURIComponent(appUrl)
    const encodedText = encodeURIComponent(shareOptions.text)
    
    let shareUrl = ''
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`
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
        shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedText}`
        break
      case 'instagram':
        toast({
          title: "인스타그램 공유",
          description: "링크가 복사되었습니다. 인스타그램 스토리에서 붙여넣기 해주세요.",
        })
        handleCopyLink()
        return
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
    },
    {
      name: '인스타그램',
      icon: Instagram,
      key: 'instagram',
      color: 'hover:bg-pink-50 hover:text-pink-600'
    },
    {
      name: 'SMS',
      icon: Smartphone,
      key: 'sms',
      color: 'hover:bg-gray-50 hover:text-gray-600'
    }
  ]

  const handleSMSShare = () => {
    const message = `${shareOptions.text} ${appUrl}`
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`
    window.location.href = smsUrl
  }

  const customSocialShare = (platform: string) => {
    if (platform === 'sms') {
      handleSMSShare()
    } else {
      handleSocialShare(platform)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-pretendard flex items-center gap-2">
            <Share className="w-5 h-5" />
            Plantstagram 공유하기
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* App Preview */}
          <div className="text-center space-y-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="text-4xl">🌱</div>
            <div>
              <h3 className="font-semibold font-pretendard text-lg">Plantstagram Tales Unfold</h3>
              <p className="text-sm text-muted-foreground font-pretendard mt-1">
                식물들의 일상을 공유하는 특별한 공간
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span>식물 사랑</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span>소통</span>
              </div>
              <div className="flex items-center gap-1">
                <Share className="w-4 h-4 text-green-500" />
                <span>공유</span>
              </div>
            </div>
          </div>

          {/* Link Copy Section */}
          <div className="space-y-3">
            <Label className="font-pretendard">앱 링크</Label>
            <div className="flex gap-2">
              <Input
                value={appUrl}
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
              친구들과 공유하기
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
                    onClick={() => customSocialShare(platform.key)}
                    className={`font-pretendard ${platform.color} transition-colors`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {platform.name}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Share Message */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground font-pretendard">
              친구들과 함께 식물들의 특별한 이야기를 나눠보세요! 🌿
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
