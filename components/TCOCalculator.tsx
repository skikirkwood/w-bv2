import React, { useState } from 'react';
import { DollarSign, TrendingUp, Zap, Calculator, Download, Camera } from 'lucide-react';

export default function App() {
  const [valueDriver, setValueDriver] = useState('revenue');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [inputs, setInputs] = useState({
    monthlyVisitors: 50000,
    currentConversionRate: 0.1,
    avgRevenuePerConversion: 100000,
    campaignLaunchTime: 30,
    developerHourlyRate: 150,
    monthlyDevHoursOnContent: 160,
    numberOfCMS: 3,
    cmsMaintenanceCostPerYear: 100000,
    marketingTeamSize: 10,
    implementationCost: 150000,
    annualLicenseCost: 75000,
    conversionRateIncrease: 35,
    timeToMarketReduction: 60,
    devEfficiencyGain: 50
  });

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) }));
  };

  const calculateRevenueImpact = () => {
    const annualVisitors = inputs.monthlyVisitors * 12;
    const currentConversions = annualVisitors * (inputs.currentConversionRate / 100);
    const currentRevenue = currentConversions * inputs.avgRevenuePerConversion;
    const newConversionRate = inputs.currentConversionRate * (1 + inputs.conversionRateIncrease / 100);
    const newConversions = annualVisitors * (newConversionRate / 100);
    const newRevenue = newConversions * inputs.avgRevenuePerConversion;
    const timeToMarketValue = (currentRevenue / 365) * (inputs.campaignLaunchTime * inputs.timeToMarketReduction / 100) * 6;
    return {
      currentRevenue,
      newRevenue,
      conversionLift: newRevenue - currentRevenue,
      timeToMarketValue,
      totalLift: (newRevenue - currentRevenue) + timeToMarketValue
    };
  };

  const calculateEfficiencyImpact = () => {
    const currentDevCost = inputs.monthlyDevHoursOnContent * inputs.developerHourlyRate * 12;
    const savedDevHours = inputs.monthlyDevHoursOnContent * (inputs.devEfficiencyGain / 100);
    const devCostSavings = savedDevHours * inputs.developerHourlyRate * 12;
    const cmsConsolidationSavings = inputs.cmsMaintenanceCostPerYear * ((inputs.numberOfCMS - 1) / inputs.numberOfCMS);
    const marketingProductivityGain = (inputs.marketingTeamSize * 80000) * 0.3;
    return {
      currentDevCost,
      devCostSavings,
      cmsConsolidationSavings,
      marketingProductivityGain,
      totalSavings: devCostSavings + cmsConsolidationSavings + marketingProductivityGain
    };
  };

  const revenue = calculateRevenueImpact();
  const efficiency = calculateEfficiencyImpact();
  const totalAnnualBenefit = revenue.totalLift + efficiency.totalSavings;
  const threeYearBenefit = totalAnnualBenefit * 3;
  const totalCost = inputs.implementationCost + (inputs.annualLicenseCost * 3);
  const netBenefit = threeYearBenefit - totalCost;
  const roi = ((netBenefit / totalCost) * 100);
  const paybackMonths = (inputs.implementationCost / (totalAnnualBenefit / 12));

  const formatCurrency = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
  const formatNumber = (num) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);

  const exportToCSV = () => {
    const csvContent = `Input Parameter,Value
Monthly Visitors,${inputs.monthlyVisitors}
Current Conversion Rate,${inputs.currentConversionRate}%
Average Revenue per Conversion,$${inputs.avgRevenuePerConversion}
Campaign Launch Time,${inputs.campaignLaunchTime} days
Developer Hourly Rate,$${inputs.developerHourlyRate}
Monthly Dev Hours on Content,${inputs.monthlyDevHoursOnContent}
Number of CMS Platforms,${inputs.numberOfCMS}
Annual CMS Maintenance Cost,$${inputs.cmsMaintenanceCostPerYear}
Marketing Team Size,${inputs.marketingTeamSize}
Implementation Cost,$${inputs.implementationCost}
Annual License Cost,$${inputs.annualLicenseCost}
Expected Conversion Rate Increase,${inputs.conversionRateIncrease}%
Expected Time-to-Market Reduction,${inputs.timeToMarketReduction}%
Expected Developer Efficiency Gain,${inputs.devEfficiencyGain}%`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'contentful_roi_inputs.csv';
    link.click();
  };

  const exportTextSummary = () => {
    const textContent = `CONTENTFUL ROI ANALYSIS
Generated: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
================
3-Year Net Benefit: ${formatCurrency(netBenefit)}
3-Year ROI: ${roi.toFixed(0)}%
Payback Period: ${paybackMonths.toFixed(1)} months

ANNUAL BENEFITS
==============
Revenue Growth: ${formatCurrency(revenue.totalLift)}
Operational Efficiency: ${formatCurrency(efficiency.totalSavings)}
Total Annual Benefit: ${formatCurrency(totalAnnualBenefit)}

INVESTMENT
==========
Implementation Cost: ${formatCurrency(inputs.implementationCost)}
Annual License Cost: ${formatCurrency(inputs.annualLicenseCost)}
3-Year Total Investment: ${formatCurrency(totalCost)}

REVENUE DETAILS
==============
Current Annual Revenue: ${formatCurrency(revenue.currentRevenue)}
Conversion Rate Lift: ${formatCurrency(revenue.conversionLift)}
Time-to-Market Value: ${formatCurrency(revenue.timeToMarketValue)}
Total Revenue Impact: ${formatCurrency(revenue.totalLift)}

EFFICIENCY DETAILS
=================
Developer Cost Savings: ${formatCurrency(efficiency.devCostSavings)}
CMS Consolidation Savings: ${formatCurrency(efficiency.cmsConsolidationSavings)}
Marketing Productivity Gain: ${formatCurrency(efficiency.marketingProductivityGain)}
Total Efficiency Savings: ${formatCurrency(efficiency.totalSavings)}`;
    
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'contentful_roi_summary.txt';
    link.click();
  };

  const exportHTMLPresentation = () => {
    const sharedStyles = `
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .slide-container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          max-width: 900px;
          width: 100%;
          padding: 60px;
          position: relative;
        }
        .contentful-logo {
          width: 180px;
          height: auto;
          margin-bottom: 30px;
        }
        .nav-buttons {
          display: flex;
          gap: 15px;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 2px solid #e5e7eb;
        }
        .nav-btn {
          flex: 1;
          padding: 15px 30px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
          text-align: center;
          display: block;
        }
        .nav-btn.primary {
          background: #3b82f6;
          color: white;
        }
        .nav-btn.primary:hover {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
        }
        .nav-btn.secondary {
          background: #e5e7eb;
          color: #374151;
        }
        .nav-btn.secondary:hover {
          background: #d1d5db;
        }
        h1 {
          font-size: 42px;
          color: #0f172a;
          margin-bottom: 15px;
          font-weight: 800;
        }
        h2 {
          font-size: 32px;
          color: #1e293b;
          margin-bottom: 30px;
          font-weight: 700;
        }
        .subtitle {
          font-size: 20px;
          color: #64748b;
          margin-bottom: 40px;
        }
        .metric-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin: 30px 0;
        }
        .metric-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          padding: 30px;
          color: white;
        }
        .metric-label {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .metric-value {
          font-size: 36px;
          font-weight: 800;
        }
        .detail-section {
          background: #f8fafc;
          border-radius: 15px;
          padding: 30px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 15px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-size: 16px;
          color: #475569;
          font-weight: 500;
        }
        .detail-value {
          font-size: 18px;
          color: #0f172a;
          font-weight: 700;
        }
        .highlight-box {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 40px;
          border-radius: 15px;
          text-align: center;
          margin: 30px 0;
        }
        .highlight-value {
          font-size: 56px;
          font-weight: 800;
          margin: 10px 0;
        }
        .print-btn {
          background: #8b5cf6;
          color: white;
          border: none;
          padding: 15px 40px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 20px;
          transition: all 0.3s;
        }
        .print-btn:hover {
          background: #7c3aed;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(139, 92, 246, 0.4);
        }
        .page-indicator {
          text-align: center;
          color: #94a3b8;
          font-size: 14px;
          margin-top: 20px;
        }
        @media print {
          body { background: white; }
          .slide-container { box-shadow: none; max-width: 100%; }
          .nav-buttons, .print-btn { display: none; }
        }
      </style>
    `;

    // Page 1: Executive Summary
    const page1 = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contentful ROI - Executive Summary</title>
  ${sharedStyles}
</head>
<body>
  <div class="slide-container">
    <img src="https://images.ctfassets.net/jtqsy5pye0zd/6wNuQ2xMvbw134rccObi0q/bf61badc6d6d9780609e541713f0bba6/Contentful_Logo_2.5_Dark.svg" alt="Contentful Logo" class="contentful-logo">
    <h1>Contentful ROI Analysis</h1>
    <p class="subtitle">Executive Summary</p>
    
    <div class="highlight-box">
      <div class="metric-label">3-Year Net Benefit</div>
      <div class="highlight-value">${formatCurrency(netBenefit)}</div>
    </div>

    <div class="metric-grid">
      <div class="metric-card">
        <div class="metric-label">3-Year ROI</div>
        <div class="metric-value">${roi.toFixed(0)}%</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Payback Period</div>
        <div class="metric-value">${paybackMonths.toFixed(1)} mo</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Annual Benefit</div>
        <div class="metric-value">${formatCurrency(totalAnnualBenefit)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Total Investment</div>
        <div class="metric-value">${formatCurrency(totalCost)}</div>
      </div>
    </div>

    <div class="nav-buttons">
      <a href="contentful_roi_page2.html" class="nav-btn primary">Next: Value Breakdown →</a>
    </div>
    
    <div class="page-indicator">Page 1 of 5</div>
  </div>
</body>
</html>`;

    // Page 2: Value Breakdown
    const page2 = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contentful ROI - Value Breakdown</title>
  ${sharedStyles}
</head>
<body>
  <div class="slide-container">
    <img src="https://images.ctfassets.net/jtqsy5pye0zd/6wNuQ2xMvbw134rccObi0q/bf61badc6d6d9780609e541713f0bba6/Contentful_Logo_2.5_Dark.svg" alt="Contentful Logo" class="contentful-logo">
    <h2>Value Breakdown</h2>
    
    <div class="detail-section">
      <h3 style="font-size: 24px; color: #10b981; margin-bottom: 20px; font-weight: 700;">Revenue Growth</h3>
      <div class="detail-row">
        <span class="detail-label">Annual Revenue Impact</span>
        <span class="detail-value" style="color: #10b981;">${formatCurrency(revenue.totalLift)}</span>
      </div>
    </div>

    <div class="detail-section">
      <h3 style="font-size: 24px; color: #3b82f6; margin-bottom: 20px; font-weight: 700;">Operational Efficiency</h3>
      <div class="detail-row">
        <span class="detail-label">Annual Efficiency Savings</span>
        <span class="detail-value" style="color: #3b82f6;">${formatCurrency(efficiency.totalSavings)}</span>
      </div>
    </div>

    <div class="highlight-box">
      <div class="metric-label">Total Annual Benefit</div>
      <div class="highlight-value">${formatCurrency(totalAnnualBenefit)}</div>
      <p style="margin-top: 15px; opacity: 0.9;">Revenue Growth + Operational Efficiency</p>
    </div>

    <div class="nav-buttons">
      <a href="contentful_roi_page1.html" class="nav-btn secondary">← Back</a>
      <a href="contentful_roi_page3.html" class="nav-btn primary">Next: Revenue Details →</a>
    </div>
    
    <div class="page-indicator">Page 2 of 5</div>
  </div>
</body>
</html>`;

    // Page 3: Revenue Details
    const page3 = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contentful ROI - Revenue Details</title>
  ${sharedStyles}
</head>
<body>
  <div class="slide-container">
    <img src="https://images.ctfassets.net/jtqsy5pye0zd/6wNuQ2xMvbw134rccObi0q/bf61badc6d6d9780609e541713f0bba6/Contentful_Logo_2.5_Dark.svg" alt="Contentful Logo" class="contentful-logo">
    <h2>Revenue Growth Details</h2>
    
    <div class="detail-section">
      <div class="detail-row">
        <span class="detail-label">Current Annual Revenue</span>
        <span class="detail-value">${formatCurrency(revenue.currentRevenue)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">New Annual Revenue</span>
        <span class="detail-value">${formatCurrency(revenue.newRevenue)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Conversion Rate Lift</span>
        <span class="detail-value" style="color: #10b981;">${formatCurrency(revenue.conversionLift)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Time-to-Market Value</span>
        <span class="detail-value" style="color: #10b981;">${formatCurrency(revenue.timeToMarketValue)}</span>
      </div>
      <div class="detail-row" style="border-top: 2px solid #10b981; margin-top: 15px; padding-top: 20px;">
        <span class="detail-label" style="font-size: 20px; font-weight: 700;">Total Revenue Impact</span>
        <span class="detail-value" style="color: #10b981; font-size: 28px;">${formatCurrency(revenue.totalLift)}</span>
      </div>
    </div>

    <div class="detail-section">
      <h3 style="font-size: 18px; color: #475569; margin-bottom: 15px; font-weight: 600;">Assumptions</h3>
      <div class="detail-row">
        <span class="detail-label">Monthly Visitors</span>
        <span class="detail-value">${formatNumber(inputs.monthlyVisitors)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Conversion Rate Increase</span>
        <span class="detail-value">${inputs.conversionRateIncrease}%</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Time-to-Market Reduction</span>
        <span class="detail-value">${inputs.timeToMarketReduction}%</span>
      </div>
    </div>

    <div class="nav-buttons">
      <a href="contentful_roi_page2.html" class="nav-btn secondary">← Back</a>
      <a href="contentful_roi_page4.html" class="nav-btn primary">Next: Efficiency Details →</a>
    </div>
    
    <div class="page-indicator">Page 3 of 5</div>
  </div>
</body>
</html>`;

    // Page 4: Efficiency Details
    const page4 = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contentful ROI - Efficiency Details</title>
  ${sharedStyles}
</head>
<body>
  <div class="slide-container">
    <img src="https://images.ctfassets.net/jtqsy5pye0zd/6wNuQ2xMvbw134rccObi0q/bf61badc6d6d9780609e541713f0bba6/Contentful_Logo_2.5_Dark.svg" alt="Contentful Logo" class="contentful-logo">
    <h2>Operational Efficiency Details</h2>
    
    <div class="detail-section">
      <div class="detail-row">
        <span class="detail-label">Current Developer Costs</span>
        <span class="detail-value">${formatCurrency(efficiency.currentDevCost)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Developer Cost Savings</span>
        <span class="detail-value" style="color: #3b82f6;">${formatCurrency(efficiency.devCostSavings)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">CMS Consolidation Savings</span>
        <span class="detail-value" style="color: #3b82f6;">${formatCurrency(efficiency.cmsConsolidationSavings)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Marketing Productivity Gain</span>
        <span class="detail-value" style="color: #3b82f6;">${formatCurrency(efficiency.marketingProductivityGain)}</span>
      </div>
      <div class="detail-row" style="border-top: 2px solid #3b82f6; margin-top: 15px; padding-top: 20px;">
        <span class="detail-label" style="font-size: 20px; font-weight: 700;">Total Efficiency Savings</span>
        <span class="detail-value" style="color: #3b82f6; font-size: 28px;">${formatCurrency(efficiency.totalSavings)}</span>
      </div>
    </div>

    <div class="detail-section">
      <h3 style="font-size: 18px; color: #475569; margin-bottom: 15px; font-weight: 600;">Assumptions</h3>
      <div class="detail-row">
        <span class="detail-label">Developer Efficiency Gain</span>
        <span class="detail-value">${inputs.devEfficiencyGain}%</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Number of CMS Platforms</span>
        <span class="detail-value">${inputs.numberOfCMS}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Marketing Team Size</span>
        <span class="detail-value">${inputs.marketingTeamSize}</span>
      </div>
    </div>

    <div class="nav-buttons">
      <a href="contentful_roi_page3.html" class="nav-btn secondary">← Back</a>
      <a href="contentful_roi_page5.html" class="nav-btn primary">Next: Investment Summary →</a>
    </div>
    
    <div class="page-indicator">Page 4 of 5</div>
  </div>
</body>
</html>`;

    // Page 5: Investment Summary
    const page5 = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contentful ROI - Investment Summary</title>
  ${sharedStyles}
</head>
<body>
  <div class="slide-container">
    <img src="https://images.ctfassets.net/jtqsy5pye0zd/6wNuQ2xMvbw134rccObi0q/bf61badc6d6d9780609e541713f0bba6/Contentful_Logo_2.5_Dark.svg" alt="Contentful Logo" class="contentful-logo">
    <h2>Investment Summary</h2>
    
    <div class="detail-section">
      <h3 style="font-size: 24px; color: #1e293b; margin-bottom: 20px; font-weight: 700;">3-Year Financial Overview</h3>
      <div class="detail-row">
        <span class="detail-label">Implementation Cost</span>
        <span class="detail-value">${formatCurrency(inputs.implementationCost)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Annual License Cost</span>
        <span class="detail-value">${formatCurrency(inputs.annualLicenseCost)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">3-Year License Costs</span>
        <span class="detail-value">${formatCurrency(inputs.annualLicenseCost * 3)}</span>
      </div>
      <div class="detail-row" style="border-top: 2px solid #ef4444; padding-top: 20px;">
        <span class="detail-label" style="font-size: 18px;">Total Investment</span>
        <span class="detail-value" style="font-size: 24px;">${formatCurrency(totalCost)}</span>
      </div>
    </div>

    <div class="detail-section" style="background: #f0fdf4; border: 2px solid #10b981;">
      <div class="detail-row">
        <span class="detail-label">3-Year Total Benefits</span>
        <span class="detail-value">${formatCurrency(threeYearBenefit)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Total Investment</span>
        <span class="detail-value">${formatCurrency(totalCost)}</span>
      </div>
      <div class="detail-row" style="border:none">
        <span class="detail-label" style="font-size:20px;color:#0f172a">Net 3-Year Benefit</span>
        <span class="detail-value" style="color:#10b981;font-size:24px">${formatCurrency(netBenefit)}</span>
      </div>
    </div>

    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>

    <div class="nav-buttons">
      <a href="contentful_roi_page4.html" class="nav-btn secondary">← Back</a>
      <a href="contentful_roi_page1.html" class="nav-btn primary">Back to Start</a>
    </div>
    
    <div class="page-indicator">Page 5 of 5</div>
  </div>
</body>
</html>`;

    // Create and download all pages as a zip-like collection
    // Since we can't create a zip in browser easily, we'll download them sequentially
    const pages = [
      { content: page1, name: 'contentful_roi_page1.html' },
      { content: page2, name: 'contentful_roi_page2.html' },
      { content: page3, name: 'contentful_roi_page3.html' },
      { content: page4, name: 'contentful_roi_page4.html' },
      { content: page5, name: 'contentful_roi_page5.html' }
    ];

    pages.forEach((page, index) => {
      setTimeout(() => {
        const blob = new Blob([page.content], { type: 'text/html;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = page.name;
        link.click();
      }, index * 300); // Stagger downloads by 300ms
    });
  };

  const SliderInput = ({ label, value, onChange, min, max, step, prefix = '', suffix = '', helper, decimals }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-base font-bold text-blue-600">{prefix}{decimals !== undefined ? value.toFixed(decimals) : formatNumber(value)}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer slider" style={{ background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - min) / (max - min)) * 100}%, #dbeafe ${((value - min) / (max - min)) * 100}%, #dbeafe 100%)` }} />
      {helper && <p className="text-xs text-gray-500">{helper}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <style>{`.slider::-webkit-slider-thumb{appearance:none;width:20px;height:20px;border-radius:50%;background:#3b82f6;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,0.2)}.slider::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:#3b82f6;cursor:pointer;border:none;box-shadow:0 2px 4px rgba(0,0,0,0.2)}`}</style>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <img 
            src="https://images.ctfassets.net/jtqsy5pye0zd/6wNuQ2xMvbw134rccObi0q/bf61badc6d6d9780609e541713f0bba6/Contentful_Logo_2.5_Dark.svg" 
            alt="Contentful Logo" 
            className="h-8 md:h-10"
          />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Contentful Value ROI Calculator</h1>
          <p className="text-gray-600">Quantify revenue growth and operational efficiency gains</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
          {[{ id: 'revenue', name: 'Revenue Growth', icon: TrendingUp }, { id: 'efficiency', name: 'Operational Efficiency', icon: Zap }].map((driver) => {
            const Icon = driver.icon;
            const isActive = valueDriver === driver.id;
            return (<button key={driver.id} onClick={() => setValueDriver(driver.id)} className={`p-6 rounded-xl border-2 transition-all ${isActive ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 bg-white hover:border-gray-300'}`}><Icon className={`w-8 h-8 mx-auto mb-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} /><div className={`text-base font-semibold ${isActive ? 'text-blue-900' : 'text-gray-600'}`}>{driver.name}</div></button>);
          })}
        </div>
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 max-h-[800px] overflow-y-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Calculator className="w-6 h-6 text-blue-600" />Configure Scenario</h2>
            <div className="space-y-6">
              {valueDriver === 'revenue' && (<><div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 mb-4 border border-green-200"><div className="flex items-start gap-3"><TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0" /><div><h3 className="font-bold text-green-900 text-lg">Revenue Growth</h3><p className="text-sm text-green-800">Launch campaigns faster and boost conversions</p></div></div></div><SliderInput label="Monthly Visitors" value={inputs.monthlyVisitors} onChange={(v) => handleInputChange('monthlyVisitors', v)} min={10000} max={500000} step={10000} /><SliderInput label="Current Conversion Rate" value={inputs.currentConversionRate} onChange={(v) => handleInputChange('currentConversionRate', v)} min={0.01} max={1} step={0.01} suffix="%" decimals={2} /><SliderInput label="Avg Revenue per Conversion" value={inputs.avgRevenuePerConversion} onChange={(v) => handleInputChange('avgRevenuePerConversion', v)} min={10000} max={200000} step={5000} prefix="$" /><SliderInput label="Campaign Launch Time (Days)" value={inputs.campaignLaunchTime} onChange={(v) => handleInputChange('campaignLaunchTime', v)} min={7} max={90} step={1} /><div className="border-t pt-4"><h3 className="font-semibold text-gray-900 mb-4">Expected Improvements</h3><SliderInput label="Conversion Rate Increase" value={inputs.conversionRateIncrease} onChange={(v) => handleInputChange('conversionRateIncrease', v)} min={10} max={100} step={5} suffix="%" helper="Industry: 25-78%" /><div className="mt-4"><SliderInput label="Time-to-Market Reduction" value={inputs.timeToMarketReduction} onChange={(v) => handleInputChange('timeToMarketReduction', v)} min={30} max={90} step={5} suffix="%" /></div></div></>)}
              {valueDriver === 'efficiency' && (<><div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 mb-4 border border-blue-200"><div className="flex items-start gap-3"><Zap className="w-6 h-6 text-blue-600 flex-shrink-0" /><div><h3 className="font-bold text-blue-900 text-lg">Operational Efficiency</h3><p className="text-sm text-blue-800">Reduce developer burden</p></div></div></div><SliderInput label="Developer Hourly Rate" value={inputs.developerHourlyRate} onChange={(v) => handleInputChange('developerHourlyRate', v)} min={75} max={250} step={5} prefix="$" /><SliderInput label="Monthly Dev Hours on Content" value={inputs.monthlyDevHoursOnContent} onChange={(v) => handleInputChange('monthlyDevHoursOnContent', v)} min={40} max={400} step={10} /><SliderInput label="Number of CMS Platforms" value={inputs.numberOfCMS} onChange={(v) => handleInputChange('numberOfCMS', v)} min={1} max={10} step={1} /><SliderInput label="Annual CMS Maintenance Cost" value={inputs.cmsMaintenanceCostPerYear} onChange={(v) => handleInputChange('cmsMaintenanceCostPerYear', v)} min={50000} max={500000} step={10000} prefix="$" /><SliderInput label="Marketing Team Size" value={inputs.marketingTeamSize} onChange={(v) => handleInputChange('marketingTeamSize', v)} min={3} max={50} step={1} /><div className="border-t pt-4"><h3 className="font-semibold text-gray-900 mb-4">Expected Improvements</h3><SliderInput label="Developer Efficiency Gain" value={inputs.devEfficiencyGain} onChange={(v) => handleInputChange('devEfficiencyGain', v)} min={30} max={80} step={5} suffix="%" helper="Typical: 50-80%" /></div></>)}
              <div className="border-t pt-6 mt-6"><h3 className="font-semibold text-gray-900 mb-4">Investment</h3><div className="space-y-4"><SliderInput label="Implementation Cost" value={inputs.implementationCost} onChange={(v) => handleInputChange('implementationCost', v)} min={50000} max={500000} step={10000} prefix="$" /><SliderInput label="Annual License Cost" value={inputs.annualLicenseCost} onChange={(v) => handleInputChange('annualLicenseCost', v)} min={25000} max={200000} step={5000} prefix="$" /></div></div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white"><h2 className="text-2xl font-bold mb-6">Total Business Impact</h2><div className="grid grid-cols-2 gap-4"><div className="bg-white/10 backdrop-blur rounded-lg p-4"><div className="text-sm opacity-90 mb-1">Annual Benefit</div><div className="text-2xl font-bold">{formatCurrency(totalAnnualBenefit)}</div></div><div className="bg-white/10 backdrop-blur rounded-lg p-4"><div className="text-sm opacity-90 mb-1">3-Year Benefit</div><div className="text-2xl font-bold">{formatCurrency(threeYearBenefit)}</div></div><div className="bg-white/10 backdrop-blur rounded-lg p-4"><div className="text-sm opacity-90 mb-1">3-Year ROI</div><div className="text-2xl font-bold">{roi.toFixed(0)}%</div></div><div className="bg-white/10 backdrop-blur rounded-lg p-4"><div className="text-sm opacity-90 mb-1">Payback Period</div><div className="text-2xl font-bold">{paybackMonths.toFixed(1)} mo</div></div></div></div>
            <div className="bg-white rounded-xl shadow-lg p-6"><h3 className="text-xl font-bold text-gray-900 mb-4">Value Breakdown</h3><div className="space-y-4"><div className="p-4 bg-green-50 rounded-lg border border-green-200"><div className="flex justify-between items-center mb-2"><div className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-600" /><span className="font-semibold text-gray-900">Revenue Growth</span></div><span className="text-xl font-bold text-green-600">{formatCurrency(revenue.totalLift)}</span></div></div><div className="p-4 bg-blue-50 rounded-lg border border-blue-200"><div className="flex justify-between items-center mb-2"><div className="flex items-center gap-2"><Zap className="w-5 h-5 text-blue-600" /><span className="font-semibold text-gray-900">Operational Efficiency</span></div><span className="text-xl font-bold text-blue-600">{formatCurrency(efficiency.totalSavings)}</span></div></div></div></div>
            <div className="bg-white rounded-xl shadow-lg p-6"><h3 className="text-xl font-bold text-gray-900 mb-4">{valueDriver === 'revenue' ? 'Revenue Details' : 'Efficiency Details'}</h3><div className="space-y-3">{valueDriver === 'revenue' && (<><div className="flex justify-between py-2 border-b"><span className="text-gray-700">Current Revenue</span><span className="font-semibold">{formatCurrency(revenue.currentRevenue)}</span></div><div className="flex justify-between py-2 border-b"><span className="text-gray-700">Conversion Lift</span><span className="font-semibold">{formatCurrency(revenue.conversionLift)}</span></div><div className="flex justify-between py-3 pt-4"><span className="font-bold">Total Lift</span><span className="text-xl font-bold text-green-600">{formatCurrency(revenue.totalLift)}</span></div></>)}{valueDriver === 'efficiency' && (<><div className="flex justify-between py-2 border-b"><span className="text-gray-700">Dev Savings</span><span className="font-semibold">{formatCurrency(efficiency.devCostSavings)}</span></div><div className="flex justify-between py-2 border-b"><span className="text-gray-700">CMS Savings</span><span className="font-semibold">{formatCurrency(efficiency.cmsConsolidationSavings)}</span></div><div className="flex justify-between py-3 pt-4"><span className="font-bold">Total Savings</span><span className="text-xl font-bold text-blue-600">{formatCurrency(efficiency.totalSavings)}</span></div></>)}</div></div>
          </div>
        </div>
        <div className="text-center mt-8"><div className="flex flex-col sm:flex-row gap-4 justify-center items-center"><button onClick={exportToCSV} className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-lg font-semibold"><Download className="w-6 h-6" />Export Inputs to CSV</button><div className="relative"><button onClick={() => setShowExportMenu(!showExportMenu)} className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg text-lg font-semibold"><Camera className="w-6 h-6" />Download Results</button>{showExportMenu && (<div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 z-50 min-w-[280px]"><button onClick={() => { exportTextSummary(); setShowExportMenu(false); }} className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100"><Download className="w-5 h-5 text-gray-600" /><div><div className="font-semibold text-gray-900">Text Summary</div><div className="text-sm text-gray-500">Formatted text file (.txt)</div></div></button><button onClick={() => { exportHTMLPresentation(); setShowExportMenu(false); }} className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors flex items-center gap-3 rounded-b-lg"><Camera className="w-5 h-5 text-gray-600" /><div><div className="font-semibold text-gray-900">HTML Presentation</div><div className="text-sm text-gray-500">5 separate pages (.html)</div></div></button></div>)}</div></div><p className="text-sm text-gray-600 mt-4">Download your scenario and results to share with your team</p></div>
      </div>
    </div>
  );
}
