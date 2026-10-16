// Rich Seed Dataset for TUNAS SINAR JAYA ENTERPRISE (KAMAAR BEDDINGS)
import {
  Product,
  Category,
  Collection,
  Coupon,
  Showroom,
  BlogPost,
  SiteSettings,
  StaffMember,
  Review,
  Affiliate,
  WebsiteConfig,
  PaymentSettings,
} from '@/types'

export const initialCategories: Category[] = [
  {
    "id": "cat-tilam-toto",
    "name": "Tilam Toto",
    "slug": "tilam-toto",
    "description": "Tilam Toto Asian Polyester Fibre tebal, empuk dan berkualiti tinggi keluaran kilang Tunas Sinar Jaya. Paling laris dengan Random Floral Design.",
    "imageUrl": "/images/products/tilam-toto-queen.jpg",
    "displayOrder": 1,
    "showInNav": true,
    "hasMegaMenu": true,
    "badge": "PALING LARISS!!",
    "isActive": true
  },
  {
    "id": "cat-tilam-kekabu",
    "name": "Tilam & Bantal Kekabu",
    "slug": "tilam-kekabu",
    "description": "Tilam dan bantal isian kekabu asli tradisi yang padat, sejuk dan empuk dengan jahitan butang tufting tahan lasak.",
    "imageUrl": "/images/products/tilam-kekabu-asli.jpg",
    "displayOrder": 2,
    "showInNav": true,
    "hasMegaMenu": true,
    "badge": "100% KEKABU ASLI",
    "isActive": true
  },
  {
    "id": "cat-tilam-lipat",
    "name": "Tilam Lipat & Bujang",
    "slug": "tilam-lipat",
    "description": "Tilam lipat 3 berzip mudah alih dan tilam bujang asrama standard 3 kaki yang praktikal, jimat ruang dan tahan lasak.",
    "imageUrl": "/images/products/tilam-lipat-bujang.jpg",
    "displayOrder": 3,
    "showInNav": true,
    "hasMegaMenu": true,
    "isActive": true
  },
  {
    "id": "cat-bantal",
    "name": "Bantal & Bantal Peluk",
    "slug": "bantal",
    "description": "Bantal tidur gebu dan bantal peluk isian Asian Polyester Fibre padat dari Unit Bantal & Tilam KAMAAR.",
    "imageUrl": "/images/products/bantal-gebu-asian-fibre.jpg",
    "displayOrder": 4,
    "showInNav": true,
    "hasMegaMenu": true,
    "isActive": true
  },
  {
    "id": "cat-cadang-comforter",
    "name": "Cadar & Comforter",
    "slug": "cadang-comforter",
    "description": "Set comforter tebal berjahit quilting kemas kilang, sarung tilam toto berzip dan cadar pelbagai corak menarik.",
    "imageUrl": "/images/hero/hero-tilam-toto-lifestyle.jpg",
    "displayOrder": 5,
    "showInNav": true,
    "hasMegaMenu": true,
    "isActive": true
  },
  {
    "id": "cat-selimut-patchwork",
    "name": "Selimut Patchwork",
    "slug": "selimut-patchwork",
    "description": "Selimut patchwork cantuman corak geometri dan floral berquilting kemas yang selesa dan sejuk dipakai.",
    "imageUrl": "/images/products/selimut-patchwork.jpg",
    "displayOrder": 6,
    "showInNav": true,
    "hasMegaMenu": false,
    "isActive": true
  },
  {
    "id": "cat-set-bayi",
    "name": "Set Bayi",
    "slug": "set-bayi",
    "description": "Set tilam bayi empuk bersama bantal kepala lekuk dan 2 bantal peluk comel untuk keselesaan si manja.",
    "imageUrl": "/images/products/set-tilam-bayi.jpg",
    "displayOrder": 7,
    "showInNav": true,
    "hasMegaMenu": false,
    "isActive": true
  },
  {
    "id": "cat-kusyen-sofa",
    "name": "Kusyen Sofa",
    "slug": "kusyen-sofa",
    "description": "Sarung kusyen sofa eksklusif pelbagai tema termasuk corak perayaan Aidilfitri, piping tebal dan fabrik mewah.",
    "imageUrl": "/images/products/kusyen-sofa-eksklusif.jpg",
    "displayOrder": 8,
    "showInNav": true,
    "hasMegaMenu": false,
    "isActive": true
  },
  {
    "id": "cat-borong-gudang",
    "name": "Jualan Gudang & Borong",
    "slug": "borong-gudang",
    "description": "Harga kilang terus dari Tasek Gelugor untuk pembekal asrama, homestay, tahfiz, kontraktor dan pembeli borong pukal.",
    "imageUrl": "/images/products/bantal-peluk-roll-pack.jpg",
    "displayOrder": 9,
    "showInNav": true,
    "hasMegaMenu": false,
    "badge": "HARGA GUDANG",
    "isActive": true
  },
  {
    "id": "cat-oem",
    "name": "Tempahan Pukal (OEM)",
    "slug": "tempahan-oem",
    "description": "Perkhidmatan jahitan tekstil jenama sendiri (OEM), pembekalan agensi kerajaan, sektor swasta dan projek tender.",
    "imageUrl": "/images/company/oem-tekstil-pukal.jpg",
    "displayOrder": 10,
    "showInNav": true,
    "hasMegaMenu": false,
    "customUrl": "/business",
    "isActive": true
  },
  {
    "id": "cat-profil",
    "name": "Profil Syarikat",
    "slug": "profil",
    "description": "Maklumat syarikat Tunas Sinar Jaya Enterprise, carta organisasi, visi misi dan 4 unit operasi kilang tekstil.",
    "imageUrl": "/images/company/kilang-tekstil-jahitan.jpg",
    "displayOrder": 11,
    "showInNav": true,
    "hasMegaMenu": false,
    "customUrl": "/profil",
    "isActive": true
  }
]

export const initialCollections: Collection[] = [
  {
    "id": "col-toto",
    "name": "Koleksi Tilam Toto Paling Laris",
    "slug": "koleksi-toto",
    "description": "Tilam toto tebal isian Asian Polyester Fibre pelbagai corak floral dan geometrik terus dari kilang.",
    "bannerUrl": "/images/hero/hero-tilam-toto-lifestyle.jpg",
    "displayOrder": 1,
    "isFeatured": true
  },
  {
    "id": "col-kekabu",
    "name": "Koleksi Kekabu Asli Tradisi",
    "slug": "koleksi-kekabu",
    "description": "Tilam kekabu dan bantal kekabu tradisi dengan kelembutan semulajadi yang sejuk dan padat.",
    "bannerUrl": "/images/products/tilam-kekabu-asli.jpg",
    "displayOrder": 2,
    "isFeatured": true
  },
  {
    "id": "col-lipat-bujang",
    "name": "Tilam Lipat & Bujang Asrama",
    "slug": "tilam-lipat-asrama",
    "description": "Tilam mudah alih berzip dan tilam bujang tahan lasak untuk kegunaan asrama, homestay & rumah sewa.",
    "bannerUrl": "/images/products/tilam-lipat-bujang.jpg",
    "displayOrder": 3,
    "isFeatured": true
  },
  {
    "id": "col-bantal-peluk",
    "name": "Bantal Tidur Gebu & Bantal Peluk",
    "slug": "bantal-gebu-kamaar",
    "description": "Isian Asian Polyester Fibre bermutu tinggi yang anjal, menyokong kepala dan leher dengan selesa.",
    "bannerUrl": "/images/products/bantal-gebu-asian-fibre.jpg",
    "displayOrder": 4,
    "isFeatured": true
  },
  {
    "id": "col-comforter-patchwork",
    "name": "Comforter & Selimut Patchwork",
    "slug": "comforter-patchwork",
    "description": "Set comforter tebal dan selimut patchwork berquilting kemas hasil tangan Unit Jahitan Kilang.",
    "bannerUrl": "/images/products/selimut-patchwork.jpg",
    "displayOrder": 5,
    "isFeatured": true
  },
  {
    "id": "col-borong-pukal",
    "name": "Pakej Jualan Gudang & Borong Asrama",
    "slug": "jualan-gudang-borong",
    "description": "Pakej penjimatan besar terus dari kilang pengeluar Tunas Sinar Jaya di Tasek Gelugor.",
    "bannerUrl": "/images/products/bantal-peluk-roll-pack.jpg",
    "displayOrder": 6,
    "isFeatured": true
  }
]

export const initialProducts: Product[] = [
  {
    "id": "prod-toto-single-poly",
    "name": "TOTO SINGLE (POLY)",
    "slug": "toto-single-poly",
    "subtitle": "Size 90 cm x 200 cm | Asian Polyester Fibre",
    "description": "Tilam Toto Single dengan isian Asian Polyester Fibre bermutu tinggi keluaran kilang Tunas Sinar Jaya Sdn. Bhd. di Tasek Gelugor. Tebal, empuk, tidak mudah leper dan mudah digulung untuk kegunaan harian seisi keluarga.",
    "shortDescription": "Size 90 cm x 200 cm | RM34.90 | Isian Asian Polyester Fibre tebal dan selesa.",
    "categoryId": "cat-tilam-toto",
    "productType": "mattress",
    "material": "Asian Polyester Fibre",
    "priceSen": 3490,
    "warrantyYears": 1,
    "isFeatured": true,
    "status": "published",
    "badge": "PALING LARIS",
    "dimensions": "90 cm x 200 cm",
    "images": [
      {
        "id": "img-toto-single-poly-1",
        "productId": "prod-toto-single-poly",
        "imageUrl": "/images/products/toto-single-poly.png",
        "altText": "TOTO SINGLE (POLY) - RM34.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-toto-single-poly-1",
        "productId": "prod-toto-single-poly",
        "sku": "TSJ-TT-SIN-01",
        "name": "Single (90x200 cm)",
        "sizeName": "Single",
        "dimensions": "90 cm x 200 cm",
        "priceSen": 3490,
        "compareAtPriceSen": 3990,
        "stockQuantity": 140,
        "isActive": true,
        "quantityTiers": [
          {
            "quantity": 3,
            "priceSen": 9900,
            "label": "Beli 3 Jimat"
          },
          {
            "quantity": 5,
            "priceSen": 15000,
            "label": "Pakej Borong 5 Unit"
          }
        ]
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-toto-queen-poly",
    "name": "TOTO QUEEN (POLY)",
    "slug": "toto-queen-poly",
    "subtitle": "Size 150 cm x 200 cm | Asian Polyester Fibre",
    "description": "Tilam Toto Queen saiz kelamin yang luas dan empuk dengan isian Asian Polyester Fibre gred industri. Sangat sesuai untuk ruang santai keluarga, tetamu, atau homestay.",
    "shortDescription": "Size 150 cm x 200 cm | RM59.90 | Isian Asian Polyester Fibre luas dan empuk.",
    "categoryId": "cat-tilam-toto",
    "productType": "mattress",
    "material": "Asian Polyester Fibre",
    "priceSen": 5990,
    "warrantyYears": 1,
    "isFeatured": true,
    "status": "published",
    "badge": "PILIHAN KELUARGA",
    "dimensions": "150 cm x 200 cm",
    "images": [
      {
        "id": "img-toto-queen-poly-1",
        "productId": "prod-toto-queen-poly",
        "imageUrl": "/images/products/toto-queen-poly.png",
        "altText": "TOTO QUEEN (POLY) - RM59.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-toto-queen-poly-1",
        "productId": "prod-toto-queen-poly",
        "sku": "TSJ-TT-QUE-01",
        "name": "Queen (150x200 cm)",
        "sizeName": "Queen",
        "dimensions": "150 cm x 200 cm",
        "priceSen": 5990,
        "compareAtPriceSen": 6990,
        "stockQuantity": 119,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-tilam-gulung-a-tc",
    "name": "TILAM GULUNG A (TC)",
    "slug": "tilam-gulung-a-tc",
    "subtitle": "Size 90 cm x 180 cm | Poly Fibre / Kain TC",
    "description": "Tilam Gulung Gred A buatan kemas dengan fabrik tahan lasak TC dan isian Poly Fibre padat. Ringan, mudah dibawa dan jimat ruang.",
    "shortDescription": "Size 90 cm x 180 cm | RM39.90 | Isian Poly Fibre berkualiti.",
    "categoryId": "cat-tilam-gulung",
    "productType": "mattress",
    "material": "Poly Fibre / TC Shoddy",
    "priceSen": 3990,
    "warrantyYears": 1,
    "isFeatured": true,
    "status": "published",
    "badge": "LEBIH JIMAT",
    "dimensions": "90 cm x 180 cm",
    "images": [
      {
        "id": "img-tilam-gulung-a-tc-1",
        "productId": "prod-tilam-gulung-a-tc",
        "imageUrl": "/images/products/tilam-gulung-a-tc.png",
        "altText": "TILAM GULUNG A (TC) - RM39.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-tilam-gulung-a-tc-1",
        "productId": "prod-tilam-gulung-a-tc",
        "sku": "TSJ-TG-A-01",
        "name": "Standard (90x180 cm)",
        "sizeName": "Single",
        "dimensions": "90 cm x 180 cm",
        "priceSen": 3990,
        "compareAtPriceSen": 4500,
        "stockQuantity": 150,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-tilam-gulung-b-tc",
    "name": "TILAM GULUNG B (TC)",
    "slug": "tilam-gulung-b-tc",
    "subtitle": "Size 90 cm x 180 cm | Poly Fibre / Kain TC",
    "description": "Tilam Gulung Gred B dengan harga mampu milik terbaik untuk asrama, pekerja dan ruang tambahan. Isian Poly Fibre padat dan anjal.",
    "shortDescription": "Size 90 cm x 180 cm | RM34.90 | Pilihan bajet paling jimat terus dari kilang.",
    "categoryId": "cat-tilam-gulung",
    "productType": "mattress",
    "material": "Poly Fibre / TC Shoddy",
    "priceSen": 3490,
    "warrantyYears": 1,
    "isFeatured": false,
    "status": "published",
    "badge": "HARGA KILANG",
    "dimensions": "90 cm x 180 cm",
    "images": [
      {
        "id": "img-tilam-gulung-b-tc-1",
        "productId": "prod-tilam-gulung-b-tc",
        "imageUrl": "/images/products/tilam-gulung-b-tc.png",
        "altText": "TILAM GULUNG B (TC) - RM34.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-tilam-gulung-b-tc-1",
        "productId": "prod-tilam-gulung-b-tc",
        "sku": "TSJ-TG-B-01",
        "name": "Standard (90x180 cm)",
        "sizeName": "Single",
        "dimensions": "90 cm x 180 cm",
        "priceSen": 3490,
        "compareAtPriceSen": 3990,
        "stockQuantity": 150,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-tilam-gulung-kekabu-asli",
    "name": "TILAM GULUNG (KEKABU ASLI)",
    "slug": "tilam-gulung-kekabu-asli",
    "subtitle": "Size 90 cm x 180 cm | 100% Kekabu Asli Semulajadi",
    "description": "Tilam gulung isian 100% Kekabu Asli tradisi terpilih. Sejuk semulajadi, padat, menyokong postur tulang belakang dan tahan mendap dengan jahitan butang tufting tradisi.",
    "shortDescription": "Size 90 cm x 180 cm | RM99.90 | Isian 100% Kekabu Asli gred premium.",
    "categoryId": "cat-tilam-kekabu",
    "productType": "mattress",
    "material": "100% Kekabu Asli",
    "priceSen": 9990,
    "warrantyYears": 2,
    "isFeatured": true,
    "status": "published",
    "badge": "ORGANIK TRADISI",
    "dimensions": "90 cm x 180 cm",
    "images": [
      {
        "id": "img-tilam-gulung-kekabu-asli-1",
        "productId": "prod-tilam-gulung-kekabu-asli",
        "imageUrl": "/images/products/tilam-gulung-kekabu-asli.png",
        "altText": "TILAM GULUNG (KEKABU ASLI) - RM99.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-tilam-gulung-kekabu-asli-1",
        "productId": "prod-tilam-gulung-kekabu-asli",
        "sku": "TSJ-TG-KB-01",
        "name": "Standard (90x180 cm)",
        "sizeName": "Single",
        "dimensions": "90 cm x 180 cm",
        "priceSen": 9990,
        "compareAtPriceSen": 11900,
        "stockQuantity": 79,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-bantal-m-tc",
    "name": "BANTAL SIZE M (TC)",
    "slug": "bantal-m-tc",
    "subtitle": "Size 15 x 24 inch | Isian TC Shoddy",
    "description": "Bantal tidur saiz M isian TC Shoddy kemas dan padat. Sesuai untuk asrama, penginapan bajet dan kegunaan harian dengan harga kilang yang amat berpatutan.",
    "shortDescription": "Size 15 x 24 inch | RM4.90 | Bantal isian TC Shoddy ekonomi.",
    "categoryId": "cat-bantal-tidur",
    "productType": "pillow",
    "material": "TC Shoddy Fibre",
    "priceSen": 490,
    "warrantyYears": 1,
    "isFeatured": true,
    "status": "published",
    "badge": "SUPER JIMAT",
    "dimensions": "15\" x 24\"",
    "images": [
      {
        "id": "img-bantal-m-tc-1",
        "productId": "prod-bantal-m-tc",
        "imageUrl": "/images/products/bantal-tidur-m-tc.png",
        "altText": "BANTAL SIZE M (TC) - RM4.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-bantal-m-tc-1",
        "productId": "prod-bantal-m-tc",
        "sku": "TSJ-B-M-TC",
        "name": "Medium (15x24 inch)",
        "sizeName": "Standard",
        "dimensions": "15\" x 24\"",
        "priceSen": 490,
        "compareAtPriceSen": 590,
        "stockQuantity": 299,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-bantal-l-poly",
    "name": "BANTAL SIZE L (POLY)",
    "slug": "bantal-l-poly",
    "subtitle": "Size 17 x 26 inch | Asian Polyester Fibre",
    "description": "Bantal tidur saiz L dengan isian Asian Polyester Fibre gebu dan anjal. Memberikan sokongan leher yang selesa sepanjang malam tanpa mudah mendap.",
    "shortDescription": "Size 17 x 26 inch | RM9.90 | Isian Asian Polyester Fibre gebu dan empuk.",
    "categoryId": "cat-bantal-tidur",
    "productType": "pillow",
    "material": "Asian Polyester Fibre",
    "priceSen": 990,
    "warrantyYears": 1,
    "isFeatured": true,
    "status": "published",
    "badge": "PILIHAN RAMAI",
    "dimensions": "17\" x 26\"",
    "images": [
      {
        "id": "img-bantal-l-poly-1",
        "productId": "prod-bantal-l-poly",
        "imageUrl": "/images/products/bantal-tidur-l-poly.png",
        "altText": "BANTAL SIZE L (POLY) - RM9.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-bantal-l-poly-1",
        "productId": "prod-bantal-l-poly",
        "sku": "TSJ-B-L-POLY",
        "name": "Large (17x26 inch)",
        "sizeName": "Standard",
        "dimensions": "17\" x 26\"",
        "priceSen": 990,
        "compareAtPriceSen": 1190,
        "stockQuantity": 250,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-bantal-l-kekabu-asli",
    "name": "BANTAL SIZE L (KEKABU ASLI)",
    "slug": "bantal-l-kekabu-asli",
    "subtitle": "Size 17 x 26 inch | 100% Kekabu Asli",
    "description": "Bantal tidur tradisional 100% Kekabu Asli saiz L. Terkenal dengan sifatnya yang sejuk, menyerap haba kepala, dan keanjalan semula jadi yang menyokong tulang leher.",
    "shortDescription": "Size 17 x 26 inch | RM24.90 | Isian 100% Kekabu Asli gred asli tradisi.",
    "categoryId": "cat-bantal-tidur",
    "productType": "pillow",
    "material": "100% Kekabu Asli",
    "priceSen": 2490,
    "warrantyYears": 2,
    "isFeatured": true,
    "status": "published",
    "badge": "KEKABU ASLI",
    "dimensions": "17\" x 26\"",
    "images": [
      {
        "id": "img-bantal-l-kekabu-asli-1",
        "productId": "prod-bantal-l-kekabu-asli",
        "imageUrl": "/images/products/bantal-tidur-l-kekabu-asli.png",
        "altText": "BANTAL SIZE L (KEKABU ASLI) - RM24.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-bantal-l-kekabu-asli-1",
        "productId": "prod-bantal-l-kekabu-asli",
        "sku": "TSJ-B-L-KB",
        "name": "Large (17x26 inch)",
        "sizeName": "Standard",
        "dimensions": "17\" x 26\"",
        "priceSen": 2490,
        "compareAtPriceSen": 2800,
        "stockQuantity": 100,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-bantal-xl-kekabu-asli",
    "name": "BANTAL SIZE XL (KEKABU ASLI)",
    "slug": "bantal-xl-kekabu-asli",
    "subtitle": "Size 18 x 28 inch | 100% Kekabu Asli",
    "description": "Bantal tidur saiz XL ekstra besar isian padat 100% Kekabu Asli. Sangat empuk, sejuk, tahan lama dan memberi keselesaan tidur maksimum bertaraf hotel tradisi.",
    "shortDescription": "Size 18 x 28 inch | RM34.90 | Saiz XL ekstra luas dan padat dengan kekabu asli.",
    "categoryId": "cat-bantal-tidur",
    "productType": "pillow",
    "material": "100% Kekabu Asli",
    "priceSen": 3490,
    "warrantyYears": 2,
    "isFeatured": false,
    "status": "published",
    "badge": "EKSTRA SELESA",
    "dimensions": "18\" x 28\"",
    "images": [
      {
        "id": "img-bantal-xl-kekabu-asli-1",
        "productId": "prod-bantal-xl-kekabu-asli",
        "imageUrl": "/images/products/bantal-tidur-xl-kekabu-asli.png",
        "altText": "BANTAL SIZE XL (KEKABU ASLI) - RM34.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-bantal-xl-kekabu-asli-1",
        "productId": "prod-bantal-xl-kekabu-asli",
        "sku": "TSJ-B-XL-KB",
        "name": "Extra Large (18x28 inch)",
        "sizeName": "King Pillow",
        "dimensions": "18\" x 28\"",
        "priceSen": 3490,
        "compareAtPriceSen": 3990,
        "stockQuantity": 80,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-bantal-peluk-m-poly",
    "name": "BANTAL PELUK SIZE M (POLY)",
    "slug": "bantal-peluk-m-poly",
    "subtitle": "Asian Polyester Fibre",
    "description": "Bantal peluk saiz M dengan isian Asian Polyester Fibre gebu. Ringan, lembut dan selesa untuk kanak-kanak dan remaja.",
    "shortDescription": "RM13.90 | Bantal peluk saiz M isian Asian Polyester Fibre.",
    "categoryId": "cat-bantal-peluk",
    "productType": "pillow",
    "material": "Asian Polyester Fibre",
    "priceSen": 1390,
    "warrantyYears": 1,
    "isFeatured": false,
    "status": "published",
    "badge": "GEBU",
    "dimensions": "36\" x 7\"",
    "images": [
      {
        "id": "img-bantal-peluk-m-poly-1",
        "productId": "prod-bantal-peluk-m-poly",
        "imageUrl": "/images/products/bantal-peluk-m-poly.png",
        "altText": "BANTAL PELUK SIZE M (POLY) - RM13.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-bantal-peluk-m-poly-1",
        "productId": "prod-bantal-peluk-m-poly",
        "sku": "TSJ-BP-M-POLY",
        "name": "Medium",
        "sizeName": "Standard",
        "dimensions": "36\" x 7\"",
        "priceSen": 1390,
        "stockQuantity": 100,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-bantal-peluk-l-tc",
    "name": "BANTAL PELUK SIZE L (TC)",
    "slug": "bantal-peluk-l-tc",
    "subtitle": "Isian TC Shoddy",
    "description": "Bantal peluk saiz L isian TC Shoddy padat dan tahan lasak. Jimat dan sesuai untuk kegunaan seharian.",
    "shortDescription": "RM14.90 | Bantal peluk saiz L isian TC Shoddy jimat.",
    "categoryId": "cat-bantal-peluk",
    "productType": "pillow",
    "material": "TC Shoddy Fibre",
    "priceSen": 1490,
    "warrantyYears": 1,
    "isFeatured": false,
    "status": "published",
    "badge": "JIMAT",
    "dimensions": "38\" x 8\"",
    "images": [
      {
        "id": "img-bantal-peluk-l-tc-1",
        "productId": "prod-bantal-peluk-l-tc",
        "imageUrl": "/images/products/bantal-peluk-l-tc.png",
        "altText": "BANTAL PELUK SIZE L (TC) - RM14.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-bantal-peluk-l-tc-1",
        "productId": "prod-bantal-peluk-l-tc",
        "sku": "TSJ-BP-L-TC",
        "name": "Large",
        "sizeName": "Standard",
        "dimensions": "38\" x 8\"",
        "priceSen": 1490,
        "stockQuantity": 100,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-bantal-peluk-l-poly",
    "name": "BANTAL PELUK SIZE L (POLY)",
    "slug": "bantal-peluk-l-poly",
    "subtitle": "Asian Polyester Fibre",
    "description": "Bantal peluk dewasa saiz L isian Asian Polyester Fibre gebu dan anjal. Sangat selesa dipeluk dan tidak mudah kempis.",
    "shortDescription": "RM24.90 | Bantal peluk saiz L isian Asian Polyester Fibre gebu.",
    "categoryId": "cat-bantal-peluk",
    "productType": "pillow",
    "material": "Asian Polyester Fibre",
    "priceSen": 2490,
    "warrantyYears": 1,
    "isFeatured": true,
    "status": "published",
    "badge": "PREMIUM FIBRE",
    "dimensions": "38\" x 8\"",
    "images": [
      {
        "id": "img-bantal-peluk-l-poly-1",
        "productId": "prod-bantal-peluk-l-poly",
        "imageUrl": "/images/products/bantal-peluk-l-poly.png",
        "altText": "BANTAL PELUK SIZE L (POLY) - RM24.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-bantal-peluk-l-poly-1",
        "productId": "prod-bantal-peluk-l-poly",
        "sku": "TSJ-BP-L-POLY",
        "name": "Large",
        "sizeName": "Standard",
        "dimensions": "38\" x 8\"",
        "priceSen": 2490,
        "stockQuantity": 120,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-bantal-peluk-l-kekabu-asli",
    "name": "BANTAL PELUK SIZE L (KEKABU ASLI)",
    "slug": "bantal-peluk-l-kekabu-asli",
    "subtitle": "100% Kekabu Asli",
    "description": "Bantal peluk saiz L 100% Kekabu Asli gred tradisi. Sejuk semulajadi, padat dan menyokong postur tubuh dengan sempurna sepanjang malam.",
    "shortDescription": "RM34.90 | Bantal peluk saiz L 100% Kekabu Asli sejuk dan padat.",
    "categoryId": "cat-bantal-peluk",
    "productType": "pillow",
    "material": "100% Kekabu Asli",
    "priceSen": 3490,
    "warrantyYears": 2,
    "isFeatured": true,
    "status": "published",
    "badge": "ORGANIK TRADISI",
    "dimensions": "38\" x 8\"",
    "images": [
      {
        "id": "img-bantal-peluk-l-kekabu-asli-1",
        "productId": "prod-bantal-peluk-l-kekabu-asli",
        "imageUrl": "/images/products/bantal-peluk-l-kekabu-asli.png",
        "altText": "BANTAL PELUK SIZE L (KEKABU ASLI) - RM34.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-bantal-peluk-l-kekabu-asli-1",
        "productId": "prod-bantal-peluk-l-kekabu-asli",
        "sku": "TSJ-BP-L-KB",
        "name": "Large",
        "sizeName": "Standard",
        "dimensions": "38\" x 8\"",
        "priceSen": 3490,
        "stockQuantity": 80,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-bantal-baby-kekabu-asli",
    "name": "BANTAL BABY (KEKABU ASLI)",
    "slug": "bantal-baby-kekabu-asli",
    "subtitle": "Size 12 x 17 inch | 100% Kekabu Asli",
    "description": "Bantal bayi isian 100% Kekabu Asli semulajadi. Sangat lembut, sejuk, bebas bahan kimia dan selamat untuk kulit sensitif bayi.",
    "shortDescription": "Size 12 x 17 inch | RM9.90 | Bantal bayi 100% Kekabu Asli lembut & sejuk.",
    "categoryId": "cat-produk-baby",
    "productType": "pillow",
    "material": "100% Kekabu Asli",
    "priceSen": 990,
    "warrantyYears": 1,
    "isFeatured": true,
    "status": "published",
    "badge": "LEMBUT & SEJUK",
    "dimensions": "12\" x 17\"",
    "images": [
      {
        "id": "img-bantal-baby-kekabu-asli-1",
        "productId": "prod-bantal-baby-kekabu-asli",
        "imageUrl": "/images/products/bantal-baby-kekabu-asli.png",
        "altText": "BANTAL BABY (KEKABU ASLI) - RM9.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-bantal-baby-kekabu-asli-1",
        "productId": "prod-bantal-baby-kekabu-asli",
        "sku": "TSJ-BB-P-01",
        "name": "Standard (12x17 inch)",
        "sizeName": "Standard",
        "dimensions": "12\" x 17\"",
        "priceSen": 990,
        "stockQuantity": 150,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-set-tilam-baby-a-kekabu-asli",
    "name": "SET TILAM BABY A (KEKABU ASLI)",
    "slug": "set-tilam-baby-a-kekabu-asli",
    "subtitle": "Size 28 x 40 inch | 100% Kekabu Asli",
    "description": "Set tilam bayi Saiz A lengkap isian 100% Kekabu Asli semulajadi. Menjamin tidur lena si manja dengan sokongan postur badan yang optimum.",
    "shortDescription": "Size 28 x 40 inch | RM69.90 | Set tilam bayi A isian kekabu asli tradisi.",
    "categoryId": "cat-produk-baby",
    "productType": "mattress",
    "material": "100% Kekabu Asli",
    "priceSen": 6990,
    "warrantyYears": 1,
    "isFeatured": true,
    "status": "published",
    "badge": "SET LENGKAP",
    "dimensions": "28\" x 40\"",
    "images": [
      {
        "id": "img-set-tilam-baby-a-kekabu-asli-1",
        "productId": "prod-set-tilam-baby-a-kekabu-asli",
        "imageUrl": "/images/products/set-tilam-baby-a-kekabu-asli.png",
        "altText": "SET TILAM BABY A (KEKABU ASLI) - RM69.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-set-tilam-baby-a-kekabu-asli-1",
        "productId": "prod-set-tilam-baby-a-kekabu-asli",
        "sku": "TSJ-BB-STA-01",
        "name": "Size A (28x40 inch)",
        "sizeName": "Single",
        "dimensions": "28\" x 40\"",
        "priceSen": 6990,
        "stockQuantity": 60,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-set-tilam-baby-b-kekabu-asli",
    "name": "SET TILAM BABY B (KEKABU ASLI)",
    "slug": "set-tilam-baby-b-kekabu-asli",
    "subtitle": "Size 20 x 30 inch | 100% Kekabu Asli",
    "description": "Set tilam bayi Saiz B kompak isian 100% Kekabu Asli. Sesuai untuk katil bayi kecil, 'travel baby cot' atau kegunaan di ruang tamu.",
    "shortDescription": "Size 20 x 30 inch | RM49.90 | Set tilam bayi B kompak 100% kekabu asli.",
    "categoryId": "cat-produk-baby",
    "productType": "mattress",
    "material": "100% Kekabu Asli",
    "priceSen": 4990,
    "warrantyYears": 1,
    "isFeatured": false,
    "status": "published",
    "badge": "PILIHAN IBU",
    "dimensions": "20\" x 30\"",
    "images": [
      {
        "id": "img-set-tilam-baby-b-kekabu-asli-1",
        "productId": "prod-set-tilam-baby-b-kekabu-asli",
        "imageUrl": "/images/products/set-tilam-baby-b-kekabu-asli.png",
        "altText": "SET TILAM BABY B (KEKABU ASLI) - RM49.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-set-tilam-baby-b-kekabu-asli-1",
        "productId": "prod-set-tilam-baby-b-kekabu-asli",
        "sku": "TSJ-BB-STB-01",
        "name": "Size B (20x30 inch)",
        "sizeName": "Single",
        "dimensions": "20\" x 30\"",
        "priceSen": 4990,
        "stockQuantity": 80,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-selimut-legend-m",
    "name": "SELIMUT LEGEND SIZE M",
    "slug": "selimut-legend-m",
    "subtitle": "Size 60 x 80 inch | Corak Berjalur Legend",
    "description": "Selimut legend berjalur klasik saiz M buatan tempatan berkualiti. Tebal, menyerap peluh, selesa dipakai di bilik berhawa dingin dan tahan basuh bertahun-tahun.",
    "shortDescription": "Size 60 x 80 inch | RM14.90 | Selimut legend klasik buatan tempatan.",
    "categoryId": "cat-selimut",
    "productType": "bedding",
    "material": "Poly & Cotton Berjalur",
    "priceSen": 1490,
    "warrantyYears": 1,
    "isFeatured": true,
    "status": "published",
    "badge": "LEGEND",
    "dimensions": "60\" x 80\"",
    "images": [
      {
        "id": "img-selimut-legend-m-1",
        "productId": "prod-selimut-legend-m",
        "imageUrl": "/images/products/selimut-legend-m.png",
        "altText": "SELIMUT LEGEND SIZE M - RM14.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-selimut-legend-m-1",
        "productId": "prod-selimut-legend-m",
        "sku": "TSJ-SL-M-01",
        "name": "Size M (60x80 inch)",
        "sizeName": "Single",
        "dimensions": "60\" x 80\"",
        "priceSen": 1490,
        "compareAtPriceSen": 1690,
        "stockQuantity": 200,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-selimut-legend-l",
    "name": "SELIMUT LEGEND SIZE L",
    "slug": "selimut-legend-l",
    "subtitle": "Size 70 x 90 inch | Corak Berjalur Legend",
    "description": "Selimut legend berjalur saiz L saiz besar untuk katil Queen atau seisi keluarga. Material kapas berkualiti yang lembut, hangat dan tahan lama.",
    "shortDescription": "Size 70 x 90 inch | RM24.90 | Selimut legend saiz L besar dan selesa.",
    "categoryId": "cat-selimut",
    "productType": "bedding",
    "material": "Poly & Cotton Berjalur",
    "priceSen": 2490,
    "warrantyYears": 1,
    "isFeatured": false,
    "status": "published",
    "badge": "SAIZ BESAR",
    "dimensions": "70\" x 90\"",
    "images": [
      {
        "id": "img-selimut-legend-l-1",
        "productId": "prod-selimut-legend-l",
        "imageUrl": "/images/products/selimut-legend-l.png",
        "altText": "SELIMUT LEGEND SIZE L - RM24.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-selimut-legend-l-1",
        "productId": "prod-selimut-legend-l",
        "sku": "TSJ-SL-L-01",
        "name": "Size L (70x90 inch)",
        "sizeName": "Queen",
        "dimensions": "70\" x 90\"",
        "priceSen": 2490,
        "compareAtPriceSen": 2800,
        "stockQuantity": 150,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-bantal-sofa-14x14",
    "name": "BANTAL SOFA SIZE 14X14 INCH",
    "slug": "bantal-sofa-14x14",
    "subtitle": "Size 14 x 14 inch | Poly Fibre",
    "description": "Bantal sofa saiz 14x14 inci isian Asian Polyester Fibre gebu. Sesuai untuk kusyen kerusi ruang tamu, pejabat, kafe atau dekorasi rumah.",
    "shortDescription": "Size 14 x 14 inch | RM9.90 | Bantal sofa kusyen isian Poly Fibre.",
    "categoryId": "cat-kusyen-sofa",
    "productType": "pillow",
    "material": "Asian Polyester Fibre",
    "priceSen": 990,
    "warrantyYears": 1,
    "isFeatured": true,
    "status": "published",
    "badge": "KUSYEN RUANG TAMU",
    "dimensions": "14\" x 14\"",
    "images": [
      {
        "id": "img-bantal-sofa-14x14-1",
        "productId": "prod-bantal-sofa-14x14",
        "imageUrl": "/images/products/bantal-sofa-14x14-poly.png",
        "altText": "BANTAL SOFA SIZE 14X14 INCH - RM9.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-bantal-sofa-14x14-1",
        "productId": "prod-bantal-sofa-14x14",
        "sku": "TSJ-BS-1414-01",
        "name": "14x14 inch",
        "sizeName": "Standard",
        "dimensions": "14\" x 14\"",
        "priceSen": 990,
        "compareAtPriceSen": 1290,
        "stockQuantity": 150,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-bantal-sofa-12x17",
    "name": "BANTAL SOFA SIZE 12X17 INCH",
    "slug": "bantal-sofa-12x17",
    "subtitle": "Size 12 x 17 inch | Poly Fibre",
    "description": "Bantal kusyen sofa memanjang bentuk rektangular saiz 12x17 inci. Isian Poly Fibre anjal memberi sokongan pinggang yang selesa di kerusi.",
    "shortDescription": "Size 12 x 17 inch | RM9.90 | Kusyen sokongan pinggang sofa ruang tamu.",
    "categoryId": "cat-kusyen-sofa",
    "productType": "pillow",
    "material": "Asian Polyester Fibre",
    "priceSen": 990,
    "warrantyYears": 1,
    "isFeatured": false,
    "status": "published",
    "badge": "BENTUK RECTANGLE",
    "dimensions": "12\" x 17\"",
    "images": [
      {
        "id": "img-bantal-sofa-12x17-1",
        "productId": "prod-bantal-sofa-12x17",
        "imageUrl": "/images/products/bantal-sofa-12x17-poly.png",
        "altText": "BANTAL SOFA SIZE 12X17 INCH - RM9.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-bantal-sofa-12x17-1",
        "productId": "prod-bantal-sofa-12x17",
        "sku": "TSJ-BS-1217-01",
        "name": "12x17 inch",
        "sizeName": "Standard",
        "dimensions": "12\" x 17\"",
        "priceSen": 990,
        "stockQuantity": 120,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-bantal-sofa-17x17",
    "name": "BANTAL SOFA SIZE 17X17 INCH",
    "slug": "bantal-sofa-17x17",
    "subtitle": "Size 17 x 17 inch | Poly Fibre",
    "description": "Bantal sofa saiz standard 17x17 inci. Tebal dan padat dengan isian Asian Polyester Fibre untuk keselesaan optimum di set sofa ruang tamu.",
    "shortDescription": "Size 17 x 17 inch | RM14.90 | Bantal kusyen saiz standard 17x17 inci.",
    "categoryId": "cat-kusyen-sofa",
    "productType": "pillow",
    "material": "Asian Polyester Fibre",
    "priceSen": 1490,
    "warrantyYears": 1,
    "isFeatured": false,
    "status": "published",
    "badge": "STANDARD KUSYEN",
    "dimensions": "17\" x 17\"",
    "images": [
      {
        "id": "img-bantal-sofa-17x17-1",
        "productId": "prod-bantal-sofa-17x17",
        "imageUrl": "/images/products/bantal-sofa-17x17-poly.png",
        "altText": "BANTAL SOFA SIZE 17X17 INCH - RM14.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-bantal-sofa-17x17-1",
        "productId": "prod-bantal-sofa-17x17",
        "sku": "TSJ-BS-1717-01",
        "name": "17x17 inch",
        "sizeName": "Standard",
        "dimensions": "17\" x 17\"",
        "priceSen": 1490,
        "stockQuantity": 150,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-bantal-kusyen-20x20",
    "name": "BANTAL KUSYEN SIZE 20X20 INCH",
    "slug": "bantal-kusyen-20x20",
    "subtitle": "Size 20 x 20 inch | Poly Fibre",
    "description": "Bantal kusyen saiz besar 20x20 inci. Sangat empuk untuk santai di ruang tamu, kerusi rehat atau ruang rekreasi keluarga.",
    "shortDescription": "Size 20 x 20 inch | RM19.90 | Bantal kusyen besar 20x20 inci empuk dan padat.",
    "categoryId": "cat-kusyen-sofa",
    "productType": "pillow",
    "material": "Asian Polyester Fibre",
    "priceSen": 1990,
    "warrantyYears": 1,
    "isFeatured": true,
    "status": "published",
    "badge": "KUSYEN BESAR",
    "dimensions": "20\" x 20\"",
    "images": [
      {
        "id": "img-bantal-kusyen-20x20-1",
        "productId": "prod-bantal-kusyen-20x20",
        "imageUrl": "/images/products/bantal-kusyen-20x20-poly.png",
        "altText": "BANTAL KUSYEN SIZE 20X20 INCH - RM19.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-bantal-kusyen-20x20-1",
        "productId": "prod-bantal-kusyen-20x20",
        "sku": "TSJ-BK-2020-01",
        "name": "20x20 inch",
        "sizeName": "Standard",
        "dimensions": "20\" x 20\"",
        "priceSen": 1990,
        "stockQuantity": 120,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-bantal-kusyen-25x25",
    "name": "BANTAL KUSYEN SIZE 25X25 INCH",
    "slug": "bantal-kusyen-25x25",
    "subtitle": "Size 25 x 25 inch | Poly Fibre",
    "description": "Bantal kusyen ekstra besar saiz 25x25 inci. Sesuai untuk kusyen lantai tatami, kerusi rotan atau sofa sudut keluarga.",
    "shortDescription": "Size 25 x 25 inch | RM24.90 | Kusyen ekstra besar 25x25 inci isian poly fibre.",
    "categoryId": "cat-kusyen-sofa",
    "productType": "pillow",
    "material": "Asian Polyester Fibre",
    "priceSen": 2490,
    "warrantyYears": 1,
    "isFeatured": false,
    "status": "published",
    "badge": "EXTRA LARGE",
    "dimensions": "25\" x 25\"",
    "images": [
      {
        "id": "img-bantal-kusyen-25x25-1",
        "productId": "prod-bantal-kusyen-25x25",
        "imageUrl": "/images/products/bantal-kusyen-25x25-poly.png",
        "altText": "BANTAL KUSYEN SIZE 25X25 INCH - RM24.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-bantal-kusyen-25x25-1",
        "productId": "prod-bantal-kusyen-25x25",
        "sku": "TSJ-BK-2525-01",
        "name": "25x25 inch",
        "sizeName": "Standard",
        "dimensions": "25\" x 25\"",
        "priceSen": 2490,
        "stockQuantity": 80,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-bantal-kusyen-30x30",
    "name": "BANTAL KUSYEN SIZE 30X30 INCH",
    "slug": "bantal-kusyen-30x30",
    "subtitle": "Size 30 x 30 inch | Poly Fibre",
    "description": "Bantal kusyen gergasi jumbo saiz 30x30 inci. Sangat empuk sebagai kusyen rehat santai atas lantai, surau atau ruang istirahat.",
    "shortDescription": "Size 30 x 30 inch | RM29.90 | Kusyen saiz jumbo 30x30 inci paling mewah.",
    "categoryId": "cat-kusyen-sofa",
    "productType": "pillow",
    "material": "Asian Polyester Fibre",
    "priceSen": 2990,
    "warrantyYears": 1,
    "isFeatured": false,
    "status": "published",
    "badge": "JUMBO SIZE",
    "dimensions": "30\" x 30\"",
    "images": [
      {
        "id": "img-bantal-kusyen-30x30-1",
        "productId": "prod-bantal-kusyen-30x30",
        "imageUrl": "/images/products/bantal-kusyen-30x30-poly.png",
        "altText": "BANTAL KUSYEN SIZE 30X30 INCH - RM29.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-bantal-kusyen-30x30-1",
        "productId": "prod-bantal-kusyen-30x30",
        "sku": "TSJ-BK-3030-01",
        "name": "30x30 inch",
        "sizeName": "Standard",
        "dimensions": "30\" x 30\"",
        "priceSen": 2990,
        "stockQuantity": 60,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-sarung-tilam-single",
    "name": "SARUNG TILAM SINGLE",
    "slug": "sarung-tilam-single",
    "subtitle": "Size 90 cm x 200 cm | Berzip Kemas",
    "description": "Sarung tilam single berzip keliling kemas. Melindungi tilam toto atau tilam bujang daripada habuk dan kotoran. Mudah dibuka untuk dicuci.",
    "shortDescription": "Size 90 cm x 200 cm | RM14.90 | Sarung tilam bujang berzip praktikal.",
    "categoryId": "cat-sarung-tilam",
    "productType": "bedding",
    "material": "Kain Cotton & Poly Berzip",
    "priceSen": 1490,
    "warrantyYears": 1,
    "isFeatured": true,
    "status": "published",
    "badge": "BERZIP KEMAS",
    "dimensions": "90 cm x 200 cm",
    "images": [
      {
        "id": "img-sarung-tilam-single-1",
        "productId": "prod-sarung-tilam-single",
        "imageUrl": "/images/products/sarung-tilam-single.png",
        "altText": "SARUNG TILAM SINGLE - RM14.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-sarung-tilam-single-1",
        "productId": "prod-sarung-tilam-single",
        "sku": "TSJ-ST-SIN-01",
        "name": "Single (90x200 cm)",
        "sizeName": "Single",
        "dimensions": "90 cm x 200 cm",
        "priceSen": 1490,
        "stockQuantity": 200,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-sarung-tilam-queen",
    "name": "SARUNG TILAM QUEEN",
    "slug": "sarung-tilam-queen",
    "subtitle": "Size 150 cm x 200 cm | Berzip Kemas",
    "description": "Sarung tilam queen berzip keliling dengan kemasan jahitan kemas terus dari kilang. Memastikan tilam toto queen anda sentiasa bersih dan segar.",
    "shortDescription": "Size 150 cm x 200 cm | RM19.90 | Sarung tilam queen berzip tahan lasak.",
    "categoryId": "cat-sarung-tilam",
    "productType": "bedding",
    "material": "Kain Cotton & Poly Berzip",
    "priceSen": 1990,
    "warrantyYears": 1,
    "isFeatured": false,
    "status": "published",
    "badge": "BERZIP KEMAS",
    "dimensions": "150 cm x 200 cm",
    "images": [
      {
        "id": "img-sarung-tilam-queen-1",
        "productId": "prod-sarung-tilam-queen",
        "imageUrl": "/images/products/sarung-tilam-queen.png",
        "altText": "SARUNG TILAM QUEEN - RM19.90",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "var-sarung-tilam-queen-1",
        "productId": "prod-sarung-tilam-queen",
        "sku": "TSJ-ST-QUE-01",
        "name": "Queen (150x200 cm)",
        "sizeName": "Queen",
        "dimensions": "150 cm x 200 cm",
        "priceSen": 1990,
        "stockQuantity": 150,
        "isActive": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-custom-oem-bantal-tidur",
    "name": "CUSTOM (OEM) - BANTAL TIDUR",
    "slug": "custom-oem-bantal-tidur",
    "subtitle": "Pakej Tempahan Pukal & Jenama Sendiri (OEM) | RM1,000",
    "description": "Perkhidmatan pengilangan dan tempahan pukal bantal tidur custom OEM terus dari kilang Tunas Sinar Jaya Enterprise di Tasek Gelugor. Boleh disesuaikan dengan isian Asian Polyester Fibre, TC Shoddy atau Kekabu Asli mengikut spesifikasi hotel, homestay, asrama, hospital dan peniaga tekstil dengan label jenama anda sendiri.",
    "shortDescription": "Pakej Tempahan Pukal & Jahit Jenama Sendiri (OEM) Bantal Tidur | RM1,000.00.",
    "categoryId": "cat-custom-oem",
    "productType": "pillow",
    "material": "Asian Polyester Fibre / TC Shoddy / Kekabu Asli (Pilihan Pelanggan)",
    "warrantyYears": 1,
    "trialNights": 0,
    "features": [
      "Tempahan pukal & pengeluaran custom OEM terus dari kilang",
      "Pilihan isian Asian Polyester Fibre, TC Shoddy atau Kekabu Asli",
      "Boleh sertakan label jenama sendiri untuk hotel, asrama & peniaga",
      "Kualiti jahitan kilang berpengalaman lebih 20 tahun"
    ],
    "layers": [],
    "specifications": {
      "Kategori": "Custom (OEM) Tempahan Pukal",
      "Isian": "Asian Polyester Fibre / TC Shoddy / Kekabu Asli",
      "Kain Sarung": "100% Cotton / Microfibre Berzip atau Berjahit Rapi",
      "Minimum Tempahan": "Pakej Nilai RM1,000 mengikut kuantiti unit dipersetujui",
      "Label": "Boleh sertakan label jenama sendiri (OEM Woven Label)",
      "Pengeluar": "Tunas Sinar Jaya Sdn. Bhd. (Tasek Gelugor, Pulau Pinang)"
    },
    "faq": [
      {
        "question": "Bolehkah saya meletakkan jenama atau logo syarikat sendiri pada bantal?",
        "answer": "Ya, kami menyediakan perkhidmatan jahitan label jenama anda sendiri (OEM) untuk tempahan pukal."
      },
      {
        "question": "Berapa lama tempoh siap untuk tempahan OEM bantal ini?",
        "answer": "Biasanya mengambil masa 5 hingga 10 hari bekerja bergantung kepada kuantiti dan spesifikasi isian."
      }
    ],
    "status": "published",
    "isFeatured": true,
    "variants": [
      {
        "id": "var-custom-oem-bantal-1",
        "productId": "prod-custom-oem-bantal-tidur",
        "sku": "TSJ-OEM-BTL-1000",
        "sizeName": "Pakej Tempahan Pukal RM1,000",
        "dimensions": "Custom mengikut spesifikasi",
        "priceSen": 100000,
        "compareAtPriceSen": 120000,
        "stockQuantity": 50,
        "isActive": true,
        "quantityTiers": [
          {
            "quantity": 2,
            "priceSen": 190000,
            "label": "2 Pakej Jimat RM100"
          },
          {
            "quantity": 5,
            "priceSen": 450000,
            "label": "5 Pakej Borong Kilang (Jimat RM500)"
          }
        ]
      }
    ],
    "images": [
      {
        "id": "img-custom-oem-bantal-1",
        "productId": "prod-custom-oem-bantal-tidur",
        "imageUrl": "/images/products/custom-oem-bantal-tidur.jpg",
        "altText": "CUSTOM (OEM) - BANTAL TIDUR - RM1,000",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "createdAt": "2026-10-14T10:00:00Z",
    "updatedAt": "2026-10-14T10:00:00Z"
  },
  {
    "id": "prod-custom-oem-tilam-toto",
    "name": "CUSTOM (OEM) - TILAM TOTO",
    "slug": "custom-oem-tilam-toto",
    "subtitle": "Pengilangan Pukal Tilam Toto OEM | RM1,000",
    "description": "Pengeluaran pukal tilam toto jenama sendiri (OEM) terus dari kilang jahitan Tunas Sinar Jaya. Kami menawarkan pembuatan mengikut ukuran, ketebalan, jenis fabrik (cotton, microfibre, quilting eksklusif) serta isian Asian Polyester Fibre bermutu tinggi yang empuk dan tahan leper.",
    "shortDescription": "Pakej Pengilangan Pukal Tilam Toto OEM | RM1,000.00 | Pilihan Fabrik & Ketebalan.",
    "categoryId": "cat-custom-oem",
    "productType": "mattress",
    "material": "Asian Polyester Fibre Tebal & Fabrik Quilting Pilihan",
    "warrantyYears": 1,
    "trialNights": 0,
    "features": [
      "Pembuatan OEM tilam toto secara pukal dengan spesifikasi tersendiri",
      "Pilihan corak fabrik, ketebalan dan isian Asian Polyester Fibre padat",
      "Jahitan quilting kemas dan piping tahan lasak",
      "Harga borong terus dari kilang pengeluar Tasek Gelugor"
    ],
    "layers": [],
    "specifications": {
      "Kategori": "Custom (OEM) Tilam Toto",
      "Isian Utama": "Asian Polyester Fibre Padat & Anjal",
      "Pilihan Saiz": "Single (90x200cm), Queen (150x200cm), King atau Saiz Khas",
      "Fabrik": "Pelbagai corak moden, jalur hotel atau plain eksklusif",
      "Kemasan": "Jahitan piping keliling kukuh & quilting tidak mudah tercabut",
      "Pengeluar": "Tunas Sinar Jaya Sdn. Bhd. (Tasek Gelugor, Pulau Pinang)"
    },
    "faq": [
      {
        "question": "Bolehkah saya memilih ketebalan isian fiber toto?",
        "answer": "Boleh, ketebalan dan berat isian boleh disesuaikan mengikut bajet dan keperluan anda."
      }
    ],
    "status": "published",
    "isFeatured": true,
    "variants": [
      {
        "id": "var-custom-oem-toto-1",
        "productId": "prod-custom-oem-tilam-toto",
        "sku": "TSJ-OEM-TTO-1000",
        "sizeName": "Pakej Tempahan Pukal RM1,000",
        "dimensions": "Custom mengikut spesifikasi",
        "priceSen": 100000,
        "compareAtPriceSen": 120000,
        "stockQuantity": 50,
        "isActive": true,
        "quantityTiers": [
          {
            "quantity": 2,
            "priceSen": 190000,
            "label": "2 Pakej Jimat RM100"
          },
          {
            "quantity": 5,
            "priceSen": 450000,
            "label": "5 Pakej Borong Kilang (Jimat RM500)"
          }
        ]
      }
    ],
    "images": [
      {
        "id": "img-custom-oem-toto-1",
        "productId": "prod-custom-oem-tilam-toto",
        "imageUrl": "/images/products/custom-oem-tilam-toto.jpg",
        "altText": "CUSTOM (OEM) - TILAM TOTO - RM1,000",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "createdAt": "2026-10-14T10:00:00Z",
    "updatedAt": "2026-10-14T10:00:00Z"
  },
  {
    "id": "prod-custom-oem-tilam-gulung",
    "name": "CUSTOM (OEM) - TILAM GULUNG",
    "slug": "custom-oem-tilam-gulung",
    "subtitle": "Pengilangan Pukal Tilam Gulung Mudah Alih OEM | RM1,000",
    "description": "Perkhidmatan OEM tilam gulung mudah alih dengan tali pengikat (straps) dan beg mudah alih untuk kegunaan asrama sekolah, pusat latihan, kem tentera, agensi bencana dan homestay. Menggunakan isian Poly Fibre padat atau TC Shoddy dengan sarung berzip tahan lasak.",
    "shortDescription": "Pakej Pengilangan Pukal Tilam Gulung OEM | RM1,000.00 | Tali Pengikat & Sarung Berzip.",
    "categoryId": "cat-custom-oem",
    "productType": "mattress",
    "material": "High Density Poly Fibre / TC Shoddy & Heavy Duty Fabric",
    "warrantyYears": 1,
    "trialNights": 0,
    "features": [
      "Pengeluaran pukal tilam gulung mudah alih OEM lengkap tali pengikat",
      "Sarung berzip tahan lasak dan fabrik tebal kalis habuk",
      "Sesuai untuk asrama sekolah, pusat latihan, homestay dan kem",
      "Jimat ruang dan mudah disimpan atau diagihkan"
    ],
    "layers": [],
    "specifications": {
      "Kategori": "Custom (OEM) Tilam Gulung",
      "Isian": "Poly Fibre Berketumpatan Tinggi / TC Shoddy",
      "Sarung": "Fabrik Tebal Kalis Habuk dengan Zip Tahan Lasak",
      "Ciri Khas": "Tali webbing pengikat berkualiti tinggi untuk mudah simpan dan bawa",
      "Pengeluar": "Tunas Sinar Jaya Sdn. Bhd. (Tasek Gelugor, Pulau Pinang)"
    },
    "faq": [
      {
        "question": "Adakah tilam gulung ini sesuai untuk asrama pelajar?",
        "answer": "Sangat sesuai kerana jimat ruang, mudah disimpan dan tahan lasak untuk kegunaan harian."
      }
    ],
    "status": "published",
    "isFeatured": true,
    "variants": [
      {
        "id": "var-custom-oem-gulung-1",
        "productId": "prod-custom-oem-tilam-gulung",
        "sku": "TSJ-OEM-GLG-1000",
        "sizeName": "Pakej Tempahan Pukal RM1,000",
        "dimensions": "Custom mengikut spesifikasi",
        "priceSen": 100000,
        "compareAtPriceSen": 120000,
        "stockQuantity": 50,
        "isActive": true,
        "quantityTiers": [
          {
            "quantity": 2,
            "priceSen": 190000,
            "label": "2 Pakej Jimat RM100"
          },
          {
            "quantity": 5,
            "priceSen": 450000,
            "label": "5 Pakej Borong Kilang (Jimat RM500)"
          }
        ]
      }
    ],
    "images": [
      {
        "id": "img-custom-oem-gulung-1",
        "productId": "prod-custom-oem-tilam-gulung",
        "imageUrl": "/images/products/custom-oem-tilam-gulung.jpg",
        "altText": "CUSTOM (OEM) - TILAM GULUNG - RM1,000",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "createdAt": "2026-10-14T10:00:00Z",
    "updatedAt": "2026-10-14T10:00:00Z"
  },
  {
    "id": "prod-custom-oem-kusyen-sofa",
    "name": "CUSTOM (OEM) - KUSYEN SOFA",
    "slug": "custom-oem-kusyen-sofa",
    "subtitle": "Jahitan & Isian Kusyen Sofa OEM | RM1,000",
    "description": "Perkhidmatan tempahan jahitan dan isian kusyen sofa custom OEM untuk pengusaha perabot kayu, sofa palet, kusyen kerusi rotan, kafe, homestay dan ruang rehat korporat. Menggunakan span berketumpatan tinggi (rebond/high density foam) dan sarung fabrik upholstery premium tahan lasak.",
    "shortDescription": "Pakej Jahitan & Isian Kusyen Sofa OEM | RM1,000.00 | Upholstery & High Density Foam.",
    "categoryId": "cat-custom-oem",
    "productType": "bedding",
    "material": "High Density Rebond Foam / Polyester & Premium Upholstery Fabric",
    "warrantyYears": 1,
    "trialNights": 0,
    "features": [
      "Jahitan kusyen sofa dan kerusi custom OEM pelbagai saiz",
      "Pilihan isian span berketumpatan tinggi (rebond/high density foam)",
      "Fabrik upholstery berkualiti tinggi dengan zip panjang tersembunyi",
      "Sesuai untuk pengusaha perabot, kafe, resort dan homestay"
    ],
    "layers": [],
    "specifications": {
      "Kategori": "Custom (OEM) Kusyen & Bantal Sofa",
      "Isian Span": "Rebond Foam Ketumpatan Tinggi / Span D28-D35",
      "Sarung Fabrik": "Fabrik Upholstery Textured, Velvet, Canvas atau PVC Kalis Air",
      "Kemasan": "Zip panjang tersembunyi & jahitan piping kemas",
      "Pengeluar": "Tunas Sinar Jaya Sdn. Bhd. (Tasek Gelugor, Pulau Pinang)"
    },
    "faq": [
      {
        "question": "Bolehkah saya menghantar ukuran rangka kerusi untuk dibuat kusyen?",
        "answer": "Boleh, berikan ukuran tepat (panjang, lebar, tebal) atau hantar contoh untuk kami tiru dan hasilkan secara pukal."
      }
    ],
    "status": "published",
    "isFeatured": true,
    "variants": [
      {
        "id": "var-custom-oem-kusyen-1",
        "productId": "prod-custom-oem-kusyen-sofa",
        "sku": "TSJ-OEM-KSN-1000",
        "sizeName": "Pakej Tempahan Pukal RM1,000",
        "dimensions": "Custom mengikut spesifikasi",
        "priceSen": 100000,
        "compareAtPriceSen": 120000,
        "stockQuantity": 50,
        "isActive": true,
        "quantityTiers": [
          {
            "quantity": 2,
            "priceSen": 190000,
            "label": "2 Pakej Jimat RM100"
          },
          {
            "quantity": 5,
            "priceSen": 450000,
            "label": "5 Pakej Borong Kilang (Jimat RM500)"
          }
        ]
      }
    ],
    "images": [
      {
        "id": "img-custom-oem-kusyen-1",
        "productId": "prod-custom-oem-kusyen-sofa",
        "imageUrl": "/images/products/custom-oem-kusyen-sofa.jpg",
        "altText": "CUSTOM (OEM) - KUSYEN SOFA - RM1,000",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "createdAt": "2026-10-14T10:00:00Z",
    "updatedAt": "2026-10-14T10:00:00Z"
  }
]

export const initialCoupons: Coupon[] = [
  {
    "id": "coup-kamaar3",
    "code": "KAMAAR3",
    "description": "Potongan RM3 untuk belian minima RM20 (sesuai untuk pembelian bantal & aksesori)",
    "discountType": "fixed_amount",
    "discountValue": 300,
    "minSpendSen": 2000,
    "usageLimit": 1000,
    "usageCount": 18,
    "perCustomerLimit": 2,
    "startsAt": "2026-01-01T00:00:00Z",
    "endsAt": "2026-12-31T23:59:59Z",
    "isActive": true,
    "showOnHomepage": true,
    "featuredOrder": 1,
    "customTitle": "Diskaun Pengenalan RM3",
    "customBadge": "RM3 OFF",
    "customerRestriction": "all",
    "applicableCategory": "all"
  },
  {
    "id": "coup-kamaar5",
    "code": "KAMAAR5",
    "description": "Potongan RM5 untuk belian minima RM45 (sesuai untuk 1 unit Toto atau kombo bantal)",
    "discountType": "fixed_amount",
    "discountValue": 500,
    "minSpendSen": 4500,
    "usageLimit": 1000,
    "usageCount": 35,
    "perCustomerLimit": 2,
    "startsAt": "2026-01-01T00:00:00Z",
    "endsAt": "2026-12-31T23:59:59Z",
    "isActive": true,
    "showOnHomepage": true,
    "featuredOrder": 2,
    "customTitle": "Diskaun Toto & Bilik Tidur RM5",
    "customBadge": "RM5 OFF",
    "customerRestriction": "all",
    "applicableCategory": "all"
  },
  {
    "id": "coup-kamaar10",
    "code": "KAMAAR10",
    "description": "Potongan RM10 untuk belian minima RM90 (sesuai untuk 2 unit toto atau set comforter)",
    "discountType": "fixed_amount",
    "discountValue": 1000,
    "minSpendSen": 9000,
    "usageLimit": 500,
    "usageCount": 24,
    "perCustomerLimit": 1,
    "startsAt": "2026-01-01T00:00:00Z",
    "endsAt": "2026-12-31T23:59:59Z",
    "isActive": true,
    "showOnHomepage": true,
    "featuredOrder": 3,
    "customTitle": "Penjimatan Seisi Keluarga RM10",
    "customBadge": "RM10 OFF",
    "customerRestriction": "all",
    "applicableCategory": "all"
  },
  {
    "id": "coup-kamaar15",
    "code": "KAMAAR15",
    "description": "Potongan RM15 untuk belian minima RM140 (sesuai untuk set bilik tidur & comforter tebal)",
    "discountType": "fixed_amount",
    "discountValue": 1500,
    "minSpendSen": 14000,
    "usageLimit": 300,
    "usageCount": 12,
    "perCustomerLimit": 1,
    "startsAt": "2026-01-01T00:00:00Z",
    "endsAt": "2026-12-31T23:59:59Z",
    "isActive": true,
    "showOnHomepage": true,
    "featuredOrder": 4,
    "customTitle": "Pakej Bilik Tidur Lengkap RM15",
    "customBadge": "RM15 OFF",
    "customerRestriction": "all",
    "applicableCategory": "all"
  },
  {
    "id": "coup-borong20",
    "code": "BORONG20",
    "description": "Diskaun borong RM20 untuk belian minima RM200 (asrama, tahfiz, homestay & tempahan pukal)",
    "discountType": "fixed_amount",
    "discountValue": 2000,
    "minSpendSen": 20000,
    "usageLimit": 200,
    "usageCount": 9,
    "perCustomerLimit": 2,
    "startsAt": "2026-01-01T00:00:00Z",
    "endsAt": "2026-12-31T23:59:59Z",
    "isActive": true,
    "showOnHomepage": true,
    "featuredOrder": 5,
    "customTitle": "Diskaun Borong Kilang RM20",
    "customBadge": "RM20 OFF",
    "customerRestriction": "all",
    "applicableCategory": "all"
  },
  {
    "id": "coup-freeship",
    "code": "FREESHIP",
    "description": "Penghantaran Percuma Semenanjung untuk pesanan RM80 ke atas",
    "discountType": "free_shipping",
    "discountValue": 0,
    "minSpendSen": 8000,
    "usageLimit": 1000,
    "usageCount": 45,
    "perCustomerLimit": 3,
    "startsAt": "2026-01-01T00:00:00Z",
    "endsAt": "2026-12-31T23:59:59Z",
    "isActive": true,
    "showOnHomepage": true,
    "featuredOrder": 6,
    "customTitle": "Penghantaran Percuma",
    "customBadge": "FREE POSTAGE",
    "customerRestriction": "all",
    "applicableCategory": "all"
  },
  {
    "id": "coup-welcome10",
    "code": "WELCOME10",
    "description": "Diskaun 10% pelanggan baharu (had diskaun RM15) untuk pesanan RM50 ke atas",
    "discountType": "percentage",
    "discountValue": 10,
    "maxDiscountSen": 1500,
    "minSpendSen": 5000,
    "usageLimit": 500,
    "usageCount": 16,
    "perCustomerLimit": 1,
    "startsAt": "2026-01-01T00:00:00Z",
    "endsAt": "2026-12-31T23:59:59Z",
    "isActive": true,
    "showOnHomepage": true,
    "featuredOrder": 7,
    "customTitle": "Selamat Datang 10% OFF",
    "customBadge": "10% OFF",
    "customerRestriction": "all",
    "applicableCategory": "all"
  }
]

export const initialShowrooms: Showroom[] = [
  {
    "id": "show-tasek-gelugor",
    "name": "Kilang & Galeri Jualan Gudang Tasek Gelugor",
    "city": "Tasek Gelugor",
    "address": "7878B Jalan Permatang Berangan",
    "state": "Pulau Pinang",
    "postcode": "13300",
    "phone": "019-478 6991",
    "openingHours": "Isnin - Sabtu: 9:00 AM - 6:00 PM (Ahad: Jualan Gudang & Temujanji)",
    "mapUrl": "https://maps.google.com/?q=7878B+Jalan+Permatang+Berangan+13300+Tasek+Gelugor+Pulau+Pinang",
    "imageUrl": "/images/company/kilang-tekstil-jahitan.jpg",
    "displayOrder": 1,
    "isActive": true
  }
]

export const initialBlogPosts: BlogPost[] = [
  {
    "id": "blog-1",
    "slug": "panduan-penjagaan-tilam-toto-dan-bantal-fiber",
    "title": "Panduan Penjagaan Tilam Toto & Bantal Fiber Agar Kekal Gebu",
    "excerpt": "Petua mudah daripada tukang jahit kilang kami untuk mengekalkan keempukan dan kebersihan tilam toto seisi keluarga.",
    "content": "Tilam toto Asian Polyester Fibre keluaran Tunas Sinar Jaya direka untuk ketahanan maksimum. Untuk memastikan ia sentiasa empuk dan bersih:\n1. Jemur di bawah cahaya matahari pagi setiap 2 minggu untuk mematikan hama dan mengembalikan kegebuan fiber.\n2. Gunakan sarung berzip gantian untuk memudahkan cucian sarung luar.\n3. Elakkan melipat tilam toto secara kasar; lebih baik digulung secara kemas bagi menjaga struktur jahitan quilting.",
    "author": "Tunas Sinar Jaya Enterprise",
    "imageUrl": "/images/hiasan/KUALITI PREMIUM.png",
    "tags": [
      "Panduan",
      "Tilam Toto",
      "Tips"
    ],
    "publishedAt": "2026-09-15T09:00:00Z",
    "isPublished": true
  },
  {
    "id": "blog-2",
    "slug": "kelebihan-tilam-kekabu-asli-untuk-kesihatan-tulang-belakang",
    "title": "Kenapa Tilam Kekabu Asli Kekal Menjadi Pilihan Turun-Temurun",
    "excerpt": "Ketahui kelebihan gentian kekabu semulajadi yang sejuk, bebas kimia dan memberikan sokongan terbaik untuk rehat anda.",
    "content": "Kekabu asli terkenal dengan sifat semulajadinya yang sejuk dan tidak memerangkap haba, menjadikannya pilihan ideal untuk iklim Malaysia. Ditambah dengan jahitan butang tufted kemas dari kilang Tunas Sinar Jaya, tilam kekabu memberikan sokongan sekata yang melegakan ketegangan otot belakang.",
    "author": "Tunas Sinar Jaya Enterprise",
    "imageUrl": "/images/proses/PROSES ISI KEKABU KE DALAM BANTAL.png",
    "tags": [
      "Kekabu",
      "Tradisi",
      "Kesihatan"
    ],
    "publishedAt": "2026-09-20T09:00:00Z",
    "isPublished": true
  },
  {
    "id": "blog-3",
    "slug": "tips-memilih-tilam-asrama-dan-pakej-jualan-gudang",
    "title": "Panduan Pengusaha Homestay & Asrama Memilih Tilam Yang Tahan Lasak",
    "excerpt": "Bagaimana pakej jualan gudang dan tilam bujang heavy duty kilang menjimatkan kos operasi pengusaha asrama dan homestay.",
    "content": "Bagi pengusaha asrama, tahfiz dan homestay, ketahanan tilam adalah kunci penjimatan. Tilam bujang dengan jahitan bertetulang dan teras padat rebonded memastikan tilam tidak mudah melendut walau digunakan setiap hari oleh penghuni berbeza.",
    "author": "Tunas Sinar Jaya Enterprise",
    "imageUrl": "/images/proses/PROSES PACKING.png",
    "tags": [
      "Asrama",
      "Borong",
      "Homestay"
    ],
    "publishedAt": "2026-09-28T09:00:00Z",
    "isPublished": true
  }
]

export const initialSiteSettings: SiteSettings = {
  "brandName": "KAMAAR Beddings",
  "logoText": "TUNAS SINAR JAYA ENTERPRISE (KAMAAR BEDDINGS)",
  "tagline": "Kualiti Jahitan, Kepuasan Terjamin • Menjahit Kepercayaan, Menyulam Masa Depan",
  "currency": "MYR",
  "currencySymbol": "RM",
  "contactEmail": "tunassinar@gmail.com",
  "contactPhone": "019-478 6991",
  "whatsappNumber": "+60194786991",
  "address": "7878B Jalan Permatang Berangan, 13300 Tasek Gelugor SPU, Pulau Pinang",
  "announcementText": "Jualan Gudang Terus Dari Kilang • Penghantaran ke Seluruh Semenanjung Malaysia",
  "announcementUrl": "/collections/tilam-toto",
  "isAnnouncementActive": true,
  "announcementActive": true,
  "freeShippingThresholdSen": 20000,
  "peninsularShippingSen": 1500,
  "eastMalaysiaShippingSen": 4500,
  "warrantyDefaultYears": 1,
  "trialDefaultNights": 14,
  "selfPickupEnabled": true,
  "pickupLocationName": "Kilang KAMAAR Beddings (Tunas Sinar Jaya Enterprise)",
  "pickupAddress": "7878B Jalan Permatang Berangan",
  "pickupCityState": "Tasek Gelugor, Seberang Perai Utara, Pulau Pinang",
  "pickupPostcode": "13300",
  "pickupOperatingHours": "Isnin – Sabtu: 9:00 AM – 6:00 PM (Ahad & Cuti Umum Tutup)",
  "pickupContactPhone": "019-478 6991",
  "pickupGoogleMapsUrl": "https://maps.google.com/?q=7878B+Jalan+Permatang+Berangan,+13300+Tasek+Gelugor+Pulau+Pinang",
  "pickupWazeUrl": "https://waze.com/ul?q=7878B%20Jalan%20Permatang%20Berangan%20Tasek%20Gelugor",
  "pickupInstructions": "Sila bawa No. Pesanan / Resit semasa hadir di kilang untuk penyerahan pesanan.",
  "whiteGloveTitle": "Penghantaran White-Glove",
  "whiteGloveSubtitle": "Servis logistik premium khas terus dari kilang KAMAAR ke kediaman anda:",
  "whiteGloveFeature1": "Masuk Bilik Tidur — 2 krew angkat terus ke bilik",
  "whiteGloveFeature2": "Unboxing & Pasang — Buka & pasang tilam di katil",
  "whiteGloveFeature3": "Insurans Kilang — Kalis cuaca & dilindungi penuh",
  "whiteGloveNotice": "Kurier Kilang",
  "whiteGloveMiniTitle": "Servis Kurier & Pasang Kilang",
  "whiteGloveMiniDesc": "Dihantar terus oleh krew terlatih KAMAAR ke bilik tidur anda berserta jaminan keselamatan kilang.",
  "whiteGloveMiniButtonText": "Maklumat Lanjut",
  "whiteGloveModalCloseText": "Faham & Tutup",
  "checkoutAutoApplyVoucherEnabled": true,
  "checkoutAutoApplyMode": "algorithm_best",
  "checkoutAutoApplyVoucherCode": "auto_best",
  "checkoutSuggestedVouchersEnabled": true,
  "checkoutSuggestedVoucherCodes": ["KAMAAR3", "KAMAAR5", "KAMAAR10", "FREESHIP"]
}

export const initialStaffMembers: StaffMember[] = [
  {
    "id": "staff-admin-main",
    "email": "admin@kamaarbeddings.com",
    "name": "Kamaar Admin",
    "role": "owner",
    "isActive": true,
    "createdAt": "2026-09-01T00:00:00Z"
  },
  {
    "id": "staff-hazizi",
    "email": "hazizi@kamaar.my",
    "name": "Hazizi Md Rashid",
    "role": "owner",
    "isActive": true,
    "createdAt": "2026-09-01T00:00:00Z"
  },
  {
    "id": "staff-hezwan",
    "email": "hezwan@kamaar.my",
    "name": "Hezwan Md Rashid",
    "role": "owner",
    "isActive": true,
    "createdAt": "2026-09-01T00:00:00Z"
  },
  {
    "id": "staff-elias",
    "email": "elias@kamaar.my",
    "name": "Elias Mat Rashid",
    "role": "catalog_manager",
    "isActive": true,
    "createdAt": "2026-09-01T00:00:00Z"
  },
  {
    "id": "staff-chejam",
    "email": "chejam@kamaar.my",
    "name": "Che Jam Darus",
    "role": "order_manager",
    "isActive": true,
    "createdAt": "2026-09-01T00:00:00Z"
  },
  {
    "id": "staff-yahya",
    "email": "yahya@kamaar.my",
    "name": "Yahya Bin Ishak",
    "role": "content_editor",
    "isActive": true,
    "createdAt": "2026-09-01T00:00:00Z"
  },
  {
    "id": "staff-zuki",
    "email": "zuki@kamaar.my",
    "name": "Zuki Musa",
    "role": "order_manager",
    "isActive": true,
    "createdAt": "2026-09-01T00:00:00Z"
  }
]

export const initialReviews: Review[] = [
  {
    "id": "rev-1",
    "productId": "prod-toto-asian-fibre",
    "customerName": "Kak Siti Noraini (Bertam, Kepala Batas)",
    "rating": 5,
    "title": "Tilam toto sangat gebu dan tebal!",
    "content": "Beli saiz Queen corak bunga biru. Memang tebal betul, anak-anak suka baring depan TV. Jahitan quilting kemas sangat, tak rugi beli terus dari kilang Tasek Gelugor.",
    "isVerifiedPurchase": true,
    "status": "approved",
    "createdAt": "2026-09-10T14:30:00Z"
  },
  {
    "id": "rev-2",
    "productId": "prod-toto-asian-fibre",
    "customerName": "En. Azman (Pengusaha Homestay Butterworth)",
    "rating": 5,
    "title": "Pilihan terbaik untuk homestay!",
    "content": "Saya order 5 set tilam toto untuk homestay saya. Tetamu puji selesa bila tidur. Harga memang berpatutan berbanding kedai luar. Servis Tunas Sinar Jaya sangat mesra.",
    "isVerifiedPurchase": true,
    "status": "approved",
    "createdAt": "2026-09-15T11:20:00Z"
  },
  {
    "id": "rev-3",
    "productId": "prod-tilam-lipat-3",
    "customerName": "Adib Danial (Pelajar USM Pulau Pinang)",
    "rating": 5,
    "title": "Senang lipat dan jimat ruang bilik sewa",
    "content": "Beli tilam lipat 3 inci tebal. Memang sedap baring dan sarung berzip senang dibuka bila nak cuci. Penghantaran pun laju.",
    "isVerifiedPurchase": true,
    "status": "approved",
    "createdAt": "2026-09-20T16:45:00Z"
  },
  {
    "id": "rev-4",
    "productId": "prod-bantal-gebu-asian",
    "customerName": "Puan Halimah (Sungai Petani, Kedah)",
    "rating": 5,
    "title": "Bantal empuk tak sakit leher",
    "content": "Order pakej kombo 4 biji bantal gebu. Sangat puas hati! Fiber penuh tapi tak keras. Bangun pagi rasa segar.",
    "isVerifiedPurchase": true,
    "status": "approved",
    "createdAt": "2026-09-24T09:10:00Z"
  }
]

export const initialAffiliates: Affiliate[] = [
  {
    "id": "aff-danial",
    "code": "AFF-DANIAL",
    "name": "Ahmad Danial",
    "email": "danial@kamaar.my",
    "phone": "011-6444 7908",
    "bankName": "Maybank",
    "bankAccountNumber": "164012345678",
    "commissionType": "percentage",
    "commissionRate": 10,
    "totalSalesCount": 15,
    "totalSalesRevenueSen": 125000,
    "totalCommissionSen": 12500,
    "isActive": true,
    "createdAt": "2026-08-01T10:00:00Z",
    "adminNotes": "Ejen aktif kawasan Seberang Perai & Kedah.",
    "accessKey": "kamaar123"
  }
]

export const initialWebsiteConfig: WebsiteConfig = {
  "theme": {
    "primaryColor": "#1E4E8C",
    "primaryDarkColor": "#13325B",
    "accentGoldColor": "#B49A58",
    "backgroundColor": "#FFFFFF",
    "creamColor": "#F4F7FB",
    "textColor": "#0F172A",
    "saleColor": "#991B1B"
  },
  "announcement": {
    "enabled": true,
    "leftBenefit": "PENGHANTARAN SELURUH MALAYSIA",
    "centerText": "PENGILANG & PEMASAR PRODUK JAHITAN TEKSTIL",
    "highlightCode": "",
    "url": "",
    "rightGuarantee": "JAMINAN HARGA TERENDAH",
    "bgColor": "#13325B",
    "textColor": "#FFFFFF"
  },
  "megaMenu": {
    "enabled": true,
    "columns": [
      {
        "id": "col-1",
        "title": "Tilam Toto & Kekabu",
        "titleBm": "Tilam Toto & Kekabu",
        "items": [
          {
            "id": "m-1",
            "label": "Tilam Toto Asian Fibre (Paling Lariss)",
            "labelBm": "Tilam Toto Asian Fibre (Paling Lariss)",
            "href": "/products/tilam-toto-asian-polyester-fibre"
          },
          {
            "id": "m-2",
            "label": "Tilam Kekabu Asli Tradisi",
            "labelBm": "Tilam Kekabu Asli Tradisi",
            "href": "/products/tilam-kekabu-asli-tradisi"
          },
          {
            "id": "m-3",
            "label": "Tilam Lipat 3 Berzip Boleh Cuci",
            "labelBm": "Tilam Lipat 3 Berzip Boleh Cuci",
            "href": "/products/tilam-lipat-3-berzip"
          },
          {
            "id": "m-4",
            "label": "Tilam Single 3 Kaki Asrama",
            "labelBm": "Tilam Single 3 Kaki Asrama",
            "href": "/products/tilam-single-3-kaki-asrama"
          }
        ]
      },
      {
        "id": "col-2",
        "title": "Bantal, Cadar & Bayi",
        "titleBm": "Bantal, Cadar & Bayi",
        "items": [
          {
            "id": "m-5",
            "label": "Bantal Tidur Gebu Asian Fibre",
            "labelBm": "Bantal Tidur Gebu Asian Fibre",
            "href": "/products/bantal-tidur-gebu-asian-fibre"
          },
          {
            "id": "m-6",
            "label": "Bantal Peluk (Bolster) Gebu",
            "labelBm": "Bantal Peluk (Bolster) Gebu",
            "href": "/products/bantal-peluk-bolster-gebu"
          },
          {
            "id": "m-7",
            "label": "Set Comforter Tebal Quilting",
            "labelBm": "Set Comforter Tebal Quilting",
            "href": "/products/set-comforter-tebal-quilting"
          },
          {
            "id": "m-8",
            "label": "Selimut Patchwork Eksklusif",
            "labelBm": "Selimut Patchwork Eksklusif",
            "href": "/products/selimut-patchwork-eksklusif"
          },
          {
            "id": "m-9",
            "label": "Set Tilam Bayi Gebu (4-in-1)",
            "labelBm": "Set Tilam Bayi Gebu (4-in-1)",
            "href": "/products/set-tilam-bayi-gebu"
          },
          {
            "id": "m-10",
            "label": "Sarung Kusyen Sofa & Aidilfitri",
            "labelBm": "Sarung Kusyen Sofa & Aidilfitri",
            "href": "/products/set-sarung-kusyen-sofa-eksklusif"
          }
        ]
      },
      {
        "id": "col-3",
        "title": "Kilang, Borong & OEM",
        "titleBm": "Kilang, Borong & OEM",
        "items": [
          {
            "id": "m-11",
            "label": "Profil Syarikat & 4 Unit Kilang",
            "labelBm": "Profil Syarikat & 4 Unit Kilang",
            "href": "/profil"
          },
          {
            "id": "m-12",
            "label": "Pakej Borong Asrama (10 Set)",
            "labelBm": "Pakej Borong Asrama (10 Set)",
            "href": "/products/pakej-pukal-asrama-homestay"
          },
          {
            "id": "m-13",
            "label": "Jualan Gudang Tasek Gelugor",
            "labelBm": "Jualan Gudang Tasek Gelugor",
            "href": "/collections/borong-gudang"
          },
          {
            "id": "m-14",
            "label": "Tempahan OEM & Agensi Kerajaan",
            "labelBm": "Tempahan OEM & Agensi Kerajaan",
            "href": "/business"
          }
        ]
      }
    ],
    "promoCard": {
      "enabled": true,
      "badge": "PALING LARISS!!",
      "title": "Tilam Toto Asian Fibre",
      "description": "Empuk, tebal dan selesa terus dari kilang Tasek Gelugor.",
      "buttonText": "Beli Sekarang",
      "buttonUrl": "/products/tilam-toto-asian-polyester-fibre"
    }
  },
  "hero": {
    "slides": [
      {
        "id": "slide-1",
        "badge": "PALING LARISS!! ASIAN POLYESTER FIBRE",
        "title": "Tilam Toto Tebal & Empuk Terus Dari Kilang",
        "subtitle": "Isian Asian Polyester Fibre berkualiti tinggi, jahitan quilting kemas pelbagai corak floral & moden. Selesa, empuk, dan jimat terus dari pengeluar.",
        "ctaText": "Beli Tilam Toto Sekarang",
        "ctaLink": "/products/tilam-toto-asian-polyester-fibre",
        "secondaryCtaText": "Profil Kilang Kami",
        "secondaryCtaLink": "/profil",
        "imageUrl": "/images/hero/hero-tilam-toto-lifestyle.jpg",
        "isActive": true
      },
      {
        "id": "slide-2",
        "badge": "PENGILANG TEKSTIL BUMIPUTERA",
        "title": "Kualiti Jahitan, Kepuasan Terjamin",
        "subtitle": "Menjahit Kepercayaan, Menyulam Masa Depan. Operasi sistematik 4 unit: Unit Potong Kain, Unit Jahitan, Unit Bantal & Tilam, dan Stor Produk Siap.",
        "ctaText": "Lihat Operasi Kilang",
        "ctaLink": "/profil#tentang-kami",
        "secondaryCtaText": "Carta Organisasi",
        "secondaryCtaLink": "/profil#carta-organisasi",
        "imageUrl": "/images/hero/hero-kilang-tekstil.jpg",
        "isActive": true
      },
      {
        "id": "slide-3",
        "badge": "100% KEKABU ASLI TRADISI",
        "title": "Tilam & Bantal Kekabu Asli Buatan Tempatan",
        "subtitle": "Kelembutan semulajadi yang sejuk, padat dan selesa dengan teknik jahitan butang tufting tradisi yang tahan lasak turun-temurun.",
        "ctaText": "Koleksi Kekabu Asli",
        "ctaLink": "/products/tilam-kekabu-asli-tradisi",
        "secondaryCtaText": "Tempah Sekarang",
        "secondaryCtaLink": "/collections/tilam-kekabu",
        "imageUrl": "/images/products/tilam-kekabu-asli.jpg",
        "isActive": true
      },
      {
        "id": "slide-4",
        "badge": "HARGA BORONG GUDANG",
        "title": "Jualan Gudang & Tempahan Pukal Asrama / Homestay",
        "subtitle": "Pakej lengkap tilam bujang asrama, tilam lipat, bantal tidur gebu dan cadar berzip untuk asrama sekolah, tahfiz, homestay dan kemudahan kontraktor.",
        "ctaText": "Pakej Jualan Gudang",
        "ctaLink": "/collections/borong-gudang",
        "secondaryCtaText": "WhatsApp 019-478 6991",
        "secondaryCtaLink": "https://wa.me/60194786991",
        "imageUrl": "/images/promosi/PROMOSI 2.png",
        "isActive": true
      }
    ]
  },
  "reassurance": {
    "items": [
      {
        "id": "reassure-1",
        "icon": "sparkles",
        "title": "Kualiti Terjamin",
        "subtitle": "Kawalan mutu ketat, jahitan kemas dan isian Asian Polyester Fibre & Kekabu berkualiti."
      },
      {
        "id": "reassure-2",
        "icon": "trial",
        "title": "Pengeluaran Cekap",
        "subtitle": "Operasi teratur merangkumi Unit Potong Kain, Unit Jahitan & Unit Bantal Tilam."
      },
      {
        "id": "reassure-3",
        "icon": "shield",
        "title": "Harga Berpatutan",
        "subtitle": "Harga terus dari kilang Tasek Gelugor tanpa orang tengah untuk penjimatan maksimum."
      },
      {
        "id": "reassure-4",
        "icon": "truck",
        "title": "Komitmen Pelanggan",
        "subtitle": "Penghantaran lori terus Semenanjung, perkhidmatan mesra dan jaminan kepuasan."
      }
    ]
  },
  "promotionsBanner": {
    "enabled": true,
    "badge": "PROMOSI JUALAN GUDANG",
    "headline": "Dapatkan Tilam Toto & Bantal Gebu Terus Dari Kilang",
    "description": "Nikmati harga kilang istimewa dan baucar diskaun KAMAAR10 untuk pesanan dalam talian minggu ini.",
    "couponCode": "KAMAAR10",
    "imageUrl": "/images/products/tilam-toto-queen.jpg",
    "ctaText": "Beli Sekarang",
    "ctaLink": "/collections/tilam-toto"
  },
  "storySection": {
    "badge": "TUNAS SINAR JAYA ENTERPRISE",
    "headline": "Mengilang & Memasar Produk Jahitan Tekstil Berkualiti",
    "paragraph1": "TUNAS SINAR JAYA ENTERPRISE merupakan sebuah syarikat tempatan yang terlibat dalam pengilangan dan pemasaran produk jahitan tekstil di Tasek Gelugor, Pulau Pinang. Berbekalkan pengalaman, tenaga kerja mahir serta komitmen terhadap kualiti, kami menghasilkan Tilam Toto, tilam kekabu, tilam lipat, bantal gebu, comforter dan cadar pada harga paling kompetitif.",
    "paragraph2": "Kami memberi penekanan kepada penggunaan bahan berkualiti, proses pengeluaran yang sistematik serta kawalan mutu yang ketat bagi memastikan setiap produk mencapai standard yang tinggi. Moto kami: \"Kualiti Jahitan, Kepuasan Terjamin\" — Menjahit Kepercayaan, Menyulam Masa Depan.",
    "imageUrl": "/images/company/kilang-tekstil-jahitan.jpg",
    "signatureTitle": "Hazizi Md Rashid",
    "signatureSub": "Pengurus Operasi, Tunas Sinar Jaya Enterprise"
  },
  "socialAndContact": {
    "whatsappNumber": "+60194786991",
    "phoneDisplay": "019-478 6991",
    "emailDisplay": "tunassinar@gmail.com",
    "addressDisplay": "7878B Jalan Permatang Berangan, 13300 Tasek Gelugor SPU, Pulau Pinang",
    "instagramUrl": "",
    "tiktokUrl": "https://www.tiktok.com/@kamaar_shop",
    "facebookUrl": "https://www.facebook.com"
  },
  "companyProfile": {
    "hero": {
      "badge": "Pengeluar Tekstil Bumiputera",
      "companyName": "TUNAS SINAR JAYA ENTERPRISE",
      "brandTitle": "KAMAAR BEDDINGS",
      "slogan": "“Keselesaan anda keutamaan kami”",
      "description": "Tunas Sinar Jaya Enterprise komited dalam menghasilkan produk jahitan tekstil berkualiti tinggi dengan harga berpatutan bagi memenuhi keperluan dan kepuasan pelanggan di seluruh Malaysia.",
      "featuredBadge": "Paling Lariss!!",
      "featuredTitle": "Tilam Toto Asian Polyester Fibre",
      "featuredSubtitle": "Random Design corak floral & geometri terus dari lantai pengeluaran kilang.",
      "featuredImageUrl": "/images/hero/hero-tilam-toto-lifestyle.jpg"
    },
    "about": {
      "badge": "Pengenalan Korporat",
      "title": "Tentang Kami",
      "paragraphs": [
        "TUNAS SINAR JAYA ENTERPRISE merupakan sebuah syarikat tempatan yang terlibat secara komited dalam pengilangan dan pemasaran produk jahitan tekstil.",
        "Berbekalkan pengalaman yang kukuh, tenaga kerja mahir tempatan serta komitmen mendalam terhadap kualiti, syarikat kami sentiasa berusaha menghasilkan produk bilik tidur dan tilam yang memenuhi kehendak pelanggan pada harga yang amat kompetitif.",
        "Kami memberi penekanan tegas kepada penggunaan bahan berkualiti (termasuk isian Asian Polyester Fibre), proses pengeluaran yang sistematik serta kawalan mutu (QC) yang ketat bagi memastikan setiap produk mencapai standard piawaian tertinggi.",
        "Syarikat komited untuk terus menjadi pengeluar tekstil Bumiputera yang dipercayai serta mampu bersaing di peringkat pasaran tempatan dan serantau."
      ],
      "motoBadge": "Moto Syarikat",
      "motoText": "“Kualiti Terjamin, Kepuasan Pelanggan Keutamaan.”"
    },
    "facility": {
      "badge": "Premis & Operasi Kilang",
      "title": "Premis Utama di 7878B Jalan Permatang Berangan, Tasek Gelugor",
      "description": "Kompleks pembuatan dan stor seluas ribuan kaki persegi yang menempatkan barisan mesin potong, unit jahitan dan stor produk siap.",
      "imageUrl": "/images/company/hadapan-kilang.jpg"
    },
    "visionMission": {
      "badge": "Hala Tuju Syarikat",
      "title": "Misi & Visi Kami",
      "missionTitle": "MISI SYARIKAT",
      "missionText": "“Menjadi syarikat pengilangan tekstil yang unggul, inovatif dan diyakini dalam menghasilkan produk berkualiti tinggi.”",
      "visionTitle": "VISI KAMI (5 TERAS UTAMA)",
      "visionPoints": [
        "Menghasilkan produk tekstil yang berkualiti tinggi.",
        "Memberikan perkhidmatan terbaik kepada pelanggan.",
        "Mengamalkan proses pengeluaran yang cekap dan sistematik.",
        "Menawarkan harga yang kompetitif.",
        "Menjalinkan hubungan perniagaan yang kukuh bersama pelanggan dan rakan strategik."
      ],
      "eventBadge": "Komuniti & Sambutan Hangat",
      "eventTitle": "Program Jualan Gudang Terus ke Pengguna",
      "eventSubtitle": "Sambutan luar biasa masyarakat setempat yang memilih tilam toto, cadar dan bantal KAMAAR dengan harga borong.",
      "eventImageUrl": "/images/company/misi-visi-jualan-gudang.jpg"
    }
  },
  "appearance": {
    "enableEntranceAnimations": true,
    "enableFloatingBadges": true,
    "cardBorderRadius": "rounded-2xl"
  }
}

export const initialPaymentSettings: PaymentSettings = {
  "expressCheckoutEnabled": true,
  "enableGooglePay": false,
  "enableApplePay": false,
  "defaultMethodId": "pay-fpx",
  "methods": [
    {
      "id": "pay-fpx",
      "name": "FPX Online Banking",
      "subtitle": "Maybank2u, CIMB Clicks, Public Bank, RHB, Hong Leong & semua bank Malaysia",
      "providerType": "chip",
      "enabled": true,
      "isDefault": true,
      "testMode": false,
      "sortOrder": 1,
      "badgeIcons": [
        "fpx"
      ],
      "description": "Bayar terus melalui perbankan internet rasmi Malaysia (FPX) menerusi gerbang selamat CHIP In Asia. Selamat, pantas dan disahkan serta-merta.",
      "instructions": "Pilih bank pilihan anda di bawah untuk log masuk ke perbankan internet dan sahkan bayaran."
    },
    {
      "id": "pay-tng",
      "name": "Touch 'n Go eWallet (TNG)",
      "subtitle": "Imbas kod QR TNG eWallet atau bayar terus melalui aplikasi Touch 'n Go",
      "providerType": "chip",
      "enabled": true,
      "isDefault": false,
      "testMode": false,
      "sortOrder": 2,
      "badgeIcons": [
        "tng"
      ],
      "description": "Pembayaran mudah melalui aplikasi Touch 'n Go eWallet menerusi gerbang CHIP In Asia terus ke akaun jualan Tunas Sinar Jaya Enterprise.",
      "instructions": "Buka aplikasi TNG eWallet anda dan imbas kod QR rasmi Tunas Sinar Jaya Enterprise / KAMAAR Beddings."
    }
  ]
}
