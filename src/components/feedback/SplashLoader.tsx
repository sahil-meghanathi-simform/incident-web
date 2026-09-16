import { Spinner } from '../ui/Spinner';

/** Full-page loading state while session bootstrap (GET /auth/me) resolves on first paint. */
export function SplashLoader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
