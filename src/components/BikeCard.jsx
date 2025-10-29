import React from 'react';
export default function BikeCard({ bike }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <img src={bike.image} alt={bike.name} className="rounded-md mb-2 w-full h-40 object-cover" />
      <h2 className="text-lg font-semibold">{bike.name}</h2>
      <p className="text-gray-600">{bike.brand}</p>
      <p className="font-bold text-indigo-600 mt-2">₹{bike.price.toLocaleString()}</p>
    </div>
  );
}
