export const getImageUrl = (path) => {
    if (!path) return null;
    
    // If it's already a full URL (e.g., external image or Google Maps), return as is
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
        return path;
    }

    // In local development, Vite proxies /uploads and /public directly
    // But in production, we need to point to the actual backend domain
    const apiUrl = import.meta.env.VITE_API_URL;
    
    if (apiUrl) {
        try {
            // Parse the VITE_API_URL (e.g., https://cais-api.onrender.com/api/v1)
            // and extract just the origin (https://cais-api.onrender.com)
            const url = new URL(apiUrl);
            const origin = url.origin;
            
            // Ensure proper slashes
            const cleanPath = path.startsWith('/') ? path : `/${path}`;
            return `${origin}${cleanPath}`;
        } catch (e) {
            // Fallback if URL parsing fails
            return path;
        }
    }
    
    // Fallback for local development or if VITE_API_URL is missing
    return path.startsWith('/') ? path : `/${path}`;
};
