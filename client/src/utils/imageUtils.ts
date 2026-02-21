export const normalizeImageUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith('blob:') || url.startsWith('http')) return url;
    return `/api${url}`;
};