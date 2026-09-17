import { type ReactElement, type ReactNode, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../../hooks/useFocusTrap';

type DrawerProps = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}>;

/** Focus trap, ESC-to-close, restores focus to the trigger on close. */
export function Drawer({ isOpen, onClose, title, children }: DrawerProps): ReactElement | null {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, isOpen, onClose);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-xl outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <h2 className="mb-4 text-base font-semibold text-slate-900">{title}</h2>
        {children}
      </div>
    </div>,
    document.body,
  );
}
