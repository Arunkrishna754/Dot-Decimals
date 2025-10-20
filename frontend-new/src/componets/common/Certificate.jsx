import React, { useState } from 'react';
import { Award, CheckCircle, MessageCircle, X } from 'lucide-react';
import certificate from "../../assets/images/certificate.jpg"

export default function Certificate() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 transition-colors rounded-full p-4 shadow-lg z-50"
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </a>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Award Icon */}
        <div className="bg-yellow-500 rounded-full p-6 mb-8">
          <Award className="w-12 h-12 text-black" />
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-yellow-500 text-center mb-6 leading-tight">
          Recognized by the Government of India under DPIIT
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-300 text-center mb-6 max-w-3xl">
          Officially recognized by Startup India - Department for Promotion of Industry and Internal Trade
        </p>

        {/* Verified Badge */}
        <div className="flex items-center gap-2 text-yellow-500">
          <CheckCircle className="w-6 h-6 fill-yellow-500" />
          <span className="text-lg font-semibold">Verified & Active</span>
        </div>
      </div>

      {/* Certificate Section */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Certificate Container */}
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-3xl p-8 md:p-12 border-4 border-dashed border-blue-400/50 shadow-2xl">
            {/* Certificate Image */}
            <div 
              className="rounded-xl overflow-hidden shadow-2xl md:cursor-default cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <img 
                src={certificate}
                alt="DPIIT Certificate of Recognition for DOTS&DECIMALS INFOTECH LLP"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Mobile */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
          >
            <X className="w-8 h-8 text-white" />
          </button>

          {/* Certificate Image in Modal */}
          <div 
            className="max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={certificate}
              alt="DPIIT Certificate of Recognition for DOTS&DECIMALS INFOTECH LLP"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}