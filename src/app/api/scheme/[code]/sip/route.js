// src/pages/api/scheme/[code]/sip.js
import { parseISO, isWithinInterval } from "date-fns";

export default async function handler(req, res) {
  const { code } = req.query;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, frequency, from, to } = req.body;

    if (!amount || !from || !to) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const resp = await fetch(`https://api.mfapi.in/mf/${code}`);
    const data = await resp.json();

    if (!data.meta || !data.data) {
      return res.status(404).json({ error: "Scheme not found" });
    }

    const navHistory = data.data.map(d => ({
      date: parseISO(d.date),
      nav: parseFloat(d.nav)
    })).reverse(); // oldest → newest

    const startDate = parseISO(from);
    const endDate = parseISO(to);
    const latestNAV = navHistory[navHistory.length - 1].nav;

    let totalUnits = 0;
    let invested = 0;

    // monthly SIPs
    let sipDate = new Date(startDate);
    while (sipDate <= endDate) {
      const sipNAV = navHistory.find(d => d.date >= sipDate)?.nav;
      if (sipNAV) {
        totalUnits += amount / sipNAV;
        invested += amount;
      }
      sipDate.setMonth(sipDate.getMonth() + 1);
    }

    const currentValue = totalUnits * latestNAV;
    const absoluteReturn = ((currentValue - invested) / invested) * 100;
    const years = (endDate - startDate) / (365 * 24 * 60 * 60 * 1000);
    const annualizedReturn = ((currentValue / invested) ** (1 / years) - 1) * 100;

    res.status(200).json({
      totalInvested: invested,
      currentValue,
      totalUnits,
      absoluteReturn,
      annualizedReturn
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to calculate SIP returns" });
  }
}
