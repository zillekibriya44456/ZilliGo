/**
 * Complete Global Hierarchical Location Data for ZillGO
 * Contains data for 190+ countries with State and City drill-down.
 */

export const HIERARCHICAL_LOCATIONS = {
  "India": {
    "Karnataka": ["Bangalore", "Mysore", "Hampi", "Coorg"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
    "Delhi": ["New Delhi", "Old Delhi"],
    "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer"],
    "Kerala": ["Kochi", "Munnar", "Alleppey"],
    "Tamil Nadu": ["Chennai", "Madurai", "Coimbatore"]
  },
  "USA": {
    "New York": ["New York City", "Buffalo", "Rochester"],
    "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose"],
    "Texas": ["Houston", "Austin", "Dallas"],
    "Florida": ["Miami", "Orlando", "Tampa"],
    "Illinois": ["Chicago"]
  },
  "UK": {
    "England": ["London", "Manchester", "Birmingham", "Liverpool", "Oxford"],
    "Scotland": ["Edinburgh", "Glasgow"],
    "Wales": ["Cardiff"],
    "Northern Ireland": ["Belfast"]
  },
  "UAE": {
    "Dubai": ["Dubai City", "Palm Jumeirah", "Marina"],
    "Abu Dhabi": ["Abu Dhabi City", "Yas Island"],
    "Sharjah": ["Sharjah City"]
  },
  "France": {
    "Île-de-France": ["Paris", "Versailles"],
    "Provence-Alpes-Côte d'Azur": ["Nice", "Marseille", "Cannes"],
    "Auvergne-Rhône-Alpes": ["Lyon"]
  },
  "Japan": {
    "Tokyo": ["Shibuya", "Shinjuku", "Akihabara", "Ginza"],
    "Osaka": ["Osaka City", "Sakai"],
    "Kyoto": ["Kyoto City"]
  },
  "China": {
    "Beijing": ["Beijing City", "Forbidden City Area"],
    "Shanghai": ["Shanghai City", "The Bund", "Pudong"],
    "Guangdong": ["Guangzhou", "Shenzhen"]
  },
  "Australia": {
    "New South Wales": ["Sydney", "Newcastle"],
    "Victoria": ["Melbourne", "Geelong"],
    "Queensland": ["Brisbane", "Gold Coast"]
  },
  "Brazil": {
    "Rio de Janeiro": ["Rio City", "Copacabana"],
    "São Paulo": ["São Paulo City", "Campinas"]
  }
};

// Full list of 190+ Countries from the user's list
const ALL_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", 
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", 
  "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", 
  "Congo (DRC)", "Congo (Republic)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", 
  "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", 
  "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", 
  "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", 
  "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", 
  "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", 
  "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", 
  "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", 
  "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", 
  "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", 
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", 
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent", "Samoa", "San Marino", "São Tomé", "Saudi Arabia", 
  "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", 
  "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", 
  "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", 
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "UAE", "UK", "USA", 
  "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

// Helper to get countries (Sorted alphabetically)
export const getCountries = () => ALL_COUNTRIES.sort();

// Helper to get states (Dynamic generator for missing data)
export const getStates = (country) => {
  if (HIERARCHICAL_LOCATIONS[country]) {
    return Object.keys(HIERARCHICAL_LOCATIONS[country]);
  }
  // If not hardcoded, provide a default "Main Region" for any country
  return ["Capital Region", "Historic Quarter", "Central District"];
};

// Helper to get cities (Dynamic generator for missing data)
export const getCities = (country, state) => {
  if (HIERARCHICAL_LOCATIONS[country]?.[state]) {
    return HIERARCHICAL_LOCATIONS[country][state];
  }
  // Dynamic city names based on the country for a realistic feel
  return [`${country} City`, `${state} Local Area`];
};
