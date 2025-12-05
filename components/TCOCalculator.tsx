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

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
  };

  const exportToCSV = () => {
    const csvRows = [
      ['Input Field', 'Your Value'],
      ['Monthly Website Visitors', inputs.monthlyVisitors],
      ['Current Conversion Rate (%)', inputs.currentConversionRate],
      ['Average Revenue per Conversion ($)', inputs.avgRevenuePerConversion],
      ['Current Campaign Launch Time (days)', inputs.campaignLaunchTime],
      ['Developer Hourly Rate ($)', inputs.developerHourlyRate],
      ['Monthly Dev Hours on Content', inputs.monthlyDevHoursOnContent],
      ['Number of CMS Platforms', inputs.numberOfCMS],
      ['Annual CMS Maintenance Cost ($)', inputs.cmsMaintenanceCostPerYear],
      ['Marketing Team Size', inputs.marketingTeamSize],
      ['Implementation Cost ($)', inputs.implementationCost],
      ['Annual License Cost ($)', inputs.annualLicenseCost],
      ['Expected Conversion Rate Increase (%)', inputs.conversionRateIncrease],
      ['Expected Time-to-Market Reduction (%)', inputs.timeToMarketReduction],
      ['Expected Developer Efficiency Gain (%)', inputs.devEfficiencyGain]
    ];
    
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'contentful_roi_inputs.csv';
    link.click();
  };

  const exportTextSummary = () => {
    const content = `CONTENTFUL ROI CALCULATOR - RESULTS SUMMARY
Generated: ${new Date().toLocaleDateString()}

TOTAL BUSINESS IMPACT (3-Year Projection)
Annual Benefit: ${formatCurrency(totalAnnualBenefit)}
3-Year Benefit: ${formatCurrency(threeYearBenefit)}
3-Year ROI: ${roi.toFixed(0)}%
Payback Period: ${paybackMonths.toFixed(1)} months

REVENUE GROWTH IMPACT
Current Annual Revenue: ${formatCurrency(revenue.currentRevenue)}
New Annual Revenue: ${formatCurrency(revenue.newRevenue)}
Conversion Rate Lift: ${formatCurrency(revenue.conversionLift)}
Time-to-Market Value: ${formatCurrency(revenue.timeToMarketValue)}
Total Revenue Lift: ${formatCurrency(revenue.totalLift)}

OPERATIONAL EFFICIENCY SAVINGS
Current Annual Dev Cost: ${formatCurrency(efficiency.currentDevCost)}
Developer Cost Savings: ${formatCurrency(efficiency.devCostSavings)}
CMS Consolidation: ${formatCurrency(efficiency.cmsConsolidationSavings)}
Marketing Productivity: ${formatCurrency(efficiency.marketingProductivityGain)}
Total Annual Savings: ${formatCurrency(efficiency.totalSavings)}

INVESTMENT SUMMARY
Implementation Cost: ${formatCurrency(inputs.implementationCost)}
3-Year License Cost: ${formatCurrency(inputs.annualLicenseCost * 3)}
Total Investment: ${formatCurrency(totalCost)}
Net 3-Year Benefit: ${formatCurrency(netBenefit)}`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'contentful_roi_results.txt';
    link.click();
  };

  const exportHTMLPresentation = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Contentful ROI Analysis</title><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;background:#f8fafc;overflow:hidden}.slide-container{width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;padding:40px}.slide{width:1200px;height:675px;background:#fff;padding:60px 80px;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.06);display:none;flex-direction:column;position:relative}.slide.active{display:flex}.contentful-logo{position:absolute;top:30px;left:40px;display:flex;align-items:center;gap:8px}.contentful-icon{width:32px;height:32px;border-radius:6px;background:#fff;position:relative;overflow:hidden}.contentful-icon::before{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background:conic-gradient(from 0deg at 50% 50%,#2463EB 0deg,#2463EB 120deg,#FFD23F 120deg,#FFD23F 240deg,#FF6B35 240deg,#FF6B35 360deg);clip-path:circle(40% at 50% 50%)}.contentful-text{font-size:20px;font-weight:800;color:#0f172a;letter-spacing:-0.01em}.slide-number{position:absolute;bottom:30px;right:40px;color:#94a3b8;font-size:14px;font-weight:600}.slide-header{font-size:48px;font-weight:800;color:#0f172a;margin-bottom:16px;letter-spacing:-0.02em}.slide-subheader{font-size:20px;color:#64748b;margin-bottom:40px;font-weight:500}.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:auto}.stat-box{background:#f8fafc;padding:32px;border-radius:12px;border:2px solid #e2e8f0;transition:all 0.2s}.stat-box:hover{border-color:#2463EB;box-shadow:0 4px 12px rgba(36,99,235,0.1)}.stat-box.primary{background:linear-gradient(135deg,#2463EB 0%,#1e40af 100%);border:none;color:#fff}.stat-box.success{background:linear-gradient(135deg,#10b981 0%,#059669 100%);border:none;color:#fff}.stat-label{font-size:14px;opacity:0.8;margin-bottom:8px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em}.stat-value{font-size:48px;font-weight:800;letter-spacing:-0.02em}.title-slide{background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);color:#fff;justify-content:center;align-items:center;text-align:center;border:none}.title-slide .slide-header{color:#fff;font-size:72px;margin-bottom:24px}.title-slide .contentful-text{color:#fff}.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:20px}.detail-section{background:#f8fafc;padding:24px;border-radius:12px;border-left:4px solid #2463EB}.detail-header{font-size:20px;font-weight:700;color:#0f172a;margin-bottom:16px}.detail-item{font-size:16px;color:#475569;margin-bottom:12px;padding-left:20px;position:relative}.detail-item:before{content:'';position:absolute;left:0;top:8px;width:8px;height:8px;background:#2463EB;border-radius:50%}.value-box{background:#fff;border:2px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:16px}.value-label{font-size:14px;color:#64748b;margin-bottom:8px;font-weight:600}.value-amount{font-size:32px;font-weight:800;color:#0f172a}.highlight-box{background:linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%);border:2px solid #10b981;border-radius:12px;padding:24px;margin-top:auto}.highlight-label{font-size:16px;color:#047857;font-weight:600;margin-bottom:8px}.highlight-value{font-size:40px;font-weight:800;color:#065f46}.nav-controls{position:fixed;bottom:40px;right:40px;display:flex;gap:16px;z-index:100}.nav-btn{background:#2463EB;color:#fff;border:none;padding:14px 28px;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif}.nav-btn:hover{background:#1e40af;transform:translateY(-1px);box-shadow:0 4px 12px rgba(36,99,235,0.3)}.nav-btn:disabled{background:#e2e8f0;color:#94a3b8;cursor:not-allowed;transform:none}.print-btn{position:fixed;top:40px;right:40px;background:#10b981;color:#fff;border:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;z-index:100;font-family:'Inter',sans-serif}.print-btn:hover{background:#059669}@media print{body{background:#fff}.slide{display:flex!important;page-break-after:always;box-shadow:none;border-radius:0}.nav-controls,.print-btn{display:none}}</style></head><body><button class="print-btn" onclick="window.print()">Print / Save PDF</button><div class="slide-container"><div class="slide active title-slide"><div class="contentful-logo"><div class="contentful-icon"></div><div class="contentful-text">contentful</div></div><div class="slide-header">ROI Analysis</div><div class="slide-subheader">Business Value Assessment</div><p style="margin-top:32px;font-size:18px;opacity:0.9">Revenue Growth & Operational Efficiency</p></div><div class="slide"><div class="contentful-logo"><div class="contentful-icon"></div><div class="contentful-text">contentful</div></div><div class="slide-header">Executive Summary</div><div class="slide-subheader">Projected 3-Year Business Impact</div><div class="stat-grid"><div class="stat-box success"><div class="stat-label">3-Year ROI</div><div class="stat-value">${roi.toFixed(0)}%</div></div><div class="stat-box success"><div class="stat-label">Payback Period</div><div class="stat-value">${paybackMonths.toFixed(1)} mo</div></div><div class="stat-box primary"><div class="stat-label">Annual Benefit</div><div class="stat-value">${formatCurrency(totalAnnualBenefit)}</div></div><div class="stat-box primary"><div class="stat-label">3-Year Benefit</div><div class="stat-value">${formatCurrency(threeYearBenefit)}</div></div></div><div class="slide-number">2</div></div><div class="slide"><div class="contentful-logo"><div class="contentful-icon"></div><div class="contentful-text">contentful</div></div><div class="slide-header">Value Drivers</div><div class="slide-subheader">Two Key Areas of Impact</div><div class="detail-grid"><div class="detail-section" style="border-left-color:#10b981"><div class="detail-header">💰 Revenue Growth</div><div style="font-size:28px;font-weight:800;color:#059669;margin:16px 0">${formatCurrency(revenue.totalLift)}</div><div class="detail-item">Faster campaign launches</div><div class="detail-item">Higher conversion rates</div><div class="detail-item">Personalized experiences</div><div class="detail-item">Omnichannel delivery</div></div><div class="detail-section" style="border-left-color:#2463EB"><div class="detail-header">⚡ Operational Efficiency</div><div style="font-size:28px;font-weight:800;color:#1e40af;margin:16px 0">${formatCurrency(efficiency.totalSavings)}</div><div class="detail-item">Reduced dev burden</div><div class="detail-item">CMS consolidation</div><div class="detail-item">Marketing self-service</div><div class="detail-item">Automated workflows</div></div></div><div class="slide-number">3</div></div><div class="slide"><div class="contentful-logo"><div class="contentful-icon"></div><div class="contentful-text">contentful</div></div><div class="slide-header">Revenue Growth</div><div class="slide-subheader">${formatCurrency(revenue.totalLift)} Annual Impact</div><div style="margin-top:20px"><div class="value-box"><div class="value-label">Current Annual Revenue</div><div class="value-amount">${formatCurrency(revenue.currentRevenue)}</div></div><div class="value-box"><div class="value-label">Conversion Rate Lift</div><div class="value-amount" style="color:#10b981">+${formatCurrency(revenue.conversionLift)}</div></div><div class="value-box"><div class="value-label">Time-to-Market Value</div><div class="value-amount" style="color:#10b981">+${formatCurrency(revenue.timeToMarketValue)}</div></div><div class="highlight-box"><div class="highlight-label">New Annual Revenue</div><div class="highlight-value">${formatCurrency(revenue.newRevenue)}</div></div></div><div class="slide-number">4</div></div><div class="slide"><div class="contentful-logo"><div class="contentful-icon"></div><div class="contentful-text">contentful</div></div><div class="slide-header">Operational Efficiency</div><div class="slide-subheader">${formatCurrency(efficiency.totalSavings)} Annual Savings</div><div style="margin-top:20px"><div class="value-box"><div class="value-label">Developer Cost Savings</div><div class="value-amount" style="color:#2463EB">${formatCurrency(efficiency.devCostSavings)}</div></div><div class="value-box"><div class="value-label">CMS Consolidation</div><div class="value-amount" style="color:#2463EB">${formatCurrency(efficiency.cmsConsolidationSavings)}</div></div><div class="value-box"><div class="value-label">Marketing Productivity</div><div class="value-amount" style="color:#2463EB">${formatCurrency(efficiency.marketingProductivityGain)}</div></div><div class="highlight-box" style="background:linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%);border-color:#2463EB"><div class="highlight-label" style="color:#1e40af">Total Annual Savings</div><div class="highlight-value" style="color:#1e3a8a">${formatCurrency(efficiency.totalSavings)}</div></div></div><div class="slide-number">5</div></div><div class="slide"><div class="contentful-logo"><div class="contentful-icon"></div><div class="contentful-text">contentful</div></div><div class="slide-header">Investment Summary</div><div class="slide-subheader">3-Year Financial Projection</div><div style="margin-top:20px"><div class="value-box"><div class="value-label">Implementation Cost</div><div class="value-amount">${formatCurrency(inputs.implementationCost)}</div></div><div class="value-box"><div class="value-label">3-Year License Cost</div><div class="value-amount">${formatCurrency(inputs.annualLicenseCost * 3)}</div></div><div class="value-box"><div class="value-label">Total Investment</div><div class="value-amount">${formatCurrency(totalCost)}</div></div><div class="highlight-box"><div class="highlight-label">Net 3-Year Benefit</div><div class="highlight-value">${formatCurrency(netBenefit)}</div></div></div><div class="slide-number">6</div></div><div class="slide"><div class="contentful-logo"><div class="contentful-icon"></div><div class="contentful-text">contentful</div></div><div class="slide-header">Next Steps</div><div class="slide-subheader">Your Path Forward</div><div style="margin-top:40px"><div class="detail-section" style="margin-bottom:24px"><div class="detail-header" style="color:#2463EB">1. Partner</div><div class="detail-item">Understand your pain points and opportunities</div></div><div class="detail-section" style="margin-bottom:24px;border-left-color:#FF6B35"><div class="detail-header" style="color:#FF6B35">2. Evaluate</div><div class="detail-item">Tailor solution to meet your specific needs</div></div><div class="detail-section" style="border-left-color:#10b981"><div class="detail-header" style="color:#10b981">3. Review</div><div class="detail-item">Collaborative business case and proposal</div></div></div><div class="slide-number">7</div></div></div><div class="nav-controls"><button class="nav-btn" onclick="changeSlide(-1)">← Previous</button><button class="nav-btn" onclick="changeSlide(1)">Next →</button></div><script>let currentSlide=0;const slides=document.querySelectorAll('.slide');const navBtns=document.querySelectorAll('.nav-btn');function updateButtons(){navBtns[0].disabled=currentSlide===0;navBtns[1].disabled=currentSlide===slides.length-1}function showSlide(n){slides[currentSlide].classList.remove('active');currentSlide=(n+slides.length)%slides.length;slides[currentSlide].classList.add('active');updateButtons()}function changeSlide(d){showSlide(currentSlide+d)}document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'&&currentSlide>0)changeSlide(-1);if(e.key==='ArrowRight'&&currentSlide<slides.length-1)changeSlide(1)});updateButtons()</script></body></html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'contentful_roi_presentation.html';
    link.click();
  };

  const SliderInput = ({ label, value, onChange, min, max, step, prefix = '', suffix = '', helper, decimals }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-base font-bold text-blue-600">
          {prefix}{decimals !== undefined ? value.toFixed(decimals) : formatNumber(value)}{suffix}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer slider" style={{ background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - min) / (max - min)) * 100}%, #dbeafe ${((value - min) / (max - min)) * 100}%, #dbeafe 100%)` }} />
      {helper && <p className="text-xs text-gray-500">{helper}</p>}
    </div>
  );

  const valueDrivers = [
    { id: 'revenue', name: 'Revenue Growth', icon: TrendingUp },
    { id: 'efficiency', name: 'Operational Efficiency', icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <style>{`.slider::-webkit-slider-thumb{appearance:none;width:20px;height:20px;border-radius:50%;background:#3b82f6;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,0.2);transition:all 0.2s}.slider::-webkit-slider-thumb:hover{transform:scale(1.2);background:#2563eb}.slider::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:#3b82f6;cursor:pointer;border:none;box-shadow:0 2px 4px rgba(0,0,0,0.2);transition:all 0.2s}.slider::-moz-range-thumb:hover{transform:scale(1.2);background:#2563eb}`}</style>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Contentful Value ROI Calculator</h1>
          <p className="text-gray-600">Quantify revenue growth and operational efficiency gains</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
          {valueDrivers.map((driver) => {
            const Icon = driver.icon;
            const isActive = valueDriver === driver.id;
            return (
              <button key={driver.id} onClick={() => setValueDriver(driver.id)} className={`p-6 rounded-xl border-2 transition-all ${isActive ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                <Icon className={`w-8 h-8 mx-auto mb-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <div className={`text-base font-semibold ${isActive ? 'text-blue-900' : 'text-gray-600'}`}>{driver.name}</div>
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 max-h-[800px] overflow-y-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calculator className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />Configure Your Scenario
            </h2>

            <div className="space-y-6">
              {valueDriver === 'revenue' && (
                <>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 mb-4 border border-green-200">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-green-900 mb-2 text-lg">Revenue Growth</h3>
                        <p className="text-sm text-green-800 leading-relaxed">
                          Launch campaigns faster and boost conversions with personalized, omnichannel content delivery.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <SliderInput label="Monthly Website Visitors" value={inputs.monthlyVisitors} onChange={(val) => handleInputChange('monthlyVisitors', val)} min={10000} max={500000} step={10000} />
                    <SliderInput label="Current Conversion Rate" value={inputs.currentConversionRate} onChange={(val) => handleInputChange('currentConversionRate', val)} min={0.01} max={1} step={0.01} suffix="%" decimals={2} />
                    <SliderInput label="Average Revenue per Conversion" value={inputs.avgRevenuePerConversion} onChange={(val) => handleInputChange('avgRevenuePerConversion', val)} min={10000} max={200000} step={5000} prefix="$" />
                    <SliderInput label="Current Campaign Launch Time (Days)" value={inputs.campaignLaunchTime} onChange={(val) => handleInputChange('campaignLaunchTime', val)} min={7} max={90} step={1} helper="Typical time from concept to live" />
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Expected Improvements</h3>
                    <div className="space-y-5">
                      <SliderInput label="Conversion Rate Increase" value={inputs.conversionRateIncrease} onChange={(val) => handleInputChange('conversionRateIncrease', val)} min={10} max={100} step={5} suffix="%" helper="Industry range: 25-78%" />
                      <SliderInput label="Time-to-Market Reduction" value={inputs.timeToMarketReduction} onChange={(val) => handleInputChange('timeToMarketReduction', val)} min={30} max={90} step={5} suffix="%" helper="Launch in days vs weeks" />
                    </div>
                  </div>
                </>
              )}

              {valueDriver === 'efficiency' && (
                <>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 mb-4 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Zap className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-blue-900 mb-2 text-lg">Operational Efficiency</h3>
                        <p className="text-sm text-blue-800 leading-relaxed">
                          Reduce developer burden and empower marketers with self-service tools.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <SliderInput label="Developer Hourly Rate" value={inputs.developerHourlyRate} onChange={(val) => handleInputChange('developerHourlyRate', val)} min={75} max={250} step={5} prefix="$" />
                    <SliderInput label="Monthly Dev Hours on Content Tasks" value={inputs.monthlyDevHoursOnContent} onChange={(val) => handleInputChange('monthlyDevHoursOnContent', val)} min={40} max={400} step={10} helper="Hours on routine updates" />
                    <SliderInput label="Number of CMS Platforms" value={inputs.numberOfCMS} onChange={(val) => handleInputChange('numberOfCMS', val)} min={1} max={10} step={1} />
                    <SliderInput label="Annual CMS Maintenance Cost" value={inputs.cmsMaintenanceCostPerYear} onChange={(val) => handleInputChange('cmsMaintenanceCostPerYear', val)} min={50000} max={500000} step={10000} prefix="$" />
                    <SliderInput label="Marketing Team Size" value={inputs.marketingTeamSize} onChange={(val) => handleInputChange('marketingTeamSize', val)} min={3} max={50} step={1} />
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Expected Improvements</h3>
                    <SliderInput label="Developer Efficiency Gain" value={inputs.devEfficiencyGain} onChange={(val) => handleInputChange('devEfficiencyGain', val)} min={30} max={80} step={5} suffix="%" helper="Typical: 50-80%" />
                  </div>
                </>
              )}

              <div className="border-t pt-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Investment Required</h3>
                <div className="space-y-4">
                  <SliderInput label="Implementation Cost" value={inputs.implementationCost} onChange={(val) => handleInputChange('implementationCost', val)} min={50000} max={500000} step={10000} prefix="$" />
                  <SliderInput label="Annual License Cost" value={inputs.annualLicenseCost} onChange={(val) => handleInputChange('annualLicenseCost', val)} min={25000} max={200000} step={5000} prefix="$" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-6">Total Business Impact</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="text-sm opacity-90 mb-1">Annual Benefit</div>
                  <div className="text-2xl font-bold">{formatCurrency(totalAnnualBenefit)}</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="text-sm opacity-90 mb-1">3-Year Benefit</div>
                  <div className="text-2xl font-bold">{formatCurrency(threeYearBenefit)}</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="text-sm opacity-90 mb-1">3-Year ROI</div>
                  <div className="text-2xl font-bold">{roi.toFixed(0)}%</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="text-sm opacity-90 mb-1">Payback Period</div>
                  <div className="text-2xl font-bold">{paybackMonths.toFixed(1)} mo</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Value Breakdown</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-900">Revenue Growth</span>
                    </div>
                    <span className="text-xl font-bold text-green-600">{formatCurrency(revenue.totalLift)}</span>
                  </div>
                  <div className="text-sm text-gray-600 ml-7">Annual revenue increase</div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">Operational Efficiency</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">{formatCurrency(efficiency.totalSavings)}</span>
                  </div>
                  <div className="text-sm text-gray-600 ml-7">Annual savings</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {valueDriver === 'revenue' ? 'Revenue Impact Details' : 'Efficiency Savings Details'}
              </h3>
              <div className="space-y-3">
                {valueDriver === 'revenue' && (
                  <>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-700">Current Annual Revenue</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(revenue.currentRevenue)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-700">Conversion Rate Lift</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(revenue.conversionLift)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-700">Time-to-Market Value</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(revenue.timeToMarketValue)}</span>
                    </div>
                    <div className="flex justify-between py-3 pt-4">
                      <span className="font-bold text-gray-900">Total Annual Lift</span>
                      <span className="text-xl font-bold text-green-600">{formatCurrency(revenue.totalLift)}</span>
                    </div>
                  </>
                )}

                {valueDriver === 'efficiency' && (
                  <>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-700">Dev Cost Savings</span>
                      <span className="font-semibold text-blue-600">{formatCurrency(efficiency.devCostSavings)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-700">CMS Consolidation</span>
                      <span className="font-semibold text-blue-600">{formatCurrency(efficiency.cmsConsolidationSavings)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-700">Marketing Productivity</span>
                      <span className="font-semibold text-blue-600">{formatCurrency(efficiency.marketingProductivityGain)}</span>
                    </div>
                    <div className="flex justify-between py-3 pt-4">
                      <span className="font-bold text-gray-900">Total Annual Savings</span>
                      <span className="text-xl font-bold text-blue-600">{formatCurrency(efficiency.totalSavings)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Customer Proof Points
              </h3>
              {valueDriver === 'revenue' && (
                <div className="space-y-3 text-sm">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="font-semibold mb-1">Kraft Heinz</div>
                    <div className="opacity-90">78% increase in conversion rates</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="font-semibold mb-1">Ruggable</div>
                    <div className="opacity-90">25% higher conversions, 7x CTR</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="font-semibold mb-1">KFC</div>
                    <div className="opacity-90">43% growth in digital sales</div>
                  </div>
                </div>
              )}
              {valueDriver === 'efficiency' && (
                <div className="space-y-3 text-sm">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="font-semibold mb-1">Audible</div>
                    <div className="opacity-90">80% decrease in production time</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="font-semibold mb-1">Shiseido</div>
                    <div className="opacity-90">50% reduction in costs</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="font-semibold mb-1">BigCommerce</div>
                    <div className="opacity-90">77% more content, 45% fewer tickets</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-lg font-semibold"
            >
              <Download className="w-6 h-6" />
              Export Inputs to CSV
            </button>
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg text-lg font-semibold"
              >
                <Camera className="w-6 h-6" />
                Download Results
              </button>
              {showExportMenu && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 z-50 min-w-[280px]">
                  <button
                    onClick={() => {
                      exportTextSummary();
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100"
                  >
                    <Download className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Text Summary</div>
                      <div className="text-sm text-gray-500">Formatted text file (.txt)</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      exportHTMLPresentation();
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors flex items-center gap-3 rounded-b-lg"
                  >
                    <Camera className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-semibold text-gray-900">HTML Presentation</div>
                      <div className="text-sm text-gray-500">Interactive slides (.html)</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">Download your scenario and results to share with your team</p>
        </div>
      </div>
    </div>
  );
}
