const createGlobe = () => {
  const radius = props.globe.radius;
  const widthS = 64;
  const heightS = 64;
  
  const geometry = new THREE.SphereGeometry(radius, widthS, heightS);
  
  const textureUrl = '../assets/textures/earth_dark.jpg';
  const globeMaterial = createGlobeMaterial(textureUrl);
  elements.globe = new THREE.Mesh( geometry, globeMaterial );

  const atmosphereMaterial = createAtmosphereMaterial();
  elements.atmosphere = new THREE.Mesh( geometry, atmosphereMaterial )
  elements.atmosphere.scale.set(1.2, 1.2, 1.2);
  
  groups.globe = new THREE.Group();
  groups.globe.name = 'Globe';
  groups.globe.add(elements.globe);
  groups.globe.add(elements.atmosphere);
  
  groups.main.add(groups.globe);
}

const createAtmosphereMaterial = () => {
  return new THREE.ShaderMaterial({
    vertexShader: shaders.atmosphere.vertexShader,
    fragmentShader: shaders.atmosphere.fragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    uniforms: {}
  });
}

const createGlobeMaterial = (url) => {
  return new THREE.ShaderMaterial({
    uniforms: {texture: { value: loader.load(url) }},
    vertexShader: shaders.globe.vertexShader,
    fragmentShader: shaders.globe.fragmentShader,
    blending: THREE.AdditiveBlending,
    transparent: true,
  })
}