/**
 * Utility functions for normalizing and formatting profile image URLs,
 * including automatic Google Drive share link conversion to direct CDN images.
 */

export function formatProfileImageUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const clean = url.trim();
  if (!clean) return '';

  // Google Drive format 1: https://drive.google.com/file/d/FILE_ID/...
  const driveFileMatch = clean.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  }

  // Google Drive format 2: https://drive.google.com/open?id=FILE_ID, /uc?id=FILE_ID, /thumbnail?id=FILE_ID
  const driveIdMatch = clean.match(/drive\.google\.com\/(?:open|uc|thumbnail)\?(?:[^&]*&)*id=([a-zA-Z0-9_-]+)/i);
  if (driveIdMatch && driveIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
  }

  // Google Drive format 3: drive.google.com with id= query parameter anywhere
  if (clean.includes('drive.google.com')) {
    const genericIdMatch = clean.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
    if (genericIdMatch && genericIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${genericIdMatch[1]}`;
    }
  }

  return clean;
}
