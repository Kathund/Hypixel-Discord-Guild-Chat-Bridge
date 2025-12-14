import Translate from '../../Private/Translate.js';
import { Delay, GenerateId } from '../../Utils/MiscUtils.js';
import { SplitMessage } from '../../Utils/StringUtils.js';
import type CommandData from './CommandData.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class Command {
  readonly minecraft: MinecraftManagerWithBot;
  data!: CommandData;
  officer: boolean = false;
  constructor(minecraft: MinecraftManagerWithBot) {
    this.minecraft = minecraft;
  }

  getArgs(message: string): string[] {
    const args = message.split(' ');
    args.shift();
    return args;
  }

  /* eslint-disable require-await */
  async send(message: string, maxRetries = 5, isErrorMessage = false): Promise<void> {
    const startTime = Date.now();
    const maxExecutionTime = 10000;

    if (message.length > 256) {
      const messages = SplitMessage(message, 256);
      for (const msg of messages) {
        await Delay(1000);
        await this.send(msg, maxRetries, isErrorMessage);

        if (Date.now() - startTime > maxExecutionTime) {
          console.error('Message sending timed out after 10 seconds');
          return;
        }
      }
      return;
    }

    try {
      const sendMessage = async () => {
        return new Promise((resolve, reject) => {
          const listener = async (msg: { toString: () => any }) => {
            const msgStr = msg.toString();

            if (msgStr.includes('You are sending commands too fast!') && !msgStr.includes(':')) {
              this.minecraft.bot.removeListener('message', listener);
              reject(new Error('rate-limited'));
            }

            if (msgStr.includes('You cannot say the same message twice!') && !msgStr.includes(':')) {
              this.minecraft.bot.removeListener('message', listener);
              reject(new Error('duplicate-message'));
            }
          };

          this.minecraft.bot.once('message', listener);
          this.minecraft.bot.chat(`/${this.officer ? 'oc' : 'gc'} ${message}`);

          setTimeout(() => {
            this.minecraft.bot.removeListener('message', listener);
            resolve(true);
          }, 500);
        });
      };

      for (let i = 0; i < maxRetries; i++) {
        try {
          await sendMessage();
          return;
        } catch (error) {
          if (!(error instanceof Error)) return;
          if (Date.now() - startTime > maxExecutionTime) {
            console.error('Message sending timed out after 10 seconds');
            return;
          }

          if (error.message === 'rate-limited') {
            if (i === maxRetries - 1) {
              this.send(`Command failed to send message after ${maxRetries} attempts. Please try again later.`, 1);
              if (!isErrorMessage) {
                console.error(`Command failed to send message after ${maxRetries} attempts due to rate limiting.`);
              }
              return;
            }
            await Delay(2000);
            continue;
          }

          if (error.message === 'duplicate-message') {
            await Delay(100);
            const randomId = GenerateId(24);
            const maxLength = 256 - randomId.length - 3;
            message = `${message.substring(0, maxLength)} - ${randomId}`;
            continue;
          }
          throw error;
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  execute(username: string, message: string): Promise<void> | void {
    throw new Error(Translate('minecraft.commands.error.missingExecute'));
  }
}

export default Command;
