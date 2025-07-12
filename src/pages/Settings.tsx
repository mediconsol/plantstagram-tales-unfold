import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { SEOHead, SEOPresets } from '@/components/SEOHead'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Camera,
  Save,
  LogOut,
  Trash2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export const Settings = () => {
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  // Scroll to top when page loads
  useScrollToTop()

  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    username: user?.user_metadata?.username || '',
    fullName: user?.user_metadata?.full_name || '',
    bio: user?.user_metadata?.bio || '',
    location: user?.user_metadata?.location || '',
    website: user?.user_metadata?.website || ''
  })

  const [notifications, setNotifications] = useState({
    comments: true,
    likes: true,
    follows: true,
    posts: false
  })

  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showEmail: false,
    showLocation: true
  })

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 md:px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
            <p className="text-muted-foreground">설정을 변경하려면 먼저 로그인해주세요.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const handleProfileUpdate = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement profile update API call
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      toast({
        title: "프로필 업데이트 완료",
        description: "프로필 정보가 성공적으로 업데이트되었습니다.",
      })
    } catch (error) {
      toast({
        title: "업데이트 실패",
        description: "프로필 업데이트 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "로그아웃 완료",
        description: "성공적으로 로그아웃되었습니다.",
      })
    } catch (error) {
      toast({
        title: "로그아웃 실패",
        description: "로그아웃 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead {...SEOPresets.settings} />
      <Header />

      <main className="flex-1 container mx-auto px-6 md:px-4 py-8 pt-16 md:pt-20 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-pretendard mb-2">설정</h1>
          <p className="text-muted-foreground font-pretendard">
            계정 및 앱 설정을 관리하세요.
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-pretendard">
                <User className="w-5 h-5" />
                프로필 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt="프로필 사진" />
                  <AvatarFallback className="text-lg bg-gradient-earth text-white">
                    {profileData.username[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" className="font-pretendard">
                    <Camera className="w-4 h-4 mr-2" />
                    사진 변경
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1 font-pretendard">
                    JPG, PNG 파일만 업로드 가능합니다.
                  </p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="font-pretendard">사용자명</Label>
                  <Input
                    id="username"
                    value={profileData.username}
                    onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="사용자명을 입력하세요"
                    className="font-pretendard"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="font-pretendard">이름</Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="이름을 입력하세요"
                    className="font-pretendard"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="font-pretendard">소개</Label>
                <div className="w-full overflow-hidden">
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="자신을 소개해보세요"
                    className="font-pretendard w-full max-w-full box-border resize-none"
                    rows={3}
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="font-pretendard">위치</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="위치를 입력하세요"
                    className="font-pretendard"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website" className="font-pretendard">웹사이트</Label>
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                    className="font-pretendard"
                  />
                </div>
              </div>

              <Button onClick={handleProfileUpdate} disabled={isLoading} className="font-pretendard">
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? '저장 중...' : '프로필 저장'}
              </Button>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-pretendard">
                <Palette className="w-5 h-5" />
                테마 설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-pretendard">다크 모드</Label>
                    <p className="text-sm text-muted-foreground font-pretendard">
                      어두운 테마를 사용합니다.
                    </p>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-pretendard">시스템 테마 따르기</Label>
                    <p className="text-sm text-muted-foreground font-pretendard">
                      시스템 설정에 따라 자동으로 테마를 변경합니다.
                    </p>
                  </div>
                  <Switch
                    checked={theme === 'system'}
                    onCheckedChange={(checked) => setTheme(checked ? 'system' : 'light')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-pretendard">
                <Bell className="w-5 h-5" />
                알림 설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries({
                  comments: '댓글 알림',
                  likes: '좋아요 알림',
                  follows: '팔로우 알림',
                  posts: '새 게시물 알림'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="font-pretendard">{label}</Label>
                    <Switch
                      checked={notifications[key as keyof typeof notifications]}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, [key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-pretendard">
                <Shield className="w-5 h-5" />
                개인정보 설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries({
                  publicProfile: '공개 프로필',
                  showEmail: '이메일 공개',
                  showLocation: '위치 정보 공개'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="font-pretendard">{label}</Label>
                    <Switch
                      checked={privacy[key as keyof typeof privacy]}
                      onCheckedChange={(checked) => 
                        setPrivacy(prev => ({ ...prev, [key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-pretendard">
                <Globe className="w-5 h-5" />
                계정 관리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="w-full font-pretendard"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
                
                <Separator />
                
                <Button 
                  variant="destructive" 
                  className="w-full font-pretendard"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  계정 삭제
                </Button>
                <p className="text-xs text-muted-foreground font-pretendard">
                  계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
