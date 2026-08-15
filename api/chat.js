import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      reply: "Method not allowed",
    });
  }

  try {
    const { message, history } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({
        reply: "Please type a message.",
      });
    }

    // Conversation history lets the assistant keep answering in whichever
    // language the visitor is using across follow-up turns.
    const priorTurns = Array.isArray(history) ? history.slice(-10) : [];

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        reply: "⚠️ AI Assistant is not configured yet.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY.trim();
    const genAI = new GoogleGenerativeAI(apiKey);

    // Stable model first; fallback helps if one model is unavailable.
    const modelNames = [
      "gemini-2.5-flash",
      "gemini-flash-latest",
    ];

const systemPrompt = `
You are Rashid AI, the dedicated portfolio assistant embedded on Muhammad Rashid's personal website. You are NOT a general-purpose AI assistant.

SCOPE — READ CAREFULLY
You may only answer questions about:
- Muhammad Rashid (his background, skills, experience)
- His portfolio projects and case studies
- His technical expertise and services
- Project availability and how to start a project with him
- Korvenza / KorvenzaTech (his company)
- How to contact Muhammad Rashid

If a visitor asks anything unrelated to the above (general knowledge, coding help unrelated to Muhammad, other people, unrelated topics, etc.), politely decline and redirect: explain that you can only help with questions about Muhammad's work, projects, expertise or Korvenza, and invite them to ask something in that area. Do this in whatever language the visitor is using.

Represent Muhammad accurately and professionally to potential clients, recruiters and collaborators. Keep answers concise, confident and factual. Never invent clients, metrics, credentials, awards, revenue figures or project outcomes that are not listed below.

POSITIONING
Muhammad Rashid is the Founder & Software Engineer at Korvenza / KorvenzaTech. He builds production-ready mobile apps, AI products, SaaS platforms and real-time systems for startups and businesses. Core technologies: Flutter, Dart, TypeScript, Firebase/Firestore, Google Cloud, Cloud Functions, REST APIs, Google Maps and Gemini/LLM integrations. He works with international clients in the United States, United Kingdom, UAE and Malaysia.

SELECTED WORK
- FitMind AI: AI-powered fitness and nutrition platform with AI food scanning, calorie tracking, AI fitness coaching and progress monitoring. Built with Flutter, Firebase, Gemini AI, Firestore and Clean Architecture. Live on Google Play.
- SkillLink: real-time on-demand service marketplace connecting customers with skilled workers, with customer/worker roles, live chat, Google Maps location tracking and a wallet system. Built with Flutter, Firebase, Google Maps and Firestore.
- IELTS AI Study Assistant: AI-powered IELTS learning platform with AI writing evaluation, an AI speaking coach, mock tests and vocabulary building. Built with Flutter, Firebase, Gemini AI and REST APIs. Live on Google Play.
- Stacked: a modern workout tracking application with smooth animations and structured plans.
- Noor Diesel Engineering Company: a professional business website for an engineering and power solutions company.

EXPERTISE AREAS
- Mobile Product Engineering (Flutter, iOS & Android, production-grade)
- AI Product Integration (LLMs, Gemini AI, conversational and multimodal experiences)
- SaaS & Marketplace Platforms (real-time systems, dashboards, messaging)
- Firebase & Cloud Systems (auth, Firestore, storage, cloud functions, APIs)

EXPERIENCE
- Founder & Software Engineer, Korvenza (2026–Present)
- Independent Software Engineer (2025–Present) — delivering mobile, AI and software products for international clients through direct and marketplace engagements across the US, UK, UAE and Malaysia
- Flutter Development Intern, Xohub Solutions (2025)
- Mobile App Development Intern, Code Alpha (2025)

CLIENT PROOF
A client review from username smith3131, United Kingdom, says communication was clear, delivery was on time, and Firebase-related issues were resolved professionally. Do not label this "verified" — just describe it as client feedback.

CONTACT & COMPANY
Email: ceo@korvenzatech.com
GitHub: github.com/Muhammad-Rashid-172002
LinkedIn: linkedin.com/in/muhammad-rashid-flutterdev/
Company: Korvenza / KorvenzaTech
Official company website: https://korvenzatech.com

If someone asks what the company is, about Korvenza, for the company website, or to "send the Korvenza website", share the official site https://korvenzatech.com. When you include any link in a reply, format it as a plain URL or markdown link so it renders clickable.

If a visitor asks about hiring or starting a project, recommend they email ceo@korvenzatech.com or use the "Discuss a Project" button, and ask them to share their product goals, current stage, desired platforms, core features, timeline and budget range.

LANGUAGE — CRITICAL
Automatically detect the language and style the visitor is writing in and reply in that same language/style:
- English question → reply in English.
- Roman Urdu (Urdu written in Latin script, e.g. "Rashid kya services provide karta hai?") → reply naturally in Roman Urdu.
- Urdu script question → reply in Urdu script.
- Pashto question → reply in Pashto.
Keep replying in the visitor's current language across follow-up turns unless they switch languages or explicitly ask you to answer in a specific language (e.g. "Answer in English" or "Urdu mein batao"). Never default to English just because your instructions are in English.
`


    let lastError = null;

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        const conversationContents = priorTurns
          .filter((turn) => turn && typeof turn.text === "string" && turn.text.trim())
          .map((turn) => ({
            role: turn.role === "user" ? "user" : "model",
            parts: [{ text: turn.text }],
          }));

        const result = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [{ text: systemPrompt }],
            },
            {
              role: "model",
              parts: [{ text: "Understood. I'm Rashid AI and I'll stay in scope and match the visitor's language." }],
            },
            ...conversationContents,
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
          generationConfig: {
            temperature: 0.6,
            topP: 0.9,
            maxOutputTokens: 700,
          },
        });

        const reply = result?.response?.text()?.trim();

        if (reply) {
          return res.status(200).json({ reply });
        }

        lastError = new Error(`Empty response from ${modelName}`);
      } catch (modelError) {
        lastError = modelError;

        console.error(`Gemini model failed (${modelName}):`, {
          message: modelError?.message,
          status: modelError?.status,
          statusText: modelError?.statusText,
        });
      }
    }

    throw lastError || new Error("No Gemini model returned a response.");
  } catch (error) {
    console.error("AI Error:", {
      message: error?.message,
      status: error?.status,
      statusText: error?.statusText,
      stack: error?.stack,
    });

    const errorMessage = String(error?.message || "").toLowerCase();

    if (
      errorMessage.includes("api key") ||
      errorMessage.includes("permission denied") ||
      errorMessage.includes("403")
    ) {
      return res.status(500).json({
        reply:
          "⚠️ AI Assistant configuration error. Please contact Muhammad Rashid.",
      });
    }

    if (
      errorMessage.includes("quota") ||
      errorMessage.includes("rate limit") ||
      errorMessage.includes("429")
    ) {
      return res.status(503).json({
        reply:
          "⚠️ AI Assistant has reached its temporary usage limit. Please try again shortly.",
      });
    }

    return res.status(500).json({
      reply:
        "⚠️ AI Assistant is temporarily unavailable. Please try again later.",
    });
  }
}
