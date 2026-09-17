import type { ReactElement } from 'react';
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
    <div role="tablist" className="flex gap-1 border-b border-slate-200">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={tab.key === activeKey}
          onClick={() => onChange(tab.key)}
          className={cn(
            'border-b-2 px-3 py-2 text-sm font-medium',
            tab.key === activeKey
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
