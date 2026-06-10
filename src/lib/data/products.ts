import { Product, ProductCategory } from "../types";

const C = "/images/ref/categories";
const P = "/images/products";

export const productCategories: ProductCategory[] = [
  { id: "rudraksha", name: "Rudraksha", nameHindi: "रुद्राक्ष", icon: "📿", description: "Sacred beads for spiritual protection", image: `${C}/rudraksha.jpeg` },
  { id: "pendant", name: "Pendant", nameHindi: "पेंडेंट", icon: "💠", description: "Energized spiritual pendants", image: `${C}/Pendants.jpeg` },
  { id: "parad", name: "Parad", nameHindi: "पारद", icon: "🪔", description: "Sacred mercury items for prosperity", image: `${C}/Parad.jpeg` },
  { id: "mala", name: "Mala / Bracelet", nameHindi: "माला / कंगन", icon: "📿", description: "Prayer malas and bracelets", image: `${C}/Mala.jpeg` },
  { id: "silver", name: "Silver", nameHindi: "चांदी", icon: "🥈", description: "Pure silver spiritual items", image: `${C}/silver-items.jpeg` },
  { id: "gemstone", name: "GemStone", nameHindi: "रत्न", icon: "💎", description: "Certified natural gemstones", image: `${C}/Gemstones.jpeg` },
  { id: "yantra", name: "Yantra", nameHindi: "यंत्र", icon: "🔺", description: "Sacred geometric yantras", image: `${C}/Yantra.jpeg` },
  { id: "statue", name: "God Statue", nameHindi: "देवी-देवता प्रतिमा", icon: "🗿", description: "Divine deity statues", image: `${C}/god-statue.jpeg` },
  { id: "vastu", name: "Vastu Item", nameHindi: "वास्तु सामग्री", icon: "🏛️", description: "Vastu correction items", image: `${C}/Yantra.jpeg` },
  { id: "pooja-kit", name: "Pooja Combo & Kit", nameHindi: "पूजा सामग्री", icon: "🎁", description: "Complete pooja kits", image: `${C}/Mala.jpeg` },
  { id: "sphatik", name: "Sphatik", nameHindi: "स्फटिक", icon: "🔮", description: "Crystal sphatik items", image: `${C}/Sphatik.jpeg` },
  { id: "crystal", name: "Crystal", nameHindi: "क्रिस्टल", icon: "✨", description: "Healing crystals", image: `${C}/Crystal.jpeg` },
  { id: "feng-shui", name: "Feng Shui Item", nameHindi: "फेंग शुई", icon: "🎋", description: "Feng shui prosperity items", image: `${C}/feng-shui.jpeg` },
  { id: "special", name: "Special Items", nameHindi: "विशेष सामग्री", icon: "⭐", description: "Rare spiritual artifacts", image: `${C}/Gemstones.jpeg` },
];

export const products: Product[] = [
  { id: "p1", name: "5 Mukhi Rudraksha Mala", nameHindi: "५ मुखी रुद्राक्ष माला", description: "Authentic 5 Mukhi Rudraksha mala with 108+1 beads, energized by Vedic rituals.", price: 2100, originalPrice: 2800, category: "rudraksha", image: `${P}/p1.png`, rating: 4.9, reviews: 342, inStock: true, energized: true },
  { id: "p2", name: "7 Mukhi Rudraksha Pendant", nameHindi: "७ मुखी रुद्राक्ष पेंडेंट", description: "Rare 7 Mukhi Rudraksha in silver capping for wealth and abundance.", price: 4500, category: "rudraksha", image: `${P}/p2.png`, rating: 4.8, reviews: 189, inStock: true, energized: true },
  { id: "p3", name: "Parad Shivling", nameHindi: "पारद शिवलिंग", description: "Sacred Parad Shivling for home worship and spiritual elevation.", price: 8900, originalPrice: 12000, category: "parad", image: `${P}/p3.png`, rating: 5.0, reviews: 98, inStock: true, energized: true },
  { id: "p4", name: "Yellow Sapphire (Pukhraj)", nameHindi: "पुखराज रत्न", description: "Lab-certified natural Yellow Sapphire for Jupiter blessings.", price: 15000, category: "gemstone", image: `${P}/p4.jpg`, rating: 4.7, reviews: 156, inStock: true, energized: true },
  { id: "p5", name: "Blue Sapphire (Neelam)", nameHindi: "नीलम रत्न", description: "Premium Ceylon Blue Sapphire for Saturn strength and career growth.", price: 22000, category: "gemstone", image: `${P}/p5.jpg`, rating: 4.9, reviews: 87, inStock: true, energized: true },
  { id: "p6", name: "Shri Yantra Gold Plated", nameHindi: "श्री यंत्र", description: "Energized Shri Yantra for wealth, prosperity and divine blessings.", price: 3200, category: "yantra", image: `${P}/p6.jpg`, rating: 4.8, reviews: 234, inStock: true, energized: true },
  { id: "p7", name: "Mahamrityunjaya Yantra", nameHindi: "महामृत्युंजय यंत्र", description: "Powerful yantra for health protection and overcoming obstacles.", price: 1800, category: "yantra", image: `${P}/p7.jpg`, rating: 4.6, reviews: 167, inStock: true, energized: true },
  { id: "p8", name: "Silver Lakshmi Ganesh Idol", nameHindi: "चांदी लक्ष्मी गणेश", description: "Pure silver Lakshmi Ganesh idol for prosperity and new beginnings.", price: 6500, category: "silver", image: `${P}/p8.png`, rating: 4.9, reviews: 201, inStock: true, energized: true },
  { id: "p9", name: "Tulsi Mala 108 Beads", nameHindi: "तुलसी माला", description: "Sacred Tulsi mala for daily japa and spiritual purification.", price: 890, category: "mala", image: `${P}/p9.png`, rating: 4.7, reviews: 445, inStock: true, energized: true },
  { id: "p10", name: "Vastu Pyramid Set", nameHindi: "वास्तु पिरामिड", description: "Copper Vastu pyramid set for energy correction in home and office.", price: 2400, category: "vastu", image: `${P}/p10.png`, rating: 4.5, reviews: 112, inStock: true, energized: true },
  { id: "p11", name: "Navgraha Shanti Kit", nameHindi: "नवग्रह शांति किट", description: "Complete Navgraha Shanti pooja kit with all essential samagri.", price: 3500, category: "pooja-kit", image: `${P}/p11.png`, rating: 4.8, reviews: 178, inStock: true, energized: true },
  { id: "p12", name: "Sphatik Crystal Ball", nameHindi: "स्फटिक गोला", description: "Natural sphatik crystal ball for meditation and positive energy.", price: 4200, category: "sphatik", image: `${P}/p12.png`, rating: 4.6, reviews: 93, inStock: true, energized: true },
  { id: "p13", name: "Amethyst Healing Crystal", nameHindi: "एमेथिस्ट क्रिस्टल", description: "Natural amethyst for mental peace, intuition and stress relief.", price: 1600, category: "crystal", image: `${P}/p13.png`, rating: 4.7, reviews: 156, inStock: true, energized: true },
  { id: "p14", name: "Feng Shui Money Frog", nameHindi: "धन मेंढक", description: "Golden money frog for attracting wealth and financial prosperity.", price: 1200, category: "feng-shui", image: `${P}/p14.png`, rating: 4.4, reviews: 89, inStock: true, energized: true },
  { id: "p15", name: "Hanuman Chalisa Yantra Pendant", nameHindi: "हनुमान चालीसा यंत्र", description: "Energized Hanuman Chalisa yantra pendant for courage and protection.", price: 980, category: "pendant", image: `${P}/p15.png`, rating: 4.9, reviews: 312, inStock: true, energized: true },
  { id: "p16", name: "Durga Mata Brass Statue", nameHindi: "दुर्गा माता प्रतिमा", description: "Beautiful brass Durga Mata statue for home temple worship.", price: 5500, category: "statue", image: `${P}/p16.png`, rating: 4.8, reviews: 67, inStock: true, energized: true },
  { id: "p17", name: "Ruby (Manik) Gemstone", nameHindi: "माणिक्य रत्न", description: "Natural Burmese Ruby for leadership and confidence.", price: 28000, category: "gemstone", image: `${P}/p17.png`, rating: 4.9, reviews: 45, inStock: true, energized: true },
  { id: "p18", name: "Emerald (Panna) Gemstone", nameHindi: "पन्ना रत्न", description: "Colombian Emerald for intelligence and business acumen.", price: 18500, category: "gemstone", image: `${P}/p18.jpg`, rating: 4.8, reviews: 72, inStock: true, energized: true },
  { id: "p19", name: "1 Mukhi Rudraksha", nameHindi: "१ मुखी रुद्राक्ष", description: "Extremely rare 1 Mukhi Rudraksha, certified authentic.", price: 35000, category: "rudraksha", image: `${P}/p19.png`, rating: 5.0, reviews: 23, inStock: true, energized: true },
  { id: "p20", name: "Crystal Healing Set", nameHindi: "क्रिस्टल हीलिंग सेट", description: "7 chakra crystal set for complete energy balancing.", price: 2800, category: "crystal", image: `${P}/p20.png`, rating: 4.6, reviews: 134, inStock: true, energized: true },
];
