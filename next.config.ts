import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // /api 요청은 app/api/[...path]/route.ts가 인증 쿠키를 Bearer 토큰으로 변환하여 전달한다.
};

export default withNextIntl(nextConfig);
