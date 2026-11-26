/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Custom job-work service was discontinued; send old links to the wholesale portal.
  async redirects() {
    return [{ source: '/job-work', destination: '/wholesale-b2b', permanent: true }];
  },
  images: {
    domains: [
      'images.unsplash.com',
      'plus.unsplash.com'
    ],
  },
};

export default nextConfig;
