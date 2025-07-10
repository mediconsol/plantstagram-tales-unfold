import { useEffect, useRef } from 'react'

interface UseAutoResizeOptions {
  minHeight?: number
  maxHeight?: number
  value: string
}

export const useAutoResize = ({ minHeight = 96, maxHeight = 300, value }: UseAutoResizeOptions) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto'
    
    // Calculate the new height
    const scrollHeight = textarea.scrollHeight
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight)
    
    // Set the new height
    textarea.style.height = `${newHeight}px`
    
    // Show scrollbar if content exceeds maxHeight
    if (scrollHeight > maxHeight) {
      textarea.style.overflowY = 'auto'
    } else {
      textarea.style.overflowY = 'hidden'
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [value, minHeight, maxHeight])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Initial adjustment
    adjustHeight()

    // Add event listeners for real-time adjustment
    const handleInput = () => {
      adjustHeight()
    }

    const handlePaste = () => {
      // Delay to allow paste content to be processed
      setTimeout(adjustHeight, 0)
    }

    textarea.addEventListener('input', handleInput)
    textarea.addEventListener('paste', handlePaste)

    return () => {
      textarea.removeEventListener('input', handleInput)
      textarea.removeEventListener('paste', handlePaste)
    }
  }, [])

  return { textareaRef, adjustHeight }
}
