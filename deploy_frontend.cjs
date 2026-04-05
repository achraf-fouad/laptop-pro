const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const conn = new Client();

const REMOTE_HOST = '68.65.121.242';
const REMOTE_PORT = 21098;
const REMOTE_USER = 'maronqrc';
const LOCAL_DIST = path.join(__dirname, 'dist');
const REMOTE_DEST = '/home/maronqrc/public_html';
const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, 'ssh_key'));

function runCommand(conn, cmd) {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = '';
      stream.on('close', (code) => {
        resolve(out);
      }).on('data', (data) => {
        out += data.toString();
        process.stdout.write(data);
      }).stderr.on('data', (data) => {
        process.stderr.write(data);
      });
    });
  });
}

async function uploadDir(sftp, localDir, remoteDir) {
  // Ensure remote dir exists
  await new Promise(res => sftp.mkdir(remoteDir, () => res()));

  const entries = fs.readdirSync(localDir, { withFileTypes: true });
  const tasks = [];

  for (const entry of entries) {
    const localPath = path.join(localDir, entry.name);
    const remotePath = `${remoteDir}/${entry.name}`;

    if (entry.isDirectory()) {
      tasks.push(uploadDir(sftp, localPath, remotePath));
    } else {
      tasks.push(new Promise((res, rej) => {
        sftp.fastPut(localPath, remotePath, (err) => {
          if (err) {
            console.error(`  ✗ Failed: ${entry.name} - ${err.message}`);
            res(); // continue on error
          } else {
            console.log(`  ✓ ${remotePath.replace(REMOTE_DEST, '')}`);
            res();
          }
        });
      }));
    }
  }

  await Promise.all(tasks);
}

conn.on('ready', async () => {
  console.log('✅ SSH Connected to cPanel via SSH key!');
  
  conn.sftp(async (err, sftp) => {
    if (err) {
      console.error('SFTP error:', err);
      conn.end();
      return;
    }

    try {
      console.log('\n📤 Uploading dist/ → public_html ...\n');
      await uploadDir(sftp, LOCAL_DIST, REMOTE_DEST);
      console.log('\n✅ All frontend files uploaded successfully!');
      console.log('🎉 Visit https://maroclaptop.com to see your updated site!');
    } catch (e) {
      console.error('Upload error:', e);
    } finally {
      sftp.end();
      conn.end();
    }
  });

}).on('error', (err) => {
  console.error('❌ SSH Connection error:', err.message);
  console.error('Details:', err);
}).connect({
  host: REMOTE_HOST,
  port: REMOTE_PORT,
  username: REMOTE_USER,
  privateKey: PRIVATE_KEY,
  readyTimeout: 15000,
});
