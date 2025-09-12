class HypixelDiscordGuildBridgeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Hypixel Discord Guild Bridge';
  }

  override toString(): string {
    return this.message;
  }
}

export default HypixelDiscordGuildBridgeError;
