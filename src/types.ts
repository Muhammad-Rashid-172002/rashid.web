/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  problem: string;
  solution: string;
  result: string;
  techStack: string[];
  mainImage: string;
  screenshots: string[];
  demoUrl: string;
  codeUrl: string;
  features: string[];
  /** Filter group on the home page. */
  category: 'AI' | 'Mobile' | 'Web';
  /** Short sector label, e.g. "AI / Consumer". */
  label: string;
  /** What I owned on the project. */
  role: string;
  /** [title, description] for each screenshot, in the same order. */
  screenCaptions?: [string, string][];
  /** 'poster' = screenshots are finished marketing images (already contain a device), so no mockup frame. */
  screenStyle?: 'device' | 'poster';
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Skill {
  name: string;
  level: number;
}
