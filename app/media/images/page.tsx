import { getAllImages } from '@/lib/images';
import { ImageLibrary } from '@/components/ImageLibrary';

export default function ImagesPage() {
    const images = getAllImages();

    return (
        <article className="markdown-content main-scroll-area">
            <h1 className="mb-6">Images</h1>
            <p className="text-slate-600 mb-6">
                Browse all {images.length} images used across the curriculum. Search by name or description, click an image to view it full size, or navigate to the pages where each image is used.
            </p>
            <ImageLibrary images={images} />
        </article>
    );
}
