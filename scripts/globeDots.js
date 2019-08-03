const createGlobePoints = function() {
  const total = data.grid.length;
  const radius = props.globe.radius;
  const scale = radius + radius * 0.015;
  const size = 6;

  const positionArray = [];
  const sizeArray = [];
  const colorsArray = [];

  var color = new THREE.Color();

  for(let i in data.grid) {
    const {lat, lon} = data.grid[i];
    const {x, y, z} = toSphereCoordinates(lat, lon, scale);
    positionArray.push(-x, -y, -z);

    sizeArray.push(size);

    color.set( props.colors.globePoint );
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
    alphaTest: 0.5
  });

  geometry.addAttribute('position', new THREE.BufferAttribute( positions, 3 ));
  geometry.addAttribute('customColor', new THREE.BufferAttribute( colors, 3 ));
  geometry.addAttribute('size', new THREE.BufferAttribute( sizes, 1 ));
  
  const points = new THREE.Points(geometry, material);

  groups.globe.add(points);
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