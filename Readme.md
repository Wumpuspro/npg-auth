# NPG OAuth

## 1 - Install
`npm i -S @npg/oauth`

## 2 - Use

```js
import { Client } from '@npg/oauth';

export default new Client({
  id: '533947001578979328',
  secret: '<your_bot_secret>',
  redirectURI: 'http://localhost:3000/auth',
  scopes: ['identify', 'guilds']
});
...
const key = await client.getAccess('<code_from_discord>');
...
const user = await client.getUser(key); // { id: '...', username: 'Wumpus', ... }
const guilds = await client.getGuilds(key); // Collection<{ id: '...', name: 'NPG', ... }>
```

