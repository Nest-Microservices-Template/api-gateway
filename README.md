# API Gateway

## Introducción

Este API sera el encargado de distribuir las peticiones hacia los microservicios, esta diseñada aplicando principios de código limpio SOLID, patron de eventos, filers personalizados y con pruebas unitarias integradas.

## Configuración

### Requisitos

- Node.js versión 12.x o superior
- Base de datos PostgreSQL

## Instalación

### Dev

1. Clonar el repositorio
2. Instalar dependencias
3. Crear un archivo `.env` basado en el `env.template`
4. Ejecutar `npm run start:dev`

## Nats

Para levantar el contenedor del server de Nats:

`docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats`
