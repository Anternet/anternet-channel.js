const assert = require('assert');
const Anternet = require('anternet');
const Broadcast = require('anternet-broadcast');
const Channel = require('../');
const { describe, it } = global;

describe('generic', () => {
  it('should receive broadcast', (done) => {
    const anternet = new Anternet();
    const broadcast = Broadcast.generate();

    const msg = { foo: 'bar', a: 123 };
    const address = '127.0.0.1';
    const port = 12345;
    const channel = new Channel(broadcast.publicKey);

    let i = 0;
    channel.listen(anternet, (data, rinfo) => {
      assert.equal(i++, 0);
      assert.deepEqual(data, msg);

      assert.equal(rinfo.address, address);
      assert.notEqual(rinfo.port, port);
    });

    anternet.bind(port);

    const anternet2 = new Anternet();
    broadcast.send(anternet2, msg, port, address, (err) => {
      if (err) return done(err);

      assert.equal(i++, 1);
      done();
    });
  });
});
