const EventEmitter = require('events');
const Anternet = require('anternet');
const Extension = require('./lib/extension');

const PUBLIC_KEY_LENGTH = 33;
const BUFFER_ENCODING = 'hex';

class Channel extends EventEmitter {

  constructor(publicKey) {
    super();

    if (publicKey instanceof Buffer) {
      this.publicKey = publicKey;
    } else if (typeof publicKey === 'string') {
      this.publicKey = Buffer.from(publicKey, BUFFER_ENCODING);
    } else {
      throw new Error('`id` must be a Buffer or string');
    }

    if (this.publicKey.length !== PUBLIC_KEY_LENGTH) throw new Error('Invalid publicKey length');
  }

  static extend(anternet) {
    if (!(anternet instanceof Anternet)) throw new Error('Invalid instance; Anternet instance expected');

    return anternet.extend(Extension);
  }

  static release(anternet) {
    if (!(anternet instanceof Anternet)) throw new Error('Invalid instance; Anternet instance expected');

    return anternet.release(Extension);
  }

  get id() {
    return this.publicKey.toString(BUFFER_ENCODING);
  }

  listen(anternet, callback) {
    if (this.extension) throw new Error('This channel already attached');

    this.extension = this.constructor.extend(anternet);
    this.extension.attach(this);

    if (callback) this.on('broadcast', callback);
    return this;
  }

  close() {
    this.extension.detach(this);
    this.extension = null;

    process.nextTick(() => this.emit('close'));
    return this;
  }
}

module.exports = Channel;
