import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-md">
            <div className="text-6xl mb-4">🌱</div>
            <h1 className="text-2xl font-pretendard font-bold text-foreground">
              앗! 문제가 발생했어요
            </h1>
            <p className="text-muted-foreground font-pretendard">
              페이지를 불러오는 중 오류가 발생했습니다. 
              페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-pretendard font-medium px-6 py-3 rounded-lg transition-colors"
              >
                페이지 새로고침
              </button>
              <div className="text-xs text-muted-foreground">
                {this.state.error?.message && (
                  <details className="mt-4">
                    <summary className="cursor-pointer">기술적 세부사항</summary>
                    <pre className="mt-2 text-left bg-muted p-2 rounded text-xs overflow-auto">
                      {this.state.error.message}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
