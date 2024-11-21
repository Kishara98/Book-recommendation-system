/**
 * Finds a document in the database by a specified field and value.
 *
 * @async
 * @function findByKeyAndModel
 * @param {string|number} value - The value to search for in the specified field.
 * @param {Object} model - The Mongoose model to search in.
 * @param {string} field - The field to match the value against.
 * @returns {Promise<Object|null>} The found document, or null if not found.
 * @throws {Error} Throws an error if the operation fails.
 */
async function findByKeyAndModel(value, model, field) {
  const label = `<findByKeyAndModel ${value} ${model.modelName}>`;
  console.time(label);
  try {
    const result = await model.findOne({ [field]: value });
    console.timeEnd(label);
    return result;
  } catch (error) {
    console.timeEnd(label);
    console.error(`${label} Error`, error.message);
    throw error;
  }
}

/**
 * Adds a new document to the database using the provided model and record data.
 *
 * @async
 * @function addRecordToDB
 * @param {Object} model - The Mongoose model to use for creating the document.
 * @param {Object} record - The data to create a new document.
 * @returns {Promise<Object>} The newly created document.
 * @throws {Error} Throws an error if the creation process fails.
 */
async function addRecordToDB(model, record) {
  const label = `<addRecordToDB ${model.modelName} ${JSON.stringify(record)}>`;
  console.time(label);
  try {
    const newModel = new model(record);
    const result = await newModel.save();
    console.timeEnd(label);
    console.info(`New ${model.modelName} created successfully:`, record);
    return result;
  } catch (error) {
    console.timeEnd(label);
    console.error(`${label} Error during creation`, error.message);
    throw error;
  }
}

module.exports = {
  findByKeyAndModel,
  addRecordToDB,
};
