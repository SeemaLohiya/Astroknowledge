import { Lang } from "./translations";

export interface NavDropdownItem {
  href: string;
  label: string;
  desc: string;
}

export interface NavDropdown {
  label: string;
  href: string;
  items: NavDropdownItem[];
}

const NAV: Record<Lang, NavDropdown[]> = {
  en: [
    {
      label: "Services",
      href: "/services",
      items: [
        { href: "/services#kundali-vishleshan", label: "Kundali Vishleshan", desc: "Complete horoscope reading" },
        { href: "/services#kundli-milan", label: "Kundli Milan", desc: "Marriage compatibility" },
        { href: "/services#vastu-consultancy", label: "Vastu Consultancy", desc: "Home & office Vastu" },
        { href: "/services#numerology", label: "Numerology", desc: "Name & number analysis" },
        { href: "/services#palmistry", label: "Palmistry", desc: "Hand reading analysis" },
        { href: "/booking", label: "Book Consultation", desc: "Schedule a consultation" },
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
  ],
  hi: [
    {
      label: "सेवाएं",
      href: "/services",
      items: [
        { href: "/services#kundali-vishleshan", label: "कुंडली विश्लेषण", desc: "संपूर्ण कुंडली विश्लेषण" },
        { href: "/services#kundli-milan", label: "कुंडली मिलान", desc: "विवाह अनुकूलता" },
        { href: "/services#vastu-consultancy", label: "वास्तु परामर्श", desc: "घर और कार्यालय वास्तु" },
        { href: "/services#numerology", label: "अंक ज्योतिष", desc: "नाम और अंक विश्लेषण" },
        { href: "/services#palmistry", label: "हस्तरेखा", desc: "हाथ की रेखा विश्लेषण" },
        { href: "/booking", label: "परामर्श बुक करें", desc: "परामर्श का समय निर्धारित करें" },
      ],
    },
    {
      label: "पाठ्यक्रम",
      href: "/courses",
      items: [
        { href: "/courses#vedic-astrology-cert", label: "ज्योतिष पाठ्यक्रम", desc: "प्रमाणन कार्यक्रम" },
        { href: "/courses#ritual-specialist", label: "अनुष्ठान विशेषज्ञ", desc: "पूजा और संस्कार प्रशिक्षण" },
        { href: "/courses#numerology-mastery", label: "अंक ज्योतिष", desc: "नाम और अंक में निपुणता" },
        { href: "/courses#vastu-fundamentals", label: "वास्तु शास्त्र", desc: "स्थान ऊर्जा के मूल सिद्धांत" },
        { href: "/contact", label: "अभी नामांकन करें", desc: "नामांकन के लिए संपर्क करें" },
      ],
    },
    {
      label: "उत्पाद",
      href: "/products",
      items: [
        { href: "/products?category=rudraksha", label: "रुद्राक्ष", desc: "पवित्र सुरक्षा मनके" },
        { href: "/products?category=gemstone", label: "रत्न", desc: "प्रमाणित प्राकृतिक रत्न" },
        { href: "/products?category=yantra", label: "यंत्र", desc: "पवित्र ज्यामितीय यंत्र" },
        { href: "/products?category=parad", label: "पारद सामग्री", desc: "पारद आध्यात्मिक वस्तुएं" },
        { href: "/products?category=pooja-kit", label: "पूजा किट", desc: "संपूर्ण पूजा सामग्री" },
        { href: "/products?category=vastu", label: "वास्तु सामग्री", desc: "ऊर्जा सुधार वस्तुएं" },
      ],
    },
  ],
};

export function getNavDropdowns(lang: Lang): NavDropdown[] {
  return NAV[lang];
}
