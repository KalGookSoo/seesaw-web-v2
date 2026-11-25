import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('query')?.trim() ?? '';
  if (query.length < 2 || query.length > 200) {
    return NextResponse.json({ message: '주소를 2자 이상 200자 이하로 입력해주세요.' }, { status: 400 });
  }

  const clientId = process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID;
  const clientSecret = process.env.NAVER_MAPS_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.json({ message: '지도 서비스를 사용할 수 없습니다.' }, { status: 503 });
  }

  const url = new URL('https://maps.apigw.ntruss.com/map-geocode/v2/geocode');
  url.searchParams.set('query', query);
  url.searchParams.set('count', '10');

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'x-ncp-apigw-api-key-id': clientId,
        'x-ncp-apigw-api-key': clientSecret
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) {
      return NextResponse.json({ message: '주소 검색을 사용할 수 없습니다. 잠시 후 다시 시도해주세요.' }, { status: response.status === 429 ? 429 : 502 });
    }
    const data = await response.json();
    if (data.status !== 'OK' || !Array.isArray(data.addresses)) {
      throw new Error('Invalid geocoding response');
    }
    const addresses = data.addresses.flatMap((address: Record<string, unknown>) => {
      const longitude = typeof address.x === 'string' && address.x.trim() ? Number(address.x) : NaN;
      const latitude = typeof address.y === 'string' && address.y.trim() ? Number(address.y) : NaN;
      const roadAddress = typeof address.roadAddress === 'string' ? address.roadAddress : '';
      const jibunAddress = typeof address.jibunAddress === 'string' ? address.jibunAddress : '';
      return Number.isFinite(latitude) && Number.isFinite(longitude) && (roadAddress || jibunAddress)
        ? [{ roadAddress, jibunAddress, latitude, longitude }]
        : [];
    });
    return NextResponse.json({ addresses }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ message: '주소 검색을 사용할 수 없습니다. 잠시 후 다시 시도해주세요.' }, { status: 502 });
  }
}
