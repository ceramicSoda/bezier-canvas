

function cubicBezierPoint3D(t, p0, p1, p2, p3) {
    let c1 = Math.pow(1 - t, 3);
    let c2 = 3 * Math.pow(1 - t, 2) * t;
    let c3 = 3 * (1 - t) * Math.pow(t, 2);
    let c4 = Math.pow(t, 3);

    let x = c1 * p0[0] + c2 * p1[0] + c3 * p2[0] + c4 * p3[0];
    let y = c1 * p0[1] + c2 * p1[1] + c3 * p2[1] + c4 * p3[1];
    let z = c1 * p0[2] + c2 * p1[2] + c3 * p2[2] + c4 * p3[2];

    return [x, y, z];
}

const getTrackPoint = (pointsArr, progress) => {
    pointsArr.forEach((curve, cur, curves) => {
        let prev = cur - 1,
            next = cur + 1;
        if (cur == 0)
            prev = curves.length - 1;
        if (cur == (curves.length - 1))
            next = 0;
        
    })
}