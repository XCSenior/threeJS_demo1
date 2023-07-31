import * as THREE from "three";

import Stats from "three/examples/jsm/libs/stats.module.js";

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
camera.position.set(5, 2, 8);

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



const markerTexture = new THREE.TextureLoader().load('/public/images/poi-marker-default.png'); // 替换为你自己的标记图片
const markerMaterial = new THREE.SpriteMaterial({ map: markerTexture });

const marker = new THREE.Sprite(markerMaterial);
marker.scale.set(1, 1, 1); // 设置标记的大小
marker.position.set(1, 3, 0); // 设置标记的位置

scene.add(marker);


window.addEventListener('click', onClick, false);

function onClick(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    /* 给marker设置点击事件 */
    const intersects = raycaster.intersectObject(marker);
    if (intersects.length > 0) {
        // 点击了Marker
        console.log('Marker clicked');

        // const markerPosition = intersects[0].point.clone();
        const markerPosition = marker.getWorldPosition(new THREE.Vector3()).project(camera);
        const div = document.createElement('div');
        div.style.width = '100px';
        div.style.height = '100px';
        div.style.backgroundColor = 'red';
        div.style.position = 'absolute';
        div.style.top = `${markerPosition.y + 100}px`; // 在 marker 上方 10px 的位置
        div.style.left = `${markerPosition.x + 100}px`; // 在 marker 右方 10px 的位置
        container.appendChild(div);
    }
}




function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta(); // 获取浏览器的刷新频率，设置动画刷新帧速率

    mixer.update(delta);

    controls.update();

    stats.update();

    // marker.lookAt(camera.position); // 使标记始终朝向相机
    renderer.render(scene, camera);
}
