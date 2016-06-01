const crypto = require('crypto');
const EventEmitter = require('events');
const Anternet = require('anternet');
const Extension = require('./lib/extension');

const BUFFER_ENCODING = 'hex';

class Channel extends EventEmitter {

  constructor(anternet, id) {
    super();

    this.extension = this.constructor.extend(anternet);
    this.extension.attach(this);

    if (id instanceof Buffer) {
      this.publicKey = id;
    } else if (typeof id === 'string') {
      this.publicKey = Buffer.from(id, BUFFER_ENCODING);
    } else {
      throw new Error('`id` must be a Buffer or string');
    }
  }

  static extend(anternet) {
    if (!(anternet instanceof Anternet)) throw new Error('Invalid instance; Anternet instance expected');

    return anternet.extend(Extension);
  }

  get id() {
    return this.publicKey.toString(BUFFER_ENCODING);
  }

  listen(callback) {
    this.on('broadcast', callback);
    return this;
  }

  detach() {
    this.extension.detach(this);
    return this;
  }
}

module.exports = Channel;
