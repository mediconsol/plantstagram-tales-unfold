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
          - 180-200자 내외의 완전한 문장으로 구성된 감동적인 메시지
          - 한국어로 자연스럽게 대화
          - 포스터에게 감사의 마음 표현
          - 식물의 성장과 아름다움에 대한 감탄
          
          금지사항:
          - 부정적이거나 비판적인 표현
          - 문장이 중간에 끊어지는 것
          - 광고성 내용
          - 개인정보 요청
          - 불완전한 문장으로 끝나는 것`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
      presence_penalty: 0.5,
      frequency_penalty: 0.4
    })

    const response = completion.choices[0]?.message?.content?.trim()
    
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Ensure response is within 200 characters and ends with complete sentence
    if (response.length > 200) {
      // Find the last complete sentence within 200 characters
      const truncated = response.substring(0, 200)
      const lastSentenceEnd = Math.max(
        truncated.lastIndexOf('.'),
        truncated.lastIndexOf('!'),
        truncated.lastIndexOf('?'),
        truncated.lastIndexOf('~')
      )

      if (lastSentenceEnd > 100) { // Ensure minimum length
        return truncated.substring(0, lastSentenceEnd + 1)
      } else {
        // If no sentence ending found, add appropriate ending
        return truncated.trim() + (truncated.trim().endsWith('요') ? '!' : '요!')
      }
    }

    // Add appropriate ending if missing
    const trimmed = response.trim()
    if (!trimmed.match(/[.!?~]$/)) {
      return trimmed + (trimmed.endsWith('요') ? '!' : '요!')
    }

    return trimmed
    
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

이 포스트에 대해 식물 요정으로서 따뜻하고 감사한 마음을 담은 댓글을 180-200자 내외로 작성해주세요.
완전한 문장으로 끝나도록 하고, 포스터의 식물 사랑에 대한 감사와 식물의 아름다움에 대한 감탄을 자연스럽게 표현해주세요.
문장이 중간에 끊어지지 않도록 주의해주세요.`

  return prompt
}

// Fallback responses if OpenAI fails (200자 내외 완전한 문장)
export const fallbackResponses = [
  "식물과 함께하는 일상이 정말 아름다워요! 🌱 이런 소중한 순간들을 공유해주셔서 감사해요. 자연의 생명력이 느껴지는 멋진 포스트네요! 앞으로도 식물과의 행복한 시간들을 많이 보여주세요! 💚",
  "자연과 함께하는 삶이 얼마나 멋진지 보여주시네요! 🍃 식물을 사랑하는 마음이 전해져와서 정말 감동이에요. 이런 따뜻한 순간들이 모여서 더 아름다운 세상을 만들어가는 것 같아요! ✨",
  "식물을 사랑하는 마음이 전해져요! 💚 정말 감사해요. 자연과의 교감이 느껴지는 멋진 사진이네요! 이런 순간들을 기록하고 공유해주시는 모습이 너무 아름다워요. 계속해서 식물 친구들과 행복하세요! 🌿",
  "이런 따뜻한 순간을 공유해주셔서 고마워요! ✨ 식물과의 교감이 느껴지는 정말 멋진 포스트예요. 자연의 아름다움을 일깨워주시는 모습이 감동적이에요! 앞으로도 이런 소중한 이야기들 많이 들려주세요! 🌱",
  "자연의 아름다움을 일깨워주셔서 감사해요! 🌿 식물과 함께하는 일상이 정말 특별해 보여요. 이런 순간들이 얼마나 소중한지 다시 한번 느끼게 해주시네요! 계속해서 식물 친구들과의 행복한 시간 보내세요! 💚"
]
