import React, { useState } from 'react';
import { DollarSign, TrendingUp, Zap, Calculator } from 'lucide-react';

export default function App() {
  const [valueDriver, setValueDriver] = useState('revenue');
  const [inputs, setInputs] = useState({
    monthlyVisitors: 50000,
    currentConversionRate: 0.1,
    avgRevenuePerConversion: 5000,
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
    { id: 'revenue', name: 'Revenue Growth', icon: TrendingUp, color: 'green' },
    { id: 'efficiency', name: 'Operational Efficiency', icon: Zap, color: 'blue' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <style>{`.slider::-webkit-slider-thumb { appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #3b82f6; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: all 0.2s; } .slider::-webkit-slider-thumb:hover { transform: scale(1.2); background: #2563eb; } .slider::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: #3b82f6; cursor: pointer; border: none; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: all 0.2s; } .slider::-moz-range-thumb:hover { transform: scale(1.2); background: #2563eb; }`}</style>

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
              <Calculator className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />Configure Your Scenario</h2>

            <div className="space-y-6">
              {valueDriver === 'revenue' && (
                <>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 mb-4 border border-green-200">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-green-900 mb-2 text-lg">Revenue Growth</h3>
                        <p className="text-sm text-green-800 leading-relaxed">
                          Launch campaigns faster and boost conversions with personalized, omnichannel content delivery. Contentful empowers marketing teams to capture market opportunities and drive measurable revenue growth.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <SliderInput label="Monthly Website Visitors" value={inputs.monthlyVisitors} onChange={(val) => handleInputChange('monthlyVisitors', val)} min={10000} max={500000} step={10000} />
                    <SliderInput label="Current Conversion Rate" value={inputs.currentConversionRate} onChange={(val) => handleInputChange('currentConversionRate', val)} min={0.01} max={1} step={0.01} suffix="%" decimals={2} />
                    <SliderInput label="Average Revenue per Conversion" value={inputs.avgRevenuePerConversion} onChange={(val) => handleInputChange('avgRevenuePerConversion', val)} min={500} max={20000} step={500} prefix="$" />
                    <SliderInput label="Current Campaign Launch Time (Days)" value={inputs.campaignLaunchTime} onChange={(val) => handleInputChange('campaignLaunchTime', val)} min={7} max={90} step={1} helper="Typical time from concept to live" />
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Expected Improvements</h3>
                    <div className="space-y-5">
                      <SliderInput label="Conversion Rate Increase" value={inputs.conversionRateIncrease} onChange={(val) => handleInputChange('conversionRateIncrease', val)} min={10} max={100} step={5} suffix="%" helper="Industry range: 25-78% (Kraft Heinz achieved 78%)" />
                      <SliderInput label="Time-to-Market Reduction" value={inputs.timeToMarketReduction} onChange={(val) => handleInputChange('timeToMarketReduction', val)} min={30} max={90} step={5} suffix="%" helper="Launch campaigns in days instead of weeks" />
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
                          Reduce developer burden, consolidate multiple CMS platforms, and empower marketers with self-service tools. Free your technical teams to focus on innovation while marketing moves faster.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <SliderInput label="Developer Hourly Rate" value={inputs.developerHourlyRate} onChange={(val) => handleInputChange('developerHourlyRate', val)} min={75} max={250} step={5} prefix="$" />
                    <SliderInput label="Monthly Dev Hours on Content Tasks" value={inputs.monthlyDevHoursOnContent} onChange={(val) => handleInputChange('monthlyDevHoursOnContent', val)} min={40} max={400} step={10} helper="Hours spent on routine content updates & changes" />
                    <SliderInput label="Number of CMS Platforms" value={inputs.numberOfCMS} onChange={(val) => handleInputChange('numberOfCMS', val)} min={1} max={10} step={1} helper="Separate systems across brands, regions, or channels" />
                    <SliderInput label="Annual CMS Maintenance Cost" value={inputs.cmsMaintenanceCostPerYear} onChange={(val) => handleInputChange('cmsMaintenanceCostPerYear', val)} min={50000} max={500000} step={10000} prefix="$" helper="Licensing, hosting, support across all platforms" />
                    <SliderInput label="Marketing Team Size" value={inputs.marketingTeamSize} onChange={(val) => handleInputChange('marketingTeamSize', val)} min={3} max={50} step={1} />
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Expected Improvements</h3>
                    <div className="space-y-5">
                      <SliderInput label="Developer Efficiency Gain" value={inputs.devEfficiencyGain} onChange={(val) => handleInputChange('devEfficiencyGain', val)} min={30} max={80} step={5} suffix="%" helper="Typical range: 50-80% reduction in dev time on content" />
                    </div>
                  </div>
                </>
              )}

              <div className="border-t pt-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Investment Required</h3>
                <div className="space-y-4">
                  <SliderInput label="Implementation Cost" value={inputs.implementationCost} onChange={(val) => handleInputChange('implementationCost', val)} min={50000} max={500000} step={10000} prefix="$" helper="One-time setup, integration, and migration" />
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
                  <div className="text-sm text-gray-600 ml-7">Annual revenue increase from improved conversions and faster launches</div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">Operational Efficiency</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">{formatCurrency(efficiency.totalSavings)}</span>
                  </div>
                  <div className="text-sm text-gray-600 ml-7">Annual savings from reduced developer time and consolidated systems</div>
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
                      <span className="text-gray-700">New Annual Revenue</span>
                      <span className="font-semibold text-green-600">{formatCurrency(revenue.newRevenue)}</span>
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
                      <span className="font-bold text-gray-900">Total Annual Revenue Lift</span>
                      <span className="text-xl font-bold text-green-600">{formatCurrency(revenue.totalLift)}</span>
                    </div>
                  </>
                )}

                {valueDriver === 'efficiency' && (
                  <>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-700">Current Annual Dev Cost</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(efficiency.currentDevCost)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-700">Developer Cost Savings</span>
                      <span className="font-semibold text-blue-600">{formatCurrency(efficiency.devCostSavings)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-700">CMS Consolidation Savings</span>
                      <span className="font-semibold text-blue-600">{formatCurrency(efficiency.cmsConsolidationSavings)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-700">Marketing Productivity Value</span>
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
                    <div className="opacity-90">78% increase in conversion rates for flagship brands</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="font-semibold mb-1">Ruggable</div>
                    <div className="opacity-90">25% higher conversions with personalized content, 7x click-through rate</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="font-semibold mb-1">KFC</div>
                    <div className="opacity-90">43% growth in digital sales across 150+ country sites</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="font-semibold mb-1">On Running</div>
                    <div className="opacity-90">40% of sales direct-to-consumer, expanded to 7 languages</div>
                  </div>
                </div>
              )}
              {valueDriver === 'efficiency' && (
                <div className="space-y-3 text-sm">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="font-semibold mb-1">Audible</div>
                    <div className="opacity-90">80% decrease in content production time</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="font-semibold mb-1">Shiseido Professional</div>
                    <div className="opacity-90">50% reduction in content management costs through consolidation</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="font-semibold mb-1">Costa Coffee</div>
                    <div className="opacity-90">Launched 15 localized websites, each built in just 15 minutes</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="font-semibold mb-1">BigCommerce</div>
                    <div className="opacity-90">77% more content published, 45% fewer dev backlog tickets</div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
              <h3 className="font-bold text-slate-900 mb-3">Investment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-300">
                  <span className="text-slate-600">Implementation Cost</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(inputs.implementationCost)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-300">
                  <span className="text-slate-600">3-Year License Cost</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(inputs.annualLicenseCost * 3)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-300">
                  <span className="text-slate-600">Total 3-Year Investment</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(totalCost)}</span>
                </div>
                <div className="flex justify-between py-3 pt-4">
                  <span className="font-bold text-slate-900">Net 3-Year Benefit</span>
                  <span className="text-xl font-bold text-green-600">{formatCurrency(netBenefit)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">About This Calculator</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            This ROI calculator is based on Contentful's proven Value Messaging Framework and real customer outcomes. Contentful's composable content platform enables enterprises to launch campaigns 60-80% faster, increase conversion rates by 25-78%, and reduce operational costs by consolidating legacy systems while freeing developers to focus on innovation.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Revenue Growth Drivers</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Faster time-to-market for campaigns</li>
                <li>• Higher conversion rates with personalization</li>
                <li>• Omnichannel content delivery</li>
                <li>• Native A/B testing and experimentation</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Efficiency Improvement Drivers</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Self-service marketing tools reduce dev burden</li>
                <li>• Consolidate multiple CMS platforms</li>
                <li>• Reusable content components</li>
                <li>• 30% marketing productivity gain</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500 leading-relaxed">
              <strong>Key Differentiators:</strong> Composable API-first platform • Native personalization & experimentation • 110+ marketplace integrations • Powers 30% of Fortune 500 • 99.99% uptime SLA • ISO 27001 & SOC 2 Type II certified
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
