/** @type {import('next').NextConfig} */
const nextConfig = {
  
  output: 'export', // Enables static HTML export
  distDir: 'out',   // Sets the output directory to 'out'


  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig