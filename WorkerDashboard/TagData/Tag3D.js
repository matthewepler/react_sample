import * as THREE from 'three'
import OBJLoader from 'three-obj-loader'
OBJLoader(THREE)
import OBJUrl from 'file-loader!images/case.obj'
import TWEEN from 'tween.js'

const sceneWidth = 250
const sceneHeight = 285

let scene = null
let camera = null
let renderer = null
let mesh = null

export function init3D (targetElement) {
  return new Promise((resolve, reject) => {
    try {
      scene = new THREE.Scene()
      scene.background = new THREE.Color(1, 1, 1)

      camera = new THREE.PerspectiveCamera(75, sceneWidth / sceneHeight, 0.1, 10000)
      camera.position.z = 5

      const spotLight = new THREE.SpotLight(0xffffff)
      spotLight.position.set(100, 1000, 1000)
      spotLight.castShadow = true
      spotLight.shadow.mapSize.width = sceneWidth
      spotLight.shadow.mapSize.height = sceneHeight
      spotLight.shadow.camera.near = 500
      spotLight.shadow.camera.far = 4000
      spotLight.shadow.camera.fov = 30
      scene.add(spotLight)

      const loader = new THREE.OBJLoader()
      loader.load(OBJUrl, (obj) => {
        obj.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.geometry.translate(0, -0.2, 0.15)
          }
        })
        mesh = obj
        mesh.castShadow = true
        mesh.rotation.y = Math.PI
        mesh.rotation.z = Math.PI

        mesh.scale.set(2.5, 2.5, 2.5)
        scene.add(mesh)
      })

      // origin reference object for debugging
      // let geometry = new THREE.BoxGeometry(1, 1, 1)
      // const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
      // const cube = new THREE.Mesh(geometry, material)
      // scene.add(cube)

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(sceneWidth, sceneHeight)

      document.getElementById(targetElement).appendChild(renderer.domElement)
      document.getElementsByTagName('canvas')[0].style.cssFloat = 'right'

      render3D()
      resolve(true)
    } catch (err) {
      reject(false)
    }
  })
}

export function render3D (rotX, rotY, rotZ) {
  requestAnimationFrame(render3D)
  TWEEN.update()

  // auto rotation each frame, for debugging
  // mesh.rotation.x += 0.001
  // mesh.rotation.y += 0.0005
  // mesh.rotation.z += 0.0015

  renderer.render(scene, camera)
}

function animateVector3 (vectorToAnimate, target, options) {
  options = options || {}

  // get targets from options or set to defaults
  const to = new THREE.Vector3(target.x, target.y, target.z) || THREE.Vector3()
  const easing = TWEEN.Easing.Quadratic.InOut
  const duration = options.duration || 1000

  // create the tween
  const tweenVector3 = new TWEEN.Tween(vectorToAnimate)
    .to({ x: to.x, y: to.y, z: to.z }, duration)
    .easing(easing)
    .onUpdate(function (d) {
      if (options.update) {
        // pass in a function via options for feedback on progress
        options.update(d)
      }
    })
    .onComplete(function () {
      // pass in a function via options for verification of completion
      if (options.callback) options.callback()
    })

  // start the tween
  tweenVector3.start()

  // return the tween in case we want to manipulate it later on
  return {
    x: tweenVector3.x,
    y: tweenVector3.y,
    z: tweenVector3.z
  }
}

export function animateTag (toVec) {
  animateVector3(mesh.rotation, toVec)
}

