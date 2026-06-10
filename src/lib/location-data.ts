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
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Other"],
  Delhi: ["New Delhi", "South Delhi", "North Delhi", "East Delhi", "West Delhi"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Other"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Other"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Other"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Other"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Noida", "Varanasi", "Agra", "Other"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Other"],
  Punjab: ["Chandigarh", "Ludhiana", "Amritsar", "Other"],
  Haryana: ["Gurugram", "Faridabad", "Panipat", "Other"],
  Kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Other"],
  Telangana: ["Hyderabad", "Warangal", "Other"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Other"],
  Bihar: ["Patna", "Gaya", "Other"],
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
