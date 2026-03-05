import type { StudySpotResponse } from "@shared/schema";

export interface DemoReview {
  id: number;
  spotId: number;
  firstName: string;
  rating: number;
  date: string;
  text: string;
}

export const DEMO_REVIEWS: DemoReview[] = [
  // das café (spotId 34 based on logs)
  { id: -1, spotId: 34, firstName: "Anna", rating: 5, date: "2024-02-15", text: "Mein absoluter Lieblingsort zum Lernen! Die Tische sind groß genug für Laptop und Bücher." },
  { id: -2, spotId: 34, firstName: "Lukas", rating: 4.5, date: "2024-02-20", text: "Gutes WLAN und nette Atmosphäre. Nachmittags wird es manchmal etwas voll." },
  { id: -3, spotId: 34, firstName: "Tobias", rating: 4, date: "2024-02-22", text: "Kaffee ist super, Steckdosen gibt es an fast jedem Tisch." },
  
  // Jonas Reindl (spotId 35)
  { id: -4, spotId: 35, firstName: "Julia", rating: 5, date: "2024-02-10", text: "Bester Kaffee in der Nähe der Uni. Perfekt für produktive Vormittage." },
  { id: -5, spotId: 35, firstName: "Katharina", rating: 4, date: "2024-02-18", text: "Sehr beliebt bei Studenten, man muss früh kommen für einen Platz." },
  
  // J. Hornig Kaffeebar (spotId 36)
  { id: -6, spotId: 36, firstName: "Stefan", rating: 4.5, date: "2024-03-01", text: "Modernes Design und sehr ruhig. Ideal für Deep Work." },
  { id: -7, spotId: 36, firstName: "Felix", rating: 5, date: "2024-03-03", text: "Top WLAN und super Service. Komme immer wieder gerne hierher." },
  
  // Burggasse24 Café (spotId 37)
  { id: -8, spotId: 37, firstName: "Leonie", rating: 3.5, date: "2024-02-25", text: "Wunderschönes Café, aber am Wochenende oft zu voll zum Lernen." },
  { id: -9, spotId: 37, firstName: "Marie", rating: 4, date: "2024-02-28", text: "Unter der Woche sehr gemütlich. Das Licht ist toll zum Lesen." },
  
  // 7stern Café (spotId 38)
  { id: -10, spotId: 38, firstName: "David", rating: 4.5, date: "2024-03-02", text: "Klassiker im 7. Bezirk. Abends kann man hier super an Projekten arbeiten." },
  { id: -11, spotId: 38, firstName: "Franziska", rating: 4, date: "2024-03-04", text: "Gute Auswahl an Snacks und faire Preise für Studenten." }
];

export function getSpotStats(spotId: number, realReviews: any[] = []) {
  const spotDemoReviews = DEMO_REVIEWS.filter(r => r.spotId === spotId);
  const allReviews = [...spotDemoReviews, ...realReviews];
  
  if (allReviews.length === 0) return { avgRating: 0, reviewCount: 0 };
  
  const sum = allReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
  return {
    avgRating: Number((sum / allReviews.length).toFixed(1)),
    reviewCount: allReviews.length
  };
}
