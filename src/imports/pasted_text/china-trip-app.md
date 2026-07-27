Build a polished, interactive, mobile-first travel web application for my family to explore our upcoming China holiday from 20–29 October 2026. The application should feel like an Apple-designed travel experience: premium, elegant, highly organized, smooth to navigate, and visually immersive.

The purpose is to help family members understand the itinerary, visualize each destination, learn about every attraction, and prepare for the trip. This should not feel like a static itinerary but like a modern travel companion.

Overall Style

Use Apple's design language with:

generous whitespace
rounded cards
smooth animations
glassmorphism used sparingly
elegant typography
premium transitions
subtle shadows
edge-to-edge photography
sticky navigation
clean layouts

Instead of Apple's usual white theme, use an Imperial China palette:

Imperial Red
Imperial Gold
Warm Ivory
Dark Charcoal
Jade Green accents

Maintain excellent contrast and accessibility throughout.

The application should feel calm, organized and exciting.

Navigation

Create a sticky bottom navigation on mobile and a sticky top navigation on desktop.

Navigation items:

Overview
Itinerary
Beijing
Xi'an
Food
Maps
Travel Tips

Navigation should smoothly scroll to sections.

Hero Section

Large immersive hero image of Beijing during autumn.

Overlay:

China Adventure 2026

20–29 October 2026

Beijing • Xi'an

Show animated summary cards:

10 Days

2 Cities

2 Hotels

High-Speed Rail Journey

Guided Tours

Scroll indicator animation.

Interactive Timeline

Create an expandable timeline.

Each day is represented by a card.

Tapping a card expands it.

Expanded cards show:

date

city

hotel

transport

travel duration

interactive map

attractions

restaurants

cafes

notes

Buttons:

View Attractions

View Restaurants

View Map

Collapse

Cards animate smoothly.

Trip Data

Implement the following itinerary.

Day 1

20 Oct

Beijing

Arrive 14:40

Hotel:

Beijing Xinqiao Hotel

Activities:

Airport

Check in

Explore nearby

Evening walk

Day 2

Guided Tour

Tiananmen Square

Forbidden City

Temple of Heaven

Day 3

Mutianyu Great Wall

Summer Palace

Day 4

Travel to Xi'an

High Speed Rail

Eastern House Xi'an

Evening:

Beiyuanmen Muslim Street

Day 5

Hangyangling Museum

Xi'an City Wall

Big Wild Goose Pagoda

Great Mosque

Muslim Street

Day 6

Terracotta Army

Huaqing Palace

Day 7

High Speed Rail

Xi'an → Beijing

Hotel

Day 8

Gubei Water Town

Simatai Great Wall

Day 9

Jingshan Park

Nanluoguxiang

Hutongs

Gongyan Dinner Show

Day 10

Shopping

Airport

Flight 16:40

Attraction Cards

Every attraction should open a detailed page or modal.

Include:

hero photograph placeholder

overview

history

interesting facts

estimated visit duration

opening hours placeholder

best photography spots

travel tips

nearby restaurants

nearby cafes

transportation

map preview

related attractions

Maps

Create illustrated maps.

Include:

Beijing

Xi'an

Hotel locations

Rail stations

Airport

Tour routes

Walking routes

High Speed Rail route

Landmark pins

Maps should look like premium illustrated travel guides instead of Google Maps.

Restaurants

Every attraction should have nearby food recommendations.

Display:

restaurant name

rating placeholder

price range

walking distance

cuisine

recommended dishes

Include categories:

Peking Duck

Hot Pot

Dumplings

Street Food

Tea Houses

Modern Cafes

Desserts

Muslim Cuisine

Use placeholders so recommendations can easily be updated later.

Transportation

Display transportation between locations.

Use icons.

Examples:

Walking

Taxi

Metro

High Speed Rail

Show:

estimated travel time

transport mode

departure

destination

Translation

Create an interactive phrasebook.

Each card contains:

English

Chinese characters

Pinyin

Tap to reveal pronunciation.

Include common travel phrases.

Travel Essentials

Create collapsible cards for:

Hotels

Flight

Rail Tickets

Packing List

Power Adapter

Currency

Useful Apps

Emergency Numbers

Internet

Offline Maps

Shopping Tips

Etiquette

Animations

Use premium Apple-inspired motion.

Include:

fade on scroll

parallax hero

timeline animation

smooth expand and collapse

image zoom

card hover

sticky navigation

route drawing animation

page transitions

progress indicator

All animations should feel subtle and premium.

Components

Build reusable React components.

TripTimeline

DayCard

AttractionCard

HotelCard

RestaurantCard

TransportCard

MapCard

TranslationCard

TravelTipCard

GalleryCarousel

HeroSection

BottomNavigation

Modal

Accordion

ImageGallery

FloatingActionButton

Data

Store itinerary data in structured JSON so every day can easily be edited.

Restaurants, maps and images should also use structured objects instead of hardcoding values.

Images

Use realistic placeholder images for all attractions.

Do not use fantasy or AI-generated architecture.

Use authentic photography representative of the real landmarks during autumn.

Responsive

The application should be mobile-first.

Support tablet and desktop layouts.

Use modern responsive grids.

Accessibility

Meet WCAG AA.

Keyboard accessible.

High contrast.

Large touch targets.

Semantic HTML.