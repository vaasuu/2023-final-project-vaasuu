const Joi = require("joi");
const {
  downloadImage,
  encodeImageToBlurhash,
} = require("../utils/blurhashHelper");
const logger = require("../utils/log");

const listings = require("../models/listings");

const createListing = async (req, res) => {
  const schema = Joi.object({
    title: Joi.string().max(255).required(),
    description: Joi.string().max(4095).required(),
    category: Joi.string().max(255).required(),
    price: Joi.number().max(99_999_999).required(),
    currency: Joi.string().length(3).required(),
    location: Joi.string().max(255).required(),
    image_urls: Joi.array().items(Joi.string().uri()).optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const {
    title,
    description,
    category,
    price,
    currency,
    location,
    image_urls,
  } = req.body;

  // Check that all image URLs are HTTPS
  image_urls.forEach((url) => {
    if (!url.startsWith("https://")) {
      return res.status(400).json({ error: "Image URL must be HTTPS" });
    }
  });

  let image_datas = []; // [{ url, blurhash }, ...]

  try {
    // Download and encode images to blurhash
    let imageDataPromises = [];
    if (image_urls) {
      // Create an array of promises that will download and encode images
      imageDataPromises = image_urls.map(async (url) => {
        let blurhash;
        try {
          const image = await downloadImage(url);
          blurhash = await encodeImageToBlurhash(image);
        } catch (error) {
          logger.error(error);
          throw Error("Failed to download and encode image");
        }

        return {
          url,
          blurhash,
        };
      });
    }

    // Wait for all promises to resolve and store the result in image_datas
    image_datas = await Promise.all(imageDataPromises);
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: "Failed to download and encode image" });
  }

  const listing = {
    title,
    description,
    asking_price: price,
    currency,
    category,
    owner: req.userData.userId,
    location,
    image_datas,
  };

  try {
    const newListing = await listings.create(listing);
    return res.status(201).json(newListing);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getListings = async (req, res) => {
  try {
    const listingsData = await listings.getAll();
    return res.status(200).json({ listings: listingsData });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getListing = async (req, res) => {
  const schema = Joi.object({
    id: Joi.number().required(),
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { id } = req.params;

  try {
    let listingData = await listings.getById(id);
    if (listingData[0].listing_id == null) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // Move the listing data from the array of size 1 to the object itself
    listingData = listingData[0];

    // convert strings of json arrays to actual arrays
    listingData.picture_ids = JSON.parse(listingData.picture_ids);
    listingData.picture_urls = JSON.parse(listingData.picture_urls);
    listingData.blurhashes = JSON.parse(listingData.blurhashes);

    const imgCount =
      listingData.picture_ids[0] == null ? 0 : listingData.picture_ids.length;

    // map the separate arrays to a array of objects
    const imgDataArray = [];
    for (let i = 0; i < imgCount; i++) {
      imgDataArray.push({
        id: listingData.picture_ids[i],
        url: listingData.picture_urls[i],
        blurhash: listingData.blurhashes[i],
      });
    }

    // add the array of objects to the listingData object
    listingData.image_data = imgDataArray;

    // remove the old arrays from the listingData object
    delete listingData.picture_ids;
    delete listingData.picture_urls;
    delete listingData.blurhashes;

    return res.status(200).json({ listing: listingData });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// const updateListing = (req, res) => {};

// const deleteListing = (req, res) => {};

// const getUserListings = (req, res) => {};

// const searchListings = (req, res) => {};

// const getCategories = (req, res) => {};

module.exports = {
  createListing,
  getListings,
  getListing,
};
