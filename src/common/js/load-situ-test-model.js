/**
 * 加载模型测试
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'; // 压缩模型
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* 第一步：准备好渲染器、场景、相机 */
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 105500);
camera.position.set(1000, 1500, 6000);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0); // 设置了相机围绕其旋转的目标点
controls.update(); // 更新控制器的内部状态，需要在任何修改之后调用
controls.enablePan = true; // 禁用通过鼠标移动目标点
controls.enableDamping = true; // 相机移动时产生平滑的效果


const pmremGenerator = new THREE.PMREMGenerator(renderer);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfe3dd);
scene.environment = pmremGenerator.fromScene(
    new RoomEnvironment(renderer),
    0.04
).texture;

/* 第二步：开始加载模型 */
const loader = new GLTFLoader();

// loader.load("/public/model/dongzuo.gltf", (gltf) => {
loader.load("/public/model/Situ-test.glb", (gltf) => {
    gltf.scene.position.set(0, -10, 0); // 设置未知
    gltf.scene.scale.set(20, 20, 20); // 放大模型
    scene.add(gltf.scene);

    const color = 0xFFFFFF;
    const intensity = 2;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);

    renderer.render(scene, camera);


}, undefined, (error) => {
    console.error("加载模型出错啦！", error);
});





function animate() {
    requestAnimationFrame(animate);

    controls.update();


    renderer.render(scene, camera);
}

animate();