const test = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");

const Menu = require("../models/Menu");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const Order = require("../models/Order");
const { searchProducts, searchProductsFromMenu } = require("../controllers/api/products.controller");

// Helper to mock Express response
const makeMockRes = () => {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
  return res;
};

// Save original mongoose functions to restore later
const originalUserFind = User.find;
const originalRestaurantFind = Restaurant.find;
const originalMenuFind = Menu.find;
const originalMenuCountDocuments = Menu.countDocuments;
const originalOrderDistinct = Order.distinct;

const restoreMocks = () => {
  User.find = originalUserFind;
  Restaurant.find = originalRestaurantFind;
  Menu.find = originalMenuFind;
  Menu.countDocuments = originalMenuCountDocuments;
  Order.distinct = originalOrderDistinct;
};

test.afterEach(() => {
  restoreMocks();
});

test("searchProducts - Happy Path", async () => {
  const req = {
    query: {
      q: "Pizza",
      page: "1",
      limit: "10",
    },
  };
  const res = makeMockRes();

  // Mock Active Owners
  const activeUserId = new mongoose.Types.ObjectId();
  User.find = () => {
    return {
      select: async () => [{ _id: activeUserId }],
    };
  };

  // Mock Active Restaurants
  const activeRestaurantId = new mongoose.Types.ObjectId();
  Restaurant.find = (query) => {
    assert.deepStrictEqual(query.owner, { $in: [activeUserId] });
    return {
      select: async () => [{ _id: activeRestaurantId }],
    };
  };

  // Mock Menu
  let menuFindQuery = null;
  Menu.find = (query) => {
    menuFindQuery = query;
    return {
      sort: () => {
        return {
          skip: () => {
            return {
              limit: () => {
                return {
                  populate: async () => [
                    {
                      _id: new mongoose.Types.ObjectId(),
                      itemName: "Veggie Pizza",
                      price: 250,
                      available: true,
                      dietType: "veg",
                      restaurantId: {
                        _id: activeRestaurantId,
                        name: "Pizza Place",
                      },
                    },
                  ],
                };
              },
            };
          },
        };
      },
    };
  };

  Menu.countDocuments = async (query) => {
    return 1;
  };

  await searchProducts(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.status, "success");
  assert.strictEqual(res.body.data.products.length, 1);
  assert.strictEqual(res.body.data.products[0].itemName, "Veggie Pizza");
  assert.strictEqual(res.body.data.pagination.total, 1);
  assert.strictEqual(res.body.data.pagination.page, 1);
  assert.strictEqual(res.body.data.pagination.totalPages, 1);

  // Check query structure
  assert.ok(menuFindQuery);
  assert.deepStrictEqual(menuFindQuery.restaurantId, { $in: [activeRestaurantId] });
  assert.strictEqual(menuFindQuery.available, true);
  assert.deepStrictEqual(menuFindQuery.itemName, { $regex: "Pizza", $options: "i" });
});

test("searchProducts - Diet Type & Price Filters", async () => {
  const req = {
    query: {
      dietType: "veg,egg",
      priceLow: "100",
      priceHigh: "500",
    },
  };
  const res = makeMockRes();

  const activeUserId = new mongoose.Types.ObjectId();
  User.find = () => {
    return {
      select: async () => [{ _id: activeUserId }],
    };
  };

  const activeRestaurantId = new mongoose.Types.ObjectId();
  Restaurant.find = () => {
    return {
      select: async () => [{ _id: activeRestaurantId }],
    };
  };

  let menuFindQuery = null;
  Menu.find = (query) => {
    menuFindQuery = query;
    return {
      sort: () => {
        return {
          skip: () => {
            return {
              limit: () => {
                return {
                  populate: async () => [],
                };
              },
            };
          },
        };
      },
    };
  };

  Menu.countDocuments = async () => 0;

  await searchProducts(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.products.length, 0);

  // Validate diet filter and price filter
  assert.ok(menuFindQuery);
  assert.deepStrictEqual(menuFindQuery.dietType, { $in: ["veg", "egg"] });
  assert.deepStrictEqual(menuFindQuery.price, { $gte: 100, $lte: 500 });
});

test("searchProductsFromMenu - Happy Path", async () => {
  const req = {
    query: {
      query: "Burger",
      max_price: "300",
      page: "1",
      limit: "10",
    },
  };
  const res = makeMockRes();

  const activeUserId = new mongoose.Types.ObjectId();
  User.find = () => {
    return {
      select: async () => [{ _id: activeUserId }],
    };
  };

  const activeRestaurantId = new mongoose.Types.ObjectId();
  Restaurant.find = () => {
    return {
      select: async () => [{ _id: activeRestaurantId }],
    };
  };

  const mockMenuId = new mongoose.Types.ObjectId();

  // Mock Menu
  let menuFindQuery = null;
  Menu.find = (query) => {
    menuFindQuery = query;
    return {
      sort: () => {
        return {
          skip: () => {
            return {
              limit: () => {
                return {
                  populate: async () => [
                    {
                      _id: mockMenuId,
                      itemName: "Cheese Burger",
                      price: 150,
                      available: true,
                      dietType: "non_veg",
                      restaurantId: {
                        _id: activeRestaurantId,
                        name: "Burger Joint",
                      },
                    },
                  ],
                };
              },
            };
          },
        };
      },
    };
  };

  Menu.countDocuments = async (query) => {
    return 1;
  };

  await searchProductsFromMenu(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.status, "success");
  assert.strictEqual(res.body.data.products.length, 1);
  assert.strictEqual(res.body.data.products[0].itemName, "Cheese Burger");
  assert.strictEqual(res.body.data.pagination.total, 1);

  // Validate the query structure passed to Menu.find
  assert.ok(menuFindQuery);
  assert.deepStrictEqual(menuFindQuery.restaurantId, { $in: [activeRestaurantId] });
  assert.strictEqual(menuFindQuery.available, true);
  assert.deepStrictEqual(menuFindQuery.itemName, { $regex: "Burger", $options: "i" });
  assert.deepStrictEqual(menuFindQuery.price, { $lte: 300 });
});

test("searchProductsFromMenu - No Filters & Empty Menu", async () => {
  const req = {
    query: {},
  };
  const res = makeMockRes();

  const activeUserId = new mongoose.Types.ObjectId();
  User.find = () => {
    return {
      select: async () => [{ _id: activeUserId }],
    };
  };

  const activeRestaurantId = new mongoose.Types.ObjectId();
  Restaurant.find = () => {
    return {
      select: async () => [{ _id: activeRestaurantId }],
    };
  };

  Menu.find = (query) => {
    return {
      sort: () => {
        return {
          skip: () => {
            return {
              limit: () => {
                return {
                  populate: async () => [],
                };
              },
            };
          },
        };
      },
    };
  };

  Menu.countDocuments = async () => 0;

  await searchProductsFromMenu(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.products.length, 0);
  assert.strictEqual(res.body.data.pagination.total, 0);
});
