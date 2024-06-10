# Déploiement

#### Installation de node
`apt install nodejs -y`

#### Création du service
Contenu du fichier /etc/systemd/system/bonjoru.service

    [Unit]
    Description=Bonjoru bot
    After=network.target

    [Service]
    Type=forking
    UMask=007
    WorkingDirectory=/root/bonjoru_bot/app
    ExecStart=npm run start
    Restart=on-failure

    [Install]
    WantedBy=multi-user.target

#### Lancement du service
`systemctl enable bonjoru`
`systemctl start bonjoru`

