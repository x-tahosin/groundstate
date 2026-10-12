/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  ...(process.env.NEXT_EXPORT === 'true' || isGitHubPages ? { output: 'export' } : {}),
  basePath: isGitHubPages ? '/groundstate' : '',
  assetPrefix: isGitHubPages ? '/groundstate/' : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: isGitHubPages ? '/groundstate' : '',
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
