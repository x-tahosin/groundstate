/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  ...(process.env.NEXT_EXPORT === 'true' || isGitHubPages ? { output: 'export' } : {}),
  basePath: isGitHubPages ? '/groundstate' : '',
  assetPrefix: isGitHubPages ? '/groundstate/' : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
