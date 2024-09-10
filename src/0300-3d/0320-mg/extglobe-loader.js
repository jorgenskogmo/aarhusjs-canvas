import { data } from "./lib/extglobe-model.js";

export const loadModel = () => {
  console.log("setup ", data.length);

  const countries = [];

  const wm = new THREE.MeshBasicMaterial({
    color: 0x000044,
    transparent: true,
    opacity: 0.8,
  });



  const cm1 = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
  });

  const cm2 = new THREE.ShaderMaterial({
    uniforms: {
      scale: { type: "f", value: 1.0 },
    },
    vertexShader: vertexShaderSource,
    fragmentShader: normalShaderSource,
  });


  const cm = cm2; // #1

  const model = new THREE.Object3D();

  data.map((o) => {
    if (o.name == "water") {
      model.add(new THREE.Mesh(new THREE.SphereGeometry(500, 32, 32), wm));
    } else {
      let g = new THREE.Geometry();

      for (let i = 0; i < o.v.length; i += 3) {
        g.vertices.push(new THREE.Vector3(o.v[i], o.v[i + 1], o.v[i + 2]));
      }

      for (let i = 0; i < o.f.length; i += 3) {
        g.faces.push(new THREE.Face3(o.f[i], o.f[i + 1], o.f[i + 2]));
      }

      g.verticesNeedUpdate = true;
      g.computeFaceNormals();

      const m = new THREE.Mesh(g, cm.clone());
      m.geometry.computeBoundingBox();
      const size = m.geometry.boundingBox.getSize().length();
      if (size > 20) {
        m.name = o.name;
        model.add(m);
        countries.push(m);
      } else {
        // console.log("Hiding ", o.name, "size:", size);
      }
    }
  });

  model.rotation.y = 90 * (Math.PI / 180);

  return { model, countries };
};

const vertexShaderSource = `
  const float WATER_HEIGHT = 500.0;  // 500
  const float MAX_HEIGHT = 0.5;      // 0.5
  
  uniform float scale;
  uniform vec4 color;
  varying vec3 vNormal;
  
  void main() {
    vNormal = normalMatrix * normal;
    float height = length(position);
    
    // float s = 1.0 + scale; //#3 (anim on first)
    float s = height < WATER_HEIGHT ? 1.0 : 1.0 + MAX_HEIGHT * scale;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( s * position, 1.0 );
  }
`;

const normalShaderSource = `

	varying vec3 vNormal;
	uniform vec4 color;
	
	void main() {
		vec3 light = vec3(0.0,0.0,1.0);
		float dProd = (dot(vNormal, light) + 1.0)/2.0;
		gl_FragColor = vec4(dProd, dProd, dProd, 1.0) * color;
		gl_FragColor.rgb = 0.5 + 0.5 * vNormal;
	}
`;


// const vertexShaderSource = `
//   const float WATER_HEIGHT = 500.0;  // 500
//   const float MAX_HEIGHT = 0.5;      // 0.5
  
//   uniform float scale;
//   uniform vec4 color;
//   varying vec3 vNormal;
  
//   void main() {
//     vNormal = normalMatrix * normal;
//     float height = length(position);
//     float s = height < WATER_HEIGHT ? 1.0 : 1.0 + MAX_HEIGHT * scale;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4( s * position, 1.0 );
//   }
// `;
