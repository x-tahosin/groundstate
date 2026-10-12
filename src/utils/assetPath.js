/**
 * Returns the correct asset path considering GitHub Pages base path or custom deployments.
 * If running on GitHub Pages, prefixes with /groundstate.
 * 
 * @param {string} path 
 * @returns {string}
 */
export function getAssetPath(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  
  let clean = path.startsWith('/') ? path.slice(1) : path;
  if (clean.startsWith('groundstate/')) {
    clean = clean.slice('groundstate/'.length);
  }
  
  // Prefer build-time env var if defined and non-empty
  const envBase = process.env.NEXT_PUBLIC_BASE_PATH;
  if (typeof envBase === 'string' && envBase !== '') {
    return `${envBase}/${clean}`;
  }
  
  // Runtime window inspection fallback for GitHub Pages
  if (typeof window !== 'undefined') {
    if (window.location.pathname.startsWith('/groundstate') || window.location.hostname.includes('github.io')) {
      return `/groundstate/${clean}`;
    }
  }
  
  return `/${clean}`;
}
