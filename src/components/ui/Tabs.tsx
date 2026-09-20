// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
//
// Only Radix's Root + List + Trigger are used — no TabsContent. The sole
// consumer, IncidentDetailPage, renders tab bodies as sibling conditionals
// outside this component (not children of it) so it can resolve a
// force-navigated `?tab=notes` even when "notes" isn't in the visible tab
// list — a case Radix's own Content-matches-Trigger model doesn't need to
// know about. Root+List+Trigger alone still gets us real arrow-key
// navigation and roving tabindex.
import type { ReactElement } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

export type TabItem = Readonly<{
  key: string;
  label: string;
  icon?: LucideIcon;
  /** Small count shown after the label (e.g. number of notes). */
  count?: number;
}>;

type TabsProps = Readonly<{
  tabs: readonly TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}>;

export function Tabs({ tabs, activeKey, onChange }: TabsProps): ReactElement {
  return (
    <TabsPrimitive.Root value={activeKey} onValueChange={onChange}>
      <TabsPrimitive.List className="-mb-px flex gap-1 overflow-x-auto border-b border-border [scrollbar-width:none]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsPrimitive.Trigger
              key={tab.key}
              value={tab.key}
              className={cn(
                'group relative inline-flex shrink-0 items-center gap-2 rounded-t-md px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors',
                'hover:bg-accent/60 hover:text-foreground-soft',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                'after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-transparent after:transition-colors',
                'data-[state=active]:text-primary data-[state=active]:after:bg-primary',
              )}
            >
              {Icon && <Icon className="size-4" aria-hidden="true" />}
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="rounded-full bg-muted px-1.5 text-xs tabular-nums text-muted-foreground group-data-[state=active]:bg-accent group-data-[state=active]:text-accent-foreground">
                  {tab.count}
                </span>
              )}
            </TabsPrimitive.Trigger>
          );
        })}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
}
