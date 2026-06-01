import { ButWhyBrowser } from '@/components/ButWhyBrowser';

export const metadata = {
  title: 'But Why? — Ecology Curriculum',
  description:
    'Short conversations about nature between a child and a grown-up, revealed one question at a time.',
};

export default function ButWhyPage() {
  return (
    <div className="main-scroll-area">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 border-b-4 border-yellow-400 inline-block pb-2 mb-4">
            But Why?
          </h1>
          <p className="max-w-3xl text-lg text-slate-700 leading-relaxed">
            Questions children, and adults that remain curious, ask about the natural
            world, answered in short conversations between Maya and her Grandad. Each
            one is revealed a turn at a time, so you or the reader can go at their own
            pace and maybe even &lsquo;take part&rsquo; in the conversation by thinking
            about what the other person might say. Choose a question to begin, or
            filter them by school year group.
          </p>
          <p className="mt-4 max-w-3xl text-lg text-slate-700 leading-relaxed">
            Being curious is often the beginning of a fun adventure. Asking questions
            is a great way to learn. Some of the most brilliant people became that way
            precisely because they kept asking questions. Often if you ask yourself a
            question, an answer will magically present itself. Try it! You might not
            always be right, but every idea can lead to new ideas and questions and
            before you know it you are exploring and sharing these ideas with others
            and learning together.
          </p>
        </header>

        <ButWhyBrowser />
      </div>
    </div>
  );
}
