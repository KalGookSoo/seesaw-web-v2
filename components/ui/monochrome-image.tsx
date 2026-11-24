'use client';

import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

type MonochromeImageProps = Readonly<{
  alt: string;
  className?: string;
  fallbackLabel?: string;
  imageClassName?: string;
  src: string;
}>;

export function MonochromeImageFallback({
  className = '',
  label = 'IMAGE / UNAVAILABLE'
}: Readonly<{ className?: string; label?: string }>) {
  return (
    <div role="img" aria-label="대체 이미지" className={`bg-default-fill text-default-tertiary-label flex size-full min-h-20 flex-col items-center justify-center gap-2 border border-default-separator px-4 text-center ${className}`}>
      <ImageIcon aria-hidden className="size-7" />
      <span className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase">{label}</span>
    </div>
  );
}

export function MonochromeImage({
  alt,
  className = '',
  fallbackLabel = 'IMAGE / UNAVAILABLE',
  imageClassName = '',
  src
}: MonochromeImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {status === 'loading' ? (
        <span className="border-default-fill-strong border-t-default-label absolute left-1/2 top-1/2 z-10 size-7 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2" aria-label="이미지 불러오는 중" />
      ) : null}
      {status === 'error' ? (
        <MonochromeImageFallback label={fallbackLabel} />
      ) : (
        <img
          alt={alt}
          className={`size-full transition-[opacity,filter] duration-300 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'} ${imageClassName}`}
          src={src}
          onError={() => setStatus('error')}
          onLoad={() => setStatus('loaded')}
        />
      )}
    </div>
  );
}
