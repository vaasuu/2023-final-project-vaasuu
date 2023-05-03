import { describe, expect, it, vitest } from "vitest";
import { getAllListings, getUserListings, searchListings } from "./listings";
import { BACKEND_URL } from "../../shared/utils/utils";

describe("getUserListings()", () => {
  it("returns user listings when passed a valid user ID and token", async () => {
    const userId = "123";
    const token = "xyz";
    const expectedListings = [
      { id: "1", title: "Listing 1" },
      { id: "2", title: "Listing 2" },
    ];

    global.fetch = vitest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(expectedListings),
      })
    );

    const listings = await getUserListings(userId, token);

    expect(listings).toEqual(expectedListings);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/api/v1/listings/user/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  });

  it("rejects with an error message when an error occurs", async () => {
    const userId = "123";
    const token = "xyz";
    const errorMessage = "Error getting user listings";

    global.fetch = vitest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 400,
        json: () => Promise.resolve({ message: errorMessage }),
      })
    );

    try {
      await getUserListings(userId, token);
    } catch (err) {
      expect(err.message).toBe(errorMessage);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BACKEND_URL}/api/v1/listings/user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  });
});

describe("getAllListings()", () => {
  it("returns all listings when passed a valid token", async () => {
    const token = "xyz";
    const expectedListings = [
      { id: "1", title: "Listing 1" },
      { id: "2", title: "Listing 2" },
    ];

    global.fetch = vitest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(expectedListings),
      })
    );

    const listings = await getAllListings(token);

    expect(listings).toEqual(expectedListings);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/api/v1/listings`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  });
});

describe("searchListings", () => {
  // mock fetch API
  global.fetch = vitest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({}),
      status: 200,
    })
  );

  it("should call the backend API with the correct parameters", async () => {
    const token = "abc123";
    const searchTerm = "test";
    const expectedUrl = `${BACKEND_URL}/api/v1/listings/search?query=${searchTerm}`;

    await searchListings(token, searchTerm);

    expect(fetch).toHaveBeenCalledWith(expectedUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  });

  it("should resolve with data if the response status is 200", async () => {
    const data = { listings: [] };
    global.fetch.mockReturnValueOnce(
      Promise.resolve({
        json: () => Promise.resolve(data),
        status: 200,
      })
    );

    const token = "abc123";
    const searchTerm = "test";
    const result = await searchListings(token, searchTerm);

    expect(result).toEqual(data);
  });

  it("should reject with data if the response status is not 200", async () => {
    const data = { error: "Not found" };
    global.fetch.mockReturnValueOnce(
      Promise.resolve({
        json: () => Promise.resolve(data),
        status: 404,
      })
    );

    const token = "abc123";
    const searchTerm = "test";

    await expect(searchListings(token, searchTerm)).rejects.toEqual(data);
  });

  it("should reject with error if fetch throws an error", async () => {
    const error = new Error("Network error");
    global.fetch.mockReturnValueOnce(Promise.reject(error));

    const token = "abc123";
    const searchTerm = "test";

    await expect(searchListings(token, searchTerm)).rejects.toEqual(error);
  });
});
