import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Gabe's SketchPad ";

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const verticalContainer = document.createElement("div");
verticalContainer.style.textAlign = "center";
app.append(verticalContainer);

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
canvas.style.backgroundColor = "white";
canvas.style.border = "1px solid black";
canvas.style.borderRadius = "8px";
canvas.style.boxShadow = "4px 4px 6px rgba(0, 0, 0, 0.1)";
verticalContainer.append(canvas);

const ctx = canvas.getContext("2d");

let isDrawing = false;
let currentMarkerThickness = 2;
let sticker = "";

class MarkerLine {
  private points: { x: number; y: number }[] = [];
  private thickness: number;

  constructor(initialX: number, initialY: number) {
    this.points.push({ x: initialX, y: initialY });
    this.thickness = currentMarkerThickness;
  }

  drag(x: number, y: number) {
    this.points.push({ x, y });
  }

  display(ctx: CanvasRenderingContext2D) {
    if (this.points.length > 1) {
      ctx.strokeStyle = "black";
      ctx.lineJoin = "round";
      ctx.lineWidth = this.thickness;

      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);
      for (let i = 1; i < this.points.length; i++) {
        ctx.lineTo(this.points[i].x, this.points[i].y);
      }
      ctx.stroke();
    }
  }
}

class ToolPreview {
  x: number;
  y: number;
  render: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.render = true;
  }

  display(ctx: CanvasRenderingContext2D) {
    if (!this.render) {
      return;
    }
    if (sticker != "") {
      ctx.fillText(sticker, this.x, this.y);
      return;
    }

    ctx.strokeStyle = "black";
    ctx.lineWidth = currentMarkerThickness / 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, ctx.lineWidth, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }
}

class Sticker {
  private x: number;
  private y: number;
  private text: string;

  constructor(x: number, y: number, text: string) {
    this.x = x;
    this.y = y;
    this.text = text;
  }

  drag(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  display(ctx: CanvasRenderingContext2D) {
    ctx.fillText(this.text, this.x, this.y);
  }
}

function setBrush(arg: number | string) {
  if (typeof arg === "number") {
    sticker = "";
    currentMarkerThickness = arg;
  } else if (typeof arg === "string") {
    sticker = arg;
    currentMarkerThickness = 0;
  }
}

const currentToolPreview: ToolPreview = new ToolPreview(0, 0);

interface DrawingData {
  displayList: Input[];
  redoStack: Input[];
}

interface Input {
  drag(x: number, y: number): void;
  display(ctx: CanvasRenderingContext2D): void;
}

const drawingData: DrawingData = { displayList: [], redoStack: [] };

canvas.addEventListener("mousedown", (e: MouseEvent) => {
  isDrawing = true;

  if (ctx) {
    if (sticker == "") {
      const currentLine = new MarkerLine(e.offsetX, e.offsetY);
      drawingData.displayList.push(currentLine);
    } else {
      const newSticker = new Sticker(e.offsetX, e.offsetY, sticker);
      drawingData.displayList.push(newSticker);
    }
  }
});

canvas.addEventListener("mousemove", (e: MouseEvent) => {
  if (isDrawing && ctx) {
    const currentPath =
      drawingData.displayList[drawingData.displayList.length - 1];
    currentPath.drag(e.offsetX, e.offsetY);
    redraw();
    return;
  }

  currentToolPreview.render = true;
  currentToolPreview.x = e.offsetX;
  currentToolPreview.y = e.offsetY;
  redraw();
});

canvas.addEventListener("mouseup", () => {
  if (isDrawing) {
    isDrawing = false;
  }
});

canvas.addEventListener("mouseout", () => {
  isDrawing = false;
  currentToolPreview.render = false;
  redraw();
});

const commandButtons = document.createElement("div");
commandButtons.style.display = "flex";
commandButtons.style.justifyContent = "center"; // Center buttons horizontally
verticalContainer.append(commandButtons);

const brushSize = document.createElement("div");
brushSize.style.display = "flex";
brushSize.style.justifyContent = "center"; // Center buttons horizontally
verticalContainer.append(brushSize);

const emojiButtons = document.createElement("div");
emojiButtons.style.display = "flex";
emojiButtons.style.justifyContent = "center"; // Center buttons horizontally
verticalContainer.append(emojiButtons);

// Create and add the "Clear" button
const clearButton = document.createElement("button");
clearButton.innerHTML = "Clear";
clearButton.id = "clearButton";
commandButtons.append(clearButton);

// Clear button functionality
clearButton.addEventListener("click", () => {
  if (ctx) {
    clearCanvas();
  }
});

const brush = document.createElement("div");
brush.textContent = "Brush size:"; // Set the text content

// Style the text element to match the button's size
brush.style.width = "100px";
brush.style.height = "30px";
brush.style.textAlign = "center";
brush.style.lineHeight = "40px";
brushSize.append(brush);

// Create buttons for "thin" and "thick" markers
const thinMarkerButton = document.createElement("button");
thinMarkerButton.innerHTML = "Thin";
thinMarkerButton.id = "thinMarkerButton";
brushSize.append(thinMarkerButton);

const thickMarkerButton = document.createElement("button");
thickMarkerButton.innerHTML = "Thick";
thickMarkerButton.id = "thickMarkerButton";
brushSize.append(thickMarkerButton);

// Add event listeners to the marker tool buttons
thinMarkerButton.addEventListener("click", () => {
  setBrush(1);
});

thickMarkerButton.addEventListener("click", () => {
  setBrush(5);
});

const emote1 = document.createElement("button");
emote1.innerHTML = "❤️";
emote1.id = "emote1";
emojiButtons.append(emote1);

const emote2 = document.createElement("button");
emote2.innerHTML = "🍟";
emote2.id = "emote2";
emojiButtons.append(emote2);

const emote3 = document.createElement("button");
emote3.innerHTML = "🐮";
emote3.id = "emote3";
emojiButtons.append(emote3);

emote1.addEventListener("click", () => {
  setBrush("😀");
});

emote2.addEventListener("click", () => {
  setBrush("🎉");
});

emote3.addEventListener("click", () => {
  setBrush("❤️");
});

const undoButton = document.createElement("button");
undoButton.innerHTML = "Undo";
undoButton.id = "undoButton";
commandButtons.append(undoButton);

const redoButton = document.createElement("button");
redoButton.innerHTML = "Redo";
redoButton.id = "redoButton";
commandButtons.append(redoButton);

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
  if (drawingData.redoStack.length > 0) {
    const line = drawingData.redoStack.pop(); // Remove the last line from redoStack
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

    currentToolPreview.display(ctx);
  }
}
