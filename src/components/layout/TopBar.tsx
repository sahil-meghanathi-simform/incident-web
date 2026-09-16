export function TopBar() {
  // User menu, clearance chip, logout — wired in Module 1 once AuthProvider exists.
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
      <span className="text-sm font-semibold text-slate-900">Incident Reporting &amp; Escalation</span>
      <div className="text-sm text-slate-500">…</div>
    </header>
  );
}
