const app = new App({ setup, animate });

window.onload = app.init;
window.onresize = app.handleResize;

const controls = {}


function setup(app) {
  app.addControlGui(gui => {})
  
  createSphere();
}

function animate(app) {

}


function createSphere() {
  const geometry = new THREE.SphereGeometry(10, 30, 30);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  material.opacity = 0.6;
  material.transparent = true;
  material.wireframe = true;

  const mesh = new THREE.Mesh( geometry, material );
  mesh.name = 'sphere';
  app.scene.add(mesh);
  return mesh;
}