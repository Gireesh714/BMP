// Stop name to image file mapping
// Handles normalization and mismatches between stop names and image filenames
export const stopImageMap = {
  'RTO Circle': 'rto-circle.jpg',
  'Ranip': 'ranip.jpg',
  'Bhavsar Hostel': 'bhavsar-hostel.jpg',
  'Akhbarnagar': 'akbar-nagar.jpg', // Original: "akbar-nagar" vs normalized "akhbarnagar"
  'Pragatinagar': 'pragatinagar.jpg',
  'Shastrinagar': 'shastrinagar.jpg',
  'Jaymangal': 'jaymangal.jpg',
  'Sola Cross Roads': 'sola-cross-road.jpg',
  'Valinath Chowk': 'shree-walinath-chowk.jpg', // Has "Shree" prefix
  'Memnagar': 'memnagar.jpg',
  'Gujarat University': 'gujarat-university.jpg',
  'Andhjan Mandal': 'andhjan-mandal.jpg',
  'Himmatlal Park': 'himmatlal-park.jpg',
  'Shivaranjani': 'shivranjani.jpg', // Spelling variant
  'Jhansi Ki Rani': 'janshi-ki-rani.jpg', // Spelling variant: "Jhanshi" → "Janshi"
  'Nehrunagar': 'nehrunagar.jpg',
  'Manekbaug': 'manekbhaug.jpg', // Spelling variant: "baug" → "bhaug"
  'Dharnidhar Derasar': 'dharnidhar-derasar.jpg',
  'Anjali': 'anjali-brts.jpg',
  'Chandranagar': 'chandranagar.jpg',
  'Khodiyarnagar': 'khodiyarnagar.jpg',
  'Danilimda Cross Roads': 'danilimda-cross-roads.jpg',
  'Vaikunthdham Mandir': 'vaikunthdham-mandir.jpg',
  'Swaminarayan College': 'swaminarayan-college.jpg',
  'Kankaria Telephone Exchnage': 'kankariya-telephone.jpg', // Spelling variant
  'Kankaria Lake': 'kankaria-lake.jpg',
  'Rambaug': 'rambaug.jpg',
  'Maninagar Char Rasta': 'maninagar-char-rasta.jpg',
  'Maninagar': 'maninagar.jpg',
  'Sector 21': 'sector-21.jpg',
  'Sector 10': 'sector-10.jpg',
  'Secreteriat': null, // No image available
  'Pathikashram': 'pathikashram.jpg',
  'Infocity': 'infocity.jpg',
  'Raysan': 'raysan.jpg',
  'PDPU Road': 'pdpu-road.jpg',
  'Koba Circle': 'koba-circle.jpg',
  'Chiloda': 'chiloda.jpg',
};

// Extra images that don't map directly to any stop (kept for reference)
export const extraImages = {
  'ambavadi.jpg': 'Unknown mapping - possibly alternate name or duplicate',
};

// Helper function to get image path for a stop
export function getStopImagePath(stopName) {
  const imageName = stopImageMap[stopName];
  if (imageName === null) {
    console.warn(`[Image Validation] No image available for stop: "${stopName}"`);
    return null;
  }
  if (!imageName) {
    console.warn(`[Image Validation] Stop not found in mapping: "${stopName}"`);
    return null;
  }
  return `/images/stops/${imageName}`;
}

// Validation function to log mismatches
export function validateStopImages(allStops) {
  const missingImages = [];
  const unavailable = [];
  
  allStops.forEach(stopName => {
    const imageName = stopImageMap[stopName];
    if (imageName === null) {
      unavailable.push(stopName);
    } else if (!imageName) {
      missingImages.push(stopName);
    }
  });
  
  if (missingImages.length > 0) {
    console.warn(`[Image Validation] Missing mappings for ${missingImages.length} stops:`, missingImages);
  }
  
  if (unavailable.length > 0) {
    console.info(`[Image Validation] ${unavailable.length} stops have no images available:`, unavailable);
  }
  
  return { missingImages, unavailable };
}
