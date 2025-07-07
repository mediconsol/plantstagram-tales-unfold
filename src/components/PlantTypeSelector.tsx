import React from 'react'
import { plantTypes, PlantTypeOption } from '@/data/plantTypes'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlantTypeSelectorProps {
  selectedType: string
  onTypeSelect: (type: string) => void
  disabled?: boolean
}

export const PlantTypeSelector: React.FC<PlantTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
  disabled = false
}) => {
  const handleTypeSelect = (plantType: PlantTypeOption) => {
    if (disabled) return
    
    // Toggle selection - if already selected, deselect
    if (selectedType === plantType.name) {
      onTypeSelect('')
    } else {
      onTypeSelect(plantType.name)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-pretendard font-medium text-foreground mb-2">
          어떤 식물인가요? 🌱
        </h3>
        <p className="text-sm text-muted-foreground font-pretendard">
          식물 종류를 선택하면 더 많은 사람들이 찾을 수 있어요
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {plantTypes.map((plantType) => {
          const isSelected = selectedType === plantType.name
          
          return (
            <Card
              key={plantType.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                isSelected 
                  ? `ring-2 ring-primary ${plantType.bgColor}` 
                  : `border-2 hover:border-primary/30 ${plantType.bgColor}`,
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleTypeSelect(plantType)}
            >
              <CardContent className="p-4 text-center relative">
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  </div>
                )}

                {/* Plant emoji */}
                <div className="text-3xl mb-2">
                  {plantType.emoji}
                </div>

                {/* Plant name */}
                <h4 className={cn(
                  "font-pretendard font-medium text-sm mb-1",
                  plantType.color
                )}>
                  {plantType.name}
                </h4>

                {/* Description */}
                <p className="text-xs text-muted-foreground font-pretendard leading-tight">
                  {plantType.description}
                </p>

                {/* Selected badge */}
                {isSelected && (
                  <Badge 
                    variant="default" 
                    className="mt-2 text-xs bg-primary/10 text-primary border-primary/20"
                  >
                    선택됨
                  </Badge>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Selected type display */}
      {selectedType && (
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <p className="font-pretendard text-sm text-foreground">
            선택된 식물: <span className="font-medium text-primary">{selectedType}</span>
          </p>
          <button
            onClick={() => onTypeSelect('')}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
            disabled={disabled}
          >
            선택 해제
          </button>
        </div>
      )}

      {/* Optional message */}
      {!selectedType && (
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 font-pretendard">
            💡 식물 종류를 선택하지 않아도 포스트를 작성할 수 있어요!
          </p>
        </div>
      )}
    </div>
  )
}
