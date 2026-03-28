type StreamEntry = {
    name: string;
    description?: string;
    url: string;
};

const webcamFeeds: StreamEntry[] = [
    {
        name: "Birds (RSPB Wildlife Camera Live Streams)",
        url: "https://www.rspb.org.uk/whats-happening/tune-in-to-our-wildlife-camera-livestreams",
    },
    {
        name: "Rutland Ospreys (Leicestershire & Rutland Wildlife Trust)",
        description: "One of the most famous streams in the UK. The Manton Bay nest features high-quality video and sound.",
        url: "https://www.lrwt.org.uk/rutlandospreys",
    },
    {
        name: "Barn Owls (Dorset Wildlife Trust)",
        description: "Located at Lorton Meadows, this is excellent for seeing how owls care for their owlets in a nest box.",
        url: "https://www.dorsetwildlifetrust.org.uk/wildlifewebcam",
    },
    {
        name: "Brownsea Island Lagoon (Dorset Wildlife Trust)",
        description: "A \u201cbird\u2019s-eye view\u201d of a coastal lagoon. In winter, look for Avocets; in summer, Tern colonies.",
        url: "https://www.dorsetwildlifetrust.org.uk/wildlife/brownsea-lagoon-wildlife-webcams",
    },
    {
        name: "Edinburgh Zoo Webcams",
        description: "High-definition feeds for Penguins, Tigers, and Koalas. The Penguin Cam is particularly active and popular with KS1/KS2.",
        url: "https://www.edinburghzoo.org.uk/animals/webcams",
    },
    {
        name: "Folly Farm Barn Cam",
        description: "Perfect for younger children to watch lambs and goats, especially during the spring lambing season.",
        url: "https://www.folly-farm.co.uk/webcams/",
    },
    {
        name: "Wildlife Trusts",
        description: "Streams from webcams across the British Isles. Ospreys, puffins, peregrines, owls\u2026and more!",
        url: "https://www.wildlifetrusts.org/webcams",
    },
];


function StreamTable({ entries }: { entries: StreamEntry[] }) {
    return (
        <div style={{
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            marginBottom: '2rem',
        }}>
            {entries.map((entry, i) => (
                <div
                    key={i}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        padding: '1rem 1.25rem',
                        borderBottom: i < entries.length - 1 ? '1px solid #e2e8f0' : 'none',
                        backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fafc',
                    }}
                >
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>
                            {entry.name}
                        </div>
                        {entry.description && (
                            <div style={{ marginTop: '0.2rem', color: '#475569', fontSize: '0.875rem', lineHeight: 1.5 }}>
                                {entry.description}
                            </div>
                        )}
                    </div>
                    <div style={{ flexShrink: 0 }}>
                        <a
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="stream-visit-btn"
                        >
                            Visit ↗
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function LiveStreamsPage() {
    return (
        <article className="markdown-content main-scroll-area">
            <h1>Live Streams</h1>
            <p>
                The best way to experience nature is to be out in it, to hear it, smell it, touch it, and see it. But it&apos;s not always practical so here are some live feeds.
            </p>
            <p>
                <em>If one stream isn&apos;t working or the nest is empty, try another one — or come back later!</em>
            </p>

            <h2>Webcam Feeds</h2>
            <StreamTable entries={webcamFeeds} />

            <h2>Interactive Live Lessons</h2>
            <ul>
                <li>
                    <strong>WWF-UK &ldquo;Happy by Nature&rdquo;</strong>: The WWF-UK runs a series of scheduled live lessons. Their next one on UK Nature is on Thursday, 26th March 2026 at 2pm GMT. Teachers can register via their{' '}
                    <a href="https://www.wwf.org.uk/get-involved/schools/calendar" target="_blank" rel="noopener noreferrer">Schools Calendar.</a>
                </li>
            </ul>
        </article>
    );
}
