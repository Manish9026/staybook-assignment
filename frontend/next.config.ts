import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      // Ticketmaster CDN
      { protocol: 'https', hostname: 's1.ticketm.net' },
      { protocol: 'https', hostname: '*.ticketm.net' },
      { protocol: 'https', hostname: '*.ticketmaster.com' },
      // Universe (Ticketmaster subsidiary)
      { protocol: 'https', hostname: 'images.universe.com' },
      { protocol: 'https', hostname: '*.universe.com' },
      // TicketWeb (Ticketmaster subsidiary)
      { protocol: 'https', hostname: 'i.ticketweb.com' },
      { protocol: 'https', hostname: '*.ticketweb.com' },
      // Live Nation
      { protocol: 'https', hostname: '*.livenation.com' },
    ],
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
