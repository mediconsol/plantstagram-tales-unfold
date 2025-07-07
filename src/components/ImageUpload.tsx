import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { uploadPlantImage, compressImage } from '@/lib/storage'
import { useAuth } from '@/contexts/AuthContext'

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  onImageRemoved: () => void
  currentImage?: string
  disabled?: boolean
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  onImageRemoved,
  currentImage,
  disabled = false
}) => {
  const { user } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setIsUploading(true)
    setError(null)

    try {
      // Compress image before upload
      const compressedFile = await compressImage(file)
      
      // Upload to Supabase Storage
      const { url, error: uploadError } = await uploadPlantImage(compressedFile, user.id)

      if (uploadError) {
        setError(uploadError)
      } else if (url) {
        onImageUploaded(url)
      }
    } catch (err) {
      setError('이미지 업로드 중 오류가 발생했습니다.')
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = () => {
    onImageRemoved()
    setError(null)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Upload area */}
      {!currentImage ? (
        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                {isUploading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-pretendard font-medium text-foreground">
                  식물 사진을 업로드하세요
                </h3>
                <p className="text-sm text-muted-foreground font-pretendard">
                  JPG, PNG 파일 (최대 5MB)
                </p>
              </div>

              <Button
                onClick={handleUploadClick}
                disabled={disabled || isUploading}
                className="font-pretendard"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? '업로드 중...' : '사진 선택'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Image preview */
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <img
                src={currentImage}
                alt="업로드된 식물 사진"
                className="w-full h-64 object-cover"
              />
              
              {/* Remove button */}
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
                disabled={disabled}
                className="absolute top-2 right-2"
              >
                <X className="w-4 h-4" />
              </Button>

              {/* Change button */}
              <Button
                variant="secondary"
                size="sm"
                onClick={handleUploadClick}
                disabled={disabled || isUploading}
                className="absolute bottom-2 right-2"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? '업로드 중...' : '사진 변경'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          {error}
        </div>
      )}

      {/* Upload tips */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• 식물의 아름다운 순간을 담아주세요</p>
        <p>• 밝고 선명한 사진이 더 많은 사랑을 받아요</p>
        <p>• 정사각형 비율로 자동 조정됩니다</p>
      </div>
    </div>
  )
}
