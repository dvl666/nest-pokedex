<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
```
git clone https://github.com/dvl666/nest-pokedex.git
```
2. Ejecutar 
```
npm i
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```
4. Tener instalado docker

5. Instalar la imagen de mongodb (version 5)
```
docker pull mongo:5.0.0
```
6. Levantar la base de datos
```
docker-compose up -d
```
7. Clonar el archivo __.env.template__ y renombrar la copia a __.env__ (asignar valores si es necesario)

8. Levantar el proyecto con:
```
npm run start:dev
```
9. Mandar solicitud GET a
```
http://localhost:3000/api/v2/seed
```


## Stack utilizado
* MongoDB
* Nestjs

***Este repositorio contiene comentarios tanto de funcionamiento de TypeScript como de funcionalidades de NestJs, todo con el objetivo de su posterior entendimiento***