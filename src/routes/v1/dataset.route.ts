import { Router } from "express";
import { DatasetController } from "../../controllers/DatasetController";

const router = Router();
const datasetController = new DatasetController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Dataset:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the dataset
 *         name:
 *           type: string
 *           maxLength: 100
 *           description: Name of the dataset
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of tags associated with the dataset
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: ID of the user who owns the dataset
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     DatasetCreate:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *           description: Name of the dataset
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of tags to associate with the dataset
 *     DatasetUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *           description: New name for the dataset
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: New tags for the dataset
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *           description: Error message
 */

/**
 * @swagger
 * /api/v1/datasets:
 *   post:
 *     summary: Create a new dataset
 *     tags: [Datasets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DatasetCreate'
 *     responses:
 *       201:
 *         description: Dataset created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     dataset:
 *                       $ref: '#/components/schemas/Dataset'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 */
router.post("/", datasetController.createDataset);

/**
 * @swagger
 * /api/v1/datasets:
 *   get:
 *     summary: Get all datasets for the authenticated user
 *     tags: [Datasets]
 *     parameters:
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated list of tags to filter by
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of datasets to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Number of datasets to skip
 *     responses:
 *       200:
 *         description: Datasets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     datasets:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Dataset'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         count:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         offset:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 */
router.get("/", datasetController.getUserDatasets);

/**
 * @swagger
 * /api/v1/datasets/stats:
 *   get:
 *     summary: Get dataset statistics for the authenticated user
 *     tags: [Datasets]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       properties:
 *                         totalDatasets:
 *                           type: integer
 *                         totalTags:
 *                           type: integer
 *                         topTags:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               tag:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *       401:
 *         description: Unauthorized
 */
router.get("/stats", datasetController.getUserDatasetStats);

/**
 * @swagger
 * /api/v1/datasets/search:
 *   get:
 *     summary: Search datasets by name
 *     tags: [Datasets]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     datasets:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Dataset'
 *                     query:
 *                       type: string
 *                     count:
 *                       type: integer
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.get("/search", datasetController.searchDatasets);

/**
 * @swagger
 * /api/v1/datasets/by-tags:
 *   get:
 *     summary: Get datasets by specific tags (across all users)
 *     tags: [Datasets]
 *     parameters:
 *       - in: query
 *         name: tags
 *         required: true
 *         schema:
 *           type: string
 *         description: Comma-separated list of tags
 *     responses:
 *       200:
 *         description: Datasets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     datasets:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Dataset'
 *                     searchTags:
 *                       type: array
 *                       items:
 *                         type: string
 *                     count:
 *                       type: integer
 *       400:
 *         description: Bad request
 */
// router.get("/by-tags", datasetController.getDatasetsByTags); // TODO: decomment when i'm ready to not stress again

/**
 * @swagger
 * /api/v1/datasets/{id}:
 *   get:
 *     summary: Get a specific dataset by ID
 *     tags: [Datasets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Dataset ID
 *     responses:
 *       200:
 *         description: Dataset retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     dataset:
 *                       $ref: '#/components/schemas/Dataset'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Dataset not found
 */
router.get("/:id", datasetController.getDatasetById);

/**
 * @swagger
 * /api/v1/datasets/{id}:
 *   put:
 *     summary: Update a dataset
 *     tags: [Datasets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Dataset ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DatasetUpdate'
 *     responses:
 *       200:
 *         description: Dataset updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     dataset:
 *                       $ref: '#/components/schemas/Dataset'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Dataset not found or access denied
 */
router.put("/:id", datasetController.updateDataset);

/**
 * @swagger
 * /api/v1/datasets/{id}/tags:
 *   patch:
 *     summary: Update only the tags of a dataset
 *     tags: [Datasets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Dataset ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tags
 *             properties:
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Dataset tags updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     dataset:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         tags:
 *                           type: array
 *                           items:
 *                             type: string
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Dataset not found or access denied
 */
router.patch("/:id/tags", datasetController.updateDatasetTags);

/**
 * @swagger
 * /api/v1/datasets/{id}:
 *   delete:
 *     summary: Delete a dataset (soft delete)
 *     tags: [Datasets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Dataset ID
 *     responses:
 *       200:
 *         description: Dataset deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Dataset not found or access denied
 */
router.delete("/:id", datasetController.deleteDataset);

/**
 * @swagger
 * /api/v1/datasets/{id}/restore:
 *   post:
 *     summary: Restore a soft-deleted dataset
 *     tags: [Datasets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Dataset ID
 *     responses:
 *       200:
 *         description: Dataset restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Dataset not found or access denied
 */
router.post("/:id/restore", datasetController.restoreDataset);

export default router;
