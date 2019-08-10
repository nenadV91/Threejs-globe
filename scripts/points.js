class Points {
  constructor(grid) {
    this.grid = grid;
    this.total = grid.length;
    this.radius = config.sizes.globe + config.sizes.globe * config.scale.points;
    
    this.sizeArray = [];
    this.positionArray = [];
    this.colorsArray = [];

    groups.points = new THREE.Group();
    groups.points.name = 'Points';

    this.create();

    elements.globePoints = this.points;
    groups.points.add(this.points);
  }

  create() {
    const color = new THREE.Color();

    for(let i = 0; i < this.grid.length; i++) {
      const {lat, lon} = this.grid[i];
      const {x, y, z} = toSphereCoordinates(lat, lon, this.radius);
      
      this.positionArray.push(-x, -y, -z);
      this.sizeArray.push(this.pointSize);

      color.set(this.pointColor);
      color.toArray(this.colorsArray, i * 3);
    }

    const positions = new Float32Array(this.positionArray);
    const colors = new Float32Array(this.colorsArray);
    const sizes = new Float32Array(this.sizeArray);

    this.texture = new THREE.Texture(this.createTexture());
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.PointsMaterial({
      color: config.colors.globeDotColor,
      size: config.sizes.globeDotSize
    });

    this.geometry.addAttribute('position', new THREE.BufferAttribute( positions, 3 ));
    this.geometry.addAttribute('customColor', new THREE.BufferAttribute( colors, 3 ));
    this.geometry.addAttribute('size', new THREE.BufferAttribute( sizes, 1 ));
  
    this.points = new THREE.Points( this.geometry,  this.material );
  }

  updateColor(col) {
   const color = new THREE.Color();

    for(let i = 0; i < this.grid.length; i++) {
      color.set(col);
      color.toArray(this.colorsArray, i * 3);
    } 

    const colorsArray = new Float32Array(this.colorsArray);
    const colors = new THREE.BufferAttribute( colorsArray, 3 );
    this.geometry.attributes.customColor = colors;
  }

  createTexture() {
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
}