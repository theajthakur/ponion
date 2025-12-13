import { Button } from "@mui/material";
import React from "react";

const RestaurantCard = ({ data }) => {
  const { name, address, rating, banner, owner, createdAt, updatedAt } = data;
  if (!name || !banner) return <h1>No Data</h1>;

  const formatDate = (isoDate) => new Date(isoDate).toLocaleString();

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <img src={banner} alt={name} className="w-full h-56 object-cover" />
      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
          <p className="text-sm text-gray-500">Rating: {rating} ⭐</p>
        </div>

        <div>
          <h3 className="text-md font-medium text-gray-700">Address</h3>
          <p className="text-sm text-gray-600">{address.raw}</p>
          <p className="text-xs text-gray-400 my-2">
            <Button
              variant="contained"
              onClick={() => {
                window.open(
                  `https://www.google.com/maps?q=${address.lat},${address.lng}`
                );
              }}
            >
              View in Map
            </Button>
          </p>
        </div>

        <div>
          <h3 className="text-md font-medium text-gray-700">Owner</h3>
          <p className="text-sm text-gray-600">Name: {owner.name}</p>
          <p className="text-sm text-gray-600">Email: {owner.email}</p>
          <p className="text-sm text-gray-600">Gender: {owner.gender}</p>
          <p className="text-sm text-gray-600">Status: {owner.status}</p>
        </div>
        <div className="text-xs text-gray-400 border-t pt-2">
          <p>Created: {formatDate(createdAt)}</p>
          <p>Updated: {formatDate(updatedAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
