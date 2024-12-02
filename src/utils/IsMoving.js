const THRESH_HOLD = 0.01;

export function isMoving3D(pointsPrev, points ) {
    for (let i = 0; i < points.length; i++) {
        if (euclideanDistance(pointsPrev[i], points[i]) > THRESH_HOLD) {
            return true;
        }
    }
    
    return false;
}

function euclideanDistance(point1, point2) {
    return Math.sqrt(
        Math.pow(point1.x - point2.x, 2) +
        Math.pow(point1.y - point2.y, 2) +
        (point1.z ? Math.pow(point1.z - point2.z, 2) : 0)
    )
}