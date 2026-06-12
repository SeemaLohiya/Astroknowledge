export const CTA = {
  proceedToCheckout: "Proceed to Checkout",
  addToCart: "Add to Cart",
  continueToPayment: "Continue to Payment",
} as const;

export const SITE = {
  name: "AstroKnowledge",
  logo: "/images/logo.png",
  tagline: "Illuminating Life Through Vedic Wisdom",
  acharya: "Acharya Seema Lohiya",
  acharyaImage: "/images/seema-lohiya.png",
  acharyaTitle: "Shastracharya · Chief Vedic Astrologer",
  phone: "+91 8949265869",
  whatsapp: "+918949265869",
  email: "astroknowledge01@gmail.com",
  address: "Jaipur, Rajasthan, India",
  mapsUrl: "https://maps.app.goo.gl/QPVC4p5i9rY6PDcQ6",
  experience: "12",
  clients: "75,000+",
  reviews: "75,000+",
  rating: "4.9",
  discountCode: "ASTRO10OFF",
  discountPercent: 10,
  consultationHours: "Mon - Sat: 9:00 AM - 8:00 PM",
  youtube: "https://youtube.com/@seemalohiya3037?si=Td3IQUWbenZGt3wM",
  instagram: "https://www.instagram.com/astroknowledge.seema/",
  facebook: "https://facebook.com/astroknowledge",
  upiId: "8949268569@ptyes",
  upiQrImage: "/images/payments/upi-qr-seema.png",
  upiPayeeName: "Mrs Seema Lohiya",
  upiGalleryLimit: 2000,
  bankName: "Paytm UPI",
  accountName: "Mrs Seema Lohiya",
};

export const PAYMENT_METHODS = {
  razorpay: "razorpay",
  adminApproval: "admin_approval",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/pooja", label: "Pooja" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const NAV_DROPDOWNS = [
  {
    label: "Services",
    href: "/services",
    items: [
      { href: "/services#kundali-vishleshan", label: "Kundali Vishleshan", desc: "Complete horoscope reading" },
      { href: "/services#kundli-milan", label: "Kundli Milan", desc: "Marriage compatibility" },
      { href: "/services#vastu-consultancy", label: "Vastu Consultancy", desc: "Home & office Vastu" },
      { href: "/services#numerology", label: "Numerology", desc: "Name & number analysis" },
      { href: "/services#palmistry", label: "Palmistry", desc: "Hand reading analysis" },
      { href: "/dashboard/slots", label: "Book Consultation", desc: "Schedule a consultation" },
    ],
  },
  {
    label: "Courses",
    href: "/courses",
    items: [
      { href: "/courses#vedic-astrology-cert", label: "Astrology Course", desc: "Certification program" },
      { href: "/courses#ritual-specialist", label: "Ritual Specialist", desc: "Pooja & ceremony training" },
      { href: "/courses#numerology-mastery", label: "Numerology", desc: "Name & number mastery" },
      { href: "/courses#vastu-fundamentals", label: "Vastu Shastra", desc: "Space energy fundamentals" },
      { href: "/contact", label: "Enroll Now", desc: "Contact for enrollment" },
    ],
  },
  {
    label: "Products",
    href: "/products",
    items: [
      { href: "/products?category=rudraksha", label: "Rudraksha", desc: "Sacred protection beads" },
      { href: "/products?category=gemstone", label: "Gemstones", desc: "Certified natural ratna" },
      { href: "/products?category=yantra", label: "Yantras", desc: "Sacred geometry" },
      { href: "/products?category=parad", label: "Parad Items", desc: "Mercury spiritual items" },
      { href: "/products?category=pooja-kit", label: "Pooja Kits", desc: "Complete samagri" },
      { href: "/products?category=vastu", label: "Vastu Items", desc: "Energy correction" },
    ],
  },
];

export const ZODIAC_SIGNS = [
  { sign: "Aries", hindi: "मेष", symbol: "♈", dates: "Mar 21 - Apr 19" },
  { sign: "Taurus", hindi: "वृषभ", symbol: "♉", dates: "Apr 20 - May 20" },
  { sign: "Gemini", hindi: "मिथुन", symbol: "♊", dates: "May 21 - Jun 20" },
  { sign: "Cancer", hindi: "कर्क", symbol: "♋", dates: "Jun 21 - Jul 22" },
  { sign: "Leo", hindi: "सिंह", symbol: "♌", dates: "Jul 23 - Aug 22" },
  { sign: "Virgo", hindi: "कन्या", symbol: "♍", dates: "Aug 23 - Sep 22" },
  { sign: "Libra", hindi: "तुला", symbol: "♎", dates: "Sep 23 - Oct 22" },
  { sign: "Scorpio", hindi: "वृश्चिक", symbol: "♏", dates: "Oct 23 - Nov 21" },
  { sign: "Sagittarius", hindi: "धनु", symbol: "♐", dates: "Nov 22 - Dec 21" },
  { sign: "Capricorn", hindi: "मकर", symbol: "♑", dates: "Dec 22 - Jan 19" },
  { sign: "Aquarius", hindi: "कुम्भ", symbol: "♒", dates: "Jan 20 - Feb 18" },
  { sign: "Pisces", hindi: "मीन", symbol: "♓", dates: "Feb 19 - Mar 20" },
];
