import { useCallback, useEffect, useRef, useState } from "react";

// usePlaces.ts에 있던 "탭별 캐싱 + 즉시 스켈레톤" 패턴을 범용화한 훅.
// key가 같으면 메모리 캐시를 즉시 보여주고, 없으면 데이터를 비운 채 loading=true로
// 시작해 스켈레톤을 보여준 뒤 fetcher 결과로 교체한다.
const cache = new Map<string, unknown>();

export function invalidateCachedQuery(keyOrPrefix?: string) {
  if (!keyOrPrefix) {
    cache.clear();
    return;
  }
  for (const k of cache.keys()) {
    if (k === keyOrPrefix || k.startsWith(`${keyOrPrefix}::`)) cache.delete(k);
  }
}

export function useCachedQuery<T>(
  key: string | null,
  fetcher: () => Promise<T>,
  options?: { skip?: boolean }
) {
  const skip = options?.skip ?? false;
  const active = !skip && !!key;

  const [data, setData] = useState<T | null>(() =>
    active && cache.has(key!) ? (cache.get(key!) as T) : null
  );
  const [loading, setLoading] = useState(() => active && !cache.has(key!));
  const [error, setError] = useState<string | null>(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(
    async (force = false) => {
      if (!active) return;
      if (!force && cache.has(key!)) {
        setData(cache.get(key!) as T);
        setLoading(false);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const result = await fetcherRef.current();
        cache.set(key!, result);
        setData(result);
      } catch (e: any) {
        setError(e?.message ?? "요청에 실패했습니다");
      } finally {
        setLoading(false);
      }
    },
    [key, active]
  );

  useEffect(() => {
    if (!active) {
      setData(null);
      setLoading(false);
      return;
    }
    if (cache.has(key!)) {
      // 이미 받아온 key — 로딩 없이 바로 표시
      setData(cache.get(key!) as T);
      setLoading(false);
    } else {
      // 처음 보는 key — 이전 데이터가 잔상처럼 남지 않도록 즉시 비움
      setData(null);
      setLoading(true);
    }
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, active]);

  return { data, loading, error, refresh: () => run(true) };
}
