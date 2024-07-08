const db = require("./connection");
const format = require("pg-format");

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
    .then(() => {
      return insertParks(parks);
    })
    .then(() => {
      return db.query("SELECT * FROM parks;");
    })
    .then((result) => {
      const parksData = result.rows;
      const modifiedRides = modifyRidesData(rides, parksData);
      // console.log(modifiedRides, "---> modifiedRides");
      return insertRides(modifiedRides);
    })
    .catch((err) => {
      console.error("Error during seeding:", err);
      throw err;
    });
}

function createParks() {
  return db.query(
    "CREATE TABLE parks (park_id SERIAL PRIMARY KEY, park_name VARCHAR(50) NOT NULL, year_opened INTEGER NOT NULL, annual_attendence INTEGER NOT NULL);"
  );
}

function createRides() {
  return db.query(
    "CREATE TABLE rides (ride_id SERIAL PRIMARY KEY, park_id INTEGER REFERENCES parks (park_id) ON DELETE CASCADE, ride_name VARCHAR(150) NOT NULL, year_opened INTEGER NOT NULL, votes INTEGER NOT NULL);"
  );
}

function insertParks(parks) {
  const nestedParks = parks.map((park) => {
    return [park.park_name, park.year_opened, park.annual_attendance];
  });

  const parksSqlString = format(
    `INSERT INTO parks(park_name, year_opened, annual_attendence) VALUES %L`,
    nestedParks
  );
  return db.query(parksSqlString);
}

function modifyRidesData(rides, parksData) {
  return rides.map((ride) => {
    const park = parksData.find((p) => p.park_name === ride.park_name);
    return {
      ride_name: ride.ride_name,
      year_opened: ride.year_opened,
      park_id: park.park_id,
      votes: ride.votes,
    };
  });
}

function insertRides(rides) {
  const nestedRides = rides.map((ride) => {
    return [ride.ride_name, ride.year_opened, ride.park_id, ride.votes];
  });

  const ridesSqlString = format(
    `INSERT INTO rides(ride_name, year_opened, park_id, votes) VALUES %L`,
    nestedRides
  );

  return db.query(ridesSqlString);
}

module.exports = seed;
