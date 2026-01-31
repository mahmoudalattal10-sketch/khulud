
// 🖼️ GLOBAL IMAGE HELPER
// ==============================================
// Handles resolving image URLs from backend, external sources, or fallbacks.

export const getImageUrl = (url?: string | null) => {
    // 1. Invalid or Missing -> Fallback
    if (!url || url === 'undefined' || url === 'null') {
        return '/assets/images/ui/logo.png'; // Verified local fallback
    }

    // 2. Already Absolute (Unsplash, External, or already has http)
    if (url.startsWith('http') || url.startsWith('https') || url.startsWith('blob:')) {
        return url;
    }

    // 3. Local Upload (Relative Path)
    // Ensure we don't double-slash
    const cleanPath = url.startsWith('/') ? url : `/${url}`;

    // Use encodeURI to handle Arabic/Spaces without over-encoding safe chars (like parens)
    // PROXY FIX: Return relative path so Vite handles the proxy to port 3001
    return encodeURI(cleanPath);
};

export const getGalleryImages = (imagesStr?: string | string[] | null) => {
    if (!imagesStr) return [];

    try {
        const images = Array.isArray(imagesStr) ? imagesStr : JSON.parse(imagesStr);
        return images.map(getImageUrl);
    } catch (e) {
        return [];
    }
};
