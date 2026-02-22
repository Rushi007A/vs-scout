import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL required" },
        { status: 400 }
      );
    }

    // Fetch website HTML
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const html = await response.text();

    // Extract simple text (basic clean)
    const text = html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 3000);

    // Simple AI-like enrichment (mock logic)
    const summary = text.slice(0, 300) + "...";

    const keywords = Array.from(
      new Set(
        text
          .toLowerCase()
          .split(" ")
          .filter((word) => word.length > 6)
          .slice(0, 8)
      )
    );

    const whatTheyDo = [
      "Builds digital products",
      "Operates in technology space",
      "Focuses on scalable solutions",
    ];

    const signals = [
      "Hiring activity detected",
      "Strong product-focused messaging",
      "Active marketing content",
    ];

    return NextResponse.json({
      summary,
      whatTheyDo,
      keywords,
      signals,
      sources: [url],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Enrichment failed" },
      { status: 500 }
    );
  }
}