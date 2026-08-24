import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { kMeans } from '../Utils/kmeans.js';

describe('K-Means Clustering Utility', () => {
  test('returns warning message when data points are fewer than k', () => {
    const data = [[150, 1.2]];
    const result = kMeans(data, 2);
    assert.deepEqual(result, { message: 'Not enough data points to cluster.' });
  });

  test('successfully clusters 2-dimensional points into k=2 clusters', () => {
    // Cluster A: low performers around [100, 0.8]
    // Cluster B: high performers / smurfs around [350, 2.5]
    const data = [
      [100, 0.8],
      [110, 0.9],
      [95, 0.7],
      [340, 2.4],
      [360, 2.6],
      [355, 2.5],
    ];

    const result = kMeans(data, 2, 50);

    assert.equal(result.clusters.length, 2);
    assert.equal(result.centroids.length, 2);
    assert.ok(result.iterations > 0);

    // Total points distributed must equal original length
    const totalAssigned = result.clusters.reduce((acc, c) => acc + c.length, 0);
    assert.equal(totalAssigned, data.length);
  });

  test('handles exact k data points correctly', () => {
    const data = [[100, 1.0], [200, 2.0]];
    const result = kMeans(data, 2);
    assert.equal(result.clusters.length, 2);
  });
});
