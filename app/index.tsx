import OnboardingSlider, { Slide } from "@/components/ui/OnboardingSlider";
import { useRouter } from "expo-router";
import React from "react";

const slides: Slide[] = [
  {
    id: "1",
    title: "QUEUE SYSTEM",
    description:
      "Join the queue, relax, and let us notify you when it’s your turn.\nFair, simple, and stress-free waiting.",
    image: require("../assets/images/queue.png"),
    imageHeight: 170,
    imageWidth: "96%",
  },
  {
    id: "2",
    title: "CREDIT SCORE",
    description:
      "Show up on time, avoid last-minute cancellations, and watch your credit score grow. Be careful a user with lower score may get their account suspended!",
    image: require("../assets/images/credit-score.png"),
    imageHeight: 190,
    imageWidth: "92%",
  },
  {
    id: "3",
    title: "MAKE THE SMART MOVE",
    description:
      "Join for free and experience hassle-free booking, real-time updates, and reward points every visit.",
    image: require("../assets/images/smart-move.png"),
    imageHeight: 190,
    imageWidth: "76%",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <OnboardingSlider
      slides={slides}
      onDone={() => {
        router.replace("/welcome");
      }}
    />
  );
}
