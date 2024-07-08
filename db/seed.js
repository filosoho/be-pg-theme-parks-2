const db = require("./connection");

function seed({ parks, rides, stalls }) {
  return db
    .query("DROP TABLE IF EXISTS rides;")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS stalls;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS foods;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS stalls_foods;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS parks;");
    })
    .then(() => {
      return createParks();
    })
    .then(() => {
      return createRides();
    })
    .catch((err) => {
      console.error("Error during seeding:", err);
      throw err;
    });
}

function createParks() {
  /* Create your parks table in the query below */
  return db.query(
    "CREATE TABLE parks (park_id SERIAL PRIMARY KEY, park_name VARCHAR(50) NOT NULL, year_opened INTEGER NOT NULL, annual_attendence INTEGER NOT NULL);"
  );
}

function createRides() {
  return db.query(
    "CREATE TABLE rides (ride_id SERIAL PRIMARY KEY, park_id INTEGER REFERENCES parks (park_id) ON DELETE CASCADE, ride_name VARCHAR(150) NOT NULL, year_opened INTEGER NOT NULL, votes INTEGER NOT NULL);"
  );
}

module.exports = seed;
