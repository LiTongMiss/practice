// 项目创建思路
// 项目创建命令必须输入新项目名称
// 当前路径是否存在相同文件名，如果不做这层判断新生成的项目可能会覆盖已有的项目
// 询问用户，引导用户输入配置信息

import symbol from 'log-symbols';
import chalk from 'chalk';
import ora from 'ora';

import {
    notExistFold,
    prompt,
    downloadTemplate,
    updateJsonFile
} from './util';

let create = async (ProjectName)=>{
    // 项目名不能为空
    if(ProjectName === undefined){
        console.log(symbol.error,chalk.red('创建项目的时候，请输入项目名'))
    }else{
        // 如果文件名不存在，则继续执行，否则推出
        notExistFold(ProjectName).then(()=>{
            // 用户询问交互
            prompt.then((answer)=>{
                // 目前只建了一个vue的模板，所以只能先跳过react
                if(answer.frame ==='react'){
                    console.log(symbol.warning, chalk.yellow('react在开发中'))
                    process.exit(1)
                }
                /**
                 * 根据用户输入的配置信息下载模板&更新模板配置
                 * 下载模板比较耗时，这里通过ora插入下载loading，提示用户下载模板
                 */
                let loading = ora('模板下载中。。。')
                loading.start('模板下载中。。。')

                let Api = ""
                switch (answer.frame){
                    case 'vue':
                        Api = 'direct:https://github.com/For-Article/Vue-template.vue';
                        break;
                    case 'react':
                        Api = 'direct:https://github.com/For-Article/React-template.vue';
                        break;
                    default:
                        break;
                }
                downloadTemplate(ProjectName,Api).then(()=>{
                    loading.succeed('模板完成');
                    // 下载完成后，根据用户输入更新配置文件
                    const fileName = `${ProjectName}/package.json`;
                    answer.name = ProjectName;
                    updateJsonFile(fileName, answer).then(()=>{
                        console.log(symbol.success, chalk.green('配置文件更新完成。。。'))

                    },()=>{
                        loading.fail('模板下载失败')
                    })
                })
            })
        })

    }
}

module.exports = create