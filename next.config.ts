import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const applicationApiBaseUrl = (
  process.env.SEESAW_APPLICATION_API_BASE_URL ??
  'http://localhost:9000/seesaw-api/api'
).replace(/\/+$/, '');

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${applicationApiBaseUrl}/:path*`
        }
      ],
      afterFiles: [],
      fallback: []
    };
  }
};

export default withNextIntl(nextConfig);
