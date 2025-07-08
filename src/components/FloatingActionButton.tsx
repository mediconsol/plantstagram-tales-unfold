import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Plus, Edit3, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

export const FloatingActionButton: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Hide FAB on certain pages
  const hiddenPaths = ['/create', '/settings']
  const shouldHide = hiddenPaths.includes(location.pathname)

  // Auto-hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false)
      } else {
        // Scrolling up
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Don't render if user is not logged in or on hidden pages
  if (!user || shouldHide) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      <Link to="/create">
        <Button
          size="lg"
          className={cn(
            "h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
          )}
          aria-label="새 포스트 작성"
        >
          <Plus className="w-6 h-6 text-white" />
        </Button>
      </Link>
      
      {/* Ripple effect on tap */}
      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        .fab-ripple {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.6);
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}

// Alternative FAB with multiple actions (expandable)
export const ExpandableFloatingActionButton: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Hide FAB on certain pages
  const hiddenPaths = ['/create', '/settings']
  const shouldHide = hiddenPaths.includes(location.pathname)

  // Auto-hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
        setIsExpanded(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isExpanded) {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isExpanded])

  if (!user || shouldHide) {
    return null
  }

  const actions = [
    {
      icon: Edit3,
      label: '포스트 작성',
      path: '/create',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: Camera,
      label: '사진 업로드',
      path: '/create?tab=photo',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      {/* Backdrop */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/20 -z-10" />
      )}
      
      {/* Action buttons */}
      <div className="flex flex-col items-end space-y-3 mb-3">
        {actions.map((action, index) => {
          const IconComponent = action.icon
          return (
            <div
              key={action.path}
              className={cn(
                "transition-all duration-300 ease-out",
                isExpanded && isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0 pointer-events-none"
              )}
              style={{
                transitionDelay: isExpanded ? `${index * 50}ms` : '0ms'
              }}
            >
              <Link to={action.path}>
                <Button
                  size="sm"
                  className={cn(
                    "h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200",
                    action.color
                  )}
                  aria-label={action.label}
                  onClick={() => setIsExpanded(false)}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </Button>
              </Link>
              
              {/* Label */}
              <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {action.label}
              </div>
            </div>
          )
        })}
      </div>

      {/* Main FAB */}
      <Button
        size="lg"
        onClick={(e) => {
          e.stopPropagation()
          setIsExpanded(!isExpanded)
        }}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0",
          isExpanded && "rotate-45"
        )}
        aria-label={isExpanded ? "메뉴 닫기" : "메뉴 열기"}
      >
        <Plus className="w-6 h-6 text-white transition-transform duration-300" />
      </Button>
    </div>
  )
}
