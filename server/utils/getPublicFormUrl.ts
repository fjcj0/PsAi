export const getPublicIdFromUrl = (url: string, location: string) => {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return `${location}/${filename.split('.')[0]}`;
};