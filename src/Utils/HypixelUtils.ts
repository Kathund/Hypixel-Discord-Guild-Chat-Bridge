import Translate from '../Private/Translate.js';
import hypixel from '../Private/HypixelAPIReborn.js';
import { ReplaceVariables } from './StringUtils.js';
import type { SkyBlockProfile } from 'hypixel-api-reborn';

export function hasMe(
  profile: SkyBlockProfile
): profile is SkyBlockProfile & { me: NonNullable<SkyBlockProfile['me']> } {
  return profile.me !== null;
}

export async function getLatestProfile(
  username: string,
  garden: boolean = false
): Promise<SkyBlockProfile & { me: NonNullable<SkyBlockProfile['me']> }> {
  const profiles = await hypixel.getSkyBlockProfiles(username, { garden });
  if (profiles.isRaw()) {
    throw new Error(ReplaceVariables(Translate('hypixel.api.error.no.profile'), { username }));
  }
  const profile = Array.from(profiles.values()).find((profile) => profile.selected === true);
  if (profile === undefined) {
    throw new Error(ReplaceVariables(Translate('hypixel.api.error.no.profile'), { username }));
  }
  if (!hasMe(profile)) {
    throw new Error(ReplaceVariables(Translate('hypixel.api.error.no.profile'), { username }));
  }
  return profile;
}
