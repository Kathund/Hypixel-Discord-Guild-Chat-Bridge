import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import Translate from '../../Private/Translate.js';
import { FormatNumber, FormatUsername, ReplaceVariables } from '../../Utils/StringUtils.js';
import { getSelectedProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';
import type { SkillLevelData } from 'hypixel-api-reborn';

class SkillsCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('skills')
      .setAliases(['skill', 'sa'])
      .setOptions([new CommandDataOption().setName('username').setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const profile = await getSelectedProfile(player);
      const username = FormatUsername(player, profile.gameMode);

      const skillData: { name: string; level: number }[] = [];
      const skills = profile.me.playerData.skills;
      Object.keys(skills)
        .filter((skill) => !['average', 'nonCosmeticAverage', 'toString'].includes(skill))
        .filter((skill) => {
          const data: SkillLevelData = skills[skill as keyof typeof skills] as SkillLevelData;
          return data.currentXp > 1;
        })
        .forEach((skill) => {
          const data: SkillLevelData = skills[skill as keyof typeof skills] as SkillLevelData;
          skillData.push({ name: skill, level: data.level });
        });

      if (skillData.length === 0) {
        throw new Error(ReplaceVariables(Translate('minecraft.commands.skills.execute.error.no.skills'), { username }));
      }

      this.send(
        ReplaceVariables(Translate('minecraft.commands.skills.execute'), {
          username,
          average: FormatNumber(skills.average, 2),
          formattedSkills: skillData
            .map((skill) =>
              ReplaceVariables(Translate('minecraft.commands.skills.execute.skill.format'), {
                level: FormatNumber(skill.level, 2),
                name: Translate(`minecraft.commands.skills.execute.${skill.name}`)
              })
            )
            .join(Translate('minecraft.commands.skills.execute.join'))
        })
      );
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default SkillsCommand;
