import { useEffect } from 'react'

/**
 * Custom hook to scroll to top when component mounts
 * Useful for ensuring pages start at the top when navigating
 */
export const useScrollToTop = () => {
  useEffect(() => {
    // Scroll to top immediately
    window.scrollTo(0, 0)
    
    // Also scroll to top after a small delay to handle any layout shifts
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
    
    return () => clearTimeout(timeoutId)
  }, [])
}

/**
 * Custom hook to scroll to top with smooth behavior
 * @param behavior - 'auto' | 'smooth'
 */
export const useScrollToTopSmooth = (behavior: ScrollBehavior = 'auto') => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior
    })
  }, [behavior])
}

/**
 * Custom hook to scroll to top when a specific dependency changes
 * @param dependency - Value to watch for changes
 */
export const useScrollToTopOnChange = (dependency: any) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [dependency])
}
