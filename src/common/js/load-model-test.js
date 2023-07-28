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
camera.position.set(10, 10, 60);
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



/**
 *  1、鼠标中键平移摄像机
 *  2、alt + 鼠标左键进行旋转
 * */
let isMouseMiddleDragging = false;
let isMouseLeftDragging = false;
let isAltKeyPressed = false;
let startMousePosition = new THREE.Vector2();
let previousPosition = new THREE.Vector2();
function init() {
    // ...
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
}
function onKeyDown(event) {
    if (event.key === 'Alt') {
        isAltKeyPressed = true;
    }
}
function onKeyUp(event) {
    if (event.key === 'Alt') {
        isAltKeyPressed = false;
    }
}
function onMouseDown(event) {
    if (event.button === THREE.MOUSE.MIDDLE) { // 鼠标中键平移视角
        isMouseMiddleDragging = true;
        startMousePosition.set(event.clientX, event.clientY);
        previousPosition.copy(startMousePosition);
    }
    if (event.button === THREE.MOUSE.LEFT && isAltKeyPressed) {
        isMouseLeftDragging = true;
        startMousePosition.set(event.clientX, event.clientY);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
}
function onMouseMove(event) {
    if (isMouseMiddleDragging) { // 鼠标中键平移视角
        const currentPosition = new THREE.Vector2(event.clientX, event.clientY);
        const delta = currentPosition.clone().sub(previousPosition);
        // 调整摄像机的位置
        camera.position.x -= delta.x * 0.3;
        camera.position.y += delta.y * 0.3;
        previousPosition.copy(currentPosition);
        camera.lookAt(0, 0, 0);

    }
    if (isMouseLeftDragging) { // alt + 鼠标左键旋转视角
        const currentMousePosition = new THREE.Vector2(event.clientX, event.clientY);
        const delta = new THREE.Vector2().subVectors(currentMousePosition, startMousePosition);
        // 根据 delta 的值更新摄像机的旋转角度
        camera.rotation.y += delta.x * 0.015;
        camera.rotation.x += delta.y * 0.015;
        startMousePosition.copy(currentMousePosition);
    }
    renderer.render(scene, camera); // 重新渲染场景

}
function onMouseUp(event) {
    if (event.button === THREE.MOUSE.MIDDLE) {
        isMouseMiddleDragging = false;
    }
    if (event.button === THREE.MOUSE.LEFT) {
        isMouseLeftDragging = false;
    }
}
init();


