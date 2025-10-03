const Restaurant = require("../../models/Restaurant");

const fetchAllRestaurants = async () => {
  const restaurantsDirect = await Restaurant.find({}).populate(
    "owner",
    "name status role"
  );
  const restaurants = restaurantsDirect.filter(
    (r) => r.owner.status == "active"
  );
  return res.status(200).json({
    status: "success",
    message: `${restaurants.length} restaurants fetched successfully`,
  });
};
