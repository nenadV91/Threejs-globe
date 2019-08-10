class Lines {
	constructor() {
		this.countries = Object.keys(data.connections);
		this.total = this.countries.length;

		this.group = groups.lines = new THREE.Group();
		this.group.name = 'Lines';

		this.create();
		this.animate();
	}

	animate() {
		if(!countries.selected) {
			this.select();
		}

		this.interval = setInterval(() => {
			countries.index++;

			if(countries.index >= this.total) {
				countries.index = 0
			}

			if(countries.selected) {
				countries.selected.visible = false;
			}

			this.select()
		}, countries.interval)
	}

	select() {
		const next = this.countries[countries.index];
		const selected = groups.lines.getObjectByName(next);
		countries.selected = selected;
		countries.selected.visible = true;
	}

	create() {
		const {connections, countries} = data;
		const geometry = new THREE.Geometry();
		const radius = config.sizes.globe + config.sizes.globe * config.scale.markers;

		for(let i in connections) {
			const startCountry = getCountry(i, countries);
			const group = new THREE.Group();
			group.name = i;

			for(let j in connections[i]) {
				const endCountry = connections[i][j];

				const {start, end, mid1, mid2} = getSplineFromCoords(
					startCountry.latitude,
					startCountry.longitude,
					endCountry.latitude,
					endCountry.longitude,
					radius
				);

				const curve = new THREE.CubicBezierCurve3(start, mid1, mid2, end)

				geometry.vertices = curve.getPoints(200);

				const line = new MeshLine();
				line.setGeometry(geometry);

				const material = new MeshLineMaterial({
					color: config.colors.globeLines,
					transparent: true,
					opacity: 0.45
				});

				const curveObject = new THREE.Mesh(line.geometry, material);
				curveObject._path = geometry.vertices;

				elements.lines.push(curveObject);

				group.add(curveObject);
			}

			group.visible = false;
			groups.lines.add(group); 
		}
	}
}