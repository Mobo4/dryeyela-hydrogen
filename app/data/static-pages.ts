/**
 * Static Page Content
 * 
 * Fallback content for pages that may not exist in Shopify yet.
 * These pages will work locally and can be replaced with Shopify pages later.
 */

export const STATIC_PAGES: Record<string, {
  title: string;
  body: string;
  description?: string;
}> = {
  contact: {
    title: 'Contact Us',
    description: 'Get in touch with DryEyeLA - your trusted source for dry eye products.',
    body: `
      <div class="max-w-2xl mx-auto">
        <h2 class="text-2xl font-bold text-[#152c52] mb-6">Get in Touch</h2>
        <p class="text-lg text-slate-600 mb-8">
          Have questions about our products or need help finding the right solution for your dry eye needs? 
          We're here to help!
        </p>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-xl font-bold text-[#152c52] mb-2">Email</h3>
            <p class="text-slate-600">info@dryeyela.com</p>
          </div>
          
          <div>
            <h3 class="text-xl font-bold text-[#152c52] mb-2">Phone</h3>
            <p class="text-slate-600">(310) 555-0123</p>
          </div>
          
          <div>
            <h3 class="text-xl font-bold text-[#152c52] mb-2">Business Hours</h3>
            <p class="text-slate-600">
              Monday - Friday: 9:00 AM - 5:00 PM PST<br/>
              Saturday: 10:00 AM - 2:00 PM PST<br/>
              Sunday: Closed
            </p>
          </div>
        </div>
      </div>
    `,
  },
  faq: {
    title: 'Frequently Asked Questions',
    description: 'Common questions about our products, shipping, and dry eye care.',
    body: `
      <div class="max-w-3xl mx-auto space-y-8">
        <div>
          <h3 class="text-xl font-bold text-[#152c52] mb-3">What makes your products different?</h3>
          <p class="text-slate-600">
            All products are curated by eye care professionals and selected based on clinical efficacy. 
            We prioritize preservative-free formulations and pharmaceutical-grade ingredients.
          </p>
        </div>
        
        <div>
          <h3 class="text-xl font-bold text-[#152c52] mb-3">Do you offer free shipping?</h3>
          <p class="text-slate-600">
            Yes! We offer free shipping on all orders over $50 within the United States.
          </p>
        </div>
        
        <div>
          <h3 class="text-xl font-bold text-[#152c52] mb-3">How quickly will I receive my order?</h3>
          <p class="text-slate-600">
            Most orders ship within 1-2 business days. Standard shipping takes 3-5 business days. 
            Express shipping options are available at checkout.
          </p>
        </div>
        
        <div>
          <h3 class="text-xl font-bold text-[#152c52] mb-3">Can I return products if they don't work for me?</h3>
          <p class="text-slate-600">
            Yes, we offer a 30-day satisfaction guarantee. If you're not happy with your purchase, 
            contact us for a full refund.
          </p>
        </div>
      </div>
    `,
  },
  'treatment-guide': {
    title: 'Dry Eye Treatment Guide',
    description: 'Comprehensive guide to understanding and treating different types of dry eye.',
    body: `
      <div class="max-w-4xl mx-auto prose prose-lg">
        <h2 class="text-3xl font-bold text-[#152c52] mb-6">Understanding Dry Eye</h2>
        <p class="text-lg text-slate-600 mb-6">
          Dry eye disease affects millions of people and can significantly impact quality of life. 
          Understanding the different types and causes is the first step to effective treatment.
        </p>
        
        <h3 class="text-2xl font-bold text-[#152c52] mb-4">Types of Dry Eye</h3>
        <ul class="space-y-4 mb-8">
          <li><strong>Evaporative Dry Eye:</strong> Caused by Meibomian Gland Dysfunction (MGD)</li>
          <li><strong>Aqueous Deficient:</strong> Insufficient tear production</li>
          <li><strong>Mixed:</strong> Combination of both types</li>
        </ul>
        
        <h3 class="text-2xl font-bold text-[#152c52] mb-4">Treatment Options</h3>
        <p class="text-slate-600 mb-6">
          Treatment typically involves a combination of lifestyle changes, eye drops, supplements, 
          and in some cases, prescription medications. Our curated product selection addresses 
          each aspect of dry eye management.
        </p>
      </div>
    `,
  },
  'shipping-returns': {
    title: 'Shipping & Returns',
    description: 'Information about shipping policies and return procedures.',
    body: `
      <div class="max-w-3xl mx-auto space-y-8">
        <div>
          <h2 class="text-2xl font-bold text-[#152c52] mb-4">Shipping Information</h2>
          <div class="space-y-4">
            <div>
              <h3 class="text-xl font-bold text-[#152c52] mb-2">Free Shipping</h3>
              <p class="text-slate-600">Free shipping on all orders over $50 within the United States.</p>
            </div>
            <div>
              <h3 class="text-xl font-bold text-[#152c52] mb-2">Standard Shipping</h3>
              <p class="text-slate-600">$5.95 flat rate. 3-5 business days.</p>
            </div>
            <div>
              <h3 class="text-xl font-bold text-[#152c52] mb-2">Express Shipping</h3>
              <p class="text-slate-600">$12.95. 1-2 business days.</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 class="text-2xl font-bold text-[#152c52] mb-4">Returns & Refunds</h2>
          <p class="text-slate-600 mb-4">
            We offer a 30-day satisfaction guarantee. If you're not completely satisfied with your purchase, 
            contact us within 30 days for a full refund.
          </p>
          <p class="text-slate-600">
            Items must be unopened and in original packaging. Contact us at info@dryeyela.com 
            to initiate a return.
          </p>
        </div>
      </div>
    `,
  },
  'terms-conditions': {
    title: 'Terms & Conditions',
    description: 'Terms of service and conditions of use for DryEyeLA.',
    body: `
      <div class="max-w-3xl mx-auto prose prose-lg">
        <h2 class="text-2xl font-bold text-[#152c52] mb-6">Terms of Service</h2>
        <p class="text-slate-600 mb-6">
          By accessing and using DryEyeLA.com, you agree to be bound by these Terms and Conditions. 
          Please read them carefully.
        </p>
        
        <h3 class="text-xl font-bold text-[#152c52] mb-4">Product Information</h3>
        <p class="text-slate-600 mb-6">
          While we strive for accuracy, product information may occasionally contain errors. 
          We reserve the right to correct any errors and update information at any time.
        </p>
        
        <h3 class="text-xl font-bold text-[#152c52] mb-4">Medical Disclaimer</h3>
        <p class="text-slate-600 mb-6">
          Our products are not intended to diagnose, treat, cure, or prevent any disease. 
          Always consult with a healthcare professional before starting any new treatment regimen.
        </p>
      </div>
    `,
  },
  careers: {
    title: 'Careers',
    description: 'Join the DryEyeLA team and help improve lives through better eye care.',
    body: `
      <div class="max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold text-[#152c52] mb-6">Join Our Team</h2>
        <p class="text-lg text-slate-600 mb-8">
          We're always looking for passionate individuals who share our commitment to improving 
          dry eye care. Check back soon for open positions or send your resume to careers@dryeyela.com.
        </p>
        
        <div class="bg-slate-50 p-6 rounded-xl">
          <h3 class="text-xl font-bold text-[#152c52] mb-4">Why Work at DryEyeLA?</h3>
          <ul class="space-y-3 text-slate-600">
            <li>• Make a real impact on people's quality of life</li>
            <li>• Work with a team of eye care professionals</li>
            <li>• Competitive benefits and flexible work arrangements</li>
            <li>• Opportunity to grow in a fast-growing company</li>
          </ul>
        </div>
      </div>
    `,
  },
};
