// Adds public organization details as machine-readable JSON-LD for search engines.
const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Φροντιστήριο Γνώση',
    url: 'https://slhm7313.github.io/-anna-sWebsite/',
    image: 'https://slhm7313.github.io/-anna-sWebsite/assets/images/school_img1.jpeg',
    description: 'Φροντιστήριο μέσης εκπαίδευσης με μαθήματα Γυμνασίου, Λυκείου και ΕΠΑΛ, σε μικρά τμήματα, στην Κορησό και την Καστοριά.',
    telephone: '+30698360730',
    email: 'gnwsi.2023@gmail.com',
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'Κορησός',
        addressRegion: 'Καστοριά',
        addressCountry: 'GR'
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: 40.503866,
        longitude: 21.37528
    },
    areaServed: [
        { '@type': 'City', name: 'Καστοριά' },
        { '@type': 'Place', name: 'Κορησός' }
    ],
    openingHoursSpecification: [
        {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '15:00',
            closes: '22:00'
        },
        {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '09:00',
            closes: '14:00'
        }
    ],
    sameAs: ['https://www.instagram.com/gnwsi.2023/']
};

export function addOrganizationStructuredData(): void {
    if (document.querySelector('script[data-organization-structured-data]')) return;

    const structuredDataScript = document.createElement('script');
    structuredDataScript.type = 'application/ld+json';
    structuredDataScript.dataset.organizationStructuredData = 'true';
    structuredDataScript.textContent = JSON.stringify(organizationStructuredData);
    document.head.append(structuredDataScript);
}
