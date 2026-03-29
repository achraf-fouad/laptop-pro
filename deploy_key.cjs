const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connection ready');
  conn.exec('mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys', (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Key added. Exiting');
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
    
    // Write public key to the cat stream, then end it
    const key = '\n' + fs.readFileSync('ssh_key.pub', 'utf8') + '\n';
    stream.write(key);
    stream.end();
  });
}).on('error', (err) => {
  console.error('Connection error:', err);
}).connect({
  host: '68.65.121.242',
  port: 21098,
  username: 'maronqrc',
  password: '1r26Uf4eAhJB.'
});
