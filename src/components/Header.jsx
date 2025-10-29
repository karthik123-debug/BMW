import React from 'react';
export default function Header() {
  return (
    <header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Vahan Bazar</h1>
      <nav className="space-x-4">
        <a href="#" className="hover:underline">Home</a>
        <a href="#" className="hover:underline">Listings</a>
        <a href="#" className="hover:underline">Sell</a>
      </nav>
    </header>
  );
}
