import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    canonical?: string;
    type?: string;
    image?: string;
}

const SEO = ({
    title = "Laptop Pro | Boutique d'ordinateurs professionnels",
    description = "Achetez les meilleurs ordinateurs portables professionnels au Maroc. Large gamme de laptops, stations de travail et accessoires.",
    canonical,
    type = "website",
    image
}: SEOProps) => {
    const siteName = "Laptop Pro";
    const fullTitle = title === siteName ? title : `${title} | ${siteName}`;

    return (
        <Helmet>
            {/* Basic tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            {image && <meta property="og:image" content={image} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
};

export default SEO;
