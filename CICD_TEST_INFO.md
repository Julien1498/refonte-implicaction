- ICHAY Jeremy
- CORROCHANO David
- BENETOUX Gabriel
- GONZALEZ Julien

# CI/CD and Testing information

Le but de ce fichier est de présenter la pipeline et 
les différents processus automatisé mis en place afin d'ameliorer la qualité de l'application.

## CI/CD
Pour notre CI/CD nous utilisation github action. 
La CI/CD est defini dans le fichier ``.github/workflows/main.yml``.

L'important avantage de la CI/CD sur github est la présence du marketplace qui permet une intégration rapide
de certain logicielle directement dans la pipeline grace aux github action. Cependant une des limitations de github action est le fait
que si nous souhaitons utiliser les runners gratuit notre projet doit etre publique et nous sommes limité dans le nombre 
de runner et leur puissance mais nous sommes aussi limité a 500mb en stockage de package.

## Test unitaire et rapport Sonar

Les test unitaires sont executés dans le meme processus que la generation du rapport Sonar.
Les rapports sont accessible a cette adresse: [https://sonarcloud.io/summary/overall?id=Julien1498_refonte-implicaction](https://sonarcloud.io/summary/overall?id=Julien1498_refonte-implicaction)
Nous utilisons SonarCloud qui nous permet d'avoir un rapport uniquement publique dans sa version gratuite.

Ce rapport met en avant des bonne pratiques et des correctif de sécurité connu, mais aussi le taux de couverture du code. 
Ce qui nous permet de voir et rapidement intégrer les différents correctif.

## Test d'integration

Pour réaliser les test d'intégration nous avons utilisé Cypress. 
Cypress permet d'automatiser des test directement dans un browser et nous permet via 
la solution cloud d'upload un rapport a cette adresse: [https://dashboard.cypress.io/projects/vjh79u](https://dashboard.cypress.io/projects/vjh79u)

Les test cypress sont défini dans le dossier ``cypress`` a la racine.

## Load test

K6 nous permet de réaliser des load test directement dans notre pipeline. 
Via K6 nous réalisons a la fois des tests API et des load test.
Les scripts de test sont défini dans le dossier ``k6_test`` et nous appliquons 
différents paramettres dans la pipeline afin de faire varier la charge. 

Exemple:
```
./k6 run -e API_URL=localhost -e PORT=8080 --vus 10 --duration 30s k6_test/test_api.js
```
Ici nous simulons 10 utilisateurs virtuel ``--vus 10`` en parallele pour une durée de 30 secondes. 

## Build et deploiement de l'image docker

Dans notre CI nous faisons le build de deux images Docker. Une image contenant la Base de Données MySQL et une autre contenant l'application (Back & Front).
Les Dockerfiles utilisé sont dans le dossier ``Dockerfile/``.
Le fichier ``Dockerfile-mysql`` va tout simplement se baser sur l'image docker ``mysql:8.0.26`` et va ensuite importer et renomer le ficher ``data.sql`` disponible à la racine du projet pour qu'il soit directement traité au lancement du conteneur.
Le second fichier ``Dockerfile-srping`` va dans un premier temps installer Maven et ensuite build le .jar de l'application via la commande ``mvn -f /usr/local/service/pom.xml package -Dmaven.test.skip=true``.
Une fois le .jar construit, il sera tout simplement lancer via la commande ``CMD ["java","-jar","/usr/app/app.jar"]``, tout en exposant le port 8080 pour accéder à l'application.

Une fois ces deux images docker build via notre CI et les commandes ``docker build -t ${{ github.repository_owner }}/implicaction-db:latest -f Dockerfiles/Dockerfile-mysql .`` ainsi que ``docker build -t ${{ github.repository_owner }}/implicaction-app:latest -f Dockerfiles/Dockerfile-spring .``, nous allons pourvoir les envoyer sur notre registry.
Ici nous utilisons le registry de Github (Github Container aka ghcr.io).
On commence par retagger les images en y ajoutant la version de celle-ci, pour ce faire nous utilisons ``"WyriHaximus/github-action-get-previous-tag@v1"`` qui va automatiquement tagger les images avec la bonne version.
Une fois que c'est fait, nous allons push les images sur ghcr.io via la commande ``docker push``.
