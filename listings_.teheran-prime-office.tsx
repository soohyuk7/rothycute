import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import {
  Check,
  Phone,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building2,
  Maximize2,
  Calendar,
  Car,
  Snowflake,
  Box,
  X,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MatterportEmbed } from "@/components/matterport-embed";
import { cn } from "@/lib/utils";
import agentImg from "@/assets/agent.jpg";

const MATTERPORT_MODEL_ID = "nUTg54PrCCf";

type MediaTab = "photos" | "tour";

const photoModules = import.meta.glob<string>("@/assets/matterport/property-*.jpg", {
  eager: true,
  import: "default",
});

const PHOTOS = Object.entries(photoModules)
  .sort(([a], [b]) => {
    const num = (path: string) => Number(path.match(/property-(\d+)\.jpg$/)?.[1] ?? 0);
    return num(a) - num(b);
  })
  .map(([, url]) => url);

export const Route = createFileRoute("/listings_/teheran-prime-office")({
  head: () => ({
    meta: [
      { title: "테헤란로 프라임 오피스 — 로커부동산중개법인" },
      {
        name: "description",
        content:
          "강남구 테헤란로 프라임 오피스 빌딩. 680억원, 지상17층/지하4층, 연면적 3,616㎡.",
      },
    ],
  }),
  component: DetailPage,
});

const SUMMARY_POINTS = [
  "강남 최고의 입지",
  "연면적 3,616㎡의 대형 빌딩",
  "2017년 9월 준공, 신축급 컨디션",
  "역삼역 도보 7분",
];

const LAND_INFO: { label: string; value: string }[] = [
  { label: "대지면적", value: "334.1㎡ (101.07평)" },
  { label: "도로명", value: "테헤란로, 언주로89길" },
  { label: "공시지가(총)", value: "175.8억원" },
  { label: "인접도로너비", value: "60m" },
  { label: "역과의 거리", value: "역삼역 470m" },
];

const BUILDING_INFO: { label: string; value: string; icon: React.ReactNode }[] = [
  { label: "건축면적 / 건폐율", value: "192.36㎡ / 57.58%", icon: <Building2 className="h-5 w-5" /> },
  { label: "연면적 / 용적률", value: "3,616.59㎡ / 799.87%", icon: <Maximize2 className="h-5 w-5" /> },
  { label: "건물규모", value: "지상 17층 / 지하 4층", icon: <Building2 className="h-5 w-5" /> },
  { label: "준공일자", value: "2017년 09월", icon: <Calendar className="h-5 w-5" /> },
  { label: "구조", value: "철근콘크리트조", icon: <Building2 className="h-5 w-5" /> },
  { label: "냉·난방", value: "개별냉방 / 개별난방", icon: <Snowflake className="h-5 w-5" /> },
  { label: "엘리베이터", value: "1대", icon: <Building2 className="h-5 w-5" /> },
  { label: "주차", value: "18대 (기계식)", icon: <Car className="h-5 w-5" /> },
];

function DetailPage() {
  const [idx, setIdx] = useState(0);
  const [mediaTab, setMediaTab] = useState<MediaTab>("photos");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const photoCount = PHOTOS.length;

  useEffect(() => {
    if (mediaTab !== "photos" || photoCount === 0 || lightboxOpen) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % photoCount), 4000);
    return () => clearInterval(t);
  }, [mediaTab, photoCount, lightboxOpen]);

  const prev = useCallback(() => setIdx((i) => (i - 1 + photoCount) % photoCount), [photoCount]);
  const next = useCallback(() => setIdx((i) => (i + 1) % photoCount), [photoCount]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, prev, next]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="pt-20 pb-16">
        <div className="px-6 lg:px-10 text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
          <Link to="/listings" className="hover:text-foreground">
            전체 매물
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">강남구 · 테헤란로</span>
        </div>

        <div className="relative overflow-hidden bg-muted" style={{ height: "54vh" }}>
          <div
            className="absolute top-4 left-4 z-20 flex rounded-full border border-border/60 bg-background/95 p-1 shadow-md backdrop-blur-sm"
            role="tablist"
            aria-label="매물 미디어"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mediaTab === "photos"}
              onClick={() => setMediaTab("photos")}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-colors",
                mediaTab === "photos"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              사진
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mediaTab === "tour"}
              onClick={() => setMediaTab("tour")}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-colors",
                mediaTab === "tour"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Box className="h-3.5 w-3.5" aria-hidden />
              3D Tour
            </button>
          </div>

          {mediaTab === "tour" ? (
            <MatterportEmbed
              modelId={MATTERPORT_MODEL_ID}
              title="테헤란로 프라임 오피스 3D Tour"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : photoCount > 0 ? (
            <>
              {PHOTOS.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`테헤란로 프라임 오피스 사진 ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  onClick={() => i === idx && setLightboxOpen(true)}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    i === idx ? "opacity-100 cursor-zoom-in" : "opacity-0 pointer-events-none"
                  }`}
                />
              ))}
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="이전 사진"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full h-10 w-10 flex items-center justify-center backdrop-blur transition z-10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="다음 사진"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full h-10 w-10 flex items-center justify-center backdrop-blur transition z-10"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 right-4 bg-background/85 px-3 py-1 text-xs tracking-widest backdrop-blur rounded-sm z-10">
                {idx + 1} / {photoCount}
              </div>
            </>
          ) : null}
        </div>

        {lightboxOpen && photoCount > 0 && (
          <div
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
              aria-label="닫기"
              className="absolute top-6 right-6 text-white/90 hover:text-white h-12 w-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <X className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="이전 사진"
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white h-14 w-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 transition"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="다음 사진"
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white h-14 w-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 transition"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
            <img
              src={PHOTOS[idx]}
              alt={`테헤란로 프라임 오피스 사진 ${idx + 1}`}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92vh] max-w-[92vw] object-contain"
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm tracking-widest">
              {idx + 1} / {photoCount}
            </div>
          </div>
        )}

        <section className="px-6 lg:px-10 max-w-[1400px] mx-auto mt-10 grid lg:grid-cols-[1fr_360px] gap-10">
          <div className="flex flex-col">
            <h2 className="font-display mb-5 text-4xl">매물 요약</h2>
            <ul className="flex-1 flex flex-col divide-y divide-border border-y border-border">
              {SUMMARY_POINTS.map((p, i) => (
                <li key={i} className="flex-1 flex items-center gap-4 py-5">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-foreground text-background flex items-center justify-center">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-foreground leading-[1.6] tracking-[-0.01em] text-2xl font-thin">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <aside>
            <div className="border border-border bg-card rounded-sm overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="eyebrow text-muted-foreground mb-2 text-sm tracking-[0.2em] uppercase">Price</div>
                <div className="font-bold tracking-tight text-4xl" style={{ color: "#446fe7" }}>
                  480억
                </div>
              </div>

              <div className="p-6">
                <div className="eyebrow text-muted-foreground mb-4 text-lg">담당 컨설턴트</div>

                <div className="flex items-center gap-4">
                  <img
                    src={agentImg}
                    alt="담당 에이전트 김관준"
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-full object-cover border border-border"
                  />
                  <div>
                    <div className="font-display leading-tight text-2xl">김관준 팀장</div>
                    <div className="text-muted-foreground mt-1 text-base">공인중개사</div>
                    <div className="text-muted-foreground mt-0.5 text-base">누적거래액 4,000억원+</div>
                  </div>
                </div>

                <a
                  href="tel:01000000000"
                  className="mt-6 flex items-center justify-center gap-2 w-full bg-foreground text-background py-3.5 text-sm tracking-[0.2em] uppercase hover:opacity-90 transition"
                >
                  <Phone className="h-4 w-4" />
                  010-0000-0000
                </a>

                <div className="mt-6 pt-6 border-t border-border flex justify-between text-xs text-muted-foreground">
                  <span className="text-lg">매물번호</span>
                  <span className="text-foreground text-lg">RK-16852</span>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="px-6 lg:px-10 max-w-[1400px] mx-auto mt-16">
          <h2 className="font-display text-2xl mb-6">매물 정보</h2>

          {/* 대지정보 */}
          <div className="mb-10">
            <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase border-l-2 border-foreground pl-3 mb-4">
              대지정보
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-border">
              {LAND_INFO.map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between gap-4 py-3.5 px-1 border-b border-border text-sm"
                >
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className="text-foreground font-medium">{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 건물정보 */}
          <div>
            <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase border-l-2 border-foreground pl-3 mb-4">
              건물정보
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {BUILDING_INFO.map((r) => (
                <div
                  key={r.label}
                  className="border border-border rounded-md p-4 bg-card flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {r.icon}
                    <span className="text-xs">{r.label}</span>
                  </div>
                  <div className="text-foreground font-medium text-base leading-tight">
                    {r.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-8 text-[15px] leading-relaxed text-muted-foreground max-w-3xl">
            테헤란로 메인 도로변에 위치한 프라임 오피스 빌딩으로, 역삼역까지 도보 7분 거리의 우수한
            접근성을 자랑합니다. 지상 17층 / 지하 4층, 연면적 3,616㎡ 규모의 신축급 빌딩으로
            업무시설(사무소)과 1·2종 근린생활시설이 혼재되어 안정적인 임대 수익이 가능합니다.
            기계식 주차 18대, 개별 냉난방, 엘리베이터 1대를 갖춘 사옥 및 임대 투자용으로 적합한
            매물입니다. 상단{" "}
            <strong className="text-foreground font-medium">3D Tour</strong>에서 Matterport 공간을
            직접 둘러볼 수 있습니다.
          </p>

          <Link
            to="/listings"
            className="mt-10 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> 목록으로
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
