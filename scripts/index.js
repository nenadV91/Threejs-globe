const app = new App({ setup, animate });

window.addEventListener('resize', app.handleResize, false);
window.addEventListener('mousemove', handleMouseMove, false);
window.addEventListener('click', handleClick, false);
window.onload = app.init;

function setup(app) {
  const geometry = new THREE.SphereGeometry(10, 30, 30);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
  const sphere = new THREE.Mesh( geometry, material );
  app.scene.add(sphere);
}

function animate(app) {

}

function handleMouseMove(event) {

}

function handleClick(event) {

}