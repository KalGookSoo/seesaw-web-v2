import Script from 'next/script';

const themeScript = `
(() => {
  const key = 'seesaw-theme';
  const savedTheme = window.localStorage.getItem(key);
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : systemTheme;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.dataset.theme = theme;
})();
`;

export function ThemeScript() {
  return (
    <Script
      id="seesaw-theme-script"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  );
}
