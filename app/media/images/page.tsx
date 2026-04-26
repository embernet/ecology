import { getAllImages } from '@/lib/images';
import { ImageLibrary } from '@/components/ImageLibrary';

export default function ImagesPage() {
    const images = getAllImages();

    return (
        <article className="markdown-content main-scroll-area">
            <h1 className="mb-6">Images</h1>
            <p className="text-slate-600 mb-6">
                Browse all {images.length} images used across the curriculum — including activity illustrations and wiki page images. Search by name, description, or species, click an image to view it full size, or follow the links to the pages where each image is used.
            </p>
            <ImageLibrary images={images} />
        </article>
    );
}
