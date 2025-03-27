import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const canvas = document.getElementById("scene");

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor(0xffffff);
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(2, 2, 6);

scene.add(new THREE.AmbientLight(0xffffff, 0.2));

const directional = new THREE.DirectionalLight(0xffffff, 3);
directional.position.set(-5, 5, 10);
scene.add(directional);

let model;

const loader = new GLTFLoader();
loader.load(
  "model.glb",
  (gltf) => {
    model = gltf.scene;
    scene.add(model);
    model.position.set(2, 1, 1);
    model.rotation.y += 0.45;

    applyTexture("oak");
  },
  undefined,
  (error) => {
    console.error("Failed to load model:", error);
  }
);

function applyTexture(materialType) {
  const texture = new THREE.TextureLoader().load(materialType + ".jpg");
  model.traverse((obj) => {
    if (obj.isMesh && obj.material) {
      obj.material.map = texture;
      obj.material.roughness = 0.7;
      obj.material.metalness = 0.0;
      obj.material.needsUpdate = true;
    }
  });
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();


// Allow rotating the model with the arrow keys
document.addEventListener("keydown", (e) => {
  if (!model) return;
  switch (e.key) {
    case "ArrowLeft":
      model.rotation.y -= 0.1;
      break;
    case "ArrowRight":
      model.rotation.y += 0.1;
      break;
    case "ArrowUp":
      model.rotation.x -= 0.1;
      break;
    case "ArrowDown":
      model.rotation.x += 0.1;
      break;
  }
});


// Allow rotating the object with the mouse
let isDragging = false;

canvas.addEventListener("mousedown", (e) => {
  if (e.button === 0) isDragging = true;
});

canvas.addEventListener("mouseup", (e) => {
  if (e.button === 0) isDragging = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDragging || !model) return;
  model.rotation.y += e.movementX * 0.01;
  model.rotation.x += e.movementY * 0.01;
});

// Allow switching the material
document.querySelectorAll("#uiControls button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.texture;
    if (!model) return;
    applyTexture(materialType);
  });
});
