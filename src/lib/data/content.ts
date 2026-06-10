import { Review, ProblemCategory, PoojaService } from "../types";

export const reviews: Review[] = [
  { id: "r1", name: "Priya Sharma", rating: 5, comment: "Acharya Seema Lohiya's Kundali analysis was incredibly accurate. Her remedies transformed my career within months!", commentHindi: "आचार्य सीमा लोहिया का कुंडली विश्लेषण अविश्वसनीय रूप से सटीक था। उनके उपायों ने महीनों में मेरे करियर को बदल दिया!", date: "2026-05-15", service: "Kundali Vishleshan" },
  { id: "r2", name: "Rajesh Mehta", rating: 5, comment: "Best astrologer I have consulted. The Kundli Milan report was detailed and helped us make the right decision.", commentHindi: "सबसे अच्छी ज्योतिषी। कुंडली मिलान रिपोर्ट विस्तृत थी और सही निर्णय लेने में मदद की।", date: "2026-05-10", service: "Kundli Milan" },
  { id: "r3", name: "Anita Verma", rating: 5, comment: "The Rudraksha mala I purchased is authentic and energized. I feel a positive change in my daily meditation.", commentHindi: "खरीदी गई रुद्राक्ष माला प्रामाणिक और ऊर्जावान है। दैनिक ध्यान में सकारात्मक बदलाव महसूस होता है।", date: "2026-04-28" },
  { id: "r4", name: "Vikram Singh", rating: 4, comment: "Vastu consultation was practical and affordable. No demolition needed — just simple remedies that worked!", commentHindi: "वास्तु परामर्श व्यावहारिक और किफायती था। तोड़फोड़ की जरूरत नहीं — सरल उपाय काम कर गए!", date: "2026-04-20", service: "Vastu Consultancy" },
  { id: "r5", name: "Sunita Patel", rating: 5, comment: "Acharya Seema Lohiya's guidance is spot on! I consult her regularly and her predictions always prove accurate.", commentHindi: "आचार्य सीमा लोहिया का मार्गदर्शन बिल्कुल सही है! मैं नियमित परामर्श लेती हूं और उनकी भविष्यवाणियां हमेशा सही साबित होती हैं।", date: "2026-04-15" },
  { id: "r6", name: "Arjun Reddy", rating: 5, comment: "Numerology session revealed so much about my life path. Changed my business name as suggested — profits doubled!", commentHindi: "अंक ज्योतिष सत्र ने जीवन पथ के बारे में बहुत कुछ बताया। सुझाए अनुसार व्यापार का नाम बदला — मुनाफा दोगुना!", date: "2026-04-08", service: "Numerology" },
];

const P = "/images/ref/problems";

export const problemCategories: ProblemCategory[] = [
  { id: "health", title: "Health Issues", titleHindi: "स्वास्थ्य समस्याएं", description: "Chronic illness, weak immunity, unexplained ailments", icon: "🏥", image: `${P}/health.jpg`, remedies: ["Mahamrityunjaya Jaap", "Rudraksha Mala", "Parad Shivling"] },
  { id: "financial", title: "Financial Struggles", titleHindi: "आर्थिक समस्याएं", description: "Debt, business losses, lack of savings, financial instability", icon: "💰", image: `${P}/financial.jpg`, remedies: ["Shri Yantra", "Kuber Yantra", "Yellow Sapphire"] },
  { id: "marriage", title: "Marriage & Relationship", titleHindi: "विवाह एवं संबंध", description: "Delayed marriage, marital discord, incompatibility", icon: "💑", image: `${P}/marriage.jpg`, remedies: ["Kundli Milan", "Venus Remedies", "Gauri Shankar Rudraksha"] },
  { id: "career", title: "Career & Business", titleHindi: "करियर एवं व्यवसाय", description: "Job instability, business failures, lack of growth", icon: "💼", image: `${P}/career.jpg`, remedies: ["Blue Sapphire", "Career Report", "Ganesh Puja"] },
  { id: "negative", title: "Negative Energy & Protection", titleHindi: "नकारात्मक ऊर्जा", description: "Black magic, evil eye, fear, anxiety, sleep issues", icon: "🛡️", image: `${P}/negative-energy.jpg`, remedies: ["Hanuman Chalisa Yantra", "Black Tourmaline", "Navgraha Shanti"] },
  { id: "education", title: "Education & Focus", titleHindi: "शिक्षा एवं एकाग्रता", description: "Poor concentration, exam failure, learning difficulties", icon: "📚", image: `${P}/education.jpg`, remedies: ["Saraswati Yantra", "5 Mukhi Rudraksha", "Budh Remedies"] },
  { id: "legal", title: "Legal Issues", titleHindi: "कानूनी समस्याएं", description: "Court cases, legal disputes, property conflicts", icon: "⚖️", image: `${P}/legal.jpg`, remedies: ["Baglamukhi Yantra", "Saturn Remedies", "Legal Report"] },
  { id: "mental", title: "Mental Peace", titleHindi: "मानसिक शांति", description: "Stress, anxiety, depression, mental unrest", icon: "🧘", image: `${P}/mental-peace.jpg`, remedies: ["Amethyst Crystal", "Meditation Mala", "Moon Remedies"] },
];

export const poojaServices: PoojaService[] = [
  { id: "pu1", title: "Satyanarayan Katha", titleHindi: "सत्यनारायण कथा", description: "Sacred Satyanarayan Katha for prosperity, health and fulfillment of wishes.", price: 5100, duration: "3 hours", benefits: ["Prosperity", "Health blessings", "Wish fulfillment"], image: "/images/astro/pooja.jpg" },
  { id: "pu2", title: "Navgraha Shanti Puja", titleHindi: "नवग्रह शांति पूजा", description: "Complete Navgraha Shanti puja to pacify all nine planets.", price: 7500, duration: "4 hours", benefits: ["Planetary peace", "Obstacle removal", "Life harmony"], image: "/images/astro/planets.jpg" },
  { id: "pu3", title: "Mahamrityunjaya Jaap", titleHindi: "महामृत्युंजय जाप", description: "Powerful 125,000 Mahamrityunjaya mantra jaap for health and longevity.", price: 11000, duration: "7 days", benefits: ["Health protection", "Longevity", "Fear removal"], image: "/images/astro/vedic.jpg" },
  { id: "pu4", title: "Griha Pravesh Puja", titleHindi: "गृह प्रवेश पूजा", description: "Auspicious housewarming ceremony for new home blessings.", price: 4500, duration: "2 hours", benefits: ["Home blessings", "Positive energy", "Family harmony"], image: "/images/products/p10.jpg" },
  { id: "pu5", title: "Mangal Dosh Nivaran", titleHindi: "मंगल दोष निवारण", description: "Special puja to neutralize Mangal Dosha for marriage and career.", price: 6500, duration: "3 hours", benefits: ["Dosha removal", "Marriage ease", "Career stability"], image: "/images/astro/zodiac.jpg" },
  { id: "pu6", title: "Rudrabhishek", titleHindi: "रुद्राभिषेक", description: "Sacred Rudrabhishek for Lord Shiva's blessings and spiritual elevation.", price: 8500, duration: "2.5 hours", benefits: ["Divine blessings", "Sin removal", "Spiritual growth"], image: "/images/products/p3.jpg" },
];

export const faqs = [
  { q: "Who is the best astrologer at AstroKnowledge?", a: "Acharya Seema Lohiya is the chief astrologer at AstroKnowledge with 12 years of experience and 75,000+ happy clients. She specializes in Kundali Vishleshan, Kundli Milan, Vastu Shastra, Numerology, and Dosha analysis." },
  { q: "How can I consult an astrologer online?", a: "You can book a one-on-one telephonic consultation through our booking page. Each consultation includes detailed Kundali analysis, dosha identification, and personalized Vedic remedies. Consultations are available for clients worldwide." },
  { q: "What services does AstroKnowledge offer?", a: "AstroKnowledge offers Kundali Vishleshan, Kundli Milan, Vastu Consultancy, Numerology, Ask a Question, Palmistry, Pooja services, and spiritual products." },
  { q: "Is online astrology consultation accurate?", a: "Yes. Online consultation is as accurate as in-person because Vedic astrology is based on your birth details (date, time, and place), not physical presence. Acharya Seema Lohiya has completed 75,000+ consultations with consistent accuracy." },
  { q: "Are your spiritual products authentic?", a: "All products are 100% authentic, lab-tested where applicable, and energized by Vedic Pandits before shipping." },
  { q: "What is the consultation timing?", a: "Consultations are available Monday to Saturday, 9:00 AM to 8:00 PM IST. You can also reach us on WhatsApp for quick queries." },
];
