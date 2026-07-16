/** Country / state / city data for address dropdowns */

export const COUNTRIES = ["India", "United States", "United Kingdom", "Canada", "Australia", "UAE", "Singapore", "Other"] as const;

export const STATES_BY_COUNTRY: Record<string, string[]> = {
  India: [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  ],
  "United States": ["California", "Texas", "New York", "Florida", "Illinois", "Other"],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  Canada: ["Ontario", "British Columbia", "Alberta", "Quebec", "Other"],
  Australia: ["New South Wales", "Victoria", "Queensland", "Western Australia", "Other"],
  UAE: ["Dubai", "Abu Dhabi", "Sharjah", "Other"],
  Singapore: ["Singapore"],
  Other: ["Other"],
};

export const CITIES_BY_STATE: Record<string, string[]> = {
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bhilwara", "Sikar", "Other"],
  Delhi: ["New Delhi", "South Delhi", "North Delhi", "East Delhi", "West Delhi", "Central Delhi", "Other"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Navi Mumbai", "Other"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi", "Other"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Other"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Other"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Noida", "Varanasi", "Agra", "Ghaziabad", "Prayagraj", "Other"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol", "Other"],
  Punjab: ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Other"],
  Haryana: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Hisar", "Other"],
  Kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kannur", "Other"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Other"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Other"],
  Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Other"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Other"],
  Assam: ["Guwahati", "Silchar", "Dibrugarh", "Other"],
  Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur", "Other"],
  Goa: ["Panaji", "Margao", "Vasco da Gama", "Other"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Mandi", "Other"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Other"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Other"],
  Uttarakhand: ["Dehradun", "Haridwar", "Nainital", "Other"],
  Manipur: ["Imphal", "Other"],
  Meghalaya: ["Shillong", "Other"],
  Mizoram: ["Aizawl", "Other"],
  Nagaland: ["Kohima", "Dimapur", "Other"],
  Sikkim: ["Gangtok", "Other"],
  Tripura: ["Agartala", "Other"],
  "Arunachal Pradesh": ["Itanagar", "Other"],
  California: ["Los Angeles", "San Francisco", "San Diego", "Other"],
  England: ["London", "Manchester", "Birmingham", "Other"],
  Ontario: ["Toronto", "Ottawa", "Other"],
  Dubai: ["Dubai", "Other"],
  Other: ["Other"],
};

export function getStates(country: string) {
  return STATES_BY_COUNTRY[country] || STATES_BY_COUNTRY.Other;
}

export function getCities(state: string) {
  return CITIES_BY_STATE[state] || ["Other"];
}
