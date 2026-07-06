export const defaultColors = [
  { name: 'Blue', token: 'default-blue' },
  { name: 'Indigo', token: 'default-indigo' },
  { name: 'Purple', token: 'default-purple' },
  { name: 'Pink', token: 'default-pink' },
  { name: 'Red', token: 'default-red' },
  { name: 'Orange', token: 'default-orange' },
  { name: 'Yellow', token: 'default-yellow' },
  { name: 'Green', token: 'default-green' },
  { name: 'Mint', token: 'default-mint' },
  { name: 'Teal', token: 'default-teal' },
  { name: 'Cyan', token: 'default-cyan' }
] as const;

export const defaultNeutralColors = [
  { name: 'Background', token: 'default-background' },
  { name: 'Surface', token: 'default-surface' },
  { name: 'Elevated', token: 'default-surface-elevated' },
  { name: 'Grouped', token: 'default-surface-grouped' },
  { name: 'Fill', token: 'default-fill' },
  { name: 'Separator', token: 'default-separator' },
  { name: 'Label', token: 'default-label' },
  { name: 'Secondary Label', token: 'default-secondary-label' },
  { name: 'Tertiary Label', token: 'default-tertiary-label' }
] as const;

export const defaultColorSteps = [
  { label: 'Soft', suffix: 'soft' },
  { label: 'Base', suffix: null },
  { label: 'Muted', suffix: 'muted' },
  { label: 'Contrast', suffix: 'contrast' }
] as const;

export const styleGuideNavigationItems = [
  { href: '/style-guide/default', label: 'Overview' },
  { href: '/style-guide/default/colors', label: 'Colors' },
  { href: '/style-guide/default/forms', label: 'Forms' },
  { href: '/style-guide/default/feedback', label: 'Alert · Modal · Confirm' },
  { href: '/style-guide/default/components', label: 'Components' }
] as const;

export const componentNames = [
  'Accordion',
  'Alerts',
  'Badge',
  'Breadcrumb',
  'Buttons',
  'Button group',
  'Card',
  'Carousel',
  'Close button',
  'Collapse',
  'Dropdowns',
  'List group',
  'Modal',
  'Navs & tabs',
  'Navbar',
  'Offcanvas',
  'Pagination',
  'Popovers',
  'Progress',
  'Scrollspy',
  'Spinners',
  'Toasts',
  'Tooltips',
  'WYSIWYG editor'
] as const;
