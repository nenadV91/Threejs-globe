class Globe {
  constructor(radius) {
    this.radius = sizes.globe + sizes.globe * scale.globe;
    this.geometry = new THREE.SphereGeometry(this.radius, 64, 64);

    this.initGlobe();
    
    return groups.globe;
  }

  initGlobe() {
    this.globeMaterial = this.createGlobeMaterial();
    this.globe = new THREE.Mesh( this.geometry, this.globeMaterial );
    elements.globe = this.globe;
    groups.globe.add(this.globe);
  }

  initAtmosphere() {
    this.atmosphereMaterial = this.createGlobeAtmosphere();
    this.atmosphere = new THREE.Mesh( this.geometry, this.atmosphereMaterial )
    this.atmosphere.scale.set(1.2, 1.2, 1.2);
    elements.atmosphere = this.atmosphere;
    groups.globe.add(this.atmosphere); 
  }

  createGlobeMaterial() {
     return new THREE.ShaderMaterial({
      uniforms: {texture: { value: loader.load(urls.globeTexture) }},
      vertexShader: shaders.globe.vertexShader,
      fragmentShader: shaders.globe.fragmentShader,
      blending: THREE.AdditiveBlending,
      transparent: true,
    })
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