
 
const spawn = require('child_process').spawn;
const path = require("path");
const fs = require("fs");


Date.prototype.Format = function(fmt) {
  var o = {
      "M+" : this.getMonth() + 1,
      "d+" : this.getDate(),
      "h+" : this.getHours(),
      "m+" : this.getMinutes(),
      "s+" : this.getSeconds(),
      "q+" : Math.floor((this.getMonth() + 3) / 3),
      "S" : this.getMilliseconds()
  };
  if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

function clean(zipPath){
  if(fs.existsSync(zipPath)){
    fs.unlinkSync(zipPath);
  }
}
 

let project = "";
if(process.argv.length<3){
  console.log("缺少参数");
  return;
}
project = process.argv[2];  
const ls = spawn("cmd.exe", ['/c', 'gulp', 'publish', '--project',project,'--env','prov'] );

ls.stdout.on('data', (data) => {
  console.log(` ${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
  //要压缩的目录
  let zippath = path.resolve(__dirname,"../dist/"+project.replace("T_","")); 
  let pkg = require(zippath+"/package.json");
  //压缩包的存放目录
  let date = new Date();
  let zipname = pkg.name+"_"+date.Format("yyyyMMdd");
  let zipdir = path.resolve(__dirname,"../publish/"+zipname+".zip");
  clean(zipdir); //删除原有的包
  const rar = spawn("C:/Program Files/WinRAR/WinRAR.exe",['a','-r','-ep1','-ibck',zipdir,zippath+"/"]);
  rar.stderr.on('data', (data) => {
    console.log(`压缩stderr: ${data}`);
  });
  rar.on('close',() => {
    console.log("压缩完成");
  });
});

 