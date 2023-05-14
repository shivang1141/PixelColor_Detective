document.getElementById('imageUpload').addEventListener('change', loadAndDrawImage);
document.getElementById('imageCanvas').addEventListener('click', getColor);
document.getElementById('clearHistory').addEventListener('click', clearHistory);
document.getElementById('downloadPalette').addEventListener('click', downloadPalette);


const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const maxImageWidth = 1000; // Adjust this value to your preferred maximum width

function loadAndDrawImage() {
  const file = this.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    img.src = event.target.result;

    img.onload = function () {
      const aspectRatio = img.height / img.width;
      const displayWidth = Math.min(maxImageWidth, img.width);
      const displayHeight = displayWidth * aspectRatio;

      canvas.width = displayWidth;
      canvas.height = displayHeight;
      ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
    };
  };

  reader.readAsDataURL(file);
}

function getColor(event) {
    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;
    const imageData = ctx.getImageData(x, y, 1, 1).data;
    const rgba = `rgba(${imageData[0]}, ${imageData[1]}, ${imageData[2]}, ${imageData[3] / 255})`;
    const hex = rgbaToHex(imageData[0], imageData[1], imageData[2]);
  
    document.getElementById('colorDisplay').style.backgroundColor = rgba;
    document.getElementById('hexValue').innerText = `HEX: ${hex}`;
  
    addToColorHistory(hex);
  }
  
  function addToColorHistory(hex) {
    const colorHistory = document.querySelector('.color-history');
    const listItem = document.createElement('li');
    listItem.style.backgroundColor = hex;
  
    const tooltip = document.createElement('span');
    tooltip.classList.add('tooltip');
    tooltip.textContent = hex;
    listItem.appendChild(tooltip);
  
    colorHistory.appendChild(listItem);
  
    if (colorHistory.childElementCount > 5) {
      colorHistory.removeChild(colorHistory.firstChild);
    }
  }
  
  function clearHistory() {
    const colorHistory = document.querySelector('.color-history');
    while (colorHistory.firstChild) {
      colorHistory.removeChild(colorHistory.firstChild);
    }
  }

function rgbaToHex(r, g, b) {
  const toHex = (n) => ('00' + n.toString(16)).slice(-2);
  return '#' + toHex(r) + toHex(g) + toHex(b);
}


function downloadPdfPalette() {
    const colorHistory = document.querySelectorAll('.color-history li');
    const doc = new jsPDF();
    let yOffset = 20;
  
    doc.setFontSize(16);
    doc.text('Color Palette:', 10, yOffset);
  
    yOffset += 10;
    doc.setFontSize(12);
  
    colorHistory.forEach((item) => {
      const hexColor = item.style.backgroundColor;
      const rgbColor = hexToRgb(hexColor);
      const colorText = `${hexColor} - RGB(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
  
      yOffset += 10;
      doc.text(colorText, 10, yOffset);
    });
  
    doc.save('color-palette.pdf');
  }
  
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  