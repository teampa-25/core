# Database Models Documentation

## Overview

This document describes the database schema for the InferNode application, built with Node.js, TypeScript, and Sequelize ORM using PostgreSQL as the database backend.

## Database Configuration

The application uses PostgreSQL with Sequelize ORM. Database configuration is managed through environment variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=InferNode
DB_DIALECT=postgres
```

### Migration and Seeding

To set up the database:

```bash
# Run migrations to create tables
npm run db:migrate

# Seed the database with initial data
npm run db:seed

# Generate new migration
npm run db:migration:generate -- migration-name

# Generate new seeder
npm run db:seed:generate -- seeder-name

# Undo last migration
npm run db:migrate:undo

# Undo all seeds
npm run db:seed:undo
```

## Database Structure

### Main Tables

#### 1. Users

**Table Name:** `Users`

- **id**: STRING (UUID v4, Primary Key)
- **email**: STRING, unique, required, email validation
- **password**: STRING, required (hashed)
- **role**: ENUM ('user', 'admin'), default 'user'
- **tokens**: INTEGER, default 100 (user credits)
- **createdAt**: DATE, auto-generated
- **updatedAt**: DATE, auto-generated

#### 2. Tags

**Table Name:** `Tags`

- **id**: UUID (Primary Key)
- **name**: STRING, unique, required
- **createdAt**: DATE, auto-generated
- **updatedAt**: DATE, auto-generated

#### 3. Datasets

**Table Name:** `Datasets`

- **id**: UUID (Primary Key)
- **user_id**: UUID (Foreign Key → Users.id)
- **name**: STRING, required
- **tags**: ARRAY of strings, default []
- **deleted_at**: DATE (nullable, for soft delete via paranoid mode)
- **created_at**: DATE, auto-generated (custom field name)
- **updatedAt**: DATE, auto-generated

**Constraints:**
- Unique constraint on (user_id, name) for non-logically deleted records
- Uses Sequelize paranoid mode with `deleted_at` field for soft deletes

#### 4. Videos

**Table Name:** `Videos`

- **id**: UUID (Primary Key)
- **dataset_id**: UUID (Foreign Key → Datasets.id)
- **file**: BLOB(long) (video file binary content)
- **name**: STRING, required
- **frame_count**: INTEGER, required
- **created_at**: DATE, auto-generated (custom field name)
- **updatedAt**: DATE, auto-generated

#### 5. InferenceJobs

**Table Name:** `InferenceJobs`

- **id**: UUID (Primary Key)
- **dataset_id**: UUID (Foreign Key → Datasets.id)
- **user_id**: UUID (Foreign Key → Users.id)
- **video_id**: UUID (Foreign Key → Videos.id)
- **status**: ENUM ('PENDING', 'RUNNING', 'FAILED', 'ABORTED', 'COMPLETED'), default 'PENDING'
- **params**: JSON (inference parameters)
- **carbon_footprint**: INTEGER (carbon footprint in grams), default 0
- **created_at**: DATE, auto-generated (custom field name)
- **updated_at**: DATE, auto-generated (custom field name)

#### 6. Results

**Table Name:** `Results`

- **id**: UUID (Primary Key)
- **inferenceJob_id**: UUID (Foreign Key → InferenceJobs.id, unique)
- **json_res**: JSON (inference results)
- **image_zip**: BLOB(long) (ZIP file with resulting images as binary content)
- **created_at**: DATE, auto-generated (custom field name)
- **updatedAt**: DATE, auto-generated

## Relationships

### One-to-Many

- **User → Datasets**: A user can have multiple datasets (`User.hasMany(Dataset)`)
- **User → InferenceJobs**: A user can have multiple inference jobs (`User.hasMany(InferenceJob)`)
- **Dataset → Videos**: A dataset can contain multiple videos (`Dataset.hasMany(Video)`)
- **Dataset → InferenceJobs**: A dataset can have multiple inference jobs (`Dataset.hasMany(InferenceJob)`)
- **Video → InferenceJobs**: A video can have multiple inference jobs (`Video.hasMany(InferenceJob)`)

### One-to-One

- **InferenceJob → Result**: An inference job has at most one result (`InferenceJob.hasOne(Result)`)

## Enums and Types

### Role Enum
```typescript
enum Role {
  ADMIN = "admin",
  USER = "user",
}
```

### InferenceJobStatus Enum
```typescript
enum InferenceJobStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  FAILED = "FAILED",
  ABORTED = "ABORTED",
  COMPLETED = "COMPLETED",
}
```

## Test Data

The seeders include:

- **3 users**: 
  - 1 admin (`admin@example.com`) with 1000 tokens
  - 2 regular users (`user1@example.com`, `user2@example.com`) with 100 and 50 tokens respectively
- **5 predefined tags** to categorize datasets:
  - "computer-vision", "ai", "machine-learning", "deep-learning", "neural-networks"
- **2 datasets** with different tags and one logically deleted for testing soft delete functionality

All seeded users use the password "password" (hashed with bcrypt).

## System Costs

According to the project specifications:

- **Upload video**: 0.001 token per frame
- **Inference**: 0.002 tokens per processed image

The system checks the available credits before allowing expensive operations.

## Implementation Notes

### Technical Details

- All models use UUID (v4) as primary keys for enhanced security and distributed system compatibility
- User model uses STRING type for UUID storage with UUIDV4 default value
- Other models use proper UUID DataType
- Binary file storage (videos, result images) uses BLOB(long) for large file support
- Datasets support soft delete through Sequelize's paranoid mode with `deleted_at` timestamp
- Relationships are managed through foreign keys with proper CASCADE behavior
- Inference parameters are stored as JSON for maximum flexibility
- Email validation is enforced at the database level
- Timestamps use custom field names in some models for consistency with existing API

### Database Schema Migrations

The database schema is version-controlled through Sequelize migrations located in `src/database/migrations/`. Current migrations include:

1. `20250709105710-create-user.js` - Creates Users table
2. `20250709144418-create-tag.js` - Creates Tags table  
3. `20250709144419-create-dataset.js` - Creates Datasets table
4. `20250709144420-create-video.js` - Creates Videos table
5. `20250709144421-create-inference-job.js` - Creates InferenceJobs table
6. `20250709144422-create-result.js` - Creates Results table

## Application Architecture

### Data Flow

The application follows a layered architecture pattern:

**Controller → Service → Repository → DAO → Database**

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and orchestration
- **Repositories**: Abstract data access operations
- **DAOs (Data Access Objects)**: Direct database operations via Sequelize models
- **Database**: PostgreSQL with Sequelize ORM

### Model Associations

Associations are defined in `src/database/models/associations.ts` and must be imported after all models are initialized to properly establish relationships between tables.

## Development Workflow

### Setting up a new environment

1. Copy environment variables: `cp .env.example .env`
2. Configure database connection in `.env`
3. Install dependencies: `npm install`
4. Run migrations: `npm run db:migrate`
5. Seed initial data: `npm run db:seed`
6. Generate JWT keys: `npm run keys:generate`

### Making schema changes

1. Generate migration: `npm run db:migration:generate -- add-new-field`
2. Edit the generated migration file
3. Run migration: `npm run db:migrate`
4. Update corresponding Sequelize model
5. Update this documentation
