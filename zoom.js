const image = document.getElementById('bg-image');

let scale = 1;
let originX = 0;
let originY = 0;
let isPanning = false;
let startX, startY;

function updateTransform() {
  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;
  const imageWidth = image.naturalWidth * scale;
  const imageHeight = image.naturalHeight * scale;

  // Calculate bounds for panning
  let minX = containerWidth - imageWidth;
  let minY = containerHeight - imageHeight;

  // If image is smaller than container, center it (optional)
  if (imageWidth <= containerWidth) {
    originX = (containerWidth - imageWidth) / 2;
  } else {
    originX = Math.min(Math.max(originX, minX), 0);
  }

  if (imageHeight <= containerHeight) {
    originY = (containerHeight - imageHeight) / 2;
  } else {
    originY = Math.min(Math.max(originY, minY), 0);
  }

  image.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
}



// Zoom with scroll wheel
window.addEventListener('wheel', (e) => {
  e.preventDefault();

  const zoomIntensity = 0.1;
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  const rect = image.getBoundingClientRect();
  const offsetX = mouseX - rect.left;
  const offsetY = mouseY - rect.top;

  const prevScale = scale;
  if (e.deltaY < 0) {
    scale *= (1 + zoomIntensity);
  } else {
    scale *= (1 - zoomIntensity);
  }

  // Prevent scale from going too small or too big
  scale = Math.min(Math.max(scale, 1), 100);

  // Adjust origin to zoom toward mouse
  originX -= offsetX * (scale / prevScale - 1);
  originY -= offsetY * (scale / prevScale - 1);

  updateTransform();
}, { passive: false });

// Shift + drag to pan
window.addEventListener('mousedown', (e) => {z
  isPanning = true;
  startX = e.clientX - originX;
  startY = e.clientY - originY;
  document.body.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', (e) => {
  if (!isPanning) return;

  originX = e.clientX - startX;
  originY = e.clientY - startY;
  updateTransform();
});

window.addEventListener('mouseup', () => {
  isPanning = false;
  document.body.style.cursor = 'grab';
});
