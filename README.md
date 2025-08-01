
# BEPSA Back Prueba Técnica (PT)

## Requisitos previos

- Node.js > 18
- npm > 9
- Docker (opcional, para base de datos)

### Instalar NestJS CLI (si no lo tienes)
```sh
npm install -g @nestjs/cli
```

## Instalación y configuración

1. **Clonar el repositorio:**
   ```sh
   git clone https://github.com/guillepaivag/BepsaBackPT.git
   cd BepsaBackPT
   ```

    o

   ```sh
   git clone git@github.com:guillepaivag/BepsaBackPT.git
   cd BepsaBackPT
   ```

2. **Instalar dependencias:**
   ```sh
   npm install
   ```

3. **Configurar variables de entorno:**
   Edita el archivo `.env` con los valores adecuados:
   ```env
   DATABASE_URL="postgresql://admin:password@localhost:5432/bepsa_back_pt"
   API_KEY="apykey_constante_bepsa_back_pt_123456789"
   VALIDATE_APIKEY_IN_DB="false"
   ```

   NOTA: Si la variable de entorno VALIDATE_APIKEY_IN_DB es "false", entonces solo acepta la api-key de API_KEY, pero si es "true" solo acepta las varialbes de entorno en la base de datos.

4. **(Opcional) Levantar base de datos con Docker:**
   ```sh
   docker-compose up -d
   ```

   NOTA: Si no tienes configurado Postgres y quieres utilizar Docker para la conexión a la DB.

5. **Ejecutar migraciones Prisma:**
   ```sh
   npx prisma migrate <name>
   npx prisma generate
   ```

6. **Agregar datos a la DB:**

   Inicializa tabla task:
   ```sql
   -- CreateEnum
    CREATE TYPE "TaskStatus" AS ENUM ('PENDIENTE', 'EN_PROGRESO', 'COMPLETADA');

    CREATE TABLE task(
        id SERIAL NOT NULL,
        titulo text NOT NULL,
        descripcion text,
        "fechaCreacion" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "fechaVencimiento" timestamp without time zone,
        estado "TaskStatus" NOT NULL DEFAULT 'PENDIENTE'::"TaskStatus",
        "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" timestamp without time zone NOT NULL,
        PRIMARY KEY(id)
    );
   ```

   Inicializa tabla apikey:
   ```sql
    CREATE TABLE apikey(
      id SERIAL NOT NULL,
      nombre text NOT NULL,
      valor text,
      activo boolean NOT NULL DEFAULT true,
      "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(id)
    );
   ```

   Con la base de datos corriendo, ejecuta este SQL (puedes usar `psql` o alguna herramienta gráfica):
   ```sql
   INSERT INTO apikey (nombre, valor, activo, "createdAt", "updatedAt") VALUES
   ('Clave API Admin', '123e4567-e89b-12d3-a456-426614174000', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
   ('Clave API Invitado', '123e4567-e89b-12d3-a456-426614174001', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
   ('Clave API Sistema', '123e4567-e89b-12d3-a456-426614174002', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
   ```

  Si quieres validar tu API-KEY con la DB, entonces actualizar la variable de entorno "VALIDATE_APIKEY_IN_DB" como "true".

7. **Iniciar la aplicación:**
   ```sh
   npm run start:dev
   ```

## Pruebas

Para ejecutar las pruebas unitarias:
```sh
npm run test
```

Para ejecutar pruebas end-to-end:
```sh
npm run test:e2e
```


## Documentación

Todos los endpoints requieren autenticación por API Key en el header:

```
X-API-KEY: <tu_api_key>
```

### Crear tarea
**POST** `/task`

**Request:**
```json
{
  "titulo": "Tarea ejemplo",
  "descripcion": "Descripción opcional",
  "fechaVencimiento": "2025-08-01T23:59:59.000Z"
}
```

**Response:**
```json
{
  "id": 1,
  "titulo": "Tarea ejemplo",
  "descripcion": "Descripción opcional",
  "fechaCreacion": "2025-07-28T15:00:00.000Z",
  "fechaVencimiento": "2025-08-01T23:59:59.000Z",
  "estado": "PENDIENTE",
  "createdAt": "2025-07-28T15:00:00.000Z",
  "updatedAt": "2025-07-28T15:00:00.000Z"
}
```

---

### Listar tareas (con filtros opcionales)
**GET** `/task?estado=PENDIENTE&fechaDesde=2025-07-01&fechaHasta=2025-07-31&buscar=importante&fechaVencimientoDesde=2025-08-01&fechaVencimientoHasta=2025-08-31`

**Response:**
```json
[
  {
    "id": 1,
    "titulo": "Tarea ejemplo",
    "descripcion": "Descripción opcional",
    "fechaCreacion": "2025-07-28T15:00:00.000Z",
    "fechaVencimiento": "2025-08-01T23:59:59.000Z",
    "estado": "PENDIENTE",
    "createdAt": "2025-07-28T15:00:00.000Z",
    "updatedAt": "2025-07-28T15:00:00.000Z"
  }
]
```

---

### Obtener tarea por ID
**GET** `/task/{id}`

**Response:**
```json
{
  "id": 1,
  "titulo": "Tarea ejemplo",
  "descripcion": "Descripción opcional",
  "fechaCreacion": "2025-07-28T15:00:00.000Z",
  "fechaVencimiento": "2025-08-01T23:59:59.000Z",
  "estado": "PENDIENTE",
  "createdAt": "2025-07-28T15:00:00.000Z",
  "updatedAt": "2025-07-28T15:00:00.000Z"
}
```

---

### Actualizar estado de tarea
**PATCH** `/task/{id}/status`

**Request:**
```json
{
  "estado": "COMPLETADA"
}
```

**Response:**
```json
{
  "id": 1,
  "titulo": "Tarea ejemplo",
  "descripcion": "Descripción opcional",
  "fechaCreacion": "2025-07-28T15:00:00.000Z",
  "fechaVencimiento": "2025-08-01T23:59:59.000Z",
  "estado": "COMPLETADA",
  "createdAt": "2025-07-28T15:00:00.000Z",
  "updatedAt": "2025-07-28T15:10:00.000Z"
}
```

---

### Actualizar tarea completa
**PATCH** `/task/{id}`

**Request:**
```json
{
  "titulo": "Nuevo título",
  "descripcion": "Nueva descripción",
  "fechaVencimiento": "2025-08-10T23:59:59.000Z",
  "estado": "EN_PROGRESO"
}
```

**Response:**
```json
{
  "id": 1,
  "titulo": "Nuevo título",
  "descripcion": "Nueva descripción",
  "fechaCreacion": "2025-07-28T15:00:00.000Z",
  "fechaVencimiento": "2025-08-10T23:59:59.000Z",
  "estado": "EN_PROGRESO",
  "createdAt": "2025-07-28T15:00:00.000Z",
  "updatedAt": "2025-07-28T15:20:00.000Z"
}
```

---

### Eliminar tarea
**DELETE** `/task/{id}`

**Response:**
- Código 204 No Content

## Base URL en remoto:

**BaseURL:** https://bepsa-back-pt-3555266126.southamerica-east1.run.app

**Documentación:** https://bepsa-back-pt-3555266126.southamerica-east1.run.app/documentacion


## CICD:

Este proyecto tiene ci/cd con github, puede visualizarse en la carpta `.github/workflows/cicd.yaml`.

Cuando se sube cambios a la rama `main` entonces las nuevas funcionalidades se verán reflejadas en el servidor de **Cloud Run**.

https://bepsa-back-pt-3555266126.southamerica-east1.run.app


## POSTMAN:

Hay una colección de POSTMAN para realizar las pruebas de manera directa.

File: `./PruebaTecnica.postman_collection.json`

## SITIO WEB:

Para realizar una prueba visual de algunas funcionalidades, entrar aquí:
https://bepsapt.web.app

![Foto de mi GitHub](https://avatars.githubusercontent.com/u/75756594?v=4)

Guillermo Paiva.