const express = require("express");
const router = new express.Router();
const ExpressError = require("./expressError");
const items = require("./fakeDb");

//1. GET /items - this should render a list of shopping items.
router.get("/", function (req, res) {
  res.json(items);
});

//2. POST /items - this route should accept JSON data and add it to the shopping list.
router.post("/", (req, res) => {
  const newItem = { name: req.body.name, price: req.body.price };
  items.push(newItem);
  res.status(201).json({ added: newItem });
});

//3. GET /items/:name - this route should display a single item’s name and price.
router.get("/:name", (req, res) => {
  const foundItem = items.find((item) => item.name === req.params.name);
  if (!foundItem) {
    throw new ExpressError("Item not found", 404);
  }
  res.json(foundItem);
});

//4. PATCH /items/:name, this route should modify a single item’s name and/or price.
router.patch("/:name", (req, res) => {
  const foundItem = items.find((item) => item.name === req.params.name);
  if (!foundItem) {
    throw new ExpressError("Item not found", 404);
  }
  foundItem.name = req.body.name || foundItem.name;
  foundItem.price = req.body.price || foundItem.price;
  res.json({ updated: foundItem });
});

//5. DELETE /items/:name - this route should allow you to delete a specific item from the array.
router.delete("/:name", (req, res) => {
  const foundItem = items.find((item) => item.name === req.params.name);
  if (!foundItem) {
    throw new ExpressError("Item not found", 404);
  }
  items.splice(foundItem, 1);
  res.json({ message: "Deleted" });
});

module.exports = router;
