export async function createTestApiKey(baseUrl: string, name = 'test-key'): Promise<string> {
  const res = await fetch(`${baseUrl}/v0/auth/keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const json = (await res.json()) as { ok: boolean; data: { apiKey: string } };
  if (!json.ok) throw new Error(`Failed to create API key: ${JSON.stringify(json)}`);
  return json.data.apiKey;
}
