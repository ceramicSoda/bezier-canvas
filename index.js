import * as THREE from 'three'; 
//---HELPER FUNCTIONS
const norm = (v, mult = 1) => {
    var mag = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
    let nV = [(v[0] / mag) * mult, (v[1] / mag) * mult, (v[2] / mag) * mult ];
    if (mag == 0) nV = [0,0,0];
    return nV;
}
const getDist = (p0, p1) => {
    let dx = p1[0] - p0[0];
    let dy = p1[1] - p0[1];
    let dz = p1[2] - p0[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
const getBezierP = (t, p0, p1, p2, p3) => {
    let c1 = Math.pow(1 - t, 3);
    let c2 = 3 * Math.pow(1 - t, 2) * t;
    let c3 = 3 * (1 - t) * Math.pow(t, 2);
    let c4 = Math.pow(t, 3);
    let coords = [];
    coords.push(c1 * p0[0] + c2 * p1[0] + c3 * p2[0] + c4 * p3[0]); // x 
    coords.push(c1 * p0[1] + c2 * p1[1] + c3 * p2[1] + c4 * p3[1]); // y
    coords.push(c1 * p0[2] + c2 * p1[2] + c3 * p2[2] + c4 * p3[2]); // z
    return coords;
}
//---BASIC CLASSES
class World{    
    constructor(){
        //---three things
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000); 
        this.renderer = new THREE.WebGLRenderer();
        //---level data
        this.approxAccur = 5000; //spline approximation accuracy
        this.subdivs = 4; //polygons per spline
        this.lgth = 0; 
        this.track = [];
        this.points = [];
        this.indecies = [];
    }
    genTrack(){
        
    }
    init(){
        const geometry = new THREE.IcosahedronGeometry(10, 0);
        const material = new THREE.MeshNormalMaterial({color: 0x000000}); 
        const ico = new THREE.Mesh(geometry, material);

        this.scene.background = new THREE.Color('skyblue');
        this.camera.position.z = -20;
        this.camera.position.x = -20;
        this.camera.position.y = -20;
        this.camera.lookAt(new THREE.Vector3(0,0,0));
        this.scene.add(this.camera, ico);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("app").appendChild(this.renderer.domElement);
    }
    render(){
        this.renderer.render(this.scene, this.camera); 
    }
    animate(){
        this.render();
        requestAnimationFrame(this.animate.bind(this));
        console.log("test commit");
    }
}
//---MAIN
const world = new World(); 
document.addEventListener("DOMContentLoaded", function() {
    world.init();
    world.animate(); 
});

window.addEventListener('resize', () => {
    world.camera.aspect = window.innerWidth / window.innerHeight;
    world.camera.updateProjectionMatrix(); 
    world.renderer.setSize(window.innerWidth, window.innerHeight);
})