# InferNode - Node Backend for BAM

<div style="height:400px; overflow:hidden; margin:auto">
  <img src="./public/InferNode.png" style="width:100%; height:100%; object-fit:cover; object-position:center;" />
</div>

> _"I can see it... the code." - Neo, The Matrix (1999)_

<div align="center">
  <sub>Built with ❤️ and probably too much caffeine</sub>
</div>

## Introduction

InferNode is a robust Node.js backend service designed for running inferences on CNS(Correspondence Encoded Neural Image Servo Policy) model. It provides a comprehensive API for managing datasets, videos, and inference jobs with a focus on performance and security.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication with RS256 algorithm
  - Role-based access control (User/Admin)
  - Encrypted passwords using bcrypt

- **Dataset Management**
  - Create, read, update, and delete datasets
  - Tag-based organization
  - Soft deletion support

- **Video Processing**
  - Upload and manage videos within datasets
  - Automatic frame counting
  - File system storage with database references

- **Inference Jobs**
  - Queue-based processing with BullMQ
  - Real-time status updates via WebSockets
  - Carbon footprint tracking

- **Results Management**
  - JSON results storage
  - ZIP file management for image outputs
  - One-to-one relationship with inference jobs

- **API Documentation**
  - Swagger UI for interactive API exploration
  - Comprehensive OpenAPI specification

- **Monitoring & Debugging**
  - Bull Board for queue monitoring
  - Detailed logging with Winston
  - Health check endpoints

## Technology Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL, Sequelize ORM
- **Authentication**: JWT with RS256
- **Queue Management**: Redis, BullMQ
- **Real-time Communication**: WebSockets
- **Containerization**: Docker, Docker Compose
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest (planned)

## Installation

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- npm or yarn

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Server configurations
PORT=3000
NODE_ENV=development
API_VERSION=v1

# JWT Configuration
JWT_EXPIRATION=24h
JWT_PRIVATE_KEY_PATH=./keys/private.key
JWT_PUBLIC_KEY_PATH=./keys/public.key
JWT_ALGORITHM=RS256

# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=InferNode
DB_DIALECT=postgres

# Redis configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# FastAPI configuration
FASTAPI_HOST=localhost
FASTAPI_PORT=8000
```

### Generate JWT Keys

```bash
npm run keys
```

### Docker Setup

#### First Launch or Rebuild

```bash
docker compose up --build
# or for detached mode
docker compose up --build -d
```

After the containers are running, initialize the database:

```bash
docker exec -it infernode-app npx sequelize-cli db:migrate
docker exec -it infernode-app npx sequelize-cli db:seed:all
```

#### Subsequent Launches

```bash
docker compose up
# or for detached mode
docker compose up -d
```

### Development Setup

The Docker configuration mounts `src` and `tsconfig.json` as volumes, so changes to these files are automatically synced to the container. Changes to other files require a rebuild.

### Adding Packages

```bash
docker exec -it infernode-app npm install package-name
docker exec -it infernode-app npm uninstall package-name
```

## API Documentation

Complete API documentation is available at `/api/docs` when the server is running. It provides an interactive interface to explore all endpoints, request/response formats, and authentication requirements.

### API Reference

#### Authentication

- **POST `/api/auth/register`**: Register a new user
  - Body: Email and password
  - Example Request:
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword123"
    }
    ```
  - Example Response:
    ```json
    {
      "message": "User registered successfully",
      "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "user@example.com",
        "role": "user",
        "credit": 100
      }
    }
    ```

- **POST `/api/auth/login`**: Authenticate user and get JWT token
  - Body: Email and password
  - Example Request:
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword123"
    }
    ```
  - Example Response:
    ```json
    {
      "message": "Login successful",
      "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

#### User Management

- **GET `/api/user/credits`**: Get current user's credit balance
  - Auth: Bearer token required
  - Returns: Credit amount
  - Example Response:
    ```json
    {
      "credits": 100
    }
    ```

- **POST `/api/admin/recharge`**: Add credits to a user's account (Admin only)
  - Auth: Bearer token required (Admin role)
  - Body: Email and credit amount
  - Example Request:
    ```json
    {
      "email": "user@example.com",
      "credits": 50
    }
    ```
  - Example Response:
    ```json
    {
      "message": "User's credits updated",
      "newBalance": 150
    }
    ```

#### Dataset Management

- **POST `/api/dataset`**: Create a new dataset
  - Auth: Bearer token required
  - Body: Name and optional tags
  - Example Request:
    ```json
    {
      "name": "Traffic Analysis 2023",
      "tags": ["traffic", "urban", "peak-hours"]
    }
    ```
  - Example Response:
    ```json
    {
      "message": "Dataset created successfully",
      "dataset": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "user_id": "7f8d0a15-8e1c-4612-a30c-1a2b3c4d5e6f",
        "name": "Traffic Analysis 2023",
        "tags": ["traffic", "urban", "peak-hours"],
        "created_at": "2023-07-15T10:30:00.000Z",
        "updated_at": "2023-07-15T10:30:00.000Z"
      }
    }
    ```

- **GET `/api/dataset`**: Get all user's datasets
  - Auth: Bearer token required
  - Optional: Tag filters
  - Example Request Body (optional):
    ```json
    {
      "tags": ["traffic", "urban"]
    }
    ```
  - Example Response:
    ```json
    {
      "datasets": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "name": "Traffic Analysis 2023",
          "tags": ["traffic", "urban", "peak-hours"],
          "created_at": "2023-07-15T10:30:00.000Z"
        },
        {
          "id": "7f8d0a15-8e1c-4612-a30c-1a2b3c4d5e6f",
          "name": "Urban Mobility Study",
          "tags": ["traffic", "urban"],
          "created_at": "2023-07-20T14:15:00.000Z"
        }
      ]
    }
    ```

- **GET `/api/dataset/{id}`**: Get dataset by ID
  - Auth: Bearer token required
  - Example Response:
    ```json
    {
      "dataset": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Traffic Analysis 2023",
        "tags": ["traffic", "urban", "peak-hours"],
        "created_at": "2023-07-15T10:30:00.000Z",
        "updated_at": "2023-07-15T10:30:00.000Z",
        "videos": [
          {
            "id": "a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d",
            "name": "Morning Rush Hour",
            "frame_count": 1500
          }
        ]
      }
    }
    ```

- **PUT `/api/dataset/{id}`**: Update dataset
  - Auth: Bearer token required
  - Body: Updated name and/or tags
  - Example Request:
    ```json
    {
      "name": "Traffic Analysis 2023 - Updated",
      "tags": ["traffic", "urban", "peak-hours", "analysis"]
    }
    ```
  - Example Response:
    ```json
    {
      "message": "Dataset updated successfully",
      "dataset": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Traffic Analysis 2023 - Updated",
        "tags": ["traffic", "urban", "peak-hours", "analysis"],
        "updated_at": "2023-07-16T08:45:00.000Z"
      }
    }
    ```

- **DELETE `/api/dataset/{id}`**: Delete dataset (soft delete)
  - Auth: Bearer token required
  - Example Response:
    ```json
    {
      "message": "Dataset deleted successfully"
    }
    ```

- **POST `/api/dataset/{id}/videos`**: Upload video to dataset
  - Auth: Bearer token required
  - Content-Type: multipart/form-data
  - Body: File content, name, and type
  - Example Form Data:
    ```
    content: [binary file data]
    name: "Morning Rush Hour"
    type: "video"
    ```
  - Example Response:
    ```json
    {
      "message": "Morning Rush Hour - video added",
      "id": "a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d",
      "costDeducted": 10
    }
    ```

#### Inference Jobs

- **POST `/api/inference`**: Create and enqueue inference job
  - Auth: Bearer token required
  - Body: Dataset ID, parameters, and range
  - Example Request:
    ```json
    {
      "datasetId": "550e8400-e29b-41d4-a716-446655440000",
      "parameters": {
        "startFrame": 0,
        "endFrame": 500,
        "goalFrameId": 40,
        "frameStep": 2,
        "detector": "SIFT",
        "useGpus": true
      },
      "range": "all"
    }
    ```
  - Example Response:
    ```json
    {
      "jobId": ["7f8d0a15-8e1c-4612-a30c-1a2b3c4d5e6f"]
    }
    ```

- **GET `/api/inference/status/{id}`**: Get job status
  - Auth: Bearer token required
  - Returns: Current status
  - Example Response:
    ```json
    {
      "status": "RUNNING"
    }
    ```

- **GET `/api/inference/result/json/{id}`**: Get job results as JSON
  - Auth: Bearer token required
  - Returns: Results data
  - Example Response:
    ```json
    {
      "results": {
        "requestId": "7f8d0a15-8e1c-4612-a30c-1a2b3c4d5e6f",
        "velocity": [
          [0.1, 0.2],
          [0.3, 0.4],
          [0.5, 0.6]
        ],
        "carbon_footprint": 25,
        "download_url": "/download/results/7f8d0a15-8e1c-4612-a30c-1a2b3c4d5e6f.zip",
        "message": "Inference completed successfully"
      }
    }
    ```

- **GET `/api/inference/result/zip/{id}`**: Get job results as ZIP file
  - Auth: Bearer token required
  - Returns: ZIP file binary data
  - Note: This endpoint returns a binary file download, not JSON

#### WebSocket

- **GET `/api/websocket/stats`**: Get WebSocket connection statistics
  - Auth: Bearer token required
  - Returns: Connection statistics
  - Example Response:
    ```json
    {
      "success": true,
      "data": {
        "totalConnections": 5,
        "userConnections": 2
      }
    }
    ```

- **POST `/api/websocket/test`**: Send test notification
  - Auth: Bearer token required
  - Body: Message content
  - Example Request:
    ```json
    {
      "message": "This is a test notification"
    }
    ```
  - Example Response:
    ```json
    {
      "success": true,
      "message": "Test notification sent"
    }
    ```

#### Health Check

- **GET `/api/health`**: Check if server is running
  - Returns: Status and timestamp
  - Example Response:
    ```json
    {
      "status": "Server is working!",
      "timestamp": "2023-07-15T14:22:10.123Z"
    }
    ```

## Database Structure

The application uses PostgreSQL with the following main tables:

- **User**: Authentication and authorization
- **Dataset**: Collections of videos with tags
- **Video**: Video files with metadata
- **InferenceJob**: Processing jobs with status tracking
- **Result**: Outputs from inference jobs

For detailed database documentation, see [DATABASE_MODELS.md](./DATABASE_MODELS.md).

## Architecture

The application follows a layered architecture with a clear separation of concerns:

```
┌─────────────────────────────────────────────────────┐
│                     Router                          │ ← Route definitions
├─────────────────────────────────────────────────────┤
│                   Controllers                       │ ← Request handling
├─────────────────────────────────────────────────────┤
│                    Services                         │ ← Business logic
├─────────────────────────────────────────────────────┤
│                  Repositories                       │ ← Data access
├─────────────────────────────────────────────────────┤
│                      DAO                            │ ← Database operations
├─────────────────────────────────────────────────────┤
│                     Models                          │ ← Data structures
└─────────────────────────────────────────────────────┘
```

The workflow for handling requests follows this path:

1. **Router**: Defines API endpoints and routes requests to appropriate controllers
2. **Controllers**: Handle HTTP requests/responses and delegate business logic to services
3. **Services**: Implement core business logic and orchestrate operations
4. **Repositories**: Provide an abstraction layer for data access operations
5. **DAO (Data Access Objects)**: Execute database operations and handle queries
6. **Models**: Define database schema, relationships, and data structures

### Queue System

InferNode uses BullMQ with Redis for reliable job processing:

- Jobs are added to the queue when inference requests are made
- Workers process jobs asynchronously
- Real-time status updates are sent via WebSockets
- Bull Board provides a UI for monitoring queue status

## Design

### UML etc

[This section will be filled with UML diagrams and architectural designs]

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [BullMQ](https://docs.bullmq.io/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [Docker](https://www.docker.com/)
