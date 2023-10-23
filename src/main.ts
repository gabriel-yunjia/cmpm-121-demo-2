import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Gabe's SketchPad ";

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

// Create a canvas container
const canvasContainer = document.createElement("div");
canvasContainer.style.display = "flex";
canvasContainer.style.flexDirection = "column"; // Align items vertically
app.append(canvasContainer);

// Create a canvas itself
const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
canvas.style.backgroundColor = "white";
canvas.style.border = "1px solid black";
canvas.style.borderRadius = "20px";
canvas.style.boxShadow = "0px 40px 40px rgba(49, 217, 72, 0.8)";

canvasContainer.append(canvas);
