import { supabase } from './supabase'

export interface UploadResult {
  url: string | null
  error: string | null
}

export const uploadPlantImage = async (
  file: File,
  userId: string
): Promise<UploadResult> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { url: null, error: '이미지 파일만 업로드 가능합니다.' }
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return { url: null, error: '파일 크기는 5MB 이하여야 합니다.' }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('plant-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return { url: null, error: error.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('plant-images')
      .getPublicUrl(data.path)

    return { url: publicUrl, error: null }
  } catch (error) {
    console.error('Upload error:', error)
    return { url: null, error: '이미지 업로드 중 오류가 발생했습니다.' }
  }
}

export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract file path from URL
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split('/')
    const fileName = pathParts[pathParts.length - 1]
    const folderName = pathParts[pathParts.length - 2]
    const filePath = `${folderName}/${fileName}`

    const { error } = await supabase.storage
      .from('plant-images')
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

// Utility function to compress image before upload
export const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio

      // Draw and compress
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            resolve(file) // Return original if compression fails
          }
        },
        file.type,
        quality
      )
    }

    img.src = URL.createObjectURL(file)
  })
}
