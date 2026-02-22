export async function POST(req: Request) {
  const { url } = await req.json();

  return Response.json({
    summary: "AI-powered fintech infrastructure company.",
    whatTheyDo: [
      "Provides global payment APIs",
      "Supports startups and enterprises",
      "Offers fraud detection tools"
    ],
    keywords: ["Fintech", "Payments", "API"],
    signals: [
      "Careers page exists",
      "Blog updated recently"
    ],
    sources: [url],
  });
}