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
const displayList: [number, number][][] = [];
const drawPoints: [number, number][] = [];
const redoStack: [number, number][][] = [];
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
  // Add the current line to the display list
  displayList.push([...drawPoints]);
  // Dispatch the "drawing-changed" event with the display list
  canvas.dispatchEvent(
    new CustomEvent("drawing-changed", { detail: displayList })
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

// Create and add the "Undo" button
const undoButton = document.createElement("button");
undoButton.innerHTML = "Undo";
undoButton.id = "undoButton";
horizontalContainer.append(undoButton);

// Create and add the "Redo" button
const redoButton = document.createElement("button");
redoButton.innerHTML = "Redo";
redoButton.id = "redoButton";
horizontalContainer.append(redoButton);

// Undo button functionality
undoButton.addEventListener("click", () => {
  if (ctx) {
    undo();
  }
});

// Redo button functionality
redoButton.addEventListener("click", () => {
  if (ctx) {
    redo();
  }
});

// Function to undo the last line
function undo() {
  if (displayList.length > 0) {
    const line = displayList.pop(); // Remove the last line from displayList
    if (line) {
      redoStack.push(line); // Add the line to redoStack
      canvas.dispatchEvent(
        new CustomEvent("drawing-changed", { detail: displayList })
      );
    }
  }
}

// Function to redo the last undone line
function redo() {
  if (redoStack.length > 0) {
    const line = redoStack.pop(); // Remove the last line from redoStack
    if (line) {
      displayList.push(line); // Add the line back to displayList
      canvas.dispatchEvent(
        new CustomEvent("drawing-changed", { detail: displayList })
      );
    }
  }
}

// Function to clear the canvas
function clearCanvas() {
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    displayList.length = 0;
    clearDrawingPoints();
  }
}

// Function to clear the drawing points
function clearDrawingPoints() {
  drawPoints.length = 0;
}

//observer
canvas.addEventListener("drawing-changed", (e: Event) => {
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas

    // Type assertion
    const customEvent = e as CustomEvent<[number, number][][]>; // Make sure it's an array of arrays
    const displayList: [number, number][][] = customEvent.detail;

    // Redraw
    for (const points of displayList) {
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
  }
});
