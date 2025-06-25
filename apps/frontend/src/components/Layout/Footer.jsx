import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-center text-sm text-gray-600">
          © {new Date().getFullYear()} CampaignHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}