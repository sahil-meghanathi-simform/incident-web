// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
//
// Only Radix's Root + List + Trigger are used — no TabsContent. The sole
// consumer, IncidentDetailPage, renders tab bodies as sibling conditionals
// outside this component (not children of it) so it can resolve a
// force-navigated `?tab=notes` even when "notes" isn't in the visible tab
// list — a case Radix's own Content-matches-Trigger model doesn't need to
// know about. Root+List+Trigger alone still gets us real arrow-key
// navigation and roving tabindex, which the previous hand-rolled version
// never had; that was the actual gap being fixed here.
import type { ReactElement } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../lib/cn';

export type TabItem = Readonly<{
  key: string;
  label: string;
}>;

type TabsProps = Readonly<{
  tabs: readonly TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}>;

export function Tabs({ tabs, activeKey, onChange }: TabsProps): ReactElement {
  return (
    <TabsPrimitive.Root value={activeKey} onValueChange={onChange}>
      <TabsPrimitive.List className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.key}
            value={tab.key}
            className={cn(
              'border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground-soft',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'data-[state=active]:border-primary data-[state=active]:text-primary',
            )}
          >
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
}
