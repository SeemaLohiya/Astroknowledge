import { HealingService } from "../types";

export const healingServices: HealingService[] = [
  {
    id: "reiki-healing",
    title: "Reiki Healing",
    titleHindi: "रेकी हीलिंग",
    description:
      "Universal life-force energy channeled to balance chakras, release emotional blocks, and restore natural vitality. Ideal for stress, anxiety, and energy depletion.",
    duration: "45–60 min session",
    price: 2500,
    image: "/images/healing/reiki.jpg",
    benefits: ["Chakra balancing", "Stress & anxiety relief", "Emotional release", "Energy restoration"],
    popular: true,
  },
  {
    id: "crystal-healing",
    title: "Crystal Healing",
    titleHindi: "क्रिस्टल हीलिंग",
    description:
      "Sacred crystals placed on energy centers to absorb negativity, amplify positive vibrations, and align your aura with planetary harmony.",
    duration: "50–60 min session",
    price: 3000,
    image: "/images/healing/crystal.jpg",
    benefits: ["Aura cleansing", "Planetary alignment", "Negative energy removal", "Chakra activation"],
  },
  {
    id: "theta-healing",
    title: "Theta Healing",
    titleHindi: "थीटा हीलिंग",
    description:
      "Deep subconscious reprogramming in theta brainwave state to heal limiting beliefs, trauma imprints, and karmic patterns at the root level.",
    duration: "60 min session",
    price: 3500,
    image: "/images/healing/theta.jpg",
    benefits: ["Belief transformation", "Trauma release", "Karmic clearing", "Subconscious healing"],
    popular: true,
  },
  {
    id: "mantra-sadhana",
    title: "Mantra Sadhana",
    titleHindi: "मंत्र साधना",
    description:
      "Personalized mantra initiation and guided sadhana for planetary pacification, spiritual growth, and protection through sacred sound vibrations.",
    duration: "Ongoing guidance",
    price: 5000,
    image: "/images/healing/mantra.jpg",
    benefits: ["Personalized mantras", "Planetary remedies", "Spiritual protection", "Guided daily practice"],
  },
];
