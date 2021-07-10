/** A discord user who has authorized your app to have access to their data. */
export default class User {
  /** The user's discord username. */
  username: string;
  /** The user's locale. */
  locale: string
  /** Whether the user has enabled 2-factor authentication. */
  isMFAEnabled: boolean;
  /** The user's discriminator (e.g. '0001'). */
  discriminator: string;
  /** The user's unique discord ID. */
  id: string;
  /** The user's E-Mail ID. */
  emailId: string;
  /** Whether the user's E-Mail ID has been verified. */
  emailVerified: boolean;
  /** The user's profile's flags. */
  userFlags: string[];
  /** The user's avatar hash. */
  avatarHash: string;
  /** The premium subscription type. */
  premiumType: string;
  /** Whether the user is a discord bot. */
  bot: boolean;
  /** Get the URL of a user's display avatar. */
  readonly displayAvatarURL: string;
  /** Tag of the user (e.g. ADAMJR#0001) */
  readonly tag: string;

  constructor({
    username,
    locale,
    mfa_enabled,
    flags = 0,
    avatar = null,
    discriminator,
    id,
    email = undefined,
    verified = undefined,
    premium_type = 0,
    bot = false
  }) {
    this.username = username;
    this.locale = locale;
    this.isMFAEnabled = mfa_enabled;
    this.discriminator = parseInt(discriminator).toString().padStart(4, '0');
    this.id = id;
    this.emailId = email;
    this.emailVerified = verified;
    this.avatarHash = avatar;
    this.userFlags = [];
    this.premiumType = premium_type === 0 ? 'None' : premium_type === 1 ? 'Nitro Classic' : 'Nitro';
    this.bot = bot;
    this.displayAvatarURL = this.avatarURL({ dynamic: true, size: 256 });
    this.tag = `${this.username}#${this.discriminator}`;

    this.buildFlags(flags);
  }

  private buildFlags(flags: number) {
    if ((flags & 1) === 1)
      this.userFlags.push('Discord Employee');
    if ((flags & 2) === 2)
      this.userFlags.push('Discord Partner');
    if ((flags & 4) === 4)
      this.userFlags.push('HypeSquad Events');
    if ((flags & 8) === 8)
      this.userFlags.push('Bug Hunter Level 1');
    if ((flags & 64) === 64)
      this.userFlags.push('HypeSquad House of Bravery');
    else if ((flags & 128) === 128)
      this.userFlags.push('HypeSquad House of Brilliance');
    else if ((flags & 256) === 256)
      this.userFlags.push('HypeSquad House of Balance');
    if ((flags & 512) === 512)
      this.userFlags.push('Early Supporter');
    if ((flags & 1024) === 1024)
      this.userFlags.push('Team User');
    if ((flags & 4096) === 4096)
      this.userFlags.push('System');
    if ((flags & 16384) === 16384)
      this.userFlags.push('Bug Hunter Level 2');
    if ((flags & 131072) === 131072)
      this.userFlags.push('Verified Bot Developer');
  }

  /** The timestamp of the creation of the user's account. */
  get createdTimestamp() {
    return parseInt((BigInt(this.id) >> BigInt(22)).toString()) + 1420070400000;
  }
  /** The time of creation of the user's account. */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /** Get the URL of a user's avatar, with options. */
  avatarURL(options: AvatarOptions = { size: 512 }): string {
    const extension = (this.avatarHash?.startsWith('a_') && options.dynamic) ? 'gif' : 'png';

    return `https://cdn.discordapp.com/${this.avatarHash ? '' : 'embed/'}avatars/${
      this.avatarHash ? `${this.id}/${this.avatarHash}` : parseInt(this.discriminator) % 5
    }.${(this.avatarHash) ? extension : 'png'}?size=${options.size}`;
  }
}

export interface AvatarOptions {
  dynamic?: boolean;
  size?: number;
}
