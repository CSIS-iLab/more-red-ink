import { getHomeContent } from '$lib/data/loadHomeContent';

export async function load() {
  return {
    homeContent: await getHomeContent()
  };
}