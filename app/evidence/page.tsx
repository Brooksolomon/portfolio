import type { Metadata } from "next";
import EvidenceClient from "./EvidenceClient";

export const metadata: Metadata = {
    title: "Evidence Locker — Brook Solomon",
    description: "Case files and forensic exhibits: a project gallery of applications built by Brook Solomon.",
};

export default function EvidencePage() {
    return <EvidenceClient />;
}
