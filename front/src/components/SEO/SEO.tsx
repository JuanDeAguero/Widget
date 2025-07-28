import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Widget - Build Amazing Digital Experiences',
  description = 'Widget is a powerful platform for creating interactive applications and managing your digital workflow. Start building today with our intuitive tools and comprehensive features.',
  keywords = 'widget, digital experiences, web applications, interactive tools, workflow management, app builder',
  canonical,
  ogImage,
  noIndex = false
}) => {
  useEffect(() => {
    document.title = title;

    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords);
    updateMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    if (ogImage) {
      updateMetaTag('property', 'og:image', ogImage);
    }

    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    if (ogImage) {
      updateMetaTag('name', 'twitter:image', ogImage);
    }

    if (canonical) {
      updateLinkTag('canonical', canonical);
    }
  }, [title, description, keywords, canonical, ogImage, noIndex]);

  return null;
};

function updateMetaTag(attribute: string, attributeValue: string, content: string) {
  let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, attributeValue);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  
  element.setAttribute('href', href);
}