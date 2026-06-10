import { Lang } from "./translations";

type Policy = { title: string; sections: { heading: string; content: string }[] };

export const legalContent: Record<"terms" | "privacy" | "shipping" | "refund", Record<Lang, Policy>> = {
  terms: {
    en: {
      title: "Terms & Conditions",
      sections: [
        { heading: "Acceptance of Terms", content: "By accessing and using AstroKnowledge website and services, you agree to be bound by these Terms and Conditions. All astrology consultations are for guidance purposes and should not replace professional medical, legal, or financial advice." },
        { heading: "Services", content: "AstroKnowledge provides Vedic astrology consultations, spiritual products, and related services through Acharya Seema Lohiya and associated Vedic Pandits. All consultations are conducted via telephone or online platforms." },
        { heading: "Booking & Cancellation", content: "Consultation bookings can be rescheduled with 24 hours notice. Cancellations made less than 24 hours before the scheduled time may incur a cancellation fee of 25% of the consultation price." },
        { heading: "Intellectual Property", content: "All content on this website including text, images, horoscope reports, and blog articles are the intellectual property of AstroKnowledge and may not be reproduced without written permission." },
        { heading: "Limitation of Liability", content: "AstroKnowledge and Acharya Seema Lohiya shall not be liable for any decisions made based on astrological consultations. Results may vary and astrology is a guidance tool, not a guarantee of outcomes." },
      ],
    },
    hi: {
      title: "नियम और शर्तें",
      sections: [
        { heading: "शर्तों की स्वीकृति", content: "एस्ट्रोनॉलेज वेबसाइट और सेवाओं का उपयोग करके, आप इन नियमों और शर्तों से बंधे होने के लिए सहमत हैं। सभी ज्योतिष परामर्श मार्गदर्शन के उद्देश्य से हैं और पेशेवर चिकित्सा, कानूनी या वित्तीय सलाह का स्थान नहीं ले सकते।" },
        { heading: "सेवाएं", content: "एस्ट्रोनॉलेज आचार्य सीमा लोहिया और संबद्ध वैदिक पंडितों के माध्यम से वैदिक ज्योतिष परामर्श, आध्यात्मिक उत्पाद और संबंधित सेवाएं प्रदान करता है। सभी परामर्श टेलीफोन या ऑनलाइन प्लेटफॉर्म के माध्यम से किए जाते हैं।" },
        { heading: "बुकिंग और रद्दीकरण", content: "परामर्श बुकिंग 24 घंटे की सूचना के साथ पुनर्निर्धारित की जा सकती है। निर्धारित समय से 24 घंटे से कम पहले रद्दीकरण पर परामर्श मूल्य का 25% रद्दीकरण शुल्क लग सकता है।" },
        { heading: "बौद्धिक संपदा", content: "इस वेबसाइट की सभी सामग्री जिसमें पाठ, छवियां, कुंडली रिपोर्ट और ब्लॉग लेख शामिल हैं, एस्ट्रोनॉलेज की बौद्धिक संपदा हैं और लिखित अनुमति के बिना पुनरुत्पादित नहीं की जा सकतीं।" },
        { heading: "दायित्व की सीमा", content: "ज्योतिषीय परामर्श के आधार पर लिए गए निर्णयों के लिए एस्ट्रोनॉलेज और आचार्य सीमा लोहिया उत्तरदायी नहीं होंगे। परिणाम भिन्न हो सकते हैं और ज्योतिष मार्गदर्शन का साधन है, परिणाम की गारंटी नहीं।" },
      ],
    },
  },
  privacy: {
    en: {
      title: "Privacy Policy",
      sections: [
        { heading: "Information We Collect", content: "We collect personal information including name, email, phone number, date of birth, time of birth, and place of birth for astrology consultations. Payment information will be collected securely when payment gateway is integrated." },
        { heading: "How We Use Your Information", content: "Your birth details are used exclusively for generating accurate horoscope analysis and Kundali reports. We do not sell or share your personal information with third parties for marketing purposes." },
        { heading: "Data Security", content: "We implement industry-standard security measures to protect your personal data. All consultation records are kept confidential and accessible only to authorized AstroKnowledge staff." },
        { heading: "Cookies", content: "Our website uses cookies for authentication, cart functionality, and improving user experience. You can disable cookies in your browser settings, though some features may not work properly." },
        { heading: "Contact", content: "For privacy-related inquiries, contact us at astroknowledge01@gmail.com or call +91 8949265869." },
      ],
    },
    hi: {
      title: "गोपनीयता नीति",
      sections: [
        { heading: "हम जो जानकारी एकत्र करते हैं", content: "ज्योतिष परामर्श के लिए हम नाम, ईमेल, फ़ोन नंबर, जन्म तिथि, जन्म समय और जन्म स्थान सहित व्यक्तिगत जानकारी एकत्र करते हैं। भुगतान गेटवे एकीकृत होने पर भुगतान जानकारी सुरक्षित रूप से एकत्र की जाएगी।" },
        { heading: "हम आपकी जानकारी का उपयोग कैसे करते हैं", content: "आपके जन्म विवरण का उपयोग विशेष रूप से सटीक कुंडली विश्लेषण और रिपोर्ट बनाने के लिए किया जाता है। हम मार्केटिंग उद्देश्यों के लिए आपकी व्यक्तिगत जानकारी तीसरे पक्ष को नहीं बेचते या साझा नहीं करते।" },
        { heading: "डेटा सुरक्षा", content: "हम आपके व्यक्तिगत डेटा की सुरक्षा के लिए उद्योग-मानक सुरक्षा उपाय लागू करते हैं। सभी परामर्श रिकॉर्ड गोपनीय रखे जाते हैं और केवल अधिकृत एस्ट्रोनॉलेज कर्मचारियों द्वारा एक्सेस किए जा सकते हैं।" },
        { heading: "कुकीज़", content: "हमारी वेबसाइट प्रमाणीकरण, कार्ट कार्यक्षमता और उपयोगकर्ता अनुभव सुधारने के लिए कुकीज़ का उपयोग करती है। आप ब्राउज़र सेटिंग्स में कुकीज़ अक्षम कर सकते हैं, हालांकि कुछ सुविधाएं ठीक से काम नहीं कर सकतीं।" },
        { heading: "संपर्क", content: "गोपनीयता संबंधी पूछताछ के लिए astroknowledge01@gmail.com पर संपर्क करें या +91 8949265869 पर कॉल करें।" },
      ],
    },
  },
  shipping: {
    en: {
      title: "Shipping Policy",
      sections: [
        { heading: "Shipping Charges", content: "Standard shipping charges apply across India based on product weight and delivery location. Shipping costs are calculated at checkout." },
        { heading: "Processing Time", content: "All spiritual products are energized by Vedic Pandits before shipping. Processing takes 1-2 business days. You will receive a confirmation email once your order is shipped." },
        { heading: "Delivery Timeline", content: "Standard delivery takes 5-7 business days for metro cities and 7-10 business days for other locations. Express delivery (2-3 days) is available at additional cost." },
        { heading: "International Shipping", content: "We ship to USA, UK, Canada, Australia, and UAE. International shipping charges apply and delivery takes 10-15 business days. Customs duties may apply in the destination country." },
        { heading: "Tracking", content: "Once shipped, you will receive a tracking number via email and SMS. Track your order status in your user dashboard." },
      ],
    },
    hi: {
      title: "शिपिंग नीति",
      sections: [
        { heading: "शिपिंग शुल्क", content: "उत्पाद के वजन और डिलीवरी स्थान के आधार पर पूरे भारत में मानक शिपिंग शुल्क लागू होते हैं। शिपिंग लागत चेकआउट पर गणना की जाती है।" },
        { heading: "प्रोसेसिंग समय", content: "सभी आध्यात्मिक उत्पाद शिपिंग से पहले वैदिक पंडितों द्वारा ऊर्जावान किए जाते हैं। प्रोसेसिंग में 1-2 कार्य दिवस लगते हैं। ऑर्डर शिप होने पर आपको पुष्टि ईमेल मिलेगा।" },
        { heading: "डिलीवरी समय", content: "मेट्रो शहरों में मानक डिलीवरी 5-7 कार्य दिवस और अन्य स्थानों पर 7-10 कार्य दिवस लेती है। अतिरिक्त लागत पर एक्सप्रेस डिलीवरी (2-3 दिन) उपलब्ध है।" },
        { heading: "अंतर्राष्ट्रीय शिपिंग", content: "हम USA, UK, Canada, Australia और UAE में शिप करते हैं। अंतर्राष्ट्रीय शिपिंग शुल्क लागू होते हैं और डिलीवरी में 10-15 कार्य दिवस लगते हैं। गंतव्य देश में सीमा शुल्क लागू हो सकते हैं।" },
        { heading: "ट्रैकिंग", content: "शिप होने के बाद, आपको ईमेल और SMS के माध्यम से ट्रैकिंग नंबर मिलेगा। अपने उपयोगकर्ता डैशबोर्ड में ऑर्डर स्थिति ट्रैक करें।" },
      ],
    },
  },
  refund: {
    en: {
      title: "Refund Policy",
      sections: [
        { heading: "Consultation Refunds", content: "If you are unsatisfied with your consultation, contact us within 48 hours. We offer a one-time complimentary follow-up session or partial refund at our discretion." },
        { heading: "Product Returns", content: "Spiritual products in original, unused condition can be returned within 7 days of delivery. Energized items that have been used in worship cannot be returned due to spiritual sanctity." },
        { heading: "Defective Products", content: "If you receive a defective or damaged product, contact us within 48 hours with photos. We will arrange a free replacement or full refund including shipping costs." },
        { heading: "Refund Processing", content: "Approved refunds are processed within 5-7 business days to the original payment method. For COD orders, refunds are issued via bank transfer or store credit." },
      ],
    },
    hi: {
      title: "रिफंड नीति",
      sections: [
        { heading: "परामर्श रिफंड", content: "यदि आप अपने परामर्श से असंतुष्ट हैं, तो 48 घंटे के भीतर संपर्क करें। हम अपने विवेक पर एक बार की निःशुल्क फॉलो-अप सत्र या आंशिक रिफंड प्रदान करते हैं।" },
        { heading: "उत्पाद वापसी", content: "मूल, अप्रयुक्त स्थिति में आध्यात्मिक उत्पाद डिलीवरी के 7 दिनों के भीतर वापस किए जा सकते हैं। पूजा में उपयोग किए गए ऊर्जावान उत्पाद आध्यात्मिक पवित्रता के कारण वापस नहीं किए जा सकते।" },
        { heading: "दोषपूर्ण उत्पाद", content: "यदि आपको दोषपूर्ण या क्षतिग्रस्त उत्पाद मिलता है, तो 48 घंटे के भीतर फोटो के साथ संपर्क करें। हम मुफ्त प्रतिस्थापन या शिपिंग लागत सहित पूर्ण रिफंड की व्यवस्था करेंगे।" },
        { heading: "रिफंड प्रोसेसिंग", content: "स्वीकृत रिफंड 5-7 कार्य दिवसों में मूल भुगतान विधि में प्रोसेस किए जाते हैं। COD ऑर्डर के लिए, रिफंड बैंक ट्रांसफर या स्टोर क्रेडिट के माध्यम से जारी किए जाते हैं।" },
      ],
    },
  },
};
