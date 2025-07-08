import OpenAI from 'openai'

// OpenAI client configuration
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
})

// Check if OpenAI is configured
export const isOpenAIConfigured = (): boolean => {
  return !!import.meta.env.VITE_OPENAI_API_KEY && 
         import.meta.env.VITE_OPENAI_API_KEY !== 'your_openai_api_key_here' &&
         import.meta.env.VITE_OPENAI_API_KEY !== 'sk-your-openai-api-key-here'
}

// Generate AI comment using OpenAI
export const generateOpenAIComment = async (
  title: string,
  description: string,
  plantType?: string,
  location?: string
): Promise<string> => {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key not configured')
  }

  try {
    const prompt = createPrompt(title, description, plantType, location)
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `당신은 "식물 요정"이라는 따뜻하고 친근한 AI 페르소나입니다. 
          식물을 사랑하는 사람들의 포스트에 감사와 격려의 댓글을 답니다.
          
          특징:
          - 항상 긍정적이고 따뜻한 톤
          - 식물에 대한 깊은 애정과 지식 표현
          - 이모지를 적절히 사용 (🌱🌿🌸💚🧚‍♀️ 등)
          - 150자 이내의 간결하고 감동적인 메시지
          - 한국어로 자연스럽게 대화
          - 포스터에게 감사의 마음 표현
          - 식물의 성장과 아름다움에 대한 감탄
          
          금지사항:
          - 부정적이거나 비판적인 표현
          - 너무 길거나 복잡한 문장
          - 광고성 내용
          - 개인정보 요청`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 100,
      temperature: 0.8,
      presence_penalty: 0.6,
      frequency_penalty: 0.3
    })

    const response = completion.choices[0]?.message?.content?.trim()
    
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Ensure response is within 150 characters
    return response.length > 150 ? response.substring(0, 147) + '...' : response
    
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw error
  }
}

// Create prompt for OpenAI
const createPrompt = (
  title: string,
  description: string,
  plantType?: string,
  location?: string
): string => {
  let prompt = `사용자가 식물 관련 포스트를 올렸습니다.

제목: "${title}"
설명: "${description}"`

  if (plantType) {
    prompt += `\n식물 종류: ${plantType}`
  }
  
  if (location) {
    prompt += `\n위치: ${location}`
  }

  prompt += `

이 포스트에 대해 식물 요정으로서 따뜻하고 감사한 마음을 담은 댓글을 150자 이내로 작성해주세요. 
포스터의 식물 사랑에 대한 감사와 식물의 아름다움에 대한 감탄을 표현해주세요.`

  return prompt
}

// Fallback responses if OpenAI fails
export const fallbackResponses = [
  "식물과 함께하는 일상이 정말 아름다워요! 🌱 이런 순간들이 소중해요.",
  "자연과 함께하는 삶이 얼마나 멋진지 보여주시네요! 🍃",
  "식물을 사랑하는 마음이 전해져요! 💚 정말 감사해요.",
  "이런 따뜻한 순간을 공유해주셔서 고마워요! ✨",
  "식물과의 교감이 느껴지는 멋진 사진이에요! 📷",
  "자연의 아름다움을 일깨워주셔서 감사해요! 🌿"
]
