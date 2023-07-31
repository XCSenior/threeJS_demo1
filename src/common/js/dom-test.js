import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';


// 创建一个 Three.js 场景
const scene = new THREE.Scene();


// 创建一个透视相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 创建一个 WebGL 渲染器
const renderer = new CSS3DRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建一个 DOM 元素（在这个例子中是一个 <div> 元素）
const domElement = document.createElement('div');
domElement.style.width = '200px';
domElement.style.height = '200px';
domElement.style.backgroundColor = 'red';
domElement.style.position = 'absolute';

// 将 DOM 元素转换为 CSS3D 对象
const domObject = new CSS3DObject(domElement);

// 设置 DOM 对象的初始位置
domObject.position.set(0, 0, -10);

// 添加 DOM 对象到 Three.js 场景中
scene.add(domObject);

function animate() {
  requestAnimationFrame(animate);

  // 使 DOM 对象正面始终朝向摄像机位置
  domObject.lookAt(camera.position);

  // 渲染 Three.js 场景
  renderer.render(scene, camera);
}

animate();


console.log('nihao');