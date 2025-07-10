import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useUpdateProfile, useUploadAvatar, Profile } from '@/hooks/useProfile'
import { useAutoResize } from '@/hooks/useAutoResize'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { Camera, Save, X, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  profile?: Profile
}

interface ProfileFormData {
  username: string
  full_name: string
  bio: string
  // location: string  // Temporarily disabled until DB schema is updated
  // website: string   // Temporarily disabled until DB schema is updated
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile
}) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const updateProfile = useUpdateProfile()
  const uploadAvatar = useUploadAvatar()

  const [formData, setFormData] = useState<ProfileFormData>({
    username: profile?.username || user?.user_metadata?.username || '',
    full_name: profile?.full_name || user?.user_metadata?.full_name || '',
    bio: profile?.bio || user?.user_metadata?.bio || ''
    // location: profile?.location || user?.user_metadata?.location || '',
    // website: profile?.website || user?.user_metadata?.website || ''
  })

  const [errors, setErrors] = useState<Partial<ProfileFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // Auto-resize textarea hook
  const { textareaRef } = useAutoResize({
    minHeight: 80, // min-h-20
    maxHeight: 120, // Maximum height for bio
    value: formData.bio
  })

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {}

    if (!formData.username.trim()) {
      newErrors.username = '사용자명을 입력해주세요'
    } else if (formData.username.length < 3) {
      newErrors.username = '사용자명은 3자 이상이어야 합니다'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = '사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다'
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = '이름을 입력해주세요'
    }

    // Temporarily disabled until DB schema is updated
    // if (formData.website && !formData.website.startsWith('http')) {
    //   newErrors.website = '웹사이트 URL은 http:// 또는 https://로 시작해야 합니다'
    // }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "파일 크기 초과",
          description: "프로필 사진은 5MB 이하여야 합니다.",
          variant: "destructive"
        })
        return
      }

      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Upload avatar first if changed
      if (avatarFile) {
        await uploadAvatar.mutateAsync(avatarFile)
      }

      // Update profile
      await updateProfile.mutateAsync(formData)
      
      toast({
        title: "프로필 업데이트 완료",
        description: "프로필이 성공적으로 업데이트되었습니다!",
      })
      
      onClose()
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "업데이트 실패",
        description: "프로필 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault() // 엔터키 기본 동작 방지
      // 다음 입력 필드(이름)로 포커스 이동
      const fullNameInput = document.getElementById('full_name') as HTMLInputElement
      if (fullNameInput) {
        fullNameInput.focus()
      }
    }
  }

  const handleFullNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault() // 엔터키 기본 동작 방지
      // 다음 입력 필드(소개)로 포커스 이동
      const bioTextarea = textareaRef.current
      if (bioTextarea) {
        bioTextarea.focus()
      }
    }
  }

  const handleClose = () => {
    if (isSubmitting) return
    setAvatarFile(null)
    setAvatarPreview(null)
    setErrors({})
    onClose()
  }

  const currentAvatarUrl = avatarPreview || profile?.avatar_url || user?.user_metadata?.avatar_url

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-pretendard flex items-center gap-2">
            <span className="text-2xl">✏️</span>
            프로필 편집
          </DialogTitle>
          <DialogDescription className="font-pretendard">
            프로필 정보를 수정하고 저장할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={currentAvatarUrl} alt="프로필 사진" />
                <AvatarFallback className="text-2xl bg-gradient-earth text-white">
                  {formData.username[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <label 
                htmlFor="avatar-upload"
                className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={isSubmitting}
              />
            </div>
            <p className="text-sm text-muted-foreground text-center font-pretendard">
              클릭해서 프로필 사진을 변경하세요<br />
              (JPG, PNG, 5MB 이하)
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="font-pretendard">사용자명 *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                onKeyDown={handleUsernameKeyDown}
                placeholder="사용자명을 입력하세요"
                disabled={isSubmitting}
                className="font-pretendard"
              />
              {errors.username && (
                <p className="text-sm text-red-600 font-pretendard">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name" className="font-pretendard">이름 *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                onKeyDown={handleFullNameKeyDown}
                placeholder="이름을 입력하세요"
                disabled={isSubmitting}
                className="font-pretendard"
              />
              {errors.full_name && (
                <p className="text-sm text-red-600 font-pretendard">{errors.full_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="font-pretendard">소개</Label>
              <div className="w-full overflow-hidden">
                <Textarea
                  ref={textareaRef}
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="자신을 소개해보세요"
                  disabled={isSubmitting}
                  className="font-pretendard w-full max-w-full box-border resize-none transition-all duration-200 ease-in-out"
                  maxLength={150}
                  style={{
                    maxWidth: '100%',
                    width: '100%',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    fontSize: '16px',
                    transform: 'scale(1)',
                    transformOrigin: 'top left',
                    zoom: '1',
                    minHeight: '80px',
                    height: '80px'
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground font-pretendard break-words">
                {formData.bio.length}/150자
              </p>
            </div>

            {/* Temporarily disabled until DB schema is updated */}
            {/*
            <div className="space-y-2">
              <Label htmlFor="location" className="font-pretendard">위치</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="예: 서울, 대한민국"
                disabled={isSubmitting}
                className="font-pretendard"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="font-pretendard">웹사이트</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://example.com"
                disabled={isSubmitting}
                className="font-pretendard"
              />
              {errors.website && (
                <p className="text-sm text-red-600 font-pretendard">{errors.website}</p>
              )}
            </div>
            */}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
              className="font-pretendard flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              취소
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || !formData.username.trim() || !formData.full_name.trim()}
              className="font-pretendard flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
