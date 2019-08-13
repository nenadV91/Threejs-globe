class Globe {
  constructor(radius) {
    this.radius = config.sizes.globe;
    this.geometry = new THREE.SphereGeometry(this.radius, 64, 64);

    groups.globe = new THREE.Group();
    groups.globe.name = 'Globe';

    this.initGlobe();
    
    return groups.globe;
  }

  initGlobe() {
    const scale = config.scale.globeScale;
    this.globeMaterial = this.createGlobeMaterial();
    this.globe = new THREE.Mesh( this.geometry, this.globeMaterial );
    this.globe.scale.set(scale, scale, scale);
    elements.globe = this.globe;
    
    groups.map = new THREE.Group();
    groups.map.name = 'Map';

    groups.map.add(this.globe);
    groups.globe.add(groups.map);
  }

  initAtmosphere() {
    this.atmosphereMaterial = this.createGlobeAtmosphere();
    this.atmosphere = new THREE.Mesh( this.geometry, this.atmosphereMaterial )
    this.atmosphere.scale.set(1.2, 1.2, 1.2);
    elements.atmosphere = this.atmosphere;

    groups.atmosphere = new THREE.Group();
    groups.atmosphere.name = 'Atmosphere';

    groups.atmosphere.add(this.atmosphere);
    groups.globe.add(groups.atmosphere); 
  }

  createGlobeMaterial() {
    const texture = loader.load('null')
    console.log(texture)

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {texture: { value:  texture }},
      vertexShader: shaders.globe.vertexShader,
      fragmentShader: shaders.globe.fragmentShader,
      blending: THREE.AdditiveBlending,
      transparent: true,
    })

    const normalMaterial = new THREE.MeshBasicMaterial({
      blending: THREE.AdditiveBlending,
      transparent: true,
    })

    return shaderMaterial;
  }

  createGlobeAtmosphere() {
    return new THREE.ShaderMaterial({
      vertexShader: shaders.atmosphere.vertexShader,
      fragmentShader: shaders.atmosphere.fragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      uniforms: {}
    });
  }
}