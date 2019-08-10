const app = new App({ setup, animate, preload });

window.onload = app.init;
window.onresize = app.handleResize;

const loader = new THREE.TextureLoader();
const controls = {}
const data = {}


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
  const controllers = [];

  app.addControlGui(gui => {
    controllers.push(gui.addColor(config.colors, 'globeDotColor'))
    controllers.push(gui.addColor(config.colors, 'globeMarkerColor'))
    controllers.push(gui.addColor(config.colors, 'globeMarkerGlow'))
    controllers.push(gui.addColor(config.colors, 'globeLines'))

    controllers.push(gui.add(config.sizes, 'globeDotSize', 1, 5))
    controllers.push(gui.add(config.scale, 'globeScale', 0.1, 1))

    controllers.push(gui.add(config.display, 'map'))
    controllers.push(gui.add(config.display, 'points'))
    controllers.push(gui.add(config.display, 'markers'))

  });

  controllers.forEach(controller => {
    controller.onChange((event) => {
      controls.changed = true;
    })
  })

  app.camera.position.z = config.sizes.globe * 2.45;
  app.camera.position.y = config.sizes.globe * 0;
  app.controls.enableDamping = true;
  app.controls.dampingFactor = 0.05;
  app.controls.rotateSpeed = 0.07;

  groups.main = new THREE.Group();
  groups.main.name = 'Main';

  const globe = new Globe();
  groups.main.add(globe);

  const points = new Points(data.grid);
  groups.globe.add(groups.points);

  const markers = new Markers(data.countries);
  groups.globe.add(groups.markers);

  const lines = new Lines();
  groups.globe.add(groups.lines);

  app.scene.add(groups.main);
}


function animate(app) {
  if(controls.changed) {
    if(elements.globePoints) {
      elements.globePoints.material.size = config.sizes.globeDotSize;
      elements.globePoints.material.color = new THREE.Color(config.colors.globeDotColor);
    }

    if(elements.globe) {
      elements.globe.scale.set(
        config.scale.globeScale, 
        config.scale.globeScale, 
        config.scale.globeScale
      );
    }

    if(elements.lines) {
      for(let i = 0; i < elements.lines.length; i++) {
        const line = elements.lines[i];
        line.material.color = new THREE.Color(config.colors.globeLines);
      }
    }


    groups.map.visible = config.display.map;
    groups.markers.visible = config.display.markers;
    groups.points.visible = config.display.points;

    controls.changed = false
  }

  if(elements.markers) {
    for(let i = 0; i < elements.markers.length; i++) {
      const marker = elements.markers[i];
      marker.point.material.color = new THREE.Color(config.colors.globeMarkerColor);
      marker.glow.material.color = new THREE.Color(config.colors.globeMarkerGlow);
      marker.label.material.map.needsUpdate = true;
      marker.animateGlow();
    }
  }
}

