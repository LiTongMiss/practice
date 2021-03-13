import fs from 'fs';
import symbol from 'log-symbols';
import chalk from 'chalk';
import inquirer from 'inquirer';
import downloadGit from 'download-git-repo';
import { resolve } from 'path';
import { rejects } from 'assert';


// 文件是否存在
let notExistFold = async (name)=>{
    return new Promise((resolve)=>{
        if(fs.existsSync(name)){
            console.log(symbol.error, chalk.red('文件名已被占用，请更换名字重新创建'))
        }else{
            resolve()
        }
    })
}


// 询问用户
let prompList = [
    {
        type: 'list',
        name:'frame',
        message:'please choose this project template',
        choices: ['vue', 'react']
    },
    {
        type: 'input',
        name: 'description',
        message: 'please enter then project description: '
    },
    {
        type: 'input',
        name: 'author',
        message: 'please enter then project author name: '
    }
]

let prompt = ()=>{
    return new Promise(resolve=>{
        inquirer.prompt(prompList).then(answer=>{
            resolve(answer)
        })
    })
}

// 项目模板远程下载
let downloadTemplate = async (ProjectName, api)=>{
    return new Promise((resolve,reject)=>{
        downloadGit(api,ProjectName,{clone:true}, (err)=>{
            if(err){
                reject(err)
            }else {
                resolve()
            }
        })
    })
}

// 更新json配置文件
let updateJsonFile = (fileName, obj)=>{
    return new Promise(resolve=>{
        if(fs.existsSync(fileName)){
            // 读取配置文件
            const data = fs.readSync(fileName).toString();
            // 格式化json
            let json = JSON.parse(data);
            // 添加用户自定义配置项
            Object.keys(obj).forEach(key =>{
                json[key]= obj[key]
            })
            // 写入添加后的配置文件
            fs.writeFileSync(fileName, JSON.stringify(json, null, '\t'), 'utf-8');
            resolve();
        }
    })
}

module.exports = {
    notExistFold,
    prompt,
    downloadTemplate,
    updateJsonFile
}