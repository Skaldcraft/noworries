export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
    
    // Ensure imagePath starts with a slash
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    
    // Obtener la base de Vite de forma robusta
    const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    
    return `${baseUrl}${cleanPath}`;
};
