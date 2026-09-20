import type { MetadataRoute } from "next";
import { sql } from "@/lib/db";

const BASE_URL = "https://solocodes.dev";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: BASE_URL, changeFrequency: "monthly", priority: 1 },
        { url: `${BASE_URL}/suspect`, changeFrequency: "monthly", priority: 0.8 },
        { url: `${BASE_URL}/timeline`, changeFrequency: "monthly", priority: 0.8 },
        { url: `${BASE_URL}/modus-operandi`, changeFrequency: "monthly", priority: 0.8 },
        { url: `${BASE_URL}/evidence`, changeFrequency: "monthly", priority: 0.8 },
        { url: `${BASE_URL}/field-notes`, changeFrequency: "weekly", priority: 0.8 },
    ];

    const blogs = await sql`SELECT slug, created_at FROM blogs WHERE is_published = true`;

    const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
        url: `${BASE_URL}/field-notes/${blog.slug}`,
        lastModified: blog.created_at ?? undefined,
        changeFrequency: "monthly",
        priority: 0.6,
    }));

    return [...staticRoutes, ...blogRoutes];
}
