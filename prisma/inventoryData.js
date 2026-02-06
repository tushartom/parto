// prisma/inventoryData.js

const brands = [
  {
    name: "Maruti Suzuki",
    slug: "maruti-suzuki",
    models: [
      { name: "Swift", slug: "swift", startYear: 2005 },
      { name: "Dzire", slug: "dzire", startYear: 2008 },
      { name: "Baleno", slug: "baleno", startYear: 2015 },
      { name: "Ertiga", slug: "ertiga", startYear: 2012 },
      { name: "Brezza", slug: "brezza", startYear: 2016 },
      { name: "Alto 800", slug: "alto-800", startYear: 2012 },
      { name: "Wagon R", slug: "wagon-r", startYear: 1999 },
      { name: "Fronx", slug: "fronx", startYear: 2023 },
      { name: "Grand Vitara", slug: "grand-vitara", startYear: 2022 },
      { name: "Jimny", slug: "jimny", startYear: 2023 },
    ],
  },
  {
    name: "Hyundai",
    slug: "hyundai",
    models: [
      { name: "Creta", slug: "creta", startYear: 2015 },
      { name: "Venue", slug: "venue", startYear: 2019 },
      { name: "Verna", slug: "verna", startYear: 2006 },
      { name: "i20", slug: "i20", startYear: 2008 },
      { name: "Exter", slug: "exter", startYear: 2023 },
      { name: "Alcazar", slug: "alcazar", startYear: 2021 },
      { name: "Tucson", slug: "tucson", startYear: 2005 },
    ],
  },
  {
    name: "Tata Motors",
    slug: "tata-motors",
    models: [
      { name: "Nexon", slug: "nexon", startYear: 2017 },
      { name: "Punch", slug: "punch", startYear: 2021 },
      { name: "Harrier", slug: "harrier", startYear: 2019 },
      { name: "Safari", slug: "safari", startYear: 2021 },
      { name: "Tiago", slug: "tiago", startYear: 2016 },
      { name: "Altroz", slug: "altroz", startYear: 2020 },
      { name: "Curvv", slug: "curvv", startYear: 2024 },
    ],
  },
  {
    name: "Mahindra",
    slug: "mahindra",
    models: [
      { name: "Scorpio-N", slug: "scorpio-n", startYear: 2022 },
      { name: "XUV700", slug: "xuv700", startYear: 2021 },
      { name: "Thar", slug: "thar", startYear: 2010 },
      { name: "Bolero", slug: "bolero", startYear: 2000 },
      { name: "XUV300", slug: "xuv300", startYear: 2019 },
      { name: "XUV400 EV", slug: "xuv400-ev", startYear: 2023 },
      { name: "Scorpio Classic", slug: "scorpio-classic", startYear: 2022 },
    ],
  },
  {
    name: "Toyota",
    slug: "toyota",
    models: [
      { name: "Innova Crysta", slug: "innova-crysta", startYear: 2016 },
      { name: "Fortuner", slug: "fortuner", startYear: 2009 },
      { name: "Glanza", slug: "glanza", startYear: 2019 },
      { name: "Innova Hycross", slug: "innova-hycross", startYear: 2022 },
      {
        name: "Urban Cruiser Taisor",
        slug: "urban-cruiser-taisor",
        startYear: 2024,
      },
    ],
  },
  {
    name: "Honda",
    slug: "honda",
    models: [
      { name: "City", slug: "city", startYear: 1998 },
      { name: "Amaze", slug: "amaze", startYear: 2013 },
      { name: "Elevate", slug: "elevate", startYear: 2023 },
      { name: "Civic", slug: "civic", startYear: 2006, endYear: 2021 },
    ],
  },
];

const categories = [
  {
    name: "Body & Exteriors",
    slug: "body-exteriors",
    parts: [
      "Front Bumper",
      "Rear Bumper",
      "Headlight (LH)",
      "Headlight (RH)",
      "Tail Light (LH)",
      "Tail Light (RH)",
      "Side Mirror (LH)",
      "Side Mirror (RH)",
      "Front Grille",
      "Bonnet / Hood",
      "Fender",
      "Door Handle",
      "Windshield Glass",
    ],
  },
  {
    name: "Engine & Transmission",
    slug: "engine-transmission",
    parts: [
      "Oil Filter",
      "Air Filter",
      "Clutch Plate Set",
      "Timing Belt",
      "Spark Plug Set",
      "Fuel Injector",
      "Radiator Fan",
      "Alternator",
      "Starter Motor",
      "Engine Mounting",
    ],
  },
  {
    name: "Braking System",
    slug: "braking-system",
    parts: [
      "Front Brake Pads",
      "Rear Brake Shoes",
      "Brake Disc Rotor",
      "ABS Sensor",
      "Master Cylinder",
      "Brake Booster",
      "Brake Hose",
    ],
  },
  {
    name: "Suspension & Steering",
    slug: "suspension-steering",
    parts: [
      "Front Shock Absorber",
      "Rear Shock Absorber",
      "Lower Arm",
      "Tie Rod End",
      "Steering Rack",
      "Link Rod",
      "Steering Column",
      "Stabilizer Bar",
    ],
  },
  {
    name: "Electricals & AC",
    slug: "electricals-ac",
    parts: [
      "Car Battery",
      "AC Compressor",
      "Condenser",
      "Ignition Coil",
      "Horn Set",
      "Power Window Switch",
      "Wiper Motor",
      "Blower Motor",
    ],
  },
];

// prisma/locationData.js
const locations = [
  {
    name: "Bahadurgarh",
    slug: "bahadurgarh",
    state: "HARYANA",
    localities: [
      { name: "Sector 6", slug: "sector-6" },
      { name: "Sector 9", slug: "sector-9" },
      { name: "Bus Stand", slug: "bus-stand" },
      { name: "M.I.E.", slug: "mie-industrial-area" },
    ],
  },
  {
    name: "Delhi",
    slug: "delhi",
    state: "DELHI",
    localities: [
      { name: "Kashmere Gate", slug: "kashmere-gate" },
      { name: "Mayapuri", slug: "mayapuri" },
      { name: "Karol Bagh", slug: "karol-bagh" },
      { name: "Rohini", slug: "rohini" },
    ],
  },
  {
    name: "Gurgaon",
    slug: "gurgaon",
    state: "HARYANA",
    localities: [
      { name: "Udyog Vihar", slug: "udyog-vihar" },
      { name: "Old Gurgaon", slug: "old-gurgaon" },
      { name: "Sector 14", slug: "sector-14" },
    ],
  },
];



module.exports = { brands, categories, locations };
