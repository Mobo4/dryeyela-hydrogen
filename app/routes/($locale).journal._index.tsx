import {
  json,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {flattenConnection, getSeoMeta, Image} from '@shopify/hydrogen';

import {Link} from '~/components/Link';
import {getImageLoadingPriority, PAGINATION_SIZE} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import type {ArticleFragment} from 'storefrontapi.generated';
import {
  HeroSection,
  TrustBadgesSection,
  CTASection,
} from '~/components/sections';

const BLOG_HANDLE = 'Journal';

export const headers = routeHeaders;

export const loader = async ({
  request,
  context: {storefront},
}: LoaderFunctionArgs) => {
  const {language, country} = storefront.i18n;

  try {
    const {blog} = await storefront.query(BLOGS_QUERY, {
      variables: {
        blogHandle: BLOG_HANDLE,
        pageBy: PAGINATION_SIZE,
        language,
      },
    });

    if (!blog?.articles) {
      // Return empty articles if no blog exists
      return json({
        articles: [],
        seo: {
          title: 'Dry Eye Journal | DryEyeLA',
          description: 'Expert insights, tips, and guides for managing dry eye and maintaining optimal eye health.',
        },
      });
    }

    const articles = flattenConnection(blog.articles).map((article) => {
      const {publishedAt} = article!;
      return {
        ...article,
        publishedAt: new Intl.DateTimeFormat(`${language}-${country}`, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(new Date(publishedAt!)),
      };
    });

    const seo = seoPayload.blog({blog, url: request.url});

    return json({articles, seo});
  } catch (error) {
    // Handle case where blog doesn't exist
    return json({
      articles: [],
      seo: {
        title: 'Dry Eye Journal | DryEyeLA',
        description: 'Expert insights, tips, and guides for managing dry eye and maintaining optimal eye health.',
      },
    });
  }
};

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Journals() {
  const {articles} = useLoaderData<typeof loader>();
  const hasArticles = articles.length > 0;

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title="Dry Eye Journal"
        subtitle="Expert insights, tips, and guides for managing dry eye and maintaining optimal eye health"
        breadcrumbs={[
          {label: 'Home', to: '/'},
          {label: 'Journal'},
        ]}
        size="small"
        background="cream"
      />

      {/* Trust Badges */}
      <TrustBadgesSection variant="compact" />

      {/* Articles Grid */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          {hasArticles ? (
            <>
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-besilos-navy mb-4">
                  Latest Articles
                </h2>
                <p className="text-besilos-navy/70 max-w-2xl mx-auto">
                  Stay informed with our expert articles on dry eye treatment, prevention, and eye health.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article, i) => (
                  <ArticleCard
                    blogHandle={BLOG_HANDLE.toLowerCase()}
                    article={article}
                    key={article.id}
                    loading={getImageLoadingPriority(i, 2)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <svg
                className="w-20 h-20 mx-auto text-besilos-sage/30 mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-besilos-navy mb-4">
                Coming Soon
              </h2>
              <p className="text-besilos-navy/60 mb-8 max-w-md mx-auto">
                We're working on bringing you expert articles about dry eye care. Check back soon!
              </p>
              <Link
                to="/collections/all"
                className="inline-flex items-center justify-center px-8 py-4 bg-besilos-sage text-white font-semibold rounded-full hover:bg-besilos-sage/90 transition-colors"
              >
                Shop Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Have Questions About Dry Eye?"
        description="Our team of dry eye specialists is here to help you find the right products and treatments."
        primaryCTA={{label: 'Contact Us', to: '/pages/contact'}}
        secondaryCTA={{label: 'Shop Products', to: '/collections/all'}}
        variant="centered"
        background="navy"
      />
    </>
  );
}

function ArticleCard({
  blogHandle,
  article,
  loading,
}: {
  blogHandle: string;
  article: ArticleFragment;
  loading?: HTMLImageElement['loading'];
}) {
  return (
    <article className="group">
      <Link to={`/${blogHandle}/${article.handle}`} className="block">
        {article.image ? (
          <div className="aspect-[3/2] rounded-xl overflow-hidden mb-4 bg-besilos-cream">
            <Image
              alt={article.image.altText || article.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              data={article.image}
              aspectRatio="3/2"
              loading={loading}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
          </div>
        ) : (
          <div className="aspect-[3/2] rounded-xl mb-4 bg-besilos-cream flex items-center justify-center">
            <svg
              className="w-16 h-16 text-besilos-sage/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
        )}
        <div className="space-y-2">
          <span className="text-sm text-besilos-sage font-medium">
            {article.publishedAt}
          </span>
          <h3 className="text-lg font-semibold text-besilos-navy group-hover:text-besilos-sage transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.author?.name && (
            <p className="text-sm text-besilos-navy/60">
              By {article.author.name}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}

const BLOGS_QUERY = `#graphql
query Blog(
  $language: LanguageCode
  $blogHandle: String!
  $pageBy: Int!
  $cursor: String
) @inContext(language: $language) {
  blog(handle: $blogHandle) {
    title
    seo {
      title
      description
    }
    articles(first: $pageBy, after: $cursor) {
      edges {
        node {
          ...Article
        }
      }
    }
  }
}

fragment Article on Article {
  author: authorV2 {
    name
  }
  contentHtml
  handle
  id
  image {
    id
    altText
    url
    width
    height
  }
  publishedAt
  title
}
`;
