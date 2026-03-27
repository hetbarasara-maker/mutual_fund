export async function GET(request, { params }) {
  const { code } = await params;

  try {
    const response = await fetch(`https://api.mfapi.in/mf/${code}`);
    const data = await response.json();

    if (!data.meta || !data.data) {
      return new Response(JSON.stringify({ error: "Scheme not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        metadata: data.meta,
        navHistory: data.data.map((d) => ({
          date: d.date,
          nav: parseFloat(d.nav),
        })),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("API fetch error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch scheme details" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
