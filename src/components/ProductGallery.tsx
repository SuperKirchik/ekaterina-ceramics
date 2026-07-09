"use client";

import { useRef, useState } from "react";

type ProductGalleryProps = {
  images: string[];
  title: string;
};

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const normalizedImages = images.length > 0 ? images : ["/brand-logo.png"];
  const [selectedImage, setSelectedImage] = useState(normalizedImages[0]);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function selectImage(image: string, index: number) {
    setSelectedImage(image);
    thumbnailRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  return (
    <div className="product-gallery mx-auto w-full max-w-[clamp(18rem,31vw,38rem)]">
      <div className="overflow-hidden">
        <img
          alt={title}
          className="mx-auto aspect-square w-full object-cover"
          decoding="async"
          fetchPriority="high"
          src={selectedImage}
        />
      </div>

      {normalizedImages.length > 1 && (
        <div className="thumbnail-strip mt-[clamp(1rem,1.5vw,1.5rem)] flex justify-center gap-[clamp(0.8rem,1.2vw,1.4rem)] overflow-x-auto pb-1">
          {normalizedImages.map((image, index) => (
            <button
              aria-label={`Показать фото ${index + 1}`}
              className={`shrink-0 overflow-hidden border transition ${
                image === selectedImage
                  ? "border-white"
                  : "border-transparent opacity-80 hover:opacity-100"
              }`}
              key={`${image}-${index}`}
              onClick={() => selectImage(image, index)}
              ref={(element) => {
                thumbnailRefs.current[index] = element;
              }}
              type="button"
            >
              <img
                alt={title}
                className="aspect-square w-[clamp(3.6rem,4.2vw,5rem)] object-cover"
                decoding="async"
                loading="lazy"
                src={image}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
