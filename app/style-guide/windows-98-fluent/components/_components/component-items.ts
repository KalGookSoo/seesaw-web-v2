export const windows98ComponentItems = [
  {
    href: '/style-guide/windows-98-fluent/components/accordion',
    label: 'Accordion',
    slug: 'accordion'
  },
  {
    href: '/style-guide/windows-98-fluent/components/alert',
    label: 'Alert',
    slug: 'alert'
  },
  {
    href: '/style-guide/windows-98-fluent/components/badge',
    label: 'Badge',
    slug: 'badge'
  },
  {
    href: '/style-guide/windows-98-fluent/components/breadcrumb',
    label: 'Breadcrumb',
    slug: 'breadcrumb'
  },
  {
    href: '/style-guide/windows-98-fluent/components/button',
    label: 'Button',
    slug: 'button'
  },
  {
    href: '/style-guide/windows-98-fluent/components/button-group',
    label: 'Button group',
    slug: 'button-group'
  },
  {
    href: '/style-guide/windows-98-fluent/components/card',
    label: 'Card',
    slug: 'card'
  },
  {
    href: '/style-guide/windows-98-fluent/components/carousel',
    label: 'Carousel',
    slug: 'carousel'
  },
  {
    href: '/style-guide/windows-98-fluent/components/details',
    label: 'Details',
    slug: 'details'
  },
  {
    href: '/style-guide/windows-98-fluent/components/dropdown',
    label: 'Dropdown',
    slug: 'dropdown'
  },
  {
    href: '/style-guide/windows-98-fluent/components/list-group',
    label: 'List group',
    slug: 'list-group'
  },
  {
    href: '/style-guide/windows-98-fluent/components/modal',
    label: 'Modal',
    slug: 'modal'
  },
  {
    href: '/style-guide/windows-98-fluent/components/nav',
    label: 'Nav',
    slug: 'nav'
  },
  {
    href: '/style-guide/windows-98-fluent/components/navbar',
    label: 'Navbar',
    slug: 'navbar'
  },
  {
    href: '/style-guide/windows-98-fluent/components/offcanvas',
    label: 'Offcanvas',
    slug: 'offcanvas'
  },
  {
    href: '/style-guide/windows-98-fluent/components/pagination',
    label: 'Pagination',
    slug: 'pagination'
  },
  {
    href: '/style-guide/windows-98-fluent/components/popover',
    label: 'Popover',
    slug: 'popover'
  },
  {
    href: '/style-guide/windows-98-fluent/components/progress',
    label: 'Progress',
    slug: 'progress'
  },
  {
    href: '/style-guide/windows-98-fluent/components/scrollspy',
    label: 'Scrollspy',
    slug: 'scrollspy'
  },
  {
    href: '/style-guide/windows-98-fluent/components/spinner',
    label: 'Spinner',
    slug: 'spinner'
  },
  {
    href: '/style-guide/windows-98-fluent/components/tab',
    label: 'Tab',
    slug: 'tab'
  },
  {
    href: '/style-guide/windows-98-fluent/components/toast',
    label: 'Toast',
    slug: 'toast'
  },
  {
    href: '/style-guide/windows-98-fluent/components/tooltip',
    label: 'Tooltip',
    slug: 'tooltip'
  }
] as const;

export type Windows98ComponentSlug =
  (typeof windows98ComponentItems)[number]['slug'];

export function getWindows98ComponentItem(slug: Windows98ComponentSlug) {
  return windows98ComponentItems.find((item) => item.slug === slug);
}
