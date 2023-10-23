import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Gabe's SketchPad ";

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

// Create a canvas container and clear button
const verticalContainer = document.createElement("div");
verticalContainer.style.textAlign = "center";
app.append(verticalContainer);

// Create a canvas itself
const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
canvas.style.backgroundColor = "white";
canvas.style.border = "1px solid black";
canvas.style.borderRadius = "20px";
canvas.style.boxShadow = "0px 40px 40px rgba(49, 217, 72, 0.8)";

verticalContainer.append(canvas);

verticalContainer.append(canvas);

const ctx = canvas.getContext("2d");

// draw state variables
let isDrawing = false;
let lastX = 0;
let lastY = 0;

const drawPoints: [number, number][] = [];

// Mouse click listeners
canvas.addEventListener("mousedown", (e: MouseEvent) => {
  if (ctx) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
  }
});

canvas.addEventListener("mousemove", (e: MouseEvent) => {
  if (ctx) {
    draw(e);
  }
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  // Dispatch the "drawing-changed" event with the drawing points
  canvas.dispatchEvent(
    new CustomEvent("drawing-changed", { detail: drawPoints })
  );
  // Clear the drawing points after dispatching the event
  clearDrawingPoints();
});

canvas.addEventListener("mouseout", () => (isDrawing = false));

function draw(e: MouseEvent) {
  if (ctx && isDrawing) {
    const [x, y] = [e.offsetX, e.offsetY];
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
    [lastX, lastY] = [x, y];
    // Save the point to the drawingPoints array
    drawPoints.push([x, y]);
  }
}

// Create a container for buttons arranged horizontally
const horizontalContainer = document.createElement("div");
horizontalContainer.style.display = "flex";
horizontalContainer.style.justifyContent = "center"; // Center buttons horizontally
verticalContainer.append(horizontalContainer);

// Create and add the "Clear" button
const clearButton = document.createElement("button");
clearButton.innerHTML = "Clear";
clearButton.id = "clearButton";
horizontalContainer.append(clearButton);

// Clear button functionality
clearButton.addEventListener("click", () => {
  if (ctx) {
    clearCanvas();
  }
});

// Function to clear the canvas
function clearCanvas() {
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clearDrawingPoints();
  }
}

// Function to clear the drawing points
function clearDrawingPoints() {
  drawPoints.length = 0;
}

// Observer for the "drawing-changed" event
canvas.addEventListener("drawing-changed", (e: Event) => {
  if (ctx) {
    // Type assertion to specify the event detail's type
    const customEvent = e as CustomEvent<[number, number][]>;
    const points: [number, number][] = customEvent.detail;

    // Clear only the last drawn line
    if (points.length >= 2) {
      const [x1, y1] = points[points.length - 2];
      const [x2, y2] = points[points.length - 1];

      ctx.clearRect(
        Math.min(x1, x2),
        Math.min(y1, y2),
        Math.abs(x2 - x1),
        Math.abs(y2 - y1)
      );
    }

    // Redraw the entire drawing
    ctx.beginPath();
    points.forEach(([x, y], index) => {
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  }
});
