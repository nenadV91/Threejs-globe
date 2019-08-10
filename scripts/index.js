const app = new App({ setup, animate, preload });

window.onload = app.init;
window.onresize = app.handleResize;

const loader = new THREE.TextureLoader();
const controls = {}
const data = {}

const urls = {
  globeTexture: '../assets/textures/earth_dark.jpg',
  pointTexture: '../assets/imgs/disc.png'
}

const elements = {
  globe: null,
  atmosphere: null,
  markers: [],
  lines: []
}

const textures = {
  markerLabels: []
}

const groups = {
  main: null,
  globe: null,
  lines: null
}

const sizes = {
  globe: 200
}

const props = {
  rotation: {
    globe: 0.001
  },
  colors: {
    globePoint: 'rgb(255, 204, 0)',
    markerPoint: 'rgb(143, 216, 216)',
    markerGlow: 'rgb(255, 255, 255)',
    lines: new THREE.Color('#18FFFF')
  },
  map: {
    width: 2048 / 2,
    height: 1024 / 2
  },
  countries: {
    selected: null,
    selectedIndex: 0,
    total: 25
  }
}

const scale = {
  points: 0.025,
  markers: 0.025,
  globe: 0
}

const countries = {
  interval: 50000,
  selected: null,
  index: 0
}



async function preload() {
  try {
    const gridUrl = '../assets/data/grid.json';
    const gridRes = await fetch(gridUrl);
    const grid = await gridRes.json();
    data.grid = grid;

    const countryUrl = '../assets/data/countries.json';
    const countryRes = await fetch(countryUrl);
    const countries = await countryRes.json();
    data.countries = countries;

    const connectionsUrl = '../assets/data/connections.json';
    const connectionsRes = await fetch(connectionsUrl);
    const connections = await connectionsRes.json();
    data.connections = getCountries(connections, countries);    

    return true;
  } catch(error) {
    console.log(error);
  }
}


function setup(app) {
  app.camera.position.z = sizes.globe * 2.45;
  app.camera.position.y = sizes.globe * 0;
  app.controls.enableDamping = true;
  app.controls.dampingFactor = 0.05;
  app.controls.rotateSpeed = 0.07;

  groups.main = new THREE.Group();
  groups.main.name = 'Main';

  const globe = new Globe();
  groups.main.add(globe);

  const points = new Points(data.grid);
  groups.globe.add(points);

  const markers = new Markers(data.countries);
  groups.globe.add(markers);

  const lines = new Lines();
  groups.globe.add(lines);

  app.scene.add(groups.main);
}


function animate(app) {
  if(elements.globeDots) {
    elements.globeDots.material.map.needsUpdate = true;
  }

  // if(groups.globe) {
  //   groups.globe.rotation.y += props.rotation.globe;
  // }

  if(elements.markers) {
    for(let i = 0; i < elements.markers.length; i++) {
      const marker = elements.markers[i];
      marker.label.material.map.needsUpdate = true;
      marker.animateGlow();
    }
  }
}

