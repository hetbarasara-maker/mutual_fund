// src/pages/api/scheme/[code]/returns.js
import { differenceInDays, parseISO } from "date-fns";

function calcAnnualizedReturn(startNAV, endNAV, days) {
  const years = days / 365;
  return ((endNAV / startNAV) ** (1 / years) - 1) * 100;
}

export default async function handler(req, res) {
  const { code } = req.query;
  const { period, from, to } = req.query;

  try {
    const resp = await fetch(`https://api.mfapi.in/mf/${code}`);
    const data = await resp.json();

    if (!data.meta || !data.data) {
      return res.status(404).json({ error: "Scheme not found" });
    }

    const navHistory = data.data.map(d => ({
      date: parseISO(d.date),
      nav: parseFloat(d.nav)
    })).reverse(); // oldest → newest

    let startDate, endDate;

    if (period) {
      endDate = navHistory[navHistory.length - 1].date;
      switch (period) {
        case "1m": startDate = new Date(endDate); startDate.setMonth(endDate.getMonth() - 1); break;
        case "3m": startDate = new Date(endDate); startDate.setMonth(endDate.getMonth() - 3); break;
        case "6m": startDate = new Date(endDate); startDate.setMonth(endDate.getMonth() - 6); break;
        case "1y": startDate = new Date(endDate); startDate.setFullYear(endDate.getFullYear() - 1); break;
        default: return res.status(400).json({ error: "Invalid period" });
      }
    } else if (from && to) {
      startDate = parseISO(from);
      endDate = parseISO(to);
    } else {
      return res.status(400).json({ error: "Provide period OR from/to" });
    }

    const startNAV = navHistory.find(d => d.date >= startDate)?.nav;
    const endNAV = navHistory.find(d => d.date <= endDate)?.nav;

    if (!startNAV || !endNAV) {
      return res.status(400).json({ error: "NAV data unavailable for given dates" });
    }

    const days = differenceInDays(endDate, startDate);
    const simpleReturn = ((endNAV - startNAV) / startNAV) * 100;

    let annualizedReturn = null;
    if (days >= 30) {
      annualizedReturn = calcAnnualizedReturn(startNAV, endNAV, days);
    }

    res.status(200).json({
      startDate,
      endDate,
      startNAV,
      endNAV,
      simpleReturn,
      annualizedReturn
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to calculate returns" });
  }
}
