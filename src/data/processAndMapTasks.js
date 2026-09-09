/**
 * Process and Map Tasks Dataset for IELTS Writing Task 1
 * Includes SVG diagram definitions and specialized vocabulary for:
 * - Natural and Man-made Processes
 * - Historical and Proposed Map Transformations
 */

export const PROCESS_AND_MAP_TASKS = [
  // 1. TASK 1: PROCESS DIAGRAM (CEMENT PRODUCTION & CONCRETE MIXING)
  {
    id: 't1-process-cement-production',
    taskNumber: 1,
    type: 'process',
    topic: 'tech',
    title: 'Manufacturing of Cement and Production of Concrete',
    prompt: 'The diagrams below show the stages involved in the manufacturing of cement and how cement is utilized to produce concrete for building purposes.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    minWords: 150,
    timeLimit: 20,
    keywords: ['Limestone', 'clay', 'crusher', 'rotating heater', 'grinder', 'concrete mixer', 'gravel', 'sand'],
    processSteps: [
      { step: 1, name: 'Crushing', desc: 'Limestone and clay are crushed into fine powder' },
      { step: 2, name: 'Mixing', desc: 'Powder is thoroughly blended before passing through a mixer' },
      { step: 3, name: 'Heating', desc: 'Mixture passes through a rotating kiln over high heat' },
      { step: 4, name: 'Grinding', desc: 'Hot clinker is cooled and fed into a grinder to produce finished cement' },
      { step: 5, name: 'Concrete Production', desc: '15% cement is combined with 10% water, 25% sand, and 50% gravel inside a concrete mixer' }
    ],
    outline: {
      introduction: 'Paraphrase the two sequential industrial procedures for producing cement and subsequently concrete.',
      overview: 'Highlight that cement manufacturing involves a linear 4-stage chemical and physical process, whereas concrete production is a combination phase with strict proportioning.',
      body1: 'Detail the 4 stages of cement creation: crushing raw materials, mixing, passing through the rotating kiln, and final grinding.',
      body2: 'Detail concrete fabrication: combining 15% cement, 10% water, 25% sand, and 50% gravel in a rotating drum.'
    },
    modelAnswer: `The diagrams delineate the multi-stage procedure by which cement is industrially manufactured, followed by its subsequent integration with other raw aggregates to produce concrete for construction purposes.

Overall, it is readily apparent that the creation of cement is a linear process encompassing four primary phases—ranging from initial pulverisation to final grinding—while concrete production involves a proportional batching and mechanical mixing mechanism.

In the initial stage of cement manufacturing, raw limestone and clay are fed into a mechanical crusher, which pulverises them into a fine powder. This blended material then traverses through an automated mixer before entering a continuous rotating kiln. Within this inclined cylinder, the compound undergoes intense thermal treatment. Once heated, the resultant clinker is directed into a heavy-duty grinder, yielding refined, packaged cement.

Regarding the subsequent production of concrete, cement functions as a fundamental binder. Exactly 15% cement is integrated with 10% water, 25% fine sand, and 50% coarse gravel. These four constituents are poured into a rotating drum mixer, which churns them uniformly until a viscous, homogenous building compound is achieved.`,
    vocabularyHighlights: [
      { word: 'pulverises into a fine powder', meaning: 'nghiền nát thành bột mịn' },
      { word: 'traverses through an automated mixer', meaning: 'đi qua một máy trộn tự động' },
      { word: 'continuous rotating kiln', meaning: 'lò nung quay liên tục' },
      { word: 'undergoes intense thermal treatment', meaning: 'trải qua quá trình xử lý nhiệt độ cao' },
      { word: 'fundamental binder', meaning: 'chất kết dính nền tảng' },
      { word: 'viscous, homogenous compound', meaning: 'hỗn hợp sánh mịn, đồng nhất' }
    ]
  },

  // 2. TASK 1: MAP TRANSFORMATION (SEASIDE TOWN 1995 vs 2025)
  {
    id: 't1-map-seaside-town',
    taskNumber: 1,
    type: 'map',
    topic: 'urban',
    title: 'Redevelopment of the Coastal Village of Porton (1995 vs 2025)',
    prompt: 'The two maps below illustrate the urban changes that took place in the seaside village of Porton between 1995 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    minWords: 150,
    timeLimit: 20,
    keywords: ['Porton', 'farmland', 'residential expansion', 'marina', 'promenade', 'hotel complex', 'demolition'],
    mapChanges: [
      { feature: 'Northwest Farmland', past: 'Agricultural land and forestry', present: 'Converted into a luxury residential housing estate' },
      { feature: 'Southern Coast', past: 'Small fishing dock with wooden pier', present: 'Transformed into a modern leisure marina and yacht club' },
      { feature: 'Eastern Shore', past: 'Empty shoreline and marshland', present: 'Constructed a multi-story hotel resort and promenade' },
      { feature: 'Center Village', past: 'Narrow gravel road and traditional shops', present: 'Widened dual-carriageway with commercial pedestrian zone' }
    ],
    outline: {
      introduction: 'Introduce the map comparisons of Porton over a 30-year period from 1995 to 2025.',
      overview: 'Emphasize the comprehensive transformation from a tranquil, agrarian fishing hamlet into a bustling, modernized tourist and residential destination.',
      body1: 'Describe northern and western alterations: conversion of farmland into residential communities and expansion of infrastructure.',
      body2: 'Describe coastal and southern developments: demolition of the fishing dock for a marina, and erection of hotel facilities on the eastern shoreline.'
    },
    modelAnswer: `The two maps illustrate the extensive urban transformation experienced by the coastal village of Porton over a 30-year span between 1995 and 2025.

Overall, it is readily observable that Porton underwent a complete metamorphosis, evolving from a secluded, agrarian fishing settlement into a modernized residential and commercial leisure hub. The most pronounced alterations were the eradication of farmland and the modernization of coastal amenities.

In 1995, the northwestern quadrant was dominated by extensive agricultural farmland and woodland. By 2025, this green space had been entirely eradicated to accommodate a sprawling residential housing complex accompanied by newly paved access roads. Concurrently, the central thoroughfare, formerly a narrow road bordered by quaint local shops, was substantially widened into a dual carriageway and flanked by a pedestrianized retail plaza.

Turning to the coastal perimeter, the traditional fishing dock in the south was dismantled to make way for a contemporary marina and private yacht club. Additionally, the previously untouched marshland along the eastern shoreline was developed into a multi-story hotel resort, complemented by a paved seafront promenade designed to attract international holidaymakers.`,
    vocabularyHighlights: [
      { word: 'underwent a complete metamorphosis', meaning: 'trải qua một sự biến đổi diện mạo hoàn toàn' },
      { word: 'secluded agrarian settlement', meaning: 'khu định cư nông nghiệp hẻo lánh' },
      { word: 'entirely eradicated to accommodate', meaning: 'bị xóa bỏ hoàn toàn để nhường chỗ cho' },
      { word: 'central thoroughfare', meaning: 'trục đường giao thông trung tâm' },
      { word: 'dismantled to make way for', meaning: 'bị dỡ bỏ để nhường chỗ cho' },
      { word: 'seafront promenade', meaning: 'đường đi dạo ven biển' }
    ]
  }
];
