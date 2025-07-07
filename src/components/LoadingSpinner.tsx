import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "로딩 중...", 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      <p className="text-muted-foreground font-pretendard text-sm">
        {message}
      </p>
    </div>
  )
}

export const FullPageLoader: React.FC<{ message?: string }> = ({ 
  message = "페이지를 불러오는 중..." 
}) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-4xl mb-4">🌱</div>
        <LoadingSpinner message={message} size="lg" />
      </div>
    </div>
  )
}
