import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Case #808: The Developer — Brook Solomon",
  description: "An unsolved mystery portfolio for Brook Solomon, a full-stack developer. Explore the suspect profile, timeline, evidence, and field notes.",
};

export default function Home() {
  return <HomeClient />;
}
