import { organizationJsonLd, localBusinessJsonLd, personJsonLd, websiteJsonLd } from "@/lib/seo";

export function JsonLd() {
  const graphs = [organizationJsonLd(), localBusinessJsonLd(), personJsonLd(), websiteJsonLd()];

  return (
    <>
      {graphs.map((data, i) => (
        <script
          // eslint-disable-next-line react/no-danger
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
