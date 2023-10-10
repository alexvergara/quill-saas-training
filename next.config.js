/** @type {import('next').NextConfig} */
const nextConfig = {
  //experimental: { serverActions: true },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },

  images: {
    //domains: ['localhost', 'loremflickr.com', 'uploadthing.com', 'res.cloudinary.com'], // TODO: localDev ?
    domains: ['localhost', 'dev.famver.com', 'uploadthing.com', 'img.clerk.com'] // TODO: localDev ?
  },

  async redirects() {
    return [
      /*{
        source: '/home',
        destination: '/',
        permanent: false,
      },*/
      // {
      //   source: '/auth/sign-out',
      //   destination: '/',
      //   permanent: false
      // }
      /*{
        source: '/auth/(.*)/sso-callback',
        destination: '/auth/register',
        permanent: false,
      },*/
    ];
  }
};

module.exports = nextConfig;
