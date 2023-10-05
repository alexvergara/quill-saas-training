export const PLAN_DETAILS = {
  Trial: {
    name: 'Trial',
    slug: 'trial',
    size: 5,
    quota: 10,
    pages: 5,
    available: 5,
    interval: 'month',
    interval_count: 1,
    price: {
      amount: 0,
      priceIds: {
        test: '',
        production: ''
      }
    }
  },

  Basic: {
    name: 'Basic Plan',
    slug: 'basic',
    size: 10,
    quota: 50,
    pages: 50,
    available: 25,
    interval: 'month',
    interval_count: 1,
    price: {
      amount: 5, // ??
      priceIds: {
        test: 'price_1NxqtiD0MZwC7eTwjmTqurC3',
        production: ''
      }
    }
  }
}

export const PLAN_FEATURES = {
  default: {
    name: 'Trial',
    tagline: 'For small side projects.',
    quota: 0,
    price: 0,
    popular: false,
    features: {
      pages: {
        text: '{pages} pages per PDF',
        footnote: 'The maximum amount of pages per PDF-file.',
      },
      size: {
        text: '{size} file size limit',
        footnote: 'The maximum file size of a single PDF file.',
      },
      mobile: {
        text: 'Mobile-friendly interface',
      },
      responses: {
        text: 'Higher-quality responses',
        footnote: 'Better algorithmic responses for enhanced content quality',
        missing: true,
      },
      support: {
        text: 'Priority support',
        missing: true,
      },
    },
  },
  Basic: {
    name: 'Basic',
    popular: true,
    tagline: 'For larger projects with higher needs.',
    features: {
      support: { missing: false },
      responses: { missing: false },
    },
  },
};
