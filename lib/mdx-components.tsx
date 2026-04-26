import Link from 'next/link';
import { NatureExample } from '@/components/mdx/NatureExample';
import { Requirement } from '@/components/mdx/Requirement';
import { Activity, Reflection } from '@/components/mdx/Activities';
import { Note, Guidance } from '@/components/mdx/Micro';
import { Handout } from '@/components/mdx/Handout';
import { HandoutCard } from '@/components/mdx/HandoutCard';
import { HandoutHeader } from '@/components/mdx/HandoutHeader';
import { ActivitySheet } from '@/components/mdx/ActivitySheet';
import { ActivitySheetCard } from '@/components/mdx/ActivitySheetCard';
import { ActivitySheetHeader } from '@/components/mdx/ActivitySheetHeader';
import { Gallery } from '@/components/mdx/Gallery';
import { WikiImage } from '@/components/mdx/WikiImage';
import { DictionaryParserProvider } from '@/components/DictionaryWrapper';
import { makeHeadingIdCounter } from '@/lib/content';

export function getMdxComponents(getId?: (text: string) => string) {
    const idGenerator = getId || makeHeadingIdCounter();

    return {
        NatureExample,
        Requirement,
        Activity,
        Reflection,
        Note,
        Guidance,
        Handout,
        HandoutCard,
        HandoutHeader,
        ActivitySheet,
        ActivitySheetCard,
        ActivitySheetHeader,
        Gallery,
        WikiImage,
        Ref: ({ children }: any) => (
            <p className="text-sm text-gray-500 italic">{children}</p>
        ),
        a: ({ href, children }: any) => {
            if (href && !href.startsWith('http')) {
                return <Link href={href}>{children}</Link>;
            }
            return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
        },
        h2: ({ children }: any) => {
            const text = typeof children === 'string' ? children : '';
            const id = idGenerator(text);
            return <h2 id={id}>{children}</h2>;
        },
        h3: ({ children }: any) => {
            const text = typeof children === 'string' ? children : '';
            const id = idGenerator(text);
            return <h3 id={id}>{children}</h3>;
        },
        p: ({ children }: any) => <p><DictionaryParserProvider>{children}</DictionaryParserProvider></p>,
        li: ({ children }: any) => <li><DictionaryParserProvider>{children}</DictionaryParserProvider></li>,
    };
}
