const Anternet = require('anternet');
const secp256k1 = require('secp256k1');

const PUBLIC_KEY_LENGTH = 33;
const SIGNATURE_LENGTH = 64;
const MSG_MIN_LENGTH = PUBLIC_KEY_LENGTH + SIGNATURE_LENGTH;

const BUFFER_ENCODING = 'hex';
const HASH_ALGORITHM = 'sha256';

const MSG_TYPE_BROADCAST = 0x04;

class Extension extends Anternet.Extension {

  static createHash() {
    return crypto.createHash(HASH_ALGORITHM);
  }

  init() {
    this.channels = new Map();
  }

  bindEvents() {
    return {
      [MSG_TYPE_BROADCAST]: this.onBroadcast.bind(this),
    };
  }

  attach(channel) {
    this.channels.set(channel.id, channel);
  }

  detach(channel) {
    this.channels.delete(channel.id);
  }

  onBroadcast(rid, args, rinfo) {
    if (args.length < 1 || !(args[0] instanceof Buffer) || args[0].length < MSG_MIN_LENGTH) {
      this.anternet.error(Anternet.Errors.BAD_PARAM, rid, 'Unknown broadcast format', rinfo.port, rinfo.address);
      return;
    }

    let [start, end] = [0, PUBLIC_KEY_LENGTH];
    const publicKey = args[0].slice(0, end);

    [start, end] = [end, start + SIGNATURE_LENGTH];
    const signature = args[0].slice(start, end);

    const msg = args[0].slice(end);
    const hash = this.constructor.createHash().update(msg).digest();

    let data;
    try {
      data = this.anternet.decode(msg);
    } catch (err) {
      this.anternet.error(Anternet.Errors.BAD_PARAM, rid, 'Invalid msg', rinfo.port, rinfo.address);
      return;
    }

    if (!secp256k1.verify(hash, signature, publicKey)) {
      this.anternet.error(Anternet.Errors.BAD_PARAM, rid, 'Invalid signature', rinfo.port, rinfo.address);
      return;
    }

    const id = publicKey.toString(BUFFER_ENCODING);
    const channel = this.channels.get(id);

    if (channel) {
      channel.emit('broadcast', data, rinfo);
    }

    this.anternet.response(rid, [], rinfo.port, rinfo.address);
  }
}

module.exports = Extension;
