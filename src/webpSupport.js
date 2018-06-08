export default function webpSupport () {
  return new Promise((resolve) => {
    const image = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
    const img = new Image();
    img.src = image;

    // IF WEBP IS SUPPORTED
    img.onload = () => resolve(true);

    // FALLBACK IF NOT SUPPORTED
    img.onerror = () => resolve(false);
  })
}