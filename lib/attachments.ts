import { APPLICATION_API_BASE_URL } from '@/lib/application-constants';

export async function deleteAttachment(
  id: string,
  accessToken: string
): Promise<void> {
  const response = await fetch(
    `${APPLICATION_API_BASE_URL}/attachments/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`첨부파일을 삭제할 수 없습니다. status=${response.status}`);
  }
}
