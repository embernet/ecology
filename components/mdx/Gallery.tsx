import React from 'react';
import { WikiImage } from './WikiImage';

interface GalleryImage {
    src: string;
    caption: string;
    credit?: string;
}

interface GalleryProps {
    images: GalleryImage[] | string;
}

export const Gallery: React.FC<GalleryProps> = ({ images }) => {
    let imageList: GalleryImage[] = [];

    if (typeof images === 'string') {
        try {
            imageList = JSON.parse(images);
        } catch (e) {
            console.error('Failed to parse gallery images', e);
            return null;
        }
    } else {
        imageList = images;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-6">
            {imageList.map((img, i) => {
                const filename = img.src.replace(/^(File:|Image:)/i, '');
                return (
                    <WikiImage
                        key={i}
                        filename={filename}
                        alt={img.caption || filename}
                        caption={img.caption}
                        credit={img.credit}
                        className="h-full"
                    />
                );
            })}
        </div>
    );
};
