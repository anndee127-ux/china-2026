import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, ChevronDown, MapPin, Clock, Train, Utensils, Camera,
  Star, Wifi, CreditCard, Package, AlertCircle,
  Globe, Plane, ShoppingBag, ChevronRight, Eye, FolderOpen,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const img = (id: string, w = 800, h = 500) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "itinerary", label: "Itinerary" },
  { id: "beijing", label: "Beijing" },
  { id: "xian", label: "Xi’an" },
  { id: "food", label: "Food" },
  { id: "maps", label: "Maps" },
  { id: "tips", label: "Travel Tips" },
];

const HERO_STATS = [
  { value: "10", label: "Days" },
  { value: "2", label: "Cities" },
  { value: "2", label: "Hotels" },
  { value: "HSR", label: "Rail Journey" },
  { value: "★", label: "Guided Tours" },
];

const ITINERARY = [
  {
    day: 1, date: "Tue 20 Oct", city: "Beijing", cityColor: "#C8102E",
    hotel: "Beijing Xinqiao Hotel", transport: "Flight arrival", duration: "Arrive 14:40",
    image: img("1603120527222-33f28c2ce89e"),
    activities: [
      { name: "Airport Transfer", type: "transport" },
      { name: "Hotel Check-in", type: "hotel" },
      { name: "Wangfujing Pedestrian Street", type: "walk" },
      { name: "Evening Walk", type: "walk" },
    ],
    restaurants: [
      { name: "Quanjude Roast Duck", cuisine: "Peking Duck", price: "¥¥¥", distance: "10 min walk", dish: "Signature whole roast duck" },
      { name: "Lost Heaven", cuisine: "Yunnan Cuisine", price: "¥¥¥", distance: "15 min walk", dish: "Yunnan mushroom hot pot" },
    ],
    notes: "Arrive refreshed and settle in. The hotel sits near Wangfujing — a perfect evening stroll.",
  },
  {
    day: 2, date: "Wed 21 Oct", city: "Beijing", cityColor: "#C8102E",
    hotel: "Beijing Xinqiao Hotel", transport: "Private Guided Tour", duration: "Full Day",
    image: img("1547981609-4b6bfe67ca0b"),
    activities: [
      { name: "🚐  Hotel pick-up by private guide", type: "transport" },
      { name: "Tiananmen Square", type: "attraction" },
      { name: "Forbidden City", type: "attraction" },
      { name: "Temple of Heaven", type: "attraction" },
      { name: "🚐  Return drop-off to Hotel", type: "transport" },
    ],
    restaurants: [
      { name: "Made in China", cuisine: "Peking Duck", price: "¥¥¥¥", distance: "In hotel", dish: "Traditional ceremonial duck" },
      { name: "Jing Yaa Tang", cuisine: "Modern Chinese", price: "¥¥¥¥", distance: "5 min", dish: "Contemporary Peking duck" },
    ],
    notes: "Private guided tour with hotel pick-up and drop-off included. Comfortable shoes essential — expect 8–10 km of walking.",
  },
  {
    day: 3, date: "Thu 22 Oct", city: "Beijing", cityColor: "#C8102E",
    hotel: "Beijing Xinqiao Hotel", transport: "Private Guided Tour", duration: "Full Day",
    image: img("1547150492-da7ff1742941"),
    activities: [
      { name: "🚐  Hotel pick-up by private guide", type: "transport" },
      { name: "Mutianyu Great Wall (roundtrip cable car included)", type: "attraction" },
      { name: "Summer Palace", type: "attraction" },
      { name: "🚐  Return drop-off to Hotel", type: "transport" },
    ],
    restaurants: [
      { name: "Schoolhouse at Mutianyu", cuisine: "International", price: "¥¥¥", distance: "At the Wall", dish: "Seasonal set menu" },
      { name: "Yi He Yuan Restaurant", cuisine: "Imperial Chinese", price: "¥¥¥", distance: "Summer Palace", dish: "Imperial court dishes" },
    ],
    notes: "Private guided tour with hotel pick-up and drop-off included. Roundtrip cable car ride at Mutianyu included. October foliage at the Wall is spectacular.",
  },
  {
    day: 4, date: "Fri 23 Oct", city: "Xi’an", cityColor: "#D4A017",
    hotel: "Eastern House Xi’an", transport: "High Speed Rail", duration: "09:55 → 14:05",
    image: img("1770035675295-336e5e1e7ed0"),
    activities: [
      { name: "🚄  Beijing West → Xi’an North  ·  09:55 – 14:05  (4h 10m, 1st Class)", type: "transport" },
      { name: "🚐  Private hire pick-up from Xi’an North → Hotel", type: "transport" },
      { name: "Hotel Check-in", type: "hotel" },
      { name: "Beiyuanmen Muslim Street (Evening)", type: "attraction" },
    ],
    restaurants: [
      { name: "Tongshengxiang", cuisine: "Xi’an Muslim", price: "¥¥", distance: "Muslim Street", dish: "Yang Rou Paomo (lamb bread soup)" },
      { name: "Laosunji Paomo", cuisine: "Shaanxi", price: "¥¥", distance: "Muslim Quarter", dish: "Paomo bread in lamb broth" },
    ],
    notes: "Depart Beijing West at 09:55, arrive Xi’an North at 14:05 — 4 hours 10 minutes. 1st Class. Arrive at the station at least 45 minutes early and keep your passport ready for boarding.",
  },
  {
    day: 5, date: "Sat 24 Oct", city: "Xi’an", cityColor: "#D4A017",
    hotel: "Eastern House Xi’an", transport: "Private Local Tour", duration: "Full Day",
    image: img("1770035675295-336e5e1e7ed0"),
    activities: [
      { name: "🚐  Hotel pick-up by local tour", type: "transport" },
      { name: "Hangyangling Museum", type: "attraction" },
      { name: "Xi’an City Wall", type: "attraction" },
      { name: "Big Wild Goose Pagoda", type: "attraction" },
      { name: "Muslim Street & Great Mosque", type: "attraction" },
      { name: "🚐  Hotel drop-off by local tour", type: "transport" },
    ],
    restaurants: [
      { name: "Xi’an Famous Foods", cuisine: "Biang Biang Noodles", price: "¥", distance: "Muslim Quarter", dish: "Spicy belt noodles" },
      { name: "Old Drum Tower Square", cuisine: "Xi’an Cuisine", price: "¥¥", distance: "5 min walk", dish: "Rou Jia Mo (Chinese burger)" },
    ],
    notes: "Private local tour with hotel pick-up and drop-off. The City Wall is one of the best-preserved ancient walls in China — walking sections offers sweeping views of old Xi’an.",
  },
  {
    day: 6, date: "Sun 25 Oct", city: "Xi’an", cityColor: "#D4A017",
    hotel: "Eastern House Xi’an", transport: "Private Local Tour", duration: "Full Day",
    image: img("1659466248885-8b7a03205661"),
    activities: [
      { name: "🚐  Hotel pick-up by local tour", type: "transport" },
      { name: "Terracotta Army (Pits 1, 2 & 3)", type: "attraction" },
      { name: "Bronze Chariots & Horses Museum (First Qin Emperor’s Mausoleum)", type: "attraction" },
      { name: "Huaqing Hot Spring Palace", type: "attraction" },
      { name: "🚐  Hotel drop-off by local tour", type: "transport" },
    ],
    restaurants: [
      { name: "Tang Dynasty Palace Restaurant", cuisine: "Imperial Banquet", price: "¥¥¥¥", distance: "Near museum", dish: "Imperial ceremonial banquet" },
      { name: "Huaqing Hot Spring Restaurant", cuisine: "Shaanxi", price: "¥¥¥", distance: "On-site", dish: "Local specialities" },
    ],
    notes: "Private local tour with hotel pick-up and drop-off. Arrive early at the Terracotta Warriors — crowds build quickly. Don’t miss Pit 1 and the remarkable Bronze Chariots nearby.",
  },
  {
    day: 7, date: "Mon 26 Oct", city: "Beijing", cityColor: "#C8102E",
    hotel: "Beijing Xinqiao Hotel", transport: "High Speed Rail", duration: "10:09 → 14:26",
    image: img("1614006620172-ce0fb5969981"),
    activities: [
      { name: "🚐  Hotel pick-up → Xi’an North Station (by local tour)", type: "transport" },
      { name: "🚄  Xi’an North → Beijing West  ·  10:09 – 14:26  (4h 17m, 1st Class)", type: "transport" },
      { name: "Hotel Check-in", type: "hotel" },
      { name: "Rest & Recovery", type: "walk" },
    ],
    restaurants: [
      { name: "Din Tai Fung Beijing", cuisine: "Dumplings", price: "¥¥¥", distance: "Near hotel", dish: "Xiao Long Bao (soup dumplings)" },
      { name: "Haidilao Hot Pot", cuisine: "Hot Pot", price: "¥¥¥", distance: "10 min", dish: "Classic spicy broth" },
    ],
    notes: "Depart Xi’an North at 10:09, arrive Beijing West at 14:26 — 4 hours 17 minutes. 1st Class. A comfortable travel day — enjoy the scenery and rest before the final Beijing days.",
  },
  {
    day: 8, date: "Tue 27 Oct", city: "Beijing · Gubei Water Town", cityColor: "#4A7FA5",
    hotel: "Beijing Xinqiao Hotel", transport: "Guided Tour", duration: "08:50 – 22:30",
    image: img("1582895516735-25a974f11f2c"),
    activities: [
      { name: "🕗  08:50 — Meet at Guomao Station Exit F (Zhongfu Building)", type: "transport" },
      { name: "Gubei Water Town", type: "attraction" },
      { name: "Great Wall at Simatai", type: "attraction" },
      { name: "Yongshun Dyeing Workshop", type: "walk" },
      { name: "Zhen Yuan Escort Agency", type: "walk" },
      { name: "Ba Qi Hall", type: "walk" },
      { name: "🕙  22:30 — Return to Guomao Station → Hotel", type: "transport" },
    ],
    restaurants: [
      { name: "Gubei Water Town Restaurants", cuisine: "Chinese", price: "¥¥", distance: "On-site", dish: "Various local dishes" },
    ],
    notes: "Guided day tour. Meet at Guomao Subway Station Exit F (in front of Zhongfu Building) at 08:50 sharp. All five attractions are included in the tour. Simatai is the only Wall section open at night — the lantern-lit evening walk is breathtaking. Return to Guomao at 22:30.",
  },
  {
    day: 9, date: "Wed 28 Oct", city: "Beijing", cityColor: "#C8102E",
    hotel: "Beijing Xinqiao Hotel", transport: "Metro & Rickshaw", duration: "Full Day",
    image: img("1587825338028-f1d568e0dbb3"),
    activities: [
      { name: "Jingshan Park (Forbidden City views)", type: "attraction" },
      { name: "Nanluoguxiang Alley", type: "walk" },
      { name: "Hutong Lane", type: "walk" },
      { name: "Gongyan Imperial Dinner Show", type: "attraction" },
    ],
    restaurants: [
      { name: "Gongyan Restaurant", cuisine: "Imperial Dinner & Show", price: "¥¥¥¥", distance: "Evening venue", dish: "Imperial banquet with performance" },
      { name: "Nanluoguxiang Street Food", cuisine: "Street Food", price: "¥", distance: "On the lane", dish: "Tanghulu, scallion pancakes" },
    ],
    notes: "Jingshan Park has the finest panoramic view over the Forbidden City. Book Gongyan well ahead.",
  },
  {
    day: 10, date: "Thu 29 Oct", city: "Beijing → Home", cityColor: "#A8906A",
    hotel: "Checkout", transport: "Airport Transfer", duration: "Depart 16:40",
    image: img("1603120527222-33f28c2ce89e"),
    activities: [
      { name: "Morning Shopping — Wangfujing", type: "walk" },
      { name: "Airport Transfer (allow 3+ hours)", type: "transport" },
      { name: "Flight Home — 16:40", type: "transport" },
    ],
    restaurants: [],
    notes: "Allow at least 3 hours before departure. Wangfujing is nearby for last-minute gifts.",
  },
];

const ATTRACTIONS = [
  {
    id: "forbidden-city", name: "Forbidden City", chineseName: "故宫", city: "Beijing",
    image: img("1547981609-4b6bfe67ca0b", 1200, 600),
    overview: "The world's largest palace complex and home to 24 emperors over 500 years. A UNESCO World Heritage Site covering 180 acres with 980 surviving buildings.",
    history: "Built 1406–1420 during the Ming Dynasty under Emperor Yongle. It served as the imperial palace for almost 500 years until the Qing Dynasty ended in 1912.",
    facts: ["9,999 rooms — one fewer than the heavenly palace (legend)", "Houses over 1 million artworks", "A 52 m-wide moat surrounds the entire complex", "Red walls symbolise good fortune and prosperity"],
    duration: "3–4 hours", hours: "8:30 AM – 5:00 PM (closed Mondays)",
    photography: ["Gate of Heavenly Peace from Tiananmen Square", "The three Great Halls from the central axis", "Imperial Garden in the northeast — especially in autumn"],
    tips: ["Book tickets online — sell out weeks in advance", "Enter south, exit north into Jingshan Park", "Audio guide is excellent and worth hiring"],
    transport: "Metro Line 1 → Tiananmen East or West",
    nearbyFood: [
      { name: "Made in China (Grand Hyatt)", cuisine: "Peking Duck", price: "¥¥¥¥", distance: "10 min", dish: "Ceremonial duck carving at the table" },
      { name: "Jing Yaa Tang", cuisine: "Modern Chinese", price: "¥¥¥¥", distance: "15 min", dish: "Contemporary Peking duck" },
    ],
  },
  {
    id: "great-wall", name: "Mutianyu Great Wall", chineseName: "慕田峪长城", city: "Beijing",
    image: img("1547150492-da7ff1742941", 1200, 600),
    overview: "The most scenic and best-preserved section of the Great Wall, famous for 22 watchtowers, dense forest, and spectacular autumn colour.",
    history: "Originally fortified during the Northern Qi Dynasty (~550 AD), Mutianyu was substantially rebuilt and extended in 1569 under Ming general Qi Jiguang. This 2.25 km restored section served as a critical northern defence line and has more watchtowers than any other accessible section.",
    facts: ["22 watchtowers along this section", "Autumn foliage peaks late October — perfect timing", "Cable car, chairlift and toboggan available", "Far less crowded than Badaling"],
    duration: "3–4 hours", hours: "7:30 AM – 6:00 PM",
    photography: ["Tower 14 — sweeping panoramic views both ways", "From the cable car ascending through the trees", "Golden hour, 4–5 PM, light is extraordinary"],
    tips: ["Take cable car up, toboggan down — great family fun", "Bring extra layers — significantly cooler up high", "Weekdays are far quieter than weekends"],
    transport: "Private transfer from Beijing (~1.5 hrs); included in guided tour on Day 3",
    nearbyFood: [
      { name: "Schoolhouse at Mutianyu", cuisine: "International", price: "¥¥¥", distance: "At the Wall", dish: "Seasonal farm-to-table menu" },
    ],
  },
  {
    id: "summer-palace", name: "Summer Palace", chineseName: "颐和园", city: "Beijing",
    image: img("1614006620172-ce0fb5969981", 1200, 600),
    overview: "The masterpiece of Chinese landscape design — a vast imperial garden centred around Kunming Lake and Longevity Hill, crafted over centuries of imperial patronage.",
    history: "Originally built in 1750, largely destroyed by Anglo-French forces in 1860, and rebuilt by Empress Dowager Cixi in 1888 using funds meant for the imperial navy.",
    facts: ["Three-quarters of the park is the vast Kunming Lake", "728 m Long Corridor — world’s longest painted gallery", "Marble Boat was built with misappropriated navy funds", "The 17 Arch Bridge is one of China’s most photographed"],
    duration: "2.5–3 hours", hours: "6:30 AM – 6:00 PM",
    photography: ["17 Arch Bridge from the south bank at golden hour", "The Long Corridor — ornate painted ceiling details", "Marble Boat from the water at sunset"],
    tips: ["Hire a rowboat on the lake — October should still be possible", "The quieter back hill is richly rewarding", "Don’t miss the Long Corridor"],
    transport: "Metro Line 4 → Beigongmen Station",
    nearbyFood: [
      { name: "Yi He Yuan Restaurant", cuisine: "Imperial Chinese", price: "¥¥¥", distance: "Inside the park", dish: "Imperial court reproductions" },
    ],
  },
  {
    id: "temple-of-heaven", name: "Temple of Heaven", chineseName: "天坛", city: "Beijing",
    image: img("1590301729964-23833732ee04", 1200, 600),
    overview: "A Ming masterpiece where emperors performed Heaven-Earth ceremonies. The iconic Hall of Prayer for Good Harvests is one of China’s most recognised buildings.",
    history: "Built in 1420, the Temple was the sacred site for the Emperor’s annual prayers for a good harvest. No expense was spared in its sublime construction.",
    facts: ["The Hall roof uses no nails — pure interlocking timber joinery", "Circular Mound Altar creates remarkable acoustic effects", "Surrounding park is where locals practise tai chi every morning", "Three major structures connected by a raised marble walkway"],
    duration: "2 hours", hours: "8:00 AM – 5:30 PM",
    photography: ["Hall of Prayer from the south — the most iconic angle", "The Long Corridor in the park at dawn", "Circular Mound Altar centre stone detail"],
    tips: ["Arrive early to see tai chi in the park — wonderful atmosphere", "The park itself is beautiful for a long walk", "The Echo Wall has fascinating acoustic properties"],
    transport: "Metro Line 5 → Tiantan Dongmen Station",
    nearbyFood: [
      { name: "Laoguo Menjian", cuisine: "Traditional Beijing", price: "¥¥", distance: "5 min walk", dish: "Zha Jiang Mian noodles" },
    ],
  },
  {
    id: "terracotta", name: "Terracotta Army", chineseName: "兵马俑", city: "Xi’an",
    image: img("1659466248885-8b7a03205661", 1200, 600),
    overview: "One of the greatest archaeological discoveries of the 20th century — over 8,000 life-size terracotta soldiers guarding Emperor Qin Shi Huang’s tomb.",
    history: "Discovered in 1974 by farmers digging a well. Created around 210–209 BCE to accompany the first Emperor of China into the afterlife. Excavations continue today.",
    facts: ["8,000+ unique soldiers, horses and chariots", "Every single face is individually modelled", "Originally painted in vivid lacquered colours", "The main mausoleum has never been opened"],
    duration: "2.5–3 hours", hours: "8:30 AM – 5:30 PM",
    photography: ["Overview of Pit 1 from the upper gallery walkway", "Close-up details of individual warrior faces", "Pit 3 — the command centre, far fewer visitors"],
    tips: ["Arrive before 9 AM — tour groups descend rapidly after", "Pit 1 is the most impressive — focus time here", "The on-site museum has superb artefacts"],
    transport: "Taxi from Xi’an city centre (~40 min); included in private tour on Day 6",
    nearbyFood: [
      { name: "Tang Dynasty Palace Restaurant", cuisine: "Imperial Banquet", price: "¥¥¥¥", distance: "Near museum", dish: "Traditional imperial banquet" },
    ],
  },
  {
    id: "xian-wall", name: "Xi’an City Wall", chineseName: "西安城墙", city: "Xi’an",
    image: img("1770035675295-336e5e1e7ed0", 1200, 600),
    overview: "The most complete ancient city wall in China, built in the Ming Dynasty. Cycling the full 14 km circuit is one of China’s great travel experiences.",
    history: "Built in 1370, the wall stands 12 metres high and 12–14 metres wide at the top, with 98 ramparts, 4 main gates and numerous watchtowers, all superbly preserved.",
    facts: ["14 km circumference — about 2 hours by bicycle", "12 metres high, 18 metres wide at the base", "Over 650 years old and fully intact", "Beautifully illuminated at night"],
    duration: "2–3 hours (cycling the full circuit)", hours: "8:00 AM – 10:00 PM",
    photography: ["South Gate at sunset", "Looking back along the wall from a watchtower", "Night photography with the city illuminated below"],
    tips: ["Hire bikes directly at any gate — very affordable", "Start at South Gate at sunset for best photos", "The night view is spectacular — worth staying until dark"],
    transport: "Metro Line 2 → Nan Men (South Gate) Station",
    nearbyFood: [
      { name: "Xi’an Famous Foods", cuisine: "Biang Biang Noodles", price: "¥", distance: "Muslim Quarter", dish: "Spicy hand-pulled belt noodles" },
      { name: "De Fa Chang", cuisine: "Shaanxi Dumplings", price: "¥¥", distance: "Bell Tower Square", dish: "Dumpling banquet set — 20+ varieties" },
    ],
  },
  {
    id: "tiananmen-square", name: "Tiananmen Square", chineseName: "天安门广场", city: "Beijing",
    image: img("1603120527222-33f28c2ce89e", 1200, 600),
    overview: "The world's largest public square, at the symbolic heart of Beijing. Flanked by the Gate of Heavenly Peace, the Great Hall of the People, and the National Museum — the ceremonial centre of modern China.",
    history: "Built in 1417 as the entrance to the Forbidden City, the square was vastly expanded in 1958. It became a global landmark following the pro-democracy demonstrations of 1989.",
    facts: ["440,000 sq m — one of the largest public squares on Earth", "Portrait of Mao Zedong has hung over the gate since 1949", "The square can hold up to one million people", "Flag-raising ceremony at sunrise draws large crowds daily"],
    duration: "45 min – 1 hour",
    hours: "Open daily — hours vary by season",
    photography: ["The Portrait Gate from the south end of the square", "Flag-raising ceremony at sunrise", "Looking north from the square toward the Forbidden City gate"],
    tips: ["Bag searches and security checks are thorough — allow extra time", "The sunrise flag ceremony requires very early arrival", "Photography is freely allowed throughout the square"],
    transport: "Metro Line 1 → Tiananmen East or West Station",
    nearbyFood: [
      { name: "Made in China (Grand Hyatt)", cuisine: "Peking Duck", price: "¥¥¥¥", distance: "10 min", dish: "Ceremonial duck carving at the table" },
    ],
  },
  {
    id: "hangyangling", name: "Hangyangling Museum", chineseName: "汉阳陵博物馆", city: "Xi’an",
    image: img("1620018765412-ceccb1af8fa0", 1200, 600),
    overview: "One of China's most impressive underground museums, built directly over the burial pits of Emperor Jing of the Han Dynasty. Glass floors let you stand above thousands of miniature terracotta figures in situ.",
    history: "Emperor Jing (188–141 BCE) was buried here with his empress. Excavations revealed over 40,000 figurines — smaller and more refined than the Qin Terracotta Army, and still partly painted.",
    facts: ["Over 40,000 miniature terracotta figures discovered", "Glass-floored walkways allow you to stand directly above the excavations", "Figures were originally clothed in real silk — now long decayed", "Far less visited than the Terracotta Army — a much more intimate experience"],
    duration: "1.5–2 hours",
    hours: "8:30 AM – 5:30 PM (closed Mondays)",
    photography: ["Glass floor views down into the burial pits", "Individual figurine close-ups in the display cases", "The outdoor burial mound at golden hour"],
    tips: ["Far quieter than the Terracotta Army — ideal first stop", "The underground viewing experience is exceptional", "Combined tickets with Terracotta Army available"],
    transport: "Taxi from Xi'an city centre (~25–30 min); included in private tour on Day 5",
    nearbyFood: [
      { name: "Hanyangling Museum Café", cuisine: "Light meals", price: "¥¥", distance: "On-site", dish: "Local snacks and coffee" },
    ],
  },
  {
    id: "big-wild-goose-pagoda", name: "Big Wild Goose Pagoda", chineseName: "大雁塔", city: "Xi’an",
    image: img("1598538982410-c86b30005fb4", 1200, 600),
    overview: "A magnificent Tang Dynasty Buddhist pagoda built in 652 AD and standing 64 metres tall. Constructed to house Buddhist scriptures brought back from India by the monk Xuanzang — the real-life inspiration for Journey to the West.",
    history: "Commissioned by Emperor Gaozong, the pagoda was built by the monk Xuanzang after his legendary 17-year pilgrimage to India. It has survived earthquakes and dynasties for over 1,300 years.",
    facts: ["64 metres tall across 7 storeys", "Built to house sutras and relics brought from India", "Xuanzang is the real-life basis for Tripitaka in Journey to the West", "Surrounded by the largest musical fountain in Asia"],
    duration: "1.5–2 hours",
    hours: "8:00 AM – 6:00 PM",
    photography: ["The pagoda from the south fountain plaza — especially at night", "Looking down over Xi'an from the upper levels", "The musical fountain display at dusk"],
    tips: ["Climb all 7 storeys for sweeping city views", "The fountain show runs every evening — time your visit around it", "The surrounding Da Ci'en Temple complex is beautiful to explore"],
    transport: "Metro Line 3 → Daciensi Station (direct, 5 min walk to pagoda)",
    nearbyFood: [
      { name: "South Gate Food Street", cuisine: "Xi'an Street Food", price: "¥¥", distance: "5 min walk", dish: "Rou Jia Mo and cold noodles" },
    ],
  },
  {
    id: "great-mosque", name: "Great Mosque", chineseName: "清真大寺", city: "Xi’an",
    image: img("1770234848905-a80f218c4c2f", 1200, 600),
    overview: "One of the largest and best-preserved mosques in China, blending Islamic faith with classical Chinese architecture. Founded in 742 AD, it sits at the heart of Xi'an's historic Muslim Quarter.",
    history: "Founded in 742 AD during the Tang Dynasty and expanded over subsequent centuries. A remarkable fusion of styles — minarets that look like pagodas, courtyards laid out as a Chinese garden.",
    facts: ["Founded in 742 AD — over 1,280 years old", "Covers more than 12,000 square metres across four courtyards", "The minaret is built in the form of a Chinese pagoda", "Still an active place of worship for Xi'an's Hui Muslim community"],
    duration: "45 min – 1 hour",
    hours: "8:00 AM – 7:00 PM",
    photography: ["The Phoenix Pavilion framed by the courtyard entrance", "Intricate wooden carvings on the prayer hall facade", "The crescent atop the pagoda-minaret"],
    tips: ["Dress modestly — cover shoulders and knees", "Remove shoes before entering the prayer hall", "Non-Muslims may not enter during prayer times"],
    transport: "10 min walk from the Bell Tower, within the Muslim Street area",
    nearbyFood: [
      { name: "Tongshengxiang (同盛祥)", cuisine: "Xi'an Muslim", price: "¥¥", distance: "2 min walk", dish: "Yang Rou Paomo (lamb bread soup)" },
      { name: "Muslim Street stalls", cuisine: "Street Food", price: "¥", distance: "On the street", dish: "Lamb skewers, persimmon cakes, flatbreads" },
    ],
  },
  {
    id: "huaqing-palace", name: "Huaqing Hot Spring Palace", chineseName: "华清宫", city: "Xi’an",
    image: img("1569767189181-7f61e7541869", 1200, 600),
    overview: "A magnificent Tang Dynasty imperial resort at the foot of Lishan Mountain, built around natural hot springs that have been prized for over 3,000 years. Emperor Xuanzong famously spent his winters here with his beloved consort Yang Guifei, inspiring one of China's greatest love poems.",
    history: "The site has been a royal retreat since the Zhou Dynasty, but reached its peak under Tang Emperor Xuanzong (685–762 AD), who expanded it into a grand palace complex. It is also where Chiang Kai-shek was captured in the Xi'an Incident of 1936, which changed the course of Chinese history.",
    facts: ["Hot springs here have been used for over 3,000 years", "Yang Guifei's private bath — the Hawthorn Blossom Pool (海棠汤) — is still visible today", "The Xi'an Incident of 1936 happened here — Chiang Kai-shek was captured in the surrounding hills", "The Tang-era stone bathhouses are among the best-preserved in China"],
    duration: "2–2.5 hours",
    hours: "7:00 AM – 6:30 PM (summer); 7:30 AM – 6:00 PM (winter)",
    photography: ["The Hawthorn Blossom Pool (Yang Guifei's bath) at golden hour", "The Nine-Dragon Lake reflection of the palace halls", "Lishan Mountain backdrop from the main ceremonial courtyard"],
    tips: ["Combine with the Terracotta Army — both are in Lintong district, about 30 km east of Xi'an", "The sound-and-light show in the evenings is spectacular if available", "Wear comfortable shoes — the site covers a large area with gentle hills"],
    transport: "Taxi from Xi'an city centre (~40 min); included in private tour on Day 6",
    nearbyFood: [
      { name: "Lishan Mountain Restaurant", cuisine: "Shaanxi", price: "¥¥", distance: "Near entrance", dish: "Local noodles and lamb dishes" },
      { name: "Terracotta Army Scenic Area Restaurants", cuisine: "Chinese", price: "¥¥", distance: "5 min drive", dish: "Set meals and local snacks" },
    ],
  },
  {
    id: "beiyuanmen-muslim-street", name: "Beiyuanmen Muslim Street", chineseName: "北院门回民街", city: "Xi’an",
    image: img("1526139334526-f591a54b477c", 1200, 600),
    overview: "Xi'an's most famous night market and the heart of the city's Hui Muslim quarter. A dazzling 500-metre street lit by red lanterns, lined with food stalls serving lamb skewers, Rou Jia Mo, hand-pulled noodles, persimmon cakes and much more.",
    history: "The area has been a Muslim trading quarter since the Tang Dynasty, when Xi'an was the eastern terminus of the Silk Road and home to large communities of Persian and Arab merchants. The current street layout dates from the Ming Dynasty.",
    facts: ["Over 1,200 years of Muslim culinary tradition", "Best visited after 6 PM when the lanterns are fully lit", "The Great Mosque of Xi'an lies just inside the street", "Home to over 50 types of street food unique to Shaanxi"],
    duration: "1.5–2.5 hours",
    hours: "Daily from approx. 9 AM – 11 PM (busiest after 6 PM)",
    photography: ["Red lantern canopy at dusk from the street's south entrance", "Action shots at the lamb skewer grills", "The Great Mosque gate viewed from the narrow alley"],
    tips: ["Come hungry — the portions are generous and cheap", "Try the cold Liangpi noodles, Rou Jia Mo, and persimmon cakes", "Bargain gently at souvenir stalls — prices are often doubled for tourists"],
    transport: "Metro Line 2 → Zhonglou (Bell Tower) Station, then 10 min walk north",
    nearbyFood: [
      { name: "Muslim Street stalls", cuisine: "Hui Street Food", price: "¥", distance: "On the street", dish: "Lamb skewers, Rou Jia Mo, persimmon cakes" },
      { name: "Tongshengxiang (同盛祥)", cuisine: "Xi'an Muslim", price: "¥¥", distance: "2 min", dish: "Yang Rou Paomo (lamb bread soup)" },
    ],
  },
  {
    id: "jingshan-park", name: "Jingshan Park", chineseName: "景山公园", city: "Beijing",
    image: img("1603036662536-802c5b47f980", 1200, 600),
    overview: "A tranquil hilltop park directly north of the Forbidden City, offering the single best panoramic view over the imperial palace complex. The park was built from earth excavated during construction of the Forbidden City in the 15th century.",
    history: "Created in the early Ming Dynasty as an imperial pleasure garden, Jingshan (Coal Hill) served as a feng shui barrier protecting the Forbidden City from northern winds. The Qing emperor Chongzhen famously took his life here in 1644 as Li Zicheng's rebel army entered Beijing.",
    facts: ["The hilltop pavilion sits exactly on Beijing's central north-south axis", "At 45.7 metres, the hill once defined the city's height limit", "Emperor Chongzhen, the last Ming emperor, died at a locust tree in this park", "Five pavilions top the hill — the central Wanchun Pavilion has the finest view"],
    duration: "1 – 1.5 hours",
    hours: "6:00 AM – 9:00 PM",
    photography: ["The Forbidden City panorama from the Wanchun Pavilion (central summit)", "Autumn foliage framing the golden palace rooftops", "Looking south at sunrise for dramatic golden light over the palace"],
    tips: ["Arrive early to beat tour groups and catch the morning light", "It's a short but steep climb — the view at the top is worth every step", "Combine with a morning visit to the Forbidden City, entering via the north gate (Shenwu Gate)"],
    transport: "Exit the Forbidden City via Shenwu Gate (north) — park entrance is directly opposite",
    nearbyFood: [
      { name: "Jingshan Park Teahouse", cuisine: "Traditional Tea", price: "¥¥", distance: "Inside park", dish: "Chinese tea and light snacks" },
      { name: "Lotus Lane (Houhai)", cuisine: "Mixed, Cafes & Bars", price: "¥¥–¥¥¥", distance: "15 min walk", dish: "Lakeside dining with Beijing views" },
    ],
  },
  {
    id: "gongyan-imperial-dinner-show", name: "Gongyan Imperial Dinner Show", chineseName: "宫宴", city: "Beijing",
    image: img("1754258988071-2bbd57616671", 1200, 600),
    overview: "A legendary Beijing dining experience combining an elaborate imperial banquet with a full live performance of traditional court music, dance and acrobatics. Staged in a historic courtyard setting, it recreates the grandeur of a Tang Dynasty palace feast.",
    history: "Gongyan has been running since the 1980s, based on meticulous research into Tang Dynasty imperial court cuisine and entertainment. It was one of the first cultural dining experiences in China to recreate palace-era food and performance together.",
    facts: ["Menu is based on historical imperial court recipes", "Performance includes traditional music, dance and acrobatic acts", "The venue is modelled on a traditional Chinese courtyard theatre", "Bookings are often required weeks in advance — especially for autumn"],
    duration: "2 – 2.5 hours",
    hours: "Evening performance only — typically 7:00 PM",
    photography: ["Costumed performers during the opening ceremony", "The lavishly decorated table settings", "Dancers in full Tang Dynasty court dress"],
    tips: ["Book tickets well in advance — a popular evening experience", "Dress smartly — this is a formal-feeling occasion", "Vegetarian options available but limited — mention when booking"],
    transport: "Taxi recommended from Nanluoguxiang or Jingshan Park (~10–15 min)",
    nearbyFood: [
      { name: "Gongyan Restaurant (on-site)", cuisine: "Imperial Banquet", price: "¥¥¥¥", distance: "On-site", dish: "Full imperial banquet included with the show" },
    ],
  },
];

const FOOD_CATEGORIES = [
  {
    id: "peking-duck", name: "Peking Duck", emoji: "🦆", tagline: "Beijing’s most iconic dish",
    description: "Lacquered duck roasted in a fruit-wood oven, served with paper-thin pancakes, spring onions and hoisin sauce. A Beijing institution for over 600 years.",
    restaurants: [
      { name: "Quanjude (全聚德)", rating: "4.5", price: "¥¥¥¥", location: "Multiple, Beijing", dish: "Signature whole roast duck ceremony" },
      { name: "Dadong (大董)", rating: "4.8", price: "¥¥¥¥¥", location: "Nanxincang, Beijing", dish: "Modern lean-cut Peking duck" },
      { name: "Made in China", rating: "4.6", price: "¥¥¥¥", location: "Grand Hyatt Beijing", dish: "Open kitchen ceremonial carving" },
    ],
  },
  {
    id: "hot-pot", name: "Hot Pot", emoji: "🍲", tagline: "Cook it yourself in bubbling broth",
    description: "A communal dining experience where fresh ingredients are cooked in a shared pot of richly spiced broth at the table. Choose spicy Sichuan or clear Mongolian broth.",
    restaurants: [
      { name: "Haidilao (海底捞)", rating: "4.7", price: "¥¥¥", location: "Multiple locations", dish: "Classic spicy + clear broth combo" },
      { name: "Xiabu Xiabu", rating: "4.2", price: "¥¥", location: "Near Wangfujing", dish: "Individual portion hot pot" },
    ],
  },
  {
    id: "dumplings", name: "Dumplings", emoji: "🥟", tagline: "Jiaozi, baozi, xiaolongbao",
    description: "China’s dumpling family is vast and endlessly satisfying. From steamed soup-filled xiao long bao to pan-fried potstickers — look for handmade varieties.",
    restaurants: [
      { name: "Din Tai Fung (鼎泰豐)", rating: "4.8", price: "¥¥¥¥", location: "Wangfujing, Beijing", dish: "Xiao Long Bao (soup dumplings)" },
      { name: "De Fa Chang (德发长)", rating: "4.6", price: "¥¥¥", location: "Bell Tower Sq, Xi’an", dish: "Dumpling banquet — 20+ varieties" },
    ],
  },
  {
    id: "noodles", name: "Biang Biang Noodles", emoji: "🍜", tagline: "Xi’an’s legendary belt noodles",
    description: "Wide, chewy, hand-pulled noodles tossed with chilli oil, garlic and vinegar — Xi’an’s most famous dish. The character ‘biang’ is the most complex in Chinese writing.",
    restaurants: [
      { name: "Xi’an Famous Foods", rating: "4.6", price: "¥¥", location: "Muslim Quarter, Xi’an", dish: "Spicy biang biang noodles with pork" },
      { name: "Wei Jia Liang Pi", rating: "4.4", price: "¥", location: "Muslim Street", dish: "Cold skin noodles (Liang Pi)" },
    ],
  },
  {
    id: "muslim", name: "Muslim Cuisine", emoji: "🥙", tagline: "Xi’an’s Silk Road flavours",
    description: "Xi’an’s Muslim Quarter blends Central Asian and Chinese flavours — lamb skewers, flatbreads, Paomo soup, and the famous Rou Jia Mo sandwich.",
    restaurants: [
      { name: "Tongshengxiang (同盛祥)", rating: "4.7", price: "¥¥", location: "Muslim Street, Xi’an", dish: "Yang Rou Paomo (lamb bread soup)" },
      { name: "Lao Sun Jia (老孙家)", rating: "4.5", price: "¥¥", location: "East Gate Area", dish: "Paomo and slow-cooked lamb" },
    ],
  },
  {
    id: "tea", name: "Tea Houses", emoji: "🍵", tagline: "Ancient ritual, sublime flavour",
    description: "Experience the ancient art of the Chinese tea ceremony. Try Longjing (Dragon Well), Tieguanyin oolong, or aged Pu-erh, paired with classical music or Peking Opera.",
    restaurants: [
      { name: "Lao She Teahouse (老舍茶馆)", rating: "4.6", price: "¥¥¥", location: "Qianmen, Beijing", dish: "Tea ceremony + Peking Opera performance" },
      { name: "Wuyutai Tea House (吴裕泰)", rating: "4.4", price: "¥¥", location: "Wangfujing, Beijing", dish: "Premium loose-leaf teas and matcha soft serve" },
    ],
  },
  {
    id: "street", name: "Street Food", emoji: "🍡", tagline: "Beijing and Xi’an at their tastiest",
    description: "Tanghulu (candied hawthorn skewers), jianbing (egg crepes), candied chestnuts, and lamb skewers — eat as the locals eat on the most famous food lanes.",
    restaurants: [
      { name: "Nanluoguxiang Alley", rating: "4.5", price: "¥", location: "Nanluoguxiang, Beijing", dish: "Tanghulu, stuffed pancakes, snacks" },
      { name: "Beiyuanmen Muslim Street", rating: "4.6", price: "¥", location: "Muslim Quarter, Xi’an", dish: "Lamb skewers, persimmon cakes" },
    ],
  },
  {
    id: "cafes", name: "Modern Cafes", emoji: "☕", tagline: "China’s thriving coffee culture",
    description: "China’s specialty coffee scene has exploded — stunning cafes in converted hutongs and heritage courtyards. Perfect for a morning coffee or afternoon rest.",
    restaurants: [
      { name: "Seesaw Coffee", rating: "4.5", price: "¥¥", location: "Sanlitun, Beijing", dish: "Single origin pour-overs" },
      { name: "Mellower Coffee", rating: "4.4", price: "¥¥", location: "Near Forbidden City", dish: "Cloud coffee and seasonal specials" },
    ],
  },
];

const LOCAL_SLANG = [
  { slang: "牛逼", pinyin: "Niú bī", meaning: "Awesome / Epic", context: "The highest compliment. Say it when something truly impresses you — food, a view, a performance." },
  { slang: "666", pinyin: "Liù liù liù", meaning: "Smooth / Impressive", context: "Derived from gaming. Used when someone does something skillfully or effortlessly. You’ll see it everywhere online." },
  { slang: "躺平", pinyin: "Tǎng píng", meaning: "Lie flat / Give up striving", context: "A cultural movement of rejecting hustle culture. Used humorously when someone opts out of effort." },
  { slang: "内卷", pinyin: "Nèi juǎn", meaning: "Involution / Rat race", context: "Describes intense, often pointless competition. Locals use it to complain about work or study pressure." },
  { slang: "打卡", pinyin: "Dǎ kǎ", meaning: "Check in / Tick it off", context: "Originally ‘clock in’. Now means visiting a trendy spot to photograph and post online. Very common at tourist sites." },
  { slang: "吃瓜", pinyin: "Chī guā", meaning: "Watch the drama / Spectate", context: "Literally ‘eat melon’. Refers to watching a situation unfold as a bystander — China’s version of popcorn." },
  { slang: "凡尔赛", pinyin: "Fán ěr sài", meaning: "Humble bragging", context: "From ‘Versailles’. Used when someone complains about a problem that’s clearly a flex. Very ironic usage." },
  { slang: "破防", pinyin: "Pò fáng", meaning: "Hit in the feels", context: "Literally ‘break defence’. Used when something emotionally moves you or catches you off guard." },
  { slang: "整活", pinyin: "Zhěng huó", meaning: "Do something wild / Pull a stunt", context: "Used for spontaneous, creative or outrageous actions. Positive spin — means having a good time doing something unexpected." },
  { slang: "yyds", pinyin: "Yǒng yuǎn de shén", meaning: "GOAT / The absolute best", context: "Short for ‘永远的神’ (eternal god). The Chinese equivalent of saying something is the greatest of all time." },
  { slang: "搞笑", pinyin: "Gǎo xiào", meaning: "Hilarious / You’re joking", context: "Can mean genuinely funny, or sarcastically ‘are you serious?’. Tone is everything with this one." },
  { slang: "佛系", pinyin: "Fó xì", meaning: "Chill / Buddhist about it", context: "Describes a relaxed, go-with-the-flow attitude. Someone who doesn’t stress about outcomes is ‘佛系’." },
];

const TRAVEL_TIPS = [
  {
    id: "rail", icon: "train", category: "Rail Tickets",
    journeys: [
      { date: "Thu 23 Oct", from: "Beijing West", dep: "09:55", to: "Xi’an North", arr: "14:05", duration: "4h 10m", cls: "1st Class" },
      { date: "Mon 26 Oct", from: "Xi’an North", dep: "10:09", to: "Beijing West", arr: "14:26", duration: "4h 17m", cls: "1st Class" },
    ],
    items: ["Tickets require your passport — keep it accessible on both train days", "Arrive at the station at least 45 minutes before departure"],
  },
  {
    id: "internet", icon: "wifi", category: "Internet & Apps",
    items: ["WeChat is essential — set up your account before departing", "WeChat Pay or Alipay for cashless payments — near-universal", "Download: DiDi (taxis), Baidu Maps (offline), Google Translate (offline Chinese pack)"],
  },
  {
    id: "packing", icon: "package", category: "Packing Essentials",
    items: ["Comfortable walking shoes — expect 8–12 km per day", "Layers: October is warm days (~18°C) and cool evenings (~8°C) in Beijing", "Power adapter: China uses Type A flat 2-pin (220V) — UK adapter essential", "Portable battery pack for long sightseeing days", "Hand sanitiser and pocket tissues — some public toilets supply neither", "Small daypack for water, camera and extra layers"],
  },
  {
    id: "apps", icon: "wifi", category: "Useful Apps",
    items: ["WeChat — messaging, payments, mini-programs", "DiDi — China’s Uber, essential for taxis", "Baidu Maps — best offline maps for China", "Google Translate — download Chinese offline pack", "Trip.com — local hotel and tour booking"],
  },
  {
    id: "shopping", icon: "shop", category: "Shopping Tips",
    items: ["Wangfujing and Sanlitun for upscale shopping in Beijing", "Silk Street Market and Panjiayuan for souvenirs — bargain hard", "Muslim Street in Xi’an for unique crafts and street food gifts", "Avoid buying jade unless from a certified dealer", "Keep receipts for purchases over ¥2,000 for customs"],
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type DayData = (typeof ITINERARY)[0];
type AttractionData = (typeof ATTRACTIONS)[0];

// ─── Shared Components ────────────────────────────────────────────────────────

function SectionHeader({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center">
      <p className="text-[#D4A017] text-xs tracking-[0.3em] mb-3">{label}</p>
      <h2 className="font-display text-3xl md:text-4xl text-[#F5EDD6] mb-3">{title}</h2>
      {subtitle && <p className="text-[#A8906A] text-sm">{subtitle}</p>}
    </div>
  );
}

function ActivityIcon({ type }: { type: string }) {
  const cls = "w-4 h-4";
  if (type === "transport") return <Train className={cls} />;
  if (type === "hotel") return <MapPin className={cls} />;
  if (type === "attraction") return <Camera className={cls} />;
  return <Globe className={cls} />;
}

function TipIcon({ icon }: { icon: string }) {
  const cls = "w-4 h-4";
  const map: Record<string, JSX.Element> = {
    hotel: <MapPin className={cls} />,
    plane: <Plane className={cls} />,
    train: <Train className={cls} />,
    wifi: <Wifi className={cls} />,
    card: <CreditCard className={cls} />,
    package: <Package className={cls} />,
    alert: <AlertCircle className={cls} />,
    globe: <Globe className={cls} />,
    shop: <ShoppingBag className={cls} />,
  };
  return map[icon] ?? <Globe className={cls} />;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function Navigation({ active, onNav }: { active: string; onNav: (id: string) => void }) {
  return (
    <>
      {/* Desktop sticky top */}
      <nav className="hidden md:flex fixed top-0 inset-x-0 z-50 items-center justify-between px-8 py-4 bg-[#130808]/90 backdrop-blur-lg border-b border-[rgba(212,160,23,0.12)]">
        <span className="font-display text-[#D4A017] text-lg tracking-widest">CHINA 2026</span>
        <ul className="flex gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNav(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  active === item.id
                    ? "bg-[#C8102E] text-[#F5EDD6]"
                    : "text-[#A8906A] hover:text-[#F5EDD6] hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile sticky bottom */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#130808]/95 backdrop-blur-lg border-t border-[rgba(212,160,23,0.12)]">
        <ul className="flex overflow-x-auto scrollbar-hide px-2 py-2 gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.id} className="flex-shrink-0">
              <button
                onClick={() => onNav(item.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 min-h-[44px] ${
                  active === item.id
                    ? "bg-[#C8102E] text-[#F5EDD6]"
                    : "text-[#A8906A] hover:text-[#F5EDD6]"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

// ─── Journey Quick-Look Modals ─────────────────────────────────────────────────

const HSR_JOURNEYS = [
  {
    date: "Fri 23 Oct",
    from: "Beijing West",
    to: "Xi'an North",
    dep: "09:55",
    arr: "14:05",
    duration: "4h 10m",
    class: "1st Class",
    note: "Passport required at boarding. Arrive at least 45 min early.",
  },
  {
    date: "Mon 26 Oct",
    from: "Xi'an North",
    to: "Beijing West",
    dep: "10:09",
    arr: "14:26",
    duration: "4h 17m",
    class: "1st Class",
    note: "Passport required at boarding. Arrive at least 45 min early.",
  },
];

const FLIGHTS = [
  {
    date: "Tue 20 Oct 2026",
    label: "OUTBOUND FLIGHT",
    flight: "SQ802",
    aircraft: "Boeing 777-300ER",
    color: "#3D7A5F",
    from: "Singapore (SIN)",
    dep: "08:30",
    to: "Beijing (PEK)",
    arr: "14:40",
    terminal: "Changi Airport T3  →  Beijing Capital T3",
    note: "Airport transfer to Beijing Xinqiao Hotel on arrival.",
  },
  {
    date: "Thu 29 Oct 2026",
    label: "RETURN FLIGHT",
    flight: "SQ807",
    aircraft: "Boeing 777-300ER",
    color: "#C8102E",
    from: "Beijing (PEK)",
    dep: "16:40",
    to: "Singapore (SIN)",
    arr: "22:55",
    terminal: "Beijing Capital T3  →  Changi Airport T3",
    note: "Check-out, last-minute shopping at Wangfujing, then airport transfer. Allow 3 hrs before departure.",
  },
];

function HSRModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#130808]/80 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-lg max-h-[85vh] rounded-3xl bg-[#1E0D0D] border border-[rgba(212,160,23,0.2)] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(212,160,23,0.12)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[rgba(212,160,23,0.1)] flex items-center justify-center">
              <Train size={18} className="text-[#D4A017]" />
            </div>
            <div>
              <p className="text-[#F5EDD6] font-medium text-sm">High Speed Rail</p>
              <p className="text-[#A8906A] text-xs">Both journey details</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[rgba(245,237,214,0.06)] flex items-center justify-center hover:bg-[rgba(245,237,214,0.12)] transition-colors">
            <X size={15} className="text-[#A8906A]" />
          </button>
        </div>

        {/* Journeys */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {HSR_JOURNEYS.map((j, i) => (
            <div key={i} className="rounded-2xl bg-[rgba(212,160,23,0.04)] border border-[rgba(212,160,23,0.1)] p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#D4A017] text-xs font-medium tracking-widest">{j.date.toUpperCase()}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[rgba(212,160,23,0.12)] text-[#D4A017] text-xs font-medium">{j.class}</span>
              </div>
              {/* Route timeline */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[#F5EDD6] text-2xl font-semibold leading-none">{j.dep}</p>
                  <p className="text-[#A8906A] text-xs mt-1 leading-tight">{j.from}</p>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <p className="text-[#A8906A] text-[10px] tracking-widest">{j.duration}</p>
                  <div className="w-full flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full border-2 border-[#D4A017] flex-shrink-0" />
                    <div className="flex-1 h-px bg-gradient-to-r from-[#D4A017] to-[rgba(212,160,23,0.3)]" />
                    <Train size={14} className="text-[#D4A017] flex-shrink-0" />
                    <div className="flex-1 h-px bg-gradient-to-r from-[rgba(212,160,23,0.3)] to-[#D4A017]" />
                    <div className="w-2 h-2 rounded-full border-2 border-[#D4A017] flex-shrink-0" />
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-[#F5EDD6] text-2xl font-semibold leading-none">{j.arr}</p>
                  <p className="text-[#A8906A] text-xs mt-1 leading-tight">{j.to}</p>
                </div>
              </div>
              <p className="text-[#A8906A] text-xs mt-4 leading-relaxed">{j.note}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function FlightModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#130808]/80 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-lg max-h-[85vh] rounded-3xl bg-[#1E0D0D] border border-[rgba(212,160,23,0.2)] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(212,160,23,0.12)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[rgba(200,16,46,0.1)] flex items-center justify-center">
              <Plane size={18} className="text-[#C8102E]" />
            </div>
            <div>
              <p className="text-[#F5EDD6] font-medium text-sm">Flight Details</p>
              <p className="text-[#A8906A] text-xs">Inbound & outbound</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[rgba(245,237,214,0.06)] flex items-center justify-center hover:bg-[rgba(245,237,214,0.12)] transition-colors">
            <X size={15} className="text-[#A8906A]" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          {FLIGHTS.map((f) => (
            <div key={f.label} className="rounded-2xl bg-[rgba(212,160,23,0.04)] border border-[rgba(212,160,23,0.1)] p-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium tracking-widest" style={{ color: f.color }}>{f.label}</span>
                <span className="text-[#A8906A] text-xs">{f.date}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#F5EDD6] text-xs font-medium">{f.flight}</span>
                <span className="text-[rgba(212,160,23,0.35)] text-xs">·</span>
                <span className="text-[#A8906A] text-xs">{f.aircraft}</span>
              </div>
              <p className="text-[#A8906A] text-xs mb-4">🏛 {f.terminal}</p>
              {/* Route timeline — same layout as HSR */}
              <div className="flex items-center gap-3">
                <div className="text-right min-w-0">
                  <p className="text-[#F5EDD6] text-2xl font-semibold leading-none">{f.dep}</p>
                  <p className="text-[#A8906A] text-xs mt-1 leading-tight">{f.from}</p>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <p className="text-[#A8906A] text-[10px] tracking-widest">FLIGHT</p>
                  <div className="w-full flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full border-2 flex-shrink-0" style={{ borderColor: f.color }} />
                    <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${f.color}, rgba(212,160,23,0.3))` }} />
                    <Plane size={14} className="flex-shrink-0" style={{ color: f.color }} />
                    <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, rgba(212,160,23,0.3), ${f.color})` }} />
                    <div className="w-2 h-2 rounded-full border-2 flex-shrink-0" style={{ borderColor: f.color }} />
                  </div>
                </div>
                <div className="text-left min-w-0">
                  <p className="text-[#F5EDD6] text-2xl font-semibold leading-none">{f.arr}</p>
                  <p className="text-[#A8906A] text-xs mt-1 leading-tight">{f.to}</p>
                </div>
              </div>
              <p className="text-[#A8906A] text-xs mt-4 leading-relaxed">{f.note}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function HeroSection({ onNav, onShowHSR, onShowFlight }: { onNav: (id: string) => void; onShowHSR: () => void; onShowFlight: () => void }) {
  return (
    <section id="overview" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#1A0808]">
      <div className="absolute inset-0">
        <img
          src={img("1603120527222-33f28c2ce89e", 1600, 900)}
          alt="Beijing aerial view during autumn"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#130808]/55 via-[#130808]/35 to-[#130808]" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border border-[rgba(245,237,214,0.55)] bg-[rgba(245,237,214,0.1)] text-[#F5EDD6] text-xs tracking-[0.28em] font-medium backdrop-blur-sm"
        >
          20 – 29 OCTOBER 2026
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-5"
        >
          <p className="text-[#F5EDD6] text-xs md:text-sm tracking-[0.55em] font-medium mb-4 opacity-70">FAMILY TRAVEL</p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-[#F5EDD6] leading-none tracking-tight">
            China
          </h1>
          <div className="flex items-center justify-center gap-4 mt-1">
            <div className="h-px flex-1 max-w-[80px] md:max-w-[140px] bg-gradient-to-r from-transparent to-[rgba(212,160,23,0.6)]" />
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-[#D4A017] leading-none tracking-wide">
              Adventure
            </h2>
            <div className="h-px flex-1 max-w-[80px] md:max-w-[140px] bg-gradient-to-l from-transparent to-[rgba(212,160,23,0.6)]" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-[#A8906A] text-sm md:text-base tracking-[0.45em] mb-12"
        >
          BEIJING • XI’AN
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {HERO_STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center px-5 py-3 rounded-2xl bg-[rgba(245,237,214,0.05)] border border-[rgba(212,160,23,0.18)] backdrop-blur-sm min-w-[80px]"
            >
              <span className="font-display text-2xl text-[#D4A017]">{stat.value}</span>
              <span className="text-[#A8906A] text-xs tracking-wider mt-0.5">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Quick-access widgets */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          <button
            onClick={onShowHSR}
            className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[rgba(212,160,23,0.35)] bg-[rgba(212,160,23,0.08)] hover:bg-[rgba(212,160,23,0.16)] hover:border-[rgba(212,160,23,0.6)] backdrop-blur-sm transition-all duration-200"
          >
            <Train size={14} className="text-[#D4A017]" />
            <span className="text-[#F5EDD6] text-xs font-medium tracking-wide whitespace-nowrap">HSR Details</span>
          </button>
          <button
            onClick={onShowFlight}
            className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[rgba(200,16,46,0.35)] bg-[rgba(200,16,46,0.08)] hover:bg-[rgba(200,16,46,0.18)] hover:border-[rgba(200,16,46,0.6)] backdrop-blur-sm transition-all duration-200"
          >
            <Plane size={14} className="text-[#C8102E]" />
            <span className="text-[#F5EDD6] text-xs font-medium tracking-wide whitespace-nowrap">Flight Details</span>
          </button>
          <a
            href="https://drive.google.com/drive/folders/18bamawkpipFNCrL9hOux7zbmHgIg_kmW?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[rgba(61,122,95,0.35)] bg-[rgba(61,122,95,0.08)] hover:bg-[rgba(61,122,95,0.18)] hover:border-[rgba(61,122,95,0.6)] backdrop-blur-sm transition-all duration-200"
          >
            <FolderOpen size={14} className="text-[#3D7A5F]" />
            <span className="text-[#F5EDD6] text-xs font-medium tracking-wide whitespace-nowrap">Trip Documents</span>
          </a>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95 }}
          onClick={() => onNav("itinerary")}
          className="group flex flex-col items-center gap-2 mx-auto text-[#A8906A] hover:text-[#D4A017] transition-colors"
        >
          <span className="text-xs tracking-[0.25em]">EXPLORE ITINERARY</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
}

// ─── Day Card ─────────────────────────────────────────────────────────────────

function DayCard({
  day,
  isExpanded,
  onToggle,
  onAttractionClick,
}: {
  day: DayData;
  isExpanded: boolean;
  onToggle: () => void;
  onAttractionClick: (name: string) => void;
}) {
  return (
    <article className="rounded-2xl overflow-hidden border border-[rgba(212,160,23,0.12)] bg-[#1E0D0D] hover:border-[rgba(212,160,23,0.28)] transition-colors duration-300">
      <button
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="w-full flex items-center gap-4 p-5 text-left"
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-full border border-[rgba(212,160,23,0.3)] flex items-center justify-center">
          <span className="font-display text-[#D4A017] text-sm leading-none">{day.day}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[#F5EDD6] text-sm font-medium">{day.date}</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full border"
              style={{ color: day.cityColor, borderColor: `${day.cityColor}33`, background: `${day.cityColor}12` }}
            >
              {day.city}
            </span>
          </div>
          <p className="text-[#A8906A] text-xs truncate">
            {day.activities.map((a) => a.name).join(" · ")}
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          <span className="hidden sm:block text-[#A8906A] text-xs whitespace-nowrap">{day.duration}</span>
          <ChevronDown
            size={16}
            className={`text-[#A8906A] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {/* Day image */}
            <div className="relative h-52 overflow-hidden">
              <img src={day.image} alt={`Day ${day.day} — ${day.city}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E0D0D] via-[#1E0D0D]/10 to-transparent" />
              <div className="absolute bottom-4 left-5 flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(19,8,8,0.85)] border border-[rgba(212,160,23,0.2)] text-[#F5EDD6] text-xs backdrop-blur-sm">
                  <MapPin size={11} className="text-[#D4A017]" /> {day.hotel}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(19,8,8,0.85)] border border-[rgba(212,160,23,0.2)] text-[#A8906A] text-xs backdrop-blur-sm">
                  <Clock size={11} className="text-[#D4A017]" /> {day.transport}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-6">
              {/* Activities */}
              <div>
                <p className="text-[#D4A017] text-xs tracking-widest mb-3">ACTIVITIES</p>
                <div className="space-y-2">
                  {day.activities.map((activity, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[rgba(212,160,23,0.07)] border border-[rgba(212,160,23,0.12)] flex items-center justify-center text-[#A8906A] flex-shrink-0">
                        <ActivityIcon type={activity.type} />
                      </div>
                      {activity.type === "attraction" ? (
                        <button
                          onClick={() => onAttractionClick(activity.name)}
                          className="text-[#F5EDD6] text-sm hover:text-[#D4A017] transition-colors flex items-center gap-1 text-left"
                        >
                          {activity.name}
                          <ChevronRight size={12} className="text-[#A8906A]" />
                        </button>
                      ) : (
                        <span className="text-[#F5EDD6] text-sm">{activity.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dining */}
              <div>
                <p className="text-[#D4A017] text-xs tracking-widest mb-3">RECOMMENDED DINING</p>
                <div className="space-y-2">
                  {day.restaurants.map((r, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[rgba(212,160,23,0.04)] border border-[rgba(212,160,23,0.08)]">
                      <Utensils size={13} className="text-[#D4A017] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[#F5EDD6] text-sm font-medium">{r.name}</p>
                        <p className="text-[#A8906A] text-xs">{r.cuisine} · {r.price} · {r.distance}</p>
                        {r.dish && <p className="text-[#A8906A] text-xs italic mt-0.5">{r.dish}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {day.notes && (
                <div className="p-4 rounded-xl bg-[rgba(200,16,46,0.05)] border border-[rgba(200,16,46,0.12)]">
                  <p className="text-[#A8906A] text-sm leading-relaxed">{day.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

// ─── Itinerary Section ────────────────────────────────────────────────────────

function ItinerarySection({ onAttractionClick }: { onAttractionClick: (name: string) => void }) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  return (
    <section id="itinerary" className="py-20 px-4 max-w-2xl mx-auto">
      <SectionHeader label="ITINERARY" title="10 Days in China" subtitle="Tap any day to explore the full schedule" />
      <div className="space-y-3 mt-10">
        {ITINERARY.map((day) => (
          <DayCard
            key={day.day}
            day={day}
            isExpanded={expandedDay === day.day}
            onToggle={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
            onAttractionClick={onAttractionClick}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Attraction Card ──────────────────────────────────────────────────────────

function AttractionCard({ attraction, onClick }: { attraction: AttractionData; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-[rgba(212,160,23,0.12)] bg-[#1E0D0D] text-left w-full hover:border-[rgba(212,160,23,0.35)] hover:shadow-[0_0_40px_rgba(212,160,23,0.06)] transition-all duration-300"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={attraction.image}
          alt={attraction.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E0D0D] via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(19,8,8,0.85)] border border-[rgba(212,160,23,0.2)] text-[#D4A017] backdrop-blur-sm">
            {attraction.chineseName}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg text-[#F5EDD6] mb-1 leading-tight">{attraction.name}</h3>
        <p className="text-[#A8906A] text-xs leading-relaxed line-clamp-2">{attraction.overview}</p>
        <div className="flex items-center gap-3 mt-3">
          <span className="flex items-center gap-1 text-[#A8906A] text-xs">
            <Clock size={10} /> {attraction.duration}
          </span>
          <span className="flex items-center gap-1 text-[#3D7A5F] text-xs">
            <ChevronRight size={10} /> View details
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── Destination Section ──────────────────────────────────────────────────────

function DestinationSection({
  sectionId, city, tagline, description, heroImage, onSelect,
}: {
  sectionId: string; city: string; tagline: string; description: string;
  heroImage: string; onSelect: (a: AttractionData) => void;
}) {
  const attractions = ATTRACTIONS.filter((a) => a.city === city);
  return (
    <section id={sectionId} className="py-20 px-4 max-w-5xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden h-64 md:h-80 mb-10">
        <img src={heroImage} alt={city} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#130808]/85 via-[#130808]/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
          <p className="text-[#D4A017] text-xs tracking-[0.3em] mb-2">{tagline}</p>
          <h2 className="font-display text-4xl md:text-5xl text-[#F5EDD6]">{city}</h2>
          <p className="text-[#A8906A] text-sm mt-2 max-w-sm leading-relaxed">{description}</p>
        </div>
      </div>
      <p className="text-[#D4A017] text-xs tracking-widest mb-6">KEY ATTRACTIONS</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {attractions.map((a) => (
          <AttractionCard key={a.id} attraction={a} onClick={() => onSelect(a)} />
        ))}
      </div>
    </section>
  );
}

// ─── Attraction Modal ─────────────────────────────────────────────────────────

function AttractionModal({ attraction, onClose }: { attraction: AttractionData; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#130808]/95 backdrop-blur-lg overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="max-w-2xl mx-auto min-h-full pb-28 md:pb-16"
      >
        {/* Hero */}
        <div className="relative h-72 md:h-96">
          <img src={attraction.image} alt={attraction.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#130808] via-transparent to-[#130808]/30" />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[rgba(19,8,8,0.85)] border border-[rgba(212,160,23,0.2)] flex items-center justify-center text-[#F5EDD6] hover:bg-[#C8102E] transition-colors"
          >
            <X size={18} />
          </button>
          <div className="absolute bottom-6 left-6">
            <p className="text-[#D4A017] text-xs tracking-widest mb-1">{attraction.chineseName} · {attraction.city}</p>
            <h2 className="font-display text-3xl md:text-4xl text-[#F5EDD6]">{attraction.name}</h2>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Quick info */}
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(212,160,23,0.08)] border border-[rgba(212,160,23,0.18)] text-[#D4A017] text-xs">
              <Clock size={11} /> {attraction.duration}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(212,160,23,0.08)] border border-[rgba(212,160,23,0.18)] text-[#A8906A] text-xs">
              <MapPin size={11} /> {attraction.transport}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-[rgba(212,160,23,0.08)] border border-[rgba(212,160,23,0.18)] text-[#A8906A] text-xs">
              {attraction.hours}
            </span>
          </div>

          {/* Overview */}
          <div>
            <p className="text-[#D4A017] text-xs tracking-widest mb-2">OVERVIEW</p>
            <p className="text-[#F5EDD6] leading-relaxed">{attraction.overview}</p>
          </div>

          {/* History */}
          <div>
            <p className="text-[#D4A017] text-xs tracking-widest mb-2">HISTORY</p>
            <p className="text-[#A8906A] leading-relaxed">{attraction.history}</p>
          </div>

          {/* Facts */}
          <div>
            <p className="text-[#D4A017] text-xs tracking-widest mb-3">INTERESTING FACTS</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {attraction.facts.map((fact, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-[rgba(212,160,23,0.04)] border border-[rgba(212,160,23,0.08)]">
                  <span className="text-[#D4A017] text-xs mt-0.5 flex-shrink-0">◆</span>
                  <span className="text-[#A8906A] text-sm">{fact}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Photography */}
          <div>
            <p className="text-[#D4A017] text-xs tracking-widest mb-3">
              BEST PHOTO SPOTS
            </p>
            <ul className="space-y-2">
              {attraction.photography.map((spot, i) => (
                <li key={i} className="flex items-start gap-2 text-[#A8906A] text-sm">
                  <Camera size={13} className="text-[#C8102E] mt-0.5 flex-shrink-0" />
                  {spot}
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div>
            <p className="text-[#D4A017] text-xs tracking-widest mb-3">TRAVEL TIPS</p>
            <ul className="space-y-2">
              {attraction.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-[#A8906A] text-sm">
                  <span className="text-[#3D7A5F] mt-0.5 flex-shrink-0">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Nearby dining */}
          <div>
            <p className="text-[#D4A017] text-xs tracking-widest mb-3">NEARBY DINING</p>
            <div className="space-y-2">
              {attraction.nearbyFood.map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[rgba(212,160,23,0.04)] border border-[rgba(212,160,23,0.08)]">
                  <Utensils size={13} className="text-[#D4A017] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[#F5EDD6] text-sm font-medium">{r.name}</p>
                    <p className="text-[#A8906A] text-xs">{r.cuisine} · {r.price} · {r.distance}</p>
                    {r.dish && <p className="text-[#A8906A] text-xs italic mt-0.5">{r.dish}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-[#C8102E] text-[#F5EDD6] font-medium hover:bg-[#A00D26] transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Food Section ─────────────────────────────────────────────────────────────

function FoodSection() {
  const [active, setActive] = useState(0);
  const cat = FOOD_CATEGORIES[active];

  return (
    <section id="food" className="py-20 px-4 max-w-3xl mx-auto">
      <SectionHeader label="FOOD & DINING" title="Eat Like an Emperor" subtitle="China’s culinary heritage spans five millennia" />

      {/* Category tabs */}
      <div className="flex gap-2 mt-10 mb-8 overflow-x-auto scrollbar-hide pb-1">
        {FOOD_CATEGORIES.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setActive(i)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300 ${
              active === i
                ? "bg-[#C8102E] text-[#F5EDD6]"
                : "bg-[rgba(212,160,23,0.07)] border border-[rgba(212,160,23,0.15)] text-[#A8906A] hover:text-[#F5EDD6]"
            }`}
          >
            <span>{c.emoji}</span>
            <span className="whitespace-nowrap">{c.name}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
        >
          <div className="p-6 rounded-2xl bg-[#1E0D0D] border border-[rgba(212,160,23,0.15)] mb-5">
            <div className="flex items-start gap-4">
              <span className="text-4xl leading-none">{cat.emoji}</span>
              <div>
                <h3 className="font-display text-xl text-[#F5EDD6] mb-1">{cat.name}</h3>
                <p className="text-[#D4A017] text-xs tracking-wider mb-2">{cat.tagline}</p>
                <p className="text-[#A8906A] text-sm leading-relaxed">{cat.description}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {cat.restaurants.map((r, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-[#1E0D0D] border border-[rgba(212,160,23,0.08)] hover:border-[rgba(212,160,23,0.22)] transition-colors">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[rgba(200,16,46,0.1)] border border-[rgba(200,16,46,0.18)] flex items-center justify-center">
                  <Utensils size={15} className="text-[#C8102E]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[#F5EDD6] font-medium text-sm">{r.name}</p>
                    <span className="flex items-center gap-0.5 text-[#D4A017] text-xs">
                      <Star size={10} fill="currentColor" /> {r.rating}
                    </span>
                  </div>
                  <p className="text-[#A8906A] text-xs">{r.location} · {r.price}</p>
                  <p className="text-[#A8906A] text-xs italic mt-0.5">{r.dish}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

// ─── Maps ─────────────────────────────────────────────────────────────────────

function CityMap({ city }: { city: "beijing" | "xian" }) {
  const maps = {
    beijing: {
      src: "https://maps.google.com/maps?q=Forbidden+City,Beijing,China&t=m&z=14&ie=UTF8&iwloc=near&output=embed",
      label: "Beijing — centred on Forbidden City & Tiananmen",
    },
    xian: {
      src: "https://maps.google.com/maps?q=Bell+Tower,Xian,Shaanxi,China&t=m&z=14&ie=UTF8&iwloc=near&output=embed",
      label: "Xi'an — centred on Bell Tower & City Wall",
    },
  };
  const { src, label } = maps[city];
  return (
    <div className="rounded-2xl overflow-hidden border border-[rgba(212,160,23,0.18)] bg-[#1A0808]">
      <iframe
        src={src}
        title={label}
        width="100%"
        height="420"
        style={{ border: 0, display: "block" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="px-4 py-3 border-t border-[rgba(212,160,23,0.12)] flex items-center justify-between">
        <p className="text-[#A8906A] text-xs">{label}</p>
        <a
          href={`https://maps.google.com/?q=${city === "beijing" ? "Forbidden+City,Beijing" : "Bell+Tower,Xian"}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#D4A017] text-xs hover:underline"
        >
          Open in Google Maps →
        </a>
      </div>
    </div>
  );
}

function _BeijingMapSVG_UNUSED() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-[rgba(212,160,23,0.18)]">
      <svg viewBox="0 0 600 400" className="w-full" style={{ background: "#180C0C" }}>
        {/* Grid */}
        {Array.from({ length: 18 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 24} x2="600" y2={i * 24} stroke="rgba(212,160,23,0.04)" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 28 }, (_, i) => (
          <line key={`v${i}`} x1={i * 23} y1="0" x2={i * 23} y2="400" stroke="rgba(212,160,23,0.04)" strokeWidth="0.5" />
        ))}
        {/* Major roads */}
        <line x1="0" y1="210" x2="600" y2="210" stroke="rgba(212,160,23,0.14)" strokeWidth="2.5" />
        <line x1="300" y1="0" x2="300" y2="400" stroke="rgba(212,160,23,0.14)" strokeWidth="2.5" />
        <line x1="0" y1="155" x2="600" y2="155" stroke="rgba(212,160,23,0.07)" strokeWidth="1" />
        <line x1="0" y1="270" x2="600" y2="270" stroke="rgba(212,160,23,0.07)" strokeWidth="1" />
        {/* Moat */}
        <rect x="218" y="122" width="164" height="130" rx="5" fill="rgba(61,122,95,0.08)" stroke="rgba(61,122,95,0.45)" strokeWidth="7" />
        {/* Forbidden City */}
        <rect x="234" y="136" width="132" height="102" rx="2" fill="rgba(200,16,46,0.12)" stroke="#C8102E" strokeWidth="1.5" />
        <rect x="254" y="148" width="92" height="78" rx="1" fill="rgba(200,16,46,0.07)" stroke="rgba(200,16,46,0.25)" strokeWidth="1" />
        <rect x="270" y="157" width="60" height="16" fill="rgba(212,160,23,0.28)" />
        <rect x="270" y="177" width="60" height="14" fill="rgba(212,160,23,0.18)" />
        <rect x="270" y="196" width="60" height="14" fill="rgba(212,160,23,0.18)" />
        <text x="300" y="181" textAnchor="middle" fill="rgba(212,160,23,0.75)" fontSize="6.5" fontWeight="bold" letterSpacing="0.5">FORBIDDEN CITY</text>
        {/* Tiananmen */}
        <rect x="248" y="255" width="104" height="34" rx="2" fill="rgba(200,16,46,0.1)" stroke="rgba(200,16,46,0.35)" strokeWidth="1" />
        <text x="300" y="276" textAnchor="middle" fill="rgba(245,237,214,0.45)" fontSize="7.5">天安门广场</text>
        {/* Temple of Heaven */}
        <circle cx="345" cy="335" r="26" fill="none" stroke="rgba(212,160,23,0.25)" strokeWidth="1.5" />
        <circle cx="345" cy="335" r="16" fill="rgba(212,160,23,0.07)" stroke="rgba(212,160,23,0.18)" strokeWidth="1" />
        <circle cx="345" cy="335" r="7" fill="rgba(212,160,23,0.18)" />
        <text x="345" y="370" textAnchor="middle" fill="rgba(168,144,106,0.65)" fontSize="6.5">Temple of Heaven</text>
        {/* Summer Palace */}
        <ellipse cx="110" cy="95" rx="62" ry="38" fill="rgba(61,122,95,0.1)" stroke="rgba(61,122,95,0.38)" strokeWidth="1.5" />
        <ellipse cx="100" cy="90" rx="38" ry="24" fill="rgba(61,122,95,0.06)" />
        <text x="110" y="68" textAnchor="middle" fill="rgba(61,122,95,0.75)" fontSize="6.5">Summer Palace</text>
        {/* Hutong area */}
        <rect x="355" y="148" width="95" height="60" fill="none" stroke="rgba(212,160,23,0.07)" strokeWidth="0.5" strokeDasharray="2,3" />
        {[0, 1, 2, 3].map((i) => <line key={i} x1="355" y1={156 + i * 14} x2="450" y2={156 + i * 14} stroke="rgba(212,160,23,0.05)" strokeWidth="0.5" />)}
        <text x="402" y="172" textAnchor="middle" fill="rgba(168,144,106,0.4)" fontSize="6">Hutongs</text>
        {/* Airport */}
        <text x="545" y="34" textAnchor="middle" fill="rgba(168,144,106,0.75)" fontSize="11">✈</text>
        <text x="545" y="50" textAnchor="middle" fill="rgba(168,144,106,0.5)" fontSize="6.5">PEK Airport</text>
        <line x1="545" y1="45" x2="430" y2="105" stroke="rgba(168,144,106,0.12)" strokeWidth="0.75" strokeDasharray="3,4" />
        {/* Hotel */}
        <circle cx="320" cy="252" r="5.5" fill="#C8102E" />
        <circle cx="320" cy="252" r="9" fill="rgba(200,16,46,0.2)" />
        <text x="335" y="250" fill="rgba(245,237,214,0.65)" fontSize="6.5">Hotel</text>
        {/* Landmark pins */}
        {[{ x: 300, y: 188, c: "#C8102E" }, { x: 300, y: 270, c: "#C8102E" }, { x: 345, y: 335, c: "#D4A017" }, { x: 110, y: 95, c: "#3D7A5F" }].map((pin, i) => (
          <g key={i}>
            <circle cx={pin.x} cy={pin.y} r="8" fill={pin.c} opacity="0.18" />
            <circle cx={pin.x} cy={pin.y} r="4" fill={pin.c} opacity="0.85" />
          </g>
        ))}
        {/* Title */}
        <text x="16" y="22" fill="rgba(212,160,23,0.9)" fontSize="13" fontWeight="600">BEIJING 北京</text>
        <text x="16" y="36" fill="rgba(168,144,106,0.55)" fontSize="7">Illustrated Travel Map</text>
      </svg>
      <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 bg-[rgba(19,8,8,0.8)] rounded-xl p-2.5 backdrop-blur-sm">
        {[{ c: "#C8102E", l: "Attractions" }, { c: "#D4A017", l: "Hotel" }, { c: "#3D7A5F", l: "Parks & Lakes" }].map((item) => (
          <div key={item.l} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: item.c }} />
            <span className="text-[10px] text-[#A8906A]">{item.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function _XianMapSVG_UNUSED() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-[rgba(212,160,23,0.18)]">
      <svg viewBox="0 0 600 400" className="w-full" style={{ background: "#180C0C" }}>
        {Array.from({ length: 18 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 24} x2="600" y2={i * 24} stroke="rgba(212,160,23,0.035)" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 28 }, (_, i) => (
          <line key={`v${i}`} x1={i * 23} y1="0" x2={i * 23} y2="400" stroke="rgba(212,160,23,0.035)" strokeWidth="0.5" />
        ))}
        {/* City Wall — the dominant feature */}
        <rect x="112" y="78" width="256" height="228" rx="8" fill="none" stroke="#D4A017" strokeWidth="9" opacity="0.55" />
        <rect x="118" y="84" width="244" height="216" rx="5" fill="rgba(212,160,23,0.03)" stroke="rgba(212,160,23,0.12)" strokeWidth="1" />
        {/* Gates */}
        <rect x="222" y="73" width="36" height="12" rx="2" fill="rgba(212,160,23,0.28)" stroke="#D4A017" strokeWidth="1" />
        <rect x="222" y="315" width="36" height="12" rx="2" fill="rgba(212,160,23,0.28)" stroke="#D4A017" strokeWidth="1" />
        <rect x="362" y="178" width="12" height="34" rx="2" fill="rgba(212,160,23,0.28)" stroke="#D4A017" strokeWidth="1" />
        <rect x="106" y="178" width="12" height="34" rx="2" fill="rgba(212,160,23,0.28)" stroke="#D4A017" strokeWidth="1" />
        {/* Inner roads */}
        <line x1="112" y1="192" x2="368" y2="192" stroke="rgba(212,160,23,0.09)" strokeWidth="1.5" />
        <line x1="240" y1="78" x2="240" y2="306" stroke="rgba(212,160,23,0.09)" strokeWidth="1.5" />
        {/* Bell Tower */}
        <polygon points="240,178 252,190 240,202 228,190" fill="rgba(200,16,46,0.2)" stroke="#C8102E" strokeWidth="1.5" />
        <circle cx="240" cy="190" r="4" fill="#C8102E" opacity="0.9" />
        <text x="240" y="210" textAnchor="middle" fill="rgba(245,237,214,0.5)" fontSize="6">Bell Tower</text>
        {/* Drum Tower */}
        <rect x="192" y="184" width="22" height="14" rx="2" fill="rgba(200,16,46,0.1)" stroke="rgba(200,16,46,0.4)" strokeWidth="1" />
        <circle cx="203" cy="191" r="3" fill="rgba(200,16,46,0.55)" />
        <text x="203" y="205" textAnchor="middle" fill="rgba(168,144,106,0.45)" fontSize="5.5">Drum Tower</text>
        {/* Great Mosque */}
        <rect x="133" y="152" width="30" height="24" rx="2" fill="rgba(61,122,95,0.14)" stroke="#3D7A5F" strokeWidth="1.5" />
        <polygon points="148,147 155,157 141,157" fill="#3D7A5F" opacity="0.65" />
        <text x="148" y="167" textAnchor="middle" fill="rgba(61,122,95,0.75)" fontSize="5.5">Great Mosque</text>
        {/* Muslim Street */}
        <line x1="163" y1="176" x2="228" y2="185" stroke="rgba(212,160,23,0.3)" strokeWidth="2" />
        <text x="195" y="172" textAnchor="middle" fill="rgba(212,160,23,0.55)" fontSize="5.5">Muslim Street</text>
        {/* Train Station */}
        <rect x="208" y="38" width="64" height="28" rx="3" fill="rgba(212,160,23,0.07)" stroke="rgba(212,160,23,0.3)" strokeWidth="1.5" />
        <text x="240" y="57" textAnchor="middle" fill="rgba(212,160,23,0.7)" fontSize="7">🚄 Station</text>
        <line x1="240" y1="66" x2="240" y2="78" stroke="rgba(212,160,23,0.28)" strokeWidth="1.5" />
        {/* Big Wild Goose Pagoda */}
        <g transform="translate(196,342)">
          <polygon points="0,0 9,-18 18,0" fill="rgba(212,160,23,0.22)" stroke="#D4A017" strokeWidth="1" />
          <polygon points="2,0 9,-13 16,0" fill="rgba(212,160,23,0.14)" />
          <polygon points="5,0 9,-8 13,0" fill="rgba(212,160,23,0.1)" />
        </g>
        <circle cx="205" cy="342" r="3.5" fill="#D4A017" opacity="0.8" />
        <text x="205" y="370" textAnchor="middle" fill="rgba(168,144,106,0.65)" fontSize="6">Big Wild Goose Pagoda</text>
        <line x1="205" y1="306" x2="205" y2="340" stroke="rgba(212,160,23,0.1)" strokeWidth="0.75" strokeDasharray="2,2" />
        {/* Terracotta — far east */}
        <rect x="498" y="162" width="76" height="58" rx="4" fill="rgba(212,160,23,0.05)" stroke="rgba(212,160,23,0.2)" strokeWidth="1" />
        {[0, 1, 2, 3, 4].map((i) => <line key={i} x1="498" y1={172 + i * 10} x2="574" y2={172 + i * 10} stroke="rgba(168,144,106,0.18)" strokeWidth="0.5" />)}
        <circle cx="536" cy="191" r="4" fill="#D4A017" opacity="0.75" />
        <text x="536" y="156" textAnchor="middle" fill="rgba(168,144,106,0.65)" fontSize="6">Terracotta Army</text>
        {/* Rail route */}
        <line x1="374" y1="192" x2="496" y2="192" stroke="rgba(212,160,23,0.18)" strokeWidth="1.5" strokeDasharray="5,4" />
        <text x="435" y="187" textAnchor="middle" fill="rgba(168,144,106,0.45)" fontSize="5.5">45 min →</text>
        {/* Huaqing Palace */}
        <ellipse cx="458" cy="134" rx="26" ry="16" fill="rgba(61,122,95,0.07)" stroke="rgba(61,122,95,0.28)" strokeWidth="1" />
        <text x="458" y="125" textAnchor="middle" fill="rgba(61,122,95,0.6)" fontSize="5.5">Huaqing Palace</text>
        {/* Hotel */}
        <circle cx="270" cy="148" r="5.5" fill="#C8102E" />
        <circle cx="270" cy="148" r="9" fill="rgba(200,16,46,0.18)" />
        <text x="284" y="146" fill="rgba(245,237,214,0.65)" fontSize="6.5">Hotel</text>
        {/* City Wall label */}
        <text x="106" y="210" textAnchor="middle" fill="rgba(212,160,23,0.55)" fontSize="6" transform="rotate(-90,106,192)">CITY WALL 城墙</text>
        {/* Title */}
        <text x="16" y="22" fill="rgba(212,160,23,0.9)" fontSize="13" fontWeight="600">XI’AN 西安</text>
        <text x="16" y="36" fill="rgba(168,144,106,0.55)" fontSize="7">Illustrated Travel Map</text>
      </svg>
      <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 bg-[rgba(19,8,8,0.8)] rounded-xl p-2.5 backdrop-blur-sm">
        {[{ c: "#D4A017", l: "City Wall" }, { c: "#C8102E", l: "Historic Sites" }, { c: "#3D7A5F", l: "Mosque & Parks" }].map((item) => (
          <div key={item.l} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: item.c }} />
            <span className="text-[10px] text-[#A8906A]">{item.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapsSection() {
  const [activeMap, setActiveMap] = useState<"beijing" | "xian">("beijing");
  return (
    <section id="maps" className="py-20 px-4 max-w-3xl mx-auto">
      <SectionHeader label="MAPS" title="City Maps" subtitle="Tap landmarks to explore — open in Google Maps for directions" />
      <div className="flex gap-3 justify-center mt-8 mb-8">
        {(["beijing", "xian"] as const).map((city) => (
          <button
            key={city}
            onClick={() => setActiveMap(city)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeMap === city
                ? "bg-[#C8102E] text-[#F5EDD6]"
                : "bg-[rgba(212,160,23,0.07)] border border-[rgba(212,160,23,0.2)] text-[#A8906A] hover:text-[#F5EDD6]"
            }`}
          >
            {city === "beijing" ? "Beijing 北京" : "Xi’an 西安"}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeMap} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.28 }}>
          {activeMap === "beijing" ? <CityMap city="beijing" /> : <CityMap city="xian" />}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

// ─── Travel Tips + Local Slang ────────────────────────────────────────────────

function TravelTipsSection() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["rail"]));
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  const toggleTip = (id: string) =>
    setExpanded((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggleFlip = (i: number) =>
    setFlipped((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <section id="tips" className="py-20 px-4 max-w-2xl mx-auto">
      {/* Travel Essentials */}
      <SectionHeader label="TRAVEL ESSENTIALS" title="Before You Go" subtitle="Everything your family needs to know" />
      <div className="space-y-3 mt-10">
        {TRAVEL_TIPS.map((tip) => (
          <div key={tip.id} className="rounded-2xl border border-[rgba(212,160,23,0.12)] bg-[#1E0D0D] overflow-hidden">
            <button
              onClick={() => toggleTip(tip.id)}
              aria-expanded={expanded.has(tip.id)}
              className="w-full flex items-center gap-4 p-5 text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-[rgba(200,16,46,0.1)] border border-[rgba(200,16,46,0.18)] flex items-center justify-center text-[#C8102E] flex-shrink-0">
                <TipIcon icon={tip.icon} />
              </div>
              <span className="flex-1 text-[#F5EDD6] font-medium text-sm">{tip.category}</span>
              <ChevronDown size={16} className={`text-[#A8906A] transition-transform duration-300 ${expanded.has(tip.id) ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {expanded.has(tip.id) && (
                <motion.div
                  key="tip"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-3 border-t border-[rgba(212,160,23,0.07)] space-y-3">
                    {"journeys" in tip && (tip as typeof tip & { journeys: { date: string; from: string; dep: string; to: string; arr: string; duration: string; cls: string }[] }).journeys.map((j, i) => (
                      <div key={i} className="rounded-xl bg-[rgba(212,160,23,0.05)] border border-[rgba(212,160,23,0.1)] p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[#D4A017] text-[10px] font-medium tracking-widest">{j.date.toUpperCase()}</span>
                          <span className="text-[#A8906A] text-[10px] px-2 py-0.5 rounded-full border border-[rgba(212,160,23,0.2)]">{j.cls}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-[#F5EDD6] text-xl font-semibold leading-none">{j.dep}</p>
                            <p className="text-[#A8906A] text-[10px] mt-1 leading-tight">{j.from}</p>
                          </div>
                          <div className="flex-1 flex flex-col items-center gap-1">
                            <p className="text-[#A8906A] text-[9px] tracking-widest">{j.duration}</p>
                            <div className="w-full flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full border border-[#D4A017] flex-shrink-0" />
                              <div className="flex-1 h-px bg-gradient-to-r from-[#D4A017] to-[rgba(212,160,23,0.3)]" />
                              <Train size={11} className="text-[#D4A017] flex-shrink-0" />
                              <div className="flex-1 h-px bg-gradient-to-r from-[rgba(212,160,23,0.3)] to-[#D4A017]" />
                              <div className="w-1.5 h-1.5 rounded-full border border-[#D4A017] flex-shrink-0" />
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="text-[#F5EDD6] text-xl font-semibold leading-none">{j.arr}</p>
                            <p className="text-[#A8906A] text-[10px] mt-1 leading-tight">{j.to}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <ul className="space-y-2 pt-1">
                      {tip.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="text-[#D4A017] text-xs mt-0.5 flex-shrink-0">◆</span>
                          <span className="text-[#A8906A] text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Local Slang */}
      <div className="mt-20">
        <SectionHeader label="LOCAL SLANG" title="Talk Like a Local" subtitle="Tap any card to reveal the context and how to use it" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-10">
          {LOCAL_SLANG.map((entry, i) => (
            <button
              key={i}
              onClick={() => toggleFlip(i)}
              className="p-4 rounded-2xl bg-[#1E0D0D] border border-[rgba(212,160,23,0.12)] hover:border-[rgba(212,160,23,0.3)] transition-all duration-300 text-left group"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="font-display text-2xl text-[#F5EDD6] leading-tight">{entry.slang}</p>
                <span className="flex-shrink-0 text-[#D4A017] text-xs italic mt-1">{entry.pinyin}</span>
              </div>
              <p className="text-[#C8102E] text-xs font-medium tracking-wide mb-2">{entry.meaning}</p>
              <AnimatePresence mode="wait">
                {flipped.has(i) ? (
                  <motion.div key="context" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                    <p className="text-[#A8906A] text-xs leading-relaxed border-t border-[rgba(212,160,23,0.1)] pt-2">{entry.context}</p>
                  </motion.div>
                ) : (
                  <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex items-center gap-1.5 text-[#A8906A] text-xs opacity-50 group-hover:opacity-90 transition-opacity">
                      <Eye size={11} /> <span>Tap for context</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedAttraction, setSelectedAttraction] = useState<AttractionData | null>(null);
  const [showHSR, setShowHSR] = useState(false);
  const [showFlight, setShowFlight] = useState(false);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = id === "overview" ? 0 : 76;
      window.scrollTo({ top: el.offsetTop - offset, behavior: "smooth" });
    }
    setActiveSection(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 140;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_ITEMS[i].id);
        if (el && el.offsetTop <= y) { setActiveSection(NAV_ITEMS[i].id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const findAttractionByName = useCallback((name: string) => {
    return (
      ATTRACTIONS.find((a) => a.name === name) ??
      ATTRACTIONS.find((a) => name.includes(a.name) || a.name.includes(name)) ??
      null
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#130808] text-[#F5EDD6] font-['Inter',system-ui,sans-serif]">
      <Navigation active={activeSection} onNav={scrollToSection} />

      <main className="md:pt-16 pb-24 md:pb-0">
        <HeroSection onNav={scrollToSection} onShowHSR={() => setShowHSR(true)} onShowFlight={() => setShowFlight(true)} />

        <ItinerarySection onAttractionClick={(name) => {
          const a = findAttractionByName(name);
          if (a) setSelectedAttraction(a);
        }} />

        <DestinationSection
          sectionId="beijing"
          city="Beijing"
          tagline="IMPERIAL CAPITAL"
          description="Five thousand years of dynastic power. Palace complexes, sacred temples, and the world’s most iconic wall."
          heroImage={img("1547981609-4b6bfe67ca0b", 1200, 600)}
          onSelect={setSelectedAttraction}
        />

        <DestinationSection
          sectionId="xian"
          city="Xi’an"
          tagline="ANCIENT SILK ROAD"
          description="Eastern terminus of the Silk Road. Home to an underground army, a living city wall, and China’s greatest Muslim quarter."
          heroImage={img("1547253807-593ee708edab", 1200, 600)}
          onSelect={setSelectedAttraction}
        />

        <FoodSection />
        <MapsSection />
        <TravelTipsSection />

        <footer className="py-14 px-4 text-center border-t border-[rgba(212,160,23,0.1)]">
          <p className="font-display text-2xl text-[#D4A017] mb-2">China Adventure 2026</p>
          <p className="text-[#A8906A] text-sm">20–29 October · Beijing · Xi’an</p>
          <p className="text-[#A8906A] text-xs mt-4 opacity-40">Safe travels 家人 ♡</p>
        </footer>
      </main>

      <AnimatePresence>
        {selectedAttraction && (
          <AttractionModal attraction={selectedAttraction} onClose={() => setSelectedAttraction(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHSR && <HSRModal onClose={() => setShowHSR(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showFlight && <FlightModal onClose={() => setShowFlight(false)} />}
      </AnimatePresence>
    </div>
  );
}
