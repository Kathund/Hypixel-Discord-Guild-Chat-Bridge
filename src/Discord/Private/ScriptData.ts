import type { ScriptDataJSON } from '../../Types/Discord.js';

class ScriptData {
  private name: string = '';

  setName(name: string): this {
    this.name = name;
    return this;
  }

  getName(): string {
    return this.name;
  }

  toJSON(): ScriptDataJSON {
    return { name: this.getName() };
  }
}

export default ScriptData;
