export type ChartScale = Readonly<{
  /** Top of the y-axis — a round number at or above the data's peak. */
  max: number;
  /** Tick values from 0 up to `max`, evenly spaced. */
  ticks: readonly number[];
}>;

const TARGET_TICK_COUNT = 4;

/** 1, 2 or 5 times a power of ten — the step sizes people read without effort. */
function niceStep(raw: number): number {
  if (raw <= 1) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const normalized = raw / magnitude;
  const factor = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return factor * magnitude;
}

/** Whole-number y-axis for a count chart: ticks fall on round values and the axis
 * top is the first tick at or above `peak`, so gridlines and labels line up. */
export function countScale(peak: number): ChartScale {
  const step = niceStep(Math.max(peak, 1) / TARGET_TICK_COUNT);
  const max = Math.max(step, Math.ceil(Math.max(peak, 1) / step) * step);
  const ticks: number[] = [];
  for (let value = 0; value <= max; value += step) ticks.push(value);
  return { max, ticks };
}
