import type { Metadata } from "next";
import ModusOperandiClient from "./ModusOperandiClient";

export const metadata: Metadata = {
    title: "Modus Operandi — Brook Solomon",
    description: "Skills and methods dossier: the languages, frameworks, and tools Brook Solomon operates with.",
};

export default function ModusOperandiPage() {
    return <ModusOperandiClient />;
}
