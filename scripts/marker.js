class Marker {
  constructor(material, geometry, label, cords, {
    textColor = 'white',
    pointColor = config.colors.globeMarkerColor,
    glowColor = config.colors.globeMarkerGlow
  } = {}) {
    this.material = material;
    this.geometry = geometry;
    this.labelText = label;
    this.cords = cords;

    this.isAnimating = false;

    this.textColor = textColor;
    this.pointColor = new THREE.Color(pointColor);
    this.glowColor = new THREE.Color(glowColor);

    this.group = new THREE.Group();
    this.group.name = 'Marker';

    this.createLabel();
    this.createPoint();
    this.createGlow();
    this.setPosition();

    groups.markers.add(this.group);
  }

  createLabel() {
    const text = this.createText();
    const texture = new THREE.Texture(text);
    texture.minFilter = THREE.LinearFilter;
    textures.markerLabels.push(texture);

    const material = new THREE.SpriteMaterial()
    material.map = texture;
    material.depthTest = false;
    material.useScreenCoordinates = false;

    this.label = new THREE.Sprite(material);
    this.label.scale.set( 40, 20, 1 );
    this.label.center.x = 0.25;
    this.label.translateY(2);

    this.group.add(this.label);
    elements.markerLabel.push(this.label);
  }

  createPoint() {
    this.point = new THREE.Mesh( this.geometry, this.material );
    this.point.material.color.set(this.pointColor);
    this.group.add(this.point);
    elements.markerPoint.push(this.point);
  }

  createGlow() {
    this.glow = new THREE.Mesh( this.geometry, this.material.clone() );
    this.glow.material.color.set(this.glowColor);
    this.glow.material.opacity = 0.6;
    this.group.add(this.glow);
    elements.markerPoint.push(this.glow);
  }

  animateGlow() {
    if(!this.isAnimating) {
      if(Math.random() > 0.99) {
        this.isAnimating = true;
      }
    } else if(this.isAnimating) {
      this.glow.scale.x += 0.025;
      this.glow.scale.y += 0.025;
      this.glow.scale.z += 0.025;
      this.glow.material.opacity -= 0.005;

      if(this.glow.scale.x >= 4) {
        this.glow.scale.x = 1;
        this.glow.scale.y = 1;
        this.glow.scale.z = 1;
        this.glow.material.opacity = 0.6;
        this.glow.isAnimating = false;
      }
    }
  }

  setPosition() {
    const {x, y, z} = this.cords
    this.group.position.set(-x, y, -z)
  }

  createText() {
    const element = document.createElement('canvas');
    const canvas = new fabric.Canvas(element);

    const text = new fabric.Text(this.labelText, {
      left: 0, top: 0, fill: this.textColor, 
      fontFamily: 'Open Sans',
    });

    canvas.add(text);
    return element;
  }
}
