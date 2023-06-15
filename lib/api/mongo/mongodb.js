const { MongoClient } = require('mongodb');
const logger = require('../../../logger');
const { DB_USER, DB_PASSWORD, DB_NAME, DB_COLLECTION } = require('../../../config');

class Mongodb {
  constructor() {
    this.username = DB_USER;
    this.password = DB_PASSWORD;
    this.dbname = DB_NAME;
    this.dbcollection = DB_COLLECTION;
    this.connectionString = `mongodb+srv://${this.username}:${this.password}@nodejs.pa7mngq.mongodb.net/?retryWrites=true&w=majority`;
    this.client = new MongoClient(this.connectionString);
  }

  async connect() {
    try {
      await this.client.connect();
      logger.info('Connected to the database');
      this.collection = this.client.db(this.dbname).collection(this.dbcollection);
    } catch (error) {
      logger.error('Error connecting to the database:', error);
    }
  }

  async close() {
    await this.client.close();
    logger.info('Connection to the database closed');
  }

  async create(document) {
    try {
      const result = await this.collection.insertOne(document);
      logger.info('Document inserted:', result.insertedId);
    } catch (error) {
      logger.error('Error creating document:', error);
    }
  }

  async read(query) {
    try {
      const result = await this.collection.findOne(query);
      logger.info('Documents retrieved:', result);
      return result;
    } catch (error) {
      logger.error('Error reading documents:', error);
      return error;
    }
  }

  async update(query, update) {
    try {
      const result = await this.collection.updateOne(query, { $set: update });
      logger.info('Documents updated:', result.modifiedCount);
    } catch (error) {
      logger.error('Error updating documents:', error);
    }
  }

  async delete(query) {
    try {
      const result = await this.collection.deleteOne(query);
      logger.info('Document deleted:', result.deletedCount);
    } catch (error) {
      logger.error('Error deleting documents:', error);
    }
  }
}

module.exports = Mongodb;
