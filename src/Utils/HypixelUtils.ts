import Translate from '../Private/Translate.js';
import hypixel from '../Private/HypixelAPIReborn.js';
import { ReplaceVariables } from './StringUtils.js';
import type { SkyBlockProfile } from 'hypixel-api-reborn';

export interface LatestProfileOptions {
  garden?: boolean;
  museum?: boolean;
}

export async function getSelectedProfile(
  username: string,
  options?: LatestProfileOptions
): Promise<SkyBlockProfile & { me: NonNullable<SkyBlockProfile['me']> }> {
  const profiles = await hypixel.getSkyBlockProfiles(username, {
    garden: options?.garden ?? false,
    museum: options?.garden ?? false
  });
  if (profiles.isRaw()) {
    throw new Error(ReplaceVariables(Translate('hypixel.api.error.no.profile'), { username }));
  }
  if (!profiles.selectedProfile) {
    throw new Error(ReplaceVariables(Translate('hypixel.api.error.no.profile.selected'), { username }));
  }
  return profiles.selectedProfile;
}
