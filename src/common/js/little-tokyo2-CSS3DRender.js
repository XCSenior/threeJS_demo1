import * as THREE from "three";

import Stats from "three/examples/jsm/libs/stats.module.js";
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

let mixer;

const clock = new THREE.Clock();
const container = document.getElementById("container");

const stats = new Stats();
container.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const pmremGenerator = new THREE.PMREMGenerator(renderer);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfe3dd);
scene.environment = pmremGenerator.fromScene(
    new RoomEnvironment(renderer),
    0.04
).texture;

const camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.5,
    100
);
camera.position.set(5, 2, 10);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0); // 设置了相机围绕其旋转的目标点
controls.update(); // 更新控制器的内部状态，需要在任何修改之后调用
controls.enablePan = false; // 禁用通过鼠标移动目标点
controls.enableDamping = true; // 相机移动时产生平滑的效果

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/public/jsm/libs/draco/gltf/");

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
loader.load("models/gltf/LittlestTokyo.glb", function (gltf) {
        const model = gltf.scene;
        model.position.set(1, 1, 0);
        model.scale.set(0.01, 0.01, 0.01);
        scene.add(model);

        mixer = new THREE.AnimationMixer(model); // 播放模型动画
        mixer.clipAction(gltf.animations[0]).play();

        animate();
    },
    undefined,
    function (e) {
        console.error(e);
    }
);

window.onresize = function () {
    // 长宽比
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
};


const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(200, 160);
container.appendChild(cssRenderer.domElement);

const buttonElement = document.createElement('button');
buttonElement.innerHTML = 'Button';
buttonElement.addEventListener('click', () => {
    console.log('Button clicked');
});

const buttonObject = new CSS3DObject(buttonElement);
// 设置按钮的位置、旋转和缩放
buttonObject.scale.set(0.1, 0.1, 0.1);
buttonObject.position.set(0, 0, 0);
// buttonObject.rotation.set(rx, ry, rz);
// buttonObject.scale.set(sx, sy, sz);

scene.add(buttonObject);







function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta(); // 获取浏览器的刷新频率，设置动画刷新帧速率

    mixer.update(delta);

    controls.update();

    stats.update();

    renderer.render(scene, camera); // 小小东京
    cssRenderer.render(scene, camera); // 尝试渲染一个DOM元素按钮
}
