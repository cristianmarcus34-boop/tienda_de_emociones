import { absoluteUrl } from "@/lib/site";

export function StoreSEO() {
  const faqEntries = [
    {
      question: "¿Cuáles son los tiempos de envío?",
      answer:
        "Realizamos envíos a todo el país y el costo y plazo se coordinan según la zona y el tipo de regalo elegido."
    },
    {
      question: "¿Se puede incluir una dedicatoria personalizada?",
      answer:
        "Sí. En muchos productos podés agregar un mensaje o dedicatoria personalizada al momento de comprar."
    },
    {
      question: "¿Son regalos para distintas emociones y ocasiones?",
      answer:
        "Sí. Tenemos propuestas para cumpleaños, aniversarios, agradecimientos, momentos especiales y regalos para parejas."
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Tienda de Emociones",
        url: absoluteUrl("/"),
        logo: absoluteUrl("/images/logo.jpeg"),
        sameAs: ["https://www.instagram.com/"],
        areaServed: "AR",
        contactType: "customer service"
      },
      {
        "@type": "WebSite",
        name: "Tienda de Emociones",
        url: absoluteUrl("/"),
        potentialAction: {
          "@type": "SearchAction",
          target: `${absoluteUrl("/")}?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Store",
        name: "Tienda de Emociones",
        url: absoluteUrl("/"),
        image: absoluteUrl("/images/logo.jpeg"),
        description:
          "Regalos con intención para acompañar cada emoción. Encontrá detalles especiales para cada momento importante.",
        priceRange: "$$",
        areaServed: "AR",
        sameAs: ["https://www.instagram.com/"],
        currencyAccepted: "ARS",
        paymentAccepted: "Tarjeta de crédito, transferencia bancaria, efectivo",
        logo: absoluteUrl("/images/logo.jpeg"),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Regalos para cada emoción",
          itemListElement: [
            "regalos personalizados",
            "regalos para parejas",
            "regalos para cumpleaños",
            "detalles emotivos"
          ]
        }
      },
      {
        "@type": "FAQPage",
        mainEntity: faqEntries.map((entry) => ({
          "@type": "Question",
          name: entry.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: entry.answer
          }
        }))
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductSEO({
  product
}: {
  product: {
    name: string;
    description: string;
    slug: string;
    category: string;
    image: string;
    price: number;
  };
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image,
    description: product.description,
    category: product.category,
    sku: product.slug,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/productos/${product.slug}`),
      priceCurrency: "ARS",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
