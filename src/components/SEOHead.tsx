import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "B.E.E App Bahamas - Business, Events & E-commerce Platform",
  description = "Join B.E.E App Bahamas - the premier social platform connecting Bahamian businesses, events, and e-commerce. Share content, discover local businesses, and engage with your community.",
  keywords = "Bahamas, social media, business network, events, e-commerce, community, Caribbean, Nassau, local business",
  image = "https://beeappbahamas.com/lovable-uploads/d5511939-48e5-44cf-9f2b-d8f9e829b842.png",
  url = "https://beeappbahamas.com",
  type = "website",
  author = "B.E.E App Bahamas",
  publishedTime,
  modifiedTime,
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="B.E.E App Bahamas" />
      <meta property="og:locale" content="en_BS" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@BEEAppBahamas" />
      <meta name="twitter:creator" content="@BEEAppBahamas" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Structured Data for the specific page */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === "article" ? "Article" : "WebPage",
          "headline": title,
          "description": description,
          "url": url,
          "image": image,
          "author": {
            "@type": "Organization",
            "name": author,
            "url": "https://beeappbahamas.com"
          },
          "publisher": {
            "@type": "Organization",
            "name": "B.E.E App Bahamas",
            "logo": {
              "@type": "ImageObject",
              "url": image
            }
          },
          ...(publishedTime && { "datePublished": publishedTime }),
          ...(modifiedTime && { "dateModified": modifiedTime })
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;