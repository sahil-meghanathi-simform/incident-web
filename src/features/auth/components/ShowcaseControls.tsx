// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { KeyboardEvent, ReactElement } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';

type ShowcaseSlideRef = Readonly<{
  id: string;
  title: string;
}>;

type ShowcaseControlsProps = Readonly<{
  slides: readonly ShowcaseSlideRef[];
  index: number;
  isAutoplaying: boolean;
  isUserPaused: boolean;
  canAutoplay: boolean;
  onGoTo: (index: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onTogglePause: () => void;
}>;

// The global :focus-visible outline uses --color-ring, which is the same plum as this
// panel — invisible here. The `!` utility is what beats that un-layered rule.
const ICON_BUTTON =
  'inline-flex h-8 w-8 items-center justify-center rounded-full text-primary-foreground/80 transition-colors hover:bg-primary-foreground/15 hover:text-primary-foreground focus-visible:outline-primary-foreground! active:scale-95';

export function ShowcaseControls({
  slides,
  index,
  isAutoplaying,
  isUserPaused,
  canAutoplay,
  onGoTo,
  onNext,
  onPrevious,
  onTogglePause,
}: ShowcaseControlsProps): ReactElement {
  const copy = LABELS.auth.showcase;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      onNext();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onPrevious();
    }
  };

  return (
    // The key handler on this wrapper is the carousel arrow-key pattern
    // (accessibility.md: arrow keys move within composite widgets) — every action is
    // also reachable through the real buttons inside it.
    <div className="flex items-center justify-between gap-4" onKeyDown={handleKeyDown}>
      <div role="group" aria-label={copy.regionLabel} className="flex items-center gap-2">
        {slides.map((slide, position) => {
          const isActive = position === index;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => onGoTo(position)}
              aria-label={copy.goToSlide(position + 1, slide.title)}
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                'h-1.5 overflow-hidden rounded-full transition-all duration-500 ease-smooth focus-visible:outline-primary-foreground!',
                isActive ? 'w-10 bg-primary-foreground/30' : 'w-4 bg-primary-foreground/60 hover:bg-primary-foreground/80',
              )}
            >
              {isActive && (
                <span
                  // Remounting on autoplay change restarts the fill in step with the timer.
                  key={isAutoplaying ? 'running' : 'idle'}
                  className={cn(
                    'block h-full rounded-full bg-primary-foreground',
                    // duration-6000 mirrors SHOWCASE_INTERVAL_MS in AuthShowcase.
                    isAutoplaying && 'animate-in slide-in-from-left duration-6000 ease-linear',
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-1">
        {canAutoplay && (
          <button
            type="button"
            onClick={onTogglePause}
            aria-label={isUserPaused ? copy.play : copy.pause}
            className={ICON_BUTTON}
          >
            {isUserPaused ? (
              <Play className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Pause className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}
        <button type="button" onClick={onPrevious} aria-label={copy.previous} className={ICON_BUTTON}>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={onNext} aria-label={copy.next} className={ICON_BUTTON}>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
