// components/SafeImage.tsx
import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  src: string;
  alt?: string;
  fallbackSrc?: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
};

const SafeImage = ({ src, alt, fallbackSrc = "/placeholder.svg", ...props }: Props) => {
  const [imgSrc, setImgSrc] = useState(fallbackSrc);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!src) return;

    fetch(src, { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          setImgSrc(src);
        }
      })
      .catch(() => {
        // silently fail to fallback
      })
      .finally(() => {
        setChecked(true);
      });
  }, [src]);

  // Don’t render until check is done
  if (!checked) return null;

  return (
    <Image
      src={imgSrc}
      alt={alt || "image"}
      {...props}
    />
  );
};

export default SafeImage;
