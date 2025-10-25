import React, { useState } from 'react';
import { Award, CheckCircle, MessageCircle, X } from 'lucide-react';
import certificate from "../../assets/images/certificate.jpg"
import verified from "../../assets/images/verified.png"
import badge from "../../assets/images/badge.png"

export default function Certificate() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* WhatsApp Button */}
      {/* 
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 transition-colors rounded-full p-4 shadow-lg z-50"
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </a> */}

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Award Icon */}
        <img
          src={badge}
          alt="Award"
          className="w-24 h-24 object-contain"
        />

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-center mb-6 leading-tight 
  bg-gradient-to-r from-[#EDCC5B] to-[#F1b223] text-transparent bg-clip-text 
  max-w-6xl mx-auto">
          Recognized by the Government of India under DPIIT
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-300 text-center mb-6 max-w-2xl">
          Officially recognized by Startup India - Department for Promotion of Industry and Internal Trade
        </p>

        {/* Verified Badge */}
        <div className="flex items-center gap-2 text-[#EBD36B]">
          <img
            src={verified}
            alt="check"
            className="w-8 h-8 object-contain"
          />
          <span className="text-lg font-semibold">Verified & Active</span>
        </div>
      </div>

      {/* Certificate Section */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-8 px-8 w-[95%] mx-auto rounded-3xl border-2 border-[#585741]">
        <div className="max-w-7xl mx-auto">
          {/* Certificate Container */}
          <div className="bg-[#17202E] p-8 md:p-12 sm:p-0.5 border-2 border-dashed border-[#585741] shadow-2xl rounded-2xl">      
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
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="fixed top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-[101]"
          >
            <X className="w-8 h-8 text-white" />
          </button>

          {/* Certificate Image in Modal */}
          <div
            className="relative max-w-4xl w-full my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={certificate}
              alt="DPIIT Certificate of Recognition for DOTS&DECIMALS INFOTECH LLP"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}