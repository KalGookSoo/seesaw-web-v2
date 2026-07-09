export const neoBrutalismComponentItems = [
  {
    href: '/style-guide/neo-brutalism/components/accordion',
    label: 'Accordion',
    slug: 'accordion'
  },
  {
    href: '/style-guide/neo-brutalism/components/alert',
    label: 'Alert',
    slug: 'alert'
  },
  {
    href: '/style-guide/neo-brutalism/components/badge',
    label: 'Badge',
    slug: 'badge'
  },
  {
    href: '/style-guide/neo-brutalism/components/breadcrumb',
    label: 'Breadcrumb',
    slug: 'breadcrumb'
  },
  {
    href: '/style-guide/neo-brutalism/components/button',
    label: 'Button',
    slug: 'button'
  },
  {
    href: '/style-guide/neo-brutalism/components/button-group',
    label: 'Button group',
    slug: 'button-group'
  },
  {
    href: '/style-guide/neo-brutalism/components/card',
    label: 'Card',
    slug: 'card'
  },
  {
    href: '/style-guide/neo-brutalism/components/carousel',
    label: 'Carousel',
    slug: 'carousel'
  },
  {
    href: '/style-guide/neo-brutalism/components/details',
    label: 'Details',
    slug: 'details'
  },
  {
    href: '/style-guide/neo-brutalism/components/dropdown',
    label: 'Dropdown',
    slug: 'dropdown'
  },
  {
    href: '/style-guide/neo-brutalism/components/list-group',
    label: 'List group',
    slug: 'list-group'
  },
  {
    href: '/style-guide/neo-brutalism/components/modal',
    label: 'Modal',
    slug: 'modal'
  },
  {
    href: '/style-guide/neo-brutalism/components/nav',
    label: 'Nav',
    slug: 'nav'
  },
  {
    href: '/style-guide/neo-brutalism/components/navbar',
    label: 'Navbar',
    slug: 'navbar'
  },
  {
    href: '/style-guide/neo-brutalism/components/offcanvas',
    label: 'Offcanvas',
    slug: 'offcanvas'
  },
  {
    href: '/style-guide/neo-brutalism/components/pagination',
    label: 'Pagination',
    slug: 'pagination'
  },
  {
    href: '/style-guide/neo-brutalism/components/popover',
    label: 'Popover',
    slug: 'popover'
  },
  {
    href: '/style-guide/neo-brutalism/components/progress',
    label: 'Progress',
    slug: 'progress'
  },
  {
    href: '/style-guide/neo-brutalism/components/scrollspy',
    label: 'Scrollspy',
    slug: 'scrollspy'
  },
  {
    href: '/style-guide/neo-brutalism/components/spinner',
    label: 'Spinner',
    slug: 'spinner'
  },
  {
    href: '/style-guide/neo-brutalism/components/tab',
    label: 'Tab',
    slug: 'tab'
  },
  {
    href: '/style-guide/neo-brutalism/components/toast',
    label: 'Toast',
    slug: 'toast'
  },
  {
    href: '/style-guide/neo-brutalism/components/tooltip',
    label: 'Tooltip',
    slug: 'tooltip'
  }
] as const;

export type NeoBrutalismComponentSlug =
  (typeof neoBrutalismComponentItems)[number]['slug'];

export function getNeoBrutalismComponentItem(slug: NeoBrutalismComponentSlug) {
  return neoBrutalismComponentItems.find((item) => item.slug === slug);
}
