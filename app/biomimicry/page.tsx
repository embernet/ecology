import fs from 'fs';
import path from 'path';
import { BiomimicryBrowser } from '@/components/BiomimicryBrowser';

export const metadata = {
  title: 'Biomimicry — Ecology Curriculum',
  description:
    'How nature solved a problem first, and how people copied it — biomimicry examples for the primary classroom.',
};

export default function BiomimicryPage() {
  const imgDir = path.join(process.cwd(), 'public', 'biomimicry-images');
  const availableImages = fs.existsSync(imgDir)
    ? fs
        .readdirSync(imgDir)
        .filter((f) => f.endsWith('.png'))
        .map((f) => f.replace(/\.png$/, ''))
    : [];

  return (
    <div className="main-scroll-area">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 border-b-4 border-yellow-400 inline-block pb-2 mb-4">
            Biomimicry
          </h1>
          <p className="max-w-3xl text-lg text-slate-700 leading-relaxed">
            Again and again, nature has solved a problem millions of years before we
            even thought to ask the question — and clever people have copied the
            answer. These are stories of a creature or a plant that got there first,
            and the inventions that followed. Pick one to explore, or filter them
            by school subject and year group.
          </p>
        </header>

        <BiomimicryBrowser availableImages={availableImages} />
      </div>
    </div>
  );
}
