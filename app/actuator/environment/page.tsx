import { APPLICATION_API_BASE_URL, APPLICATION_NAME, APPLICATION_VERSION } from '@/lib/application-constants';

const environments = [
  {
    key: 'SEESAW_APPLICATION_NAME',
    value: APPLICATION_NAME,
    description: '현재 프로세스 환경변수에서 조회한 애플리케이션 이름'
  },
  {
    key: 'SEESAW_APPLICATION_VERSION',
    value: APPLICATION_VERSION,
    description: '현재 프로세스 환경변수에서 조회한 애플리케이션 버전'
  },
  {
    key: 'NODE_ENV',
    value: process.env.NODE_ENV,
    description: 'Next.js/Node.js 런타임 모드'
  },
  {
    key: 'APPLICATION_API_BASE_URL',
    value: APPLICATION_API_BASE_URL,
    description: '상수 모듈에서 관리하는 seesaw-api 통신 기본 URL'
  },
  {
    key: 'PWA_MANIFEST_URL',
    value: `/manifest.json`,
    description: 'seesaw-api에서 현재 사이트 정보로 동적 생성하는 PWA manifest URL'
  },
  {
    key: 'PWA_SERVICE_WORKER_URL',
    value: '/sw.js',
    description: '현재 사이트 정보로 동적 생성되는 service worker URL'
  }
];

export default function EnvironmentPage() {
  return (
    <main className="min-h-dvh bg-zinc-100 px-6 py-10 text-zinc-950">
      <section className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">Seesaw Actuator</p>
          <h1 className="text-3xl font-semibold">Environment</h1>
          <p className="max-w-3xl text-base leading-7 text-zinc-600">
            현재 Next.js 프로세스에서 확인되는 애플리케이션 설정입니다. 민감정보는 제외하고 애플리케이션 식별, 버전, 실행 환경, API 연결
            정보와 API 상수만 표시합니다.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-sm font-medium text-zinc-500">Application</p>
            <p className="mt-2 text-xl font-semibold">{APPLICATION_NAME}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-sm font-medium text-zinc-500">Version</p>
            <p className="mt-2 text-xl font-semibold">{APPLICATION_VERSION}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-sm font-medium text-zinc-500">Node Env</p>
            <p className="mt-2 text-xl font-semibold">{process.env.NODE_ENV}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-600">
              <tr>
                <th className="w-1/4 px-5 py-4 font-semibold">Key</th>
                <th className="w-1/3 px-5 py-4 font-semibold">Value</th>
                <th className="px-5 py-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {environments.map((environment) => (
                <tr key={environment.key}>
                  <td className="px-5 py-4 font-mono text-xs font-semibold text-zinc-800">{environment.key}</td>
                  <td className="px-5 py-4 font-mono text-xs break-all text-zinc-700">{environment.value}</td>
                  <td className="px-5 py-4 text-zinc-600">{environment.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
