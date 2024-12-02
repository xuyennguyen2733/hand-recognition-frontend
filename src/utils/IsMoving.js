const LOWER_THRESHOLD = 0.001;
const UPPER_THRESHOLD = 0.1;
export function isMoving3D(pointsPrev, points ) {
    let distance = 0
    for (let i = 0; i < points.length; i++) {
        distance = euclideanDistance(pointsPrev[i], points[i]);
        if (i==2) console.log(i, ':', distance)
        if (distance >= LOWER_THRESHOLD && distance <= UPPER_THRESHOLD) {
            return [true, distance];
        }
    }
    
    return [false, distance];
}

function euclideanDistance(point1, point2) {
    return Math.sqrt(
        Math.pow(point1.x - point2.x, 2) +
        Math.pow(point1.y - point2.y, 2) +
        (point1.z ? Math.pow(point1.z - point2.z, 2) : 0)
    )
}