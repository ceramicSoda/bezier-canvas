const track = {
    size: 4, 
    d: [[[30,-56,-77],[41,-105,-72],[21,-14,-82]],[[127,-60,-54],[84,-20,-48],[169,-100,-61]],[[147,46,-59],[191,1,-66],[103,91,-53]],[[44,48,-3],[116,69,-32],[-27,27,25]],[[-106,121,13],[-26,74,-6],[-186,168,31]],[[-161,71,-29],[-173,85,-28],[-150,56,-30]],[[-188,8,-70],[-176,34,-79],[-200,-18,-60]],[[-93,-62,44],[-159,-82,71],[-26,-42,17]],[[14,-96,-64],[-13,-87,-55],[24,-98,-68]]], 
    length: [],
    p: []
}
let canvasEl,
    subdiv = 40 , // sections per curve
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
    canvasEl.width = canvasEl.clientWidth * 2; 
    canvasEl.height = canvasEl.clientHeight * 2; 
    ctx = canvasEl.getContext("2d"); 
    getTrackPoint(track);
    track.p.forEach((point,i,p) => {
        ctx.strokeStyle = `hsl(${p[i][2] * 3},70%,70%)`;
        ctx.beginPath();
        ctx.moveTo(p[i][0] * 3 + 600, p[i][1] * 3 + 600);
        i < (p.length - 1)
            ? ctx.lineTo(p[i + 1][0] * 3 + 600, p[i + 1][1] * 3 + 600)
            : ctx.lineTo(p[0][0] * 3 + 600, p[0][1] * 3 + 600)
        ctx.stroke();
        ctx.fillStyle = `hsl(${p[i][2] * 3},70%,70%)`;
        ctx.fillRect(p[i][0] * 3 + 599, p[i][1] * 3 + 599, 3, 3); 
    })
    console.log(track); 
});

addEventListener("resize", () => {
    // canvasEl.width = canvasEl.clientWidth; 
    // canvasEl.height = canvasEl.clientHeight; 
});