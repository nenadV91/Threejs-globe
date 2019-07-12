class App {
  constructor({animate, setup}) {
    this.animate = animate;
    this.setup = setup;
    window.app = this;
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

    this.camera.position.x = 0;
    this.camera.position.y = 10;
    this.camera.position.z = 55;
    this.camera.lookAt(this.scene.position);
  }

  addControlGui = callback => {
    var gui = new dat.GUI();
    callback(gui);
  }

  initOrbitControls = () => {
    this.orbitControls = new THREE.OrbitControls(this.camera);
  }

  initStats = () => {
    this.stats = new Stats();
    this.stats.setMode(0);

    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';

    document.body.appendChild( this.stats.domElement );
  }

  init = () => {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initStats();
    this.initOrbitControls();
    this.setup(this);

    document.body.appendChild(this.renderer.domElement);
    this.render();
  }

  render = () => {
    this.animate(this);
    this.stats.update();
    this.orbitControls.update();
    
    requestAnimationFrame(this.render);
    this.renderer.render(this.scene, this.camera);
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