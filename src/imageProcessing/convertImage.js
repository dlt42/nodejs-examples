const { Readable } = require("stream");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

module.exports = async (
  inputFilename,
  outputFilename,
  channel,
  colourspace
) => {
  var writeStream;
  try {

    // Create and configure the input buffer for image conversion
    let data = await sharp(inputFilename)
      .ensureAlpha()
      .resize(100, 100, {
        kernel: sharp.kernel.cubic,
        fit: "outside",
        position: "right top",
        background: { r: 255, g: 255, b: 255, alpha: 0.5 },
      })
      .png({});
    if (channel !== undefined) data = await data.extractChannel(channel);
    if (colourspace !== undefined) data = await data.toColourspace(colourspace);
    data = await data.toBuffer();

    // Ensure an output filename
    var extension = path.extname(inputFilename);
    var basename = path.basename(inputFilename, extension);
    outputFilename ??= `${basename}-converted.png`;

    // Create a stream for the input buffer
    const inputStream = Readable.from(data);

    // When the input stream gets the first chunk...
    inputStream.once("data", () => {
      console.log(`started reading - stream started for '${basename}'`);
      console.log("========================================");

      // ...create the output file stream 
      writeStream = fs.createWriteStream(outputFilename);
    });

    // For each chunk the input stream gets...
    inputStream.on("data", (chunk) => {
      console.log(`chunk: ${chunk.length}`);

      // ...write it to the output file stream 
      writeStream.write(chunk);
    });

    // When the input stream finishes...
    inputStream.on("end", () => {

      // ...output the data length
      console.log(`finished reading - stream started for '${basename}' - total: ${data.length}`);
    });
  } finally {

    // Close the output file stream if it has been created 
    if (writeStream) writeStream.end();
  }
};
