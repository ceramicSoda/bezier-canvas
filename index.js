import * as THREE from 'three'; 
//---HELPER FUNCTIONS
const normzile = (v, mult = 1) => {
    var mag = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
    let nV = [(v[0] / mag) * mult, (v[1] / mag) * mult, (v[2] / mag) * mult ];
    if (mag == 0) nV = [0,0,0];
    return nV;
}
const getDistance = (p0, p1) => {
    let dx = p1[0] - p0[0];
    let dy = p1[1] - p0[1];
    let dz = p1[2] - p0[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
const getBezierPoint = (t, p0, p1, p2, p3) => {
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
        this.camera = new THREE.PerspectiveCamera( 75, window.innerHeight, window.innerWidth, 0.1, 1000); 
        this.renderer = new THREE.WebGLRenderer();
        //---level data
        this.subdivs = 4; 
        this.lgth = 0;
        this.points = [];
        this.indecies = [];
    }
    genTrack(){
        
    }
    init(){
        
    }
}