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

module.exports = {
  createListing,
};
