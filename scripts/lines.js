class Lines {
	constructor() {
		this.countries = Object.keys(data.connections);
		this.total = this.countries.length;

		this.group = groups.lines = new THREE.Group();
		this.group.name = 'Lines';

		this.create();
		this.animate();
		this.createDots();
	}

	changeCountry() {
		countries.index++;

		if(countries.index >= this.total) {
			countries.index = 0;
		}

		if(countries.selected) {
			countries.selected.visible = false;
		}

		this.select();

		groups.lineDots.children = [];
		elements.lineDots = [];
		this.createDots();
	}

	createDots() {
		const lineDots = new Dots();
  		groups.globe.add(groups.lineDots);
	}

	animate() {
		if(!countries.selected) {
			this.select();
		}

		this.interval = setInterval(
			() => this.changeCountry(), 
			countries.interval
		)
	}

	select() {
		const next = this.countries[countries.index];
		const selected = groups.lines.getObjectByName(next);
		countries.selected = selected;
		countries.selected.visible = true;
	}

	create() {
		const {connections, countries} = data;

		for(let i in connections) {
			const start = getCountry(i, countries);
			const group = new THREE.Group();
			group.name = i;

			for(let j in connections[i]) {
				const end = connections[i][j];
				const line = new Line(start, end);
				elements.lines.push(line.mesh);
				group.add(line.mesh);
			}

			group.visible = false;
			groups.lines.add(group); 
		}
	}
}

class Line {
	constructor(start, end) {
		const {globe} = config.sizes;
		const {markers} = config.scale;

		this.start = start;
		this.end = end;
		this.radius = globe + globe * markers;
		
		this.curve = this.createCurve();

		this.geometry = new THREE.Geometry();
		this.geometry.vertices = this.curve.getPoints(200);
		this.material = this.createMaterial();

		this.line = new MeshLine();
		this.line.setGeometry(this.geometry);
		
		this.mesh = new THREE.Mesh(this.line.geometry, this.material);
		this.mesh._path = this.geometry.vertices;
	}

	createCurve() {
		const {start, end, mid1, mid2} = getSplineFromCoords(
			this.start.latitude,
			this.start.longitude,
			this.end.latitude,
			this.end.longitude,
			this.radius
		);

		return new THREE.CubicBezierCurve3(start, mid1, mid2, end)
	}

	createMaterial() {
		return new MeshLineMaterial({
			color: config.colors.globeLines,
			transparent: true,
			opacity: 0.45
		});
	}
}