// Minimal k6 load test: hit base URL a few times.
// Replace or extend with real scenarios as needed.
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 5,
  duration: '10s',
  thresholds: {
    http_req_failed: ['rate<0.1'],
    http_req_duration: ['p(95)<5000'],
  },
};

export default function () {
  const baseUrl = __ENV.TARGET_URL || 'https://ems.sutracode.in';
  const res = http.get(baseUrl);
  check(res, { 'status is 200': (r) => r.status === 200 });
}
