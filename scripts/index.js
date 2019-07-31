const app = new App({ setup, animate, preload });

window.onload = app.init;
window.onresize = app.handleResize;

const loader = new THREE.TextureLoader();
const controls = {}
const data = {}

const elements = {
  globe: null,
  atmosphere: null,
  globeDots: null
}

const groups = {
  main: null,
  globe: null,
  globePoints: null
}

const props = {
  colors: {
    globePoint: 'blue'
  },
  globe: {
    radius: 200
  },
  map: {
    width: 2048 / 2,
    height: 1024 / 2
  }
}


async function preload() {
  try {
    const countriesUrl = '../assets/data/grid.json';
    const countryRes = await fetch(countriesUrl);
    const countries = await countryRes.json();
    data.countries = countries;
    return true;
  } catch(error) {
    console.log(error);
  }
}

function setup(app) {
  app.camera.position.z = props.globe.radius * 2.45;
  app.controls.enableDamping = true;
  app.controls.dampingFactor = 0.05;
  app.controls.rotateSpeed = 0.07;

  groups.main = new THREE.Group();
  groups.main.name = 'Main';

  app.scene.add(groups.main);

  createGlobe();
  createGlobePoints();
}

function animate(app) {
  if(elements.globeDots) {
    elements.globeDots.material.map.needsUpdate = true;
  }
}

const createGlobePoints = function() {
  const total = data.countries.length;
  const radius = props.globe.radius;
  const scale = radius + radius * 0.025;
  const size = 4;

  const positionArray = [];
  const sizeArray = [];
  const colorsArray = [];

  var color = new THREE.Color();

  for(let i in data.countries) {
    const {lat, lon} = data.countries[i];
    const {x, y, z} = toSphereCoordinates(lat, lon, scale);
    positionArray.push(x, y, z);
    
    const randomSize = size + Math.random() * size;
    sizeArray.push(randomSize);

    color.setRGB( 0.062, 0.807, 0.882 );
    color.toArray( colorsArray, i * 3 );
  }

  const positions = new Float32Array(positionArray);
  const colors = new Float32Array(colorsArray);
  const sizes = new Float32Array(sizeArray);

  const texture = new THREE.Texture(createDotTexture());
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color( 0xffffff ) },
      pointTexture: { value: loader.load( "../assets/imgs/disc.png" ) }
    },
    vertexShader: shaders.dot.vertexShader,
    fragmentShader: shaders.dot.fragmentShader,
    alphaTest: 0.9
  });

  geometry.addAttribute('position', new THREE.BufferAttribute( positions, 3 ));
  geometry.addAttribute('customColor', new THREE.BufferAttribute( colors, 3 ));
  geometry.addAttribute('size', new THREE.BufferAttribute( sizes, 1 ));
  
  const points = new THREE.Points(geometry, material);

  groups.globeDots = new THREE.Group();
  groups.globeDots.name = 'GlobeDots';
  groups.globeDots.add(points);
  groups.main.add(groups.globeDots);
}


const createDotTexture = () => {
  const radius = 60;
  const element = document.createElement('canvas');
  const canvas = new fabric.Canvas(element);

  canvas.setHeight(radius);
  canvas.setWidth(radius);

  const rect = new fabric.Rect({
    width: radius,
    height: radius,
    fill: 'white'
  })

  const circle = new fabric.Circle({
    radius: radius / 2 - 2,
    fill: 'blue',
    left: 1,
    top: 1
  })

  canvas.add(rect);
  canvas.add(circle);
  return element;
}


function toSphereCoordinates(lat, lng, scale) {
  var phi = (90 - lat) * Math.PI / 180;
  var theta = (180 - lng) * Math.PI / 180;
  var x = -scale * Math.sin(phi) * Math.cos(theta);
  var y = -scale * Math.cos(phi);
  var z = -scale * Math.sin(phi) * Math.sin(theta);
  return {x, y, z};
}