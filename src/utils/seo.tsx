import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  schema?: object;
}

export const useSEO = ({ title, description, keywords, schema }: SEOProps) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', description);
    }

    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) metaKeywords.setAttribute('content', keywords);
    }

    if (schema) {
      const scriptId = 'schema-org-jsonld';
      let scriptTag = document.getElementById(scriptId) as HTMLScriptElement;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    }

    return () => {
      const scriptTag = document.getElementById('schema-org-jsonld');
      if (scriptTag) scriptTag.remove();
    };
  }, [title, description, keywords, schema]);
};

export const getWebsiteSchema = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://example.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: 'وكيلي AI',
    alternateName: 'Wakili AI',
    description:
      'وكيلي AI - اختر فريقك من الوكلاء الأذكياء لأتمتة التسويق وكتابة المحتوى وخدمة العملاء وتحليل البيانات',
    url: siteUrl,
    inLanguage: ['ar', 'en'],
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
};

export const getOrganizationSchema = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://example.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'وكيلي AI',
    alternateName: 'Wakili AI',
    description: 'حلول ذكاء اصطناعي متقدمة للشركات والأفراد - وكلاء أذكياء لأتمتة الأعمال',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      '@id': `${siteUrl}/#logo`,
      url: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/d4a98132b4c7bfb8a15b56d046ddf8d5.png',
      width: 512,
      height: 512,
      caption: 'وكيلي AI',
    },
    image: {
      '@id': `${siteUrl}/#logo`,
    },
    sameAs: [
      'https://x.com/alraigah',
      'https://t.me/alraigah_M',
      'https://www.youtube.com/@usb_boot',
      'https://www.tiktok.com/@alraigah',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'cvlink2030@gmail.com',
      contactType: 'customer service',
      availableLanguage: ['Arabic', 'English'],
    },
    foundingLocation: {
      '@type': 'Place',
      addressCountry: 'SA',
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'Saudi Arabia',
      },
      {
        '@type': 'Place',
        name: 'العالم العربي',
      },
    ],
  };
};

export const getSoftwareApplicationSchema = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://example.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${siteUrl}/#software`,
    name: 'وكيلي AI',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'ArtificialIntelligence',
    operatingSystem: 'Web',
    offers: [
      {
        '@type': 'Offer',
        name: 'تجربة مجانية',
        price: '0',
        priceCurrency: 'SAR',
        description: 'تجربة مجانية لاجتماع الوكلاء الذكي',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'باقة الوكيل',
        price: '99',
        priceCurrency: 'SAR',
        description: 'باقة الوكيل الاحترافي لأتمتة الأعمال',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'باقة الشركات',
        price: '299',
        priceCurrency: 'SAR',
        description: 'باقة الشركات للفرق والمؤسسات',
        availability: 'https://schema.org/InStock',
      },
    ],
    description:
      'منصة وكلاء ذكاء اصطناعي لأتمتة الأعمال والتسويق وخدمة العملاء وتحليل البيانات',
    url: siteUrl,
    image: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/d4a98132b4c7bfb8a15b56d046ddf8d5.png',
    screenshot: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/58a3c131bdee158e559bc599498f0dd3.jpeg',
    inLanguage: 'ar',
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'وكلاء ذكاء اصطناعي متخصصون',
      'اجتماعات ذكية بين الوكلاء',
      'أتمتة التسويق',
      'كتابة المحتوى',
      'خدمة العملاء الآلية',
      'تحليل البيانات',
    ],
  };
};

export const getFAQSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ما هو وكيلي AI؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'وكيلي AI منصة ذكاء اصطناعي تتيح لك اختيار فريق من الوكلاء الأذكياء المتخصصين لأتمتة أعمالك في التسويق وكتابة المحتوى وخدمة العملاء وتحليل البيانات.',
        },
      },
      {
        '@type': 'Question',
        name: 'هل يمكنني تجربة وكيلي AI مجاناً؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'نعم، يمكنك تجربة اجتماع الوكلاء الذكي مجاناً مرتين بدون تسجيل، وللمزيد يمكنك التسجيل بإيميل Google أو إيميلك الشخصي.',
        },
      },
      {
        '@type': 'Question',
        name: 'ما هي تخصصات الوكلاء المتاحة؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'يشمل وكيلي AI وكلاء متخصصين في التسويق الرقمي، كتابة المحتوى، خدمة العملاء، تحليل البيانات، البرمجة، والتخطيط الاستراتيجي.',
        },
      },
      {
        '@type': 'Question',
        name: 'كيف يعمل اجتماع الوكلاء الذكي؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'اكتب مشكلتك أو فكرتك مرة واحدة، وشاهد فريق الوكلاء المتخصصين يتناقشون ويحللون من جميع النواحي ويقدمون لك خطة عمل متكاملة مع تحذيرات المخاطر.',
        },
      },
      {
        '@type': 'Question',
        name: 'هل وكيلي AI يدعم اللغة العربية؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'نعم، وكيلي AI مصمم بالكامل لدعم اللغة العربية وخصوصيات الأسواق المحلية والعالمية، مع دعم كامل للغة الإنجليزية أيضاً.',
        },
      },
      {
        '@type': 'Question',
        name: 'ما هي وسائل الدفع المتاحة؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'يدعم وكيلي AI وسائل الدفع الرئيسية في السعودية: Visa، Mastercard، مدى، وApple Pay، جميعها بأمان تام.',
        },
      },
    ],
  };
};

export const getWebPageSchema = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://example.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}/#webpage`,
    url: siteUrl,
    name: 'وكيلي AI - فريق ذكاء اصطناعي لأتمتة أعمالك',
    description:
      'وكيلي AI - اختر فريقك من الوكلاء الأذكياء لأتمتة التسويق وكتابة المحتوى وخدمة العملاء وتحليل البيانات.',
    inLanguage: 'ar',
    isPartOf: {
      '@id': `${siteUrl}/#website`,
    },
    about: {
      '@id': `${siteUrl}/#software`,
    },
    datePublished: '2025-01-01',
    dateModified: '2025-07-15',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'الرئيسية',
          item: siteUrl,
        },
      ],
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.hero-description'],
    },
  };
};

export const getItemListSchema = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://example.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${siteUrl}/#agents-list`,
    name: 'وكلاء وكيلي AI المتخصصون',
    description: 'قائمة الوكلاء الأذكياء المتخصصين في وكيلي AI لأتمتة الأعمال',
    numberOfItems: 8,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'وكيل التسويق الرقمي',
        description: 'متخصص في استراتيجيات التسويق الرقمي وإدارة الحملات الإعلانية',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'وكيل كتابة المحتوى',
        description: 'متخصص في كتابة المحتوى الإبداعي والتسويقي باللغتين العربية والإنجليزية',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'وكيل خدمة العملاء',
        description: 'متخصص في الرد على استفسارات العملاء وحل مشاكلهم بكفاءة عالية',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'وكيل تحليل البيانات',
        description: 'متخصص في تحليل البيانات واستخراج الرؤى والتوصيات الاستراتيجية',
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'وكيل البرمجة والتطوير',
        description: 'متخصص في كتابة الكود وحل المشاكل التقنية وتطوير البرمجيات',
      },
      {
        '@type': 'ListItem',
        position: 6,
        name: 'وكيل التخطيط الاستراتيجي',
        description: 'متخصص في وضع الخطط الاستراتيجية وتحليل السوق والمنافسين',
      },
    ],
  };
};
