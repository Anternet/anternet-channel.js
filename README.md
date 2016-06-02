# anternet-channel.js

[![build](https://img.shields.io/travis/Anternet/anternet-channel.js.svg?branch=master)](https://travis-ci.org/Anternet/anternet-channel.js)
[![npm](https://img.shields.io/npm/v/anternet-channel.svg)](https://npmjs.org/package/anternet-channel)
[![Join the chat at https://gitter.im/Anternet/anternet.js](https://badges.gitter.im/Anternet/anternet.js.svg)](https://gitter.im/Anternet/anternet.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm](https://img.shields.io/npm/l/anternet-channel.svg)](LICENSE)


[Anternet](https://www.npmjs.com/package/anternet) library for listening to broadcasts form other peers.

## Example

```js
const Anternet = require('anternet');
const Channel = require('anternet-channel');

// put here the publicKey generated from broadcast library
const publicKey = '<< broadcast.publicKey >>';

const anternet = new Anternet();
const channel = new Channel(publicKey);

channel.listen(anternet, (msg, rinfo) => {
 console.log(`got broadcast from [${rinfo.address}:${rinfo.port}]: `, msg);
});
```

## License

[MIT License](LICENSE).
Copyright &copy; 2016 [Moshe Simantov](https://github.com/moshest)



