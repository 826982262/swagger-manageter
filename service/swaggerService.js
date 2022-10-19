let co = require('co');//异步控制器
const fs = require("fs")
const path = require('path')

const {WORKDIR,SWAGGERJSONFILE} = require('../config/config.default.js');
const {getCheckSum,checkConfigFile,checkSumEqueir} = require('../utils/fileUtils')

// 配置文件查找
let checkConfigFileService = async (ctx, next) => {
    var files = checkConfigFile(WORKDIR);
    let res = await co(function* (){
            if(files ==false){
                ctx.throw({success: false,code: 400, message: "配置文件不存在"})
            }
    var nowconfig=null;
     if(fs.existsSync(SWAGGERJSONFILE)){
        var configCheckSum = getCheckSum(SWAGGERJSONFILE);
        for(var i=0;i<files.length;i++){
            var vcheckSum = getCheckSum(WORKDIR+'/'+files[i])
            if(checkSumEqueir(vcheckSum,configCheckSum)){
                nowconfig=files[i]
                break
            }
        }
         nowconfig= nowconfig==null?null:nowconfig
    }
    var result = {
        "fileLists": JSON.stringify(files),
        "nowConfig": nowconfig,
        "code": 200,
        "success": true
    }
    return result
 })
    ctx.body = res
} 


// 文件上传
let uploadFile= async (ctx, next) => {
    const file = ctx.request.files.file; // 获取上传文件
    let res = await co(function* (){
    const type = file.originalFilename.split('.').pop();  
    if(type!='json'){
        ctx.throw({success: false,code: 502, message: "文件类型错误"})
    }
    const reader = fs.createReadStream(file.filepath);
    let filePath = path.join(__dirname, '../workdir') + `/${file.originalFilename}`;
    const upStream = fs.createWriteStream(filePath);
    reader.pipe(upStream);
    return result = {success: true,code: 200, message: "上传成功",file: file.originalFilename};
        
    })
    ctx.body = res
}

module.exports = { checkConfigFileService,uploadFile }