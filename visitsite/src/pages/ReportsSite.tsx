import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '../contexts/ReportsContext';
import { ArrowLeftIcon, FileBarChartIcon, DownloadIcon, TrendingUpIcon, CalendarIcon, TrendingDownIcon, MinusIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
export function ReportsSite() {
  const navigate = useNavigate();
  const {
    annualReports,
    impactReports,
    sustainabilityMetrics
  } = useReports();
  const COLORS = ['#ef4444', '#f97316', '#ec4899', '#f59e0b'];
  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon className="w-4 h-4" />;
      case 'down':
        return <TrendingDownIcon className="w-4 h-4" />;
      default:
        return <MinusIcon className="w-4 h-4" />;
    }
  };
  const getTrendColor = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  return <div className="min-h-screen w-full bg-gradient-to-br from-red-50 via-orange-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-500 via-orange-500 to-pink-600 min-h-[80vh] flex items-center">
      
          {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url("https://uploadthingy.s3.us-west-1.amazonaws.com/gJp1KQqEMR9gQeGQHfFqDw/DJI_0346.jpg-2.webp")`
      }} />
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center z-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white hover:text-white/80 transition-colors bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Home
            </button>
          <div className="inline-block mb-8">
            <div className="bg-white/20 backdrop-blur-sm p-8 rounded-full">
              <FileBarChartIcon className="w-20 h-20 text-white" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Sustainability Reports
          </h1>
          <p className="text-2xl text-red-100 max-w-3xl mx-auto mb-12 drop-shadow-md">
            Transparent reporting on our environmental impact and sustainability
            progress
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white/20 backdrop-blur-sm px-8 py-6 rounded-2xl">
              <p className="text-white font-semibold">
                <span className="text-4xl block mb-1">
                  {annualReports.length}
                </span>
                Annual Reports
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-8 py-6 rounded-2xl">
              <p className="text-white font-semibold">
                <span className="text-4xl block mb-1">
                  {impactReports.length}
                </span>
                Impact Reports
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-8 py-6 rounded-2xl">
              <p className="text-white font-semibold">
                <span className="text-4xl block mb-1">
                  {sustainabilityMetrics.length}
                </span>
                Metric Reports
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Annual Reports */}
      {annualReports.length > 0 && <div className="py-24 bg-gradient-to-b from-red-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-5xl font-bold text-gray-800 mb-12 text-center">
              Annual Sustainability Reports
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {annualReports.map(report => <div key={report.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2">
                  {report.coverImage && <div className="relative h-64">
                      <img src={report.coverImage} alt={report.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white">
                          {report.title}
                        </h3>
                      </div>
                    </div>}
                  <div className="p-8">
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {report.description}
                    </p>
                    {/* Display Videos */}
                    {Array.isArray(report.videos) && report.videos.length > 0 && (
                        <div className="mb-6">
                          {report.videos.map((video, idx) => (
                            <video
                              key={idx}
                              src={video}
                              controls
                              className="w-full rounded-lg shadow-lg mb-4"
                            />
                          ))}
                        </div>
                      )}
                    {report.metrics && report.metrics.length > 0 && <>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          {report.metrics.map((metric, idx) => <div key={idx} className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">
                                {metric.label}
                              </p>
                              <p className="text-2xl font-bold text-red-600">
                                {metric.value}
                              </p>
                              {metric.change && <p className={`text-sm flex items-center gap-1 mt-1 ${getTrendColor(metric.trend)}`}>
                                  {getTrendIcon(metric.trend)}
                                  {metric.change}
                                </p>}
                            </div>)}
                        </div>
                        {/* Bar Chart */}
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-gray-800 mb-3">
                            Metrics Overview
                          </h4>
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={report.metrics}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="label" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="value" fill="#ef4444" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </>}
                    <div className="flex items-center justify-between">
                      <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        {report.year}
                      </span>
                      {report.files && report.files.length > 0 ? <a href={report.files[0].url} download={report.files[0].name || undefined} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
                        <DownloadIcon className="w-4 h-4" />
                        Download
                      </a> : <button disabled className="flex items-center gap-2 bg-gray-200 text-gray-500 px-6 py-2 rounded-lg font-semibold">
                        <DownloadIcon className="w-4 h-4" />
                        No File
                      </button>}
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>}
      {/* Impact Reports */}
      {impactReports.length > 0 && <div className="py-24 bg-gradient-to-b from-orange-50 to-pink-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-5xl font-bold text-gray-800 mb-12 text-center">
              Environmental Impact Reports
            </h2>
            <div className="grid grid-cols-1 gap-8">
              {impactReports.map(report => <div key={report.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    {report.coverImage && <div className="relative h-80 lg:h-auto">
                        <img src={report.coverImage} alt={report.title} className="w-full h-full object-cover" />
                      </div>}
                    <div className="p-8 flex flex-col justify-center">
                      <h3 className="text-3xl font-bold text-gray-800 mb-4">
                        {report.title}
                      </h3>
                      <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                        {report.description}
                      </p>
                      {report.metrics && report.metrics.length > 0 && <>
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            {report.metrics.map((metric, idx) => <div key={idx} className="bg-gradient-to-br from-orange-50 to-pink-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">
                                  {metric.label}
                                </p>
                                <p className="text-2xl font-bold text-orange-600">
                                  {metric.value}
                                </p>
                              </div>)}
                          </div>
                          {/* Line Chart */}
                          <div className="mb-6">
                            <ResponsiveContainer width="100%" height={200}>
                              <LineChart data={report.metrics}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </>}
                      {report.files && report.files.length > 0 ? <a href={report.files[0].url} download={report.files[0].name || undefined} target="_blank" rel="noreferrer" className="self-start flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                        <DownloadIcon className="w-5 h-5" />
                        Download Report
                      </a> : <button disabled className="self-start flex items-center gap-2 bg-gray-200 text-gray-500 px-8 py-3 rounded-lg font-semibold">
                        <DownloadIcon className="w-5 h-5" />
                        No File
                      </button>}
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>}
      {/* Sustainability Metrics with Pie Chart */}
      {sustainabilityMetrics.length > 0 && <div className="py-24 bg-gradient-to-b from-pink-50 to-red-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-5xl font-bold text-gray-800 mb-12 text-center">
              Sustainability Metrics Dashboard
            </h2>
            <div className="grid grid-cols-1 gap-8">
              {sustainabilityMetrics.map(report => <div key={report.id} className="bg-white rounded-2xl shadow-xl p-8">
                  {report.coverImage && <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                      <img src={report.coverImage} alt={report.title} onError={e => (e.currentTarget.src = 'https://via.placeholder.com/1200x400?text=No+image')} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-4 left-6">
                        <h3 className="text-2xl font-bold text-white">{report.title}</h3>
                      </div>
                    </div>}
                  {!report.coverImage && <h3 className="text-3xl font-bold text-gray-800 mb-4">{report.title}</h3>}
                  <p className="text-gray-600 mb-8">{report.description}</p>
                  {report.metrics && report.metrics.length > 0 && <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Pie Chart */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                          Metrics Distribution
                        </h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie data={report.metrics.map(m => ({
                      name: m.label,
                      value: parseFloat(String(m.value).replace(/[^0-9.]/g, '')) || 0
                    }))} cx="50%" cy="50%" labelLine={false} label={entry => entry.name} outerRadius={100} fill="#8884d8" dataKey="value">
                              {report.metrics.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {report.metrics.map((metric, idx) => <div key={idx} className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">
                              {metric.label}
                            </p>
                            <p className="text-2xl font-bold text-red-600">
                              {metric.value}
                            </p>
                            {metric.change && <p className={`text-sm flex items-center gap-1 mt-1 ${getTrendColor(metric.trend)}`}>
                                {getTrendIcon(metric.trend)}
                                {metric.change}
                              </p>}
                          </div>)}
                      </div>
                    </div>}
                  {/* Download link for sustainability metric file (if present) */}
                  <div className="mt-6">
                    {report.files && report.files.length > 0 ? <a href={report.files[0].url} download={report.files[0].name || undefined} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                        <DownloadIcon className="w-4 h-4" />
                        Download Report
                      </a> : <button disabled className="inline-flex items-center gap-2 bg-gray-200 text-gray-500 px-6 py-3 rounded-lg font-semibold">
                        <DownloadIcon className="w-4 h-4" />
                        No File
                      </button>}
                  </div>
                </div>)}
            </div>
          </div>
        </div>}
      {/* Call to Action */}
      <div className="py-24 bg-gradient-to-br from-red-500 via-orange-500 to-pink-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Stay Informed
          </h2>
          <p className="text-2xl text-red-100 mb-8 drop-shadow-md">
            Subscribe to receive our latest sustainability reports and updates
          </p>
          <button className="bg-white text-red-600 px-12 py-5 rounded-full font-bold text-xl hover:shadow-2xl transition-all transform hover:scale-110">
            Subscribe Now
          </button>
        </div>
      </div>
    </div>;
}