import * as path from "path";
import * as dotenv from "dotenv";
import * as rl from 'readline-sync';

import {NodeSSH} from 'node-ssh';
import Application from 'ssh-deploy-release';

const root = path.resolve('./.env')
dotenv.config({path: root})

const options = {
    localPath: process.cwd(),
    exclude: [
        'node_modules', 'node_modules/**',
        '.idea', '.idea/**',
        '.gitignore',
        'release.tar.gz'
    ],
    host: process.env.DEPLOY_IP,
    deployPath: process.env.DEPLOY_PATH + process.env.DEPLOY_DIR,
    currentReleaseLink: 'app'
};


async function main(){
    const username = rl.question('User : ');
    const password = rl.question('Password : ');

    const ssh = new NodeSSH();
    await ssh.connect({
        host: process.env.DEPLOY_IP,
        username,
        port: 22,
        password: '8wa8a1a3a'
    });

    const sudo = async(command, relative_path = '') => 
        username === 'root'
            ? await ssh.exec(command, [], {cwd: `${process.env.DEPLOY_PATH}/${relative_path}`})
            : await ssh.exec(`sudo -S ${command}`, [], {
                cwd: `${process.env.DEPLOY_PATH}/${relative_path}`.replace('//', '/'),
                stdin: `${password}\n\n`,
                stream: 'both'
            });

    await sudo('echo coucou')

    
    console.log('Erase previous files');
    await sudo(`rm -rf bonjoru_bot`);

    const deployer = new Application({...options, username, password});
    await new Promise(resolve =>
        deployer.deployRelease(() => resolve(console.log('Sources deployed !')))
    );


    console.log('Installing node modules...');
    await sudo(`npm i`, process.env.DEPLOY_DIR + '/app');
    console.log('Installed node modules');

    console.log('Restarting service...');
    await sudo(`systemctl restart bonjoru_bot`);
    console.log('Service restarted !');
}

main();
