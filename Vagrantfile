# -*- mode: ruby -*-
# vi: set ft=ruby :
$bootstrap = <<SCRIPT

yel=$'\e[1;33m'
end=$'\e[0m'

echo "${yel}Begin Bootstrapping${end}";

## Download and install the default jre for Ubuntu
# if ! [ $(command -v java) ]; then
#     echo "${yel}Installing Java JRE using apt-get default-jre${end}";
#     sudo apt-get update;
#     sudo apt-get install -y default-jre;
#     echo "${yel}Finished Installing Java JRE${end}";
# else
#     echo "${yel}Java is already installed${end}";
# fi

## Download and install DynamoDB Local
# if [ ! -f /home/vagrant/DynamoDBLocal.jar ]; then
#     echo "${yel}Downloading DynamoDB Local${end}";
#     sudo wget --quiet https://s3-us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.tar.gz;
#     tar -xf dynamodb_local_latest.tar.gz;
#     echo "${yel}Done Downloading DynamoDB Local${end}";
# else
#     echo "${yel}DynamoDB Local is already installed${end}";
# fi

## PostgreSQL =================================================================
## Download and Install PostgreSQL
if ! [ $(command -v psql) ]; then
    sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
    wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O - | sudo apt-key add -
    apt-get update;
    apt-get install -y postgresql-9.6 python-pip libpq-dev python-dev;
else
    echo "${yel}PostgreSQL is already installed${end}";
fi

## Configure PostgreSQL pg_hba.conf file to allow host computer access to connect
if [ ! -f /etc/postgresql/9.6/main/pg_hba.conf.backup ]; then
    sudo mv /etc/postgresql/9.6/main/pg_hba.conf /etc/postgresql/9.6/main/pg_hba.conf.backup;

    pg_hba_info="local   all             postgres                                peer
# TYPE  DATABASE        USER            ADDRESS                 METHOD
# "local" is for Unix domain socket connections only
local   all             all                                     trust
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
host    all             all             192.168.0.0/24          md5
host    all             all             10.0.2.2/32             md5"

    printf "$pg_hba_info" >> /etc/postgresql/9.6/main/pg_hba.conf;
else
    echo "${yel}Host Based Authentication config file already prepared${end}";
fi

# Check and edit the postgresql.conf file to listen for external connections
# NOTE: it is important to note that because we are checking for a character that represents
# a wild card, we need to escape the '*' with a backslash, but the backslash needs to be escaped as
# well by using a double backslash. This was causing an inconsistency when running on terminal and in this script
prop_to_check="listen_addresses = '\\*'"

## Modify the listen_addresses property in the postgresql.conf file to allow outside access
if ! grep -q "$prop_to_check" /etc/postgresql/9.6/main/postgresql.conf; then
    sudo sed -i "s/^.*listen_addresses.*'/${prop_to_check}/" /etc/postgresql/9.6/main/postgresql.conf;
else
    echo "${yel}Config file already contains required change${end}";
fi

## Create a User/Role in PostgreSQL to connect with other than the Super User
if ! su - postgres -c "psql postgres -tAc \\"SELECT rolname FROM pg_roles WHERE rolname='vagrant';\\"" | grep -q vagrant; then
    su - postgres -c "psql postgres -c \\"CREATE ROLE vagrant SUPERUSER LOGIN CREATEDB CREATEROLE PASSWORD 'password';\\""
    echo "${yel}'Vagrant' user role created for PostgreSQL server${end}";
else
    echo "${yel}PostgreSQL 'Vagrant' user and role have already been created${end}";
fi

## Create a User with roles specifically for the server client driver to connect with to create tables and objects
if ! su - postgres -c "psql postgres -tAc \\"SELECT rolname FROM pg_roles WHERE rolname='client';\\"" | grep -q client; then
    su - postgres -c "psql postgres -c \\"CREATE ROLE client LOGIN PASSWORD 'password';\\""
    echo "${yel}'client' user role created for PostgreSQL server${end}";
else
    echo "${yel}PostgreSQL 'client' user and role have already been created${end}";
fi

## Create the database for the current project
database_name=test_db
if ! su - postgres -c "psql postgres -tAc \\"SELECT datname FROM pg_database WHERE datistemplate = false;\\"" | grep -q $database_name; then
    su - postgres -c "psql postgres -c \\"CREATE DATABASE $database_name;\\""
    echo "${yel}$database_name database created for PostgreSQL server${end}";
else
    echo "${yel}PostgreSQL $database_name database has already been created${end}";
fi
## PostgreSQL =================================================================

## PGAdmin4 ===================================================================
## check if pgAdmin4 has been downloaded and installed
if [ ! -f /usr/local/lib/python2.7/dist-packages/pgadmin4/pgAdmin4.py ]; then
    echo "${yel}Downloading pgadmin4 v1.2${end}";
    su - vagrant -c "wget -q -P /home/vagrant/ https://ftp.postgresql.org/pub/pgadmin3/pgadmin4/v1.2/pip/pgadmin4-1.2-py2-none-any.whl";

    echo "${yel}Installing pgadmin v1.2${end}";
    sudo pip install /home/vagrant/pgadmin4-1.2-py2-none-any.whl;

    echo "${yel}Set SERVER_MODE to FALSE for easier setup (this isn't production anyway)${end}";
    pgadmin4_config_local="SERVER_MODE = True
LOG_FILE = '/var/log/pgadmin4/pgadmin4.log'
SQLITE_PATH = '/var/lib/pgadmin4/pgadmin4.db'
SESSION_DB_PATH = '/var/lib/pgadmin4/sessions'
STORAGE_DIR = '/var/lib/pgadmin4/storage'
"
    printf "$pgadmin4_config_local" > /usr/local/lib/python2.7/dist-packages/pgadmin4/config_local.py;

    mkdir -p /var/log/pgadmin4/ /var/lib/pgadmin4/sessions /var/lib/pgadmin4/storage;
    touch /var/log/pgadmin4/pgadmin4.log;

    echo "${yel}Setting up pgadmin v1.2${end}";
    PGADMIN_SETUP_EMAIL=vagrant@medlmobile.com PGADMIN_SETUP_PASSWORD=password python /usr/local/lib/python2.7/dist-packages/pgadmin4/setup.py

    # modify the config.py DEFAUL_SERVER variable from localhost to "0.0.0.0"
    echo "${yel}Modifing the DEFAULT_SERVER in config.py${end}";
    sudo sed -i "s/^DEFAULT_SERVER.*'"/"DEFAULT_SERVER = '0.0.0.0'"/ /usr/local/lib/python2.7/dist-packages/pgadmin4/config.py
else
    echo "${yel}pgAdmin4 is already installed and ready to roll${end}";
fi
## PGAdmin4 ===================================================================

## NodeJS =====================================================================
## NodeJS Download and Install
if ! [ $(command -v node) ]; then
    echo "${yel}Starting setup of NodeJS${end}";
    curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
    sudo apt-get install -y nodejs

    # Install the sequelize cli globally
    npm install -g sequelize-cli;
    echo "${yel}Finished setup of NodeJS${end}";
else
    echo "${yel}NodeJS 6.X.X is already installed${end}";
fi
## NodeJS =====================================================================

## Nginx ======================================================================
## Download and Install Nginx
if ! [ $(command -v nginx) ]; then
    echo "${yel}Starting setup of Nginx${end}";
    sudo apt-get update;
    sudo apt-get install -y nginx;

    # Configure Nginx here
    read -d '' nginx_server_info <<"EOF"
server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;

        root /usr/share/nginx/html;
        index index.html index.htm;

        # Make site accessible from http://localhost/
        server_name localhost;

        location / {
                proxy_pass http://localhost:3000;
                # Uncomment to enable naxsi on this location
                # include /etc/nginx/naxsi.rules
        }

        location /pgadmin {
                proxy_pass http://localhost:5050;
        }
}
EOF

    sudo cp /etc/nginx/sites-available/default /etc/nginx/default_server_config;
    sudo su -c "printf \\"$nginx_server_info\\" > /etc/nginx/sites-available/default";
    echo "${yel}Finished setup of Nginx${end}";
else
    echo "${yel}Nginx is already installed${end}";
fi
## Nginx ======================================================================

echo "${yel}End Bootstrapping${end}";

SCRIPT

$run = <<SCRIPT

yel=$'\e[1;33m'
end=$'\e[0m'

echo "${yel}Begin (Re)Starting Services${end}";

## DynamoDB ===================================================================
# if lsof -i :8000 > /dev/null; then
#   echo "${yel}DynamoDB Local is already running${end}";
# else
#   echo "${yel}Starting up DynamoDB${end}";
#   su - vagrant -c "nohup java -Djava.library.path=/home/vagrant/DynamoDBLocal.jar -jar /home/vagrant/DynamoDBLocal.jar -sharedDb > nohup.out &"
#   echo "${yel}DynamoDB started${end}";
# fi

## DynamoDB ===================================================================

## PostgreSQL =================================================================
## Restart the PostgreSQL server
sudo service postgresql restart;

## PostgreSQL =================================================================

## Nginx ======================================================================
# Restart Nginx Service
sudo service nginx restart;

## Nginx ======================================================================

## NodeJS =====================================================================
## Make sure the Node server is running the local project
if sudo lsof -i :3000 > /dev/null; then
  echo "${yel}Somehow Node Server is already running?${end}";
else
  su - vagrant -c "cd /vagrant; npm install; sequelize db:migrate; nohup node ./bin/www &> ~/node_nohup.log &"
  echo "${yel}Started Node Server${end}";
fi

## NodeJS =====================================================================

## PGadmin4 ===================================================================
## Start up the pgadmin4 webserver
if lsof -i :5050 > /dev/null; then
    echo "${yel}Somehow PGAdmin4 is already running?${end}";
else
    sudo su -c "nohup python /usr/local/lib/python2.7/dist-packages/pgadmin4/pgAdmin4.py > pgadmin_nohup.log &"
    echo "${yel}Started PGAdmin4 tool${end}";
fi

## PGadmin4 ===================================================================

echo "${yel}End Starting Services${end}";

SCRIPT

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://atlas.hashicorp.com/search.
  config.vm.box = "ubuntu/trusty64"

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # config.vm.network "forwarded_port", guest: 8000, host: 8000 # DynamoDB
  config.vm.network "forwarded_port", guest: 5050, host: 5050 # pgadmin4
  config.vm.network "forwarded_port", guest: 5432, host: 5432 # PostegreSQL server
  config.vm.network "forwarded_port", guest: 3000, host: 3030 # NodeJS server
  config.vm.network "forwarded_port", guest: 80, host: 9090 # General http port proxied with Nginx

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"
  config.vm.synced_folder "~/.aws", "/home/vagrant/.aws"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  # config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  # end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Define a Vagrant Push strategy for pushing to Atlas. Other push strategies
  # such as FTP and Heroku are also available. See the documentation at
  # https://docs.vagrantup.com/v2/push/atlas.html for more information.
  # config.push.define "atlas" do |push|
  #   push.app = "YOUR_ATLAS_USERNAME/YOUR_APPLICATION_NAME"
  # end

  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
  # config.vm.provision "shell", inline: <<-SHELL
  #   sudo apt-get update
  #   sudo apt-get install -y apache2
  # SHELL
  config.vm.provision "bootstrap",
    type: "shell",
    inline: $bootstrap

  config.vm.provision "run",
    type: "shell",
    run: "always",
    inline: $run
end
