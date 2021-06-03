# Save the world / Sauve la planète

# Déscription 

Nettoie la planete en évitant le plus célèbre pollueur de la terre !

Pour jouer il faut :
Rammasser un maximum d'objets polluant, tout en évitant Mr. Trump car pour lui la pollution n'existe pas !! Si vous êtes en contacte avec lui alors vous êtes viré !!!

Installez le jeu dans  /var/www/html/web 

puis avec un éditeur de code comme vsCode lancer le jeu avec le live server qui est une extention gratuite :

https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer

Voilà c'est partie !


## Installation

# Projet Afterwork
Pour jouer a Save the World il faut tout d'abord avoir un serveur actif en local !

exemple apache2 qui est gratuit il faut donc installer avec la commande suivante, à l'aide du terminal de l'ordinateur 

Documentation Apache : https://httpd.apache.org/docs/current/fr/

Sur Ubuntu :

Pour installer Apache seul :

sudo apt install apache2

À la suite de cette installation votre serveur doit fonctionner et être accessible à l'adresse : 

 http://localhost (à partir de la machine).

Un message It Works! devrait s'afficher dans votre navigateur.
 Il s'agit du contenu du fichier /var/www/html/index.html qui est affiché par défaut. 
pour lancer : 

sudo systemctl enable apache2 
(sudo est execution en tant qu'aministrateur de l'ordinateur => le root, il faut donc taper le MdP de l'ordinateur après cette commande)

Si le message « It works! » s'affiche, votre serveur est correctement installé. 
(voir screenshot)

<img src="/home/passerelle-numerique/Images/apach2.png" alt="apach2" style="zoom: 50%;" />

Pour arrêter apache2 : 
sudo systemctl stop apache2

Pour lancer apache2 :
sudo systemctl start apache2

Un seul serveur Apache permet de déployer simultanément plusieurs sites et services. Toutefois, tous les fichiers de configuration se situent dans le répertoire /etc/apache2 :

Pour le reste voir : https://doc.ubuntu-fr.org/apache2#installation



Sur windows :

Pour installer Apache avec PHP et MySQL, reportez vous à l'installation de LAMP : 

sudo apt install apache2 php libapache2-mod-php mysql-server php-mysql

La pile LAMP est alors installée. 
La plupart des scripts PHP (CMS, forums, applications web en tout genre) utilisent des modules de PHP pour bénéficier de certaines fonctionnalités.

Voici comment installer les modules les plus courants :

sudo apt install php-curl php-gd php-intl php-json php-mbstring php-xml php-zip

voir la documentation : https://doc.ubuntu-fr.org/lamp


Sur Mac : 

Installer Apache et le server mysql. 

Pour ce faire, dans votre Application > Utilitaires > Terminal.app, exécutez les commandes suivantes :

sudo port install apache2 mysql5-server

Si c’est votre première fois avec port, vous comptez au moins une bonne douzaine de minutes le temps que les premiers paquets se compilent.
Une fois ceci fait, on va compiler et installer PHP avec les options de compilation (+*) pour Apache, MySQL et PEAR 

sudo port install php7 +apache2 +mysql5 +pear

Note: N’ayez pas peur de copier les commentaires des 4 lignes de codes suivantes dans votre terminal


sudo port install php7-apc php7-curl php7-ftp php7-gd php7-gettext php7-iconv php7-imagick php7-ldap php7-pcntl php7-pdflib php7-mbstring php7-mcrypt php7-memcached php7-soap php7-uploadprogress php7-xdebug php7-xmlrpc php7-zip

sudo port install php7-odbc php7-mysql php7-sqlite

rajouter ces 3 paquets (besoin du driver mssql…) :

sudo port install php7-solr freetds php7-mssql

Configuration d’Apache

On active PHP7 au niveau d’Apache allez dans 


cd /opt/local/apache2/modules
sudo /opt/local/apache2/bin/apxs -a -e -n "php7" libphp5.so

Il faut maintenant préciser à Apache que les fichiers index.php peuvent être les fichiers index par défaut.
 Pour ce faire, il faut éditer le fichier /opt/local/apache2/conf/httpd.conf et rechercher « DirectoryIndex index.html » :

; add "index.php" at the end
DirectoryIndex index.html index.php

On peut aussi ajouter la conf du module apache php : 
Include conf/extra/mod_php.conf

Après avoir modifié la conf Apache, il faut redémarrer le serveur :

sudo /opt/local/apache2/bin/apachectl -k restart


Plus d'infos : https://moox.io/blog/installer-serveur-web-apache-php-mysql-mac-os-x-macports


Ensuite installer le jeu dans  /var/www/html/web 
puis avec un éditeur de code comme vsCode lancer le jeu avec le live server qui est une extention gratuite :

https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer

Voilà c'est partie !