const sharp = require("sharp");


const input = "./public/icons/icon-512x512.png"; 


const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  sharp(input)
    .resize(size, size)
    .toFile(`./public/icons/icon-${size}x${size}.png`)
    .then(() => console.log(`Generated icon-${size}x${size}.png`))
    .catch(err => console.error(err));
});
