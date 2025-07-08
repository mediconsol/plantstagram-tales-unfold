import React, { useState } from "react";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCreatePlantPost } from "@/hooks/usePlantPosts";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { SEOHead, SEOPresets } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ImageUpload } from "@/components/ImageUpload";
import { PlantTypeSelector } from "@/components/PlantTypeSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PostFormData {
  title: string
  description: string
  image_url: string
  plant_type: string
  location: string
}

export default function CreatePlantDay() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const createPostMutation = useCreatePlantPost()

  // Scroll to top when page loads
  useScrollToTop()

  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    description: '',
    image_url: '',
    plant_type: '',
    location: ''
  })
  const [errors, setErrors] = useState<Partial<PostFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])



  const validateForm = (): boolean => {
    const newErrors: Partial<PostFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요'
    }
    if (!formData.description.trim()) {
      newErrors.description = '설명을 입력해주세요'
    }
    if (!formData.image_url) {
      newErrors.image_url = '이미지를 업로드해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !validateForm()) return

    setIsSubmitting(true)

    try {
      const postData = {
        ...formData,
        user_id: user.id
      }

      await createPostMutation.mutateAsync(postData)

      // Success - redirect to home
      navigate('/')
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof PostFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <SEOHead {...SEOPresets.create} />
      <Header />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 pt-16 md:pt-20 flex-1 max-w-full min-h-0">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="shrink-0">
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">돌아가기</span>
              <span className="sm:hidden">뒤로</span>
            </Button>
          </Link>
          <h1 className="font-pretendard text-xl sm:text-2xl md:text-3xl font-bold text-foreground truncate">
            새 포스트 작성 🌱
          </h1>
        </div>

        {/* Success Message */}
        {createPostMutation.isSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              포스트가 성공적으로 작성되었습니다! 🎉
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {createPostMutation.isError && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              포스트 작성 중 오류가 발생했습니다. 다시 시도해주세요.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4 sm:space-y-6 w-full">
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="font-pretendard">식물 사진</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                onImageUploaded={(url) => handleInputChange('image_url', url)}
                onImageRemoved={() => handleInputChange('image_url', '')}
                currentImage={formData.image_url}
                disabled={isSubmitting}
              />
              {errors.image_url && (
                <p className="text-sm text-red-600 mt-2">{errors.image_url}</p>
              )}
            </CardContent>
          </Card>

          {/* Title */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="font-pretendard">제목</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <div className="w-full overflow-hidden">
                <Input
                  placeholder="오늘의 식물 이야기 제목을 입력하세요"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  disabled={isSubmitting}
                  className="font-pretendard w-full max-w-full box-border"
                  style={{ maxWidth: '100%', width: '100%' }}
                />
              </div>
              {errors.title && (
                <p className="text-sm text-red-600 mt-2 break-words">{errors.title}</p>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="font-pretendard">설명</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <div className="w-full overflow-hidden">
                <Textarea
                  placeholder="식물과 함께한 특별한 순간을 자세히 들려주세요...
예: 오늘 새싹이 돋아났어요! 정말 신기하고 감동적이었습니다. #새싹 #성장 #감동"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={isSubmitting}
                  className="w-full min-h-24 sm:min-h-32 font-pretendard resize-none border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-full box-border"
                  style={{
                    maxWidth: '100%',
                    width: '100%',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    fontSize: '16px',
                    transform: 'scale(1)',
                    transformOrigin: 'top left',
                    zoom: '1'
                  }}
                />
              </div>
              {errors.description && (
                <p className="text-sm text-red-600 mt-2 break-words">{errors.description}</p>
              )}
              <p className="text-sm text-muted-foreground mt-2 break-words">
                해시태그(#)를 사용해서 키워드를 추가해보세요!
              </p>
            </CardContent>
          </Card>

          {/* Plant Type */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="font-pretendard">식물 종류 (선택사항)</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <div className="w-full overflow-hidden">
                <PlantTypeSelector
                  selectedType={formData.plant_type}
                  onTypeSelect={(type) => handleInputChange('plant_type', type)}
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="font-pretendard">위치 (선택사항)</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <div className="w-full overflow-hidden">
                <Input
                  placeholder="예: 거실 창가, 베란다, 정원 등"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={isSubmitting}
                  className="font-pretendard w-full max-w-full box-border"
                  style={{ maxWidth: '100%', width: '100%' }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 pb-4 sm:pb-0">
            <Link to="/" className="order-2 sm:order-1 sm:flex-1">
              <Button
                type="button"
                variant="outline"
                className="font-pretendard w-full h-12 sm:h-10"
                disabled={isSubmitting}
              >
                취소
              </Button>
            </Link>
            <Button
              type="submit"
              className="font-pretendard order-1 sm:order-2 sm:flex-1 h-12 sm:h-10"
              disabled={isSubmitting || !formData.title.trim() || !formData.description.trim() || !formData.image_url}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span className="hidden sm:inline">포스트 작성 중...</span>
                  <span className="sm:hidden">작성 중...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">포스트 작성하기 🌱</span>
                  <span className="sm:hidden">작성하기 🌱</span>
                </>
              )}
            </Button>
          </div>
        </form>

      </div>

      <Footer />
    </div>
  );
}