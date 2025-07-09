# Database Models Documentation

## Database Structure

### Main Tables

#### 1. Users

- **id**: UUID (Primary Key)
- **email**: String, unique, required
- **password**: String, required
- **role**: Enum ('user', 'admin'), default 'user'
- **tokens**: Integer, default 100 (user credits)
- **createdAt**: Date
- **updatedAt**: Date

#### 2. Tags

- **id**: UUID (Primary Key)
- **name**: String, unique, required
- **createdAt**: Date
- **updatedAt**: Date

#### 3. Datasets

- **id**: UUID (Primary Key)
- **user_id**: UUID (Foreign Key → Users.id)
- **name**: String, required
- **tags**: Array of strings, default []
- **deleted_at**: Date (nullable, for soft delete)
- **created_at**: Date
- **updatedAt**: Date
  **Constraints:**
- Unique constraint on (user_id, name) for non-logically deleted records

#### 4. Videos

- **id**: UUID (Primary Key)
- **dataset_id**: UUID (Foreign Key → Datasets.id)
- **file**: BLOB (video file content)
- **name**: String, required
- **frame_count**: Integer, required
- **created_at**: Date
- **updatedAt**: Date

#### 5. InferenceJobs

- **id**: UUID (Primary Key)
- **dataset_id**: UUID (Foreign Key → Datasets.id)
- **user_id**: UUID (Foreign Key → Users.id)
- **video_id**: UUID (Foreign Key → Videos.id)
- **status**: Enum ('PENDING', 'RUNNING', 'FAILED', 'ABORTED', 'COMPLETED')
- **params**: JSON (inference parameters)
- **carbon_footprint**: Integer (carbon footprint in grams)
- **created_at**: Date
- **updated_at**: Date

#### 6. Results

- **id**: UUID (Primary Key)
- **inferenceJob_id**: UUID (Foreign Key → InferenceJobs.id, unique)
- **json_res**: JSON (inference results)
- **image_zip**: BLOB (ZIP file with resulting images)
- **created_at**: Date
- **updatedAt**: Date

## Relationships

### One-to-Many

- **User → Datasets**: A user can have multiple datasets
- **User → InferenceJobs**: A user can have multiple inference jobs
- **Dataset → Videos**: A dataset can contain multiple videos
- **Dataset → InferenceJobs**: A dataset can have multiple inference jobs
- **Video → InferenceJobs**: A video can have multiple inference jobs

### One-to-One

- **InferenceJob → Result**: An inference job has at most one result

## Test Data

The seeders include:

- **3 users**: 1 admin with 1000 tokens, 2 users with 100 and 50 tokens
- **5 predefined tags** to categorize datasets
- **2 datasets** with different tags and one logically deleted

## System Costs

According to the project specifications:

- **Upload video**: 0.001 token per frame
- **Inference**: 0.002 tokens per processed image
  The system checks the available credits before allowing expensive operations.

## Implementation Notes

- The models use UUID as primary keys for greater security
- Datasets support soft delete (deleted_at)
- Video files and results are stored as BLOB in the database
- Relationships are managed through foreign keys with CASCADE
- Inference parameters are stored as JSON for flexibility

## Workflow to Interact with DB Objects

Controller -> Service -> Repository -> DAO -> Database
