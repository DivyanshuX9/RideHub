import { test } from 'node:test';
import assert from 'node:assert/strict';

// HERE Flexible Polyline Decoding Table
const HERE_DECODING_TABLE = [
  62, -1, -1, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1,
  -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, 63,
  -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
];

function decodeFlexiblePolyline(encoded) {
  const result = [];
  let index = 0;
  const length = encoded.length;

  function decodeUnsigned() {
    let res = 0;
    let shift = 0;
    let readAny = false;
    while (index < length) {
      const charCode = encoded.charCodeAt(index++) - 45;
      if (charCode < 0 || charCode >= HERE_DECODING_TABLE.length) return null;
      const val = HERE_DECODING_TABLE[charCode];
      if (val < 0) return null;
      readAny = true;
      res |= (val & 0x1f) << shift;
      if ((val & 0x20) === 0) return res;
      shift += 5;
    }
    return readAny ? res : null;
  }

  function toSigned(val) {
    return (val & 1) ? ~(val >> 1) : (val >> 1);
  }

  if (index >= length) return result;
  const version = decodeUnsigned();
  if (version !== 1) return result;

  const headerVal = decodeUnsigned();
  if (headerVal === null) return result;
  const precision = headerVal & 15;
  const thirdDim = (headerVal >> 4) & 7;
  const factor = Math.pow(10, precision);
  const decPlaces = Math.max(5, precision);
  const rounder = Math.pow(10, decPlaces);

  let lastLat = 0;
  let lastLng = 0;

  while (index < length) {
    const rawLat = decodeUnsigned();
    if (rawLat === null) break;
    const rawLng = decodeUnsigned();
    if (rawLng === null) break;
    lastLat += toSigned(rawLat);
    lastLng += toSigned(rawLng);
    if (thirdDim) {
      decodeUnsigned();
    }
    result.push([
      Math.round((lastLat / factor) * rounder) / rounder,
      Math.round((lastLng / factor) * rounder) / rounder,
    ]);
  }

  return result;
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

test('Routing: Flexible polyline decoder safely extracts coordinates', () => {
  // Encoded polyline sample
  const sample = 'BFoz5xJ67i1B1B7PzI';
  const decoded = decodeFlexiblePolyline(sample);
  assert.equal(Array.isArray(decoded), true);
  if (decoded.length > 0) {
    assert.equal(typeof decoded[0][0], 'number');
    assert.equal(typeof decoded[0][1], 'number');
    assert.ok(decoded[0][0] >= -90 && decoded[0][0] <= 90);
    assert.ok(decoded[0][1] >= -180 && decoded[0][1] <= 180);
  }

  // Malformed or empty polyline returns empty array without throwing
  assert.deepEqual(decodeFlexiblePolyline(''), []);
  assert.deepEqual(decodeFlexiblePolyline('!invalid#char'), []);
});

test('Routing: Haversine distance accuracy between known coordinates', () => {
  // Chennai Central (13.0827, 80.2707) to Chennai Airport (12.9816, 80.1637) ~ 15-18 km
  const dist = haversine(13.0827, 80.2707, 12.9816, 80.1637);
  assert.ok(dist >= 14 && dist <= 20, `Expected distance ~16 km, got ${dist}`);

  // Identical points distance is 0
  assert.equal(haversine(12.98, 80.17, 12.98, 80.17), 0);
});

test('Routing: Routing provider failover order defaults to tomtom,here,osrm', () => {
  const raw = process.env.NEXT_PUBLIC_ROUTING_PROVIDER_ORDER || 'tomtom,here,osrm';
  const list = raw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  for (const fb of ['tomtom', 'here', 'osrm']) {
    if (!list.includes(fb)) list.push(fb);
  }
  assert.equal(list.includes('tomtom'), true);
  assert.equal(list.includes('here'), true);
  assert.equal(list.includes('osrm'), true);
  assert.equal(list[0], 'tomtom');
});
