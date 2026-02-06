/**
 * SENIOR TIP: We use a Map-like object structure for BRANDS.
 * This makes it incredibly easy to find models: BRANDS[selectedMake].models
 */
export const BRANDS = {
  "Maruti Suzuki": {
    models: [
      "Swift",
      "Dzire",
      "Brezza",
      "Ertiga",
      "Baleno",
      "Wagon R",
      "Alto",
      "Grand Vitara",
    ],
    years: [2010, 2026], // Range used for dynamic year generation
  },
  Hyundai: {
    models: ["Creta", "Venue", "i20", "Verna", "Alcazar", "Tucson", "Exter"],
    years: [2012, 2026],
  },
  "Tata Motors": {
    models: ["Nexon", "Punch", "Harrier", "Safari", "Altroz", "Tiago", "Tigor"],
    years: [2015, 2026],
  },
  Mahindra: {
    models: [
      "Scorpio-N",
      "XUV700",
      "Thar",
      "Bolero",
      "XUV300",
      "Scorpio Classic",
    ],
    years: [2000, 2026],
  },
  Toyota: {
    models: [
      "Fortuner",
      "Innova Hycross",
      "Innova Crysta",
      "Glanza",
      "Urban Cruiser",
      "Hycross",
    ],
    years: [2005, 2026],
  },
  Kia: {
    models: ["Seltos", "Sonet", "Carens", "Carnival"],
    years: [2019, 2026],
  },
  Honda: {
    models: ["City", "Amaze", "Elevate", "Jazz", "WR-V"],
    years: [2010, 2026],
  },
};

/**
 * Categorized Spare Parts
 * Even if the form shows a flat list, keeping categories here helps with
 * future features like "Browse by Category".
 */
export const SPARE_PARTS = [
  // Body & Exterior
  "Front Bumper",
  "Rear Bumper",
  "Hood/Bonnet",
  "Trunk Lid",
  "Grille",
  "Headlight (Left)",
  "Headlight (Right)",
  "Tail Light (Left)",
  "Tail Light (Right)",
  "Side Mirror (Left)",
  "Side Mirror (Right)",
  "Door Panel (Front Left)",

  // Engine & Transmission
  "Oil Filter",
  "Air Filter",
  "Clutch Plate Set",
  "Radiator",
  "Alternator",
  "Starter Motor",
  "Fuel Pump",
  "Timing Belt",

  // Braking & Suspension
  "Front Brake Pads",
  "Rear Brake Shoes",
  "Brake Disc Rotor",
  "Front Shock Absorber",
  "Rear Shock Absorber",
  "Lower Control Arm",

  // Electrical & AC
  "Car Battery",
  "AC Compressor",
  "Condenser",
  "Power Window Motor",
];

export const TOP_CITIES = [
  "Delhi NCR",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Ahmedabad",
  "Kolkata",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Indore",
  "Kochi",
  "Surat",
  "Ludhiana",
];

/**
 * Helper function to generate years dynamically based on a range
 * Senior move: Don't hardcode [2024, 2023...]. Calculate it.
 */
export const getYearRange = (start, end) => {
  const years = [];
  for (let i = end; i >= start; i--) {
    years.push(i.toString());
  }
  return years;
};
