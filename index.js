import * as THREE from 'three'; 
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//---STATIC DATA
const trackCurve = [[[30,-56,-77],[41,-105,-72],[21,-14,-82]],[[127,-60,-54],[84,-20,-48],[169,-100,-61]],[[147,46,-59],[191,1,-66],[103,91,-53]],[[44,48,-3],[116,69,-32],[-27,27,25]],[[-106,121,13],[-26,74,-6],[-186,168,31]],[[-161,71,-29],[-173,85,-28],[-150,56,-30]],[[-188,8,-70],[-176,34,-79],[-200,-18,-60]],[[-93,-62,44],[-159,-82,71],[-26,-42,17]],[[14,-96,-64],[-13,-87,-55],[24,-98,-68]]]; 

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
        this.controls = new OrbitControls(this.camera, this.renderer.domElement); 
        //---level data
        this.approxAccur = 5000; //spline approximation accuracy
        this.interval = 2; // ..each units per track section
        this.lgth = 0; 
        this.geom = [];
        this.track = [];
        this.indecies = [];
    }
    genTrack(track){
        let steps = 0; 
        track.forEach((curve,cur,curves) => {
            let next = cur + 1;
            if (cur == (curves.length - 1))
                next = 0;
            for (let i = 0; i < this.approxAccur; i++){
                let d0 = getBezierP(i / this.approxAccur, curves[cur][0], curves[cur][2], curves[next][1], curves[next][0]);
                let d1 = getBezierP((i + 1) / this.approxAccur, curves[cur][0], curves[cur][2], curves[next][1], curves[next][0]);
                let dx = getDist(d0, d1);
                this.lgth += dx;
                if (this.lgth >= (this.interval * steps)){
                    this.track.push(d0);
                    let v = [d0[0] - d1[0], d0[1] - d1[1], d0[2] - d1[2]];
                    let vl = norm([v[1], -v[0], 0], 10); // vector by left hand
                    let vu = norm([]);
                    let segment = []; // road segment by points
                    this.geom.push(d0[0], d0[2], d0[1]);
                    this.geom.push(d0[0] - vl[0], d0[2] - vl[2], d0[1] - vl[1]);
                    this.geom.push(d0[0] + vl[0], d0[2] + vl[2], d0[1] + vl[1]);
                    let last = this.geom.length / 3; 
                    if (last > 5 && last % 3 == 0){
                        this.indecies.push(last - 6, last - 3, last - 5);
                        this.indecies.push(last - 5, last - 3, last - 2);
                        this.indecies.push(last - 6, last - 4, last - 3);
                        this.indecies.push(last - 4, last - 1, last - 3);
                    }
                    steps++; 
                }
            }
        });
    }
    init(){
        this.genTrack(trackCurve); 
        const geometry = new THREE.BufferGeometry();
        geometry.setIndex(this.indecies);
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.geom), 3));
        geometry.computeVertexNormals();
        const material = new THREE.MeshNormalMaterial(); 
        const ico = new THREE.Mesh(geometry, material);
        this.scene.background = new THREE.Color('#141417');
        this.camera.position.set(100,100,100)
        this.camera.lookAt(0,0,0);
        this.scene.add(this.camera, ico);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("app").appendChild(this.renderer.domElement);
        this.controls.update();
    }
    render(){
        this.controls.update();
        this.renderer.render(this.scene, this.camera); 
    }
    animate(){
        this.render();
        requestAnimationFrame(this.animate.bind(this));
    }
}

//---MAIN
const world = new World(); 
document.addEventListener("DOMContentLoaded", function() {
    world.init();
    world.animate(); 
    console.log(world); 
});

window.addEventListener('resize', () => {
    world.camera.aspect = window.innerWidth / window.innerHeight;
    world.camera.updateProjectionMatrix(); 
    world.renderer.setSize(window.innerWidth, window.innerHeight);
})