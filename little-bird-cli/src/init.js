/**
 * 项目初始化
 * 安装依赖，为了减少项目模板包的大小，下载的模板里不包含node_modules目录，创建完成之后要安装依赖
 * 初始化git仓库，方便代码提交 管理
 * 自动在远端生成git仓库
 */

import child from 'child-process';
import symbol from 'log-symbols';
import chalk from 'chalk';
import ora from 'ora';

const util = require('util');
const exec = util.promisify(require("child_process").exec);
import {updateJsonFile} from './util';

let init = async (username, token)=>{
    try{
        await loadCmd('git init', 'git 初始化');
        if(username === '' || token === ''){
            console.log(symbol.warning, chalk.yellow('缺少参数无法创建远程仓库'))
        }else{
            const projectName = process.cwd().split('/').slice(-1)[0];
            await loadCmd(`curl - u "${username}:${token}" https://api.github.com/user/repos -d '{"name":"${projectName}'`, 'Github仓库创建')
            await loadCmd(`git remote add origin https://github.com/${username}/${projectName}.git`, '关联远端仓库')
            let loading = ora();
            loading.start(`package.json更新repository：命令执行中。。。`);
            await updateJsonFile('pakage.json',{
                "repository":{
                    "type":"git",
                    "url":`https://github.com/${uername}/${projectName}.git`
                }
            }).then(()=>{
                loading.succeed(`package.json更新repository：命令执行完成`)
            })
            await loadCmd(`git add .`, '执行git commit')
            await loadCmd(`git commit -a -m 'init'`,'执行git commit')
            await loadCmd(`git push --setupstream origin master`,'执行git push')
        }
        await loadCmd(`npm install`, '安装依赖')
    }catch(err){
        console.log(symbol.error, chalk.err('初始化失败'))
        console.log(symbol.error, chalk.err(err))
        process.exit(1)
    }
}

let loadCmd = async (cmd, text) => {
    let loading = ora();
    loading.start(`${text}:命令执行中...`);
    await exec(cmd);
    loading.succeed(`${text}:命令执行完成`);
}

module.exports = init;