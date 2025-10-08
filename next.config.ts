import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    API_URL: process.env.API_URL || 'https://api.thefreeagentportal.com/api/v1',
    AUTH_URL: process.env.AUTH_URL,
    SERVICE_NAME: process.env.SERVICE_NAME,
    ENV: process.env.NODE_ENV,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    TEAMS_APP_URL: process.env.TEAMS_APP_URL,
    ADMIN_APP_URL: process.env.ADMIN_APP_URL,
    SCOUT_APP_URL: process.env.SCOUT_APP_URL,
    NEXT_PUBLIC_TINYMCE_API_KEY: process.env.TINYMCE_API_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    APP_VERSION: process.env.APP_VERSION || 'development',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
