## Command line instructions

Git global setup
1. git config --global user.name "Julio César"
2. git config --global user.email "llulioscesar@gmail.com"

## Create a new repository
git clone https://gitlab.com/fincareport/api.git
1. cd api
2. touch README.md
3. git add README.md
4. git commit -m "add README"
5. git push -u origin master

## Existing folder
cd existing_folder
1. git init
2. git remote add origin https://gitlab.com/fincareport/api.git
3. git add .
4. git commit -m "Initial commit"
5. git push -u origin master

## Existing Git repository
cd existing_repo
1. git remote rename origin old-origin
2. git remote add origin https://gitlab.com/fincareport/api.git
3. git push -u origin --all
4. git push -u origin --tags

## Instalar dependecias del proyecto
cd existing_repo
1. npm i

## Ejecutar en modo desarrollador
cd existing_repo
1. npm run dev

## Parametros de conexion a la base de datos
1. instalar MariaDB 10.2 o la version mas reciente (10.3.8)
2. establecer contraseña al usuario root @Pesu71