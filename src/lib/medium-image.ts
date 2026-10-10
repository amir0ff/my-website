/** Resize Medium CDN thumbnails for card display (~416px @2x for 208px cards). */
export function mediumCardThumbnail(url: string, width = 640): string {
  if (!url) return url;

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("medium.com")) return url;

    // https://cdn-images-1.medium.com/max/1024/<id>.png
    const maxMatch = parsed.pathname.match(/^\/max\/\d+\/(.+)$/);
    if (maxMatch) {
      parsed.pathname = `/max/${width}/${maxMatch[1]}`;
      return parsed.toString();
    }

    // https://cdn-images-1.medium.com/v2/resize:fit:1408/<id>.png
    const fitMatch = parsed.pathname.match(
      /^\/v2\/resize:fit:\d+\/(.+)$/,
    );
    if (fitMatch) {
      parsed.pathname = `/v2/resize:fit:${width}/${fitMatch[1]}`;
      return parsed.toString();
    }
  } catch {
    return url;
  }

  return url;
}
