import { spawn } from 'child_process';
import { exec } from 'child_process';

console.log('===================================================');
console.log('  Aadhi Cars - SECURE PUBLIC TUNNEL');
console.log('===================================================');
console.log('Note: Localtunnel is currently experiencing an outage.');
console.log('Connecting to stable secure tunnel...');

const tunnel = spawn('ssh', ['-o', 'StrictHostKeyChecking=no', '-R', '80:localhost:3000', 'nokey@localhost.run']);

let urlFound = false;

const processOutput = (data) => {
  const output = data.toString();
  const match = output.match(/(https:\/\/[a-zA-Z0-9-]+\.lhr\.life)/);
  if (match && !urlFound) {
    urlFound = true;
    const url = match[1];
    console.log('\n\n✅ TUNNEL CONNECTED SUCCESSFULLY! ✅');
    console.log(`\n👉 PUBLIC URL: ${url} 👈\n`);
    console.log('Please share this link with your team.');
    
    // Attempt to copy to clipboard (Windows)
    exec(`echo | set /p="${url}" | clip`, (error) => {
        if (!error) console.log('(The URL has been automatically copied to your clipboard!)');
    });
  }
};

tunnel.stdout.on('data', processOutput);
tunnel.stderr.on('data', processOutput);

tunnel.on('close', (code) => {
  console.log(`Tunnel disconnected. Please close this window and restart.`);
});
