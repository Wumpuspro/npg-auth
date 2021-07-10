const permissionConstants = {
  1: 'CREATE_INSTANT_INVITE',
  2: 'KICK_MEMBERS',
  4: 'BAN_MEMBERS',
  8: 'ADMINISTRATOR',
  0x10: 'MANAGE_CHANNELS',
  0x20: 'MANAGE_GUILD',
  0x40: 'ADD_REACTION',
  0x80: 'VIEW_AUDIT_LOG',
  0x400: 'VIEW_CHANNEL',
  0x800: 'SEND_MESSAGES',
  0x1000: 'SEND_TTS_MESSAGES',
  0x2000: 'MANAGE_MESSAGES',
  0x4000: 'EMBED_LINKS',
  0x8000: 'ATTACH_FILES',
  0x10000: 'READ_MESSAGES_HISTORY',
  0x20000: 'MENTION_EVERYONE',
  0x40000: 'USE_EXTERNAL_EMOJIS',
  0x100000: 'CONNECT',
  0x200000: 'SPEAK',
  0x400000: 'MUTE_MEMBERS',
  0x800000: 'MANAGE_NICKNAMES',
  0x1000000: 'MANAGE_ROLES',
  0x2000000: 'MANAGE_WEBHOOKS',
  0x4000000: 'MANAGE_EMOJIS'
};

export default class Guild {
  /** The guild's unique discord ID. */
  readonly id: string;
  /** Name of the guild. */
  readonly name: string;
  /**  The guild's icon hash. */
  readonly iconHash: string;
  /** A list of the discord-enabled features of the guild. */
  readonly features: string[]
  /** Whether the authorized user is the guild's owner. */;
  readonly isOwner: boolean;
  /** A list of permissions that the authorized user has in this guild. */
  readonly permissions: string[];

  /** The timestamp of creation of the user's account. */
  get createdTimestamp() {
    return parseInt((BigInt(this.id) >> BigInt(22)).toString()) + 1420070400000;
  }
  /** The time of creation of the user's account. */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  constructor({ id, name, icon, features = [], owner = false, permissions = 0 }) {
    this.id = id;
    this.name = name;
    this.iconHash = icon;
    this.features = features;
    this.isOwner = owner;
    this.permissions = this.parsePermissions(permissions);
  }

  private parsePermissions(perms: number) {
    const p = [];
    for (let c in permissionConstants) {
      let permNum = parseInt(c);
      if ((permNum & perms) === permNum)
        p.push(permissionConstants[permNum]);
    }
    return p;
  }

  /**
   * Returns a url to the guild icon.
   * @param size The size of the icon in pixels. (Defaults to 512)
   */
  iconUrl(size = 512): string {
    return this.iconHash
      ? `https://cdn.discordapp.com/icons/${this.id}/${this.iconHash}.${
          this.iconHash.startsWith('a_') ? 'gif' : 'png'}?size=${size}`
      : 'https://i.imgur.com/LvroChs.png';
  }
}
