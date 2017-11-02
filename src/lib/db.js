import MongoClient from "mongodb";
import { getEnv } from "../utils/env";

let connection;

const dbConnect = function(req, res, next) {
  const url = getEnv("DB_URL", "mongodb://localhost:27017/eventlog");
  const options = getEnv("DB_OPTIONS", {});
  options.poolSize = options.poolSize || 10;
  MongoClient.connect(url, options)
    .then(db => {
      connection = db;
      next();
    })
    .catch(next);
};

const save = function save(target, data) {
  if (!target) return Promise.reject(new Error("Missing param: target"));
  console.log(`Storing ${JSON.stringify(data)} on Database`);
  return connection.collection(target).insert(data);
};

const get = function get(target, key) {
  if (!target) return Promise.reject(new Error("Missing param: target"));
  console.log(`Looking up by id ${key._id} on Database`);
  return connection.collection(target).findOne(key);
};

const remove = function remove(target, key) {
  if (!target) return Promise.reject(new Error("Missing param: target"));
  console.log(`Deleting by id ${key.id} on Database`);
  return connection.collection(target).deleteOne(key);
};

export { dbConnect, save, get, remove };
