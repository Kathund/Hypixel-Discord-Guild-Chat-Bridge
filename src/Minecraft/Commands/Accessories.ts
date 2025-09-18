import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import Translate from '../../Private/Translate.js';
import { FormatNumber, FormatUsername, ReplaceVariables } from '../../Utils/StringUtils.js';
import { getLatestProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';
import type { Rarity, SkyBlockInventoryItem } from 'hypixel-api-reborn';

class AccessoriesCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('accessories')
      .setAliases(['acc', 'talismans', 'talisman', 'mp', 'magicpower'])
      .setOptions([new CommandDataOption().setName('username').setRequired(false)]);
  }

  private getAccessories(accessories: SkyBlockInventoryItem[]) {
    try {
      const output: { amount: number; recombed: number; enriched: number; rarities: { [key in Rarity]: number } } = {
        amount: 0,
        recombed: 0,
        enriched: 0,
        rarities: {
          COMMON: 0,
          UNCOMMON: 0,
          RARE: 0,
          EPIC: 0,
          LEGENDARY: 0,
          MYTHIC: 0,
          DIVINE: 0,
          SPECIAL: 0,
          VERY_SPECIAL: 0
        }
      };

      if (!accessories?.length) return output;
      for (const accessory of accessories) {
        output.amount++;
        output.rarities[accessory.rarity]++;
        if (accessory.recombobulated) output.recombed++;
        output.enriched += accessory.raw.tag.ExtraAttributes.rarity_upgrades ? 1 : 0;
      }

      return output;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  override async execute(player: string, message: string) {
    try {
      const args = this.getArgs(message);
      player = args[0] ?? player;

      const profile = await getLatestProfile(player);
      const username = FormatUsername(player, profile.gameMode);

      if (profile.me.inventory.bags.talisman.base64 === undefined || profile.me.inventory.inventory.base64 === null) {
        throw new Error(ReplaceVariables(Translate('hypixel.api.error.no.inv'), { username }));
      }

      const decoded = await profile.me.inventory.bags.talisman.decodeData();
      if (!decoded) throw new Error(ReplaceVariables(Translate('hypixel.api.error.no.profile'), { username }));

      const talismans = this.getAccessories(decoded.items);
      if (!talismans) {
        throw new Error(
          ReplaceVariables(Translate('minecraft.commands.accessories.execute.error.parse'), { username })
        );
      }

      this.send(
        ReplaceVariables(Translate('minecraft.commands.accessories.execute'), {
          username,
          magicalPower: FormatNumber(decoded.magicalPower),
          ...talismans.rarities,
          ...talismans
        })
      );
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default AccessoriesCommand;
