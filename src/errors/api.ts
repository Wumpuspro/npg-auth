/** A list of the commonly occurring errors. */
const errors = new Map<number, string>([
  [400, 'Invalid request made'],
  [401, 'Invalid access token'],
  [403, 'Not enough permissions'],
  [404, 'Resource not found'],
  [405, 'Method not allowed'],
  [429, 'You are being rate limited'],
  [502, 'Server busy, retry after a while']
]);

export default class APIError extends Error {
  constructor(
    public statusCode: number,
    ...params: any[]) {
    super(...params);

    this.message = errors.get(this.statusCode)
      || this.message
      || 'An error occurred';
  }
};
