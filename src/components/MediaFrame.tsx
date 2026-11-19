import React, { useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface MediaFrameProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  mediaType?: 'image' | 'video';
  posterUrl?: string;
  className?: string;
  imgClassName?: string;
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const trimmed = url.trim();
    const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/);
    if (watchMatch && watchMatch[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}?rel=0&modestbranding=1`;
    }
    return null;
  } catch {
    return null;
  }
}

export function MediaFrame({
  src,
  alt,
  fallbackSrc,
  mediaType = 'image',
  posterUrl,
  className = '',
  imgClassName = 'w-full h-full object-cover object-top',
}: MediaFrameProps) {
  const [activeSrc, setActiveSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setActiveSrc(src);
    setHasError(false);
  }, [src]);

  const handleImgError = () => {
    if (fallbackSrc && activeSrc !== fallbackSrc) {
      setActiveSrc(fallbackSrc);
      return;
    }
    setHasError(true);
  };

  if (mediaType === 'video' && src) {
    const ytEmbed = getYouTubeEmbedUrl(src);
    if (ytEmbed) {
      return (
        <div className={`relative overflow-hidden bg-[#102644] ${className}`}>
          <iframe
            src={ytEmbed}
            title={alt}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    return (
      <div className={`relative overflow-hidden bg-[#102644] ${className}`}>
        <video
          src={src}
          poster={posterUrl}
          controls
          playsInline
          className="w-full h-full object-cover"
        >
          Trình duyệt của bạn không hỗ trợ phát video trực tiếp.
        </video>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#102644] ${className}`}>
      {!hasError && activeSrc ? (
        <img
          src={activeSrc}
          alt={alt}
          className={imgClassName}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          onError={handleImgError}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#081426] to-[#102644] text-slate-300">
          <ImageIcon className="w-8 h-8 text-[#F5BF35] mb-2 opacity-80" />
          <p className="text-xs font-medium text-slate-300 max-w-[220px]">{alt}</p>
        </div>
      )}
    </div>
  );
}
