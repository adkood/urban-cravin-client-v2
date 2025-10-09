import { ProductType } from "@/components/cards/product-card";
import { DHHProductShocase } from "@/components/fav-clothing-caraousel";

export const navItems = [
    { label: 'OUR LAST SALE', badge: 'HOT' },
    { label: 'EYEWEAR', hasDropdown: true },
    { label: 'HATS & CAPS', hasDropdown: true },
    { label: 'LOOP WAITLIST', badge: 'NEW' },
    { label: 'CLOTHING', hasDropdown: true },
    { label: 'ACCESSORIES', hasDropdown: true },
    { label: 'COLLABS', hasDropdown: true },
    { label: 'UMSB', hasDropdown: true },
    { label: 'ABOUT US' }
];

export const TOP_HEADER_MARQUEE_ITEMS = [
  "DHH COLLECTION IS LIVE",
  "BUY NOW",
  "DHH COLLECTION IS LIVE",
  "BUY NOW",
  "DHH COLLECTION IS LIVE",
  "BUY NOW",
];

export const collections = [
  {
    id: 1,
    category: 'STYLE ESSENTIALS',
    title: 'BAGGY VESTs',
    buttonText: 'SHOP HERE',
    image: '/DSC_8376.JPG',
    link: '/collections/mens-fall-2025',
    alt: 'Man wearing a pink cap'
  },
  {
    id: 2,
    category: 'COLLECTIBLES',
    title: 'SWEATPANTS',
    buttonText: 'SHOP HERE',
    image: '/k-1a.webp',
    link: '/products/hyperloop-overshirt-cadet-blue',
    alt: 'Black ashtray in hand'
  },
  {
    id: 3,
    category: 'EXCLUSIVE',
    title: 'OVERSIZED TEES',
    buttonText: 'SHOP HERE',
    image: '/post2.webp',
    link: '/collections/jarren-duran',
    alt: 'Woman wearing pink t-shirt and plaid skirt'
  }
];

export const First_PRODUCT_LIST : ProductType[] = [
  {
    id: 1,
    name: 'Afterlife Coil',
    price: 151,
    image: '/webp tshirt/Afterlife Coil/7_20250928_160829_0006.webp',
    badge: 'NEW IN',
    colors: ['#4A5568'],
    isFavorited: false,
    rating : 4.5,
    reviews : 124
  },
  {
    id: 2,
    name: 'Porsche 911 GT3',
    price: 151,
    image: '/webp tshirt/Porsche 911 GT3/24_20250928_160830_0023.webp',
    badge: 'Best Seller',
    colors: ['#CBD5E0', '#4299E1'],
    isFavorited: false,
    rating : 4.5,
    reviews : 124
  },
  {
    id: 3,
    name: 'Heavy Bite',
    price: 267,
    image: '/webp tshirt/Heavy Bite/13_20250928_160829_0012.webp',
    badge: 'Trending',
    colors: ['#718096'],
    isFavorited: false,
    rating : 4.5,
    reviews : 124
  },
    {
    id: 4,
    name: 'Afterlife Coil',
    price: 151,
    image: '/webp tshirt/Afterlife Coil/7_20250928_160829_0006.webp',
    badge: 'NEW IN',
    colors: ['#4A5568'],
    isFavorited: false,
    rating : 4.5,
    reviews : 124
  },
  {
    id: 5,
    name: 'Porsche 911 GT3',
    price: 151,
    image: '/webp tshirt/Porsche 911 GT3/24_20250928_160830_0023.webp',
    badge: 'Best Seller',
    colors: ['#CBD5E0', '#4299E1'],
    isFavorited: false,
    rating : 4.5,
    reviews : 124
  },
  {
    id: 6,
    name: 'Heavy Bite',
    price: 267,
    image: '/webp tshirt/Heavy Bite/13_20250928_160829_0012.webp',
    badge: 'Trending',
    colors: ['#718096'],
    isFavorited: false,
    rating : 4.5,
    reviews : 124
  },
];

export const LAST_PRODUCT_LIST : ProductType[] = [
  {
    id: 1,
    name: 'Spirited soul',
    price: 151,
    image: '/4_20251007_172157_0003-scaled.png',
    badge: 'NEW IN',
    colors: ['#4A5568'],
    isFavorited: false,
    rating : 4.5,
    reviews : 124
  },
  {
    id: 3,
    name: 'Heavy Bite',
    price: 267,
    image: 'https://urbancravin.com/wp-content/uploads/al_opt_content/IMAGE/urbancravin.com/wp-content/uploads/2025/09/1_20250925_194418_0000.png.bv.webp?bv_host=urbancravin.com',
    badge: 'Trending',
    colors: ['#718096'],
    isFavorited: false,
    rating : 4.5,
    reviews : 124
  },
  {
    id: 2,
    name: 'Porsche 911 GT3',
    price: 151,
    image: '/5_20251007_172157_0004-scaled.png',
    badge: 'Best Seller',
    colors: ['#CBD5E0', '#4299E1'],
    isFavorited: false,
    rating : 4.5,
    reviews : 124
  },
  {
    id: 4,
    name: 'Spirited soul',
    price: 151,
    image: '/4_20251007_172157_0003-scaled.png',
    badge: 'NEW IN',
    colors: ['#4A5568'],
    isFavorited: false,
    rating : 4.5,
    reviews : 124
  },
  {
    id: 5,
    name: 'Heavy Bite',
    price: 267,
    image: 'https://urbancravin.com/wp-content/uploads/al_opt_content/IMAGE/urbancravin.com/wp-content/uploads/2025/09/1_20250925_194418_0000.png.bv.webp?bv_host=urbancravin.com',
    badge: 'Trending',
    colors: ['#718096'],
    isFavorited: false,
    rating : 4.5,
    reviews : 124
  },
  {
    id: 6,
    name: 'Porsche 911 GT3',
    price: 151,
    image: '/5_20251007_172157_0004-scaled.png',
    badge: 'Best Seller',
    colors: ['#CBD5E0', '#4299E1'],
    isFavorited: false,
    rating : 4.5,
    reviews : 124
  },
];

export const DHH_SHOWCASE_LISTING : DHHProductShocase[] = [
    {
      id: 2,
      name: '"Talwinder Vibes" Graphic Tee - Echoes of the Underground',
      price: "$226",
      productImage:
        "/Untitled-design_20250418_122726_0000-1536x1536.png",
      backgroundImage:
        "/827133dcae699b08432ef14e064cd4ff.jpg",
      link: "/products/wilkinson-cardigan",
    },
    {
      id: 3,
      name: "Seedhe Maut blackout Essential",
      price: "$377",
      productImage:
        "/Black-and-White-Modern-Trendy-Simple-Typographic-Design-Studio-Font-Logo_20250415_160433_0000 (1).png",
      backgroundImage:
        "/2f4d65816df321ccf497273639cb0223.jpg",
      link: "/products/bexley-jacket",
    },
    {
      id: 4,
      name: "Still here: Kr$na mode",
      price: "$199",
      productImage:
        "/dollar-sign-one-time_20250414_213933_0000-2-pdf.jpg",
      backgroundImage:
        "/2a6d8946f4770d4b53f820dea433fdd0.jpg",
      link: "/products/beckett-cable-knit-cardigan",
    },
    {
      id: 5,
      name: "Cactus jack print - Travis Scott",
      price: "$151",
      productImage:
        "/2_20250415_160742_0001-1536x1536.png",
      backgroundImage:
        "/fef0cbb4e220775b5e44a18d7ecfd1cd.jpg",
      link: "/products/ford-crew",
    },
    {
      id: 6,
      name: "Kendrick Mode: No Additives",
      price: "$185",
      productImage:
        "/1_20250415_160623_0000-1536x1536.png",
      backgroundImage:
        "/webp tshirt/kenny.jpg",
      link: "/products/hudson-aran-jumper",
    },
  ];