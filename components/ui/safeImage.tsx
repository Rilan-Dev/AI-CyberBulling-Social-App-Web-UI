"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string
}

/**
 * SafeImage component that handles image loading errors gracefully
 * It will attempt to load the provided src, and if it fails, will show a fallback image
 */
const SafeImage = ({ src, alt, fallbackSrc = "/placeholder.svg", className, ...props }: SafeImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>(typeof src === "string" ? src : fallbackSrc)
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!src) return;

    fetch(typeof src === "string" ? src : fallbackSrc, { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          setImgSrc(typeof src === "string" ? src : fallbackSrc);
        }
      })
      .catch(() => {
        // silently fail to fallback
      })
      .finally(() => {
        setChecked(true);
      });
  }, [src]);

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // useEffect(() => {
  //   if (typeof src === "string") {
  //     setImgSrc(typeof src === "string" ? src : fallbackSrc)
  //     setIsLoading(true)
  //     setHasError(false)
  //   }
  // }, [src])

  const handleError = () => {
    setHasError(true)
    setImgSrc(fallbackSrc)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  // Don’t render until check is done
  if (!checked) return null;

  return (
    <div className={cn("relative", className)}>
      <Image
        {...props}
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading && !hasError ? "opacity-0" : "opacity-100",
          "",
        )}
        onLoadingComplete={handleLoad}
        onError={handleError}
      />
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default SafeImage;
