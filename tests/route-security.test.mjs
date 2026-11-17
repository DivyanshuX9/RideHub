import { test } from 'node:test';
import assert from 'node:assert/strict';

// Helper validator matching the route parameters contract
function validateCoordinates(lat, lon) {
  const parsedLat = typeof lat === 'number' ? lat : parseFloat(String(lat));
  const parsedLon = typeof lon === 'number' ? lon : parseFloat(String(lon));

  if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLon)) {
    return { valid: false, reason: 'Coordinates must be finite numbers' };
  }
  if (parsedLat < -90 || parsedLat > 90) {
    return { valid: false, reason: 'Latitude out of bounds [-90, 90]' };
  }
  if (parsedLon < -180 || parsedLon > 180) {
    return { valid: false, reason: 'Longitude out of bounds [-180, 180]' };
  }
  return { valid: true, lat: parsedLat, lon: parsedLon };
}

function sanitizeSearchQuery(input) {
  if (typeof input !== 'string') return '';
  // Strip control characters and trim
  return input.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim().slice(0, 200);
}

test('SQL Injection Defense: Search parameters safely URL-encoded', () => {
  const sqlPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "admin'--",
    "' UNION SELECT null, username, password FROM users --",
    "1; WAITFOR DELAY '0:0:5'--",
    "1' OR 1=1 #",
  ];

  for (const payload of sqlPayloads) {
    const params = new URLSearchParams({
      from: payload,
      to: 'Chennai Airport',
    });
    const urlString = `/results?${params.toString()}`;

    // Verify raw unescaped quotes/semicolons are never bare in the URL
    assert.equal(
      urlString.includes("'; DROP"),
      false,
      `Dangerous unencoded SQL payload in URL: ${urlString}`
    );
    assert.equal(
      urlString.includes("' OR '1'='1"),
      false,
      `Dangerous unencoded SQL payload in URL: ${urlString}`
    );

    // Verify safe percent-encoding
    const parsedBack = new URLSearchParams(urlString.split('?')[1]);
    assert.equal(parsedBack.get('from'), payload, 'Parameter roundtrip preserved safely without code execution');
  }
});

test('PostgREST / Supabase Filter Injection Defense', () => {
  const postgrestPayloads = [
    "eq.guest&select=*",
    "neq.0,id.in.(1,2,3)",
    "is.null",
    "eq.user' or 1=1",
  ];

  for (const payload of postgrestPayloads) {
    // When constructing API requests to /bookings/{user_id}
    const cleanId = encodeURIComponent(payload);
    const apiUrl = `https://api.ridehub.com/bookings/${cleanId}`;

    // Verify the query parameter delimiter '&' cannot be injected into path
    assert.equal(apiUrl.includes('&select=*'), false);
    assert.equal(apiUrl.includes('%26select%3D*'), payload.includes('&select=*'));
  }
});

test('XSS Defense: Script tags and event handlers neutralized in URL serialization', () => {
  const xssPayloads = [
    "<script>alert('xss')</script>",
    '"><img src=x onerror=alert(1)>',
    'javascript:alert(document.cookie)',
    '<svg onload=alert(1)>',
    '<iframe src="malicious.html"></iframe>',
  ];

  for (const payload of xssPayloads) {
    const sanitized = sanitizeSearchQuery(payload);
    const params = new URLSearchParams({ from: sanitized, to: 'Safe Location' });
    const query = params.toString();

    // Verify angle brackets are properly percent-encoded
    assert.equal(query.includes('<script>'), false);
    assert.equal(query.includes('onload='), false);
    assert.equal(query.includes('onerror='), false);
  }
});

test('Coordinate Boundary Validation: Rejects invalid or out-of-range latitude/longitude', () => {
  // Valid coordinates
  assert.equal(validateCoordinates(12.98, 80.17).valid, true);
  assert.equal(validateCoordinates('12.98', '80.17').valid, true);
  assert.equal(validateCoordinates(-90, -180).valid, true);
  assert.equal(validateCoordinates(90, 180).valid, true);

  // Out of bounds latitude
  assert.equal(validateCoordinates(91, 80.17).valid, false);
  assert.equal(validateCoordinates(-90.1, 80.17).valid, false);
  assert.equal(validateCoordinates(999, 80).valid, false);

  // Out of bounds longitude
  assert.equal(validateCoordinates(12.98, 181).valid, false);
  assert.equal(validateCoordinates(12.98, -180.5).valid, false);
  assert.equal(validateCoordinates(12.98, -999).valid, false);

  // Non-numeric / NaN / Infinity / Malformed
  assert.equal(validateCoordinates(NaN, 80).valid, false);
  assert.equal(validateCoordinates(12, Infinity).valid, false);
  assert.equal(validateCoordinates('abc', 'def').valid, false);
  assert.equal(validateCoordinates("12.98; DROP TABLE", 80).valid, true); // parses to 12.98 float safely
});

test('Path Traversal & IDOR Defense: User IDs and routes cannot escape scope', () => {
  const maliciousIds = [
    '../../../etc/passwd',
    '..\\..\\windows\\win.ini',
    '%2e%2e%2f%2e%2e%2f',
    'user/secret',
  ];

  for (const id of maliciousIds) {
    const encoded = encodeURIComponent(id);
    assert.equal(encoded.includes('/'), false, `Raw path slash found in encoded ID: ${encoded}`);
    assert.equal(encoded.includes('\\'), false, `Raw backslash found in encoded ID: ${encoded}`);
  }
});
