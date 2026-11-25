'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

type Address = Readonly<{
  roadAddress: string;
  jibunAddress: string;
  latitude: number;
  longitude: number;
}>;

type NaverMaps = {
  LatLng: new (latitude: number, longitude: number) => unknown;
  Map: new (element: HTMLElement, options: { center: unknown; zoom: number }) => { destroy: () => void };
  Marker: new (options: { position: unknown; map: unknown }) => unknown;
};

declare global {
  interface Window {
    naver?: { maps?: NaverMaps };
    navermap_authFailure?: () => void;
  }
}

const clientId = process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID;

export function ScheduleLocationMap({ location }: Readonly<{ location: string }>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [status, setStatus] = useState<'loading' | 'not-found' | 'error' | 'ready'>('loading');
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    const previous = window.navermap_authFailure;
    const handleAuthFailure = () => {
      previous?.();
      setStatus('error');
    };
    window.navermap_authFailure = handleAuthFailure;
    return () => {
      if (window.navermap_authFailure === handleAuthFailure) window.navermap_authFailure = previous;
    };
  }, []);

  useEffect(() => {
    if (!clientId) {
      setStatus('error');
      return;
    }

    const controller = new AbortController();
    setStatus('loading');
    setAddress(null);
    const params = new URLSearchParams({ query: location });
    fetch(`/api/maps/geocode?${params}`, { signal: controller.signal, cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Geocoding failed');
        return response.json() as Promise<{ addresses: Address[] }>;
      })
      .then(({ addresses }) => {
        const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();
        const query = normalize(location);
        const exact = addresses.find((item) => [item.roadAddress, item.jibunAddress].some((value) => normalize(value) === query));
        const matching = addresses.filter((item) => [item.roadAddress, item.jibunAddress].some((value) => normalize(value).startsWith(`${query} `)));
        const match = exact ?? (matching.length === 1 ? matching[0] : undefined);
        if (!match) {
          setStatus('not-found');
          return;
        }
        setAddress(match);
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('error');
      });
    return () => controller.abort();
  }, [location]);

  useEffect(() => {
    if (!address || !scriptReady || !containerRef.current) return;
    const maps = window.naver?.maps;
    if (!maps) {
      setStatus('error');
      return;
    }
    try {
      const position = new maps.LatLng(address.latitude, address.longitude);
      const map = new maps.Map(containerRef.current, { center: position, zoom: 16 });
      new maps.Marker({ position, map });
      setStatus('ready');
      return () => map.destroy();
    } catch {
      setStatus('error');
    }
  }, [address, scriptReady]);

  return (
    <div className="border-default-separator bg-default-surface-grouped mt-4 border">
      {address && clientId ? (
        <Script
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(clientId)}`}
          onReady={() => setScriptReady(true)}
          onError={() => setStatus('error')}
        />
      ) : null}
      {status === 'loading' ? <p className="text-default-secondary-label px-4 py-6 text-sm" role="status">지도를 불러오는 중입니다.</p> : null}
      {status === 'not-found' ? <p className="text-default-secondary-label px-4 py-6 text-sm" role="status">정확한 주소를 찾을 수 없어 지도를 표시하지 못했습니다.</p> : null}
      {status === 'error' ? <p className="text-default-secondary-label px-4 py-6 text-sm" role="status">지도를 불러오지 못했습니다.</p> : null}
      {address ? <div ref={containerRef} className={status === 'error' ? 'hidden' : 'h-60 w-full'} aria-label={`${location} 지도`} /> : null}
    </div>
  );
}
