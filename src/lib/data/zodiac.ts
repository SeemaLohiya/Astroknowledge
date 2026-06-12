export interface ZodiacSignDetail {
  id: string;
  sign: string;
  hindi: string;
  symbol: string;
  dates: string;
  element: string;
  elementHindi: string;
  ruler: string;
  rulerHindi: string;
  nature: string;
  strengths: string[];
  challenges: string[];
  description: string;
  descriptionHindi: string;
  luckyGem: string;
  luckyDay: string;
  color: string;
}

export const ZODIAC_DETAILS: ZodiacSignDetail[] = [
  {
    id: "aries",
    sign: "Aries",
    hindi: "मेष",
    symbol: "♈",
    dates: "Mar 21 – Apr 19",
    element: "Fire",
    elementHindi: "अग्नि",
    ruler: "Mars (Mangal)",
    rulerHindi: "मंगल",
    nature: "Cardinal · Mesha Rashi",
    strengths: ["Bold leadership", "Quick decision-making", "Courage under pressure", "Pioneering spirit"],
    challenges: ["Impatience", "Impulsive reactions", "Restlessness in long projects"],
    description:
      "Aries (Mesha) is the first sign of the zodiac — energetic, direct, and action-oriented. Mars as lord gives strong willpower, athletic vitality, and a natural urge to initiate. Aries natives excel when they channel passion into disciplined goals rather than conflict.",
    descriptionHindi:
      "मेष राशि ज्योतिष चक्र की पहली राशि है — ऊर्जावान, साहसी और कर्मठ। मंगल स्वामी होने से इनमें नेतृत्व, साहस और नई शुरुआत की प्रवृत्ति होती है। धैर्य और संयम से ये अपनी ऊर्जा को बहुत सफल बना सकते हैं।",
    luckyGem: "Red Coral (Moonga)",
    luckyDay: "Tuesday",
    color: "#EF4444",
  },
  {
    id: "taurus",
    sign: "Taurus",
    hindi: "वृषभ",
    symbol: "♉",
    dates: "Apr 20 – May 20",
    element: "Earth",
    elementHindi: "पृथ्वी",
    ruler: "Venus (Shukra)",
    rulerHindi: "शुक्र",
    nature: "Fixed · Vrishabha Rashi",
    strengths: ["Financial stability", "Patience", "Loyalty", "Aesthetic sense"],
    challenges: ["Stubbornness", "Resistance to change", "Over-attachment to comfort"],
    description:
      "Taurus (Vrishabha) is ruled by Venus, bringing love for beauty, comfort, and lasting value. These natives build slowly but surely — strong for wealth, property, arts, and relationships. Stability is their gift; flexibility is their growth path.",
    descriptionHindi:
      "वृषभ राशि का स्वामी शुक्र है, जो सौंदर्य, स्थिरता और भौतिक सुख देता है। ये लोग धैर्य से काम करते हैं और धन, संपत्ति व संबंधों में मजबूत होते हैं। परिवर्तन को स्वीकार करना इनके लिए विकास का मार्ग है।",
    luckyGem: "Diamond / White Sapphire",
    luckyDay: "Friday",
    color: "#22C55E",
  },
  {
    id: "gemini",
    sign: "Gemini",
    hindi: "मिथुन",
    symbol: "♊",
    dates: "May 21 – Jun 20",
    element: "Air",
    elementHindi: "वायु",
    ruler: "Mercury (Budh)",
    rulerHindi: "बुध",
    nature: "Mutable · Mithuna Rashi",
    strengths: ["Communication", "Adaptability", "Quick learning", "Networking"],
    challenges: ["Scattered focus", "Indecision", "Superficiality if ungrounded"],
    description:
      "Gemini (Mithuna) is Mercury-ruled — witty, curious, and mentally agile. They thrive in writing, teaching, sales, and technology. Dual nature means versatility; grounding practices help them finish what they start.",
    descriptionHindi:
      "मिथुन राशि बुध ग्रह की है — बुद्धिमान, वाचाल और अनुकूलनशील। लेखन, शिक्षण, व्यापार और तकनीक में इन्हें सफलता मिलती है। एकाग्रता और धैर्य से ये अपनी प्रतिभा को और निखारते हैं।",
    luckyGem: "Emerald (Panna)",
    luckyDay: "Wednesday",
    color: "#60A5FA",
  },
  {
    id: "cancer",
    sign: "Cancer",
    hindi: "कर्क",
    symbol: "♋",
    dates: "Jun 21 – Jul 22",
    element: "Water",
    elementHindi: "जल",
    ruler: "Moon (Chandra)",
    rulerHindi: "चंद्र",
    nature: "Cardinal · Karka Rashi",
    strengths: ["Emotional intelligence", "Nurturing nature", "Strong intuition", "Family devotion"],
    challenges: ["Mood swings", "Over-sensitivity", "Clinging to the past"],
    description:
      "Cancer (Karka) is Moon-ruled — deeply feeling, protective, and home-oriented. They excel in caregiving, hospitality, and creative fields. Emotional security fuels their success; lunar remedies strengthen clarity.",
    descriptionHindi:
      "कर्क राशि चंद्रमा की है — संवेदनशील, मातृभावुक और परिवार-प्रेमी। देखभाल, आतिथ्य और रचनात्मक कार्यों में ये विशेष रूप से सफल होते हैं। मानसिक शांति और चंद्र उपाय इनके लिए लाभकारी हैं।",
    luckyGem: "Pearl (Moti)",
    luckyDay: "Monday",
    color: "#818CF8",
  },
  {
    id: "leo",
    sign: "Leo",
    hindi: "सिंह",
    symbol: "♌",
    dates: "Jul 23 – Aug 22",
    element: "Fire",
    elementHindi: "अग्नि",
    ruler: "Sun (Surya)",
    rulerHindi: "सूर्य",
    nature: "Fixed · Simha Rashi",
    strengths: ["Charisma", "Generosity", "Creative leadership", "Confidence"],
    challenges: ["Ego clashes", "Need for validation", "Dramatic tendencies"],
    description:
      "Leo (Simha) is ruled by the Sun — radiant, dignified, and born to lead. Natural performers and managers, they shine when ego serves purpose rather than pride. Sun worship and discipline amplify their golden qualities.",
    descriptionHindi:
      "सिंह राशि सूर्य की है — तेजस्वी, गरिमापूर्ण और नेतृत्व करने वाली। ये प्रदर्शन, प्रबंधन और सार्वजनिक कार्यों में उत्कृष्ट होते हैं। अहंकार को संयम में रखकर ये असली उन्नति करते हैं।",
    luckyGem: "Ruby (Manik)",
    luckyDay: "Sunday",
    color: "#F59E0B",
  },
  {
    id: "virgo",
    sign: "Virgo",
    hindi: "कन्या",
    symbol: "♍",
    dates: "Aug 23 – Sep 22",
    element: "Earth",
    elementHindi: "पृथ्वी",
    ruler: "Mercury (Budh)",
    rulerHindi: "बुध",
    nature: "Mutable · Kanya Rashi",
    strengths: ["Analytical mind", "Attention to detail", "Service orientation", "Health awareness"],
    challenges: ["Over-criticism", "Worry", "Perfectionism paralysis"],
    description:
      "Virgo (Kanya) is Mercury-ruled with earthy precision — excellent in medicine, accounting, editing, and quality control. Their gift is refinement; self-compassion prevents burnout from impossible standards.",
    descriptionHindi:
      "कन्या राशि बुध और पृथ्वी तत्व की है — विश्लेषणात्मक, सटीक और सेवा-भावी। चिकित्सा, लेखा, संपादन और गुणवत्ता नियंत्रण में ये विशेषज्ञ होते हैं। आत्म-करुणा इनके लिए आवश्यक है।",
    luckyGem: "Emerald (Panna)",
    luckyDay: "Wednesday",
    color: "#10B981",
  },
  {
    id: "libra",
    sign: "Libra",
    hindi: "तुला",
    symbol: "♎",
    dates: "Sep 23 – Oct 22",
    element: "Air",
    elementHindi: "वायु",
    ruler: "Venus (Shukra)",
    rulerHindi: "शुक्र",
    nature: "Cardinal · Tula Rashi",
    strengths: ["Diplomacy", "Fair judgment", "Artistic taste", "Partnership skills"],
    challenges: ["Indecision", "People-pleasing", "Avoiding confrontation"],
    description:
      "Libra (Tula) seeks balance under Venus — graceful, just, and relationship-focused. Strong in law, design, counseling, and luxury trades. Decisive action at the right time transforms their natural harmony into achievement.",
    descriptionHindi:
      "तुला राशि शुक्र की है — संतुलन, न्याय और सौंदर्य प्रेमी। कानून, डिज़ाइन, परामर्श और साझेदारी में ये सफल होते हैं। सही समय पर निर्णय लेना इनकी सफलता की कुंजी है।",
    luckyGem: "Diamond / Opal",
    luckyDay: "Friday",
    color: "#EC4899",
  },
  {
    id: "scorpio",
    sign: "Scorpio",
    hindi: "वृश्चिक",
    symbol: "♏",
    dates: "Oct 23 – Nov 21",
    element: "Water",
    elementHindi: "जल",
    ruler: "Mars & Ketu",
    rulerHindi: "मंगल व केतु",
    nature: "Fixed · Vrishchika Rashi",
    strengths: ["Deep focus", "Resilience", "Research ability", "Transformative power"],
    challenges: ["Secrecy", "Jealousy", "Emotional intensity"],
    description:
      "Scorpio (Vrishchika) is intense and penetrating — ruled by Mars with Ketu's mystical edge. Masters of investigation, healing, occult sciences, and crisis management. Channeling passion constructively unlocks rebirth and lasting power.",
    descriptionHindi:
      "वृश्चिक राशि गहन और शक्तिशाली है — मंगल और केतु का प्रभाव। अनुसंधान, चिकित्सा, रहस्य विज्ञान और संकट प्रबंधन में ये उत्कृष्ट हैं। भावनाओं को सकारात्मक दिशा देना इनकी सफलता का रहस्य है।",
    luckyGem: "Red Coral / Cat's Eye",
    luckyDay: "Tuesday",
    color: "#7C3AED",
  },
  {
    id: "sagittarius",
    sign: "Sagittarius",
    hindi: "धनु",
    symbol: "♐",
    dates: "Nov 22 – Dec 21",
    element: "Fire",
    elementHindi: "अग्नि",
    ruler: "Jupiter (Guru)",
    rulerHindi: "गुरु",
    nature: "Mutable · Dhanu Rashi",
    strengths: ["Optimism", "Higher learning", "Philosophy", "Adventure"],
    challenges: ["Overconfidence", "Blunt speech", "Restlessness"],
    description:
      "Sagittarius (Dhanu) is Jupiter-ruled — truth-seeking, expansive, and freedom-loving. Excel in teaching, law, spirituality, travel, and publishing. Grounding wisdom in practical steps turns vision into real-world impact.",
    descriptionHindi:
      "धनु राशि गुरु की है — आशावादी, ज्ञान-प्रेमी और स्वतंत्र विचारों वाली। शिक्षा, धर्म, यात्रा और प्रकाशन में ये सफल होते हैं। दृष्टि को व्यवहार में उतारना इनकी उन्नति का मार्ग है।",
    luckyGem: "Yellow Sapphire (Pukhraj)",
    luckyDay: "Thursday",
    color: "#8B5CF6",
  },
  {
    id: "capricorn",
    sign: "Capricorn",
    hindi: "मकर",
    symbol: "♑",
    dates: "Dec 22 – Jan 19",
    element: "Earth",
    elementHindi: "पृथ्वी",
    ruler: "Saturn (Shani)",
    rulerHindi: "शनि",
    nature: "Cardinal · Makara Rashi",
    strengths: ["Discipline", "Ambition", "Long-term planning", "Integrity"],
    challenges: ["Pessimism", "Workaholism", "Emotional reserve"],
    description:
      "Capricorn (Makara) is Saturn-ruled — patient climbers who build empires through duty and persistence. Strong in government, engineering, administration, and business. Shani's lessons reward honest, sustained effort over shortcuts.",
    descriptionHindi:
      "मकर राशि शनि की है — अनुशासित, महत्वाकांक्षी और दीर्घकालिक योजनाकार। सरकार, इंजीनियरिंग, प्रशासन और व्यापार में ये सफल होते हैं। ईमानदारी और निरंतर प्रयास से शनि विशेष आशीर्वाद देता है।",
    luckyGem: "Blue Sapphire (Neelam)",
    luckyDay: "Saturday",
    color: "#64748B",
  },
  {
    id: "aquarius",
    sign: "Aquarius",
    hindi: "कुम्भ",
    symbol: "♒",
    dates: "Jan 20 – Feb 18",
    element: "Air",
    elementHindi: "वायु",
    ruler: "Saturn & Rahu",
    rulerHindi: "शनि व राहु",
    nature: "Fixed · Kumbha Rashi",
    strengths: ["Innovation", "Humanitarian vision", "Original thinking", "Team leadership"],
    challenges: ["Detachment", "Rebellion without plan", "Unpredictability"],
    description:
      "Aquarius (Kumbha) blends Saturn's structure with Rahu's innovation — forward-thinking reformers and tech pioneers. They uplift society through science, social work, and unconventional solutions. Balancing ideals with empathy deepens their influence.",
    descriptionHindi:
      "कुम्भ राशि शनि और राहु के प्रभाव में है — नवीन सोच, मानवता प्रेमी और सुधारक। विज्ञान, सामाजिक कार्य और तकनीक में ये अग्रणी होते हैं। आदर्शों को करुणा से जोड़ना इनकी सफलता बढ़ाता है।",
    luckyGem: "Blue Sapphire / Hessonite",
    luckyDay: "Saturday",
    color: "#06B6D4",
  },
  {
    id: "pisces",
    sign: "Pisces",
    hindi: "मीन",
    symbol: "♓",
    dates: "Feb 19 – Mar 20",
    element: "Water",
    elementHindi: "जल",
    ruler: "Jupiter & Ketu",
    rulerHindi: "गुरु व केतु",
    nature: "Mutable · Meena Rashi",
    strengths: ["Compassion", "Creativity", "Spiritual depth", "Empathy"],
    challenges: ["Escapism", "Boundary issues", "Over-trusting nature"],
    description:
      "Pisces (Meena) is mystical and compassionate — Jupiter's wisdom with Ketu's transcendence. Natural healers, artists, poets, and counselors. Clear boundaries and daily discipline turn divine sensitivity into lasting service.",
    descriptionHindi:
      "मीन राशि गुरु और केतु की है — करुणामय, रचनात्मक और आध्यात्मिक। चिकित्सा, कला, कविता और परामर्श में ये विशेष प्रतिभा रखते हैं। सीमाएँ निर्धारित करना और अनुशासन इनके लिए आवश्यक है।",
    luckyGem: "Yellow Sapphire / Pearl",
    luckyDay: "Thursday",
    color: "#6366F1",
  },
];
