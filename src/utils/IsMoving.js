const LOWER_THRESHOLD = 0.002;
const UPPER_THRESHOLD = 0.2;
export function isMoving3D(pointsPrev, points) {
  const distances = new Array(points.length).fill(0);
  let isMoving = false;
  for (let i = 0; i < points.length; i++) {
    const distance = euclideanDistance(pointsPrev[i], points[i]);
    distances[i] = distance;
    if (distance >= LOWER_THRESHOLD && distance <= UPPER_THRESHOLD) {
      isMoving = true;
    }
  }

  return [isMoving, distances];
}

function euclideanDistance(point1, point2) {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) +
      Math.pow(point1.y - point2.y, 2) +
      (point1.z ? Math.pow(point1.z - point2.z, 2) : 0),
  );
}
