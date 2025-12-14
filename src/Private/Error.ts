class HypixelDiscordGuildChatBridgeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Hypixel Discord Guild Chat Bridge';
  }

  override toString(): string {
    return this.message;
  }
}

export default HypixelDiscordGuildChatBridgeError;
