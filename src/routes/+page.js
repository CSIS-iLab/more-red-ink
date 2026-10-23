import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { getHomeContent } from '$lib/data/loadHomeContent';
import { calculatorState } from '$lib/stores/calculatorState.js';
import { NEW_ESTIMATE_PARAM } from '$lib/utils/links.js';

export async function load({ url }) {
  // "Create a new estimate" opens Home in a new tab with ?new-estimate:
  // start this tab without an estimate (other tabs keep theirs), then go to
  // "Using the Calculator" without the flag, so it can't run again (e.g. on
  // Back).
  if (url.searchParams.has(NEW_ESTIMATE_PARAM)) {
    calculatorState.reset();
    redirect(307, `${resolve('/')}#using-the-calculator`);
  }

  return {
    homeContent: await getHomeContent()
  };
}