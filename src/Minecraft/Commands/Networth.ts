import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import HypixelAPIReborn from '../../Private/HypixelAPIReborn.js';
import Translate from '../../Private/Translate.js';
import { FormatNumber, FormatUsername, ReplaceVariables } from '../../Utils/StringUtils.js';
import { PrepareSkyBlockProfileForSkyHelperNetworth } from 'hypixel-api-reborn';
import { ProfileNetworthCalculator } from 'skyhelper-networth';
import { getSelectedProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class NetworthCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('networth')
      .setAliases(['nw'])
      .setOptions([new CommandDataOption().setName('username').setRequired(true)]);
  }

  override async execute(player: string, message: string) {
    const args = this.getArgs(message);
    player = args[0] || player;
    const selectedProfile = await getSelectedProfile(player);

    const username = FormatUsername(player, selectedProfile.gameMode);

    const museum = await HypixelAPIReborn.getSkyBlockMuseum(selectedProfile.profileId, { raw: true });
    if (!museum.isRaw()) throw new Error(Translate('hypixel.api.error.request.parse.raw.not'));

    const museumProfile = museum.data.members[selectedProfile.me.uuid];
    if (museumProfile === undefined) {
      throw new Error(ReplaceVariables(Translate('hypixel.api.error.no.museum'), { username }));
    }

    const profileData = PrepareSkyBlockProfileForSkyHelperNetworth(selectedProfile);

    const networthCalculator = new ProfileNetworthCalculator(
      profileData,
      museumProfile,
      selectedProfile.banking.balance
    );

    const networthData = await networthCalculator.getNetworth({ onlyNetworth: true });
    const nonCosmeticNetworthData = await networthCalculator.getNonCosmeticNetworth({ onlyNetworth: true });

    if (networthData.noInventory === true) {
      throw new Error(ReplaceVariables(Translate('hypixel.api.error.no.inv'), { username }));
    }

    const networth = FormatNumber(networthData.networth);
    const unsoulboundNetworth = FormatNumber(networthData.unsoulboundNetworth);
    const nonCosmeticNetworth = FormatNumber(nonCosmeticNetworthData.networth);
    const nonCosmeticUnsoulboundNetworth = FormatNumber(nonCosmeticNetworthData.unsoulboundNetworth);

    const purse = FormatNumber(networthData.purse);
    const bank = selectedProfile.banking.balance !== 0 ? FormatNumber(selectedProfile.banking.balance) : 'N/A';
    const personalBank =
      selectedProfile.me.profileStats.bankAccount !== 0
        ? FormatNumber(selectedProfile.me.profileStats.bankAccount)
        : 'N/A';
    const museumData = FormatNumber(networthData.types.museum?.total ?? 0);

    this.send(
      ReplaceVariables(Translate('minecraft.commands.networth.execute'), {
        username,
        networth,
        nonCosmeticNetworth,
        unsoulboundNetworth,
        nonCosmeticUnsoulboundNetworth,
        purse,
        bank,
        personalBank,
        museumData
      })
    );
  }
}

export default NetworthCommand;
