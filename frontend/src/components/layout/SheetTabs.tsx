import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CALC_SHEETS } from "../../config/sheets";

type Props = {
  currentPath: string;
};

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      {dir === "left" ? (
        <path d="M12.5 4.5 7 10l5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M7.5 4.5 13 10l-5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

export function SheetTabs({ currentPath }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateOverflow = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(max > 4 && el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateOverflow();
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(el);
    window.addEventListener("resize", updateOverflow);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateOverflow);
    };
  }, [updateOverflow]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    const id = window.setTimeout(updateOverflow, 400);
    return () => window.clearTimeout(id);
  }, [currentPath, updateOverflow]);

  const currentIndex = CALC_SHEETS.findIndex((sheet) => sheet.path === currentPath);

  return (
    <nav aria-label="Calculator sheets" className="sheet-tabs-bar shrink-0 px-4 lg:px-10">
      {currentIndex >= 0 ? (
        <p className="hidden shrink-0 text-xs font-semibold tabular-nums text-slate-500 sm:block">
          {currentIndex + 1}
          <span className="font-medium text-slate-400"> / {CALC_SHEETS.length}</span>
        </p>
      ) : null}

      <button
        type="button"
        className="sheet-tabs-arrow"
        aria-label="Scroll to previous sheets"
        disabled={!canScrollLeft}
        onClick={() => scrollerRef.current?.scrollBy({ left: -240, behavior: "smooth" })}
      >
        <Chevron dir="left" />
      </button>

      <div ref={scrollerRef} className="sheet-tabs-scroller" onScroll={updateOverflow}>
        {CALC_SHEETS.map((item) => {
          const active = item.path === currentPath;
          return (
            <Link
              key={item.id}
              ref={active ? activeRef : undefined}
              to={item.path}
              title={item.excelName}
              aria-label={item.tabLabel}
              aria-current={active ? "page" : undefined}
              className={active ? "sheet-tab sheet-tab-active" : "sheet-tab"}
            >
              <span className="sm:hidden" aria-hidden>
                {item.shortLabel}
              </span>
              <span className="hidden sm:inline" aria-hidden>
                {item.tabLabel}
              </span>
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        className="sheet-tabs-arrow"
        aria-label="Scroll to later sheets"
        disabled={!canScrollRight}
        onClick={() => scrollerRef.current?.scrollBy({ left: 240, behavior: "smooth" })}
      >
        <Chevron dir="right" />
      </button>
    </nav>
  );
}
