# Database Models Documentation

Questo documento descrive i modelli del database creati in base al diagramma ER fornito.

## Struttura del Database

### Tabelle Principali

#### 1. Users

- **id**: UUID (Primary Key)
- **email**: String, unique, required
- **password**: String, required
- **role**: Enum ('user', 'admin'), default 'user'
- **tokens**: Integer, default 100 (crediti dell'utente)
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
- **tags**: Array di stringhe, default []
- **deleted_at**: Date (nullable, per soft delete)
- **created_at**: Date
- **updatedAt**: Date

**Vincoli:**

- Unique constraint su (user_id, name) per record non eliminati logicamente

#### 4. Videos

- **id**: UUID (Primary Key)
- **dataset_id**: UUID (Foreign Key → Datasets.id)
- **file**: BLOB (contenuto del file video)
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
- **params**: JSON (parametri per l'inferenza)
- **carbon_footprint**: Integer (impronta di carbonio in grammi)
- **created_at**: Date
- **updated_at**: Date

#### 6. Results

- **id**: UUID (Primary Key)
- **inferenceJob_id**: UUID (Foreign Key → InferenceJobs.id, unique)
- **json_res**: JSON (risultati dell'inferenza)
- **image_zip**: BLOB (file ZIP con le immagini risultanti)
- **created_at**: Date
- **updatedAt**: Date

## Relazioni

### One-to-Many

- **User → Datasets**: Un utente può avere più dataset
- **User → InferenceJobs**: Un utente può avere più job di inferenza
- **Dataset → Videos**: Un dataset può contenere più video
- **Dataset → InferenceJobs**: Un dataset può avere più job di inferenza
- **Video → InferenceJobs**: Un video può avere più job di inferenza

### One-to-One

- **InferenceJob → Result**: Un job di inferenza ha al massimo un risultato

## Dati di Test

I seeders includono:

- **3 utenti**: 1 admin con 1000 token, 2 utenti con 100 e 50 token
- **5 tag** predefiniti per categorizzare i dataset
- **2 dataset** con diversi tag e uno eliminato logicamente

## Costi del Sistema

Secondo le specifiche del progetto:

- **Upload video**: 0.001 token per frame
- **Inferenza**: 0.002 token per immagine processata

Il sistema verifica i crediti disponibili prima di permettere operazioni costose.

## Note Implementative

- I modelli utilizzano UUID come chiavi primarie per maggiore sicurezza
- I dataset supportano soft delete (deleted_at)
- I file video e i risultati sono memorizzati come BLOB nel database
- Le relazioni sono gestite tramite foreign key con CASCADE
- I parametri di inferenza sono memorizzati come JSON per flessibilità
