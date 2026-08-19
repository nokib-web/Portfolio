// Resolve Google Drive, Dropbox, or direct URLs for Images, Videos, and Audio
export const resolveMediaUrl = (url) => {
  if (!url) return '';
  
  // Google Drive link
  // e.g. https://drive.google.com/file/d/1A2B3C4D.../view?usp=sharing
  // or https://drive.google.com/open?id=1A2B3C4D...
  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    // Google User Content CDN for fast high-res image loading
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  // Dropbox link
  if (url.includes('dropbox.com')) {
    return url.replace('dl=0', 'raw=1');
  }

  return url;
};

// Resolve specifically for direct audio streams
export const resolveAudioUrl = (url) => {
  if (!url) return '';
  
  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    return `https://docs.google.com/uc?export=download&id=${fileId}`;
  }

  if (url.includes('dropbox.com')) {
    return url.replace('dl=0', 'raw=1');
  }

  return url;
};
