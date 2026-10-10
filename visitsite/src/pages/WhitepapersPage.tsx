import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, FileTextIcon, DownloadIcon, SearchIcon, FilterIcon, CalendarIcon, TagIcon, ExternalLinkIcon } from 'lucide-react';
interface Whitepaper {
  id: string;
  title: string;
  description: string;
  category: string;
  sdgGoals: number[];
  year: string;
  fileUrl: string;
  fileSize: string;
  thumbnail?: string;
}
export function WhitepapersPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSDG, setSelectedSDG] = useState<number | null>(null);
  // Sample data - this will be replaced with actual data from context
  const whitepapers: Whitepaper[] = [{
    id: '1',
    title: 'SIMATS Sustainability Report 2024',
    description: 'Comprehensive overview of our sustainability initiatives, achievements, and future goals across all UN SDG targets.',
    category: 'Annual Report',
    sdgGoals: [3, 4, 7, 11, 13],
    year: '2024',
    fileUrl: '#',
    fileSize: '5.2 MB',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'
  }, {
    id: '2',
    title: 'Climate Action Framework',
    description: 'Detailed strategy for achieving carbon neutrality by 2030, including renewable energy adoption and waste reduction programs.',
    category: 'Policy Document',
    sdgGoals: [7, 13],
    year: '2024',
    fileUrl: '#',
    fileSize: '3.8 MB',
    thumbnail: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop'
  }, {
    id: '3',
    title: 'Research Impact Assessment',
    description: 'Analysis of SIMATS research contributions to sustainable development and social impact across various disciplines.',
    category: 'Research Paper',
    sdgGoals: [3, 4, 9],
    year: '2023',
    fileUrl: '#',
    fileSize: '4.5 MB',
    thumbnail: 'https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=400&h=300&fit=crop'
  }];
  const categories = ['all', 'Annual Report', 'Policy Document', 'Research Paper', 'Case Study'];
  const sdgGoals = [{
    number: 1,
    title: 'No Poverty'
  }, {
    number: 2,
    title: 'Zero Hunger'
  }, {
    number: 3,
    title: 'Good Health'
  }, {
    number: 4,
    title: 'Quality Education'
  }, {
    number: 5,
    title: 'Gender Equality'
  }, {
    number: 6,
    title: 'Clean Water'
  }, {
    number: 7,
    title: 'Clean Energy'
  }, {
    number: 8,
    title: 'Economic Growth'
  }, {
    number: 9,
    title: 'Innovation'
  }, {
    number: 10,
    title: 'Reduced Inequalities'
  }, {
    number: 11,
    title: 'Sustainable Cities'
  }, {
    number: 12,
    title: 'Responsible Consumption'
  }, {
    number: 13,
    title: 'Climate Action'
  }, {
    number: 14,
    title: 'Life Below Water'
  }, {
    number: 15,
    title: 'Life on Land'
  }, {
    number: 16,
    title: 'Peace & Justice'
  }, {
    number: 17,
    title: 'Partnerships'
  }];
  const filteredWhitepapers = whitepapers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) || paper.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || paper.category === selectedCategory;
    const matchesSDG = selectedSDG === null || paper.sdgGoals.includes(selectedSDG);
    return matchesSearch && matchesCategory && matchesSDG;
  });
  return <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-8">
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Home
          </button>
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <FileTextIcon className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-5xl font-bold mb-2">
                  Whitepapers & Publications
                </h1>
                <p className="text-xl text-blue-100">
                  SIMATS Sustainability Research and Policy Documents
                </p>
              </div>
            </div>
            <p className="text-lg text-white/90 max-w-3xl">
              Access our comprehensive collection of sustainability reports,
              research papers, and policy documents aligned with the UN
              Sustainable Development Goals.
            </p>
          </motion.div>
        </div>
      </div>
      {/* Filters Section */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search whitepapers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            {/* Category Filter */}
            <div className="relative">
              <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                {categories.map(cat => <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>)}
              </select>
            </div>
            {/* SDG Filter */}
            <div className="relative">
              <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select value={selectedSDG || ''} onChange={e => setSelectedSDG(e.target.value ? Number(e.target.value) : null)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                <option value="">All SDG Goals</option>
                {sdgGoals.map(goal => <option key={goal.number} value={goal.number}>
                    SDG {goal.number}: {goal.title}
                  </option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Whitepapers Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {filteredWhitepapers.length}{' '}
            {filteredWhitepapers.length === 1 ? 'Document' : 'Documents'} Found
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWhitepapers.map((paper, index) => <motion.div key={paper.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.1
        }} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow group">
              {/* Thumbnail */}
              {paper.thumbnail && <div className="relative h-48 overflow-hidden">
                  <img src={paper.thumbnail} alt={paper.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-900">
                      {paper.category}
                    </span>
                  </div>
                </div>}
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {paper.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {paper.description}
                </p>
                {/* SDG Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {paper.sdgGoals.map(goal => <span key={goal} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      SDG {goal}
                    </span>)}
                </div>
                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    {paper.year}
                  </div>
                  <div className="flex items-center gap-2">
                    <FileTextIcon className="w-4 h-4" />
                    {paper.fileSize}
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button onClick={() => window.open(paper.fileUrl, '_blank')} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    <DownloadIcon className="w-4 h-4" />
                    Download
                  </button>
                  <button onClick={() => window.open(paper.fileUrl, '_blank')} className="px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    <ExternalLinkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>)}
        </div>
        {filteredWhitepapers.length === 0 && <div className="text-center py-16">
            <FileTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No documents found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search query
            </p>
          </div>}
      </div>
      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl text-white/90 mb-8">
            Subscribe to receive notifications about new publications and
            sustainability reports
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none" />
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>;
}