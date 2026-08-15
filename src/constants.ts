/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Project, Service, Testimonial, Experience, Skill } from './types.ts';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'FitMind AI',
    shortDescription: 'AI-powered fitness and nutrition product with food recognition, coaching and progress intelligence.',
    fullDescription:
      'A smart fitness application that uses AI to generate personalized workout plans, calorie tracking, and nutrition guidance. It integrates with real-time health data to improve user lifestyle habits.',

    problem:
      'Most fitness apps provide generic workout plans that do not adapt to individual user goals, body type, and lifestyle.',

    solution:
      'Built an AI-driven system that analyzes user data and generates personalized fitness and diet plans with real-time progress tracking.',

    result:
      'Shipped a production-ready AI fitness experience with food recognition, personalized nutrition guidance, progress tracking and cloud synchronization.',

    techStack: [
  'Flutter',
  'Firebase',
  'Gemini AI',
  'Firestore',
  'Clean Architecture'
],

    mainImage: '/AI-Fitness-Calorie-Tracking-App.png',

    screenshots: [
      '/image/projects/AI Fitness Calorie Tracking App/1.jpeg',
      '/image/projects/AI Fitness Calorie Tracking App/2.jpeg',
      '/image/projects/AI Fitness Calorie Tracking App/3.jpeg',
      '/image/projects/AI Fitness Calorie Tracking App/4.jpeg',
      '/image/projects/AI Fitness Calorie Tracking App/5.jpeg',
      '/image/projects/AI Fitness Calorie Tracking App/7.jpeg',
      '/image/projects/AI Fitness Calorie Tracking App/8.jpeg',
      '/image/projects/AI Fitness Calorie Tracking App/9.jpeg',
      '/image/projects/AI Fitness Calorie Tracking App/10.jpeg',
      '/image/projects/AI Fitness Calorie Tracking App/12.jpeg'
    ],

    demoUrl: 'https://play.google.com/store/apps/details?id=com.rashidapps.fitmindai',
    codeUrl: 'https://github.com/Muhammad-Rashid-172002/AI-Fitness-Calorie-Tracking-App.git',

   features: [
  'AI Food Scanner',
  'Medicine Scanner',
  'Skin Analysis',
  'Calorie Tracking',
  'AI Fitness Coach',
  'Progress Monitoring'
],
  },
    {
id: '2',
title: 'SkillLink Marketplace App',
shortDescription: 'On-demand service marketplace connecting customers with skilled workers.',

fullDescription:
'SkillLink is a modern marketplace platform inspired by apps like InDrive and TaskRabbit. It connects customers with skilled workers such as electricians, plumbers, painters, carpenters, and technicians. Customers can post service requests, while nearby workers can view and accept jobs in real-time. The platform includes live chat, location tracking, worker profiles, wallet management, and request tracking.',

problem:
'Finding reliable local service providers is often time-consuming and unorganized. Customers struggle to connect with trusted workers quickly, while skilled workers lack a dedicated platform to find nearby jobs.',

solution:
'Developed a Flutter-based marketplace platform with separate customer and worker modules, real-time job requests, Firebase backend, chat system, wallet integration, and Google Maps location services.',

result:
'Created a scalable marketplace solution that streamlines service booking, improves worker visibility, and enables faster customer-worker connections.',

techStack: [
'Flutter',
'Firebase',
'Google Maps',
'Firestore',
'Real-Time Chat',
'Clean Architecture'
],

mainImage: '/image/projects/skillLink/ChatGPT Image Jun 19, 2026, 06_53_08 PM.png',

screenshots: [
'/image/projects/skillLink/role.png',
'/image/projects/skillLink/worker.png',
'/image/projects/skillLink/skill_link.png',
'/image/projects/skillLink/tracking.png',
'/image/projects/skillLink/live_tracking.png',

],

demoUrl: '#',
codeUrl: 'https://github.com/Muhammad-Rashid-172002/SkillLink.git',

features: [
  'Customer & Worker Roles',
  'Job Posting System',
  'Real-Time Chat',
  'Live Location Tracking',
  'Google Maps Integration',
  'Wallet & Credits System',
  'Firebase Backend',
  'Worker Profiles'
],
},

  {
    id: '3',
    title: 'IELTS AI Study Assistant App',
    shortDescription: 'AI-powered IELTS preparation assistant for students.',
    fullDescription:
      'An intelligent IELTS preparation app that helps students improve reading, writing, speaking, and listening skills using AI-based feedback and practice tests.',

    problem:
      'Students struggle to find structured IELTS preparation with real-time feedback and personalized learning paths.',

    solution:
      'Developed an AI assistant that evaluates answers, provides corrections, and builds personalized study plans.',

    result:
      'Built and released a complete AI-powered IELTS learning experience covering speaking, writing, reading and listening practice.',

    techStack: [
  'Flutter',
  'Firebase',
  'Gemini AI',
  'REST APIs'
],

    mainImage: '/IELTS-AI-Study-Assistant .png',

    screenshots: [
      '/image/projects/IETLS/1.png',
      '/image/projects/IETLS/2.png',
      '/image/projects/IETLS/3.png',
      '/image/projects/IETLS/4.png',
      '/image/projects/IETLS/5.png',
      '/image/projects/IETLS/6.png',
      '/image/projects/IETLS/7.png',
      '/image/projects/IETLS/8.png',
      '/image/projects/IETLS/9.png',
       '/image/projects/IETLS/10.png',
      // '/image/projects/IETLS/11.png',
      // '/image/projects/IETLS/12.png',
      // '/image/projects/IETLS/13.png'
    ],

    demoUrl: 'https://play.google.com/store/apps/details?id=com.rashidapps.ieltsaimaster',
    codeUrl: 'https://github.com/Muhammad-Rashid-172002/IELTS-AI-Study-Assistant.git',

   features: [
  'AI Writing Evaluation',
  'AI Speaking Coach',
  'Mock Tests',
  'Vocabulary Builder',
  'Progress Tracking'
],
  },



  {
    id: '4',
    title: 'Stacked Workout App',
    shortDescription: 'Modern workout app with advanced UI and tracking features.',
    fullDescription:
      'A premium workout tracking application designed for gym users with smooth animations, progress tracking, and exercise library.',

    problem:
      'Most workout apps lack modern UI/UX and do not provide engaging user experience.',

    solution:
      'Designed a smooth, animated UI with structured workout plans and performance tracking system.',

    result:
'Delivered a modern workout experience with engaging UI, smooth animations, and structured fitness tracking.',

    techStack: ['Flutter', 'Animations', 'Local Storage', 'UI Design'],

    mainImage: '/app_icon_1.png',

    screenshots: [
      '/image/projects/stacked/1.png',
      '/image/projects/stacked/2.png',
      '/image/projects/stacked/3.png',
      '/image/projects/stacked/4.png',
      '/image/projects/stacked/5.png',
      '/image/projects/stacked/6.png',
      '/image/projects/stacked/7.png',
     
    ],

    demoUrl: '#',
    codeUrl: 'https://github.com/Muhammad-Rashid-172002/stacked-hive-workout-app.git',

    features: [
      'Workout Tracking',
      'Progress Charts',
      'Custom Plans',
      'Smooth Animations'
    ],
  },

  {
    id: '5',
    title: 'Noor Diesel Engineering Company Website',
    shortDescription: 'Professional company website for engineering services.',
    fullDescription:
      'A modern business website for Noor Diesel Engineering Company showcasing services, projects, and contact system with responsive design.',

    problem:
      'The company had no professional online presence to showcase services and attract clients.',

    solution:
      'Built a responsive website with clean UI, service showcase, and contact inquiry system.',

    result:
      'Delivered a responsive production website that gives the engineering business a clear, professional online presence.',

    techStack: [
  'Flutter Web',
  'Responsive Design',
  'Modern UI/UX'
],

    mainImage: '/image/projects/noor/1.png',

    screenshots: [
      '/image/projects/noor/2.png',
      '/image/projects/noor/3.png',
      '/image/projects/noor/4.png',
      '/image/projects/noor/5.png',
      '/image/projects/noor/6.png',
      '/image/projects/noor/7.png',
      '/image/projects/noor/8.png',
      '/image/projects/noor/9.png',
      '/image/projects/noor/11.png',
      '/image/projects/noor/13.png'
    ],

    demoUrl: 'https://noordieselengineeringcompany.vercel.app/',
    codeUrl: 'https://github.com/Muhammad-Rashid-172002/noor.diesel.engineering.company.git',

    features: [
      'Service Showcase',
      'Contact Form',
      'Responsive Design',
      'Fast Performance'
    ],
  },


];
export const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Startup App Development',
    description: 'Transforming your MVP into a scalable product with high-performance Flutter code.',
    icon: 'Rocket',
  },
  {
    id: '2',
    title: 'Firebase Systems',
    description: 'Scalable backends, real-time databases, and serverless logic for modern applications.',
    icon: 'Database',
  },
  {
    id: '3',
    title: 'UI/UX Design',
    description: 'Crafting premium, intuitive interfaces that delight users and drive conversion.',
    icon: 'Palette',
  },
  {
    id: '4',
    title: 'API Integration',
    description: 'Seamlessly connecting your mobile app with complex third-party services and legacy systems.',
    icon: 'Cpu',
  },

];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'smith3131',
    role: 'Client',
    company: 'United Kingdom',
    content:
      'Excellent Flutter developer. Communication was clear, delivery was on time, and all Firebase-related issues were resolved professionally. Highly recommended for mobile app development projects.',
    avatar: '/review.png',
  },

  {
    id: '2',
    name: 'Mobile App Client',
    role: 'Business Owner',
    company: 'Startup Project',
    content:
      'Muhammad demonstrated strong Flutter development skills and delivered a polished mobile application with clean architecture, responsive UI, and excellent attention to detail.',
    avatar:
      'https://ui-avatars.com/api/?name=Mobile+Client&background=0ea5e9&color=fff',
  },

  {
    id: '3',
    name: 'Google Play User',
    role: 'App User',
    company: 'FitMind AI',
    content:
      'FitMind AI provides a clean and intuitive experience for tracking calories, monitoring nutrition, and staying consistent with health goals. The AI-powered insights make it easier to understand daily habits and improve overall wellness.',
    avatar:
      'https://ui-avatars.com/api/?name=UI+Reviewer&background=6366f1&color=fff',
  },
];

export const EXPERIENCES: Experience[] = [
{
id: '0',
company: 'Korvenza',
role: 'Founder & CEO · Software Engineer',
period: '2026 - Present',
description: 'Leading Korvenza while remaining hands-on across product strategy, technical architecture, AI integrations, mobile engineering and production delivery.',
},


{
id: '2',
company: 'International Clients',
role: 'Independent Software Engineer',
period: '2025 - Present',
description:
'Delivering mobile, AI and software products for international clients through direct and marketplace engagements across the United States, United Kingdom, UAE and Malaysia.',
},

{
id: '3',
company: 'Xohub Solutions',
role: 'Flutter Development Intern',
period: '2025',
description:
'Developed mobile application features, integrated Firebase services, improved UI/UX, and collaborated with senior developers on production-ready Flutter projects.',
},

{
id: '4',
company: 'Code Alpha',
role: 'Mobile App Development Intern',
period: '2025',
description:
'Built Flutter applications, implemented responsive user interfaces, and gained hands-on experience in mobile app development workflows and best practices.',
},
];


export const SKILLS = [
  'Flutter',
  'Dart',
  'Firebase',
  'Firestore',
  'Google Maps',
  'Gemini AI',
  'OpenAI API',
  'REST APIs',
  'Provider',
  'Clean Architecture',
  'Real-Time Chat',
  'Push Notifications',
  'AdMob',
  'Payment Integration',
  'Git & GitHub',
  'Play Store Deployment',
  'UI/UX Design',
];
