"use client";

import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Container,
  TextField,
  Button,
  InputAdornment,
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

export default function CalculatorPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const router = useRouter();

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // ===== SIP Calculator =====
  const [sipAmount, setSipAmount] = useState("");
  const [sipRate, setSipRate] = useState("");
  const [sipYears, setSipYears] = useState("");
  const [sipResult, setSipResult] = useState(null);
  const [sipInvested, setSipInvested] = useState(0);

  // ===== SWP Calculator =====
  const [swpCorpus, setSwpCorpus] = useState("");
  const [swpRate, setSwpRate] = useState("");
  const [swpYears, setSwpYears] = useState("");
  const [swpResult, setSwpResult] = useState(null);

  // ===== Step-up SIP =====
  const [stepSipAmount, setStepSipAmount] = useState("");
  const [stepSipRate, setStepSipRate] = useState("");
  const [stepSipYears, setStepSipYears] = useState("");
  const [stepUpPercent, setStepUpPercent] = useState("");
  const [stepSipResult, setStepSipResult] = useState(null);
  const [stepSipInvested, setStepSipInvested] = useState(0);

  // ===== Step-up SWP =====
  const [stepSwpCorpus, setStepSwpCorpus] = useState("");
  const [stepSwpRate, setStepSwpRate] = useState("");
  const [stepSwpYears, setStepSwpYears] = useState("");
  const [stepSwpPercent, setStepSwpPercent] = useState("");
  const [stepSwpResult, setStepSwpResult] = useState(null);

  // ===== Lumpsum =====
  const [lumpsumAmount, setLumpsumAmount] = useState("");
  const [lumpsumRate, setLumpsumRate] = useState("");
  const [lumpsumYears, setLumpsumYears] = useState("");
  const [lumpsumResult, setLumpsumResult] = useState(null);

  // ===== Calculations =====
  const calculateSIP = () => {
    const n = sipYears * 12;
    const r = sipRate / 100 / 12;
    const fv = sipAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    setSipResult(fv.toFixed(2));
    setSipInvested((sipAmount * n).toFixed(2));
  };

  const calculateSWP = () => {
    const n = swpYears * 12;
    const r = swpRate / 100 / 12;
    const withdrawal = (swpCorpus * r) / (1 - Math.pow(1 + r, -n));
    setSwpResult(withdrawal.toFixed(2));
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
    setStepSipResult(total.toFixed(2));
    setStepSipInvested(invested.toFixed(2));
  };

  const calculateStepUpSWP = () => {
    let remaining = Number(stepSwpCorpus);
    let r = stepSwpRate / 100 / 12;
    let withdrawal = 0;
    for (let i = 0; i < stepSwpYears * 12; i++) {
      withdrawal = remaining * r / (1 - Math.pow(1 + r, -(stepSwpYears * 12 - i)));
      remaining = remaining * (1 + r) - withdrawal;
      if ((i + 1) % 12 === 0) {
        withdrawal += withdrawal * (stepSwpPercent / 100);
      }
    }
    setStepSwpResult(withdrawal.toFixed(2));
  };

  const calculateLumpsum = () => {
    const fv = lumpsumAmount * Math.pow(1 + lumpsumRate / 100, lumpsumYears);
    setLumpsumResult(fv.toFixed(2));
  };

  // ===== Common Styles =====
  const inputStyle = {
    mb: 2,
    "& .MuiInputBase-input": { color: "#00FF7F" },
    "& .MuiInputLabel-root": { color: "#00FF7F" },
  };

  const chartOptions = {
    plugins: { legend: { labels: { color: "#00FF7F" } } },
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#000", color: "#00FF7F", display: "flex", flexDirection: "column" }}>
      {/* ===== Main ===== */}
      <Container maxWidth="md" sx={{ flex: 1, py: { xs: 4, sm: 8 }, px: { xs: 2, sm: 4 } }}>
        <Typography 
          variant="h3" 
          fontWeight="bold" 
          align="center" 
          sx={{ 
            mb: 4, 
            color: "#00FF7F",
            fontSize: { xs: "2rem", sm: "3rem" }
          }}
        >
          Investment Calculators
        </Typography>

        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": { color: "#00FF7F", fontWeight: "bold", textTransform: "none", minWidth: { xs: 80, sm: 120 } },
            "& .Mui-selected": { color: "#000", backgroundColor: "#00FF7F", borderRadius: "20px" },
            mb: 3,
          }}
        >
          <Tab label="SIP" />
          <Tab label="SWP" />
          <Tab label="Step-up SIP" />
          <Tab label="Step-up SWP" />
          <Tab label="Lumpsum" />
        </Tabs>

        {/* SIP */}
        <TabPanel value={tabIndex} index={0}>
          <TextField 
            label="Monthly Investment" 
            fullWidth 
            value={sipAmount} 
            onChange={(e) => setSipAmount(e.target.value)} 
            sx={inputStyle} 
            InputProps={{
              startAdornment: <InputAdornment position="start"><Typography sx={{ color: "#00FF7F" }}>₹</Typography></InputAdornment>
            }}
          />
          <TextField label="Expected Annual Return (%)" fullWidth value={sipRate} onChange={(e) => setSipRate(e.target.value)} sx={inputStyle} />
          <TextField label="Investment Period (Years)" fullWidth value={sipYears} onChange={(e) => setSipYears(e.target.value)} sx={inputStyle} />
          <Button 
            variant="contained" 
            fullWidth={true}
            onClick={calculateSIP} 
            sx={{ 
              backgroundColor: "#00FF7F", 
              color: "#000", 
              mt: 2,
              fontWeight: "bold",
              py: 1.5,
              "&:hover": { backgroundColor: "#32CD32" }
            }}
          >
            Calculate SIP
          </Button>
          {sipResult && (
            <Box sx={{ mt: 4, textAlign: "center", p: 3, backgroundColor: "rgba(0, 255, 127, 0.05)", borderRadius: 4, border: "1px solid rgba(0, 255, 127, 0.2)" }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Estimated Returns</Typography>
              <Typography variant="h4" fontWeight="bold">₹ {Number(sipResult).toLocaleString('en-IN')}</Typography>
              <Box sx={{ height: { xs: 250, sm: 300 }, mt: 2 }}>
                <Doughnut
                  data={{
                    labels: ["Invested", "Returns"],
                    datasets: [{
                      data: [sipInvested, sipResult - sipInvested],
                      backgroundColor: ["#008080", "#FF7F50"],
                      borderWidth: 0,
                    }],
                  }}
                  options={{
                    ...chartOptions,
                    maintainAspectRatio: false,
                  }}
                />
              </Box>
            </Box>
          )}
        </TabPanel>

        {/* SWP */}
        <TabPanel value={tabIndex} index={1}>
          <TextField 
            label="Corpus Amount" 
            fullWidth 
            value={swpCorpus} 
            onChange={(e) => setSwpCorpus(e.target.value)} 
            sx={inputStyle} 
            InputProps={{
              startAdornment: <InputAdornment position="start"><Typography sx={{ color: "#00FF7F" }}>₹</Typography></InputAdornment>
            }}
          />
          <TextField label="Expected Annual Return (%)" fullWidth value={swpRate} onChange={(e) => setSwpRate(e.target.value)} sx={inputStyle} />
          <TextField label="Withdrawal Period (Years)" fullWidth value={swpYears} onChange={(e) => setSwpYears(e.target.value)} sx={inputStyle} />
          <Button 
            variant="contained" 
            fullWidth={true}
            onClick={calculateSWP} 
            sx={{ 
              backgroundColor: "#00FF7F", 
              color: "#000", 
              mt: 2,
              fontWeight: "bold",
              py: 1.5,
              "&:hover": { backgroundColor: "#32CD32" }
            }}
          >
            Calculate SWP
          </Button>
          {swpResult && (
            <Box sx={{ mt: 4, textAlign: "center", p: 3, backgroundColor: "rgba(0, 255, 127, 0.05)", borderRadius: 4, border: "1px solid rgba(0, 255, 127, 0.2)" }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Monthly Withdrawal</Typography>
              <Typography variant="h4" fontWeight="bold">₹ {Number(swpResult).toLocaleString('en-IN')}</Typography>
              <Box sx={{ height: { xs: 250, sm: 300 }, mt: 2 }}>
                <Doughnut
                  data={{
                    labels: ["Corpus", "Withdrawal"],
                    datasets: [{
                      data: [swpCorpus, swpResult],
                      backgroundColor: ["#20B2AA", "#FF6347"],
                      borderWidth: 0,
                    }],
                  }}
                  options={{
                    ...chartOptions,
                    maintainAspectRatio: false,
                  }}
                />
              </Box>
            </Box>
          )}
        </TabPanel>

        {/* Step-up SIP */}
        <TabPanel value={tabIndex} index={2}>
          <TextField 
            label="Monthly Investment" 
            fullWidth 
            value={stepSipAmount} 
            onChange={(e) => setStepSipAmount(e.target.value)} 
            sx={inputStyle} 
            InputProps={{
              startAdornment: <InputAdornment position="start"><Typography sx={{ color: "#00FF7F" }}>₹</Typography></InputAdornment>
            }}
          />
          <TextField label="Expected Annual Return (%)" fullWidth value={stepSipRate} onChange={(e) => setStepSipRate(e.target.value)} sx={inputStyle} />
          <TextField label="Investment Period (Years)" fullWidth value={stepSipYears} onChange={(e) => setStepSipYears(e.target.value)} sx={inputStyle} />
          <TextField label="Annual Increase (%)" fullWidth value={stepUpPercent} onChange={(e) => setStepUpPercent(e.target.value)} sx={inputStyle} />
          <Button 
            variant="contained" 
            fullWidth={true}
            onClick={calculateStepUpSIP} 
            sx={{ 
              backgroundColor: "#00FF7F", 
              color: "#000", 
              mt: 2,
              fontWeight: "bold",
              py: 1.5,
              "&:hover": { backgroundColor: "#32CD32" }
            }}
          >
            Calculate Step-up SIP
          </Button>
          {stepSipResult && (
            <Box sx={{ mt: 4, textAlign: "center", p: 3, backgroundColor: "rgba(0, 255, 127, 0.05)", borderRadius: 4, border: "1px solid rgba(0, 255, 127, 0.2)" }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Future Value</Typography>
              <Typography variant="h4" fontWeight="bold">₹ {Number(stepSipResult).toLocaleString('en-IN')}</Typography>
              <Box sx={{ height: { xs: 250, sm: 300 }, mt: 2 }}>
                <Doughnut
                  data={{
                    labels: ["Invested", "Returns"],
                    datasets: [{
                      data: [stepSipInvested, stepSipResult - stepSipInvested],
                      backgroundColor: ["#008B8B", "#FF8C00"],
                      borderWidth: 0,
                    }],
                  }}
                  options={{
                    ...chartOptions,
                    maintainAspectRatio: false,
                  }}
                />
              </Box>
            </Box>
          )}
        </TabPanel>

        {/* Step-up SWP */}
        <TabPanel value={tabIndex} index={3}>
          <TextField label="Corpus Amount (₹)" fullWidth value={stepSwpCorpus} onChange={(e) => setStepSwpCorpus(e.target.value)} sx={inputStyle} />
          <TextField label="Expected Annual Return (%)" fullWidth value={stepSwpRate} onChange={(e) => setStepSwpRate(e.target.value)} sx={inputStyle} />
          <TextField label="Withdrawal Period (Years)" fullWidth value={stepSwpYears} onChange={(e) => setStepSwpYears(e.target.value)} sx={inputStyle} />
          <TextField label="Annual Withdrawal Increase (%)" fullWidth value={stepSwpPercent} onChange={(e) => setStepSwpPercent(e.target.value)} sx={inputStyle} />
          <Button 
            variant="contained" 
            fullWidth={true}
            onClick={calculateStepUpSWP} 
            sx={{ 
              backgroundColor: "#00FF7F", 
              color: "#000", 
              mt: 2,
              fontWeight: "bold",
              py: 1.5,
              "&:hover": { backgroundColor: "#32CD32" }
            }}
          >
            Calculate Step-up SWP
          </Button>
          {stepSwpResult && (
            <Box sx={{ mt: 4, textAlign: "center", p: 3, backgroundColor: "rgba(0, 255, 127, 0.05)", borderRadius: 4, border: "1px solid rgba(0, 255, 127, 0.2)" }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Average Withdrawal</Typography>
              <Typography variant="h4" fontWeight="bold">₹ {Number(stepSwpResult).toLocaleString('en-IN')}</Typography>
              <Box sx={{ height: { xs: 250, sm: 300 }, mt: 2 }}>
                <Doughnut
                  data={{
                    labels: ["Corpus", "Withdrawal"],
                    datasets: [{
                      data: [stepSwpCorpus, stepSwpResult],
                      backgroundColor: ["#5F9EA0", "#FFA07A"],
                      borderWidth: 0,
                    }],
                  }}
                  options={{
                    ...chartOptions,
                    maintainAspectRatio: false,
                  }}
                />
              </Box>
            </Box>
          )}
        </TabPanel>

        {/* Lumpsum */}
        <TabPanel value={tabIndex} index={4}>
          <TextField 
            label="Lumpsum Amount" 
            fullWidth 
            value={lumpsumAmount} 
            onChange={(e) => setLumpsumAmount(e.target.value)} 
            sx={inputStyle} 
            InputProps={{
              startAdornment: <InputAdornment position="start"><Typography sx={{ color: "#00FF7F" }}>₹</Typography></InputAdornment>
            }}
          />
          <TextField label="Expected Annual Return (%)" fullWidth value={lumpsumRate} onChange={(e) => setLumpsumRate(e.target.value)} sx={inputStyle} />
          <TextField label="Investment Period (Years)" fullWidth value={lumpsumYears} onChange={(e) => setLumpsumYears(e.target.value)} sx={inputStyle} />
          <Button 
            variant="contained" 
            fullWidth={true}
            onClick={calculateLumpsum} 
            sx={{ 
              backgroundColor: "#00FF7F", 
              color: "#000", 
              mt: 2,
              fontWeight: "bold",
              py: 1.5,
              "&:hover": { backgroundColor: "#32CD32" }
            }}
          >
            Calculate Lumpsum
          </Button>
          {lumpsumResult && (
            <Box sx={{ mt: 4, textAlign: "center", p: 3, backgroundColor: "rgba(0, 255, 127, 0.05)", borderRadius: 4, border: "1px solid rgba(0, 255, 127, 0.2)" }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Future Value</Typography>
              <Typography variant="h4" fontWeight="bold">₹ {Number(lumpsumResult).toLocaleString('en-IN')}</Typography>
              <Box sx={{ height: { xs: 250, sm: 300 }, mt: 2 }}>
                <Doughnut
                  data={{
                    labels: ["Invested", "Returns"],
                    datasets: [{
                      data: [lumpsumAmount, lumpsumResult - lumpsumAmount],
                      backgroundColor: ["#40E0D0", "#FF7F50"],
                      borderWidth: 0,
                    }],
                  }}
                  options={{
                    ...chartOptions,
                    maintainAspectRatio: false,
                  }}
                />
              </Box>
            </Box>
          )}
        </TabPanel>
      </Container>
    </Box>
  );
}
