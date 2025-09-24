import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import Translate from '../../Private/Translate.js';
import { Delay } from '../../Utils/MiscUtils.js';
import { ReplaceVariables } from '../../Utils/StringUtils.js';
import type { ChatMessage } from 'prismarine-chat';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class WarpoutCommand extends Command {
  isOnCooldown: boolean;
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('warpout')
      .setAliases(['warp'])
      .setOptions([new CommandDataOption().setName('username').setRequired(false)]);

    this.isOnCooldown = false;
    this.minecraft.messageHandler.allowLimbo = true;
  }

  enableCooldown() {
    this.isOnCooldown = true;
    this.minecraft.messageHandler.allowLimbo = false;
  }

  disableCooldown() {
    this.isOnCooldown = false;
    this.minecraft.messageHandler.allowLimbo = true;
  }

  override async execute(player: string, message: string) {
    try {
      if (this.isOnCooldown) {
        throw new Error(ReplaceVariables(Translate('minecraft.commands.warpout.execute.error.cooldown'), { player }));
      }

      this.enableCooldown();

      const username = this.getArgs(message)[0];
      if (username === undefined) throw new Error(Translate('minecraft.commands.warpout.execute.error.player'));
      this.minecraft.bot.chat('/lobby megawalls');
      await Delay(500);
      this.minecraft.bot.chat('/play skyblock');
      await Delay(500);
      this.minecraft.bot.chat('/warp home');
      await Delay(500);

      const listener = (event: ChatMessage) => {
        const message = event.toString();
        if (message.includes("You cannot invite that player since they're not online.")) {
          this.minecraft.bot.removeListener('message', listener);
          this.disableCooldown();
          this.send(
            ReplaceVariables(Translate('minecraft.commands.warpout.execute.error.player.offline'), { username })
          );
        } else if (message.includes('You cannot invite that player')) {
          this.minecraft.bot.removeListener('message', listener);
          this.disableCooldown();
          this.send(
            ReplaceVariables(Translate('minecraft.commands.warpout.execute.error.player.party.disable'), { username })
          );
        } else if (message.includes('invited') && message.includes('to the party! They have 60 seconds to accept.')) {
          this.send(
            ReplaceVariables(Translate('minecraft.commands.warpout.execute.player.party.invite'), { username })
          );
        } else if (message.includes(' joined the party.')) {
          this.minecraft.bot.chat('/p warp');
        } else if (message.includes('warped to your server')) {
          this.minecraft.bot.removeListener('message', listener);
          this.disableCooldown();
          this.send(`Successfully warped ${username}!`);
          this.minecraft.bot.chat('/p disband');
        } else if (message.includes(' cannot warp from Limbo')) {
          this.minecraft.bot.removeListener('message', listener);
          this.disableCooldown();
          this.send(
            ReplaceVariables(Translate('minecraft.commands.warpout.execute.error.player.party.warp.limbo'), {
              username
            })
          );
          this.minecraft.bot.chat('/p disband');
        } else if (message.includes(' is not allowed on your server!')) {
          this.minecraft.bot.removeListener('message', listener);
          this.disableCooldown();
          this.send(
            ReplaceVariables(Translate('minecraft.commands.warpout.execute.error.player.party.warp.aloud'), {
              username
            })
          );
          this.minecraft.bot.chat('/p leave');
        } else if (message.includes('You are not allowed to invite players.')) {
          this.minecraft.bot.removeListener('message', listener);
          this.disableCooldown();
          this.send(Translate('minecraft.commands.warpout.execute.error.player.party.invite'));
          this.minecraft.bot.chat('/p disband');
        } else if (message.includes('You are not allowed to disband this party.')) {
          this.minecraft.bot.removeListener('message', listener);
          this.disableCooldown();
          this.send(Translate('minecraft.commands.warpout.execute.error.player.party.cant.disband'));
          this.minecraft.bot.chat('/p leave');
        } else if (message.includes("You can't party warp into limbo!")) {
          this.minecraft.bot.removeListener('message', listener);
          this.disableCooldown();
          this.send(Translate('minecraft.commands.warpout.execute.error.player.party.warp.bot.limbo'));
          this.minecraft.bot.chat('/p disband');
        } else if (message.includes("Couldn't find a player with that name!")) {
          this.minecraft.bot.removeListener('message', listener);
          this.disableCooldown();
          this.send(Translate('minecraft.commands.warpout.execute.error.player.exist'));
          this.minecraft.bot.chat('/p disband');
        } else if (message.includes('You cannot party yourself!')) {
          this.minecraft.bot.removeListener('message', listener);
          this.disableCooldown();
          this.send(Translate('minecraft.commands.warpout.execute.error.player.bot'));
        } else if (message.includes("didn't warp correctly!")) {
          this.minecraft.bot.removeListener('message', listener);
          this.disableCooldown();
          this.send(
            ReplaceVariables(Translate('minecraft.commands.warpout.execute.error.player.party.warp.bad'), { username })
          );
          this.minecraft.bot.chat('/p disband');
        }
      };

      this.minecraft.bot.on('message', listener);
      this.minecraft.bot.chat(`/p invite ${username} `);

      setTimeout(() => {
        this.minecraft.bot.removeListener('message', listener);
        if (this.isOnCooldown === true) {
          this.send(Translate('minecraft.commands.warpout.execute.party.expire'));
          this.minecraft.bot.chat('/p disband');
          this.disableCooldown();
        }
      }, 30000);
    } catch (error) {
      this.send(`[ERROR] ${error}`);
      this.disableCooldown();
    }
  }
}

export default WarpoutCommand;
