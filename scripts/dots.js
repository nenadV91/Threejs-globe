class Dots {
	constructor() {
		this.total = config.dots.total;

		groups.lineDots = new THREE.Group();
		groups.lineDots.name = 'LineDots';

		this.create();
	}

	create() {
		for(let i = 0; i < config.dots.total; i++) {
			const dot = new Dot();
			groups.lineDots.add(dot.mesh);
			elements.lineDots.push(dot);
		}
	}
}

class Dot {
	constructor() {
		this.radius = 2;
		this.segments = 32;
		this.rings = 32;

		this.geometry = new THREE.SphereGeometry(this.radius, this.segments, this.rings);
		this.material = new THREE.MeshBasicMaterial({color: config.colors.globeLinesDots});
		this.material.transparent = true;
		this.material.opacity = 0.65;

		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.visible = false;

		this._path = null;
		this._pathIndex = 0;
	}

	assignToLine() {
		if(countries.selected) {
			const lines = countries.selected.children
			const index = Math.floor(Math.random() * lines.length);
			const line = lines[index];
			this._path = line._path;
		}
	}

	animate() {
		if(!this._path) {
			if(Math.random() > 0.99) {
				this.assignToLine();
				this._pathIndex = 0;
			}
		} else if(this._path && this._pathIndex < this._path.length - 1) {
			if(!this.mesh.visible) {
				this.mesh.visible = true;
			}

			const {x, y, z} = this._path[this._pathIndex];
			this.mesh.position.set(x, y, z);
			this._pathIndex++;
		} else {
			this.mesh.visible = false;
			this._path = null;
		}
	}
}