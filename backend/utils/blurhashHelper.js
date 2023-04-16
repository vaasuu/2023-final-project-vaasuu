const https = require("https");
const sharp = require("sharp");
const { encode } = require("blurhash");
const logger = require("./log");

const downloadImage = (url) =>
  new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        logger.error(
          `Image download failed! status: ${response.statusCode} url: ${url}`
        );
        return reject(
          new Error(`Problem downloading image from URL ( ${url} )`)
        );
      }
      const data = [];
      response
        .on("data", (chunk) => {
          data.push(chunk);
        })
        .on("end", () => {
          const buffer = Buffer.concat(data);
          resolve(buffer);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  });

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
