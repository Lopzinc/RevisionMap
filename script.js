const image = document.getElementById('bg-image');

let scale = 1;
let originX = 0;
let originY = 0;
let isPanning = false;
let startX, startY;

function updateTransform() {
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
  scale = Math.min(Math.max(scale, 0.1), 10);

  // Adjust origin to zoom toward mouse
  originX -= offsetX * (scale / prevScale - 1);
  originY -= offsetY * (scale / prevScale - 1);

  updateTransform();
}, { passive: false });

// Shift + drag to pan
window.addEventListener('mousedown', (e) => {
  if (!e.shiftKey) return;

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
