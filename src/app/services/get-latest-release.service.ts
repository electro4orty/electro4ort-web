import { githubClient } from '@/lib/github-client';

interface GetLatestReleaseResponse {
  html_url: string;
}

export async function getLatestReleaseService() {
  const res = await githubClient.get<GetLatestReleaseResponse>(
    '/repos/electro4orty/electro4ort-web/releases/latest'
  );
  return res.data;
}
