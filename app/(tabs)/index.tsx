// app/index.tsx
import OnboardingSlider, { Slide } from "@/components/ui/OnboardingSlider";
import { useRouter } from "expo-router";
import React from "react";

const slides: Slide[] = [
  {
    id: "1",
    title: "QUEUE SYSTEM",
    description:
      "Join the queue, relax, and let us notify you when it’s your turn. Fair, simple, and stress-free waiting.",
    image: require("../../assets/images/queue.png"), // change to your actual image path
  },
  {
    id: "2",
    title: "CREDIT SCORE",
    description:
      "Show up on time, avoid last-minute cancellations, and watch your credit score grow.",
    image: require("../../assets/images/credit-score.png"),
  },
  {
    id: "3",
    title: "MAKE THE SMART MOVE",
    description:
      "Join for free and experience hassle-free booking, real-time updates, and rewards every visit.",
    image: require("../../assets/images/smart-move.png"),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <OnboardingSlider
      slides={slides}
      onDone={() => {
        // navigate to your main app (tabs, home, etc.)
        router.replace("/(tabs)");
      }}
    />
  );
}
