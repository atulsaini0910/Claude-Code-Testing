import { motion } from 'framer-motion';
import type { GalleryImage } from '@/types';

interface GalleryGridProps {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
}

export function GalleryGrid({ images, onImageClick }: GalleryGridProps) {
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {images.map((img, index) => (
        <motion.div
          key={img.id}
          className="break-inside-avoid cursor-pointer rounded-xl overflow-hidden relative group"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          onClick={() => onImageClick(index)}
        >
          <img
            src={img.src}
            alt={img.alt}
            loading="lazy"
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/40 transition-colors flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-cream text-xs font-medium">{img.caption}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
