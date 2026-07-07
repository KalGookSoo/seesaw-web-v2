export const neumorphismComponentItems = [
  {
    href: '/style-guide/neumorphism/components/accordion',
    label: 'Accordion',
    slug: 'accordion'
  },
  {
    href: '/style-guide/neumorphism/components/alert',
    label: 'Alert',
    slug: 'alert'
  },
  {
    href: '/style-guide/neumorphism/components/badge',
    label: 'Badge',
    slug: 'badge'
  },
  {
    href: '/style-guide/neumorphism/components/breadcrumb',
    label: 'Breadcrumb',
    slug: 'breadcrumb'
  },
  {
    href: '/style-guide/neumorphism/components/button',
    label: 'Button',
    slug: 'button'
  },
  {
    href: '/style-guide/neumorphism/components/button-group',
    label: 'Button group',
    slug: 'button-group'
  },
  {
    href: '/style-guide/neumorphism/components/card',
    label: 'Card',
    slug: 'card'
  },
  {
    href: '/style-guide/neumorphism/components/carousel',
    label: 'Carousel',
    slug: 'carousel'
  },
  {
    href: '/style-guide/neumorphism/components/details',
    label: 'Details',
    slug: 'details'
  },
  {
    href: '/style-guide/neumorphism/components/dropdown',
    label: 'Dropdown',
    slug: 'dropdown'
  },
  {
    href: '/style-guide/neumorphism/components/list-group',
    label: 'List group',
    slug: 'list-group'
  },
  {
    href: '/style-guide/neumorphism/components/modal',
    label: 'Modal',
    slug: 'modal'
  },
  {
    href: '/style-guide/neumorphism/components/nav',
    label: 'Nav',
    slug: 'nav'
  },
  {
    href: '/style-guide/neumorphism/components/navbar',
    label: 'Navbar',
    slug: 'navbar'
  },
  {
    href: '/style-guide/neumorphism/components/offcanvas',
    label: 'Offcanvas',
    slug: 'offcanvas'
  },
  {
    href: '/style-guide/neumorphism/components/pagination',
    label: 'Pagination',
    slug: 'pagination'
  },
  {
    href: '/style-guide/neumorphism/components/popover',
    label: 'Popover',
    slug: 'popover'
  },
  {
    href: '/style-guide/neumorphism/components/progress',
    label: 'Progress',
    slug: 'progress'
  },
  {
    href: '/style-guide/neumorphism/components/scrollspy',
    label: 'Scrollspy',
    slug: 'scrollspy'
  },
  {
    href: '/style-guide/neumorphism/components/spinner',
    label: 'Spinner',
    slug: 'spinner'
  },
  {
    href: '/style-guide/neumorphism/components/tab',
    label: 'Tab',
    slug: 'tab'
  },
  {
    href: '/style-guide/neumorphism/components/toast',
    label: 'Toast',
    slug: 'toast'
  },
  {
    href: '/style-guide/neumorphism/components/tooltip',
    label: 'Tooltip',
    slug: 'tooltip'
  }
] as const;

export type NeumorphismComponentSlug =
  (typeof neumorphismComponentItems)[number]['slug'];

export function getNeumorphismComponentItem(slug: NeumorphismComponentSlug) {
  return neumorphismComponentItems.find((item) => item.slug === slug);
}
