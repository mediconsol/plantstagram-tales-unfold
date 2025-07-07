import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Sun, Moon, Monitor, Palette } from 'lucide-react'

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, actualTheme } = useTheme()

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'system':
        return <Monitor className="h-4 w-4" />
      default:
        return <Palette className="h-4 w-4" />
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return '라이트'
      case 'dark':
        return '다크'
      case 'system':
        return '시스템'
      default:
        return '테마'
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="font-pretendard text-foreground hover:text-primary transition-colors"
        >
          {getThemeIcon()}
          <span className="ml-2 hidden sm:inline">{getThemeLabel()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className={`font-pretendard cursor-pointer ${theme === 'light' ? 'bg-accent' : ''}`}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>라이트 모드</span>
          {theme === 'light' && (
            <span className="ml-auto text-xs text-primary">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className={`font-pretendard cursor-pointer ${theme === 'dark' ? 'bg-accent' : ''}`}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>다크 모드</span>
          {theme === 'dark' && (
            <span className="ml-auto text-xs text-primary">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className={`font-pretendard cursor-pointer ${theme === 'system' ? 'bg-accent' : ''}`}
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>시스템 설정</span>
          {theme === 'system' && (
            <span className="ml-auto text-xs text-primary">✓</span>
          )}
        </DropdownMenuItem>
        
        {/* Current effective theme indicator */}
        <div className="px-2 py-1.5 text-xs text-muted-foreground border-t">
          현재: {actualTheme === 'dark' ? '다크' : '라이트'} 모드
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Simple toggle button version (alternative)
export const SimpleThemeToggle: React.FC = () => {
  const { actualTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(actualTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={toggleTheme}
      className="font-pretendard text-foreground hover:text-primary transition-colors"
    >
      {actualTheme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="ml-2 hidden sm:inline">
        {actualTheme === 'dark' ? '라이트' : '다크'}
      </span>
    </Button>
  )
}
