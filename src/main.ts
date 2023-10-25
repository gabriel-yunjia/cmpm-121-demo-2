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

class MarkerLine {
  private points: { x: number; y: number }[] = [];

  constructor(initialX: number, initialY: number) {
    this.points.push({ x: initialX, y: initialY });
  }

  drag(x: number, y: number) {
    this.points.push({ x, y });
  }

  display(ctx: CanvasRenderingContext2D) {
    if (this.points.length > 1) {
      ctx.strokeStyle = "black";
      ctx.lineJoin = "round";
      ctx.lineWidth = 5;

      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);
      for (let i = 1; i < this.points.length; i++) {
        ctx.lineTo(this.points[i].x, this.points[i].y);
      }
      ctx.stroke();
    }
  }
}

interface DrawingData {
  displayList: MarkerLine[];
  redoStack: MarkerLine[];
}

const drawingData: DrawingData = { displayList: [], redoStack: [] };

// Mouse click listeners
canvas.addEventListener("mousedown", (e: MouseEvent) => {
  if (ctx) {
    isDrawing = true;
    const currentLine = new MarkerLine(e.offsetX, e.offsetY);
    drawingData.displayList.push(currentLine);
  }
});

canvas.addEventListener("mousemove", (e: MouseEvent) => {
  if (ctx && isDrawing) {
    const currentPath =
      drawingData.displayList[drawingData.displayList.length - 1];
    currentPath.drag(e.offsetX, e.offsetY);
    redraw();
  }
});

canvas.addEventListener("mouseup", () => {
  if (isDrawing) {
    isDrawing = false;
  }
});

canvas.addEventListener("mouseout", () => (isDrawing = false));

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
  if (drawingData.displayList.length > 0) {
    const line = drawingData.displayList.pop(); // Remove the last line from displayList

    if (line) {
      drawingData.redoStack.push(line); // Add the line to redoStack
      redraw();
    }
  }
}

// Function to redo the last undone line
function redo() {
  if (drawingData.displayList.length > 0) {
    const line = drawingData.displayList.pop(); // Remove the last line from displayList
    if (line) {
      drawingData.displayList.push(line); // Add the line back to displayList
      redraw();
    }
  }
}

// Function to clear the canvas
function clearCanvas() {
  if (ctx) {
    drawingData.displayList = [];
    drawingData.redoStack = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
function redraw() {
  if (drawingData?.displayList && ctx) {
    const paths = drawingData.displayList;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const path of paths) {
      path.display(ctx);
    }
  }
}
