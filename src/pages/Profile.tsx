import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile, useUserStats, useUserPosts } from '@/hooks/useProfile'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PlantPost } from '@/components/PlantPost'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { EditProfileModal } from '@/components/EditProfileModal'
import { ShareProfileModal } from '@/components/ShareProfileModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  MapPin, 
  Heart, 
  MessageCircle, 
  Camera, 
  Edit,
  Settings,
  Share
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

export const Profile = () => {
  const { user } = useAuth()
  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: stats, isLoading: statsLoading } = useUserStats()
  const { data: userPosts, isLoading: postsLoading } = useUserPosts()
  const [activeTab, setActiveTab] = useState('posts')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
            <p className="text-muted-foreground">프로필을 보려면 먼저 로그인해주세요.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Get user info from profile or fallback to metadata
  const userInfo = {
    username: profile?.username || user.user_metadata?.username || user.email?.split('@')[0] || '사용자',
    fullName: profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.username || '이름 없음',
    avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url,
    bio: profile?.bio || user.user_metadata?.bio || '아직 소개글이 없습니다.',
    location: profile?.location || user.user_metadata?.location,
    website: profile?.website || user.user_metadata?.website,
    joinedAt: profile?.created_at || user.created_at
  }

  // Use stats from API or fallback to calculated values
  const totalPosts = stats?.postsCount || userPosts?.length || 0
  const totalLikes = stats?.totalLikes || 0
  const totalComments = stats?.totalComments || 0

  const isLoading = profileLoading || statsLoading || postsLoading

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 pt-16 md:pt-20">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-24 h-24 md:w-32 md:h-32">
                  <AvatarImage src={userInfo.avatarUrl} alt={userInfo.username} />
                  <AvatarFallback className="text-2xl bg-gradient-earth text-white">
                    {userInfo.username[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowEditModal(true)}
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold font-pretendard">{userInfo.fullName}</h1>
                    <Badge variant="secondary" className="font-pretendard">
                      @{userInfo.username}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground font-pretendard mb-3">
                    {userInfo.bio}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {userInfo.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="font-pretendard">{userInfo.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span className="font-pretendard">
                        {formatDistanceToNow(new Date(userInfo.joinedAt), { 
                          addSuffix: true, 
                          locale: ko 
                        })} 가입
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEditModal(true)}
                    className="font-pretendard"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    프로필 편집
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="font-pretendard"
                  >
                    <Link to="/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      설정
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowShareModal(true)}
                    className="font-pretendard"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    공유
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalPosts}</div>
                <p className="text-sm text-muted-foreground font-pretendard">게시물</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{totalLikes}</div>
                <p className="text-sm text-muted-foreground font-pretendard">받은 좋아요</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{totalComments}</div>
                <p className="text-sm text-muted-foreground font-pretendard">받은 댓글</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts" className="font-pretendard">
              게시물 ({totalPosts})
            </TabsTrigger>
            <TabsTrigger value="liked" className="font-pretendard">
              좋아요한 글
            </TabsTrigger>
            <TabsTrigger value="activity" className="font-pretendard">
              활동
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            {isLoading ? (
              <LoadingSpinner message="게시물을 불러오는 중..." />
            ) : userPosts && userPosts.length > 0 ? (
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <PlantPost key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Camera className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2 font-pretendard">
                      아직 게시물이 없어요
                    </h3>
                    <p className="text-muted-foreground mb-4 font-pretendard">
                      첫 번째 식물 이야기를 공유해보세요!
                    </p>
                    <Button asChild>
                      <a href="/create" className="font-pretendard">
                        첫 게시물 작성하기
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="liked" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2 font-pretendard">
                    좋아요한 게시물
                  </h3>
                  <p className="text-muted-foreground font-pretendard">
                    좋아요한 게시물들이 여기에 표시됩니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2 font-pretendard">
                    최근 활동
                  </h3>
                  <p className="text-muted-foreground font-pretendard">
                    댓글, 좋아요 등 최근 활동이 여기에 표시됩니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {/* Modals */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={profile}
      />

      <ShareProfileModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        profile={profile}
      />
    </div>
  )
}
