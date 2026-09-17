import { Component, type ReactNode } from 'react';
import { Button } from '../ui/Button';
import { Heading } from '../ui/Heading';
import { LABELS } from '../../lib/labels';

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

/** Last resort, full-page. Mounted at the router root. */
export class RootErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override render() {
    if (this.state.error) {
      return (
        <div role="alert" className="flex h-screen flex-col items-center justify-center gap-3 p-6 text-center">
          <Heading>{LABELS.feedback.unexpectedErrorTitle}</Heading>
          <p className="max-w-md text-sm text-slate-500">{LABELS.feedback.unexpectedErrorBody}</p>
          <Button onClick={() => window.location.reload()}>{LABELS.feedback.reload}</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
