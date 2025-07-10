import React, { useState } from 'react'
import { PlantPost } from '@/types/database'
import { useUpdatePlantPost } from '@/hooks/usePlantPosts'
import { useAutoResize } from '@/hooks/useAutoResize'
import { PlantTypeSelector } from './PlantTypeSelector'
import { ImageUpload } from './ImageUpload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Loader2, Save, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface EditPostModalProps {
  post: PlantPost
  isOpen: boolean
  onClose: () => void
}

interface EditFormData {
  title: string
  description: string
  image_url: string
  plant_type: string
  location: string
}

export const EditPostModal: React.FC<EditPostModalProps> = ({
  post,
  isOpen,
  onClose
}) => {
  const { toast } = useToast()
  const updatePostMutation = useUpdatePlantPost()

  const [formData, setFormData] = useState<EditFormData>({
    title: post.title,
    description: post.description || '',
    image_url: post.image_url || '',
    plant_type: post.plant_type || '',
    location: post.location || ''
  })

  // Auto-resize textarea hook
  const { textareaRef } = useAutoResize({
    minHeight: 96, // min-h-24
    maxHeight: 200, // Maximum height before scrolling
    value: formData.description
  })

  const [errors, setErrors] = useState<Partial<EditFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<EditFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요'
    }
    if (!formData.description.trim()) {
      newErrors.description = '설명을 입력해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await updatePostMutation.mutateAsync({
        id: post.id,
        updates: formData
      })
      
      toast({
        title: "포스트 수정 완료",
        description: "포스트가 성공적으로 수정되었습니다!",
      })
      
      onClose()
    } catch (error) {
      console.error('Error updating post:', error)
      toast({
        title: "수정 실패",
        description: "포스트 수정 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof EditFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleClose = () => {
    if (isSubmitting) return
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-pretendard flex items-center gap-2">
            <span className="text-2xl">✏️</span>
            포스트 수정하기
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="font-pretendard text-base">식물 사진</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                onImageUploaded={(url) => handleInputChange('image_url', url)}
                onImageRemoved={() => handleInputChange('image_url', '')}
                currentImage={formData.image_url}
                disabled={isSubmitting}
              />
            </CardContent>
          </Card>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-title" className="font-pretendard">제목</Label>
            <Input
              id="edit-title"
              placeholder="포스트 제목을 입력하세요"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              disabled={isSubmitting}
              className="font-pretendard"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description" className="font-pretendard">설명</Label>
            <div className="w-full overflow-hidden">
              <Textarea
                ref={textareaRef}
                id="edit-description"
                placeholder="식물과 함께한 특별한 순간을 자세히 들려주세요..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={isSubmitting}
                className="font-pretendard w-full max-w-full box-border resize-none transition-all duration-200 ease-in-out"
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
                  minHeight: '96px',
                  height: '96px'
                }}
              />
            </div>
            {errors.description && (
              <p className="text-sm text-red-600 break-words">{errors.description}</p>
            )}
          </div>

          {/* Plant Type */}
          <div className="space-y-2">
            <Label className="font-pretendard">식물 종류 (선택사항)</Label>
            <PlantTypeSelector
              selectedType={formData.plant_type}
              onTypeSelect={(type) => handleInputChange('plant_type', type)}
              disabled={isSubmitting}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="edit-location" className="font-pretendard">위치 (선택사항)</Label>
            <Input
              id="edit-location"
              placeholder="예: 거실 창가, 베란다, 정원 등"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              disabled={isSubmitting}
              className="font-pretendard"
            />
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
              disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
              className="font-pretendard flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  수정 중...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  수정 완료
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
