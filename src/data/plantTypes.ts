export interface PlantTypeOption {
  id: string
  name: string
  emoji: string
  description: string
  color: string
  bgColor: string
}

export const plantTypes: PlantTypeOption[] = [
  {
    id: 'succulent',
    name: '다육식물',
    emoji: '🌵',
    description: '통통하고 귀여운 다육이들',
    color: 'text-green-700',
    bgColor: 'bg-green-50 hover:bg-green-100 border-green-200'
  },
  {
    id: 'foliage',
    name: '관엽식물',
    emoji: '🌿',
    description: '싱그러운 잎이 아름다운 식물',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
  },
  {
    id: 'flowering',
    name: '꽃식물',
    emoji: '🌸',
    description: '화려한 꽃을 피우는 식물',
    color: 'text-pink-700',
    bgColor: 'bg-pink-50 hover:bg-pink-100 border-pink-200'
  },
  {
    id: 'herb',
    name: '허브',
    emoji: '🌱',
    description: '향긋한 허브 식물들',
    color: 'text-lime-700',
    bgColor: 'bg-lime-50 hover:bg-lime-100 border-lime-200'
  },
  {
    id: 'cactus',
    name: '선인장',
    emoji: '🌵',
    description: '가시가 있는 독특한 선인장',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200'
  },
  {
    id: 'fern',
    name: '양치식물',
    emoji: '🌿',
    description: '우아한 잎 모양의 양치류',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50 hover:bg-teal-100 border-teal-200'
  },
  {
    id: 'fruit-tree',
    name: '과일나무',
    emoji: '🍎',
    description: '맛있는 열매를 맺는 나무',
    color: 'text-red-700',
    bgColor: 'bg-red-50 hover:bg-red-100 border-red-200'
  },
  {
    id: 'vegetable',
    name: '채소',
    emoji: '🥬',
    description: '신선한 채소들',
    color: 'text-green-700',
    bgColor: 'bg-green-50 hover:bg-green-100 border-green-200'
  },
  {
    id: 'air-plant',
    name: '공기정화식물',
    emoji: '🍃',
    description: '공기를 깨끗하게 해주는 식물',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200'
  },
  {
    id: 'climbing',
    name: '덩굴식물',
    emoji: '🌿',
    description: '기어오르는 덩굴 식물',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200'
  },
  {
    id: 'bonsai',
    name: '분재',
    emoji: '🌳',
    description: '작고 아름다운 분재',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 hover:bg-amber-100 border-amber-200'
  },
  {
    id: 'other',
    name: '기타',
    emoji: '🌺',
    description: '특별한 나만의 식물',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
  }
]

export const getPlantTypeById = (id: string): PlantTypeOption | undefined => {
  return plantTypes.find(type => type.id === id)
}

export const getPlantTypeByName = (name: string): PlantTypeOption | undefined => {
  return plantTypes.find(type => type.name === name)
}
