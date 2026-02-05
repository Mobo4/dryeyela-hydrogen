import {Image} from '@shopify/hydrogen';

import type {FeaturedCollectionDetailsFragment} from 'storefrontapi.generated';
import {Heading, Section} from '~/components/Text';
import {Grid} from '~/components/Grid';
import {Link} from '~/components/Link';

type FeaturedCollectionsProps = {
  collections?: {
    nodes: FeaturedCollectionDetailsFragment[];
  };
  title?: string;
  [key: string]: any;
};

export function FeaturedCollections({
  collections,
  title = 'Collections',
  ...props
}: FeaturedCollectionsProps) {
  const haveCollections = collections?.nodes && collections.nodes.length > 0;
  if (!haveCollections || !collections) return null;

  const collectionsWithImage = collections.nodes.filter((item: FeaturedCollectionDetailsFragment) => item.image);

  return (
    <Section {...props} heading={title}>
      <Grid items={collectionsWithImage.length}>
        {collectionsWithImage.map((collection: FeaturedCollectionDetailsFragment) => {
          return (
            <Link key={collection.id} to={`/collections/${collection.handle}`} className="group">
              <div className="grid gap-4">
                {/* Clean grey background - Professional studio photography standard */}
                <div className="card-image aspect-[3/2] rounded-xl overflow-hidden relative bg-[#F5F5F5] shadow-lg border border-gray-200/50 group-hover:shadow-xl transition-all duration-300">
                  {collection?.image && (
                    <Image
                      alt={`Image of ${collection.title}`}
                      data={collection.image}
                      sizes="(max-width: 32em) 100vw, 33vw"
                      aspectRatio="3/2"
                      className="object-contain p-4 md:p-6 relative z-10 group-hover:scale-105 transition-transform duration-300 image-render-crisp-edges"
                    />
                  )}
                </div>
                <Heading size="copy" className="group-hover:text-besilos-blue transition-colors">{collection.title}</Heading>
              </div>
            </Link>
          );
        })}
      </Grid>
    </Section>
  );
}
