/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // This allows all paths under this domain
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        // Optional: you can leave port and pathname empty
        // to allow all images from this host.
      },
    ],
  },
};

export default nextConfig;
