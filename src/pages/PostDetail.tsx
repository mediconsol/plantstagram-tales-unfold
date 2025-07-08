import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { usePlantPost } from '@/hooks/usePlantPosts'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { SEOHead } from '@/components/SEOHead'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PlantPost } from '@/components/PlantPost'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  // Scroll to top when page loads
  useScrollToTop()
  
  const { data: postData, isLoading, error } = usePlantPost(id!)
  
  const post = postData?.data

  // SEO 메타태그 설정
  const seoProps = post ? {
    title: `${post.title} - Plantgram`,
    description: post.description || '식물과 함께하는 특별한 순간을 공유합니다.',
    keywords: `${post.title}, 식물, 플랜트그램, ${post.plant_type || ''}`,
    type: 'article' as const,
    author: post.profiles?.username || 'Plantgram User',
    publishedTime: post.created_at,
    modifiedTime: post.updated_at,
    section: '식물 이야기',
    tags: [post.plant_type, '식물', '가드닝'].filter(Boolean),
    url: `https://aatto.kr/post/${id}`,
    image: post.image_url || 'https://aatto.kr/apple-touch-icon.svg'
  } : {
    title: '포스트를 찾을 수 없습니다 - Plantgram',
    description: '요청하신 포스트를 찾을 수 없습니다.',
  }

  const handleGoBack = () => {
    // 이전 페이지로 돌아가거나 홈으로
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SEOHead title="로딩 중... - Plantgram" />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 pt-16 md:pt-20">
          <LoadingSpinner message="포스트를 불러오는 중..." />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SEOHead {...seoProps} />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 pt-16 md:pt-20 max-w-2xl">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="font-pretendard"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-2 font-pretendard">
                  포스트를 찾을 수 없습니다
                </h1>
                <p className="text-muted-foreground mb-6 font-pretendard">
                  요청하신 포스트가 삭제되었거나 존재하지 않습니다.
                </p>
                <div className="space-x-4">
                  <Button onClick={handleGoBack} variant="outline" className="font-pretendard">
                    이전 페이지로
                  </Button>
                  <Button onClick={() => navigate('/')} className="font-pretendard">
                    홈으로 가기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead {...seoProps} />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 pt-16 md:pt-20 max-w-2xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="font-pretendard"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
        </div>
        
        <div className="space-y-6">
          <PlantPost post={post} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default PostDetail
