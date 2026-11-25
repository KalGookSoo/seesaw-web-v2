'use client';

import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Modal } from '@/components/ui/modal';

type Address = Readonly<{ roadAddress: string; jibunAddress: string }>;

export function AddressSearchModal({ open, onClose, onSelect }: Readonly<{
  open: boolean;
  onClose: () => void;
  onSelect: (address: string) => void;
}>) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Address[]>([]);
  const [message, setMessage] = useState('도로명 또는 지번 주소를 입력해주세요.');
  const [loading, setLoading] = useState(false);
  const activeRequest = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    return () => activeRequest.current?.abort();
  }, [open]);

  async function search() {
    const value = query.trim();
    activeRequest.current?.abort();
    if (value.length < 2 || value.length > 200) {
      setResults([]);
      setLoading(false);
      setMessage('주소를 2자 이상 200자 이하로 입력해주세요.');
      return;
    }
    const controller = new AbortController();
    activeRequest.current = controller;
    setLoading(true);
    setResults([]);
    setMessage('주소를 검색하고 있습니다.');
    try {
      const response = await fetch(`/api/maps/geocode?${new URLSearchParams({ query: value })}`, { signal: controller.signal, cache: 'no-store' });
      if (!response.ok) throw new Error();
      const data = await response.json() as { addresses: Address[] };
      if (controller.signal.aborted) return;
      setResults(data.addresses);
      setMessage(data.addresses.length ? '주소를 선택해주세요.' : '검색 결과가 없습니다. 도로명이나 지번을 확인해주세요.');
    } catch {
      if (!controller.signal.aborted) setMessage('주소를 검색하지 못했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }

  function close() {
    activeRequest.current?.abort();
    setLoading(false);
    setResults([]);
    setQuery('');
    setMessage('도로명 또는 지번 주소를 입력해주세요.');
    onClose();
  }

  return (
    <Modal open={open} onClose={close} title="주소 검색" description="도로명 또는 지번 주소를 검색해 선택하세요." variant="editorial">
      <div className="flex gap-2">
        <input ref={inputRef} aria-label="검색할 주소" className="form-control min-w-0 flex-1 text-base" value={query} maxLength={200} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); event.stopPropagation(); void search(); } }} placeholder="예: 대전 동구 백룡로 20" />
        <button className="bg-default-primary text-default-primary-contrast hover:bg-default-primary-muted inline-flex shrink-0 items-center gap-2 px-4 text-sm font-semibold disabled:opacity-50" type="button" disabled={loading} onClick={search}><Search aria-hidden className="size-4" />검색</button>
      </div>
      <p className="text-default-secondary-label mt-4 text-sm" role="status">{message}</p>
      {results.length ? <ul className="border-default-separator mt-3 max-h-[min(18rem,40dvh)] overflow-y-auto border">{results.map((address, index) => {
        const selected = address.roadAddress || address.jibunAddress;
        return <li className="border-default-separator border-b last:border-b-0" key={`${selected}-${index}`}><button type="button" className="hover:bg-default-fill focus-visible:outline-default-label w-full px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px]" onClick={() => { onSelect(selected); close(); }}><span className="text-default-label block text-sm font-semibold">{selected}</span>{address.roadAddress && address.jibunAddress ? <span className="text-default-tertiary-label mt-1 block text-xs">지번 {address.jibunAddress}</span> : null}</button></li>;
      })}</ul> : null}
    </Modal>
  );
}
