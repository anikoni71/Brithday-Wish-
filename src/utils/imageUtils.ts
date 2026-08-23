/**
 * Utility functions for normalizing and formatting profile image URLs,
 * including automatic Google Drive share link conversion to high-definition CDN images.
 */

export function formatProfileImageUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const clean = url.trim();
  if (!clean) return '';

  // Basic verification: if it doesn't look like a URL and doesn't contain drive keywords, reject
  if (!clean.startsWith('http') && !clean.includes('drive.google.com') && !clean.includes('docs.google.com')) {
    return '';
  }

  // Google Drive format 1: https://drive.google.com/file/d/FILE_ID/...
  const driveFileMatch = clean.match(/(?:drive|docs)\.google\.com(?:\/[^\/]+)*\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveFileMatch && driveFileMatch[1]) {
    const fileId = driveFileMatch[1];
    // Google Drive IDs are typically 28-33 chars, but let's be safe and check for a minimum length
    if (fileId.length >= 10) {
      return `https://lh3.googleusercontent.com/d/${fileId}=s1200`;
    }
  }

  // Google Drive format 2: https://drive.google.com/open?id=FILE_ID, /uc?id=FILE_ID, /thumbnail?id=FILE_ID
  const driveIdMatch = clean.match(/(?:drive|docs)\.google\.com(?:\/[^\/]+)*(?:\/open|\/uc|\/thumbnail|\/file|\/edit)?\?(?:[^&]*&)*id=([a-zA-Z0-9_-]+)/i);
  if (driveIdMatch && driveIdMatch[1]) {
    const fileId = driveIdMatch[1];
    if (fileId.length >= 10) {
      return `https://lh3.googleusercontent.com/d/${fileId}=s1200`;
    }
  }

  // Google Drive format 3: drive.google.com or docs.google.com with id= query parameter or /d/ parameter anywhere
  if (clean.includes('drive.google.com') || clean.includes('docs.google.com')) {
    const genericIdMatch = clean.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
    if (genericIdMatch && genericIdMatch[1] && genericIdMatch[1].length >= 10) {
      return `https://lh3.googleusercontent.com/d/${genericIdMatch[1]}=s1200`;
    }
    const genericDMatch = clean.match(/\/d\/([a-zA-Z0-9_-]+)/i);
    if (genericDMatch && genericDMatch[1] && genericDMatch[1].length >= 10) {
      return `https://lh3.googleusercontent.com/d/${genericDMatch[1]}=s1200`;
    }
  }

  // Google UserContent / Google Photos: Ensure high-res scale parameter (=s1200)
  if (clean.includes('googleusercontent.com')) {
    if (/=[sw]\d+[^&?#]*/i.test(clean)) {
      return clean.replace(/=[sw]\d+[^&?#]*/i, '=s1200');
    }
    if (clean.includes('/d/') && !clean.includes('=')) {
      return `${clean}=s1200`;
    }
    if (!clean.includes('=')) {
      return `${clean}=s1200`;
    }
  }

  // Dropbox Direct High-Res Link
  if (clean.includes('dropbox.com')) {
    return clean.replace(/[?&]dl=0/i, '').replace(/\?$/, '') + (clean.includes('?') ? '&raw=1' : '?raw=1');
  }

  // GitHub Avatars High-Res
  if (clean.includes('avatars.githubusercontent.com') || clean.includes('github.com')) {
    if (clean.includes('s=')) {
      return clean.replace(/([?&])s=\d+/i, '$1s=800');
    }
    return clean + (clean.includes('?') ? '&s=800' : '?s=800');
  }

  // Unsplash High-Res
  if (clean.includes('unsplash.com')) {
    return clean.replace(/([?&])w=\d+/i, '$1w=800').replace(/([?&])q=\d+/i, '$1q=90');
  }

  return clean;
}

/**
 * Validates if an image URL is likely to be accessible and valid.
 * This can be used for pre-verification before rendering.
 */
export async function verifyImageAccessibility(url: string): Promise<boolean> {
  if (!url || !url.startsWith('http')) return false;
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    // Note: no-cors will return opaque response, but if it doesn't throw, it's likely reachable
    return true;
  } catch (e) {
    return false;
  }
}
