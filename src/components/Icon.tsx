import type { ReactNode, SVGProps } from 'react';

type IconName =
  | 'basket'
  | 'grid'
  | 'user'
  | 'settings'
  | 'log-out'
  | 'plus'
  | 'search'
  | 'list'
  | 'check'
  | 'edit'
  | 'trash'
  | 'share'
  | 'arrow-left'
  | 'chevron-right'
  | 'package'
  | 'leaf'
  | 'house'
  | 'sparkles'
  | 'shopping-bag'
  | 'menu';

const paths: Record<IconName, ReactNode> = {
  basket: (
    <>
      <path d="m3 9 2 11h14l2-11H3Z" />
      <path d="m7 9 5-6 5 6M8 13v3m4-3v3m4-3v3" />
    </>
  ),

  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),

  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),

  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.6-1.4-2.4L7.3 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.6 1.4 2.4-1.4 1.1a8 8 0 0 1-.1 2Z" />
    </>
  ),

  'log-out': (
    <>
      <path d="M10 17l5-5-5-5m5 5H3" />
      <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
    </>
  ),

  plus: <path d="M12 5v14M5 12h14" />,

  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),

  list: (
    <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
  ),

  check: <path d="m5 12 4 4L19 6" />,

  edit: (
    <>
      <path d="m15 5 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4Z" />
    </>
  ),

  trash: (
    <path d="M3 6h18m-2 0-1 14H6L5 6m3 0V4h8v2m-6 4v6m4-6v6" />
  ),

  share: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.7 10.7 6.6-4.4m-6.6 7 6.6 4.4" />
    </>
  ),

  'arrow-left': (
    <>
      <path d="m12 19-7-7 7-7M5 12h14" />
    </>
  ),

  'chevron-right': <path d="m9 18 6-6-6-6" />,

  package: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="M3 8v9l9 5 9-5V8m-9 5v9" />
    </>
  ),

  leaf: (
    <>
      <path d="M20 4c-8 0-14 3-14 10a6 6 0 0 0 6 6c7 0 8-8 8-16Z" />
      <path d="M4 21c3-6 7-9 13-13" />
    </>
  ),

  house: (
    <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V10Z" />
  ),

  sparkles: (
    <>
      <path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4L12 3Zm7 12 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
    </>
  ),

  'shopping-bag': (
    <>
      <path d="M5 8h14l1 13H4L5 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </>
  ),

  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
};

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
};

export default function Icon({
  name,
  size = 20,
  ...props
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}