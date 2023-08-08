process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("./app");
let items = require("./fakeDb");

let popsicle = { name: "popsicle", price: 1.45 };
let muffin = { name: "muffin", price: 3.5 };

beforeEach(() => {
  items.push(popsicle, muffin);
});

afterEach(() => {
  items.length = 0;
});

describe("GET /items", () => {
  test("Returns list of shopping items", async () => {
    const resp = await request(app).get("/items");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual([popsicle, muffin]);
  });
});

describe("POST /items", () => {
  test("Accept JSON data and add to the shopping list", async () => {
    const resp = await request(app).post("/items").send({
      name: "cookie",
      price: 1.99,
    });
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({ added: { name: "cookie", price: 1.99 } });
  });
});

describe("GET /items/:name", () => {
  test("Return single item's name and price", async () => {
    const resp = await request(app).get(`/items/${popsicle.name}`);
    expect(resp.statusCode).toBe(200);

    expect(resp.body).toEqual(popsicle);
  });
  test("Respond with 404 if item not found", async () => {
    const resp = await request(app).get("/items/car");
    expect(resp.statusCode).toBe(404);
  });
});

describe("PATCH /items/:name", () => {
  test("Modify a single item's name and/or price", async () => {
    const resp = await request(app).patch(`/items/${popsicle.name}`).send({
      name: "lollipop",
      price: 0.5,
    });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ updated: { name: "lollipop", price: 0.5 } });
  });
  test("Respond with 404 if item not found", async () => {
    const resp = await request(app).get("/items/creampuff");
    expect(resp.statusCode).toBe(404);
  });
});

describe("DELETE /items/:name", () => {
  test("Delete a specific item from the shopping list", async () => {
    const resp = await request(app).delete(`/items/${muffin.name}`);
    expect(resp.body).toEqual({ message: "Deleted" });
  });
});
