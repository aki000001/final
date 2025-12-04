import type { Media } from "./types"

export const handleMediaUpload = (file: File): Promise<Media> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      resolve({
        id: Math.random().toString(36).substring(7),
        type: file.type.startsWith("video/") ? "video" : "image",
        url: reader.result as string,
      })
    }
    reader.readAsDataURL(file)
  })
}
