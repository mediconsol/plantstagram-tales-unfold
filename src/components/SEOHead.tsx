import React from 'react'
import { Helmet } from 'react-helmet-async'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
}

const DEFAULT_SEO = {
  title: 'Plantgram - 식물도 피드를 올린다',
  description: '식물들의 특별한 순간을 기록하고 공유하는 소셜 플랫폼. 자연과 함께하는 일상을 나누고, 식물 친구들과 소통해보세요. 🌱',
  keywords: '식물, 플랜트그램, 식물키우기, 반려식물, 가드닝, 식물일기, 식물소통, 자연, 힐링, 그린라이프',
  image: 'https://aatto.kr/og-image.jpg',
  kakaoImage: 'https://aatto.kr/kakao-share-image.jpg',
  url: 'https://aatto.kr/',
  type: 'website' as const,
  siteName: 'Plantgram',
  locale: 'ko_KR',
  twitterHandle: '@mediconsol'
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags
}) => {
  const seoTitle = title ? `${title} | ${DEFAULT_SEO.siteName}` : DEFAULT_SEO.title
  const seoDescription = description || DEFAULT_SEO.description
  const seoKeywords = keywords || DEFAULT_SEO.keywords
  const seoImage = image || DEFAULT_SEO.image
  const seoUrl = url || DEFAULT_SEO.url
  const fullKeywords = tags ? `${seoKeywords}, ${tags.join(', ')}` : seoKeywords

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={fullKeywords} />
      {author && <meta name="author" content={author} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={seoTitle} />
      <meta property="og:site_name" content={DEFAULT_SEO.siteName} />
      <meta property="og:locale" content={DEFAULT_SEO.locale} />
      
      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          {author && <meta property="article:author" content={author} />}
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags && tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:image:alt" content={seoTitle} />
      <meta name="twitter:creator" content={DEFAULT_SEO.twitterHandle} />
      <meta name="twitter:site" content={DEFAULT_SEO.twitterHandle} />

      {/* KakaoTalk */}
      <meta property="kakao:title" content={seoTitle} />
      <meta property="kakao:description" content={seoDescription} />
      <meta property="kakao:image" content={DEFAULT_SEO.kakaoImage} />
      <meta property="kakao:url" content={seoUrl} />

      {/* Canonical URL */}
      <link rel="canonical" href={seoUrl} />
      
      {/* JSON-LD for specific content types */}
      {type === 'article' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": seoDescription,
            "image": seoImage,
            "author": {
              "@type": "Person",
              "name": author || "Plantgram User"
            },
            "publisher": {
              "@type": "Organization",
              "name": DEFAULT_SEO.siteName,
              "logo": {
                "@type": "ImageObject",
                "url": `${DEFAULT_SEO.url}favicon.svg`
              }
            },
            "datePublished": publishedTime,
            "dateModified": modifiedTime || publishedTime,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": seoUrl
            }
          })}
        </script>
      )}
    </Helmet>
  )
}

// 페이지별 SEO 프리셋
export const SEOPresets = {
  home: {
    title: 'Plantgram',
    description: '식물들의 특별한 순간을 기록하고 공유하는 소셜 플랫폼. 자연과 함께하는 일상을 나누고, 식물 친구들과 소통해보세요. 🌱',
    keywords: '식물, 플랜트그램, 식물키우기, 반려식물, 가드닝, 식물일기, 식물소통, 자연, 힐링, 그린라이프'
  },
  gallery: {
    title: '식물들의 하루 - 갤러리',
    description: '식물들의 특별한 순간들을 담은 갤러리입니다. 각각의 이야기에서 자연의 아름다움을 발견해보세요.',
    keywords: '식물갤러리, 식물사진, 식물이야기, 자연사진, 플랜트그램갤러리'
  },
  profile: {
    title: '프로필',
    description: '나의 식물 이야기와 활동을 확인해보세요. 식물과 함께한 소중한 순간들을 기록하고 공유합니다.',
    keywords: '프로필, 식물일기, 나의식물, 식물기록, 개인페이지'
  },
  create: {
    title: '새 포스트 작성',
    description: '식물과 함께한 특별한 순간을 기록해보세요. 사진과 함께 식물의 이야기를 공유할 수 있습니다.',
    keywords: '포스트작성, 식물기록, 식물사진업로드, 식물이야기작성'
  },
  settings: {
    title: '설정',
    description: '계정 설정과 앱 환경을 관리하세요. 프로필 정보, 알림 설정, 테마 등을 변경할 수 있습니다.',
    keywords: '설정, 계정관리, 프로필설정, 알림설정, 테마설정'
  }
}
