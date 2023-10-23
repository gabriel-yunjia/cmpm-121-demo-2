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

canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mouseout", () => (isDrawing = false));

function draw(e: MouseEvent) {
  if (ctx && isDrawing) {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
  }
}

// Create a container for buttons arranged horizontally
const buttonsContainer = document.createElement("div");
buttonsContainer.style.display = "flex";
buttonsContainer.style.justifyContent = "center"; // Center buttons horizontally
verticalContainer.append(buttonsContainer);

// Create and add the "Clear" button
const clearButton = document.createElement("button");
clearButton.innerHTML = "Clear";
clearButton.id = "clearButton";
buttonsContainer.append(clearButton);

// Clear button functionality
clearButton.addEventListener("click", () => {
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});
