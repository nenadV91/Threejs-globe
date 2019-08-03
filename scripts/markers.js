class Markers {
  constructor(countries, {
    markerRadius = 2
  } = {}) {
    this.countries = countries;
    this.radius = sizes.globe + sizes.globe * scale.markers;

    groups.globeMarkers = new THREE.Group();
    groups.globeMarkers.name = 'GlobeMarkers';

    this.markerGeometry = new THREE.SphereGeometry(markerRadius, 15, 15);
    this.markerMaterial = new THREE.MeshBasicMaterial({color: props.colors.markerPoint});
    this.markerMaterial.transparent = true;
    this.markerMaterial.opacity = 0.8;

    this.create();
    return groups.globeMarkers;
  }

  create() {
    for(let i = 0; i < this.countries.length; i++) {
      const country = this.countries[i];
      if(country.latlng) {
        const [lat, lng] = country.latlng;
        const cords = toSphereCoordinates(lat, lng, this.radius);
        const marker = new Marker(this.markerMaterial, this.markerGeometry, country.name, cords);
        elements.markers.push(marker);
      }
    }
  }
}