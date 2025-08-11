import React from 'react';
import { FaApple, FaGooglePlay, FaCcPaypal, FaCcMastercard, FaCcAmex } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-10 p-6 ">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Text and App Link */}
        <div className="flex flex-col gap-2 w-full lg:w-1/3">
          <h2 className="font-semibold text-lg">Get the FreshCart app</h2>
          <p className="text-gray-600 text-sm">We will send you a link, open it on your phone to download the app.</p>
          <div className="flex">
            <input type="email" placeholder="Email.." className="px-4 py-2 border border-gray-300 rounded-l-md w-full" />
            <button className="bg-green-600 text-white px-4 py-2 rounded-r-md">Share App Link</button>
          </div>
        </div>

        {/* App Store Icons */}
        <div className="flex items-center gap-4 w-full lg:w-1/3 justify-center">
          <a href="#"><FaApple size={32} className="text-black" /></a>
          <a href="#"><FaGooglePlay size={32} className="text-green-600" /></a>
        </div>

        {/* Payment Methods */}
        <div className="flex items-center gap-4 w-full lg:w-1/3 justify-end">
          <FaCcPaypal size={32} />
          <FaCcMastercard size={32} />
          <FaCcAmex size={32} />
        </div>
      </div>
    </footer>
  );
}
