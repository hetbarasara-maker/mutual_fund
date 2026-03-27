export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch("https://api.mfapi.in/mf");
    const allFunds = await response.json();

    const today = new Date().toISOString().split("T")[0];
    const activeFunds = [];

    // Limit to first 40 funds to reduce API load
    const limitedFunds = allFunds.slice(0, 40);

    await Promise.all(
      limitedFunds.map(async (fund) => {
        try {
          const navRes = await fetch(`https://api.mfapi.in/mf/${fund.schemeCode}`);
          const navData = await navRes.json();
          const latest = navData.data?.[0];

          if (!latest?.nav) return;

          // Convert DD-MM-YYYY → YYYY-MM-DD
          const [day, month, year] = latest.date.split("-");
          const latestDate = `${year}-${month}-${day}`;

          if (latestDate !== today) return; // not today's NAV → skip

          const category = navData.meta?.scheme_category;
          const type = navData.meta?.scheme_type;

          // Skip inactive or null growth funds
          if (!category && !type) return;

          activeFunds.push({
            name: fund.schemeName,
            code: fund.schemeCode,
            nav: parseFloat(latest.nav),
            date: latestDate,
            category: category || "Unknown",
            type: type || "Growth",
          });
        } catch (err) {
          console.error("Error fetching NAV for:", fund.schemeCode, err);
        }
      })
    );

    return new Response(JSON.stringify(activeFunds), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch active funds:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch active funds" }),
      { status: 500 }
    );
  }
}
