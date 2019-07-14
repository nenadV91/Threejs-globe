class App {
  constructor({animate, setup}) {
    this.animate = animate;
    this.setup = setup;
    window.app = this;
  }

  init = () => {
    this.initScene();
    this.initRenderer();
    this.initCamera();
    this.initOrbitControls();
    this.initStats();

    this.render();
    this.update();
  }

  initScene = () => {
    this.scene = new THREE.Scene();
  }

  initRenderer = () => {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0x000000, 1.0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
  }

  initCamera = () => {
    this.ratio = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, this.ratio, 0.1, 1000);
    this.camera.lookAt(this.scene.position);
    this.camera.position.set(0, 15, 30);
  }

  initOrbitControls = () => {
    this.controls = new THREE.OrbitControls(this.camera);
  }

  initStats = () => {
    this.stats = new Stats();
    this.stats.setMode(0);
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';
    document.body.appendChild( this.stats.domElement );
  }

  render = () => {
    this.setup(this);
    document.body.appendChild(this.renderer.domElement);
  }

  update = () => {
    this.animate(this);
    this.stats.update();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.update);
  }

  addControlGui = callback => {
    var gui = new dat.GUI();
    callback(gui);
  }

  handleResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  rotate = (speed) => {
    const {camera, scene} = this;
    camera.position.x = camera.position.x * Math.cos(speed) + camera.position.z * Math.sin(speed);
    camera.position.z = camera.position.z * Math.cos(speed) - camera.position.x * Math.sin(speed);
    camera.lookAt(scene.position);
  }
}