import { PlantPost } from '@/types/database'

export interface ShareOptions {
  title: string
  text: string
  url: string
}

// Web Share API를 지원하는지 확인
export const isWebShareSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'share' in navigator
}

// 네이티브 공유 (모바일)
export const shareNative = async (options: ShareOptions): Promise<boolean> => {
  if (!isWebShareSupported()) {
    return false
  }

  try {
    await navigator.share(options)
    return true
  } catch (error) {
    console.error('Native share failed:', error)
    return false
  }
}

// 클립보드에 복사
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand('copy')
      textArea.remove()
      return result
    }
  } catch (error) {
    console.error('Copy to clipboard failed:', error)
    return false
  }
}

// 소셜 미디어 공유 URL 생성
export const getSocialShareUrls = (options: ShareOptions) => {
  const encodedUrl = encodeURIComponent(options.url)
  const encodedText = encodeURIComponent(`${options.title} - ${options.text}`)
  const encodedTitle = encodeURIComponent(options.title)

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    kakao: `https://story.kakao.com/share?url=${encodedUrl}&text=${encodedText}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedText}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`
  }
}

// 포스트 공유 옵션 생성
export const createPostShareOptions = (post: PlantPost): ShareOptions => {
  const baseUrl = window.location.origin
  const postUrl = `${baseUrl}/post/${post.id}` // 나중에 개별 포스트 페이지 구현 시 사용
  
  return {
    title: `🌱 ${post.title}`,
    text: post.description || '식물과 함께하는 특별한 순간을 공유합니다!',
    url: postUrl
  }
}

// 앱 공유 옵션 생성
export const createAppShareOptions = (): ShareOptions => {
  const baseUrl = window.location.origin

  return {
    title: '🌱 Plantgram Tales Unfold - 식물들의 이야기',
    text: '🌱 식물과 함께하는 특별한 순간들을 기록하고 공유해보세요! Plantgram에서 식물 친구들과 소통하며 자연의 아름다움을 나눠요. 🌿✨',
    url: baseUrl
  }
}
