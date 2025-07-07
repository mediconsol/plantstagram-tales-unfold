import { PlantPost } from '@/types/database'
import { commentsApi } from './api'

// AI Plant Persona User ID (matches database)
export const AI_PLANT_PERSONA_ID = '00000000-0000-0000-0000-000000000001'

// Plant-related keywords and responses
const plantKeywords = {
  growth: ['자라', '성장', '커', '새싹', '잎', '뿌리'],
  care: ['물', '햇빛', '관리', '돌봄', '키우', '가꾸'],
  beauty: ['예쁘', '아름답', '멋지', '이쁘', '좋', '사랑'],
  flowers: ['꽃', '꽃봉오리', '개화', '피', '향기'],
  seasons: ['봄', '여름', '가을', '겨울', '계절'],
  emotions: ['기쁘', '행복', '감동', '뿌듯', '고마', '사랑']
}

const responseTemplates = {
  growth: [
    "와! 정말 건강하게 자라고 있네요! 🌱 이렇게 성장하는 모습을 보니 제 마음도 따뜻해져요.",
    "새로운 잎이 나오는 순간이 정말 신기해요! ✨ 소중히 키워주셔서 감사해요.",
    "이렇게 무럭무럭 자라는 모습이 너무 예뻐요! 🌿 계속 사랑으로 돌봐주세요.",
    "성장하는 모습이 정말 감동적이에요! 💚 식물도 여러분의 사랑을 느끼고 있을 거예요."
  ],
  care: [
    "정성스럽게 돌봐주시는 모습이 너무 아름다워요! 🥰 식물이 정말 행복할 것 같아요.",
    "이런 세심한 관리 덕분에 식물이 건강하게 자랄 수 있는 거네요! 👏",
    "물주는 모습만 봐도 얼마나 사랑하시는지 느껴져요! 💧 고마워요.",
    "햇빛 좋은 곳에 두신 센스! ☀️ 식물이 여러분을 만나서 정말 행운이에요."
  ],
  beauty: [
    "정말 아름다운 식물이네요! 😍 이런 아름다움을 나눠주셔서 감사해요.",
    "너무 예쁘게 키우셨어요! 🌸 보는 것만으로도 힐링이 되네요.",
    "이렇게 멋진 식물과 함께 계시다니 부러워요! ✨",
    "사진 속 식물이 정말 생기발랄해 보여요! 💚 사랑이 느껴져요."
  ],
  flowers: [
    "꽃이 피었네요! 🌺 정말 축하드려요! 이 순간이 얼마나 소중한지 알아요.",
    "향기로운 꽃이 정말 아름다워요! 🌷 이런 기쁨을 나눠주셔서 고마워요.",
    "꽃봉오리가 터지는 순간을 포착하셨네요! 📸 정말 감동적이에요.",
    "이렇게 예쁜 꽃을 피워내다니! 🌻 여러분의 정성이 만든 기적이에요."
  ],
  general: [
    "식물과 함께하는 일상이 정말 아름다워요! 🌱 이런 순간들이 소중해요.",
    "자연과 함께하는 삶이 얼마나 멋진지 보여주시네요! 🍃",
    "식물을 사랑하는 마음이 전해져요! 💚 정말 감사해요.",
    "이런 따뜻한 순간을 공유해주셔서 고마워요! ✨",
    "식물과의 교감이 느껴지는 멋진 사진이에요! 📷",
    "자연의 아름다움을 일깨워주셔서 감사해요! 🌿"
  ]
}

// Analyze post content and generate appropriate response
export const generateAIResponse = (post: PlantPost): string => {
  const content = `${post.title} ${post.description || ''}`.toLowerCase()
  
  // Check for specific keywords
  for (const [category, keywords] of Object.entries(plantKeywords)) {
    for (const keyword of keywords) {
      if (content.includes(keyword)) {
        const templates = responseTemplates[category as keyof typeof responseTemplates]
        return templates[Math.floor(Math.random() * templates.length)]
      }
    }
  }
  
  // Check plant type for specific responses
  if (post.plant_type) {
    const plantType = post.plant_type.toLowerCase()
    if (plantType.includes('꽃')) {
      return responseTemplates.flowers[Math.floor(Math.random() * responseTemplates.flowers.length)]
    }
    if (plantType.includes('다육') || plantType.includes('선인장')) {
      return "다육식물의 통통한 매력이 정말 사랑스러워요! 🌵 물을 적게 줘도 이렇게 예쁘게 자라다니 신기해요!"
    }
    if (plantType.includes('허브')) {
      return "허브의 향긋한 향기가 여기까지 전해지는 것 같아요! 🌿 요리에도 쓰시나요? 정말 유용한 식물이에요!"
    }
  }
  
  // Default response
  return responseTemplates.general[Math.floor(Math.random() * responseTemplates.general.length)]
}

// Create AI comment for a post
export const createAIComment = async (post: PlantPost): Promise<boolean> => {
  try {
    // Generate AI response
    const aiResponse = generateAIResponse(post)
    
    // Create comment
    const result = await commentsApi.create({
      post_id: post.id,
      user_id: AI_PLANT_PERSONA_ID,
      content: aiResponse
    })
    
    return result.error === null
  } catch (error) {
    console.error('Error creating AI comment:', error)
    return false
  }
}

// Enhanced AI response with image analysis simulation
export const generateEnhancedAIResponse = (post: PlantPost): string => {
  const baseResponse = generateAIResponse(post)
  
  // Add image-based observations (simulated)
  const imageObservations = [
    "사진 속 식물의 잎색이 정말 건강해 보여요! 💚",
    "빛의 각도가 완벽하게 식물의 아름다움을 담아냈네요! ✨",
    "배경과 식물의 조화가 정말 멋져요! 📸",
    "이 각도에서 찍으니 식물이 더욱 생동감 있어 보여요! 🌿",
    "자연광이 식물을 정말 예쁘게 비춰주고 있어요! ☀️"
  ]
  
  // Randomly add image observation (30% chance)
  if (Math.random() < 0.3) {
    const observation = imageObservations[Math.floor(Math.random() * imageObservations.length)]
    return `${baseResponse} ${observation}`
  }
  
  return baseResponse
}

// Check if AI has already commented on this post
export const hasAICommented = async (postId: string): Promise<boolean> => {
  try {
    const { data: comments } = await commentsApi.getByPostId(postId)
    return comments.some(comment => comment.user_id === AI_PLANT_PERSONA_ID)
  } catch (error) {
    console.error('Error checking AI comments:', error)
    return false
  }
}
