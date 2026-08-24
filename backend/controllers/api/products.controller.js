const Menu = require("../../models/Menu");
const Restaurant = require("../../models/Restaurant");
const User = require("../../models/User");

const searchProducts = async (req, res) => {
  try {
    const {
      q,
      search,
      dietType,
      veg,
      egg,
      nonveg,
      non_veg,
      priceLow,
      minPrice,
      priceHigh,
      maxPrice,
      sortBy,
    } = req.query;

    // 1. Get active restaurant IDs first to ensure we only search products from active restaurants
    const activeOwners = await User.find({ status: "active" }).select("_id");
    const activeOwnerIds = activeOwners.map((u) => u._id);

    const activeRestaurants = await Restaurant.find({
      owner: { $in: activeOwnerIds },
    }).select("_id");
    const activeRestaurantIds = activeRestaurants.map((r) => r._id);

    // 2. Build the query object
    const query = {
      restaurantId: { $in: activeRestaurantIds },
      available: true, // Only show available items
    };

    // Robust Name/Search term filter
    const searchTerm = q || search;
    if (searchTerm && searchTerm.trim() !== "") {
      // Escape special characters to prevent regex injection
      const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.itemName = { $regex: escapedSearch, $options: "i" };
    }

    // Diet type filter (e.g. dietType=veg,egg or individual boolean flags)
    const dietTypesList = [];
    if (dietType) {
      const types = dietType.split(",").map((t) => t.trim().toLowerCase());
      dietTypesList.push(...types);
    }
    if (veg === "true" || veg === true) {
      dietTypesList.push("veg");
    }
    if (egg === "true" || egg === true) {
      dietTypesList.push("egg");
    }
    if (
      nonveg === "true" ||
      nonveg === true ||
      non_veg === "true" ||
      non_veg === true
    ) {
      dietTypesList.push("non_veg");
    }

    if (dietTypesList.length > 0) {
      // Remove duplicates
      const uniqueDietTypes = [...new Set(dietTypesList)];
      query.dietType = { $in: uniqueDietTypes };
    }

    // Price range filters
    const min = priceLow || minPrice;
    const max = priceHigh || maxPrice;

    if (min !== undefined || max !== undefined) {
      query.price = {};
      if (min !== undefined && min !== "") {
        const parsedMin = parseFloat(min);
        if (!isNaN(parsedMin)) {
          query.price.$gte = parsedMin;
        }
      }
      if (max !== undefined && max !== "") {
        const parsedMax = parseFloat(max);
        if (!isNaN(parsedMax)) {
          query.price.$lte = parsedMax;
        }
      }
      if (Object.keys(query.price).length === 0) {
        delete query.price;
      }
    }

    // 3. Setup pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // 4. Setup sorting
    let sortQuery = {};
    if (sortBy === "price_asc" || sortBy === "priceLowHigh") {
      sortQuery = { price: 1 };
    } else if (sortBy === "price_desc" || sortBy === "priceHighLow") {
      sortQuery = { price: -1 };
    } else if (sortBy === "name_desc") {
      sortQuery = { itemName: -1 };
    } else if (sortBy === "name_asc") {
      sortQuery = { itemName: 1 };
    } else {
      // Default sort (can be by createdAt desc, or itemName asc. Let's do itemName asc)
      sortQuery = { itemName: 1 };
    }

    // 5. Execute query
    const totalCount = await Menu.countDocuments(query);
    const products = await Menu.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .populate("restaurantId", "name restaurantId address banner rating");

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      status: "success",
      message: `${products.length} products found`,
      data: {
        products,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while searching products",
      error: error.message,
    });
  }
};

module.exports = {
  searchProducts,
};
