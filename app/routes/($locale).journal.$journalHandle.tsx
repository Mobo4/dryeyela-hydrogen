import {
  json,
  type MetaArgs,
  type LinksFunction,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta, Image} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';

import {Link} from '~/components/Link';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {
  HeroSection,
  TrustBadgesSection,
  CTASection,
} from '~/components/sections';

import styles from '../styles/custom-font.css?url';

const BLOG_HANDLE = 'journal';

export const headers = routeHeaders;

export const links: LinksFunction = () => {
  return [{rel: 'stylesheet', href: styles}];
};

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {language, country} = context.storefront.i18n;

  invariant(params.journalHandle, 'Missing journal handle');

  const {blog} = await context.storefront.query(ARTICLE_QUERY, {
    variables: {
      blogHandle: BLOG_HANDLE,
      articleHandle: params.journalHandle,
      language,
    },
  });

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  const article = blog.articleByHandle;

  const formattedDate = new Intl.DateTimeFormat(`${language}-${country}`, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article?.publishedAt!));

  const seo = seoPayload.article({article, url: request.url});

  return json({article, formattedDate, seo});
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Article() {
  const {article, formattedDate} = useLoaderData<typeof loader>();

  const {title, image, contentHtml, author} = article;

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title={title}
        subtitle={`${formattedDate}${author?.name ? ` • By ${author.name}` : ''}`}
        breadcrumbs={[
          {label: 'Home', to: '/'},
          {label: 'Journal', to: '/journal'},
          {label: title},
        ]}
        size="small"
        background="cream"
      />

      {/* Article Content */}
      <article className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12">
          {/* Back Link */}
          <Link
            to="/journal"
            className="inline-flex items-center gap-2 text-besilos-sage hover:text-besilos-sage/80 mb-8 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Journal
          </Link>

          {/* Featured Image */}
          {image && (
            <div className="mb-10 rounded-2xl overflow-hidden">
              <Image
                data={image}
                className="w-full object-cover"
                sizes="(min-width: 1024px) 896px, 100vw"
                loading="eager"
              />
            </div>
          )}

          {/* Article Body */}
          <div
            dangerouslySetInnerHTML={{__html: contentHtml}}
            className="prose prose-lg max-w-none prose-headings:text-besilos-navy prose-headings:font-bold prose-p:text-besilos-navy/80 prose-a:text-besilos-sage prose-a:no-underline hover:prose-a:underline prose-strong:text-besilos-navy prose-ul:text-besilos-navy/80 prose-ol:text-besilos-navy/80 prose-li:marker:text-besilos-sage prose-img:rounded-xl"
          />

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-besilos-sage/10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-semibold text-besilos-navy mb-2">Share This Article</h4>
                <p className="text-sm text-besilos-navy/60">Help others learn about dry eye care</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.open(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`,
                        '_blank',
                        'noopener,noreferrer'
                      );
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-besilos-cream flex items-center justify-center text-besilos-navy hover:bg-besilos-sage hover:text-white transition-colors"
                  aria-label="Share on Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                        '_blank',
                        'noopener,noreferrer'
                      );
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-besilos-cream flex items-center justify-center text-besilos-navy hover:bg-besilos-sage hover:text-white transition-colors"
                  aria-label="Share on Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-besilos-cream flex items-center justify-center text-besilos-navy hover:bg-besilos-sage hover:text-white transition-colors"
                  aria-label="Copy link"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Trust Badges */}
      <TrustBadgesSection variant="compact" />

      {/* CTA Section */}
      <CTASection
        title="Ready to Find Relief?"
        description="Shop our curated collection of doctor-recommended dry eye products."
        primaryCTA={{label: 'Shop Products', to: '/collections/all'}}
        secondaryCTA={{label: 'More Articles', to: '/journal'}}
        variant="centered"
        background="navy"
      />
    </>
  );
}

const ARTICLE_QUERY = `#graphql
  query ArticleDetails(
    $language: LanguageCode
    $blogHandle: String!
    $articleHandle: String!
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
`;
