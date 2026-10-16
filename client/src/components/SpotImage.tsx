import { useState, type ImgHTMLAttributes, type SyntheticEvent } from "react";

const FALLBACK_IMAGE_URL =
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80";

type SpotImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
};

function ImageWithFallback({
  src,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & { src: string }) {
  const [usingFallback, setUsingFallback] = useState(false);

  const handleError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    if (src !== FALLBACK_IMAGE_URL && !usingFallback) {
      setUsingFallback(true);
    } else {
      event.currentTarget.style.display = "none";
    }

    props.onError?.(event);
  };

  return (
    <img
      {...props}
      src={usingFallback ? FALLBACK_IMAGE_URL : src}
      onError={handleError}
    />
  );
}

export function SpotImage({ src, ...props }: SpotImageProps) {
  const isKnownBrokenHost = src?.includes("lokalfuehrer.stadtbekannt.at");
  const initialSrc = src && !isKnownBrokenHost ? src : FALLBACK_IMAGE_URL;
  return <ImageWithFallback key={initialSrc} src={initialSrc} {...props} />;
}
