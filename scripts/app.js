class App {
  constructor({animate, setup, preload}) {
    this.preload = preload;
    this.animate = animate;
    this.setup = setup;
    window.app = this;
  }

  init = async () => {
    this.initScene();
    this.initRenderer();
    this.initCamera();
    this.initControls();
    this.initStats();

    if(this.preload) {
      await this.preload();
    }

    this.render();
    this.update();
  }

  initScene = () => {
    this.scene = new THREE.Scene();
  }

  initRenderer = () => {
    this.renderer = new THREE.WebGLRenderer({alpha: true});
    this.renderer.setClearColor(0x000000, 1.0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio * 1.5);
    this.renderer.shadowMap.enabled = true;
    this.renderer.antialias = true;
  }

  initCamera = () => {
    this.ratio = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, this.ratio, 0.1, 10000);
    this.camera.lookAt(this.scene.position);
    this.camera.position.set(0, 15, 30);
  }

  initControls = () => {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
  }

  initStats = () => {
    this.stats = new Stats();
    this.stats.setMode(0);
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.right = '10px';
    this.stats.domElement.style.bottom = '10px';
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
}