// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { LinkTile } from './LinkTile';

export type TileLink = Readonly<{ to: string; label: string; icon: LucideIcon }>;

type LinkTileCardProps = Readonly<{
  title: string;
  description: string;
  icon: LucideIcon;
  links: readonly TileLink[];
  className?: string | undefined;
}>;

/** A titled card holding a grid of icon link tiles — the dashboard's quick links
 * and admin shortcuts share this one shape. */
export function LinkTileCard({ title, description, icon: Icon, links, className }: LinkTileCardProps): ReactElement {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <Icon className="size-4 text-primary" aria-hidden="true" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-2">
          {links.map((link) => (
            <li key={link.to}>
              <LinkTile to={link.to} label={link.label} icon={link.icon} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
