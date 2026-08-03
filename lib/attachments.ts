import { authorizedFetch } from '@/lib/api-fetch';

export async function deleteAttachment(id: string): Promise<void> {
  const response = await authorizedFetch(`/api/attachments/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`첨부파일을 삭제할 수 없습니다. status=${response.status}`);
  }
}
