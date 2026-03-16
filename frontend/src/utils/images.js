// ALL images served from /public/images/ - zero external CDN
export const PRODUCT_IMG = {
  '/images/tender-coconut.svg': '/images/tender-coconut.svg',
  '/images/coconut-water.svg':  '/images/coconut-water.svg',
  '/images/coconut-oil.svg':    '/images/coconut-oil.svg',
  '/images/bulk-coconut.svg':   '/images/bulk-coconut.svg',
  // legacy keys
  '/images/tender-coconut.jpg': '/images/tender-coconut.svg',
  '/images/coconut-water.jpg':  '/images/coconut-water.svg',
  '/images/coconut-oil-500.jpg':'/images/coconut-oil.svg',
  '/images/coconut-oil-1l.jpg': '/images/coconut-oil.svg',
  '/images/coconut-oil-2l.jpg': '/images/coconut-oil.svg',
};
export const getImg = (url) => PRODUCT_IMG[url] || '/images/tender-coconut.svg';
export const FALLBACK = '/images/tender-coconut.svg';
