export interface FoodItem {
  id: string;
  nameEn: string;
  nameHi: string;
  category: string;
  stdGrams: number;
  unit: string;
  confirmSpellingFlag?: boolean;
}

export const mnnitCatalogue: Record<string, FoodItem[]> = {
  breakfast: [
    { id: 'bf-1', nameEn: 'Stuffed Paneer Paratha', nameHi: 'पनीर पराठा', category: 'paneer', stdGrams: 150, unit: 'g' },
    { id: 'bf-2', nameEn: 'Aloo Paratha & Fresh Curd', nameHi: 'आलू पराठा व दही', category: 'bread', stdGrams: 160, unit: 'g' },
    { id: 'bf-3', nameEn: 'Aloo Poori & Dam Aloo', nameHi: 'आलू पूरी व दम आलू', category: 'bread', stdGrams: 180, unit: 'g' },
    { id: 'bf-4', nameEn: 'Matar Kachori & Aloo Matar', nameHi: 'मटर कचौरी व आलू मटर', category: 'fried', stdGrams: 160, unit: 'g' },
    { id: 'bf-5', nameEn: 'Steamed Idli & Vada with Sambhar', nameHi: 'इडली वड़ा व सांभर', category: 'south-indian', stdGrams: 200, unit: 'g' },
    { id: 'bf-6', nameEn: 'Adrak Masala Chai & Coffee Powder', nameHi: 'अदरक चाय व कॉफी', category: 'beverage', stdGrams: 150, unit: 'ml' }
  ],
  lunch: [
    { id: 'lu-1', nameEn: 'Dehradun Jeera Rice', nameHi: 'जीरा राइस', category: 'rice', stdGrams: 150, unit: 'g' },
    { id: 'lu-2', nameEn: 'Dal Makhani (Slow Simmered)', nameHi: 'दाल मखनी', category: 'dal', stdGrams: 180, unit: 'ml' },
    { id: 'lu-3', nameEn: 'Rajma Rasila (North Indian Style)', nameHi: 'राजमा रसीला', category: 'dal', stdGrams: 180, unit: 'ml' },
    { id: 'lu-4', nameEn: 'Bhindi Do Pyaza / Lauki', nameHi: 'भिंडी दो प्याजा / लौकी', category: 'sabzi', stdGrams: 140, unit: 'g' },
    { id: 'lu-5', nameEn: 'Fresh Tawa Roti', nameHi: 'तवा रोटी', category: 'bread', stdGrams: 3, unit: 'pc' },
    { id: 'lu-6', nameEn: 'Chilled Fruit Custard', nameHi: 'फ्रूट कस्टर्ड', category: 'sweet', stdGrams: 100, unit: 'ml' }
  ],
  snacks: [
    { id: 'sn-1', nameEn: 'Samosa with Sweet & Green Chutney', nameHi: 'समोसा व चटनी', category: 'fried', stdGrams: 2, unit: 'pc' },
    { id: 'sn-2', nameEn: 'Bhel Puri / Mixed Masala Chaat', nameHi: 'भेल पूरी / मसाला चाट', category: 'chaat', stdGrams: 120, unit: 'g' },
    { id: 'sn-3', nameEn: 'Mumbai Vada Pav with Fried Chili', nameHi: 'बड़ा पाव व तली मिर्च', category: 'chaat', stdGrams: 1, unit: 'pc' },
    { id: 'sn-4', nameEn: 'Adrak Chai & Filter Coffee', nameHi: 'अदरक चाय व कॉफी', category: 'beverage', stdGrams: 150, unit: 'ml' }
  ],
  dinner: [
    { id: 'di-1', nameEn: 'Paneer Butter Masala', nameHi: 'पनीर बटर मसाला', category: 'paneer', stdGrams: 150, unit: 'g' },
    { id: 'di-2', nameEn: 'Arhar Dal Tadka / Upr Dal', nameHi: 'अरहर दाल तड़का / उप्र दाल', category: 'dal', stdGrams: 180, unit: 'ml', confirmSpellingFlag: true },
    { id: 'di-3', nameEn: 'Ghee Phulka Roti & Rice', nameHi: 'घी फुल्का व चावल', category: 'bread', stdGrams: 180, unit: 'g' },
    { id: 'di-4', nameEn: 'Warm Gulab Jamun / Kheer', nameHi: 'गुलाब जामुन / खीर', category: 'sweet', stdGrams: 2, unit: 'pc' },
    { id: 'di-5', nameEn: 'Chokha Barfi (Confirm Spelling)', nameHi: 'छोका बर्फी (जांचें)', category: 'sweet', stdGrams: 50, unit: 'g', confirmSpellingFlag: true },
    { id: 'di-6', nameEn: 'Night Hot Milk with Bournvita', nameHi: 'दूध व बॉर्नविटा', category: 'beverage', stdGrams: 200, unit: 'ml' }
  ]
};