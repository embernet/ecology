import { HabitatsBrowser } from '@/components/HabitatsBrowser';

export const metadata = {
  title: 'Habitats — Ecology Curriculum',
  description: 'Explore the different homes where animals and plants live.',
};

export default function HabitatsPage() {
  return (
    <div className="main-scroll-area">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 border-b-4 border-yellow-400 inline-block pb-2 mb-4">
            Habitats
          </h1>
          <p className="max-w-3xl text-lg text-slate-700 leading-relaxed">
            Every living thing needs a place to live that provides it with food, water, and shelter.
            From the frozen Arctic to the baking deserts, and even in our own local woodlands and ponds, 
            discover how animals and plants have adapted to survive in their unique habitats.
          </p>
        </header>

        <HabitatsBrowser />
      </div>
    </div>
  );
}
