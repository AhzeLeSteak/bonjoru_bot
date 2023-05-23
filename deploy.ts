import path from "path";
import dotenv from "dotenv";

const {NodeSSH} = require('node-ssh')
const Application = require('ssh-deploy-release');

const root = path.resolve(__dirname, './.env')
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
    username: process.env.DEPLOY_USER,
    password: process.env.DEPLOY_PASSWORD,
    deployPath: process.env.DEPLOY_PATH,
    currentReleaseLink: 'app'
};

async function main(){
    const ssh = new NodeSSH()
    await ssh.connect({
        host: process.env.DEPLOY_IP,
        username: process.env.DEPLOY_USER,
        port: 22,
        password: process.env.DEPLOY_PASSWORD,
    });

    const sudo = async(command: string, relative_path = '') => {
        const {stderr} = await ssh.exec(`sudo -S ${command}`, [], {
            cwd: `${process.env.DEPLOY_PATH}/${relative_path}`,
            stdin: `${process.env.DEPLOY_PASSWORD}\n\n`,
            stream: 'both'
        });
        if(!stderr.startsWith('[sudo] password for '))
            console.log(stderr);
    }

    await sudo(`rm -r bonjoru_bot`, '..');
    console.log('Erase previous files');

    const deployer = new Application(options);
    await new Promise<void>(resolve =>
        deployer.deployRelease(() => {
            console.log('Sources deployed !')
            resolve();
        })
    );


    await sudo(`npm i`, 'app');
    console.log('Installed node modules');

    await sudo(`sudo -S systemctl restart bonjoru_bot`);
    console.log('Service restarted !');
    process.exit()
}

main();
