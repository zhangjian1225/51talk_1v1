
 
const spawn = require('child_process').spawn;

let project = "";
if(process.argv.length<3){
  console.log("缺少参数");
  return;
}
project = process.argv[2];  
const ls = spawn("cmd.exe", ['/c', 'gulp', 'compile', '--project',project,'--env','prov'] );

ls.stdout.on('data', (data) => {
  console.log(` ${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

 