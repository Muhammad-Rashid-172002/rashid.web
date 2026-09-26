<!-- <div align="center">
  <img width="1200" height="475" alt="Portfolio Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div> -->

# Muhammad Rashid — Software Engineer | Flutter Developer

Welcome to my personal portfolio repository 👋  
I am a **Software Engineer** specializing in **cross-platform mobile application development using Flutter** and web development with React, focused on building modern, scalable, and user-friendly applications.

---

## 👨‍💻 About Me

I am a passionate **Flutter & React Developer** with experience in designing and developing cross-platform applications for **Android, iOS, and Web**.

### What I Do:
- 📱 Mobile App Development (Flutter)  
- 💻 Web Development (React + Tailwind CSS)  
- 🔥 Firebase Integration  
- 🎨 Clean UI/UX Implementation  
- ⚙️ API Integration  
- 🚀 Performance Optimization  

I enjoy turning ideas into real-world applications with clean code and smooth user experiences.

---

## 🧠 Skills & Technologies

- **Flutter & Dart**  
- **Firebase (Auth, Firestore, Storage, FCM)**  
- **REST APIs**  
- **State Management (Provider / GetX / Bloc)**  
- **Git & GitHub**  
- **Responsive UI Design**

---

## 📌 Portfolio Overview

This repository contains the source code for my **personal portfolio website**, showcasing:

- My skills & expertise  
- Selected projects  
- Professional background  
- Contact information  

The portfolio is designed to provide a clear overview of my work for **clients, recruiters, and collaborators**.

---

## 🛠️ Tech Stack

- **Frontend:** Flutter
- **Mobile:** Flutter, Dart  
- **Backend:** Firebase  
- **Architecture:** Clean & Scalable  
- **UI/UX:** Modern, responsive, interactive  

---

---

## 🚀 Run & Deploy (website)

This site is **React 19 + Vite + Tailwind v4 + Motion**, deployed on **Vercel** (the `Rashid AI` chat is the `api/chat.js` serverless function).

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint       # type-check
npm run build      # production build → dist/
npm run preview    # serve the production build
```

- **Deploy:** push to the branch connected to Vercel (framework preset: Vite). `vercel.json` adds the SPA rewrite so `/project/:id` links work on refresh.
- **Env:** set `GEMINI_API_KEY` in Vercel → Project → Settings → Environment Variables. It is used only server-side and is never bundled into the client.
- **Design system:** colour tokens for dark/light live at the top of `src/index.css`; reusable motion primitives are in `src/components/ui/`.
- **Images:** project screenshots are served as `.webp` (originals kept next to them). To add a new one: `cwebp -q 80 -resize 1200 0 in.png -o in.webp`.
