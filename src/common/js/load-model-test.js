/**
 * 加载模型测试
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'; // 压缩模型


/* 第一步：准备好渲染器、场景、相机 */
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();


/* 第二步：开始加载模型 */
const loader = new GLTFLoader();

loader.load("/public/model/dongzuo.gltf", (gltf) => {
    gltf.scene.position.set(0, -10, 0); // 设置未知
    gltf.scene.scale.set(20, 20, 20); // 放大模型
    scene.add(gltf.scene);

    const color = 0xFFFFFF;
    const intensity = 4;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);

    renderer.render(scene, camera);


}, undefined, (error) => {
    console.error("加载模型出错啦！", error);
});

