/**
 * Finds one or multiple documents in the specified model by matching multiple field-value pairs.
 *
 * @param {Array<{field: string, value: any}>} keyAndValues - An array of objects specifying the fields and values to match.
 * @param {mongoose.Model} model - The Mongoose model to query.
 * @param {boolean} findOne - If true, returns a single document; if false, returns multiple documents.
 * @returns {Promise<Object|Array|null>}
 */
async function findRecordsByFieldsAndModel(keyAndValues, model) {
  const label = `<findRecordsByFieldsAndModel ${JSON.stringify(keyAndValues)} ${model.modelName}>`;
  console.time(label);
  try {
    const query = Object.fromEntries(keyAndValues.map(({ field, value }) => [field, value])); // Build query
    const result = await model.find(query);
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
 * @function addRecordToDB
 * @param {Object} model - The Mongoose model to use for creating the document.
 * @param {Object} record - The data to create a new document.
 * @returns {Promise<Object>} 
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

/**
 * Updates a record in the database based on the provided model, conditions, and update data.
 * 
 * This function uses `findOneAndUpdate` to locate a record matching the `where` conditions
 * and updates it with the specified `data`. Additional options can be passed to control the update behavior.
 * 
 * @async
 * @function updateRecordById
 * @param {Object} model - The Mongoose model to be used for the update operation.
 * @param {Object} where - The conditions to identify the record to update.
 * @param {Object} data - The data to update in the record.
 * @param {Object} options - Options for the update operation.
 * @returns {Promise<Object|null>}
 */
async function updateRecordById(model, where, data, options) {
  const label = `<updateRecordById ${model.modelName} ${JSON.stringify(where)} ${JSON.stringify(data)} ${JSON.stringify(options)}>`;
  console.time(label);
  try {
    const updateRecord = await model.findOneAndUpdate(where, data, options);
    console.timeEnd(label);
    console.info(`Record updated successfully in ${model.modelName}:`, updateRecord);
    return updateRecord;
  } catch (error) {
    console.timeEnd(label);
    console.error(`${label} Error during updating`, error.message);
    throw error;
  }
}

/**
 * Deletes a record from the database based on the provided model and conditions.
 * 
 * This function uses `findOneAndDelete` to locate and delete a record matching the `where` conditions.
 * 
 * @function deleteRecordById
 * @param {Object} model - The Mongoose model to be used for the delete operation.
 * @param {Object} where - The conditions to identify the record to delete.
 * @returns {Promise<Object|null>}
 * 
 */
async function deleteRecordById(model, where) {
  const label = `<deleteRecordById ${model.modelName} ${JSON.stringify(where)}>`;
  console.time(label);
  try {
    const deletedRecord = await model.findOneAndDelete(where);
    console.timeEnd(label);
    console.info(`Record updated successfully in ${model.modelName}:`, deletedRecord);
    return deletedRecord;
  } catch (error) {
    console.timeEnd(label);
    console.error('Error deleting:', error.message);
  }
}

module.exports = {
  findRecordsByFieldsAndModel,
  addRecordToDB,
  updateRecordById,
  deleteRecordById
};
