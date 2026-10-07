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
    "id": "prod-toto-asian-fibre",
    "name": "Tilam Toto Asian Polyester Fibre (Paling Lariss!!)",
    "slug": "tilam-toto-asian-polyester-fibre",
    "subtitle": "Paling Lariss!! Tebal, Gebu & Isian Asian Fibre Padat",
    "description": "Produk terlaris nombor satu keluaran Tunas Sinar Jaya Enterprise! Tilam toto tebal dan empuk dengan isian Asian Polyester Fibre bermutu tinggi. Jahitan quilting kemas yang mengunci fiber agar tidak berganjak atau bergumpal. Sesuai untuk tidur santai seisi keluarga di ruang tamu, tilam tambahan untuk tetamu, homestay, atau balik kampung.",
    "shortDescription": "Tilam toto paling laris keluaran kilang Tunas Sinar Jaya Enterprise. Tebal, gebu, corak menarik dan tahan lasak.",
    "categoryId": "cat-tilam-toto",
    "productType": "mattress",
    "material": "100% Asian Polyester Virgin Fibre & Fabrik Jahitan Berkualiti",
    "firmness": "Medium Soft",
    "firmnessScale": 4,
    "thicknessCm": 8,
    "warrantyYears": 1,
    "trialNights": 0,
    "features": [
      "Isian 100% Asian Polyester Fibre berkualiti tinggi & padat",
      "Jahitan quilting mesin industri kilang sendiri di Tasek Gelugor",
      "Corak menarik pelbagai pilihan (Random Floral Design & Geometrik)",
      "Empuk, gebu dan tidak mudah kempis",
      "Sesuai untuk seisi keluarga, homestay, dan tilam santai ruang tamu"
    ],
    "layers": [
      {
        "number": 1,
        "name": "Fabrik Cotton Bercorak",
        "description": "Kain sejuk lembut pelbagai corak floral yang ceria dan tahan lasak."
      },
      {
        "number": 2,
        "name": "Teras Isian Asian Polyester Fibre",
        "description": "Lapisan fiber mampat gebu berkualiti yang mengekalkan ketebalan dan keselesaan."
      }
    ],
    "specifications": {
      "Isian": "Asian Polyester Fibre Berkualiti",
      "Ketebalan": "Kira-kira 7cm - 10cm",
      "Corak": "Random Floral & Geometric Design",
      "Asal Kilang": "Tasek Gelugor, Pulau Pinang",
      "Pengeluar": "Tunas Sinar Jaya Enterprise"
    },
    "faq": [
      {
        "question": "Apakah maksud Random Design?",
        "answer": "Kilang kami menghasilkan pelbagai corak bunga moden dan geometri yang sentiasa diperbaharui mengikut stok fabrik terbaik semasa."
      },
      {
        "question": "Bolehkah tilam toto ini digulung untuk disimpan?",
        "answer": "Ya, tilam toto ini sangat fleksibel dan boleh digulung atau dilipat dengan mudah untuk disimpan dalam almari atau bonet kereta."
      }
    ],
    "status": "published",
    "isFeatured": true,
    "variants": [
      {
        "id": "var-toto-sgl",
        "productId": "prod-toto-asian-fibre",
        "sku": "TSJ-TOTO-SGL",
        "sizeName": "Single (100cm x 190cm)",
        "dimensions": "100cm x 190cm x 7cm",
        "priceSen": 5900,
        "compareAtPriceSen": 7900,
        "stockQuantity": 80,
        "leadTimeDays": 1,
        "isActive": true
      },
      {
        "id": "var-toto-qen",
        "productId": "prod-toto-asian-fibre",
        "sku": "TSJ-TOTO-QEN",
        "sizeName": "Queen (150cm x 190cm)",
        "dimensions": "150cm x 190cm x 8cm",
        "priceSen": 8900,
        "compareAtPriceSen": 11900,
        "stockQuantity": 60,
        "leadTimeDays": 1,
        "isActive": true
      },
      {
        "id": "var-toto-kng",
        "productId": "prod-toto-asian-fibre",
        "sku": "TSJ-TOTO-KNG",
        "sizeName": "King (180cm x 190cm)",
        "dimensions": "180cm x 190cm x 10cm",
        "priceSen": 11900,
        "compareAtPriceSen": 14900,
        "stockQuantity": 40,
        "leadTimeDays": 1,
        "isActive": true
      }
    ],
    "images": [
      {
        "id": "img-toto-1",
        "productId": "prod-toto-asian-fibre",
        "imageUrl": "/images/products/tilam-toto-queen.jpg",
        "altText": "Tilam Toto Asian Polyester Fibre Paling Lariss Tunas Sinar Jaya",
        "displayOrder": 1,
        "isPrimary": true
      },
      {
        "id": "img-toto-2",
        "productId": "prod-toto-asian-fibre",
        "imageUrl": "/images/hero/hero-tilam-toto-lifestyle.jpg",
        "altText": "Tilam Toto Ruang Tamu Kontemporari",
        "displayOrder": 2,
        "isPrimary": false
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-tilam-kekabu-asli",
    "name": "Tilam Kekabu Asli Tradisi (Jahitan Tufted Butang)",
    "slug": "tilam-kekabu-asli-tradisi",
    "subtitle": "100% Isian Kekabu Tulen • Sejuk, Padat & Tradisi",
    "description": "Tilam kekabu buatan tempatan dengan isian 100% kekabu asli terpilih. Dijahit secara manual dengan teknik tufted berbutang khas untuk memastikan kekabu mampat sekata dan memberi sokongan ortopedik semulajadi yang sangat sejuk untuk cuaca tropika Malaysia.",
    "shortDescription": "Tilam kekabu asli tradisi buatan kilang Tunas Sinar Jaya. Sejuk, empuk dan padat.",
    "categoryId": "cat-tilam-kekabu",
    "productType": "mattress",
    "material": "100% Kekabu Asli Semulajadi & Fabrik Cotton Tebal",
    "firmness": "Medium Firm",
    "firmnessScale": 6,
    "thicknessCm": 10,
    "warrantyYears": 2,
    "trialNights": 0,
    "features": [
      "100% Kekabu asli gred A bebas habuk & bahan kimia",
      "Sangat sejuk dan tidak menyerap haba panas bilik",
      "Jahitan butang tufted kemas untuk ketahanan bentuk",
      "Boleh dijemur di bawah matahari untuk kesegaran berpanjangan",
      "Kualiti pertukangan tekstil Bumiputera warisan turun-temurun"
    ],
    "layers": [],
    "specifications": {
      "Isian": "100% Kekabu Asli Tulen",
      "Jahitan": "Tufting Butang Kemas",
      "Fabrik": "Kapas Tahan Lasak",
      "Pengeluar": "Tunas Sinar Jaya Enterprise (Tasek Gelugor)"
    },
    "faq": [
      {
        "question": "Bagaimanakah cara penjagaan tilam kekabu?",
        "answer": "Jemur di bawah cahaya matahari sekurang-kurangnya sekali sebulan untuk memastikan kekabu sentiasa mekar, gebu dan bebas lembapan."
      }
    ],
    "status": "published",
    "isFeatured": true,
    "variants": [
      {
        "id": "var-kekabu-sgl",
        "productId": "prod-tilam-kekabu-asli",
        "sku": "TSJ-KB-SGL",
        "sizeName": "Single (90cm x 190cm)",
        "dimensions": "90cm x 190cm x 10cm",
        "priceSen": 9500,
        "compareAtPriceSen": 13500,
        "stockQuantity": 30,
        "leadTimeDays": 2,
        "isActive": true
      },
      {
        "id": "var-kekabu-qen",
        "productId": "prod-tilam-kekabu-asli",
        "sku": "TSJ-KB-QEN",
        "sizeName": "Queen (150cm x 190cm)",
        "dimensions": "150cm x 190cm x 12cm",
        "priceSen": 15900,
        "compareAtPriceSen": 19900,
        "stockQuantity": 25,
        "leadTimeDays": 2,
        "isActive": true
      }
    ],
    "images": [
      {
        "id": "img-kb-1",
        "productId": "prod-tilam-kekabu-asli",
        "imageUrl": "/images/products/tilam-kekabu-asli.jpg",
        "altText": "Tilam Kekabu Asli Tradisi Tunas Sinar Jaya",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-tilam-lipat-3",
    "name": "Tilam Lipat 3 Berzip Fabrik Tahan Lasak",
    "slug": "tilam-lipat-3-berzip",
    "subtitle": "Sarung Berzip Boleh Buka Cuci • Jimat Ruang & Praktikal",
    "description": "Tilam lipat 3 bahagian yang menjimatkan ruang penyimpanan. Isian busa/fiber mampat yang tahan lasak dan tidak mudah penyek. Sarung berzip mudah ditanggalkan untuk dicuci. Pilihan terbaik untuk rumah sewa, asrama, dan tilam tetamu.",
    "shortDescription": "Tilam lipat 3 bahagian berzip yang boleh dicuci sarungnya. Jimat ruang dan selesa.",
    "categoryId": "cat-tilam-lipat",
    "productType": "mattress",
    "material": "Fiber / Busa Mampat Berketumpatan Tinggi",
    "firmness": "Medium Firm",
    "firmnessScale": 6,
    "thicknessCm": 7,
    "warrantyYears": 1,
    "trialNights": 0,
    "features": [
      "Rekaan 3 lipatan mudah simpan dalam almari atau sudut bilik",
      "Sarung kain tebal dilengkapi zip penuh untuk mudah dicuci",
      "Isian mampat yang menyokong tulang belakang dengan baik",
      "Jahitan piping kemas di Unit Jahitan Tunas Sinar Jaya"
    ],
    "layers": [],
    "specifications": {
      "Jenis": "Tilam Lipat 3 Bahagian",
      "Saiz Buka": "Single (90cm x 190cm)",
      "Sarung": "Fabrik Berzip Boleh Dicuci",
      "Pengeluar": "Tunas Sinar Jaya Enterprise"
    },
    "faq": [],
    "status": "published",
    "isFeatured": true,
    "variants": [
      {
        "id": "var-lipat-2in",
        "productId": "prod-tilam-lipat-3",
        "sku": "TSJ-LIPAT-2IN",
        "sizeName": "Single 2 Inci Tebal",
        "dimensions": "90cm x 190cm x 5cm",
        "priceSen": 6900,
        "compareAtPriceSen": 8900,
        "stockQuantity": 40,
        "leadTimeDays": 1,
        "isActive": true
      },
      {
        "id": "var-lipat-3in",
        "productId": "prod-tilam-lipat-3",
        "sku": "TSJ-LIPAT-3IN",
        "sizeName": "Single 3 Inci Extra Tebal",
        "dimensions": "90cm x 190cm x 8cm",
        "priceSen": 8900,
        "compareAtPriceSen": 11000,
        "stockQuantity": 35,
        "leadTimeDays": 1,
        "isActive": true
      }
    ],
    "images": [
      {
        "id": "img-lipat-1",
        "productId": "prod-tilam-lipat-3",
        "imageUrl": "/images/products/tilam-lipat-bujang.jpg",
        "altText": "Tilam Lipat 3 Berzip Tunas Sinar Jaya",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-tilam-single-asrama",
    "name": "Tilam Single 3 Kaki Asrama & Homestay (Heavy Duty)",
    "slug": "tilam-single-3-kaki-asrama",
    "subtitle": "Pilihan Utama Asrama Sekolah, Pusat Tahfiz & Homestay Bajet",
    "description": "Tilam bujang saiz standard 3 kaki x 6 kaki keluaran Unit Bantal & Tilam Tunas Sinar Jaya. Jahitan tepi tebal dan fabrik berkualiti tinggi yang tahan penggunaan harian lasak. Sesuai untuk asrama sekolah harian, universiti, maahad tahfiz, dan rumah sewa.",
    "shortDescription": "Tilam bujang 3 kaki heavy duty untuk asrama, tahfiz dan homestay. Tahan kemek.",
    "categoryId": "cat-tilam-lipat",
    "productType": "mattress",
    "material": "Rebonded Padat & Asian Polyester Fibre",
    "firmness": "Firm",
    "firmnessScale": 7,
    "thicknessCm": 10,
    "warrantyYears": 2,
    "trialNights": 0,
    "features": [
      "Ketumpatan tinggi tidak mudah melendut atau kemek",
      "Fabrik jacquard/damask tahan geseran dan lasak",
      "Jahitan tepi piping bertetulang untuk ketahanan bertahun",
      "Saiz tepat untuk katil bujang asrama (Single 3x6 kaki)",
      "Harga kilang untuk belian individu mahupun pukal"
    ],
    "layers": [],
    "specifications": {
      "Saiz": "Single Standard (90cm x 190cm)",
      "Tinggi / Ketebalan": "4 Inci atau 5 Inci",
      "Sesuai Untuk": "Asrama, Homestay, Bilik Pekerja, Pusat Tahfiz",
      "Pengeluar": "Tunas Sinar Jaya Enterprise"
    },
    "faq": [],
    "status": "published",
    "isFeatured": true,
    "variants": [
      {
        "id": "var-asrama-4in",
        "productId": "prod-tilam-single-asrama",
        "sku": "TSJ-ASRAMA-4IN",
        "sizeName": "Single 4 Inci Standard",
        "dimensions": "90cm x 190cm x 10cm",
        "priceSen": 9900,
        "compareAtPriceSen": 13000,
        "stockQuantity": 50,
        "leadTimeDays": 2,
        "isActive": true
      },
      {
        "id": "var-asrama-5in",
        "productId": "prod-tilam-single-asrama",
        "sku": "TSJ-ASRAMA-5IN",
        "sizeName": "Single 5 Inci Extra Padat",
        "dimensions": "90cm x 190cm x 13cm",
        "priceSen": 12900,
        "compareAtPriceSen": 16900,
        "stockQuantity": 40,
        "leadTimeDays": 2,
        "isActive": true
      }
    ],
    "images": [
      {
        "id": "img-asrama-1",
        "productId": "prod-tilam-single-asrama",
        "imageUrl": "/images/products/tilam-lipat-bujang.jpg",
        "altText": "Tilam Single Asrama Tunas Sinar Jaya",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-bantal-gebu-asian",
    "name": "Bantal Tidur Gebu Asian Polyester Fibre",
    "slug": "bantal-tidur-gebu-asian-fibre",
    "subtitle": "Isian Fiber Anjal & Sejuk • Sokongan Leher Maksimum",
    "description": "Bantal tidur empuk dan anjal diisi terus di Unit Bantal & Tilam kilang kami. Menggunakan Asian Polyester Fibre bermutu tinggi yang gebu, tidak mudah berketul, dan memberikan sokongan leher yang selesa untuk tidur yang lena.",
    "shortDescription": "Bantal tidur gebu berkualiti tinggi dari Unit Bantal & Tilam KAMAAR. Lembut dan anjal.",
    "categoryId": "cat-bantal",
    "productType": "pillow",
    "material": "100% Asian Polyester Virgin Fibre",
    "firmness": "Medium Soft",
    "firmnessScale": 4,
    "warrantyYears": 1,
    "trialNights": 0,
    "features": [
      "Isian Asian Polyester Virgin Fibre gred A yang gebu & anjal",
      "Kain sarung kapas mikrofiber yang sejuk dan lembut",
      "Boleh dibasuh dan cepat kering",
      "Hypoallergenic dan bebas habuk fabrik",
      "Harga jimat terus dari kilang"
    ],
    "layers": [],
    "specifications": {
      "Saiz": "Standard Dewasa (48cm x 74cm)",
      "Isian": "Asian Polyester Fibre Gred A",
      "Pengeluar": "Tunas Sinar Jaya Enterprise"
    },
    "faq": [],
    "status": "published",
    "isFeatured": true,
    "variants": [
      {
        "id": "var-bantal-2pc",
        "productId": "prod-bantal-gebu-asian",
        "sku": "TSJ-BANTAL-2PC",
        "sizeName": "Pakej Kombo 2 Biji",
        "dimensions": "48cm x 74cm",
        "priceSen": 3200,
        "compareAtPriceSen": 5000,
        "stockQuantity": 100,
        "leadTimeDays": 1,
        "isActive": true
      },
      {
        "id": "var-bantal-4pc",
        "productId": "prod-bantal-gebu-asian",
        "sku": "TSJ-BANTAL-4PC",
        "sizeName": "Pakej Keluarga 4 Biji (Super Jimat)",
        "dimensions": "48cm x 74cm",
        "priceSen": 5900,
        "compareAtPriceSen": 10000,
        "stockQuantity": 80,
        "leadTimeDays": 1,
        "isActive": true
      }
    ],
    "images": [
      {
        "id": "img-bantal-1",
        "productId": "prod-bantal-gebu-asian",
        "imageUrl": "/images/products/bantal-gebu-asian-fibre.jpg",
        "altText": "Bantal Tidur Gebu Asian Polyester Fibre",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-bantal-peluk-gebu",
    "name": "Bantal Peluk (Bolster) Gebu Jahitan Kemas",
    "slug": "bantal-peluk-bolster-gebu",
    "subtitle": "Panjang & Gemuk • Isian Padat Tidak Mudah Leper",
    "description": "Bantal peluk panjang dengan isian fiber padat gebu. Jahitan kemas dan fabrik lembut yang memberikan pelukan empuk setiap malam untuk tidur yang lebih selesa.",
    "shortDescription": "Bantal peluk gebu panjang keluaran kilang KAMAAR. Isian padat dan sedap dipeluk.",
    "categoryId": "cat-bantal",
    "productType": "pillow",
    "material": "Asian Polyester Fibre Padat",
    "firmness": "Medium Soft",
    "firmnessScale": 4,
    "warrantyYears": 1,
    "trialNights": 0,
    "features": [
      "Isian padat dan tidak mudah penyek bila dipeluk",
      "Jahitan piping keliling yang kukuh",
      "Saiz panjang standard muat semua sarung bantal peluk pasaran"
    ],
    "layers": [],
    "specifications": {
      "Saiz": "Standard Dewasa (22cm x 92cm)",
      "Berat": "Kira-kira 950g",
      "Pengeluar": "Tunas Sinar Jaya Enterprise"
    },
    "faq": [],
    "status": "published",
    "isFeatured": true,
    "variants": [
      {
        "id": "var-peluk-1pc",
        "productId": "prod-bantal-peluk-gebu",
        "sku": "TSJ-PELUK-1PC",
        "sizeName": "1 Unit Bantal Peluk",
        "dimensions": "22cm x 92cm",
        "priceSen": 2400,
        "compareAtPriceSen": 3500,
        "stockQuantity": 80,
        "leadTimeDays": 1,
        "isActive": true
      },
      {
        "id": "var-peluk-2pc",
        "productId": "prod-bantal-peluk-gebu",
        "sku": "TSJ-PELUK-2PC",
        "sizeName": "Kombo 2 Unit Bantal Peluk",
        "dimensions": "22cm x 92cm",
        "priceSen": 4500,
        "compareAtPriceSen": 7000,
        "stockQuantity": 50,
        "leadTimeDays": 1,
        "isActive": true
      }
    ],
    "images": [
      {
        "id": "img-peluk-1",
        "productId": "prod-bantal-peluk-gebu",
        "imageUrl": "/images/products/bantal-peluk-roll-pack.jpg",
        "altText": "Bantal Peluk Gebu Tunas Sinar Jaya",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-comforter-tebal-quilting",
    "name": "Set Comforter Tebal Quilting Corak Menarik",
    "slug": "set-comforter-tebal-quilting",
    "subtitle": "Jahitan Quilting Kilang Sendiri • Lembut & Sejuk Dipakai",
    "description": "Comforter tebal dijahit dengan mesin quilting khas Unit Jahitan Tunas Sinar Jaya. Fabrik mikrofiber sejuk dengan isian fiber lembut dan kemas. Pilihan pelbagai corak menarik untuk menceriakan bilik tidur anda.",
    "shortDescription": "Set comforter tebal jahitan quilting kilang sendiri. Lembut, sejuk dan tahan basuh.",
    "categoryId": "cat-cadang-comforter",
    "productType": "bedding",
    "material": "Mikrofiber Sejuk & Isian Fiber Quilting",
    "warrantyYears": 1,
    "trialNights": 0,
    "features": [
      "Jahitan quilting kemas mengelakkan fiber bergumpal",
      "Kain sejuk lembut, tidak berbulu selepas dibasuh",
      "Pakej lengkap comforter tebal bersama 2 sarung bantal"
    ],
    "layers": [],
    "specifications": {
      "Kandungan Set": "1 Comforter Tebal + 2 Sarung Bantal",
      "Material": "Mikrofiber Lembut Berquilting",
      "Pengeluar": "Tunas Sinar Jaya Enterprise"
    },
    "faq": [],
    "status": "published",
    "isFeatured": true,
    "variants": [
      {
        "id": "var-comf-queen",
        "productId": "prod-comforter-tebal-quilting",
        "sku": "TSJ-COMF-QEN",
        "sizeName": "Queen (200cm x 230cm)",
        "dimensions": "200cm x 230cm",
        "priceSen": 7900,
        "compareAtPriceSen": 11000,
        "stockQuantity": 40,
        "leadTimeDays": 1,
        "isActive": true
      },
      {
        "id": "var-comf-king",
        "productId": "prod-comforter-tebal-quilting",
        "sku": "TSJ-COMF-KNG",
        "sizeName": "King (220cm x 240cm)",
        "dimensions": "220cm x 240cm",
        "priceSen": 9900,
        "compareAtPriceSen": 13900,
        "stockQuantity": 30,
        "leadTimeDays": 1,
        "isActive": true
      }
    ],
    "images": [
      {
        "id": "img-comf-1",
        "productId": "prod-comforter-tebal-quilting",
        "imageUrl": "/images/hero/hero-tilam-toto-lifestyle.jpg",
        "altText": "Set Comforter Quilting KAMAAR",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-selimut-patchwork",
    "name": "Selimut Patchwork Eksklusif Berquilting",
    "slug": "selimut-patchwork-eksklusif",
    "subtitle": "Cantuman Corak Klasik & Moden • Sejuk & Lembut",
    "description": "Selimut patchwork istimewa hasil seni jahitan cantuman fabrik berkualiti Unit Jahitan Tunas Sinar Jaya. Setiap helaian diquilting rapi dengan isian fiber nipis yang sejuk dan menyelesakan, sesuai untuk cuaca berhawa dingin mahupun kipas biasa.",
    "shortDescription": "Selimut patchwork berquilting kemas keluaran Tunas Sinar Jaya. Sejuk dan bergaya.",
    "categoryId": "cat-selimut-patchwork",
    "productType": "bedding",
    "material": "Kapas Mikrofiber Cantuman & Fiber Quilting",
    "warrantyYears": 1,
    "trialNights": 0,
    "features": [
      "Jahitan patchwork seni kemas dan teliti",
      "Lapisan berquilting yang tidak panas dipakai",
      "Kain tidak berbulu dan warna tidak luntur",
      "Mudah dibasuh dalam mesin basuh"
    ],
    "layers": [],
    "specifications": {
      "Saiz": "Queen / King Standard",
      "Teknik": "Machine Patchwork Quilting",
      "Pengeluar": "Tunas Sinar Jaya Enterprise"
    },
    "faq": [],
    "status": "published",
    "isFeatured": true,
    "variants": [
      {
        "id": "var-patch-qen",
        "productId": "prod-selimut-patchwork",
        "sku": "TSJ-PATCH-QEN",
        "sizeName": "Queen (200cm x 230cm)",
        "dimensions": "200cm x 230cm",
        "priceSen": 6900,
        "compareAtPriceSen": 9500,
        "stockQuantity": 35,
        "leadTimeDays": 1,
        "isActive": true
      }
    ],
    "images": [
      {
        "id": "img-patch-1",
        "productId": "prod-selimut-patchwork",
        "imageUrl": "/images/products/selimut-patchwork.jpg",
        "altText": "Selimut Patchwork Eksklusif KAMAAR Beddings",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-set-bayi-gebu",
    "name": "Set Tilam Bayi Gebu (Tilam + Bantal Lekuk + 2 Bantal Peluk)",
    "slug": "set-tilam-bayi-gebu",
    "subtitle": "Pakej Lengkap Si Manja • Lembut, Selamat & Hypoallergenic",
    "description": "Set tilam bayi comel lengkap dengan tilam empuk berquilting lembut, bantal lekuk kepala bayi ergonomik, serta dua biji bantal peluk mini bertali comel. Menggunakan fabrik kapas lembut yang selamat untuk kulit bayi yang sensitif.",
    "shortDescription": "Set tilam bayi lengkap buatan kilang KAMAAR. Lembut, sejuk dan selamat untuk si manja.",
    "categoryId": "cat-set-bayi",
    "productType": "bedding",
    "material": "100% Kapas Lembut & Isian Fiber Bayi Hypoallergenic",
    "warrantyYears": 1,
    "trialNights": 0,
    "features": [
      "Pakej 4 Dalam 1: 1 Tilam + 1 Bantal Lekuk + 2 Bantal Peluk Mini",
      "Fabrik kapas lembut tidak panas dan tidak memerangkap haba",
      "Bantal lekuk membantu bentuk kepala bayi yang cantik",
      "Mudah dicuci dan cepat kering",
      "Pilihan hadiah terbaik untuk kelahiran bayi (Newborn Gift)"
    ],
    "layers": [],
    "specifications": {
      "Kandungan": "1 Tilam (60x90cm) + 1 Bantal Lekuk + 2 Bolster",
      "Material": "Kapas Halus Hypoallergenic",
      "Pengeluar": "Tunas Sinar Jaya Enterprise"
    },
    "faq": [],
    "status": "published",
    "isFeatured": true,
    "variants": [
      {
        "id": "var-bayi-set",
        "productId": "prod-set-bayi-gebu",
        "sku": "TSJ-BAYI-SET",
        "sizeName": "Set Lengkap 4-in-1",
        "dimensions": "Tilam 60cm x 90cm",
        "priceSen": 5500,
        "compareAtPriceSen": 7900,
        "stockQuantity": 40,
        "leadTimeDays": 1,
        "isActive": true
      }
    ],
    "images": [
      {
        "id": "img-bayi-1",
        "productId": "prod-set-bayi-gebu",
        "imageUrl": "/images/products/set-tilam-bayi.jpg",
        "altText": "Set Tilam Bayi Gebu Tunas Sinar Jaya",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-kusyen-sofa-eksklusif",
    "name": "Set Sarung Kusyen Sofa Eksklusif (Termasuk Corak Aidilfitri)",
    "slug": "set-sarung-kusyen-sofa-eksklusif",
    "subtitle": "Fabrik Tebal Berkilat • Piping Tepi & Zip Sorok Tahan Karat",
    "description": "Set sarung kusyen sofa ruang tamu dengan rekaan eksklusif keluaran Unit Jahitan kilang kami. Menampilkan pelbagai pilihan corak songket tenun, geometrik moden, dan rekaan khas Aidilfitri untuk menyerlahkan keanggunan ruang tamu anda.",
    "shortDescription": "Sarung kusyen sofa eksklusif jahitan kilang. Fabrik berkualiti tinggi pelbagai corak mewah.",
    "categoryId": "cat-kusyen-sofa",
    "productType": "bedding",
    "material": "Jacquard Songket & Baldu Mikrofiber",
    "warrantyYears": 1,
    "trialNights": 0,
    "features": [
      "Jahitan piping keliling tebal dan kemas",
      "Zip sorok (invisible zipper) tahan karat",
      "Fabrik mewah tidak luntur dan tahan basuhan mesin",
      "Sesuai untuk semua kusyen sofa standard (45cm x 45cm)"
    ],
    "layers": [],
    "specifications": {
      "Saiz": "Standard Kusyen (45cm x 45cm)",
      "Pakej": "Pilihan 5 Keping Sedondon",
      "Pengeluar": "Tunas Sinar Jaya Enterprise"
    },
    "faq": [],
    "status": "published",
    "isFeatured": true,
    "variants": [
      {
        "id": "var-kusyen-5pc",
        "productId": "prod-kusyen-sofa-eksklusif",
        "sku": "TSJ-KSYN-5PC",
        "sizeName": "Set Kombo 5 Keping Sedondon",
        "dimensions": "45cm x 45cm",
        "priceSen": 4900,
        "compareAtPriceSen": 7500,
        "stockQuantity": 50,
        "leadTimeDays": 1,
        "isActive": true
      }
    ],
    "images": [
      {
        "id": "img-kusyen-1",
        "productId": "prod-kusyen-sofa-eksklusif",
        "imageUrl": "/images/products/kusyen-sofa-eksklusif.jpg",
        "altText": "Sarung Kusyen Sofa Eksklusif KAMAAR",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-sarung-toto-berzip",
    "name": "Cadar & Sarung Tilam Toto Berzip Pelbagai Corak",
    "slug": "cadar-sarung-tilam-toto-berzip",
    "subtitle": "Zip Penuh Tahan Karat • Kain Sejuk Tidak Luntur",
    "description": "Sarung gantian berzip penuh untuk tilam toto anda. Senang dibuka untuk dibasuh, kain tebal tidak mudah koyak dan corak tidak luntur.",
    "shortDescription": "Sarung ganti berzip penuh untuk tilam toto. Senang buka basuh dan kain berkualiti.",
    "categoryId": "cat-cadang-comforter",
    "productType": "bedding",
    "material": "Kapas Mikrofiber Sejuk Berzip",
    "warrantyYears": 1,
    "trialNights": 0,
    "features": [
      "Zip panjang memudahkan proses memasukkan dan mengeluarkan tilam toto",
      "Kain sejuk lembut yang selesa bila berbaring",
      "Corak moden dan floral bunga ceria"
    ],
    "layers": [],
    "specifications": {
      "Jenis": "Sarung Berzip Tilam Toto",
      "Pengeluar": "Tunas Sinar Jaya Enterprise"
    },
    "faq": [],
    "status": "published",
    "isFeatured": true,
    "variants": [
      {
        "id": "var-sarung-sgl",
        "productId": "prod-sarung-toto-berzip",
        "sku": "TSJ-SRG-SGL",
        "sizeName": "Single (90x190cm)",
        "dimensions": "90cm x 190cm",
        "priceSen": 2500,
        "compareAtPriceSen": 3500,
        "stockQuantity": 60,
        "leadTimeDays": 1,
        "isActive": true
      },
      {
        "id": "var-sarung-qen",
        "productId": "prod-sarung-toto-berzip",
        "sku": "TSJ-SRG-QEN",
        "sizeName": "Queen (150x190cm)",
        "dimensions": "150cm x 190cm",
        "priceSen": 3500,
        "compareAtPriceSen": 4500,
        "stockQuantity": 70,
        "leadTimeDays": 1,
        "isActive": true
      }
    ],
    "images": [
      {
        "id": "img-sarung-1",
        "productId": "prod-sarung-toto-berzip",
        "imageUrl": "/images/products/tilam-toto-queen.jpg",
        "altText": "Sarung Tilam Toto Berzip KAMAAR",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  },
  {
    "id": "prod-pakej-borong-10set",
    "name": "Pakej Tempahan Pukal Asrama & Homestay (Jualan Gudang)",
    "slug": "pakej-pukal-asrama-homestay",
    "subtitle": "Harga Borong Terus Kilang • Termasuk Tilam + Bantal Gebu",
    "description": "Pakej jualan gudang paling jimat untuk pengusaha asrama sekolah, tahfiz, homestay, atau kem latihan. Jimat sehingga ratusan ringgit bila membeli terus dari kilang pengeluar Tunas Sinar Jaya di Tasek Gelugor.",
    "shortDescription": "Pakej borong jualan gudang terus dari kilang untuk homestay dan asrama.",
    "categoryId": "cat-borong-gudang",
    "productType": "mattress",
    "material": "Tilam & Bantal Lengkap Terus Kilang",
    "warrantyYears": 1,
    "trialNights": 0,
    "features": [
      "Harga borong jimat gila terus dari kilang",
      "Termasuk pakej tilam bujang/toto dan bantal tidur gebu",
      "Boleh runding penghantaran lori terus ke lokasi anda",
      "Sokongan invois rasmi syarikat untuk tuntutan pentadbiran"
    ],
    "layers": [],
    "specifications": {
      "Pakej": "10 Set Lengkap (10 Tilam + 10 Bantal Gebu)",
      "Pengeluar": "Tunas Sinar Jaya Enterprise (Tasek Gelugor)",
      "Pesanan Khas": "WhatsApp 011-6444 7908"
    },
    "faq": [],
    "status": "published",
    "isFeatured": true,
    "variants": [
      {
        "id": "var-borong-10set",
        "productId": "prod-pakej-borong-10set",
        "sku": "TSJ-BORONG-10",
        "sizeName": "Pakej 10 Set Lengkap",
        "dimensions": "10 Tilam + 10 Bantal",
        "priceSen": 65000,
        "compareAtPriceSen": 85000,
        "stockQuantity": 20,
        "leadTimeDays": 3,
        "isActive": true
      },
      {
        "id": "var-borong-20set",
        "productId": "prod-pakej-borong-10set",
        "sku": "TSJ-BORONG-20",
        "sizeName": "Pakej 20 Set Lengkap (Super Jimat)",
        "dimensions": "20 Tilam + 20 Bantal",
        "priceSen": 120000,
        "compareAtPriceSen": 170000,
        "stockQuantity": 10,
        "leadTimeDays": 3,
        "isActive": true
      }
    ],
    "images": [
      {
        "id": "img-borong-1",
        "productId": "prod-pakej-borong-10set",
        "imageUrl": "/images/products/bantal-peluk-roll-pack.jpg",
        "altText": "Jualan Gudang Tekstil Tunas Sinar Jaya",
        "displayOrder": 1,
        "isPrimary": true
      }
    ],
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-10-07T00:00:00Z"
  }
]

export const initialCoupons: Coupon[] = [
  {
    "id": "coup-kamaar5",
    "code": "KAMAAR5",
    "description": "Baucar diskaun RM5 untuk pembelian tilam toto & bantal",
    "discountType": "fixed_amount",
    "discountValue": 500,
    "minSpendSen": 5000,
    "usageLimit": 1000,
    "usageCount": 15,
    "perCustomerLimit": 2,
    "startsAt": "2026-01-01T00:00:00Z",
    "endsAt": "2026-12-31T23:59:59Z",
    "isActive": true,
    "showOnHomepage": true,
    "featuredOrder": 1,
    "customTitle": "Diskaun Pelanggan Baharu RM5",
    "customBadge": "RM5 OFF",
    "customerRestriction": "all",
    "applicableCategory": "all"
  },
  {
    "id": "coup-kamaar10",
    "code": "KAMAAR10",
    "description": "Potongan RM10 untuk pesanan melebihi RM100",
    "discountType": "fixed_amount",
    "discountValue": 1000,
    "minSpendSen": 10000,
    "usageLimit": 500,
    "usageCount": 22,
    "perCustomerLimit": 1,
    "startsAt": "2026-01-01T00:00:00Z",
    "endsAt": "2026-12-31T23:59:59Z",
    "isActive": true,
    "showOnHomepage": true,
    "featuredOrder": 2,
    "customTitle": "Baucar Istimewa RM10",
    "customBadge": "RM10 OFF",
    "customerRestriction": "all",
    "applicableCategory": "all"
  },
  {
    "id": "coup-borong50",
    "code": "BORONGVIP",
    "description": "Diskaun borong khas RM50 untuk tempahan melebihi RM500",
    "discountType": "fixed_amount",
    "discountValue": 5000,
    "minSpendSen": 50000,
    "usageLimit": 200,
    "usageCount": 8,
    "perCustomerLimit": 1,
    "startsAt": "2026-01-01T00:00:00Z",
    "endsAt": "2026-12-31T23:59:59Z",
    "isActive": true,
    "showOnHomepage": true,
    "featuredOrder": 3,
    "customTitle": "Diskaun Borong Kilang RM50",
    "customBadge": "RM50 OFF",
    "customerRestriction": "all",
    "applicableCategory": "all"
  },
  {
    "id": "coup-freeship",
    "code": "FREESHIP",
    "description": "Penghantaran Percuma Semenanjung Malaysia",
    "discountType": "free_shipping",
    "discountValue": 0,
    "minSpendSen": 0,
    "usageLimit": 1000,
    "usageCount": 45,
    "perCustomerLimit": 3,
    "startsAt": "2026-01-01T00:00:00Z",
    "endsAt": "2026-12-31T23:59:59Z",
    "isActive": true,
    "showOnHomepage": true,
    "featuredOrder": 4,
    "customTitle": "Penghantaran Percuma",
    "customBadge": "FREE POSTAGE",
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
    "phone": "011-6444 7908",
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
    "imageUrl": "/images/hero/hero-tilam-toto-lifestyle.jpg",
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
    "imageUrl": "/images/products/tilam-kekabu-asli.jpg",
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
    "imageUrl": "/images/products/bantal-peluk-roll-pack.jpg",
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
  "contactPhone": "011-6444 7908",
  "whatsappNumber": "+601164447908",
  "address": "7878B Jalan Permatang Berangan, 13300 Tasek Gelugor SPU, Pulau Pinang",
  "announcementText": "Jualan Gudang Terus Dari Kilang • Penghantaran ke Seluruh Semenanjung Malaysia",
  "announcementUrl": "/collections/tilam-toto",
  "isAnnouncementActive": true,
  "announcementActive": true,
  "freeShippingThresholdSen": 20000,
  "peninsularShippingSen": 1500,
  "eastMalaysiaShippingSen": 4500,
  "warrantyDefaultYears": 1,
  "trialDefaultNights": 14
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
    "primaryColor": "#0D2818",
    "primaryDarkColor": "#081C10",
    "accentGoldColor": "#C5A880",
    "backgroundColor": "#FFFFFF",
    "creamColor": "#FAF8F5",
    "textColor": "#0F172A",
    "saleColor": "#991B1B"
  },
  "announcement": {
    "enabled": true,
    "leftBenefit": "Penghantaran Terus Semenanjung",
    "centerText": "Jualan Gudang Terus Dari Kilang Tasek Gelugor • Kod Baucar",
    "highlightCode": "KAMAAR10",
    "url": "/collections/tilam-toto",
    "rightGuarantee": "Kualiti Jahitan Terjamin",
    "bgColor": "#0D2818",
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
        "subtitle": "Pakej lengkap tilam bujang, bantal tidur gebu dan cadar berzip untuk asrama sekolah, tahfiz, homestay dan kemudahan kontraktor.",
        "ctaText": "Pakej Jualan Gudang",
        "ctaLink": "/collections/borong-gudang",
        "secondaryCtaText": "WhatsApp 011-6444 7908",
        "secondaryCtaLink": "https://wa.me/601164447908",
        "imageUrl": "/images/products/bantal-peluk-roll-pack.jpg",
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
      "providerType": "fpx",
      "enabled": true,
      "isDefault": true,
      "testMode": false,
      "sortOrder": 1,
      "badgeIcons": [
        "fpx"
      ],
      "description": "Bayar terus melalui perbankan internet rasmi Malaysia (FPX). Selamat, pantas dan disahkan serta-merta.",
      "instructions": "Pilih bank pilihan anda di bawah untuk log masuk ke perbankan internet dan sahkan bayaran."
    },
    {
      "id": "pay-tng",
      "name": "Touch 'n Go eWallet (TNG)",
      "subtitle": "Imbas kod QR TNG eWallet atau bayar terus melalui aplikasi Touch 'n Go",
      "providerType": "tng",
      "enabled": true,
      "isDefault": false,
      "testMode": false,
      "sortOrder": 2,
      "badgeIcons": [
        "tng"
      ],
      "description": "Pembayaran mudah melalui aplikasi Touch 'n Go eWallet terus ke akaun jualan Tunas Sinar Jaya Enterprise.",
      "instructions": "Buka aplikasi TNG eWallet anda dan imbas kod QR rasmi Tunas Sinar Jaya Enterprise / KAMAAR Beddings."
    }
  ]
}
