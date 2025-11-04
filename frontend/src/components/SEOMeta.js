import { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

function SEOMeta() {
  const { theme } = useTheme();

  useEffect(() => {
    // Update document title
    const metaTitle = theme.meta_title || theme.site_name || 'JM Online';
    document.title = metaTitle;

    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      if (!content) return;
      
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Standard meta tags
    updateMetaTag('description', theme.meta_description);
    updateMetaTag('keywords', theme.meta_keywords);

    // Open Graph meta tags
    updateMetaTag('og:title', theme.og_title || theme.meta_title || theme.site_name, true);
    updateMetaTag('og:description', theme.og_description || theme.meta_description, true);
    updateMetaTag('og:image', theme.og_image || (theme.logo_url ? `http://localhost:8082${theme.logo_url}` : ''), true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:url', window.location.href, true);
    updateMetaTag('og:site_name', theme.site_name || 'JM Online', true);

    // Twitter Card meta tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', theme.og_title || theme.meta_title || theme.site_name);
    updateMetaTag('twitter:description', theme.og_description || theme.meta_description);
    updateMetaTag('twitter:image', theme.og_image || (theme.logo_url ? `http://localhost:8082${theme.logo_url}` : ''));

  }, [theme]);

  return null; // This component doesn't render anything
}

export default SEOMeta;

