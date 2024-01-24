console.log("test")

const track = {
    size: 4, 
    d: [[[30,-56,-77],[41,-105,-72],[21,-14,-82]],[[127,-60,-54],[84,-20,-48],[169,-100,-61]],[[147,46,-59],[191,1,-66],[103,91,-53]],[[44,48,-3],[116,69,-32],[-27,27,25]],[[-106,121,13],[-26,74,-6],[-186,168,31]],[[-161,71,-29],[-173,85,-28],[-150,56,-30]],[[-188,8,-70],[-176,34,-79],[-200,-18,-60]],[[-93,-62,44],[-159,-82,71],[-26,-42,17]],[[14,-96,-64],[-13,-87,-55],[24,-98,-68]]], 
    length: [],
    p: [] // need to store also t0 value for each approx point
}
let approxDensity = 5000, // approximation density
    interval = 3, // distance in units between points
    canvasEl,
    subdiv = 8 , // sections per curve
    ctx; 

const normzile = (v, mult = 1) => {
    var mag = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
    let nV = [(v[0] / mag) * mult, (v[1] / mag) * mult, (v[2] / mag) * mult ];
    if (mag == 0)
        nV = [0,0,0];
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

/*
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
    track.d.forEach((curve, cur, curves) => {
        let next = cur + 1;
        if (cur == (curves.length - 1))
            next = 0;
        let bLength = getBezierLength(curves[cur][0], curves[cur][2], curves[next][1], curves[next][0], subdiv)
        track.length.push(bLength); 
    })
}
*/

const getTrackPoint = (track, progress) => {
    let bLength = 0;
    let steps = 0;
    track.d.forEach((curve, cur, curves) => {
        let next = cur + 1;
        if (cur == (curves.length - 1))
            next = 0;
        for (let i = 0; i < (approxDensity); i++){
            let d0 = getBezierPoint(i / approxDensity, curves[cur][0], curves[cur][2], curves[next][1], curves[next][0]);
            let d1 = getBezierPoint((i + 1) / approxDensity, curves[cur][0], curves[cur][2], curves[next][1], curves[next][0]);
            let dx = getDistance(d0, d1);
            bLength += dx;
            if (bLength >= (interval * steps)){
                let v = [d0[0] - d1[0], d0[1] - d1[1], d0[2] - d1[2]];
                let vp = [v[1], -v[0], 0]; // vector perpendicular to track
                vp = normzile(vp, 5);
                let segment = []; // road segment by points
                segment.push([d0[0] + vp[0], d0[1] + vp[1], d0[2] + vp[2]]);
                segment.push(d0);
                segment.push([d0[0] - vp[0], d0[1] - vp[1], d0[2] - vp[2]]);
                track.p.push(segment);
                steps++; 
            }
        }
    })
}


document.addEventListener("DOMContentLoaded", () => {
    canvasEl = document.getElementById("bezier-canvas");
    canvasEl.width = canvasEl.clientWidth * 2; 
    canvasEl.height = canvasEl.clientHeight * 2; 
    ctx = canvasEl.getContext("2d"); 
    getTrackPoint(track);
    track.p.forEach((point,i,p) => {
        let n = i + 1;
        if (i >= (p.length - 1))
            n = 0;
        ctx.strokeStyle = `hsl(${p[i][0][2] * 3},70%,40%)`;
        ctx.beginPath();
            ctx.moveTo(p[i][0][0] * 3 + 600, p[i][0][1] * 3 + 600);
            ctx.lineTo(p[i][1][0] * 3 + 600, p[i][1][1] * 3 + 600);
            ctx.moveTo(p[i][1][0] * 3 + 600, p[i][1][1] * 3 + 600);
            ctx.lineTo(p[i][2][0] * 3 + 600, p[i][2][1] * 3 + 600);

            ctx.moveTo(p[i][0][0] * 3 + 600, p[i][0][1] * 3 + 600);
            ctx.lineTo(p[n][0][0] * 3 + 600, p[n][0][1] * 3 + 600);
            ctx.moveTo(p[i][1][0] * 3 + 600, p[i][1][1] * 3 + 600);
            ctx.lineTo(p[n][1][0] * 3 + 600, p[n][1][1] * 3 + 600);
            ctx.moveTo(p[i][2][0] * 3 + 600, p[i][2][1] * 3 + 600);
            ctx.lineTo(p[n][2][0] * 3 + 600, p[n][2][1] * 3 + 600);
        ctx.stroke();
        ctx.fillStyle = `hsl(${p[i][0][2] * 3},70%,70%)`;
        ctx.fillRect(p[i][0][0] * 3 + 599, p[i][0][1] * 3 + 599, 3, 3); 
        ctx.fillRect(p[i][1][0] * 3 + 599, p[i][1][1] * 3 + 599, 3, 3); 
        ctx.fillRect(p[i][2][0] * 3 + 599, p[i][2][1] * 3 + 599, 3, 3); 
    })
    console.log(track); 
});

addEventListener("resize", () => {
    // canvasEl.width = canvasEl.clientWidth; 
    // canvasEl.height = canvasEl.clientHeight; 
});
