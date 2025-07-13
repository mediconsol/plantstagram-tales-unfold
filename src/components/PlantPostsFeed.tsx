import React from 'react'
import { usePlantPosts } from '@/hooks/usePlantPosts'
import { PlantPost } from './PlantPost'
import { Button } from '@/components/ui/button'
import { Loader2, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export const PlantPostsFeed: React.FC = () => {
  const { user } = useAuth()
  const { data, isLoading, error, isError } = usePlantPosts(0, 20)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          포스트를 불러오는 중 오류가 발생했습니다.
        </p>
        <p className="text-sm text-red-500">{error?.message}</p>
      </div>
    )
  }

  const posts = data?.data || []

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-6xl mb-4">🌱</div>
        <h3 className="text-xl font-pretendard font-medium text-foreground">
          아직 포스트가 없어요
        </h3>
        <p className="text-muted-foreground font-pretendard">
          첫 번째 식물 이야기를 공유해보세요!
        </p>
        {user && (
          <Link to="/create">
            <Button className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              첫 포스트 작성하기
            </Button>
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-pretendard font-bold text-foreground">
          식물들의 일상 🌿
        </h2>
        <p className="text-muted-foreground font-pretendard">
          식물들이 전하는 특별한 순간들을 만나보세요
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PlantPost key={post.id} post={post} />
        ))}
      </div>

      {/* Load More Button */}
      {posts.length >= 20 && (
        <div className="text-center pt-8">
          <Button variant="outline" size="lg">
            더 많은 포스트 보기
          </Button>
        </div>
      )}
    </div>
  )
}
