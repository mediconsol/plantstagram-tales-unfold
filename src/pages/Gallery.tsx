import React, { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { usePlantPosts } from '@/hooks/usePlantPosts'
import { PlantPost } from '@/types/database'
import { plantTypes } from '@/data/plantTypes'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Filter, Grid, List, Loader2 } from 'lucide-react'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { SEOHead, SEOPresets } from '@/components/SEOHead'
import { PostDetailModal } from '@/components/PostDetailModal'

const Gallery: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest')
  const [filterBy, setFilterBy] = useState<string>('all')
  const [selectedPost, setSelectedPost] = useState<PlantPost | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const { data, isLoading, error } = usePlantPosts(0, 50) // Load more posts for gallery

  const posts = data?.data || []

  // Scroll to top when page loads
  useScrollToTop()

  // Handle post click
  const handlePostClick = (post: PlantPost) => {
    setSelectedPost(post)
    setIsDetailModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsDetailModalOpen(false)
    setSelectedPost(null)
  }

  // Filter and sort posts
  const filteredAndSortedPosts = React.useMemo(() => {
    let filtered = posts

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.plant_type?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Plant type filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(post => post.plant_type === filterBy)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'popular':
          // For now, sort by creation date (can be enhanced with actual like counts)
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return filtered
  }, [posts, searchTerm, filterBy, sortBy])

  // Get unique plant types for filter from actual posts
  const availablePlantTypes = React.useMemo(() => {
    const types = posts
      .map(post => post.plant_type)
      .filter((type): type is string => Boolean(type))
    return Array.from(new Set(types))
  }, [posts])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 pt-16 md:pt-20 flex-1">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 pt-20 flex-1">
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              갤러리를 불러오는 중 오류가 발생했습니다.
            </p>
            <Button onClick={() => window.location.reload()}>
              다시 시도
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead {...SEOPresets.gallery} />
      <Header />

      <div className="container mx-auto px-4 py-8 pt-16 md:pt-20 flex-1">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-pretendard font-bold text-foreground mb-4">
            🌱 식물들의 하루
          </h1>
          <p className="text-lg text-muted-foreground font-pretendard max-w-2xl mx-auto">
            식물들의 특별한 순간들을 담은 갤러리입니다.<br />
            각각의 이야기에서 자연의 아름다움을 발견해보세요.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="식물 이름, 제목, 설명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 font-pretendard"
            />
          </div>

          {/* Filter by plant type */}
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-full md:w-48 font-pretendard">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="식물 종류" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="font-pretendard">모든 식물</SelectItem>
              {availablePlantTypes.map((type) => {
                const plantTypeData = getPlantTypeByName(type)
                return (
                  <SelectItem key={type} value={type} className="font-pretendard">
                    <div className="flex items-center gap-2">
                      <span>{plantTypeData?.emoji || '🌱'}</span>
                      <span>{type}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-full md:w-32 font-pretendard">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest" className="font-pretendard">최신순</SelectItem>
              <SelectItem value="oldest" className="font-pretendard">오래된순</SelectItem>
              <SelectItem value="popular" className="font-pretendard">인기순</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground font-pretendard">
            총 {filteredAndSortedPosts.length}개의 식물 이야기
          </p>
        </div>

        {/* Gallery Content */}
        {filteredAndSortedPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-pretendard font-medium text-foreground mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-muted-foreground font-pretendard">
              다른 검색어나 필터를 시도해보세요.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <GalleryGrid posts={filteredAndSortedPosts} onPostClick={handlePostClick} />
        ) : (
          <GalleryList posts={filteredAndSortedPosts} onPostClick={handlePostClick} />
        )}

        {/* Call to Action */}
        <div className="text-center mt-12 py-8 border-t">
          <h3 className="text-xl font-pretendard font-medium text-foreground mb-4">
            당신의 식물 이야기도 들려주세요! 🌿
          </h3>
          <Link to="/create">
            <Button size="lg" className="font-pretendard">
              포스트 작성하기
            </Button>
          </Link>
        </div>
      </div>

      <Footer />

      {/* Post Detail Modal */}
      <PostDetailModal
        post={selectedPost}
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}

// Grid View Component
const GalleryGrid: React.FC<{ posts: PlantPost[]; onPostClick: (post: PlantPost) => void }> = ({ posts, onPostClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {posts.map((post) => (
        <GalleryGridItem key={post.id} post={post} onClick={() => onPostClick(post)} />
      ))}
    </div>
  )
}

// Grid Item Component - Simplified
const GalleryGridItem: React.FC<{ post: PlantPost; onClick: () => void }> = ({ post, onClick }) => {
  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      {post.image_url && (
        <div className="relative aspect-square overflow-hidden">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </div>
      )}

      {/* Content - Only Title and Author */}
      <CardContent className="p-4">
        {/* Title */}
        <h3 className="font-pretendard font-medium text-foreground mb-2 line-clamp-2">
          {post.title}
        </h3>

        {/* Author */}
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={post.profiles?.avatar_url || undefined} />
            <AvatarFallback className="text-xs bg-gradient-earth text-white">
              {post.profiles?.username?.[0]?.toUpperCase() || '🌱'}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground font-pretendard">
            {post.profiles?.username || '익명'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

// List View Component
const GalleryList: React.FC<{ posts: PlantPost[]; onPostClick: (post: PlantPost) => void }> = ({ posts, onPostClick }) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <GalleryListItem key={post.id} post={post} onClick={() => onPostClick(post)} />
      ))}
    </div>
  )
}

// List Item Component - Simplified
const GalleryListItem: React.FC<{ post: PlantPost; onClick: () => void }> = ({ post, onClick }) => {
  return (
    <Card
      className="hover:shadow-md transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Image */}
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
            />
          )}

          {/* Content - Only Title and Author */}
          <div className="flex-1 min-w-0">
            {/* Author */}
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={post.profiles?.avatar_url || undefined} />
                <AvatarFallback className="text-xs bg-gradient-earth text-white">
                  {post.profiles?.username?.[0]?.toUpperCase() || '🌱'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground font-pretendard">
                {post.profiles?.username || '익명'}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-pretendard font-medium text-foreground">
              {post.title}
            </h3>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Gallery
