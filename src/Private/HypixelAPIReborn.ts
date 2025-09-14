import Client from 'hypixel-api-reborn/dist/Client.js';

const HypixelAPIReborn = new Client(process.env.HYPIXEL_API_KEY, { cache: true });
export default HypixelAPIReborn;
