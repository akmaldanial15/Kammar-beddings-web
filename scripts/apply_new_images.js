const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/lena_db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 1. Update Categories
const categoryImageMap = {
  'cat-tilam-toto': '/images/products/tilam-toto-queen.jpg',
  'cat-tilam-lipat': '/images/products/tilam-lipat-bujang.jpg',
  'cat-bantal': '/images/products/bantal-gebu-asian-fibre.jpg',
  'cat-cadang-comforter': '/images/hero/hero-tilam-toto-lifestyle.jpg',
  'cat-borong-gudang': '/images/products/bantal-peluk-roll-pack.jpg',
  'cat-profil': '/images/company/carta-organisasi-kilang.jpg'
};

db.categories = db.categories.map(c => {
  if (categoryImageMap[c.id]) {
    return { ...c, imageUrl: categoryImageMap[c.id] };
  }
  return c;
});

// 2. Update Collections
const collectionBannerMap = {
  'col-toto': '/images/hero/hero-tilam-toto-lifestyle.jpg',
  'col-lipat-bujang': '/images/products/tilam-lipat-bujang.jpg',
  'col-bantal-peluk': '/images/products/bantal-gebu-asian-fibre.jpg',
  'col-borong-pukal': '/images/products/bantal-peluk-roll-pack.jpg'
};

db.collections = db.collections.map(c => {
  if (collectionBannerMap[c.id]) {
    return { ...c, bannerUrl: collectionBannerMap[c.id] };
  }
  return c;
});

// 3. Update Products
const productImagesMap = {
  'prod-toto-asian-fibre': [
    {
      id: 'img-toto-1',
      productId: 'prod-toto-asian-fibre',
      imageUrl: '/images/products/tilam-toto-queen.jpg',
      altText: 'Tilam Toto Asian Polyester Fibre Paling Lariss Tunas Sinar Jaya',
      displayOrder: 1,
      isPrimary: true
    },
    {
      id: 'img-toto-2',
      productId: 'prod-toto-asian-fibre',
      imageUrl: '/images/hero/hero-tilam-toto-lifestyle.jpg',
      altText: 'Tilam Toto Gebu Asian Fibre Rekaan Ruang Tamu Kontemporari',
      displayOrder: 2,
      isPrimary: false
    }
  ],
  'prod-toto-gulung': [
    {
      id: 'img-gulung-1',
      productId: 'prod-toto-gulung',
      imageUrl: '/images/products/bantal-peluk-roll-pack.jpg',
      altText: 'Tilam Toto Gulung Mudah Alih KAMAAR Beddings',
      displayOrder: 1,
      isPrimary: true
    },
    {
      id: 'img-gulung-2',
      productId: 'prod-toto-gulung',
      imageUrl: '/images/products/tilam-lipat-bujang.jpg',
      altText: 'Tilam Toto Lipat & Gulung Praktikal',
      displayOrder: 2,
      isPrimary: false
    }
  ],
  'prod-tilam-lipat-3': [
    {
      id: 'img-lipat-1',
      productId: 'prod-tilam-lipat-3',
      imageUrl: '/images/products/tilam-lipat-bujang.jpg',
      altText: 'Tilam Lipat 3 Berzip Tunas Sinar Jaya',
      displayOrder: 1,
      isPrimary: true
    },
    {
      id: 'img-lipat-2',
      productId: 'prod-tilam-lipat-3',
      imageUrl: '/images/products/tilam-toto-queen.jpg',
      altText: 'Tilam Kusyen Empuk Tufted Berkualiti',
      displayOrder: 2,
      isPrimary: false
    }
  ],
  'prod-tilam-single-asrama': [
    {
      id: 'img-asrama-1',
      productId: 'prod-tilam-single-asrama',
      imageUrl: '/images/products/tilam-lipat-bujang.jpg',
      altText: 'Tilam Single Asrama Heavy Duty Tunas Sinar Jaya',
      displayOrder: 1,
      isPrimary: true
    },
    {
      id: 'img-asrama-2',
      productId: 'prod-tilam-single-asrama',
      imageUrl: '/images/products/bantal-peluk-roll-pack.jpg',
      altText: 'Bekalan Tilam & Bantal Peluk Asrama',
      displayOrder: 2,
      isPrimary: false
    }
  ],
  'prod-bantal-gebu-asian': [
    {
      id: 'img-bantal-1',
      productId: 'prod-bantal-gebu-asian',
      imageUrl: '/images/products/bantal-gebu-asian-fibre.jpg',
      altText: 'Bantal Tidur Gebu Asian Polyester Fibre',
      displayOrder: 1,
      isPrimary: true
    },
    {
      id: 'img-bantal-2',
      productId: 'prod-bantal-gebu-asian',
      imageUrl: '/images/products/bantal-peluk-roll-pack.jpg',
      altText: 'Stok Bantal & Bantal Peluk Terus Dari Kilang',
      displayOrder: 2,
      isPrimary: false
    }
  ],
  'prod-bantal-peluk-gebu': [
    {
      id: 'img-peluk-1',
      productId: 'prod-bantal-peluk-gebu',
      imageUrl: '/images/products/bantal-peluk-roll-pack.jpg',
      altText: 'Bantal Peluk Gebu Roll-Pack Tunas Sinar Jaya',
      displayOrder: 1,
      isPrimary: true
    },
    {
      id: 'img-peluk-2',
      productId: 'prod-bantal-peluk-gebu',
      imageUrl: '/images/products/bantal-gebu-asian-fibre.jpg',
      altText: 'Bantal Peluk & Bantal Tidur Gebu KAMAAR',
      displayOrder: 2,
      isPrimary: false
    }
  ],
  'prod-comforter-tebal-quilting': [
    {
      id: 'img-comf-1',
      productId: 'prod-comforter-tebal-quilting',
      imageUrl: '/images/hero/hero-tilam-toto-lifestyle.jpg',
      altText: 'Set Comforter Tebal Quilting Corak Menarik KAMAAR',
      displayOrder: 1,
      isPrimary: true
    },
    {
      id: 'img-comf-2',
      productId: 'prod-comforter-tebal-quilting',
      imageUrl: '/images/products/tilam-toto-queen.jpg',
      altText: 'Jahitan Quilting dan Corak Tekstil Berkualiti',
      displayOrder: 2,
      isPrimary: false
    }
  ],
  'prod-sarung-toto-berzip': [
    {
      id: 'img-sarung-1',
      productId: 'prod-sarung-toto-berzip',
      imageUrl: '/images/products/tilam-toto-queen.jpg',
      altText: 'Cadar & Sarung Tilam Toto Berzip KAMAAR',
      displayOrder: 1,
      isPrimary: true
    },
    {
      id: 'img-sarung-2',
      productId: 'prod-sarung-toto-berzip',
      imageUrl: '/images/hero/hero-tilam-toto-lifestyle.jpg',
      altText: 'Sarung Tilam Toto Pelbagai Corak',
      displayOrder: 2,
      isPrimary: false
    }
  ],
  'prod-pakej-borong-10set': [
    {
      id: 'img-borong-1',
      productId: 'prod-pakej-borong-10set',
      imageUrl: '/images/products/bantal-peluk-roll-pack.jpg',
      altText: 'Pakej Jualan Gudang & Borong Asrama Roll-Packed',
      displayOrder: 1,
      isPrimary: true
    },
    {
      id: 'img-borong-2',
      productId: 'prod-pakej-borong-10set',
      imageUrl: '/images/products/tilam-lipat-bujang.jpg',
      altText: 'Tilam Bujang Asrama & Bantal Gebu Lengkap',
      displayOrder: 2,
      isPrimary: false
    }
  ]
};

db.products = db.products.map(p => {
  if (productImagesMap[p.id]) {
    return { ...p, images: productImagesMap[p.id] };
  }
  return p;
});

// 4. Update Blog
if (db.blogPosts && db.blogPosts[0]) {
  db.blogPosts[0].imageUrl = '/images/hero/hero-tilam-toto-lifestyle.jpg';
}

// 5. Update WebsiteConfig
if (db.websiteConfig) {
  if (db.websiteConfig.hero && Array.isArray(db.websiteConfig.hero.slides)) {
    if (db.websiteConfig.hero.slides[0]) {
      db.websiteConfig.hero.slides[0].imageUrl = '/images/hero/hero-tilam-toto-lifestyle.jpg';
    }
    if (db.websiteConfig.hero.slides[2]) {
      db.websiteConfig.hero.slides[2].imageUrl = '/images/products/bantal-peluk-roll-pack.jpg';
    }
  }
  if (db.websiteConfig.promotionsBanner) {
    db.websiteConfig.promotionsBanner.imageUrl = '/images/products/tilam-toto-queen.jpg';
  }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully updated data/lena_db.json with new product images!');
