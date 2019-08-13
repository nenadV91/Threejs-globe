const app = new App({ setup, animate, preload });

window.onload = app.init;
window.onresize = app.handleResize;

const loader = new THREE.TextureLoader();
const controls = {}
const data = {}


async function preload() {
  try {
    // const gridUrl = '../assets/data/grid.json';
    // const gridRes = await fetch(gridUrl);
    // const grid = await gridRes.json();
    // data.grid = grid;

    // const countryUrl = '../assets/data/countries.json';
    // const countryRes = await fetch(countryUrl);
    // const countries = await countryRes.json();
    // data.countries = countries;

    // const connectionsUrl = '../assets/data/connections.json';
    // const connectionsRes = await fetch(connectionsUrl);
    // const connections = await connectionsRes.json();
    // data.connections = getCountries(connections, countries);    

    return true;
  } catch(error) {
    console.log(error);
  }
}


function setup(app) {
  const controllers = [];

  app.addControlGui(gui => {
    const colorFolder = gui.addFolder('Colors');
    controllers.push(colorFolder.addColor(config.colors, 'globeDotColor'))
    controllers.push(colorFolder.addColor(config.colors, 'globeMarkerColor'))
    controllers.push(colorFolder.addColor(config.colors, 'globeMarkerGlow'))
    controllers.push(colorFolder.addColor(config.colors, 'globeLines'))
    controllers.push(colorFolder.addColor(config.colors, 'globeLinesDots'))
    
    const sizeFolder = gui.addFolder('Sizes')
    controllers.push(sizeFolder.add(config.sizes, 'globeDotSize', 1, 5))
    controllers.push(sizeFolder.add(config.scale, 'globeScale', 0.1, 1))
    
    const displayFolder = gui.addFolder('Display');
    controllers.push(displayFolder.add(config.display, 'map'))
    controllers.push(displayFolder.add(config.display, 'points'))
    controllers.push(displayFolder.add(config.display, 'markers'))
    controllers.push(displayFolder.add(config.display, 'markerLabel'))
    controllers.push(displayFolder.add(config.display, 'markerPoint'))
    
    const animationsFolder = gui.addFolder('Animations');
    controllers.push(animationsFolder.add(animations, 'rotateGlobe'))

    
    sizeFolder.open();
  });

  controllers.forEach(controller => {
    controller.onChange((event) => {
      controls.changed = true;
    })
  })

  app.camera.position.z = config.sizes.globe * 2.85;
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
      elements.globePoints.material.color.set(config.colors.globeDotColor);
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
        line.material.color.set(config.colors.globeLines);
      }
    }

    groups.map.visible = config.display.map;
    groups.markers.visible = config.display.markers;
    groups.points.visible = config.display.points;

    for(let i = 0; i < elements.markerLabel.length; i++) {
      const label = elements.markerLabel[i];
      label.visible = config.display.markerLabel;
    }

    for(let i = 0; i < elements.markerPoint.length; i++) {
      const point = elements.markerPoint[i];
      point.visible = config.display.markerPoint;
    }

    controls.changed = false
  }



  if(elements.lineDots) {
    for(let i = 0; i < elements.lineDots.length; i++) {
      const dot = elements.lineDots[i];
      dot.material.color.set(config.colors.globeLinesDots);
      dot.animate();
    }
  }

  if(elements.markers) {
    for(let i = 0; i < elements.markers.length; i++) {
      const marker = elements.markers[i];
      marker.point.material.color.set(config.colors.globeMarkerColor);
      marker.glow.material.color.set(config.colors.globeMarkerGlow);
      marker.label.material.map.needsUpdate = true;
      marker.animateGlow();
    }
  }

  if(animations.rotateGlobe) {
    groups.globe.rotation.y -= 0.0025;
  }
}

