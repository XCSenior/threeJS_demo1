import * as THREE from 'three';

/* 第一步：准备好渲染器、场景、相机 */
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();


/* 第二步：定义材质 */
const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

/* 第三步：创建带有顶点的几何体（geometry） */
const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));

const geometry = new THREE.BufferGeometry().setFromPoints(points);

/* 第四步：组合“点”和材质，形成一条线 */
const line = new THREE.Line(geometry, material);


/* 最后一步，添加进场景中，调用render函数渲染 */
scene.add(line);
renderer.render(scene, camera);


