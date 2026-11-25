import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const source = readFileSync(new URL('../app/api/maps/geocode/route.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;

function route(fetch, env = { NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID: 'id', NAVER_MAPS_CLIENT_SECRET: 'secret' }) {
  const exports = {};
  const context = {
    exports,
    require: (name) => name === 'next/server' ? { NextResponse: { json: (body, options = {}) => ({ body, ...options }) } } : require(name),
    process: { env }, fetch, URL, AbortSignal
  };
  vm.runInNewContext(compiled, context);
  return (query) => exports.GET(new Request(`https://example.test/api/maps/geocode?query=${encodeURIComponent(query)}`));
}

test('입력 검증과 누락된 인증 정보를 처리한다', async () => {
  const handler = route(() => assert.fail('외부 API를 호출하면 안 됩니다'), {});
  assert.equal((await handler('가')).status, 400);
  assert.equal((await handler('가'.repeat(201))).status, 400);
  assert.equal((await handler('서울시')).status, 503);
});

test('서버 인증 헤더로 조회하고 유효한 결과만 캐시 없이 반환한다', async () => {
  const handler = route(async (url, options) => {
    assert.equal(url.origin, 'https://maps.apigw.ntruss.com');
    assert.equal(url.searchParams.get('query'), '서울 종로구');
    assert.equal(options.headers['x-ncp-apigw-api-key-id'], 'id');
    assert.equal(options.headers['x-ncp-apigw-api-key'], 'secret');
    return { ok: true, json: async () => ({ status: 'OK', addresses: [
      { roadAddress: '서울 종로구 1', jibunAddress: '', x: '127', y: '37' },
      { roadAddress: '잘못된 좌표', x: '', y: '37' }
    ] }) };
  });
  const result = await handler('서울 종로구');
  assert.equal(result.headers['Cache-Control'], 'no-store');
  assert.equal(result.body.addresses.length, 1);
  assert.equal(result.body.addresses[0].latitude, 37);
  assert.equal(result.body.addresses[0].longitude, 127);
  assert.equal(JSON.stringify(result).includes('secret'), false);
});

test('호출 한도와 외부 서비스 오류를 처리한다', async () => {
  assert.equal((await route(async () => ({ ok: false, status: 429 }))('서울시')).status, 429);
  assert.equal((await route(async () => { throw new Error('network'); })('서울시')).status, 502);
  assert.equal((await route(async () => ({ ok: true, json: async () => ({ status: 'ERROR' }) }))('서울시')).status, 502);
});
