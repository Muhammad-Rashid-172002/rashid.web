"use client";

import { useEffect, useState } from "react";

const titles = [
  "Senior Flutter Developer",
  "AI-Powered Mobile App Developer",
  "Flutter & Firebase Expert",
  "Marketplace App Developer",
  "Mobile App Architect",
];

export default function HeroTitle() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = titles[titleIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayText(currentText.substring(0, displayText.length + 1));

          if (displayText === currentText) {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          setDisplayText(currentText.substring(0, displayText.length - 1));

          if (displayText === "") {
            setIsDeleting(false);
            setTitleIndex((prev) => (prev + 1) % titles.length);
          }
        }
      },
      isDeleting ? 40 : 80
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, titleIndex]);

  return (
    <h1 className="text-5xl md:text-6xl lg:text-[54px] font-black tracking-tighter leading-[1] min-h-[140px] lg:min-h-[80px]">
      {displayText}
      <span className="animate-pulse text-brand-500">|</span>
    </h1>
  );
}