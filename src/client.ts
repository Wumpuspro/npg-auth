import jwt from 'jsonwebtoken';
import phin from 'phin';
import uid from 'uid';
import User from './types/user';
import APIError from './errors/api';
import Guild from './types/guild';
import Connection from './types/connection';
import Collection from '@discordjs/collection';

export type Scope = 'bot' | 'connections' | 'email' | 'identify' | 'guilds' | 'guilds.join' | 'gdm.join' | 'messages.read' | 'rpc' | 'rpc.api' | 'rpc.notifications.read' | 'webhook.incoming';

export class Client {
  private baseURL = 'https://discord.com/api/';

  /** Create a new OAuth2 Client. */
  constructor(private options: ClientOptions) {}

  /** Generates a authorization code link depending on the scopes and redirect URI set. */
  get authCodeLink() {
    if (this.options.scopes.length > 0) {
      let state = uid(16);
      return {
        url: `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${this.options.id}&scope=${this.options.scopes.join('%20')}&state=${state}&redirect_uri=${this.options.redirectURI}&prompt=none`,
        state
      };
    } else if (this.options.scopes.length < 1)
      throw new TypeError('Scopes are not defined.');
  }

  /** Gets the access token for the user to perform further functions. */
  async getAccess(code: string): Promise<string> {
    if (!code)
      throw new TypeError('Authorization code not provided.');

    const response: any = await phin({
      method: 'POST',
      url: `${this.baseURL}oauth2/token`,
      parse: 'json',
      form: {
        client_id: this.options.id,
        client_secret: this.options.secret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.options.redirectURI,
        scope: this.options.scopes.join(' ')
      }
    });
    if (response.statusCode === 200) {
      let token = response.body;
      token['expireTimestamp'] = Date.now() + token['expires_in'] * 1000 - 10000;
      return jwt.sign(token, this.options.secret, { expiresIn: token['expires_in'] });
    } else
      throw new APIError(response.statusCode);
  }

  /** Gets a new access token for the user whose access token has expired. */
  async refreshToken(key: string): Promise<string | void> {
    const access = this.getAccessKey(key);

    try {
      const response: any = await phin({
        url: `${this.baseURL}oauth2/token`,
        method: 'POST',
        parse: 'json',
        form: {
          client_id: this.options.id,
          client_secret: this.options.secret,
          grant_type: 'refresh_token',
          refresh_token: access.refresh_token,
          redirect_uri: this.options.redirectURI,
          scope: this.options.scopes.join(' ')
        }
      });
      if (response.statusCode !== 200)
        throw new APIError(response.statusCode);
      
      let token = response.body;
      token.expireTimestamp = Date.now() + token['expires_in'] * 1000 - 10000;

      return jwt.sign(token, this.options.secret, { expiresIn: token.expires_in });
    } catch (err) {
      throw (err.error
        ? new TypeError(err.error)
        : new APIError(err.phinResponse?.statusCode));
    }
  }

  private getAccessKey(key: string): { access_token, token_type, refresh_token } {
    try { return jwt.verify(key, this.options.secret); }
    catch (error) { throw error; }
  }

  /** Gets the user who has authorized using the OAuth2 flow. */
  async getUser(key: string) {
    const access = this.getAccessKey(key);

    try {
      const response: any = await phin({
        url: `${this.baseURL}users/@me`,
        method: 'GET',
        headers: { Authorization: `${access.token_type} ${access.access_token}` },
        parse: 'json'
      });
      if (response.statusCode !== 200)
        throw new APIError(response.statusCode);
        
      return new User(response.body);
    } catch (err) {
      throw (err.error
        ? new TypeError(err.error)
        : new APIError(err['phinResponse']?.statusCode));
    }
  }

  /** Gets the guilds of an authorized user. */
  async getGuilds(key: string): Promise<Collection<string, Guild>> {
    const access = this.getAccessKey(key);
    
    try {
      const response: any = await phin({
        url: `${this.baseURL}users/@me/guilds`,
        method: 'GET',
        headers: { Authorization: `${access.token_type} ${access.access_token}` },
        parse: 'json'
      });
      if (response.statusCode !== 200)
        throw new APIError(response.statusCode);

      const guilds = new Collection<string, Guild>();
      for (const guild of response.body)
        guilds.set(guild.id, new Guild(guild));
      
      return guilds;
    } catch (err) {
      throw err;
    }
  }

  /** Gets the connected third-party accounts of an authorized user. */
  async getConnections(key: string): Promise<Collection<string, Connection>> {
    const access = this.getAccessKey(key);

    try {
      const response: any = await phin({
        url: `${this.baseURL}users/@me/connections`,
        method: 'GET',
        headers: { Authorization: `${access['token_type']} ${access['access_token']}` },
        parse: 'json'
      });
      if (response.statusCode !== 200)
        throw new APIError(response.statusCode);
      
      const connections = new Collection<string, Connection>();
      for (const connection of response.body)
        connections.set(connection.id, connection);
        
      return connections;
    } catch (err) {
      throw (err.error
        ? new TypeError(err.error)
        : new APIError(err['phinResponse']?.statusCode));
    }
  }
};

/** Required options for the client - https://discord.com/developers. */
export interface ClientOptions {
  /** Discord client ID. */
  id: string;
  /** Discord application secret. */
  secret: string;
  /** OAuth Redirect URI that is sent an access code. */
  redirectURI: string;
  /** Scopes for client access. */
  scopes: Scope[];
}
