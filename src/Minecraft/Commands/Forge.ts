import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import Translate from '../../Private/Translate.js';
import prettyMilliseconds from 'pretty-ms';
import { FormatUsername, ReplaceVariables } from '../../Utils/StringUtils.js';
import { getLatestProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot, ParsedForgeSlot } from '../../Types/Minecraft.js';
import type { SkyBlockMemberMiningHotmForgeItem } from 'hypixel-api-reborn';

class ForgeCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('forge')
      .setOptions([new CommandDataOption().setName('username').setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const profile = await getLatestProfile(player);
      const username = FormatUsername(player, profile.gameMode);

      const slots: ParsedForgeSlot[] = [];

      Object.values(profile.me.mining.hotm.forge)
        .filter((slot: SkyBlockMemberMiningHotmForgeItem | null) => slot !== null)
        .forEach((slot: SkyBlockMemberMiningHotmForgeItem) =>
          slots.push({
            item: slot.name,
            slot: slot.slot,
            finished: Date.now() > slot.endTime,
            end: slot.endTime,
            timeLeft: prettyMilliseconds(Date.now() - slot.endTime)
          })
        );

      if (slots.length === 0) {
        throw new Error(`${username} has no items in their forge.`);
      }

      const forgeItems = slots.map((slot) =>
        ReplaceVariables(Translate('minecraft.commands.forge.execute.item'), {
          slot: slot.slot,
          name: slot.item,
          time: ReplaceVariables(
            Translate(
              slot.finished
                ? 'minecraft.commands.forge.execute.item.time.finished'
                : 'minecraft.commands.forge.execute.item.time'
            ),
            { left: slot.timeLeft }
          )
        })
      );
      this.send(
        ReplaceVariables(Translate('minecraft.commands.forge.execute'), {
          username,
          slots: forgeItems.join(Translate('minecraft.commands.forge.execute.slot.join'))
        })
      );
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default ForgeCommand;
