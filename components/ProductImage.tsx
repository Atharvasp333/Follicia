"use client";

import { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";

interface ProductImageProps {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  fallbackIcon?: boolean;
}

export default function ProductImage({
  src,
  alt,
  width,
  height,
  className,
  style,
  fallbackIcon = true,
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // If no src or image failed to load, show fallback
  if (!src || imageError) {
    return (
      <div
        className={className}
        style={{
          width: width ? `${width}px` : "100%",
          height: height ? `${height}px` : "100%",
          background: "linear-gradient(135deg, #F4F7F5 0%, #E8EDEB 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...style,
        }}
      >
        {fallbackIcon && <Package size={width ? width / 3 : 48} color="#9AABA5" />}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "100%",
        position: "relative",
        overflow: "hidden",
        background: imageLoaded ? "transparent" : "#F4F7F5",
        ...style,
      }}
    >
      {!imageLoaded && fallbackIcon && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <Package size={width ? width / 3 : 48} color="#9AABA5" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{
          objectFit: "cover",
          opacity: imageLoaded ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
        onError={() => setImageError(true)}
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
}
