import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Loading Screen Management
const loadingScreen = document.getElementById("loading-screen");
const progressBar = document.getElementById("progress-bar");
const loadingText = document.getElementById("loading-text");
const loadingPercentage = document.getElementById("loading-percentage");

let loadingProgress = 0;
const loadingSteps = [
  { text: "Initializing...", progress: 10 },
  { text: "Loading 3D Scene...", progress: 30 },
  { text: "Loading Environment...", progress: 50 },
  { text: "Setting up Controls...", progress: 70 },
  { text: "Preparing Animations...", progress: 90 },
  { text: "Ready!", progress: 100 },
];

function updateLoading(step) {
  const currentStep =
    loadingSteps[step] || loadingSteps[loadingSteps.length - 1];
  loadingText.textContent = currentStep.text;
  loadingProgress = currentStep.progress;
  progressBar.style.width = `${loadingProgress}%`;
  loadingPercentage.textContent = `${loadingProgress}%`;
}

function hideLoadingScreen() {
  gsap.to(loadingScreen, {
    opacity: 0,
    duration: 1,
    ease: "power2.inOut",
    onComplete: () => {
      loadingScreen.style.display = "none";
    },
  });
}

// Initialize loading
updateLoading(0);

// Scene setup
const scene = new THREE.Scene();
updateLoading(1);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas"),
  alpha: true,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.outputColorSpace = THREE.SRGBColorSpace;

camera.position.z = 6;
camera.position.y = 3;
// camera.position.x = 0;
camera.lookAt(0, 0, 0);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
updateLoading(3);

// HDRI Environment
const rgbeLoader = new RGBELoader();
rgbeLoader.load(
  "../public/brown_photostudio_02_1k.hdr",
  function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    // scene.background = texture;
    updateLoading(2);
  },
  // Progress callback
  function (progress) {
    if (progress.lengthComputable) {
      const percentComplete = (progress.loaded / progress.total) * 100;
      updateLoading(2);
    }
  },
  // Error callback
  function (error) {
    console.error("Error loading HDRI:", error);
    updateLoading(2);
  }
);

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  renderer.render(scene, camera);
}

animate();

// GSAP Animations
updateLoading(4);

const crazyUI = gsap.timeline();
crazyUI
  .from(".picture", {
    scale: 0.3,
    opacity: 0,
    rotate: -30,
    duration: 1.2,
    ease: "elastic.out(1, 0.4)",
    delay: 1.4,
  })
  .from(".profile", {
    opacity: 0,
    rotate: 1440,
    scale: 0.2,
    backgroundColor: "#ff00ff",
    duration: 1.2,
    ease: "expo.inOut",
  })
  .from(".panel", {
    x: 100,
    scale: 0.5,
    opacity: 0,
    duration: 1.2,
    ease: "elastic.out(1, 0.3)",
  })
  .from(".lucide", {
    y: 60,
    opacity: 0,
    rotate: 360,
    scale: 0.3,
    color: "#ffcc00",
    stagger: {
      amount: 0.8,
      from: "center",
      grid: "auto",
      ease: "power4.inOut",
    },
    duration: 1.2,
  })
  .from(".solarText", {
    x: -100,
    opacity: 0,
    scale: 0.5,
    duration: 1.1,
    ease: "back.out(2)",
  });

// Add hover effect to picture to speed up and brighten wire animation
const picture = document.querySelector(".picture");
const wires = document.querySelectorAll(".wire-wrapper");
if (picture && wires.length) {
  picture.addEventListener("mouseenter", () => {
    wires.forEach((w) => w.classList.add("wire-fast-glow"));

    // Picture shake and move animation
    gsap.to(picture, {
      x: "random(-3, 3)",
      y: "random(-2, 2)",
      rotation: "random(-2, 2)",
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: "power1.inOut",
    });
  });

  picture.addEventListener("mouseleave", () => {
    wires.forEach((w) => w.classList.remove("wire-fast-glow"));

    // Reset picture position
    gsap.to(picture, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  });
}

// Hide loading screen after everything is ready
setTimeout(() => {
  updateLoading(5);
  setTimeout(hideLoadingScreen, 500);
}, 1000);
