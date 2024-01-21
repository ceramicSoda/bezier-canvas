const track = {
    size: 4, 
    d: [[[-100,0,0],[-100,-55,0],[-100,55,0]],[[0,100,0],[-55,100,0],[55,100,0]],[[100,0,0],[100,55,0],[100,-55,0]],[[0,-100,0],[55,-100,0],[-55,-100,0]]], 
    length: [],
    p: []
}
let canvasEl,
    subdiv = 8, // sections per curve
    ctx; 

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

const getTrackLength = (track, subdiv) => {
    track.d.forEach((curve, i, curves) => {
        //let bLength = getBezierLength(curves[i][0])
    })
}

const getTrackPoint = (track, progress) => {
    track.d.forEach((curve, cur, curves) => {
        let next = cur + 1;
        if (cur == (curves.length - 1))
            next = 0;
        for (let i = 0; i < subdiv; i++ )
            track.p.push(getBezierPoint(i / subdiv, curves[cur][0], curves[cur][2], curves[next][1], curves[next][0]));
    })
}


document.addEventListener("DOMContentLoaded", () => {
    canvasEl = document.getElementById("bezier-canvas");
    canvasEl.width = canvasEl.clientWidth; 
    canvasEl.height = canvasEl.clientHeight; 
    ctx = canvasEl.getContext("2d"); 
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#FFF";
    //ctx.fillRect()
    getTrackPoint(track);
    track.p.forEach((point,i,p) => {
        ctx.beginPath();
        ctx.moveTo(p[i][0] + 200, p[i][1] + 200);
        i < (p.length - 1)
            ? ctx.lineTo(p[i + 1][0] + 200, p[i + 1][1] + 200)
            : ctx.lineTo(p[0][0] + 200, p[0][1] + 200)
        ctx.stroke();
        ctx.fillRect(p[i][0] + 200, p[i][1] + 200, 4, 4); 
    })
    console.log(track); 
});

addEventListener("resize", () => {
    canvasEl.width = canvasEl.clientWidth; 
    canvasEl.height = canvasEl.clientHeight; 
});