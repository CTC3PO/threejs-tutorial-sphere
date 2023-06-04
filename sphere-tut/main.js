//IMPORT 
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import gsap from "gsap"  //install: npm i gsap
import './style.css'

//create Scene 
const scene = new THREE.Scene();

//Sizes (for camera width and height)
const sizes = {
  width: window.innerWidth, 
  height: window.innerHeight,
}

//add light 
const light = new THREE.PointLight(0xffffff, 1, 100) 
light.position.set(0,10,10)
light.intensity = 1.25 
scene.add(light) 

// Create our sphere
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({
  color: '#00ff83', 
  roughness: 0.5, // this value gives the gloss leve, the lower the glossier

})
const mesh = new THREE.Mesh(geometry, material);

//CAMERA 
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height , 0.1, 100) //100 is the clipping point/frame
// move the camera position so it's not on top of the geometry (20 is unit, can be cm, meter, etc.)
camera.position.z = 20


// add mesh to scene
scene.add(mesh) 
//add camera to scene
scene.add(camera)



//Render the scene to the canvas (canvas added to index.html)
//Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({canvas})

//define how big is canvas and how to render
renderer.setSize(sizes.width, sizes.height)
// x2 pixel ratio (for width and height to increase resolution of the rendered sphere)
renderer.setPixelRatio(2)
//then, redner out scene and camera 
renderer.render(scene, camera) 

//CONTROLS (for moving object around)
const controls = new OrbitControls(camera, canvas) 
// enableDamping is to let sphere move a bit after we let go, also update controls in the loop function
controls.enableDamping = true  
//enable autorotate
controls.autoRotate = true 
controls.autoRotateSpeed = 5
//disable panning and zooming function
controls.enablePan = false 
controls.enableZoom  = false 

//RESIZE 
window.addEventListener('resize', () => {
  //update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  //update camera (aspect ratio)
  camera.aspect = sizes.width/sizes.height
  camera.updateProjectionMatrix() //update this for rerender when we change browser size
  renderer.setSize(sizes.width, sizes.height)
})

// Rerender the canvas everytime we resize - by making a loop 
// for when reszie the frame, it rerender. Then call the loop
const loop = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}

loop() 

//Timeline magic (to animate) 
const tl = gsap.timeline({defaults: {duration: 1 }})
//grap the mesh (sphere) and try to scale it first {} is from, second{} is to
tl.fromTo(mesh.scale, {z:0, x: 0, y:0}, {z: 1, x:1, y:1})
tl.fromTo('nav', {y: "-100%"}, {y: "0%"})  //this to give the effect of the top nav appear when refreshed
tl.fromTo(".title", {opacity: 0}, {opacity:1})  //this to make title appear when refreshed

//Mouse Animation Color 
//only when change color when mouse is down and drag, not when just hovering over
let mouseDown = false
//rgb value
let rgb = []
//add event listener on mousedown
window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = false))

//only change color when mouse is down
window.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255), //x-axis, divide to 255 segments for mouse move
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ]

    //let's animate, we define the rgb value
    let newColor = new THREE.Color(`rgb (${rgb.join(",")})`) //to help interpolate the color template for below

    gsap.to(mesh.material.color, {
      r: newColor.r, 
      g :newColor.g,
      b: newColor.b,
    })
  }
})