import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import l1 from "@/assets/matterport/property-3.jpg";
import l2 from "@/assets/listing-2.jpg";
import l3 from "@/assets/listing-3.jpg";
import { SiteHeader } from "@/components/site-header";
import { Filter } from "lucide-react";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "\uc9c0\ub3c4 \u2014 \ub85c\ucee4\ubd80\ub3d9\uc0b0\uc911\uac1c\ubc95\uc778" },
      { name: "description", content: "\uc9c0\ub3c4\uc5d0\uc11c \ub9e4\ubb3c \uc704\uce58\ub97c \ud655\uc778\ud558\uc138\uc694." },
    ],
  }),
  component: MapPage,
});

const LISTINGS = [
  { id: 1, slug: "teheran-prime-office", img: l1, area: "\uac15\ub0a8\uad6c \u00b7 \uc5ed\uc0bc\ub3d9", title: "\ud14c\ud5e4\ub780\ub85c \ud504\ub77c\uc784 \uc624\ud53c\uc2a4", price: 48000000000, priceStr: "480\uc5b5", spec: "B4 / 15F \u00b7 \uc5f0 6,200\u33a1 \u00b7 \ub300\uc9c0 760\u33a1", type: "\ud504\ub77c\uc784 \uc624\ud53c\uc2a4", yield: 1.1, landArea: 760, totalArea: 6200, lat: 37.502, lng: 127.039 },
  { id: 2, slug: "dosan-corner", img: l2, area: "\uac15\ub0a8\uad6c \u00b7 \uc2e0\uc0ac\ub3d9", title: "\ub3c4\uc0b0\ub300\ub85c \ucf54\ub108 \ube4c\ub529", price: 32000000000, priceStr: "320\uc5b5", spec: "B2 / 8F \u00b7 \uc5f0 3,400\u33a1 \u00b7 \ub300\uc9c0 420\u33a1", type: "\ucf54\ub108 \ube4c\ub529", yield: 2.1, landArea: 420, totalArea: 3400, lat: 37.522, lng: 127.033 },
  { id: 3, slug: "yeoksam-income", img: l3, area: "\uac15\ub0a8\uad6c \u00b7 \uc5ed\uc0bc\ub3d9", title: "\uc5ed\uc0bc \uc218\uc775\ud615 \ube4c\ub529", price: 21500000000, priceStr: "215\uc5b5", spec: "B2 / 7F \u00b7 \uc5f0 2,800\u33a1 \u00b7 \ub300\uc9c0 360\u33a1", type: "\uc218\uc775\ud615", yield: 3.1, landArea: 360, totalArea: 2800, lat: 37.498, lng: 127.036 },
  { id: 4, slug: "samsung-hq", img: l1, area: "\uac15\ub0a8\uad6c \u00b7 \uc0bc\uc131\ub3d9", title: "\uc0bc\uc131\ub3d9 \uc0ac\uc625\ud615 \ube4c\ub529", price: 54000000000, priceStr: "540\uc5b5", spec: "B4 / 12F \u00b7 \uc5f0 5,400\u33a1 \u00b7 \ub300\uc9c0 680\u33a1", type: "\uc0ac\uc625\ud615", yield: 4.1, landArea: 680, totalArea: 5400, lat: 37.511, lng: 127.058 },
  { id: 5, slug: "seocho-gangnam", img: l2, area: "\uc11c\ucd08\uad6c \u00b7 \uc11c\ucd08\ub3d9", title: "\uc11c\ucd08 \uac15\ub0a8\ub300\ub85c \ube4c\ub529", price: 26000000000, priceStr: "260\uc5b5", spec: "B3 / 9F \u00b7 \uc5f0 3,100\u33a1 \u00b7 \ub300\uc9c0 410\u33a1", type: "\uc218\uc775\ud615", yield: 4.5, landArea: 410, totalArea: 3100, lat: 37.494, lng: 127.013 },
  { id: 6, slug: "jamsil-main", img: l3, area: "\uc1a1\ud30c\uad6c \u00b7 \uc7a0\uc2e4\ub3d9", title: "\uc7a0\uc2e4 \uba54\uc778 \ube4c\ub529", price: 41000000000, priceStr: "410\uc5b5", spec: "B3 / 11F \u00b7 \uc5f0 4,800\u33a1 \u00b7 \ub300\uc9c0 590\u33a1", type: "\ud504\ub77c\uc784 \uc624\ud53c\uc2a4", yield: 6.1, landArea: 590, totalArea: 4800, lat: 37.513, lng: 127.100 },
];

function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [clustererInstance, setClustererInstance] = useState<any>(null);
  
  const [priceFilter, setPriceFilter] = useState("\uc804\uccb4");
  const [landAreaFilter, setLandAreaFilter] = useState("\uc804\uccb4");
  const [totalAreaFilter, setTotalAreaFilter] = useState("\uc804\uccb4");
  const [yieldFilter, setYieldFilter] = useState("\uc804\uccb4");

  const filteredListings = LISTINGS.filter((l) => {
    if (priceFilter !== "\uc804\uccb4") {
      const limit = parseInt(priceFilter.replace(/[^0-9]/g, "")) * 100000000;
      if (l.price > limit) return false;
    }
    if (landAreaFilter !== "\uc804\uccb4") {
      const limit = parseInt(landAreaFilter.replace(/[^0-9]/g, ""));
      if (l.landArea < limit) return false;
    }
    if (totalAreaFilter !== "\uc804\uccb4") {
      const limit = parseInt(totalAreaFilter.replace(/[^0-9]/g, ""));
      if (l.totalArea < limit) return false;
    }
    if (yieldFilter !== "\uc804\uccb4") {
      const limit = parseInt(yieldFilter.replace(/[^0-9]/g, ""));
      if (l.yield < limit) return false;
    }
    return true;
  });

  const initMap = useCallback(() => {
    if (typeof window === "undefined") return;
    // @ts-ignore
    if (!mapRef.current || !window.kakao || !window.kakao.maps) return;
    
    const options = {
      // @ts-ignore
      center: new window.kakao.maps.LatLng(37.505, 127.050),
      level: 6,
    };
    // @ts-ignore
    const map = new window.kakao.maps.Map(mapRef.current, options);
    setMapInstance(map);
    
    // @ts-ignore
    const clusterer = new window.kakao.maps.MarkerClusterer({
      map: map,
      averageCenter: true,
      minLevel: 5,
      calculator: [10, 30, 50],
      texts: (count: number) => count.toString(),
      styles: [{
        width: '30px', height: '30px',
        background: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '15px',
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: '30px'
      }]
    });
    setClustererInstance(clusterer);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const tryInit = () => {
      // @ts-ignore
      if (window.kakao && window.kakao.maps) {
        // @ts-ignore
        if (window.kakao.maps.Map) {
          initMap();
        } else {
          // @ts-ignore
          window.kakao.maps.load(() => {
            initMap();
          });
        }
        return;
      }
      // SDK not yet loaded, retry after a short delay
      setTimeout(tryInit, 200);
    };

    tryInit();
  }, [initMap]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // @ts-ignore
    if (!mapInstance || !clustererInstance || !window.kakao) return;

    clustererInstance.clear();

    const newMarkers = filteredListings.map(l => {
      // @ts-ignore
      const marker = new window.kakao.maps.Marker({
        // @ts-ignore
        position: new window.kakao.maps.LatLng(l.lat, l.lng),
        title: l.title
      });

      // @ts-ignore
      window.kakao.maps.event.addListener(marker, 'click', function() {
        const el = document.getElementById(`listing-${l.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('bg-secondary');
          setTimeout(() => el.classList.remove('bg-secondary'), 1500);
        }
      });

      return marker;
    });

    clustererInstance.addMarkers(newMarkers);
    
    if (newMarkers.length > 0) {
      // @ts-ignore
      const bounds = new window.kakao.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      mapInstance.setBounds(bounds);
    }
  }, [mapInstance, clustererInstance, filteredListings.map(l => l.id).join(",")]);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <SiteHeader />
      
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden border-t border-border mt-20">
        <div className="w-full lg:w-[45%] flex flex-col h-full border-r border-border bg-background z-10 shadow-xl">
          
          <div className="p-4 border-b border-border flex flex-wrap items-center gap-2 bg-secondary/10 shrink-0">
            <div className="flex items-center gap-2 mr-2">
              <Filter size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium">{"\ud544\ud130"}</span>
            </div>
            
            <select 
              className="px-3 py-1.5 border border-border rounded-full bg-background text-sm cursor-pointer outline-none focus:ring-1 focus:ring-foreground transition-colors hover:border-foreground/50"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value={"\uc804\uccb4"}>{"\uac00\uaca9 (\uc804\uccb4)"}</option>
              <option value={"300\uc5b5 \uc774\ud558"}>{"300\uc5b5 \uc774\ud558"}</option>
              <option value={"400\uc5b5 \uc774\ud558"}>{"400\uc5b5 \uc774\ud558"}</option>
              <option value={"500\uc5b5 \uc774\ud558"}>{"500\uc5b5 \uc774\ud558"}</option>
            </select>

            <select 
              className="px-3 py-1.5 border border-border rounded-full bg-background text-sm cursor-pointer outline-none focus:ring-1 focus:ring-foreground transition-colors hover:border-foreground/50"
              value={landAreaFilter}
              onChange={(e) => setLandAreaFilter(e.target.value)}
            >
              <option value={"\uc804\uccb4"}>{"\ud1a0\uc9c0\uba74\uc801 (\uc804\uccb4)"}</option>
              <option value={"400\u33a1 \uc774\uc0c1"}>{"400\u33a1 \uc774\uc0c1"}</option>
              <option value={"500\u33a1 \uc774\uc0c1"}>{"500\u33a1 \uc774\uc0c1"}</option>
              <option value={"600\u33a1 \uc774\uc0c1"}>{"600\u33a1 \uc774\uc0c1"}</option>
            </select>

            <select 
              className="px-3 py-1.5 border border-border rounded-full bg-background text-sm cursor-pointer outline-none focus:ring-1 focus:ring-foreground transition-colors hover:border-foreground/50"
              value={totalAreaFilter}
              onChange={(e) => setTotalAreaFilter(e.target.value)}
            >
              <option value={"\uc804\uccb4"}>{"\uc5f0\uba74\uc801 (\uc804\uccb4)"}</option>
              <option value={"3000\u33a1 \uc774\uc0c1"}>{"3000\u33a1 \uc774\uc0c1"}</option>
              <option value={"4000\u33a1 \uc774\uc0c1"}>{"4000\u33a1 \uc774\uc0c1"}</option>
              <option value={"5000\u33a1 \uc774\uc0c1"}>{"5000\u33a1 \uc774\uc0c1"}</option>
            </select>

            <select 
              className="px-3 py-1.5 border border-border rounded-full bg-background text-sm cursor-pointer outline-none focus:ring-1 focus:ring-foreground transition-colors hover:border-foreground/50"
              value={yieldFilter}
              onChange={(e) => setYieldFilter(e.target.value)}
            >
              <option value={"\uc804\uccb4"}>{"\uc218\uc775\ub960 (\uc804\uccb4)"}</option>
              <option value={"3% \uc774\uc0c1"}>{"3% \uc774\uc0c1"}</option>
              <option value={"4% \uc774\uc0c1"}>{"4% \uc774\uc0c1"}</option>
              <option value={"5% \uc774\uc0c1"}>{"5% \uc774\uc0c1"}</option>
            </select>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="text-sm font-medium text-foreground pb-3 mb-4 border-b border-border">
              {"\ucd1d"} {filteredListings.length}{"\uac1c\uc758 \ub9e4\ubb3c"}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filteredListings.map(l => (
                <Link
                  key={l.id}
                  to={l.id === 1 ? "/listings/teheran-prime-office" : "/listings"}
                  id={`listing-${l.id}`}
                  className="group block rounded-xl overflow-hidden border border-border bg-background hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={l.img}
                      alt={l.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-2xl font-bold tracking-tight" style={{ color: "#446fe7" }}>
                      {l.priceStr}
                    </div>
                    <div className="mt-1.5 text-xs text-muted-foreground flex items-center gap-2">
                      <span>{l.type}</span>
                      <span className="opacity-40">|</span>
                      <span>{"\uc218\uc775\ub960"} {l.yield}%</span>
                      <span className="opacity-40">|</span>
                      <span>{l.totalArea.toLocaleString()}{"\u33a1"}</span>
                    </div>
                    <div className="mt-3 text-foreground text-2xl font-normal">{l.title}</div>
                    <div className="text-xs text-muted-foreground">{l.area}</div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredListings.length === 0 && (
              <div className="py-24 text-center">
                <div className="text-muted-foreground mb-4">{"\uc870\uac74\uc5d0 \ub9de\ub294 \ub9e4\ubb3c\uc774 \uc5c6\uc2b5\ub2c8\ub2e4."}</div>
                <button
                  onClick={() => {
                    setPriceFilter("\uc804\uccb4");
                    setLandAreaFilter("\uc804\uccb4");
                    setTotalAreaFilter("\uc804\uccb4");
                    setYieldFilter("\uc804\uccb4");
                  }}
                  className="px-5 py-2.5 bg-foreground text-background rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  {"\ud544\ud130 \ucd08\uae30\ud654"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-[55%] shrink-0" style={{ height: "calc(100vh - 5rem)" }}>
          <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
    </div>
  );
}
