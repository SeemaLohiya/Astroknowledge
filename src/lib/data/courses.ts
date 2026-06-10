import { Course } from "../types";

const C = "/images/courses";

export const courses: Course[] = [
  {
    id: "vedic-astrology-cert",
    title: "Astrology Course",
    titleHindi: "वैदिक ज्योतिष प्रमाणन",
    description: "Comprehensive Vedic astrology training covering birth charts, dashas, yogas, and remedies — certified by Acharya Seema Lohiya.",
    sessionDescription: `This certification program is designed for serious students who want to read birth charts with confidence using authentic Vedic principles.

Each live session walks through real chart examples — Lagna, Moon sign, planetary strengths, house lords, and the logic behind predictions. You will learn how to identify doshas, yogas, and dasha periods, and how to recommend practical remedies aligned with tradition.

The curriculum is structured in progressive modules: foundations of Jyotish, detailed Kundali analysis, marriage and career readings, health indicators, and muhurta basics. Every module includes guided practice, Q&A, and homework charts reviewed in the next session.

By the end of the course you will be able to prepare a structured consultation report, explain planetary influences clearly to clients, and apply ethical guidance standards. A certificate is awarded on successful completion of assignments and the final assessment.`,
    duration: "6 months",
    price: 25000,
    image: `${C}/vedic-astrology-course.jpg`,
    features: ["Birth chart analysis", "Dosha identification", "Remedy planning", "Certificate on completion"],
    popular: true,
  },
  {
    id: "ritual-specialist",
    title: "Ritual Specialist Course",
    titleHindi: "अनुष्ठान विशेषज्ञ पाठ्यक्रम",
    description: "Learn sacred pooja rituals, mantras, and ceremonial procedures performed by experienced Vedic Pandits.",
    sessionDescription: `This course trains you in the step-by-step conduct of Vedic poojas — from sankalp and avahan to homa, aarti, and visarjan — with correct pronunciation and ritual sequence.

Sessions cover the philosophy behind each ritual, the role of deities and offerings, and how to adapt procedures for home, temple, and special occasions. You will practice mantra chanting, learn common stotras, and understand auspicious timing (muhurta) for ceremonies.

Hands-on modules include Satyanarayan Katha, Navgraha Shanti, Lakshmi-Ganesh pooja, and life-event rituals such as naamkaran and griha pravesh basics. Materials, samagri lists, and safety guidelines are explained in detail.

Graduates gain the confidence to assist in or independently conduct standard poojas with devotion, accuracy, and respect for tradition.`,
    duration: "3 months",
    price: 15000,
    image: `${C}/ritual-specialist-course.jpg`,
    features: ["Pooja procedures", "Mantra chanting", "Ritual timing", "Practical training"],
  },
  {
    id: "numerology-mastery",
    title: "Numerology Mastery",
    titleHindi: "अंक ज्योतिष विशेषज्ञता",
    description: "Master name and date numerology for life path analysis, business naming, and personal guidance.",
    sessionDescription: `Numerology Mastery teaches Chaldean and Vedic-inspired number systems applied to names, dates of birth, and important life events.

Each session explores life path, destiny, soul urge, and personality numbers — how they interact and what they reveal about strengths, challenges, and karmic lessons. You will work through case studies for career decisions, relationship compatibility, and personal growth.

A major focus is name correction: when and how to adjust spelling for business brands, newborns, or individuals seeking alignment with favourable vibrations. Business numerology modules cover launch dates, brand names, and partnership numbers.

The course includes worksheets, live calculations, and feedback on your analyses so you can offer clear, ethical numerology guidance to clients.`,
    duration: "2 months",
    price: 12000,
    image: `${C}/numerology-course.jpg`,
    features: ["Life path numbers", "Name correction", "Business numerology", "Case studies"],
  },
  {
    id: "vastu-fundamentals",
    title: "Vastu Shastra Fundamentals",
    titleHindi: "वास्तु शास्त्र मूलभूत",
    description: "Foundation course in Vastu Shastra for home, office, and commercial space energy correction.",
    sessionDescription: `Vastu Shastra Fundamentals introduces the five elements, directions, and zones that govern harmony in living and working spaces.

Sessions explain how to analyse a floor plan: entrance placement, kitchen and bedroom zones, toilet locations, and the flow of prana through a building. You will learn simple, non-destructive remedies using colour, placement, symbols, and elemental balance.

The course covers residential Vastu in depth, with additional modules on small offices and shops. Common problems — blocked wealth corners, disturbed sleep, recurring obstacles — are diagnosed using standard Vastu grids and practical correction methods.

By completion you will be able to conduct a basic Vastu survey, prepare a written recommendation report, and suggest remedies clients can implement immediately.`,
    duration: "2 months",
    price: 14000,
    image: `${C}/vastu-course.jpg`,
    features: ["Direction analysis", "Remedy application", "Floor plan review", "Practical corrections"],
    popular: true,
  },
];
