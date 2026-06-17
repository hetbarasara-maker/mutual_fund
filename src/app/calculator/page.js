"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Container,
  TextField,
  Button,
  InputAdornment,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function TabPanel({ children, value, index }) {
  return <div hidden={value !== index}>{value === index && <Box sx={{ pt: 3 }}>{children}</Box>}</div>;
}

// 📊 Reusable Result Display with Chart
const CalculationResult = ({ total, invested, label, chartLabel = "Profit" }) => {
  const profit = total - invested;
  
  const chartData = {
    labels: ["Invested", chartLabel],
    datasets: [{
      data: [invested, Math.max(0, profit)],
      backgroundColor: ["rgba(255, 255, 255, 0.3)", "rgba(0, 255, 127, 0.8)"],
      hoverBackgroundColor: ["rgba(255, 255, 255, 0.45)", "rgba(0, 255, 127, 1)"],
      borderColor: "rgba(255, 255, 255, 0.2)",
      borderWidth: 1.5,
      cutout: "75%",
      borderRadius: 10,
    }],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "rgba(255, 255, 255, 0.6)",
          padding: 20,
          font: { weight: 'bold', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleColor: "#00FF7F",
        bodyColor: "#fff",
        borderColor: "rgba(0,255,127,0.2)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      }
    },
  };

  return (
    <Box 
      className="glass-card" 
      sx={{ 
        mt: 6, 
        textAlign: "center", 
        p: 4, 
        border: "1px solid rgba(0, 255, 127, 0.15)",
        background: "rgba(255,255,255,0.01)",
        overflow: "hidden"
      }}
    >
      <Typography variant="body2" color="rgba(255,255,255,0.85)" sx={{ letterSpacing: 2, fontWeight: 700, mb: 1 }}>{label}</Typography>
      <Typography variant="h3" sx={{ fontWeight: 900, color: "#00FF7F", mb: 3 }}>₹ {Number(total).toLocaleString('en-IN')}</Typography>
      
      <Stack direction="row" spacing={4} justifyContent="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="caption" color="rgba(255,255,255,0.4)" sx={{ display: "block", mb: 0.5 }}>INVESTED</Typography>
          <Typography variant="h6" fontWeight="800">₹ {Number(invested).toLocaleString('en-IN')}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="rgba(255,255,255,0.4)" sx={{ display: "block", mb: 0.5 }}>{chartLabel.toUpperCase()}</Typography>
          <Typography variant="h6" fontWeight="800" color="#00FF7F">₹ {Number(profit).toLocaleString('en-IN')}</Typography>
        </Box>
      </Stack>

      <Box sx={{ height: 280, position: "relative" }}>
        <Doughnut data={chartData} options={options} />
        <Box sx={{ position: "absolute", top: "42%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }}>
          <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.2)", fontWeight: 900 }}>GROWTH</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default function CalculatorPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const router = useRouter();

  // States for all calculators
  const [sipAmount, setSipAmount] = useState("");
  const [sipRate, setSipRate] = useState("");
  const [sipYears, setSipYears] = useState("");
  const [sipData, setSipData] = useState(null);

  const [swpCorpus, setSwpCorpus] = useState("");
  const [swpRate, setSwpRate] = useState("");
  const [swpYears, setSwpYears] = useState("");
  const [swpData, setSwpData] = useState(null);

  const [stepSipAmount, setStepSipAmount] = useState("");
  const [stepSipRate, setStepSipRate] = useState("");
  const [stepSipYears, setStepSipYears] = useState("");
  const [stepUpPercent, setStepUpPercent] = useState("");
  const [stepSipData, setStepSipData] = useState(null);

  const [stepSwpCorpus, setStepSwpCorpus] = useState("");
  const [stepSwpRate, setStepSwpRate] = useState("");
  const [stepSwpYears, setStepSwpYears] = useState("");
  const [stepSwpPercent, setStepSwpPercent] = useState("");
  const [stepSwpData, setStepSwpData] = useState(null);

  const [lumpsumAmount, setLumpsumAmount] = useState("");
  const [lumpsumRate, setLumpsumRate] = useState("");
  const [lumpsumYears, setLumpsumYears] = useState("");
  const [lumpsumData, setLumpsumData] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Calculations
  const calculateSIP = () => {
    const n = sipYears * 12;
    const r = sipRate / 100 / 12;
    const fv = sipAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    setSipData({ total: fv.toFixed(0), invested: (sipAmount * n).toFixed(0) });
  };

  const calculateSWP = () => {
    const n = swpYears * 12;
    const r = swpRate / 100 / 12;
    const withdrawal = (swpCorpus * r) / (1 - Math.pow(1 + r, -n));
    // For SWP we show Total Withdrawal vs Original Corpus
    setSwpData({ total: (withdrawal * n).toFixed(0), invested: Number(swpCorpus).toFixed(0) });
  };

  const calculateStepUpSIP = () => {
    let total = 0;
    let amount = Number(stepSipAmount);
    const r = stepSipRate / 100 / 12;
    let invested = 0;
    for (let i = 0; i < stepSipYears * 12; i++) {
      total = total * (1 + r) + amount;
      invested += amount;
      if ((i + 1) % 12 === 0) {
        amount += amount * (stepUpPercent / 100);
      }
    }
    setStepSipData({ total: total.toFixed(0), invested: invested.toFixed(0) });
  };

  const calculateStepUpSWP = () => {
    let remaining = Number(stepSwpCorpus);
    let r = stepSwpRate / 100 / 12;
    let withdrawal = 0;
    let totalWithdrawn = 0;
    for (let i = 0; i < stepSwpYears * 12; i++) {
      withdrawal = remaining * r / (1 - Math.pow(1 + r, -(stepSwpYears * 12 - i)));
      remaining = remaining * (1 + r) - withdrawal;
      totalWithdrawn += withdrawal;
      if ((i + 1) % 12 === 0) {
        withdrawal += withdrawal * (stepSwpPercent / 100);
      }
    }
    setStepSwpData({ total: totalWithdrawn.toFixed(0), invested: Number(stepSwpCorpus).toFixed(0) });
  };

  const calculateLumpsum = () => {
    const fv = lumpsumAmount * Math.pow(1 + lumpsumRate / 100, lumpsumYears);
    setLumpsumData({ total: fv.toFixed(0), invested: Number(lumpsumAmount).toFixed(0) });
  };

  const sharedTextFieldStyle = {
    mb: 3,
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      borderRadius: 3,
      backgroundColor: 'rgba(255,255,255,0.03)',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
      '&:hover fieldset': { borderColor: 'rgba(0, 255, 127, 0.4)' },
      '&.Mui-focused fieldset': { borderColor: '#00FF7F' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.85)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#00FF7F' },
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* Background Elements */}
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, background: "radial-gradient(circle at 50% 50%, #111 0%, #000 100%)" }} />
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, opacity: 0.1, backgroundImage: `linear-gradient(#00FF7F 1px, transparent 1px), linear-gradient(90deg, #00FF7F 1px, transparent 1px)`, backgroundSize: "60px 60px", maskImage: "radial-gradient(ellipse at center, black, transparent 80%)" }} />

      <Container maxWidth="md" sx={{ flex: 1, py: { xs: 6, sm: 8 }, px: { xs: 2.5, sm: 4 }, position: "relative", zIndex: 1 }}>
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, background: "linear-gradient(135deg, #fff 0%, #00FF7F 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: { xs: "2.2rem", sm: "3.5rem" } }}>
            Wealth Planner
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 600, mx: "auto" }}>
            Precision tools to forecast your financial future. Choose a model and calculate your projected returns.
          </Typography>
        </Box>

        <Box className="glass-card" sx={{ p: { xs: 2, sm: 4 }, mb: 4, bgcolor: "rgba(255,255,255,0.02)" }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": { color: "rgba(255,255,255,0.5)", fontWeight: 800, textTransform: "none", fontSize: "1rem", transition: "all 0.3s ease", px: 3, minHeight: 48 },
              "& .Mui-selected": { color: "#00FF7F !important" },
              "& .MuiTabs-indicator": { backgroundColor: "#00FF7F", height: 3, borderRadius: 1.5 },
              mb: 4,
            }}
          >
            <Tab label="SIP" />
            <Tab label="SWP" />
            <Tab label="Step-up SIP" />
            <Tab label="Step-up SWP" />
            <Tab label="Lumpsum" />
          </Tabs>

          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* SIP Tab */}
              <TabPanel value={tabIndex} index={0}>
                {[
                  { label: "Monthly Investment", val: sipAmount, set: setSipAmount, pre: "₹" },
                  { label: "Expected Annual Return (%)", val: sipRate, set: setSipRate, pre: "%" },
                  { label: "Investment Period (Years)", val: sipYears, set: setSipYears, pre: "Y" },
                ].map((input, idx) => (
                  <TextField key={idx} label={input.label} fullWidth value={input.val} onChange={(e) => input.set(e.target.value)} variant="outlined" sx={sharedTextFieldStyle} InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: "#00FF7F", fontWeight: 800 }}>{input.pre}</Typography></InputAdornment> }} />
                ))}
                <Button variant="contained" fullWidth onClick={calculateSIP} sx={{ backgroundColor: "#00FF7F", color: "#000", fontWeight: 900, py: 1.8, borderRadius: 3, fontSize: "1.1rem", textTransform: "none", boxShadow: "0 0 20px rgba(0, 255, 127, 0.3)" }}>Analyze SIP Growth</Button>
                {sipData && <CalculationResult total={sipData.total} invested={sipData.invested} label="ESTIMATED TOTAL VALUE" />}
              </TabPanel>

              {/* SWP Tab */}
              <TabPanel value={tabIndex} index={1}>
                {[
                  { label: "Corpus Amount", val: swpCorpus, set: setSwpCorpus, pre: "₹" },
                  { label: "Expected Annual Return (%)", val: swpRate, set: setSwpRate, pre: "%" },
                  { label: "Withdrawal Period (Years)", val: swpYears, set: setSwpYears, pre: "Y" },
                ].map((input, idx) => (
                  <TextField key={idx} label={input.label} fullWidth value={input.val} onChange={(e) => input.set(e.target.value)} variant="outlined" sx={sharedTextFieldStyle} InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: "#00FF7F", fontWeight: 800 }}>{input.pre}</Typography></InputAdornment> }} />
                ))}
                <Button variant="contained" fullWidth onClick={calculateSWP} sx={{ backgroundColor: "#00FF7F", color: "#000", fontWeight: 900, py: 1.8, borderRadius: 3 }}>Analyze SWP Returns</Button>
                {swpData && <CalculationResult total={swpData.total} invested={swpData.invested} label="TOTAL ESTIMATED PAYOUT" chartLabel="Yield" />}
              </TabPanel>

              {/* Step-up SIP Tab */}
              <TabPanel value={tabIndex} index={2}>
                {[
                  { label: "Initial SIP Amount", val: stepSipAmount, set: setStepSipAmount, pre: "₹" },
                  { label: "Step-up Percentage (Annual)", val: stepUpPercent, set: setStepUpPercent, pre: "%" },
                  { label: "Expected Annual Return (%)", val: stepSipRate, set: setStepSipRate, pre: "%" },
                  { label: "Investment Period (Years)", val: stepSipYears, set: setStepSipYears, pre: "Y" },
                ].map((input, idx) => (
                  <TextField key={idx} label={input.label} fullWidth value={input.val} onChange={(e) => input.set(e.target.value)} variant="outlined" sx={sharedTextFieldStyle} InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: "#00FF7F", fontWeight: 800 }}>{input.pre}</Typography></InputAdornment> }} />
                ))}
                <Button variant="contained" fullWidth onClick={calculateStepUpSIP} sx={{ backgroundColor: "#00FF7F", color: "#000", fontWeight: 900, py: 1.8, borderRadius: 3 }}>Verify Growth Potential</Button>
                {stepSipData && <CalculationResult total={stepSipData.total} invested={stepSipData.invested} label="FUTURE PROJECTED VALUE" />}
              </TabPanel>

              {/* Step-up SWP Tab */}
              <TabPanel value={tabIndex} index={3}>
                {[
                  { label: "Corpus Amount", val: stepSwpCorpus, set: setStepSwpCorpus, pre: "₹" },
                  { label: "Annual Withdrawal Increase (%)", val: stepSwpPercent, set: setStepSwpPercent, pre: "%" },
                  { label: "Expected Annual Return (%)", val: stepSwpRate, set: setStepSwpRate, pre: "%" },
                  { label: "Withdrawal Period (Years)", val: stepSwpYears, set: setStepSwpYears, pre: "Y" },
                ].map((input, idx) => (
                  <TextField key={idx} label={input.label} fullWidth value={input.val} onChange={(e) => input.set(e.target.value)} variant="outlined" sx={sharedTextFieldStyle} InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: "#00FF7F", fontWeight: 800 }}>{input.pre}</Typography></InputAdornment> }} />
                ))}
                <Button variant="contained" fullWidth onClick={calculateStepUpSWP} sx={{ backgroundColor: "#00FF7F", color: "#000", fontWeight: 900, py: 1.8, borderRadius: 3 }}>Evaluate Step-up SWP</Button>
                {stepSwpData && <CalculationResult total={stepSwpData.total} invested={stepSwpData.invested} label="ESTIMATED TOTAL WITHDRAWAL" chartLabel="Profit Generated" />}
              </TabPanel>

              {/* Lumpsum Tab */}
              <TabPanel value={tabIndex} index={4}>
                {[
                  { label: "Lumpsum Amount", val: lumpsumAmount, set: setLumpsumAmount, pre: "₹" },
                  { label: "Expected Annual Return (%)", val: lumpsumRate, set: setLumpsumRate, pre: "%" },
                  { label: "Investment Period (Years)", val: lumpsumYears, set: setLumpsumYears, pre: "Y" },
                ].map((input, idx) => (
                  <TextField key={idx} label={input.label} fullWidth value={input.val} onChange={(e) => input.set(e.target.value)} variant="outlined" sx={sharedTextFieldStyle} InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: "#00FF7F", fontWeight: 800 }}>{input.pre}</Typography></InputAdornment> }} />
                ))}
                <Button variant="contained" fullWidth onClick={calculateLumpsum} sx={{ backgroundColor: "#00FF7F", color: "#000", fontWeight: 900, py: 1.8, borderRadius: 3 }}>Predict Wealth Growth</Button>
                {lumpsumData && <CalculationResult total={lumpsumData.total} invested={lumpsumData.invested} label="LUMPSUM PROJECTED VALUE" />}
              </TabPanel>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
