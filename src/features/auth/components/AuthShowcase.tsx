// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { BellRing, FilePlus, Inbox, Search, ShieldAlert, type LucideIcon } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';
import { useShowcaseCarousel } from '../hooks/useShowcaseCarousel';
import { ShowcaseControls } from './ShowcaseControls';

type SlideId = (typeof LABELS.auth.showcase.slides)[number]['id'];

const SLIDE_ICONS: Readonly<Record<SlideId, LucideIcon>> = {
  report: FilePlus,
  triage: Inbox,
  investigate: Search,
  escalate: BellRing,
};

// Keep in step with the `duration-6000` progress fill in ShowcaseControls.
const SHOWCASE_INTERVAL_MS = 6000;

/**
 * The brand panel beside the login/register form: an auto-advancing carousel of product
 * highlights. Slides are stacked in one grid cell and cross-fade with a small horizontal
 * offset, so the panel's height is always the tallest slide's and nothing jumps.
 */
export function AuthShowcase(): ReactElement {
  const copy = LABELS.auth.showcase;
  const slides = copy.slides;
  const carousel = useShowcaseCarousel({ count: slides.length, intervalMs: SHOWCASE_INTERVAL_MS });

  return (
    <section
      aria-roledescription="carousel"
      aria-label={copy.regionLabel}
      className="relative isolate flex w-full flex-col justify-between gap-10 overflow-hidden bg-brand-deep bg-linear-to-br from-foreground via-brand-deep to-primary px-6 py-10 text-primary-foreground sm:px-10 lg:px-14 lg:py-14"
      {...carousel.regionHandlers}
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-primary-foreground/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-20 -z-10 h-96 w-96 rounded-full bg-primary/40 blur-3xl"
        aria-hidden="true"
      />

      <p className="flex items-center gap-2.5 font-display text-base font-semibold tracking-snug">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/15 ring-1 ring-primary-foreground/20">
          <ShieldAlert className="h-5 w-5" aria-hidden="true" />
        </span>
        {LABELS.nav.appTitle}
      </p>

      <div className="grid" aria-live={carousel.isAutoplaying ? 'off' : 'polite'}>
        {slides.map((slide, position) => {
          const Icon = SLIDE_ICONS[slide.id];
          const isActive = position === carousel.index;
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={copy.slideOf(position + 1, slides.length)}
              aria-hidden={!isActive}
              className={cn(
                'col-start-1 row-start-1 transition duration-500 ease-smooth',
                isActive && 'translate-x-0 opacity-100',
                !isActive && 'pointer-events-none opacity-0',
                !isActive && (position < carousel.index ? '-translate-x-4' : 'translate-x-4'),
              )}
            >
              <span
                className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-xl bg-primary-foreground/15 ring-1 ring-primary-foreground/20 transition-transform duration-500 ease-smooth',
                  isActive ? 'scale-100' : 'scale-90',
                )}
              >
                <Icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <p className="mt-6 font-display text-xs font-semibold uppercase tracking-caps text-primary-foreground/90">
                {copy.slideOf(position + 1, slides.length)}
              </p>
              <h2 className="mt-2 max-w-md font-display text-2xl font-semibold tracking-display lg:text-3xl">
                {slide.title}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/90 lg:text-base">
                {slide.body}
              </p>
            </div>
          );
        })}
      </div>

      <ShowcaseControls
        slides={slides}
        index={carousel.index}
        isAutoplaying={carousel.isAutoplaying}
        isUserPaused={carousel.isUserPaused}
        canAutoplay={carousel.canAutoplay}
        onGoTo={carousel.goTo}
        onNext={carousel.next}
        onPrevious={carousel.previous}
        onTogglePause={carousel.togglePause}
      />
    </section>
  );
}
