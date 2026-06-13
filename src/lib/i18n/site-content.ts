import { CATALOG_HINDI } from "./catalog-hindi";
import { Lang } from "./translations";

export interface FAQ {
  q: string;
  a: string;
}

export interface SiteContentLang {
  hero: {
    badge: string;
    clients: string;
    title: string;
    subtitle: string;
    typing: string[];
    yearsLabel: string;
    clientsLabel: string;
    ratingLabel: string;
    descTail: string;
    bookConsultation: string;
    whatsapp: string;
    years: string;
    rating: string;
    support: string;
  };
  trustBadges: { title: string; sub: string }[];
  sections: {
    servicesTitle: string;
    servicesSubtitle: string;
    coursesTitle: string;
    coursesSubtitle: string;
    productsTitle: string;
    productsSubtitle: string;
    productsBtn: string;
    problemsTitle: string;
    problemsSubtitle: string;
    reviewsTitle: string;
    reviewsSubtitle: string;
    faqBadge: string;
    faqTitle: string;
    faqSubtitle: string;
    cosmicTitle: string;
    cosmicSubtitle: string;
    navgrahaTitle: string;
    navgrahaHint: string;
    navgrahaGoverns: string;
    navgrahaInfluences: string;
    navgrahaRemedy: string;
    navgrahaDay: string;
    navgrahaGemstone: string;
    navgrahaNature: string;
    achievementsBadge: string;
    achievementsSubtitle: string;
    happyClients: string;
    popular: string;
    viewAll: string;
    viewAllServices: string;
    viewAllCourses: string;
    energized: string;
    addToCart: string;
    add: string;
    sale: string;
    deliveryAvailable: string;
    certified: string;
  };
  footer: {
    ourServices: string;
    shopByCategory: string;
    quickLinks: string;
    contactUs: string;
    mission: string;
    terms: string;
    privacy: string;
    shipping: string;
    refund: string;
    rights: string;
    badges: string[];
    links: {
      kundali: string;
      kundliMilan: string;
      vastu: string;
      numerology: string;
      courses: string;
      pooja: string;
      rudraksha: string;
      gemstone: string;
      yantra: string;
      poojaKit: string;
      vastuItems: string;
      about: string;
      contact: string;
      bookConsultation: string;
      blog: string;
    };
  };
  faqs: FAQ[];
  about: {
    journeyTitle: string;
    journeyTitleAccent: string;
    missionTitle: string;
    missionText: string;
    happyClients: string;
    yearsExp: string;
    bookConsultation: string;
    shastracharya: string;
    bio1: string;
    bio2: string;
    bio3: string;
    developerLinkTitle: string;
    developerLinkDesc: string;
    developerLinkCta: string;
  };
  contact: {
    title: string;
    subtitle: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    hours: string;
    openMaps: string;
    whatsappButton: string;
  };
  booking: {
    title: string;
    selectService: string;
    chooseService: string;
    selectSlot: string;
    yourBookings: string;
    pendingConfirm: string;
    confirmed: string;
    noSlots: string;
    loading: string;
    duration: string;
  };
  admin: {
    slotsTitle: string;
    slotsSubtitle: string;
    openSlots: string;
    bookedSlots: string;
    pendingSlots: string;
    addSlot: string;
    date: string;
    time: string;
    duration: string;
    customDuration: string;
    searchDate: string;
    searchClient: string;
    searchService: string;
    allServices: string;
    confirm: string;
    reject: string;
    release: string;
    block: string;
    delete: string;
    pendingAlert: string;
    usersTitle: string;
    usersSubtitle: string;
    searchUser: string;
    filterRole: string;
    allRoles: string;
    admin: string;
    user: string;
    paymentsTitle: string;
    paymentsSubtitle: string;
    filterStatus: string;
    filterType: string;
    allStatuses: string;
    allTypes: string;
    order: string;
    slot: string;
    amount: string;
    markPaid: string;
    markPending: string;
    noResults: string;
  };
  common: {
    loading: string;
    save: string;
    cancel: string;
    search: string;
    filter: string;
    login: string;
    register: string;
    logout: string;
    welcome: string;
    quickActions: string;
    shopProducts: string;
    myBookings: string;
    myOrders: string;
    profile: string;
    bookSlot: string;
    spiritualProducts: string;
    authenticProducts: string;
    expertVedic: string;
    vedicWisdom: string;
    discountBanner: string;
    loginRegister: string;
  };
}

export const siteContent: Record<Lang, SiteContentLang> = {
  en: {
    hero: {
      badge: "Trusted Vedic Astrology",
      clients: "+ Clients",
      title: "Expert Vedic Astrology",
      subtitle: "",
      typing: [
        "Kundali Vishleshan & Birth Chart Analysis",
        "Personalized Vedic Remedy Guidance",
        "Marriage Compatibility & Kundli Milan",
        "Vastu Shastra & Numerology Guidance",
        "Authentic Spiritual Products & Gemstones",
      ],
      yearsLabel: "years of expertise",
      clientsLabel: "happy clients",
      ratingLabel: "/5 rating",
      descTail: "Get personalized insights on career, marriage, health & finances.",
      bookConsultation: "Book Consultation",
      whatsapp: "WhatsApp",
      years: "Years",
      rating: "/5 Rating",
      support: "24/7 Support",
    },
    trustBadges: [
      { title: "100% Certified", sub: "Lab Tested" },
      { title: "Energized", sub: "By Vedic Pandit" },
      { title: "Fast Shipping", sub: "Across India" },
      { title: "Secure Payment", sub: "UPI, Cards, COD" },
      { title: "Authentic Products", sub: "Lab Tested" },
      { title: "Vedic Blessings", sub: "Pandit Energized" },
    ],
    sections: {
      servicesTitle: "Our Consultation Services",
      servicesSubtitle: "Personalized guidance through telephonic consultations and detailed horoscope analysis.",
      coursesTitle: "Astrology Courses",
      coursesSubtitle: "Learn authentic Vedic sciences from Acharya Seema Lohiya.",
      productsTitle: "Explore our Products",
      productsSubtitle: "Authentic, energized spiritual products for your well-being and spiritual growth.",
      productsBtn: "View All Products",
      problemsTitle: "Shop by Life Problems",
      problemsSubtitle: "Find remedies and guidance tailored to your life's challenges.",
      reviewsTitle: "Client Reviews",
      reviewsSubtitle: "What our clients say about their transformative experiences.",
      faqBadge: "Got Questions?",
      faqTitle: "Frequently Asked Questions",
      faqSubtitle: "Expert answers — years of Vedic astrology experience.",
      cosmicTitle: "Cosmic Elements",
      cosmicSubtitle: "Understanding the five elements that shape your destiny.",
      navgrahaTitle: "Navgraha — Nine Planets",
      navgrahaHint: "Tap any planet to discover its Vedic significance",
      navgrahaGoverns: "What it governs",
      navgrahaInfluences: "Key influences",
      navgrahaRemedy: "Vedic remedy",
      navgrahaDay: "Day",
      navgrahaGemstone: "Gemstone",
      navgrahaNature: "Nature",
      achievementsBadge: "Trust & Excellence",
      achievementsSubtitle: "Celebrating client success stories and milestones in Vedic astrology",
      happyClients: "Our Happy Clients",
      popular: "Popular",
      viewAll: "View All",
      viewAllServices: "View All Services",
      viewAllCourses: "View All Courses",
      energized: "Energized",
      addToCart: "Add to Cart",
      add: "Add",
      sale: "Sale",
      deliveryAvailable: "Delivery Available",
      certified: "Certified",
    },
    footer: {
      ourServices: "Our Services",
      shopByCategory: "Shop by Category",
      quickLinks: "Quick Links",
      contactUs: "Contact Us",
      mission: "",
      terms: "Terms",
      privacy: "Privacy",
      shipping: "Shipping",
      refund: "Refund",
      rights: "All Rights Reserved.",
      badges: ["100% Certified", "Energized by Vedic Pandit", "Authentic Products", "Secure Payment Coming Soon"],
      links: {
        kundali: "Kundali Vishleshan",
        kundliMilan: "Kundli Milan",
        vastu: "Vastu Consultancy",
        numerology: "Numerology",
        courses: "Courses",
        pooja: "Pooja Services",
        rudraksha: "Rudraksha",
        gemstone: "Gemstones",
        yantra: "Yantras",
        poojaKit: "Pooja Kits",
        vastuItems: "Vastu Items",
        about: "About Us",
        contact: "Contact",
        bookConsultation: "Book Consultation",
        blog: "Blog",
      },
    },
    faqs: [
      { q: "Who is the best astrologer at AstroKnowledge?", a: "Acharya Seema Lohiya is the chief astrologer at AstroKnowledge with 12 years of experience and 75,000+ happy clients. She specializes in Kundali Vishleshan, Kundli Milan, Vastu Shastra, Numerology, and Dosha analysis." },
      { q: "How can I consult an astrologer online?", a: "You can book a one-on-one telephonic consultation through our booking page. Each consultation includes detailed Kundali analysis, dosha identification, and personalized Vedic remedies. Consultations are available for clients worldwide." },
      { q: "What services does AstroKnowledge offer?", a: "AstroKnowledge offers Kundali Vishleshan, Kundli Milan, Vastu Consultancy, Numerology, Ask a Question, Palmistry, Pooja services, and spiritual products." },
      { q: "Is online astrology consultation accurate?", a: "Yes. Online consultation is as accurate as in-person because Vedic astrology is based on your birth details (date, time, and place), not physical presence. Acharya Seema Lohiya has completed 75,000+ consultations with consistent accuracy." },
      { q: "Are your spiritual products authentic?", a: "All products are 100% authentic, lab-tested where applicable, and energized by Vedic Pandits before shipping." },
      { q: "What is the consultation timing?", a: "Consultations are available Monday to Saturday, 9:00 AM to 8:00 PM IST. You can also reach us on WhatsApp for quick queries." },
    ],
    about: {
      journeyTitle: "A Journey of",
      journeyTitleAccent: "Intellect & Spirit",
      missionTitle: "Our Mission",
      missionText: "To illuminate lives through authentic Vedic wisdom, providing accurate astrological guidance and genuine spiritual products that empower individuals to navigate life with confidence and clarity.",
      happyClients: "Happy Clients",
      yearsExp: "Years Experience",
      bookConsultation: "Book a Consultation",
      shastracharya: "Shastracharya",
      bio1: "Acharya Seema Lohiya's journey into astrology is a remarkable blend of intellect, spirituality, and destiny. Beginning her career in Computer Science, she eventually discovered her true calling in the sacred science of astrology.",
      bio2: "With over 12 years of experience, she holds the prestigious title of Shastracharya and provides meaningful guidance on career, relationships, health, finances, and personal growth.",
      bio3: "Her compassionate approach and commitment to authentic Vedic principles have made her a trusted advisor. Through her consultations, she continues to inspire transformation and empower people to align with their true potential.",
      developerLinkTitle: "Developer",
      developerLinkDesc: "Meet the technologist behind AstroKnowledge — web development, platform management & AI integration.",
      developerLinkCta: "View Developer Profile",
    },
    contact: {
      title: "Contact Us",
      subtitle: "Reach us for consultations, courses, and spiritual guidance",
      phone: "Phone",
      whatsapp: "WhatsApp",
      email: "Email",
      address: "Address",
      hours: "Hours",
      openMaps: "Open in Google Maps",
      whatsappButton: "Message us on WhatsApp",
    },
    booking: {
      title: "Available Booking Slots",
      selectService: "Select Service",
      chooseService: "Choose a service...",
      selectSlot: "Select a time slot for your consultation",
      yourBookings: "Your Booked Slots",
      pendingConfirm: "Pending Confirmation",
      confirmed: "Booking Confirmed",
      noSlots: "No slots available right now. Please check back later.",
      loading: "Loading...",
      duration: "Duration",
    },
    admin: {
      slotsTitle: "Booking Slots",
      slotsSubtitle: "Create, manage, and confirm consultation time slots",
      openSlots: "Open Slots",
      bookedSlots: "Booked Slots",
      pendingSlots: "Pending Confirmation",
      addSlot: "Add Slot",
      date: "Date",
      time: "Time",
      duration: "Slot Duration",
      customDuration: "Custom duration",
      searchDate: "Search by date",
      searchClient: "Search by client name",
      searchService: "Filter by service",
      allServices: "All Services",
      confirm: "Confirm Booking",
      reject: "Reject",
      release: "Release",
      block: "Block",
      delete: "Delete",
      pendingAlert: "new booking(s) awaiting confirmation",
      usersTitle: "User Management",
      usersSubtitle: "View and manage registered users",
      searchUser: "Search by name or email",
      filterRole: "Filter by role",
      allRoles: "All Roles",
      admin: "Admin",
      user: "User",
      paymentsTitle: "Payment Management",
      paymentsSubtitle: "Track order and consultation payments",
      filterStatus: "Payment status",
      filterType: "Payment type",
      allStatuses: "All Statuses",
      allTypes: "All Types",
      order: "Product Order",
      slot: "Slot Booking",
      amount: "Amount",
      markPaid: "Mark Paid",
      markPending: "Mark Pending",
      noResults: "No results found",
    },
    common: {
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      search: "Search",
      filter: "Filter",
      login: "Login",
      register: "Register",
      logout: "Logout",
      welcome: "Welcome",
      quickActions: "Quick Actions",
      shopProducts: "Shop Products",
      myBookings: "My Bookings",
      myOrders: "My Orders",
      profile: "Profile",
      bookSlot: "Book a Slot",
      spiritualProducts: "Spiritual Products",
      authenticProducts: "100% authentic, energized spiritual products",
      expertVedic: "Expert Vedic Astrology",
      vedicWisdom: "Vedic Wisdom",
      discountBanner: "Expert Vedic Astrology — Code",
      loginRegister: "Login / Register",
    },
  },
  hi: {
    hero: {
      badge: "विश्वसनीय वैदिक ज्योतिष",
      clients: "+ ग्राहक",
      title: "विशेषज्ञ वैदिक ज्योतिष",
      subtitle: "",
      typing: [
        "कुंडली विश्लेषण और जन्म कुंडली विश्लेषण",
        "व्यक्तिगत वैदिक उपाय मार्गदर्शन",
        "विवाह अनुकूलता और कुंडली मिलान",
        "वास्तु शास्त्र और अंक ज्योतिष मार्गदर्शन",
        "प्रामाणिक आध्यात्मिक उत्पाद और रत्न",
      ],
      yearsLabel: "वर्षों का अनुभव",
      clientsLabel: "खुश ग्राहक",
      ratingLabel: "/5 रेटिंग",
      descTail: "करियर, विवाह, स्वास्थ्य और वित्त पर व्यक्तिगत अंतर्दृष्टि प्राप्त करें।",
      bookConsultation: "परामर्श बुक करें",
      whatsapp: "व्हाट्सएप",
      years: "वर्ष",
      rating: "/5 रेटिंग",
      support: "२४/७ सहायता",
    },
    trustBadges: [
      { title: "१००% प्रमाणित", sub: "प्रयोगशाला परीक्षित" },
      { title: "ऊर्जावान", sub: "वैदिक पंडित द्वारा" },
      { title: "तेज़ शिपिंग", sub: "पूरे भारत में" },
      { title: "सुरक्षित भुगतान", sub: "UPI, कार्ड, COD" },
      { title: "प्रामाणिक उत्पाद", sub: "प्रयोगशाला परीक्षित" },
      { title: "वैदिक आशीर्वाद", sub: "पंडित द्वारा ऊर्जावान" },
    ],
    sections: {
      servicesTitle: "हमारी परामर्श सेवाएं",
      servicesSubtitle: "टेलीफोनिक परामर्श और विस्तृत कुंडली विश्लेषण के माध्यम से व्यक्तिगत मार्गदर्शन।",
      coursesTitle: "ज्योतिष पाठ्यक्रम",
      coursesSubtitle: "आचार्य सीमा लोहिया से प्रामाणिक वैदिक विज्ञान सीखें।",
      productsTitle: "हमारे उत्पाद देखें",
      productsSubtitle: "आपकी भलाई और आध्यात्मिक विकास के लिए प्रामाणिक, ऊर्जावान आध्यात्मिक उत्पाद।",
      productsBtn: "सभी उत्पाद देखें",
      problemsTitle: "जीवन की समस्याओं के अनुसार खरीदें",
      problemsSubtitle: "अपनी जीवन की चुनौतियों के अनुरूप उपाय और मार्गदर्शन खोजें।",
      reviewsTitle: "ग्राहक समीक्षाएं",
      reviewsSubtitle: "हमारे ग्राहक अपने परिवर्तनकारी अनुभवों के बारे में क्या कहते हैं।",
      faqBadge: "प्रश्न हैं?",
      faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
      faqSubtitle: "विशेषज्ञ उत्तर — वैदिक ज्योतिष का वर्षों का अनुभव।",
      cosmicTitle: "ब्रह्मांडीय तत्व",
      cosmicSubtitle: "पांच तत्वों को समझें जो आपकी नियति को आकार देते हैं।",
      navgrahaTitle: "नवग्रह — नौ ग्रह",
      navgrahaHint: "किसी भी ग्रह पर टैप करें और उसका वैदिक महत्व जानें",
      navgrahaGoverns: "यह क्या नियंत्रित करता है",
      navgrahaInfluences: "मुख्य प्रभाव",
      navgrahaRemedy: "वैदिक उपाय",
      navgrahaDay: "दिन",
      navgrahaGemstone: "रत्न",
      navgrahaNature: "प्रकृति",
      achievementsBadge: "विश्वास और विशेषज्ञता",
      achievementsSubtitle: "वैदिक ज्योतिष में ग्राहक सफलता की कहानियां और उपलब्धियां",
      happyClients: "हमारे संतुष्ट ग्राहक",
      popular: "लोकप्रिय",
      viewAll: "सभी देखें",
      viewAllServices: "सभी सेवाएं देखें",
      viewAllCourses: "सभी पाठ्यक्रम देखें",
      energized: "ऊर्जावान",
      addToCart: "कार्ट में जोड़ें",
      add: "जोड़ें",
      sale: "बिक्री",
      deliveryAvailable: "डिलीवरी उपलब्ध",
      certified: "प्रमाणित",
    },
    footer: {
      ourServices: "हमारी सेवाएं",
      shopByCategory: "श्रेणी के अनुसार खरीदें",
      quickLinks: "त्वरित लिंक",
      contactUs: "संपर्क करें",
      mission: "",
      terms: "नियम",
      privacy: "गोपनीयता",
      shipping: "शिपिंग",
      refund: "रिफंड",
      rights: "सर्वाधिकार सुरक्षित।",
      badges: ["१००% प्रमाणित", "वैदिक पंडित द्वारा ऊर्जावान", "प्रामाणिक उत्पाद", "सुरक्षित भुगतान जल्द आ रहा है"],
      links: {
        kundali: "कुंडली विश्लेषण",
        kundliMilan: "कुंडली मिलान",
        vastu: "वास्तु परामर्श",
        numerology: "अंक ज्योतिष",
        courses: "पाठ्यक्रम",
        pooja: "पूजा सेवाएं",
        rudraksha: "रुद्राक्ष",
        gemstone: "रत्न",
        yantra: "यंत्र",
        poojaKit: "पूजा किट",
        vastuItems: "वास्तु सामग्री",
        about: "परिचय",
        contact: "संपर्क",
        bookConsultation: "परामर्श बुक करें",
        blog: "ब्लॉग",
      },
    },
    faqs: [
      { q: "एस्ट्रोनॉलेज का सर्वश्रेष्ठ ज्योतिषी कौन है?", a: "आचार्य सीमा लोहिया एस्ट्रोनॉलेज की मुख्य ज्योतिषी हैं, जिनके 12 वर्षों का अनुभव और 75,000+ खुश ग्राहक हैं। वे कुंडली विश्लेषण, कुंडली मिलान, वास्तु शास्त्र, अंक ज्योतिष और दोष विश्लेषण में विशेषज्ञ हैं।" },
      { q: "मैं ऑनलाइन ज्योतिषी से कैसे परामर्श ले सकता हूं?", a: "आप हमारे बुकिंग पेज के माध्यम से एक-पर-एक टेलीफोनिक परामर्श बुक कर सकते हैं। प्रत्येक परामर्श में विस्तृत कुंडली विश्लेषण, दोष पहचान और व्यक्तिगत वैदिक उपाय शामिल हैं।" },
      { q: "एस्ट्रोनॉलेज क्या सेवाएं प्रदान करता है?", a: "एस्ट्रोनॉलेज कुंडली विश्लेषण, कुंडली मिलान, वास्तु परामर्श, अंक ज्योतिष, प्रश्न पूछें, हस्तरेखा, पूजा सेवाएं और आध्यात्मिक उत्पाद प्रदान करता है।" },
      { q: "क्या ऑनलाइन ज्योतिष परामर्श सटीक है?", a: "हां। ऑनलाइन परामर्श उतना ही सटीक है क्योंकि वैदिक ज्योतिष आपके जन्म विवरण पर आधारित है, शारीरिक उपस्थिति पर नहीं। आचार्य सीमा लोहिया ने 75,000+ परामर्श पूरे किए हैं।" },
      { q: "क्या आपके आध्यात्मिक उत्पाद प्रामाणिक हैं?", a: "सभी उत्पाद 100% प्रामाणिक हैं, जहां लागू हो वहां प्रयोगशाला परीक्षित, और शिपिंग से पहले वैदिक पंडितों द्वारा ऊर्जावान किए जाते हैं।" },
      { q: "परामर्श का समय क्या है?", a: "परामर्श सोमवार से शनिवार, सुबह 9:00 से रात 8:00 बजे तक उपलब्ध हैं। आप व्हाट्सएप पर भी संपर्क कर सकते हैं।" },
    ],
    about: {
      journeyTitle: "बुद्धि और आध्यात्म",
      journeyTitleAccent: "की यात्रा",
      missionTitle: "हमारा मिशन",
      missionText: "प्रामाणिक वैदिक ज्ञान के माध्यम से जीवन को प्रकाशित करना, सटीक ज्योतिषीय मार्गदर्शन और वास्तविक आध्यात्मिक उत्पाद प्रदान करना।",
      happyClients: "खुश ग्राहक",
      yearsExp: "वर्षों का अनुभव",
      bookConsultation: "परामर्श बुक करें",
      shastracharya: "शास्त्राचार्य",
      bio1: "आचार्य सीमा लोहिया की ज्योतिष यात्रा बुद्धि, आध्यात्मिकता और नियति का अद्भुत संगम है। कंप्यूटर विज्ञान में करियर शुरू करने के बाद, उन्होंने ज्योतिष विज्ञान को अपना जीवन उद्देश्य बनाया।",
      bio2: "१२ से अधिक वर्षों के अनुभव के साथ, वे शास्त्राचार्य की उपाधि धारण करती हैं और करियर, संबंध, स्वास्थ्य, वित्त और व्यक्तिगत विकास पर सार्थक मार्गदर्शन देती हैं।",
      bio3: "उनका करुणामय दृष्टिकोण और प्रामाणिक वैदिक सिद्धांतों के प्रति समर्पण उन्हें विश्वसनीय सलाहकार बनाता है। परामर्श के माध्यम से वे परिवर्तन प्रेरित करती हैं और लोगों को उनकी सच्ची क्षमता से जोड़ती हैं।",
      developerLinkTitle: "डेवलपर",
      developerLinkDesc: "AstroKnowledge के पीछे के तकनीशियन से मिलें — वेब विकास, प्लेटफ़ॉर्म प्रबंधन और AI एकीकरण।",
      developerLinkCta: "डेवलपर प्रोफ़ाइल देखें",
    },
    contact: {
      title: "संपर्क करें",
      subtitle: "परामर्श, पाठ्यक्रम और आध्यात्मिक मार्गदर्शन के लिए संपर्क करें",
      phone: "फ़ोन",
      whatsapp: "व्हाट्सएप",
      email: "ईमेल",
      address: "पता",
      hours: "समय",
      openMaps: "गूगल मैप्स में खोलें",
      whatsappButton: "व्हाट्सएप पर संदेश भेजें",
    },
    booking: {
      title: "उपलब्ध बुकिंग स्लॉट",
      selectService: "सेवा चुनें",
      chooseService: "एक सेवा चुनें...",
      selectSlot: "अपने परामर्श के लिए समय स्लॉट चुनें",
      yourBookings: "आपके बुक किए गए स्लॉट",
      pendingConfirm: "पुष्टि लंबित",
      confirmed: "बुकिंग पुष्टि हो गई",
      noSlots: "अभी कोई स्लॉट उपलब्ध नहीं है। बाद में देखें।",
      loading: "लोड हो रहा है...",
      duration: "अवधि",
    },
    admin: {
      slotsTitle: "बुकिंग स्लॉट",
      slotsSubtitle: "परामर्श समय स्लॉट बनाएं, प्रबंधित करें और पुष्टि करें",
      openSlots: "खुले स्लॉट",
      bookedSlots: "बुक किए गए स्लॉट",
      pendingSlots: "पुष्टि लंबित",
      addSlot: "स्लॉट जोड़ें",
      date: "तारीख",
      time: "समय",
      duration: "स्लॉट अवधि",
      customDuration: "कस्टम अवधि",
      searchDate: "तारीख से खोजें",
      searchClient: "ग्राहक नाम से खोजें",
      searchService: "सेवा से फ़िल्टर",
      allServices: "सभी सेवाएं",
      confirm: "बुकिंग पुष्टि करें",
      reject: "अस्वीकार",
      release: "रिलीज़",
      block: "ब्लॉक",
      delete: "हटाएं",
      pendingAlert: "नई बुकिंग पुष्टि की प्रतीक्षा में",
      usersTitle: "उपयोगकर्ता प्रबंधन",
      usersSubtitle: "पंजीकृत उपयोगकर्ताओं को देखें और प्रबंधित करें",
      searchUser: "नाम या ईमेल से खोजें",
      filterRole: "भूमिका से फ़िल्टर",
      allRoles: "सभी भूमिकाएं",
      admin: "एडमिन",
      user: "उपयोगकर्ता",
      paymentsTitle: "भुगतान प्रबंधन",
      paymentsSubtitle: "ऑर्डर और परामर्श भुगतान ट्रैक करें",
      filterStatus: "भुगतान स्थिति",
      filterType: "भुगतान प्रकार",
      allStatuses: "सभी स्थितियां",
      allTypes: "सभी प्रकार",
      order: "उत्पाद ऑर्डर",
      slot: "स्लॉट बुकिंग",
      amount: "राशि",
      markPaid: "भुगतान किया चिह्नित करें",
      markPending: "लंबित चिह्नित करें",
      noResults: "कोई परिणाम नहीं मिला",
    },
    common: {
      loading: "लोड हो रहा है...",
      save: "सहेजें",
      cancel: "रद्द करें",
      search: "खोजें",
      filter: "फ़िल्टर",
      login: "लॉगिन",
      register: "पंजीकरण",
      logout: "लॉगआउट",
      welcome: "स्वागत है",
      quickActions: "त्वरित कार्य",
      shopProducts: "उत्पाद खरीदें",
      myBookings: "मेरी बुकिंग",
      myOrders: "मेरे ऑर्डर",
      profile: "प्रोफ़ाइल",
      bookSlot: "स्लॉट बुक करें",
      spiritualProducts: "आध्यात्मिक उत्पाद",
      authenticProducts: "100% प्रामाणिक, ऊर्जावान आध्यात्मिक उत्पाद",
      expertVedic: "विशेषज्ञ वैदिक ज्योतिष",
      vedicWisdom: "वैदिक ज्ञान",
      discountBanner: "विशेषज्ञ वैदिक ज्योतिष — कोड",
      loginRegister: "लॉगिन / पंजीकरण",
    },
  },
};

export function localizedTitle(item: { title?: string; titleHindi?: string; name?: string; nameHindi?: string }, lang: Lang) {
  if (lang === "hi") return item.titleHindi || item.nameHindi || item.title || item.name || "";
  return item.title || item.name || "";
}

export function localizedDesc(item: { id?: string; description?: string; descriptionHindi?: string }, lang: Lang) {
  if (lang === "hi") {
    if (item.descriptionHindi) return item.descriptionHindi;
    if (item.id && CATALOG_HINDI[item.id]?.description) return CATALOG_HINDI[item.id].description;
  }
  return item.description || "";
}

export function localizedSessionDesc(
  item: { id?: string; sessionDescription?: string; sessionDescriptionHindi?: string },
  lang: Lang
) {
  if (lang === "hi") {
    if (item.sessionDescriptionHindi) return item.sessionDescriptionHindi;
    if (item.id && CATALOG_HINDI[item.id]?.sessionDescription) return CATALOG_HINDI[item.id].sessionDescription;
  }
  return item.sessionDescription || "";
}

export function localizedFeatures(
  item: { id?: string; features?: string[]; featuresHindi?: string[] },
  lang: Lang
): string[] {
  if (lang === "hi") {
    if (item.featuresHindi?.length) return item.featuresHindi;
    if (item.id && CATALOG_HINDI[item.id]?.features?.length) return CATALOG_HINDI[item.id].features!;
  }
  return item.features || [];
}

export function localizedBenefits(
  item: { id?: string; benefits?: string[]; benefitsHindi?: string[] },
  lang: Lang
): string[] {
  if (lang === "hi") {
    if (item.benefitsHindi?.length) return item.benefitsHindi;
    if (item.id && CATALOG_HINDI[item.id]?.benefits?.length) return CATALOG_HINDI[item.id].benefits!;
  }
  return item.benefits || [];
}
