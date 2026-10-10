import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAchievement } from '../contexts/AchievementContext';
import { ArrowLeftIcon, TrophyIcon, AwardIcon, BarChart3Icon, StarIcon, CalendarIcon, BuildingIcon, XIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
export function AchievementSite() {
  const navigate = useNavigate();
  const {
    awards,
    certifications,
    rankings,
    recognition
  } = useAchievement();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageGallery, setImageGallery] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Filter out hidden items
  const visibleAwards = awards.filter(item => item.isVisible !== false);
  const visibleCertifications = certifications.filter(item => item.isVisible !== false);
  const visibleRankings = rankings.filter(item => item.isVisible !== false);
  const visibleRecognition = recognition.filter(item => item.isVisible !== false);
  const openImageModal = (images: string[], startIndex: number) => {
    setImageGallery(images);
    setCurrentImageIndex(startIndex);
    setSelectedImage(images[startIndex]);
  };
  const closeImageModal = () => {
    setSelectedImage(null);
    setImageGallery([]);
  };
  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % imageGallery.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(imageGallery[newIndex]);
  };
  const prevImage = () => {
    const newIndex = (currentImageIndex - 1 + imageGallery.length) % imageGallery.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(imageGallery[newIndex]);
  };
  const totalAchievements = visibleAwards.length + visibleCertifications.length + visibleRankings.length + visibleRecognition.length;
  return <div className="min-h-screen w-full bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
      {/* Image Modal */}
      {selectedImage && <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closeImageModal}>
          <button onClick={closeImageModal} className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2">
            <XIcon className="w-8 h-8" />
          </button>
          {imageGallery.length > 1 && <>
              <button onClick={e => {
          e.stopPropagation();
          prevImage();
        }} className="absolute left-4 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3">
                <ChevronLeftIcon className="w-12 h-12" />
              </button>
              <button onClick={e => {
          e.stopPropagation();
          nextImage();
        }} className="absolute right-4 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3">
                <ChevronRightIcon className="w-12 h-12" />
              </button>
            </>}
          <img src={selectedImage} alt="Full size" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" onClick={e => e.stopPropagation()} />
        </div>}
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[80vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url("https://uploadthingy.s3.us-west-1.amazonaws.com/xuRoBm337RVUbvoPEdtMGP/sail.JPG.webp")`
      }} />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center z-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white hover:text-white/80 transition-colors mb-12 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Home
          </button>
          <div className="inline-block mb-8">
            <div className="bg-white/20 backdrop-blur-sm p-8 rounded-full animate-bounce">
              <TrophyIcon className="w-20 h-20 text-white" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Our Achievements
          </h1>
          <p className="text-2xl text-yellow-100 max-w-3xl mx-auto mb-12 drop-shadow-md">
            Celebrating excellence in sustainability and environmental
            stewardship
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white/20 backdrop-blur-sm px-8 py-6 rounded-2xl hover:scale-110 transition-transform">
              <p className="text-white font-semibold">
                <span className="text-4xl block mb-1">{totalAchievements}</span>
                Total Achievements
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-8 py-6 rounded-2xl hover:scale-110 transition-transform">
              <p className="text-white font-semibold">
                <span className="text-4xl block mb-1">
                  {visibleAwards.length}
                </span>
                Awards Won
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-8 py-6 rounded-2xl hover:scale-110 transition-transform">
              <p className="text-white font-semibold">
                <span className="text-4xl block mb-1">
                  {visibleCertifications.length}
                </span>
                Certifications
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Awards Section */}
      {visibleAwards.length > 0 && <div className="py-24 bg-gradient-to-b from-yellow-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-block bg-yellow-100 p-6 rounded-2xl mb-6">
                <TrophyIcon className="w-12 h-12 text-yellow-600" />
              </div>
              <h2 className="text-5xl font-bold text-gray-800 mb-4">
                Awards & Recognition
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {visibleAwards.map(award => <div key={award.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2">
                  {award.images && award.images.length > 0 && <div className="relative h-64 cursor-pointer" onClick={() => openImageModal(award.images!, 0)}>
                      <img src={award.images[0]} alt={award.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      {award.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {award.description}
                    </p>
                    {/* Display Videos */}
                    {award.videos && award.videos.length > 0 && <div className="mb-6">
                        {award.videos.map((video, idx) => <video key={idx} src={video} controls className="w-full rounded-lg shadow-lg mb-4" />)}
                      </div>}
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        {award.year}
                      </span>
                      {award.organization && <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold flex items-center gap-2">
                          <BuildingIcon className="w-4 h-4" />
                          {award.organization}
                        </span>}
                      {award.rank && <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                          {award.rank}
                        </span>}
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>}
      {/* Certifications Section */}
      {visibleCertifications.length > 0 && <div className="py-24 bg-gradient-to-b from-orange-50 to-amber-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-block bg-orange-100 p-6 rounded-2xl mb-6">
                <AwardIcon className="w-12 h-12 text-orange-600" />
              </div>
              <h2 className="text-5xl font-bold text-gray-800 mb-4">
                Certifications
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {visibleCertifications.map(cert => <div key={cert.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2">
                  {cert.images && cert.images.length > 0 && <div className="relative h-64 cursor-pointer" onClick={() => openImageModal(cert.images!, 0)}>
                      <img src={cert.images[0]} alt={cert.title} className="w-full h-full object-cover" />
                    </div>}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      {cert.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {cert.description}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                        {cert.category}
                      </span>
                      <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                        {cert.year}
                      </span>
                      {cert.score && <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          Score: {cert.score}
                        </span>}
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>}
      {/* Rankings Section */}
      {visibleRankings.length > 0 && <div className="py-24 bg-gradient-to-b from-amber-50 to-yellow-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-block bg-amber-100 p-6 rounded-2xl mb-6">
                <BarChart3Icon className="w-12 h-12 text-amber-600" />
              </div>
              <h2 className="text-5xl font-bold text-gray-800 mb-4">
                Rankings & Standings
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {visibleRankings.map(ranking => <div key={ranking.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    {ranking.images && ranking.images.length > 0 && <div className="relative h-80 lg:h-auto cursor-pointer" onClick={() => openImageModal(ranking.images!, 0)}>
                        <img src={ranking.images[0]} alt={ranking.title} className="w-full h-full object-cover" />
                      </div>}
                    <div className="p-8 flex flex-col justify-center">
                      <h3 className="text-3xl font-bold text-gray-800 mb-4">
                        {ranking.title}
                      </h3>
                      <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                        {ranking.description}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {ranking.rank && <span className="px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-full text-lg font-bold shadow-lg">
                            Rank: {ranking.rank}
                          </span>}
                        {ranking.score && <span className="px-6 py-3 bg-blue-100 text-blue-700 rounded-full text-lg font-semibold">
                            {ranking.score}
                          </span>}
                        <span className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full text-lg font-semibold">
                          {ranking.year}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>}
      {/* Call to Action */}
      <div className="py-24 bg-gradient-to-br from-yellow-500 via-orange-500 to-amber-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <StarIcon className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
          <h2 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Join Our Journey to Excellence
          </h2>
          <p className="text-2xl text-yellow-100 mb-8 drop-shadow-md">
            Together, we continue to set new standards in sustainability and
            environmental leadership
          </p>
          <button className="bg-white text-orange-600 px-12 py-5 rounded-full font-bold text-xl hover:shadow-2xl transition-all transform hover:scale-110">
            Learn More About Our Impact
          </button>
        </div>
      </div>
    </div>;
}