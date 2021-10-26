# VIM basic tips

- start vim with `vi` + optional fileName
- has three modes useing the following keys to access them:
  - `i` - insert mode (text editing)
  - `ESC` - command mode (Primary mode)
  - `:` - last line mode (searching, saving exiting)
- to quite VIM, push `ESC` and type:
  - `:q!` - quite and discard all changes
  - `:wq` - save and exit
  - `:q` - exit VIM
- to delete line, push `ESC` and type:
  - `dd` - delete line recardless of the cursor position
  - `D` - delete all text from the cursor position to the end of the line
  - `dl` - delete all text from the current position to the end of the screen

# Server Tips

- viewing auth logs

  - full log: `sudo cat /var/log/auth.log`
  - page by page: `sudo less /var/log/auth.log`
  - view last lines, keep tail open and follow changes: `sudo tail -f /var/log/auth.log`
  - view first lines: `sudo head /var/log/auth.log`
  - show running processes: `ps`

- misc.

  - all the log files are kept at '/var/log' dir

# SSH setup

- Secure Shell (ssh): a network protocol that gives users a secure way to access a computer over an unsecured network.
- Generate public and private keys, keep privat on your machine and public on the host.

  1. move to .ssh folder amd create a public/private key pair: `cd ~/.ssh && ssh-keygen -f digital-ocean`
  2. enter the requested info
  3. print the public key, copy it and add it to the host: `cat digital-ocean`
  4. ssh into the host as a root user: `ssh root@164.90.176.198` (is the corresponding ip address)

     - when you ssh first time it will say that no private key was matched among the known hosts, type `yes`

  5. next you can assosiate the private key with the host: `ssh -i digital-ocean root@164.90.176.198`
     (digital-okean is the file that holds the private key )

- add the private key is added to the keychain

  - Make sure keychaing is active `vi ~/.ssh/config`

  ```bash
    Host \*
     &nbsp; &nbsp; AddKeysToAgent yes
     &nbsp; &nbsp; UseKeychain yes
  ```

  - add private key to keychain: `ssh-add -K ~/.ssh/digital-ocean`
  - we can ssh to the host: `ssh user@ip-address`

# Server setup

- update software: `apt update`
- upgrade software: `apt upgrade`

- add new user with sudo access

  - add new user: `adduser levan`
  - add user to sudo group: `usermod -aG sudo levan`
  - switch user: `su levan`
  - check sudo access: `sudo cat /var/log/auth.log`

- set user persmission

  - swith to user: `su levan`
  - Create a new .ssh dir if it doesn't exist: `mkdir -p ~/.ssh`
  - create authorized_keys file and paste public key `vi ~/.ssh/authorized_keys`

- remove root user (unsafe to have it)

  - change file permissions: `chmod 644 ~/.ssh/authorized_keys`
  - disable root login: `sudo vi /etc/ssh/sshd_config`
    - find `PermitRootLogin` and set it to no
  - restart the deamon: `sudo service sshd restart`

# Web Server: Nginx

Nginx is a web server that can also be used as a reverse proxy, load balancer, mail proxy and HTTP cache. Very light wait
and extremly fast. A server without web server dosn't really do much, it doesn't even respond to requests. One of the
tasks of Nginx is to route requests to where they belong (be that, app, database or even another server).

- install nginx: `sudo apt install nginx`
- start nginx: `sudo service nginx start`
- restart nginx: `sudo service nginx reload`
- health check: `sudo nginx -t`

## Web App: Node

We can use nginx to run node apps

- install node and npm: `sudo apt install nodejs npm`
- install git: `sudo apt install git`
- change onwership of the www directory to the current user: `sudo chown -R $USER:$USER /var/www`
- create app directory: `mkdir /var/www/app`
- initialize empty git repo: `cd /var/www/app && git init`
- by default nginx is set to port `80`, you can change this:

  - edit default:  
    `sudo vi /etc/nginx/sites-available/default`
  - set  
    `location / {}`  
    to:  
    `location / { proxy_pass http://127.0.0.1:3000/ };`

- restart nginx: `sudo service nginx reload`
- update node
  - downlaod setup script from nodesource: `curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh`
  - run script: `sudo bash nodesource_setup.sh`
  - instal node: `sudo apt install nodejs`

## Process Manager: pm2

Everytime we restart the server it will kill the node app. We can use process manager to start process on startup. It keeps an app running. It handles errors, logging, restarts, clustering, etc. `pm2` is one of such managers.

- install PM2 globally: `sudo npm i -g pm2`
- start PM2 `pm2 start /var/www/app/app.js`
- setup auto restart: `pm2 startup`

## SSH to github with server

- move to .ssh dir: `cd ~/.ssh`
- generate key `ssh-keygen -t ed25519 -C "levantsu@gmail.com"`
  - it will ask to which file we want to save it to
  - if newer ed25519 standard is not supported use rsa: `ssh-keygen -t rsa -b 4096 -C levantsu@gmail.com`
- start ssh agent: `sudo eval "$(ssh-agent -s)"`
- add private ssh key to the ssh agent (assuming that your filename is github) `ssh-add ~/.ssh/github`
- add the public key to github
- add user.email and user.name to the global git config locally
  - `git config --global user.name LevTS`
  - `git config --global user.email levantsu@gmail.com,`
- now we can clone repos from github

# Bash basics

## commands

- `ping`: followed by url or ip adderess will continuesly ping the address
- `traceroute`: followed by domain or by ip address, shows the whole chain used to reach the website
- `-v`: gives more info about the command call, ised for debugging, e.g. (`ssh root@164.90.176.198 -v`)
- `dig`: fetches records about the domain, e.g. (`dig lts.codes`)
- `sudo !!`: run last used command with sudo rights
- `ps`: show running process
- `ps aux`: will also show background processes

## chaining commands

### Standard Streams

- standard output: `stdout`
- standard input: `stdin`
- standard error: `stderr`

### Redirection

- `|` - read from stdout
- `>` - write stdout to file
- `>>` - append stdout to file
- `<` - read from stdin
- `2>` - read from stderr

### redirection

We can take the output of a coomand and do something with it. For example we can:

- check the running processes with `ps` and filter the stdout with `grep`
  - `ps | grep bash`
- check the running process and write the stdout to the log file
  - `ps > test.log`
- cat the file content and print filtered content
  - `sudo cat /var/log/auth.log | grep levan`

## search things on linux

- search file/dir name: `find <dir> -<option> "<search expression>"`

  - options
    - `-name`
    - `-type`
    - `-empty`
    - `-executable`
    - `-writable`
  - examples
    - find auth.log in /var/log: `find /var/log -name "auth.log"`
    - find all nginx logs files in /var/log: `find /var/log/nginx -type f -name "*.log"`
    - find all dirs with the name 'log': `find /var -type d -name "log"`

- search file content: `grep -<option> "<search expression>" <dir>`
- search inside gzip file: `zgrep -<option> "<search expression>" <dir>`

# Nginx Config pasics

## Nginx Redirect

Just as in Express we can do redirect with Nginx. This redirect will happend even before we reach our app. For example
if we want to redirect ltscodes.com/help to https://developer.mozilla.org/en-US/ we should do the following:

- `sudo vi /etc/nginx/sites-available/default`
- add: `location /help { return 301 https://developer.mozilla.org/en-US/; }`
- 301 is a status which means temporary redirect, there is also 302 which means permanent redirect. This is important
  because if we set 302 search engines will record this and in the future they will directly visit the redirect page.

## Nginx Subdomain

We can create subdomains which is basically a seperate server on it's own. The subdomains will need to run their own
apps. For example if we need to add a subdomain test to ltscode.com we should add the following to the `default`.

```bash
  server {
    listen 80;
    listen[::]80; # IPV6 notation

    server_name test.ltscode.com;

    location / {
      proxy_pass http://localhost:3000
    }
  }
```

## Nginx File Compression

By default nginx uses gzip compression. It compresses files sent to the client and the client unpacks them. This reduces
size of a payload a lot. Options are set out in the nginx config file available at: `/etc/nginx/nginx.config`

# Security

## Checklist

- SSH
- Firewalls
- Updates
- Two factor authentication
- VPN

### Unattended upgrades

A program which keeps linux up to date by installing security and minor fixes automatically. To enable it run the
following command:

- `sudo apt install unattended-upgrades`

### Firewall

A network security device/software that monitors incoming and outgoing network traffic and decides whether to allow or
block specific traffic based ona defined set of security rules.

- nmap is a program that checks the open ports
- install: `sudo apt install nmap`
- check open port on your server: `nmap <SERVER_IP_ADDRESS>`
- get more detailed info: `nmap -sV <SERVER_IP_ADDRESS>`

#### Ports

Communication endpoint that maps to a specific process or network service. Ports are usually standardized and associated
to certain processes, e.g. port 80 is a usual nginx, port 22 is ssh, port 21 is ftp, etc. We should
keep unused ports closed to decrease valnurabilities and expose as little as possible.

#### UFW - uncomplicated firewall

is a simple and open source firewall software

- check the status: `sudo ufw status`
- activate ufw: `sudo ufw enable`
- allow ssh (port 22): `sudo ufw allow ssh`
- allow all http requests: `sudo ufw reject http`

#### Permissions

We can read, write, or execute files. Permissions are all about controlling which of these permissions do the users have.
The rule of thumb is that you need to have least of trust for your files. If someone doesn't need to have a permission
close that file.

- Linux Chmod Permissions Cheat Sheet: https://isabelcastillo.com/linux-chmod-permissions-cheat-sheet

# HTTP

## Headers

Header is a metadata that comes with every request and response. For example, some of the most common request headers:

- User-agent: the requesting device type
- Accept: What the device will handle
- Accept-language: browser language
- Content-type: the type of media
- Set-cookie: Set stateful information
- X-: typucally used for custom headers

## Status codes

Status code indicates the status of an HTTP request. First number always indicates to the type of the statis

| Code |     Type     |
| ---: | :----------: |
|  1XX | Information  |
|  2xx |   Success    |
|  3xx |   Redirect   |
|  4xx | Client Error |
|  5xx | Server Error |
