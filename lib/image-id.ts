/**
 * Generate a deterministic, short, URL-safe HTML id from an image filename.
 * Works identically in Node and the browser (no crypto dependency).
 */
export function imageId(filename: string): string {
    const str = filename.trim().replace(/ /g, '_').toLowerCase();
    // Stable double 32-bit hash (cyrb53-style)
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
        const ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    const combined = (h2 >>> 0) * 0x100000000 + (h1 >>> 0);
    return 'img-' + combined.toString(36).slice(0, 10);
}
