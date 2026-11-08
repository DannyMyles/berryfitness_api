/**
 * Berry Fitness for Health — tenant `berry`.
 *
 *   npm run seed
 *
 * Creates (or tops up) the `berry` app and its starter content: site
 * settings, services, store products, past events, testimonials, gallery
 * photos, FAQs and an admin login.
 *
 * Idempotent: rows that already exist (matched by slug / name / question)
 * are left alone, and settings an admin has edited are kept.
 *
 * Every piece of content below comes from berryfitnessforhealth.com. Where
 * the source has no value for a required field, the choice is noted inline.
 *
 * Env:
 *   BERRY_DIR             path to the berry frontend (default ../berry) — the
 *                         gallery photos are read from <BERRY_DIR>/seed/gallery
 *   BERRY_FRONTEND_URL    public site URL used in email links (default http://localhost:3002)
 *   BERRY_ADMIN_EMAIL     admin login (default admin@berryfitnessforhealth.com)
 *   BERRY_ADMIN_PASSWORD  admin password (default: random, printed once)
 */
import 'dotenv/config';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { PrismaClient, PricingType, ServiceAudience } from '@prisma/client';
import { slugify } from '../src/utils/slugify';
import { uploadsRoot } from '../src/uploads';
import type { SiteSettings } from '../src/services/siteSettings';

const prisma = new PrismaClient();
const KEY = 'berry';
const BERRY_DIR = path.resolve(process.env.BERRY_DIR || path.join(__dirname, '..', '..', 'berry'));
const ADMIN_EMAIL = (process.env.BERRY_ADMIN_EMAIL || 'admin@berryfitnessforhealth.com').toLowerCase();
const ADMIN_PASSWORD = process.env.BERRY_ADMIN_PASSWORD || `${crypto.randomBytes(9).toString('base64url')}Aa1!`;

// ---------------------------------------------------------------------------
// Business details & site settings
// ---------------------------------------------------------------------------

const ABOUT =
  'Berry Fitness for Health is a comprehensive physical fitness program designed to support individuals in achieving their health and wellness goals. Our platform offers a wide range of fitness resources, including personalized workout plans, nutritional guidance, and access to experienced fitness professionals. We are committed to promoting a holistic approach to health, catering to individuals of all fitness levels. Whether you are a beginner or a seasoned athlete, Berry Fitness for Health provides the tools and support you need to embark on a journey to improved physical well-being.';

const APP = {
  name: 'Berry Fitness for Health',
  tagline: 'Body Goals and Health',
  whatsappNumber: '254727625970', // the published phone number; confirm it is on WhatsApp
  contactPhone: '+254 727 625 970',
  contactEmail: 'info@berryfitnessforhealth.com',
  location: 'Nairobi, Kenya',
  youtubeChannelHandle: 'BERRY-FITNESS',
  orderPrefix: 'BFO',
  bookingPrefix: 'BFB',
  enquiryPrefix: 'BFE',
};

const SETTINGS: SiteSettings = {
  currency: 'USD',
  brand: { primaryColor: '#007AA9', secondaryColor: '#1F3541' },
  hero: {
    eyebrow: 'Personal Training in Nairobi, Kenya',
    title: 'Body Goals',
    highlight: 'and Health.',
    subtitle: 'Your ultimate best personal trainer is a phone call away.',
    imageUrl: '/images/certifications.jpg',
    primaryCtaLabel: 'Explore services',
    primaryCtaUrl: '/services',
    secondaryCtaLabel: 'Watch video',
    secondaryCtaUrl: 'https://www.youtube.com/watch?v=BRHio6CzlFk',
    perks: ['Weight Loss', 'Strength', 'Endurance'],
  },
  social: {
    facebook: 'https://www.facebook.com/berry.lumasia.7',
    youtube: 'https://www.youtube.com/@BERRY-FITNESS',
  },
  hours: '5:00AM to 9:00PM',
  postalAddress: 'P.O. Box 15541 - 00509, Nairobi, Kenya',
  about: {
    headline: 'A comprehensive physical fitness program',
    body: ABOUT,
    imageUrl: '/images/about.jpg',
    mission: 'Personal training, weight management, kick boxing, aerobics, kids fitness and outdoor team building — in Nairobi and online.',
  },
  pages: {
    about: { eyebrow: 'About Us', title: 'About Berry Fitness for Health', subtitle: 'Body goals and health — your ultimate best personal trainer is a phone call away.' },
    services: { eyebrow: 'Services', title: 'Our Services', subtitle: 'Weight management, kick boxing, aerobics, body building, nutrition, kids and outdoor programs — for every fitness level.', imageUrl: '/images/about.jpg' },
    events: { eyebrow: 'Events', title: 'Fitness Events', subtitle: 'Hikes, road trips, bootcamps and outdoor fitness with the Berry Fitness community.' },
    gallery: { eyebrow: 'Gallery', title: 'Gallery', subtitle: 'Hikes, bootcamps, classes and training moments with Berry Fitness for Health.' },
    blog: { eyebrow: 'Blog', title: 'The Blog', subtitle: 'Training and nutrition updates from Berry Fitness for Health.' },
    contact: { eyebrow: 'Get In Touch', title: 'Contact Us', subtitle: 'Your ultimate best personal trainer is a phone call away.' },
    shop: { eyebrow: 'New Arrivals', title: 'Berry Fitness', highlight: 'Merchandise', subtitle: 'Lightweight, flexible hoodies, t-shirts, vest hoodies and crop tops — made to move with you, indoors and outdoors.' },
    'home-hero': { imageUrl: '/images/hero.jpg' },
    'home-features': { eyebrow: 'Why Berry Fitness', title: 'Fitness for', highlight: 'Health', subtitle: 'A holistic approach to health, catering to individuals of all fitness levels — from beginners to seasoned athletes.' },
    'home-pricing': { eyebrow: 'Pricing', title: 'Sessions and', highlight: 'rates', subtitle: 'Published rates in US dollars. We confirm the details with you when you book.' },
    'home-services': { eyebrow: 'What We Offer', title: 'Training', highlight: 'Services' },
    'home-testimonials': { subtitle: 'What clients say about training with Berry.' },
    'home-cta': { title: 'Ready to reach your body goals?', subtitle: 'Your ultimate best personal trainer is a phone call away.' },
    'footer-cta': { eyebrow: 'Body goals and health', title: 'Your best personal trainer is', highlight: 'a phone call away.' },
  },
  // Only figures the business has published. Add client numbers etc. in Admin → Settings.
  stats: [
    { value: '1st place', label: 'OCC fitness, 3 years running' },
    { value: '5am–9pm', label: 'Training hours' },
  ],
  // How booking works on this website (describes the site, not the business).
  steps: [
    { title: 'Choose a service', text: 'Pick a program or session that fits your goals.' },
    { title: 'Send your request', text: 'Fill in the short form — it is saved with a reference number.' },
    { title: 'Confirm on WhatsApp', text: 'We reply to confirm the time, price and payment.' },
    { title: 'Start training', text: 'Show up and start working towards your body goals.' },
  ],
  highlights: [
    { title: 'Personalized Workout Plans', text: 'Workout plans built around your goals and fitness level.' },
    { title: 'Nutritional Guidance', text: 'Diet and nutrition support alongside your training.' },
    { title: 'Experienced Professionals', text: 'Access to experienced fitness professionals.' },
    { title: 'All Fitness Levels', text: 'Whether you are a beginner or a seasoned athlete.' },
  ],
  // Qualifications & certifications (shown on the About page).
  values: [
    { title: 'Olympic Training Centre', text: 'Certificate in sports science' },
    { title: 'First Aid', text: 'Certificate in First Aid' },
    { title: 'OCC Fitness', text: '1st position for 3 years' },
  ],
  team: [
    {
      name: 'Berry',
      role: 'Personal Trainer',
      bio: 'Berry trains clients one-on-one, in virtual sessions and in group corporate fitness sessions, with qualifications from the Olympic Training Centre (sports science) and in First Aid.\n\nPersonal interests: travelling, rugby, swimming and teamwork.',
      imageUrl: '/images/certifications.jpg',
      expertise: ['Weight loss', 'Strength training', 'Endurance training', 'Swimming', 'Kick boxing and self-defense'],
    },
  ],
  corporate: {
    headline: 'Outdoor fitness & team building',
    subtitle:
      'Step outside the traditional office setting and into the fresh air — promoting teamwork and wellness through outdoor activities, bootcamps, hikes and group corporate fitness sessions.',
    imageUrl: '/images/events/team-building-bootcamp.jpg',
  },
  booking: {
    whatsappNotice: 'Opening WhatsApp does not confirm your booking — we will reply to confirm availability, price and payment.',
    successMessage: "Request received! We'll get back to you shortly to confirm.",
  },
  email: {
    footerNote: 'You are receiving this email because you contacted or booked with Berry Fitness for Health.',
    signature: 'Berry Fitness for Health',
  },
  seo: {
    description:
      'Berry Fitness for Health — personal training, weight management, kick boxing, aerobics, body building, kids fitness, nutrition plans and outdoor team building in Nairobi, Kenya.',
  },
};

// ---------------------------------------------------------------------------
// Services. Prices are the published USD rates; programs the source site
// lists without a price are "price on request".
// ---------------------------------------------------------------------------

interface ServiceSeed {
  title: string;
  description: string;
  features: string[];
  price: string;
  priceAmount?: number;
  pricingType: PricingType;
  category: string;
  audience: ServiceAudience;
  image: string;
  icon: string;
  duration?: string;
  popular?: boolean;
}

const ON_REQUEST = { price: 'Price on request', pricingType: 'quote' as PricingType };

const SERVICES: ServiceSeed[] = [
  {
    title: 'Weight Management',
    description:
      'Our Weight Management service provides personalized plans to help you achieve a healthy weight and improve your overall well-being. You are stronger than you think, and your goals are within reach.',
    features: ['Personalized plans', 'Healthy weight goals', 'Overall well-being'],
    ...ON_REQUEST,
    category: 'Programs',
    audience: 'individual',
    image: '/images/services/weight-management.jpg',
    icon: 'Scale',
  },
  {
    title: 'Kick Boxing Classes',
    description:
      'Improve your fitness, strength, and coordination through our expert-led training program. Every punch, every kick, every drop of sweat gets you closer to becoming the strongest version of yourself.',
    features: ['Fitness, strength and coordination', 'Expert-led training', 'Self-defense skills'],
    price: '$30 per session',
    priceAmount: 30,
    pricingType: 'fixed',
    category: 'Classes',
    audience: 'individual',
    image: '/images/services/kick-boxing-classes.jpg',
    icon: 'Zap',
    duration: '1 hour',
    popular: true,
  },
  {
    title: 'Aerobics Classes',
    description:
      'Aerobics classes offer a fun and energetic workout that combines rhythmic aerobic exercise with high-energy music. Feel the beats and burn fat through sweating. Your body will thank you.',
    features: ['Rhythmic aerobic exercise', 'High-energy music', 'Fat-burning workout'],
    ...ON_REQUEST,
    category: 'Classes',
    audience: 'both',
    image: '/images/services/aerobics-classes.jpg',
    icon: 'Music',
  },
  {
    title: 'Body Building',
    description:
      'Weight training offers numerous benefits for the body. It helps build and strengthen muscles, increases bone density, and improves metabolism, contributing to weight management. Regular weight training enhances joint stability and flexibility, reducing the risk of injuries. It can also improve posture and balance.',
    features: ['Build and strengthen muscles', 'Bone density and metabolism', 'Joint stability, posture and balance'],
    ...ON_REQUEST,
    category: 'Programs',
    audience: 'individual',
    image: '/images/services/body-building.jpg',
    icon: 'Dumbbell',
  },
  {
    title: 'Outdoor Fitness and Team Building',
    description:
      'Step outside the traditional office setting and into the fresh air with our Outdoor Fitness and Team Building service, promoting teamwork and wellness through outdoor activities such as hiking, team building, bootcamps and camping.',
    features: ['Hiking', 'Team building', 'Bootcamps', 'Camping'],
    price: 'From $100',
    pricingType: 'quote',
    category: 'Outdoor',
    audience: 'both',
    image: '/images/services/outdoor-fitness-and-team-building.jpg',
    icon: 'Mountain',
    popular: true,
  },
  {
    title: 'Diet and Nutrition Plan',
    description: 'Nutritional guidance and consulting to support your training and your health and wellness goals.',
    features: ['Nutrition consulting', 'Diet plan', 'Guidance alongside your training'],
    price: 'From $50',
    pricingType: 'quote',
    category: 'Nutrition',
    audience: 'individual',
    image: '/images/services/diet-and-nutrition-plan.jpg',
    icon: 'Apple',
  },
  {
    title: 'Kids Program',
    description: 'With our Kids Program, children can socialize, learn new skills, and participate in exciting adventures.',
    features: ['Socialize', 'Learn new skills', 'Exciting adventures'],
    ...ON_REQUEST,
    category: 'Programs',
    audience: 'individual',
    image: '/images/services/kids-program.jpg',
    icon: 'Smile',
  },
  {
    title: 'Weight Loss Program',
    description:
      'Experience sustainable and long-term weight loss success with our evidence-based program designed to educate and empower you to make healthy choices.',
    features: ['Sustainable, long-term results', 'Evidence-based program', 'Learn to make healthy choices'],
    ...ON_REQUEST,
    category: 'Programs',
    audience: 'individual',
    image: '/images/services/weight-loss-program.jpg',
    icon: 'TrendingDown',
  },
  // Priced sessions from the Pricing page.
  {
    title: 'Home Training',
    description: 'Personal training at your home, charged per one-hour session.',
    features: ['One-on-one session', 'At your home', '1 hour'],
    price: '$40 per session',
    priceAmount: 40,
    pricingType: 'fixed',
    category: 'Sessions',
    audience: 'individual',
    image: '/images/services/home-training.jpg',
    icon: 'Home',
    duration: '1 hour',
  },
  {
    title: 'Swimming',
    description: 'Swimming sessions, charged per one-hour session.',
    features: ['Per session', '1 hour'],
    price: '$30 per session',
    priceAmount: 30,
    pricingType: 'fixed',
    category: 'Sessions',
    audience: 'individual',
    image: '/images/events/aqua-aerobics.jpg',
    icon: 'Waves',
    duration: '1 hour',
  },
  {
    title: 'Group Cycling',
    description: 'Group cycling sessions, charged per session.',
    features: ['Group session', 'Per session'],
    price: '$40 per session',
    priceAmount: 40,
    pricingType: 'fixed',
    category: 'Sessions',
    audience: 'both',
    image: '/images/certifications.jpg',
    icon: 'Bike',
  },
  {
    title: 'Online Training',
    description: 'Virtual personal training sessions, charged per one-hour session.',
    features: ['Virtual session', 'Train from anywhere', '1 hour'],
    price: '$30 per session',
    priceAmount: 30,
    pricingType: 'fixed',
    category: 'Sessions',
    audience: 'individual',
    image: '/images/about.jpg',
    icon: 'Video',
    duration: '1 hour',
  },
  {
    title: 'Corporate Group Fitness',
    description: 'Group corporate fitness sessions for your team, tailored to your group and schedule.',
    features: ['Group sessions for staff', 'Tailored to your team', 'Quote on request'],
    ...ON_REQUEST,
    category: 'Corporate',
    audience: 'corporate',
    image: '/images/hero.jpg',
    icon: 'Users',
  },
];

// ---------------------------------------------------------------------------
// Store (all prices USD, all brand "Berry Fitness").
// Sizes and colours are not listed on the source site, so none are set.
// ---------------------------------------------------------------------------

const PRODUCT_DESCRIPTION =
  'Lightweight & Flexible: Moves with your body for maximum comfort and mobility. Durable Stitching: Designed to withstand wear and tear from both indoor training and outdoor adventures. Modern Fit: Streamlined design that flatters all body types without restricting movement. Available in Multiple Colors & Sizes: Find the perfect fit for your style and routine. Perfect for athletes, fitness enthusiasts, or anyone who loves staying active in comfort and style. Pair it with our performance leggings or joggers for a complete training look.';

const CATEGORIES = [
  { slug: 'men', name: 'Men', description: 'Berry Fitness apparel for men.' },
  { slug: 'women', name: 'Women', description: 'Berry Fitness apparel for women.' },
];

// slug (as on the source store) → name, price, category, image
const PRODUCTS: { slug: string; name: string; price: number; category: 'men' | 'women'; image: string }[] = [
  { slug: 'hoodie', name: 'Hoodie', price: 25, category: 'men', image: 'hoodie' },
  { slug: 't-shirt', name: 'T-Shirt', price: 10, category: 'men', image: 't-shirt' },
  { slug: 't-shirt-1', name: 'T-Shirt', price: 10, category: 'men', image: 't-shirt-1' },
  { slug: 'unisex-hoodies', name: 'Unisex Hoodie', price: 25, category: 'men', image: 'unisex-hoodies' },
  { slug: 'ladies-croptop', name: 'Ladies Crop Top', price: 10, category: 'women', image: 'ladies-croptop' },
  { slug: 'ladies-croptops', name: 'Ladies Crop Top', price: 10, category: 'women', image: 'ladies-croptops' },
  { slug: 'unisex-vest-hoodie', name: 'Unisex Vest Hoodie', price: 10, category: 'women', image: 'unisex-vest-hoodie' },
  { slug: 'unisex-vest-hoodie-1', name: 'Unisex Vest Hoodie', price: 10, category: 'women', image: 'unisex-vest-hoodie-1' },
  { slug: 'unisex-vest-hoodie-2', name: 'Unisex Vest Hoodie', price: 10, category: 'men', image: 'unisex-vest-hoodie-2' },
];

// ---------------------------------------------------------------------------
// Past events (registration closed on the source site). The source lists no
// price or capacity: price 0 shows as "Price on request", and maxSpots is 1
// only because the field must be positive — past events cannot be booked.
// ---------------------------------------------------------------------------

const EVENTS: { title: string; date: string; time: string; location: string; category: string; description: string; image: string }[] = [
  {
    title: 'MT SATIMA Hike',
    date: '2024-05-01T10:28:00+03:00',
    time: '10:28 AM',
    location: 'Mt. Satima',
    category: 'Hike',
    description:
      "Experience the great outdoors at the 'MT SATIMA Hike'. Whether you're a seasoned hiker or a casual walker, this event offers a remarkable opportunity to enjoy panoramic views and crisp mountain air. Lace up your hiking boots and make unforgettable memories on Mt. Satima!",
    image: 'mt-satima-hike',
  },
  {
    title: 'Samburu Road Trip',
    date: '2023-03-08T07:13:00+03:00',
    time: '7:13 AM',
    location: 'Samburu National Park, Kenya',
    category: 'Road Trip',
    description:
      'Join us for an unforgettable Samburu Road Trip and explore the unique traditions and customs of the Samburu community.\n\nIt was a great event.',
    image: 'samburu-road-trip',
  },
  {
    title: 'Team Building Bootcamp',
    date: '2022-04-30T10:43:00+03:00',
    time: '10:43 AM',
    location: 'Sagana, Kenya',
    category: 'Team Building',
    description:
      'Gear up for a day of bonding and challenges at the Team Building Bootcamp! Engage in fun activities designed to boost cooperation, build trust, and develop leadership skills within your team.',
    image: 'team-building-bootcamp',
  },
  {
    title: 'High Ropes Course',
    date: '2021-05-22T08:00:00+03:00',
    time: '8:00 AM',
    location: 'Diguna Road, Kenya',
    category: 'Adventure',
    description: 'High Ropes Course at Diguna Road, Kenya.',
    image: 'high-ropes-course',
  },
  {
    title: 'Aqua Aerobics',
    date: '2021-04-10T08:00:00+03:00',
    time: '8:00 AM',
    location: 'To be announced',
    category: 'Aqua Fitness',
    description:
      'Aqua aerobics (waterobics, aquatic fitness, aquafitness, aquafit) is the performance of aerobic exercise in water such as in a swimming pool. Done mostly vertically and without swimming typically in waist deep or deeper water, it is a type of resistance training. Water aerobics is a form of aerobic exercise that requires water-immersed participants. Most water aerobics is in a group fitness class setting with a trained professional teaching for about an hour. The classes focus on aerobic endurance, resistance training, and creating an enjoyable atmosphere with music. After the session, those interested in doing some relaxed swimming can carry on to just stretch and relax the muscles.',
    image: 'aqua-aerobics',
  },
  {
    title: 'Elephant Hill Hike',
    date: '2021-03-20T06:00:00+03:00',
    time: '6:00 AM',
    location: 'Aberdare National Park',
    category: 'Hike',
    description:
      'The Elephant Hill Hike gauges our fitness level as we finish the first quarter of 2021. It should be a more challenging hike with expected adverse weather conditions but all in all should be fun seeing what we have achieved over our never ending fitness journey and lifestyle.\n\nThe Elephant Hill on the southern end of the Aberdares Ranges, about 90km north of Nairobi, is an ideal location for a day hike especially if you’re preparing for the more challenging Mt Kenya or Mt Kilimanjaro climbs. The Aberdares Ranges are situated west of Mt Kenya in the central highlands between Nyeri and Naivasha, and stretch 70km long from North to South. They are the water catchment area feeding two of the largest dams supplying over 95% of Nairobi’s water needs, i.e. Ndakaini Dam in the Thika region and Sasumua Dam near Njabini town. After enjoying at the top of the hill and conquering the challenge, we will embark on our journey back to Nairobi expected time of arrival is 1800hrs local time.\n\nMeeting point: The Hub - Karen @ 5:45 AM and leave @ 6:00 AM.',
    image: 'elephant-hill-hike',
  },
  {
    title: 'Ngong Hills Hike',
    date: '2020-12-05T08:00:00+03:00',
    time: '8:00 AM',
    location: 'Ngong Hills',
    category: 'Hike',
    description: 'Activity to end the year together as we celebrate year 2020 fitness and health lifestyle.',
    image: 'ngong-hills-hike',
  },
];

// ---------------------------------------------------------------------------
// Testimonials — all seven shown with 5 stars on the source site.
// ---------------------------------------------------------------------------

const TESTIMONIALS: { name: string; role: string; company?: string; content: string; photo?: string; achievement?: string }[] = [
  {
    name: 'Kelvin Papai',
    role: 'Operations',
    company: 'Absolute Vantage Limited',
    photo: 'testimonials/kelvin-papai.jpg',
    achievement: 'Lost 25 kilos in 8 months',
    content:
      'I knew Berry in the year 2020 when I enrolled into the gym getting back into training after a long time. I was very unfit and getting out of shape. I weighed 108 Kilograms when I joined the Gym in Feb 2020. Berry assisted me walk back to the journey of fitness from Cardio, HIIT, Weight Training, Aerobics and so far now enrolled for his kick boxing classes. Within 8 months I had lost 25 Kilos, back in shape and onto maintaining fitness for health and lifestyle. Berry is very professional, experienced and immediately picks up what his clients needs, setting focused, realistic and achievable goals. I will continue recommending his services to anyone who wants to walk the fitness and health lifestyle.',
  },
  {
    name: 'Phoebe Njoga',
    role: 'Client',
    content:
      'Always on time. Awesome work outs. Daily schedule - different work outs such as legs, chest, abs, legs etc. Communication is five star. He also recommends on diet to take and this has been and is very helpful. Friendly, easy to relate with and work with. I enjoy every single day work outs and always look forward to go to the gym. Thank you Berry',
  },
  {
    name: 'Anne Aol',
    role: 'Client',
    content:
      'I’d highly recommend Berry as a personal trainer. He is very professional. I have worked with him to achieve my personal fitness goals (both one on one and virtual sessions) and group corporate fitness sessions. His delivery is effective and timely. He tailor makes sessions to suit your needs and is keen to detail',
  },
  {
    name: 'Khushil Nagda',
    role: 'Client',
    content:
      'What makes an excellent trainer? 1. An excellent trainer knows the right combination of exercises to give your body a good workout and help you reach your fitness goals. 2. An excellent trainer shows you how to correctly do exercises without injuring yourself. 3. An excellent trainer is your friend and your mentor, who will motivate you to finish that last rep when your muscles are burning the most and your body is about give up. Berry is all of these. I have been training with him for almost 3 years and in this time he has helped me achieve my dream of becoming fit, a dream which I thought was impossible to achieve. He is also friendly and punctual and therefore, I confidently given him this 5 star rating.',
  },
  {
    name: 'Atong Kuol',
    role: 'Client',
    content:
      "Berry is very professional, committed and with a positive attitude. I have been seeing some significant changes every week and can't ask for a better personal trainer because he is simply the best.",
  },
  {
    name: 'Natalie Mukundane Kyamutetera',
    role: 'Client',
    content:
      'Berry is one of the best trainers anyone can have. Very patient, professional and motivated you to push your limits! I highly recommend him for someone looking to achieve their fitness goals',
  },
  {
    name: 'Valerie Murrey',
    role: 'Client',
    content:
      'Berry is very passionate about his job and genuinely cares about his clients wellness and healthy living. He will push you until you deliver results. He is simply the best trainer!',
  },
];

// Gallery categories exactly as on the source site; photos in <BERRY_DIR>/seed/gallery/<slug>/.
const GALLERY = [
  { slug: 'general', name: 'General' },
  { slug: 'elephant-hill-hike', name: 'Elephant Hill Hike' },
  { slug: 'ngong-hills-hike', name: 'Ngong Hills Hike' },
];

// Home slideshow (banners with placement "slider"). Wording is from the source site.
const SLIDES = [
  { title: 'Outdoor Fitness and Team Building', subtitle: 'Step outside the traditional office setting and into the fresh air, promoting teamwork and wellness through outdoor activities.', badge: 'For teams', imageUrl: '/images/services/outdoor-fitness-and-team-building.jpg', ctaLabel: 'Plan for your team', ctaUrl: '/corporate' },
  { title: 'Feel the beats', subtitle: 'Aerobics classes offer a fun and energetic workout that combines rhythmic aerobic exercise with high-energy music.', badge: 'Aerobics', imageUrl: '/images/services/aerobics-classes.jpg', ctaLabel: 'See our classes', ctaUrl: '/services' },
  { title: 'Experience the great outdoors', subtitle: 'Hikes, road trips and bootcamps with panoramic views and crisp mountain air.', badge: 'Events', imageUrl: '/images/events/mt-satima-hike.jpg', ctaLabel: 'See our events', ctaUrl: '/events' },
  { title: 'You are stronger than you think', subtitle: 'Personalized plans to help you achieve a healthy weight and improve your overall well-being.', badge: 'Weight Management', imageUrl: '/images/services/weight-management.jpg', ctaLabel: 'Explore services', ctaUrl: '/services' },
  { title: 'Within 8 months I had lost 25 kilos', subtitle: 'Kelvin Papai, Operations, Absolute Vantage Limited', badge: 'Client story', imageUrl: '/images/hero.jpg', ctaLabel: 'Start training', ctaUrl: '/contact' },
];

// How the website's booking works — true of the site, not business claims.
const FAQS = [
  { question: 'How do I book a session or program?', answer: 'Choose a service, fill in the short booking form and we will open WhatsApp with your details. We confirm availability, price and payment with you there.', category: 'Booking' },
  { question: 'Is my booking confirmed when I open WhatsApp?', answer: 'Not yet — your request is saved and we reply to confirm. You will also receive a confirmation email if you gave us your email address.', category: 'Booking' },
  { question: 'How do I pay?', answer: 'We agree payment details with you once your booking is confirmed. There is no online payment on the website.', category: 'Payments' },
];

// ---------------------------------------------------------------------------

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Defaults under existing values, one level deep — admin edits always win. */
function fillMissing(defaults: Record<string, unknown>, existing: Record<string, unknown>) {
  const out: Record<string, unknown> = { ...defaults, ...existing };
  for (const [k, v] of Object.entries(defaults)) {
    if (isObject(v) && isObject(existing[k])) out[k] = { ...v, ...(existing[k] as object) };
  }
  return out;
}

function copyIntoUploads(kind: 'gallery' | 'testimonials', source: string): { filename: string; size: number } {
  const dir = path.join(uploadsRoot, KEY, kind);
  fs.mkdirSync(dir, { recursive: true });
  const filename = `seed-${path.basename(path.dirname(source))}-${path.basename(source)}`.toLowerCase();
  const target = path.join(dir, filename);
  if (!fs.existsSync(target)) fs.copyFileSync(source, target);
  return { filename, size: fs.statSync(target).size };
}

async function main() {
  // 1. The app row.
  const existing = await prisma.app.findUnique({ where: { key: KEY } });
  const app = existing
    ? await prisma.app.update({
        where: { key: KEY },
        data: {
          tagline: existing.tagline ?? APP.tagline,
          whatsappNumber: existing.whatsappNumber ?? APP.whatsappNumber,
          contactPhone: existing.contactPhone ?? APP.contactPhone,
          contactEmail: existing.contactEmail ?? APP.contactEmail,
          location: existing.location ?? APP.location,
          youtubeChannelHandle: existing.youtubeChannelHandle ?? APP.youtubeChannelHandle,
          frontendUrl: existing.frontendUrl ?? process.env.BERRY_FRONTEND_URL ?? 'http://localhost:3002',
          settings: JSON.stringify(fillMissing(SETTINGS as Record<string, unknown>, existing.settings ? JSON.parse(existing.settings) : {})),
        },
      })
    : await prisma.app.create({
        data: {
          key: KEY,
          ...APP,
          frontendUrl: process.env.BERRY_FRONTEND_URL || 'http://localhost:3002',
          settings: JSON.stringify(SETTINGS),
        },
      });
  const appId = app.id;
  console.log(`[berry] App ${existing ? 'updated' : 'created'} (id ${appId}).`);

  // 2. Admin login.
  if (!(await prisma.user.findUnique({ where: { appId_email: { appId, email: ADMIN_EMAIL } } }))) {
    await prisma.user.create({
      data: { appId, name: 'Admin', username: 'admin', email: ADMIN_EMAIL, password: await bcrypt.hash(ADMIN_PASSWORD, 10), role: 'admin', emailVerified: true },
    });
    console.log(
      `[berry] Admin login ${ADMIN_EMAIL}` +
        (process.env.BERRY_ADMIN_PASSWORD ? ' created (password from BERRY_ADMIN_PASSWORD).' : ` created with password: ${ADMIN_PASSWORD}  (shown once — change it).`)
    );
  }

  // 3. Services.
  let services = 0;
  for (const [order, s] of SERVICES.entries()) {
    const slug = slugify(s.title);
    if (await prisma.training.findUnique({ where: { appId_slug: { appId, slug } } })) continue;
    await prisma.training.create({
      data: {
        appId,
        title: s.title,
        slug,
        description: s.description,
        features: JSON.stringify(s.features),
        price: s.price,
        priceAmount: s.priceAmount,
        pricingType: s.pricingType,
        category: s.category,
        audience: s.audience,
        imageUrl: s.image,
        icon: s.icon,
        duration: s.duration,
        popular: s.popular ?? false,
        order,
      },
    });
    services += 1;
  }

  // 4. Store.
  const categoryId = new Map<string, number>();
  for (const c of CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { appId_slug: { appId, slug: c.slug } },
      update: {},
      create: { appId, ...c },
    });
    categoryId.set(c.slug, row.id);
  }
  let products = 0;
  for (const p of PRODUCTS) {
    if (await prisma.product.findUnique({ where: { appId_slug: { appId, slug: p.slug } } })) continue;
    await prisma.product.create({
      data: {
        appId,
        name: p.name,
        slug: p.slug,
        description: PRODUCT_DESCRIPTION,
        price: p.price,
        categoryId: categoryId.get(p.category)!,
        inStock: true,
        isNew: true, // listed under "New Arrivals" on the source site
        images: { create: [{ url: `/images/shop/${p.image}.jpg`, position: 0 }] },
      },
    });
    products += 1;
  }

  // 5. Events.
  let events = 0;
  for (const e of EVENTS) {
    const slug = slugify(e.title);
    if (await prisma.event.findUnique({ where: { appId_slug: { appId, slug } } })) continue;
    await prisma.event.create({
      data: {
        appId,
        title: e.title,
        slug,
        description: e.description,
        date: new Date(e.date),
        time: e.time,
        location: e.location,
        trainers: JSON.stringify([]),
        imageUrl: `/images/events/${e.image}.jpg`,
        price: 0,
        maxSpots: 1,
        kind: 'event',
        category: e.category,
      },
    });
    events += 1;
  }

  // 6. Testimonials.
  let testimonials = 0;
  for (const t of TESTIMONIALS) {
    if (await prisma.testimonial.findFirst({ where: { appId, name: t.name } })) continue;
    const photoSource = t.photo ? path.join(BERRY_DIR, 'public', 'images', t.photo) : null;
    const photo = photoSource && fs.existsSync(photoSource) ? copyIntoUploads('testimonials', photoSource) : null;
    await prisma.testimonial.create({
      data: {
        appId,
        name: t.name,
        role: t.role,
        company: t.company,
        content: t.content,
        rating: 5,
        achievement: t.achievement,
        image: t.name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
        avatarColor: '#007AA9',
        ...(photo ? { photoFilename: photo.filename, photoContentType: 'image/jpeg', photoSize: photo.size } : {}),
        featured: true,
        isActive: true,
      },
    });
    testimonials += 1;
  }

  // 7. Gallery.
  let photos = 0;
  const galleryDir = path.join(BERRY_DIR, 'seed', 'gallery');
  for (const g of GALLERY) {
    const category = await prisma.galleryCategory.upsert({
      where: { appId_slug: { appId, slug: g.slug } },
      update: {},
      create: { appId, name: g.name, slug: g.slug },
    });
    if ((await prisma.galleryImage.count({ where: { categoryId: category.id } })) > 0) continue;
    const dir = path.join(galleryDir, g.slug);
    if (!fs.existsSync(dir)) {
      console.warn(`[berry] No photos at ${dir} — skipped "${g.name}".`);
      continue;
    }
    const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
    for (const f of files) {
      const { filename, size } = copyIntoUploads('gallery', path.join(dir, f));
      await prisma.galleryImage.create({ data: { categoryId: category.id, filename, contentType: 'image/jpeg', size } });
      photos += 1;
    }
  }

  // 8. FAQs.
  const known = new Set((await prisma.faq.findMany({ where: { appId }, select: { question: true } })).map((f) => f.question));
  const newFaqs = FAQS.map((f, order) => ({ ...f, appId, order })).filter((f) => !known.has(f.question));
  if (newFaqs.length) await prisma.faq.createMany({ data: newFaqs });

  // 9. Home slideshow.
  let slides = 0;
  for (const [order, b] of SLIDES.entries()) {
    if (await prisma.banner.findFirst({ where: { appId, placement: 'slider', title: b.title } })) continue;
    await prisma.banner.create({ data: { ...b, appId, placement: 'slider', order } });
    slides += 1;
  }

  console.log(
    `[berry] Added ${services} services, ${products} products, ${events} events, ${testimonials} testimonials, ${photos} gallery photos, ${newFaqs.length} FAQs, ${slides} slides (existing rows kept).`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
