import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad"> {
  fallback?: string;
}

export function OptimizedImage({
  src,
  alt,
  fallback = "/placeholder.png",
  className = "",
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative">
      {isLoading && (
        <LoadingSkeleton className={`absolute inset-0 ${className}`} />
      )}
      <Image
        src={error ? fallback : src}
        alt={alt}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        {...props}
      />
    </div>
  );
}
