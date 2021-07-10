export default interface Connection {
  /** The id of the third-party account. */
  id: string;
  /** The username of the third-party account. */
  name: string;
  /** The name of the service providing the third-party account. */
  service: string;
  /** Whether the user has revoked this connection. */
  isRevoked: string;
  /** Whether the user has verified this connection. */
  isVerified: string;
  /** Whether the user has enabled friend synchronization. */
  friendSync: string;
  /** Whether to show the activity in the connected account in Rich Presence. */
  showActivity: string;
  /** Whether is account is visible on the user's profile. */
  isPublic: string;
  /** A array of integration objects. */
  integrations: string;
}
