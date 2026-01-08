# DryEyeLA Collection Structure

Create these collections in Shopify Admin to match competitive structure and maximize SEO.

## Primary Product Collections

### By Product Type
| Collection Handle | Collection Title | SEO Keywords |
|------------------|------------------|--------------|
| `eye-drops-lubricants` | Eye Drops & Lubricants | eye drops, lubricant eye drops, artificial tears, dry eye drops |
| `eyelid-cleansers` | Eyelid Cleansers | eyelid wipes, lid scrub, blepharitis cleanser, eyelid foam |
| `eyelid-sprays` | Eyelid Sprays | hypochlorous acid spray, eyelid spray, antimicrobial spray |
| `eye-masks` | Eye Masks & Compresses | heated eye mask, warm compress, dry eye mask, MGD treatment |
| `vitamins-supplements` | Vitamins & Supplements | omega-3 for dry eye, eye vitamins, EPA DHA supplements |
| `contact-lens-supplies` | Contact Lens Supplies | scleral lens solution, contact lens solution, saline solution |
| `allergy-relief` | Allergy Eye Relief | allergy eye drops, antihistamine drops, itchy eye relief |

### By Brand
| Collection Handle | Collection Title |
|------------------|------------------|
| `prn` | PRN Omega-3 Products |
| `optase` | Optase Eye Care |
| `oasis-tears` | Oasis Tears |
| `macuhealth` | MacuHealth Supplements |
| `bruder` | Bruder Eye Masks |
| `avenova` | Avenova Eyelid Care |
| `bausch-lomb` | Bausch + Lomb |
| `systane` | Systane Drops |
| `refresh` | Refresh Tears |
| `ocusoft` | Ocusoft Lid Scrub |
| `retaine` | Retaine MGD |
| `menicon` | Menicon Lacripure |
| `tangible` | Tangible Lens Care |
| `heyedrate` | Heyedrate Products |

### By Symptom (SEO Landing Pages)
| Collection Handle | Collection Title | Target Keywords |
|------------------|------------------|-----------------|
| `dry-gritty-eyes` | Dry & Gritty Eye Relief | dry eyes, gritty eyes, sandy eyes, eye dryness treatment |
| `burning-stinging-eyes` | Burning & Stinging Eye Relief | burning eyes, stinging eyes, eye irritation relief |
| `eye-redness` | Eye Redness Relief | red eyes, bloodshot eyes, eye redness treatment |
| `watery-eyes` | Watery Eye Treatment | watery eyes, excessive tearing, epiphora treatment |
| `severe-chronic-dry-eye` | Severe Dry Eye Treatment | severe dry eye, chronic dry eye, DED treatment |
| `blepharitis-mgd` | Blepharitis & MGD Treatment | blepharitis treatment, meibomian gland dysfunction, MGD |

### By Ingredient
| Collection Handle | Collection Title | Keywords |
|------------------|------------------|----------|
| `omega-3` | Omega-3 Products | omega-3, EPA, DHA, fish oil for dry eye |
| `hypochlorous-acid` | Hypochlorous Acid Products | HOCl, hypochlorous acid, antimicrobial spray |
| `tea-tree` | Tea Tree Products | tea tree oil, demodex treatment |
| `hyaluronic-acid` | Hyaluronic Acid Drops | hyaluronic acid, HA eye drops |
| `preservative-free` | Preservative Free Products | preservative free drops, PF eye drops |

## Smart Collections Setup

### Automatic Collection Rules (Shopify)

**Eye Drops & Lubricants:**
```
Product type IS EQUAL TO "Eye Drops"
OR Product tag CONTAINS "lubricant"
OR Product tag CONTAINS "artificial tears"
```

**Omega-3 Products:**
```
Product tag CONTAINS "omega-3"
OR Product tag CONTAINS "omega 3"
OR Product title CONTAINS "omega"
```

**Preservative Free:**
```
Product tag CONTAINS "preservative free"
OR Product title CONTAINS "preservative free"
OR Product title CONTAINS "PF"
```

## SEO Meta Templates

### Collection SEO Title Template
```
{Collection Name} | DryEyeLA - Los Angeles Dry Eye Products
```

### Collection SEO Description Template
```
Shop {collection name} at DryEyeLA. Doctor-recommended {product type} for dry eye relief.
Free shipping on orders over $89. Trusted by Los Angeles dry eye specialists.
```

## Featured Collections (Homepage)

1. **Best Sellers** - Manual collection of top 8 products
2. **New Arrivals** - Automated by date added
3. **Doctor Recommended** - Featured products with tag "doctor-recommended"
4. **On Sale** - Products with compare-at price

## Collection Image Recommendations

Each collection should have:
- **Primary image**: 1200x628px (social sharing ratio)
- **Hero banner**: 1920x600px (collection page hero)
- High-quality product photography with consistent styling

## Implementation Steps

### Step 1: Create Collections in Shopify Admin
1. Go to Products → Collections
2. Create each collection from the tables above
3. Set up automated rules where applicable
4. Add SEO title and description

### Step 2: Add Products to Collections
1. Import products using the CSV: `data/shopify-products-import.csv`
2. Tag products appropriately for automatic collection assignment
3. Manually assign products to brand collections

### Step 3: Configure Navigation
1. Go to Online Store → Navigation
2. Create "Main Menu" with:
   - Shop (dropdown with product type collections)
   - Brands (dropdown with brand collections)
   - Symptoms (dropdown with symptom collections)
   - Learn (blog, FAQ, treatment guide)

### Step 4: Configure Hydrogen Routes
The following routes are already created:
- `/symptoms` - Symptom landing page index
- `/symptoms/[handle]` - Individual symptom pages
- `/collections/[handle]` - Standard collection pages

## Priority Order

1. **Week 1**: Create product type collections (7 collections)
2. **Week 2**: Create brand collections (14 collections)
3. **Week 3**: Create symptom collections (6 collections)
4. **Week 4**: Create ingredient collections (5 collections)

Total: 32 collections for comprehensive SEO coverage
