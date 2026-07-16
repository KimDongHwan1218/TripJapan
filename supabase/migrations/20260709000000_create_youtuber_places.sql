-- 유튜버/인플루언서가 추천한 일본 여행 장소를 모아두는 테이블.
create table if not exists public.youtuber_places (
  id uuid primary key default gen_random_uuid(),
  name text not null,              -- 상호명
  address text,                    -- 위치 (주소 또는 지역명)
  latitude double precision,
  longitude double precision,
  category text,                   -- 분류 (라멘/스시/성지순례 등)
  info text,                       -- 정보 (설명, 영업시간, 메뉴 등)
  thumbnail_url text,              -- 썸네일이미지
  youtuber text not null,          -- 유튜버
  rating_note text,                -- 평가 (창작자의 큐레이션 문구)
  source_video_url text,           -- 출처 영상 URL
  source_type text,                -- shorts / long_form
  confidence text,                 -- high / medium / low
  extra jsonb,                     -- 기타
  created_at timestamptz not null default now()
);

alter table public.youtuber_places enable row level security;

-- 앱에서는 조회만 하고, 데이터 입력/수정은 대시보드(서비스 롤)에서만 수행한다.
create policy "youtuber_places_public_read"
  on public.youtuber_places
  for select
  using (true);
