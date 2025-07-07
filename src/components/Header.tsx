import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/auth/AuthModal'
import { shareNative, copyToClipboard, createAppShareOptions, isWebShareSupported } from '@/lib/share'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { User, LogOut, Settings, Plus, Share } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export const Header: React.FC = () => {
  const { user, signOut, loading } = useAuth()
  const { toast } = useToast()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  const handleAppShare = async () => {
    const shareOptions = createAppShareOptions()

    if (isWebShareSupported()) {
      try {
        await shareNative(shareOptions)
        toast({
          title: "공유 완료",
          description: "앱이 성공적으로 공유되었습니다!",
        })
      } catch (error) {
        // Native share cancelled or failed, fallback to copy
        handleCopyAppLink(shareOptions.url)
      }
    } else {
      handleCopyAppLink(shareOptions.url)
    }
  }

  const handleCopyAppLink = async (url: string) => {
    const success = await copyToClipboard(url)
    if (success) {
      toast({
        title: "링크 복사 완료",
        description: "Plantstagram 링크가 클립보드에 복사되었습니다!",
      })
    } else {
      toast({
        title: "복사 실패",
        description: "링크 복사에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive"
      })
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌱</span>
            <span className="font-pretendard font-bold text-xl text-foreground">
              Plantstagram
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="font-pretendard text-foreground hover:text-primary transition-colors"
            >
              홈
            </Link>
            <Link
              to="/gallery"
              className="font-pretendard text-foreground hover:text-primary transition-colors"
            >
              갤러리
            </Link>
            {user && (
              <Link
                to="/create"
                className="font-pretendard text-foreground hover:text-primary transition-colors"
              >
                포스트 작성
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAppShare}
              className="font-pretendard text-foreground hover:text-primary transition-colors"
            >
              <Share className="w-4 h-4 mr-2" />
              공유
            </Button>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                {/* Create Post Button */}
                <Link to="/create">
                  <Button size="sm" className="hidden sm:flex">
                    <Plus className="w-4 h-4 mr-2" />
                    포스트 작성
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={user.user_metadata?.avatar_url} 
                          alt={user.user_metadata?.username || user.email} 
                        />
                        <AvatarFallback>
                          {user.user_metadata?.username?.[0]?.toUpperCase() || 
                           user.email?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">
                          {user.user_metadata?.username || '사용자'}
                        </p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        프로필
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        설정
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-600 focus:text-red-600"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="font-pretendard"
              >
                로그인
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  )
}
