export const editorialComponentItems = [
  {
    href: '/style-guide/editorial/components/accordion',
    label: 'Accordion',
    slug: 'accordion'
  },
  {
    href: '/style-guide/editorial/components/alert',
    label: 'Alert',
    slug: 'alert'
  },
  {
    href: '/style-guide/editorial/components/badge',
    label: 'Badge',
    slug: 'badge'
  },
  {
    href: '/style-guide/editorial/components/breadcrumb',
    label: 'Breadcrumb',
    slug: 'breadcrumb'
  },
  {
    href: '/style-guide/editorial/components/button',
    label: 'Button',
    slug: 'button'
  },
  {
    href: '/style-guide/editorial/components/button-group',
    label: 'Button group',
    slug: 'button-group'
  },
  {
    href: '/style-guide/editorial/components/card',
    label: 'Card',
    slug: 'card'
  },
  {
    href: '/style-guide/editorial/components/carousel',
    label: 'Carousel',
    slug: 'carousel'
  },
  {
    href: '/style-guide/editorial/components/details',
    label: 'Details',
    slug: 'details'
  },
  {
    href: '/style-guide/editorial/components/dropdown',
    label: 'Dropdown',
    slug: 'dropdown'
  },
  {
    href: '/style-guide/editorial/components/list-group',
    label: 'List group',
    slug: 'list-group'
  },
  {
    href: '/style-guide/editorial/components/modal',
    label: 'Modal',
    slug: 'modal'
  },
  {
    href: '/style-guide/editorial/components/nav',
    label: 'Nav',
    slug: 'nav'
  },
  {
    href: '/style-guide/editorial/components/navbar',
    label: 'Navbar',
    slug: 'navbar'
  },
  {
    href: '/style-guide/editorial/components/offcanvas',
    label: 'Offcanvas',
    slug: 'offcanvas'
  },
  {
    href: '/style-guide/editorial/components/pagination',
    label: 'Pagination',
    slug: 'pagination'
  },
  {
    href: '/style-guide/editorial/components/popover',
    label: 'Popover',
    slug: 'popover'
  },
  {
    href: '/style-guide/editorial/components/progress',
    label: 'Progress',
    slug: 'progress'
  },
  {
    href: '/style-guide/editorial/components/scrollspy',
    label: 'Scrollspy',
    slug: 'scrollspy'
  },
  {
    href: '/style-guide/editorial/components/spinner',
    label: 'Spinner',
    slug: 'spinner'
  },
  {
    href: '/style-guide/editorial/components/tab',
    label: 'Tab',
    slug: 'tab'
  },
  {
    href: '/style-guide/editorial/components/toast',
    label: 'Toast',
    slug: 'toast'
  },
  {
    href: '/style-guide/editorial/components/tooltip',
    label: 'Tooltip',
    slug: 'tooltip'
  }
] as const;

export type EditorialComponentSlug =
  (typeof editorialComponentItems)[number]['slug'];

export function getEditorialComponentItem(slug: EditorialComponentSlug) {
  return editorialComponentItems.find((item) => item.slug === slug);
}
