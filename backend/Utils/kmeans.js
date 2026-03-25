// backend/Utils/kmeans.js

/**
 * Calculates the Euclidean distance between two points (e.g., [x1, y1] and [x2, y2])
 */
function euclideanDistance(point1, point2) {
    let sum = 0;
    for (let i = 0; i < point1.length; i++) {
        sum += Math.pow(point1[i] - point2[i], 2);
    }
    return Math.sqrt(sum);
}

/**
 * K-Means Clustering Algorithm
 * @param {Array<Array<Number>>} data - Ex: [[acs1, kd1], [acs2, kd2], ...]
 * @param {Number} k - Number of clusters (we will use 2: Normal vs High-Performance)
 * @param {Number} maxIterations - Limit to prevent infinite loops
 */
export function kMeans(data, k = 2, maxIterations = 100) {
    if (data.length < k) {
        return { message: "Not enough data points to cluster." };
    }

    // Step 1: Randomly initialize K centroids from the existing data
    let centroids = [];
    let usedIndices = new Set();
    while (centroids.length < k) {
        let randomIndex = Math.floor(Math.random() * data.length);
        if (!usedIndices.has(randomIndex)) {
            centroids.push([...data[randomIndex]]);
            usedIndices.add(randomIndex);
        }
    }

    let assignments = new Array(data.length).fill(-1);
    let iterations = 0;
    let hasChanged = true;

    while (hasChanged && iterations < maxIterations) {
        hasChanged = false;
        
        // Step 2: Assign each data point to the closest centroid
        for (let i = 0; i < data.length; i++) {
            let closestCentroidIndex = 0;
            let minDistance = Infinity;

            for (let j = 0; j < k; j++) {
                let distance = euclideanDistance(data[i], centroids[j]);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestCentroidIndex = j;
                }
            }

            if (assignments[i] !== closestCentroidIndex) {
                assignments[i] = closestCentroidIndex;
                hasChanged = true;
            }
        }

        // Step 3: Recalculate centroids based on the mean of assigned points
        if (hasChanged) {
            let newCentroids = Array.from({ length: k }, () => new Array(data[0].length).fill(0));
            let counts = new Array(k).fill(0);

            for (let i = 0; i < data.length; i++) {
                let clusterIndex = assignments[i];
                for (let dim = 0; dim < data[i].length; dim++) {
                    newCentroids[clusterIndex][dim] += data[i][dim];
                }
                counts[clusterIndex]++;
            }

            for (let j = 0; j < k; j++) {
                if (counts[j] > 0) {
                    for (let dim = 0; dim < newCentroids[j].length; dim++) {
                        centroids[j][dim] = newCentroids[j][dim] / counts[j];
                    }
                }
            }
        }
        iterations++;
    }

    // Group the original data points into their final clusters
    const clusters = Array.from({ length: k }, () => []);
    for (let i = 0; i < data.length; i++) {
        clusters[assignments[i]].push(data[i]);
    }

    return {
        centroids,
        clusters,
        iterations
    };
}
