import Joi from "joi";

/**
 * Schema for validating the id parameter
 */
export const IdSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

/**
 * Schema for validating the user registration login
 * and user recharge data
 */
export const UserSchema = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  recharge: Joi.object({
    email: Joi.string().email().required(),
    credits: Joi.number().min(0).required(),
  }),

  delete: Joi.object({
    email: Joi.string().email().required(),
  }),
};

/**
 * Schema for validating the dataset CRUD operations
 */
export const DatasetSchema = {
  get: Joi.object({
    tags: Joi.alternatives()
      .try(Joi.array().items(Joi.string()), Joi.string())
      .optional()
      .custom((value) => (Array.isArray(value) ? value : [value])),
  }),
  create: Joi.object({
    name: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).optional(),
  }),

  update: Joi.object({
    name: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
  }),

  uploadVideo: Joi.object({
    type: Joi.string().valid("video", "zip").required(),
    name: Joi.string().required(),
  }),

  removeVideo: Joi.object({
    videos: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().required(),
        }),
      )
      .required(),
  }),
};

/**
 * Schema for validating the inference creation
 */
export const InferenceSchema = {
  create: Joi.object({
    datasetId: Joi.string().uuid().required(),
    parameters: Joi.object({
      startFrame: Joi.number().integer().min(0).required(),
      endFrame: Joi.number().integer().min(0).required(),
      frameStep: Joi.number().integer().min(1).required(),
      goalFrameId: Joi.number().integer().min(0).required(),
      detector: Joi.string().valid("AKAZE", "SIFT", "ORB").required(),
      useGpus: Joi.boolean().required(),
    })
      .required()
      .custom((value, helpers) => {
        // Checks that startFrame is less than endFrame
        if (value.startFrame >= value.endFrame) {
          return helpers.error("parameters.startFrame.lessThanEndFrame");
        }

        // Checks that goalFrameId is within the frame range
        if (
          value.goalFrameId < value.startFrame ||
          value.goalFrameId >= value.endFrame
        ) {
          return helpers.error("parameters.goalFrameId.outOfRange");
        }

        // Checks that frameStep is compatible with the frame range
        const frameRange = value.endFrame - value.startFrame;
        if (value.frameStep >= frameRange) {
          return helpers.error("parameters.frameStep.tooLarge");
        }

        return value;
      }),
    range: Joi.string()
      .pattern(/^all$|^\d+-\d+$/)
      .required(),
  })
    .custom((value, helpers) => {
      // Validate the video range format
      if (value.range !== "all") {
        const rangeMatch = value.range.match(/^(\d+)-(\d+)$/);
        if (rangeMatch) {
          const rangeStart = parseInt(rangeMatch[1], 10);
          const rangeEnd = parseInt(rangeMatch[2], 10);

          // Check that the video range is valid (start < end)
          if (rangeStart >= rangeEnd) {
            return helpers.error("range.invalidVideoRange");
          }
        }
      }
      return value;
    }, "Inference validation")
    .messages({
      "parameters.startFrame.lessThanEndFrame":
        "startFrame must be less than endFrame",
      "parameters.goalFrameId.outOfRange":
        "goalFrameId must be within the range [startFrame, endFrame)",
      "parameters.frameStep.tooLarge":
        "frameStep must be smaller than the frame range (endFrame - startFrame)",
      "range.invalidVideoRange":
        "Video range must have the format start-end where start < end",
    }),
};
