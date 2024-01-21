const track = {
    size: 4, 
    d: [[[-100,0,23],[-109,-109,6],[-91,109,39]],
        [[-4,132,0],[-62,219,-6],[57,41,6]],
        [[100,0,40],[95,67,39],[105,-79,42]],
        [[0,-173,0],[135,-178,7],[-132,-167,-7]]], 
    length: [],
}
const canvas = document.getElementById("bezier-canvas");
const ctx = canvas.getContext("2d");
const subdiv = 8; // sections per curve

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
    let coords = []
    coords.push(c1 * p0[0] + c2 * p1[0] + c3 * p2[0] + c4 * p3[0]); // x 
    coords.push(c1 * p0[1] + c2 * p1[1] + c3 * p2[1] + c4 * p3[1]); // y
    coords.push(c1 * p0[2] + c2 * p1[2] + c3 * p2[2] + c4 * p3[2]); // z
    return coords;
}

const getBezierLength = (p0, p1, p2, p3, subdiv = 8) => {
    let bLength = 0;
    for (let i = 0; i < subdiv; i++) {
        let t1 = i / subdiv,
            t2 = (i + 1) / subdiv,
            d0 = getBezierPoint(t1, p0, p1, p2, p3),
            d1 = getBezierPoint(t2, p0, p1, p2, p3);
        bLength += getDistance(d0, d1); 
    }
    return(bLength); 
}

const getTrackPoint = (pointsArr, progress) => {
    pointsArr.forEach((curve, cur, curves) => {
        let next = cur + 1;
        if (cur == (curves.length - 1))
            next = 0;
        
    })
}