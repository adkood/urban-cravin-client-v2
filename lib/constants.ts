import { ProductType } from "@/components/cards/product-card";
import { DHHProductShocase } from "@/components/fav-clothing-caraousel";

export const NAV_ITEMS = [
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

export const COLLECTIONS = [
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

export const TESTIMONIALS = [
  {
    name: "Aarav Mehta",
    username: "@aaravmehta",
    avatar: "https://www.material-tailwind.com/img/avatar1.jpg",
    content:
      "The fit is insane — comfy, clean, and just the right amount of street. Wore it once, and now it’s my everyday flex. 🔥",
    date: "Aug 03, 2025",
    verified: true,
  },
  {
    name: "Tanya Kapoor",
    username: "@tanyakapoor",
    avatar: "https://www.material-tailwind.com/image/avatar4.jpg",
    content:
      "Love how minimal yet bold their designs are. The fabric feels premium and the colours hit just right. Perfect for all-day wear. ✨",
    date: "Sep 15, 2025",
    verified: true,
  },
  {
    name: "Kabir Sharma",
    username: "@kabirshrm",
    avatar: "https://www.material-tailwind.com/image/avatar8.svg",
    content:
      "Honestly, didn’t expect this quality at this price. The oversized tees and cargos are next level — easily my go-to brand now. 😎",
    date: "Aug 28, 2025",
    verified: true,
  },
  {
    name: "Isha Nair",
    username: "@ishanair",
    avatar: "https://www.material-tailwind.com/img/avatar3.jpg",
    content:
      "Every drop feels fresh and different. I’ve been stopped multiple times asking where I got my hoodie from. That says it all. 💯",
    date: "Jul 12, 2025",
    verified: true,
  },
  {
    name: "Rohan Patel",
    username: "@rohanptl",
    avatar: "https://www.material-tailwind.com/image/avatar2.jpg",
    content:
      "Urban, clean, and confident — exactly how I like to dress. The quality and vibe make it worth every penny. 👌",
    date: "Aug 19, 2025",
    verified: true,
  },
  {
    name: "Simran Kaur",
    username: "@simrankaurr",
    avatar: "https://www.material-tailwind.com/image/avatar5.jpg",
    content:
      "From the stitching to the silhouette, everything feels thoughtfully made. It’s giving luxury streetwear energy. 🖤",
    date: "Sep 05, 2025",
    verified: true,
  },
];
