const fetch = require("node-fetch");
const sharp = require("sharp");
const { encode } = require("blurhash");
const logger = require("./log");

const downloadImage = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    logger.error(`HTTP error! status: ${response.status}`);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const buffer = await response.buffer();
  return buffer;
};

const encodeImageToBlurhash = async (image) =>
  new Promise((resolve, reject) => {
    sharp(image)
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: "inside" })
      .toBuffer((err, buffer, { width, height }) => {
        if (err) {
          return reject(err);
        }
        resolve(encode(new Uint8ClampedArray(buffer), width, height, 4, 3));
      });
  });

module.exports = {
  downloadImage,
  encodeImageToBlurhash,
};
