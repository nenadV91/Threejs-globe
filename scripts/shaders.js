const shaders = {
	atmosphere: {},
	globe: {},
	dot: {}
}

shaders.globe.vertexShader = `
	varying vec3 vNormal;
	varying vec2 vUv;
	void main() {
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		vNormal = normalize( normalMatrix * normal );
		vUv = uv;
	}
`

shaders.globe.fragmentShader = `
	uniform sampler2D texture;
	varying vec3 vNormal;
	varying vec2 vUv;
	void main() {
		vec3 diffuse = texture2D( texture, vUv ).xyz;
		float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );
		vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );
		gl_FragColor = vec4( diffuse + atmosphere, 1.0 );
	}
`

shaders.atmosphere.vertexShader = `
	varying vec3 vNormal;
	void main() {
		vNormal = normalize( normalMatrix * normal );
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	}
`

shaders.atmosphere.fragmentShader = `
	varying vec3 vNormal;
	void main() 
	{
		float intensity = pow( 0.7 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 4.0 ); 
	    gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;
	}
`


shaders.dot.vertexShader = `
	attribute float size;
	attribute vec3 customColor;
	varying vec3 vColor;
	void main() {
		vColor = customColor;
		vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
		gl_PointSize = size * ( 300.0 / -mvPosition.z );
		gl_Position = projectionMatrix * mvPosition;
	}
`


shaders.dot.fragmentShader = `
	uniform vec3 color;
	uniform sampler2D pointTexture;
	varying vec3 vColor;
	void main() {
		gl_FragColor = vec4( color * vColor, 1.0 );
		gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
		if ( gl_FragColor.a < ALPHATEST ) discard;
	}
`