/**
 * Detects if a filename suggests NSFW content
 */
export function detectNSFWFromFilename(filename: string | null | undefined): boolean {
  if (!filename) return false

  const lowerFilename = filename.toLowerCase()

  // List of keywords that might indicate NSFW content
  const nsfwKeywords = [
    "nsfw",
    "adult",
    "xxx",
    "sexy",
    "hot",
    "nude",
    "naked",
    "porn",
    "explicit",
    "sex",
    "adult",
    "erotic",
  ]

  return nsfwKeywords.some((keyword) => lowerFilename.includes(keyword))
}

/**
 * Determines the appropriate model type based on the filename
 */
export function determineModelType(filename: string | null | undefined): string | undefined {
  if (!filename) return undefined

  if (detectNSFWFromFilename(filename)) {
    return "nsfw"
  }

  return undefined
}
