import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { shareNative, createAppShareOptions, isWebShareSupported } from '@/lib/share'
import { Button } from '@/components/ui/button'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetDescription
} from '@/components/ui/sheet'
import { 
  Menu, 
  Home, 
  Image, 
  Share, 
  User, 
  Settings, 
  LogOut,
  Sun,
  Moon,
  X
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useToast } from '@/hooks/use-toast'
import { AuthModal } from '@/components/auth/AuthModal'

export const MobileMenu: React.FC = () => {
  const { user, signOut } = useAuth()
  const { data: profile } = useProfile() // 프로필 정보 가져오기
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // 프로필 정보 우선, 없으면 user_metadata 사용
  const userInfo = {
    username: profile?.username || user?.user_metadata?.username || user?.email?.split('@')[0] || '사용자',
    fullName: profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.username || '이름 없음',
    avatarUrl: profile?.avatar_url || user?.user_metadata?.avatar_url,
    email: user?.email
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsOpen(false)
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

  const handleAppShare = async () => {
    const shareOptions = createAppShareOptions()

    if (isWebShareSupported()) {
      try {
        await shareNative(shareOptions)
        setIsOpen(false)
        toast({
          title: "공유 완료",
          description: "앱이 성공적으로 공유되었습니다!",
        })
      } catch (error) {
        console.error('Native share failed:', error)
      }
    } else {
      toast({
        title: "공유 기능",
        description: "이 기기에서는 공유 기능을 지원하지 않습니다.",
        variant: "destructive"
      })
    }
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const menuItems = [
    {
      icon: Home,
      label: '홈',
      path: '/',
      show: true
    },
    {
      icon: Image,
      label: '갤러리',
      path: '/gallery',
      show: true
    },
    {
      icon: User,
      label: '프로필',
      path: '/profile',
      show: !!user
    },
    {
      icon: Settings,
      label: '설정',
      path: '/settings',
      show: !!user
    }
  ]

  const isCurrentPath = (path: string) => location.pathname === path

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="md:hidden p-2"
          aria-label="메뉴 열기"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌱</span>
              <div>
                <SheetTitle className="font-pretendard text-lg">
                  Plantgram
                </SheetTitle>
                <SheetDescription className="font-pretendard text-sm">
                  식물들의 이야기
                </SheetDescription>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* User Info */}
          {user && (
            <div className="p-6 border-b bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-earth flex items-center justify-center text-white font-bold">
                  {userInfo.username[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-pretendard font-medium truncate">
                    {userInfo.fullName}
                  </p>
                  <p className="font-pretendard text-sm text-muted-foreground truncate">
                    @{userInfo.username}
                  </p>
                  <p className="font-pretendard text-xs text-muted-foreground truncate">
                    {userInfo.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                if (!item.show) return null
                
                const IconComponent = item.icon
                const isCurrent = isCurrentPath(item.path)
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-pretendard ${
                      isCurrent 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              {/* Share Button */}
              <Button
                variant="ghost"
                onClick={handleAppShare}
                className="w-full justify-start gap-3 px-4 py-3 h-auto font-pretendard"
              >
                <Share className="w-5 h-5" />
                <span>앱 공유하기</span>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                onClick={toggleTheme}
                className="w-full justify-start gap-3 px-4 py-3 h-auto font-pretendard"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-5 h-5" />
                    <span>라이트 모드</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5" />
                    <span>다크 모드</span>
                  </>
                )}
              </Button>
            </div>
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t">
            {user ? (
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full justify-start gap-3 px-4 py-3 h-auto font-pretendard text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                <span>로그아웃</span>
              </Button>
            ) : (
              <div className="text-center">
                <p className="font-pretendard text-sm text-muted-foreground mb-3">
                  로그인하여 더 많은 기능을 이용하세요
                </p>
                <Button
                  onClick={() => {
                    setIsOpen(false)
                    setShowAuthModal(true)
                  }}
                  className="w-full font-pretendard"
                >
                  로그인
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </Sheet>
  )
}
