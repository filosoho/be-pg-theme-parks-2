const db = require("./connection");
const format = require("pg-format");

function seed({ parks, rides, stalls, foods }) {
  let foodData;
  let stallData;

  return db
    .query("DROP TABLE IF EXISTS stalls_foods CASCADE;")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS stalls CASCADE;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS foods CASCADE;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS rides CASCADE;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS parks CASCADE;");
    })
    .then(() => {
      return createParks();
    })
    .then(() => {
      return createRides();
    })
    .then(() => {
      return createFoods();
    })
    .then(() => {
      return createStalls();
    })
    .then(() => {
      return createStallsFoods();
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
      return insertRides(modifiedRides);
    })
    .then(() => {
      return insertFoods(foods);
    })
    .then(() => {
      return insertStalls(stalls);
    })
    .then((result) => {
      stallData = result;
      return db.query("SELECT * FROM foods;");
    })
    .then((result) => {
      foodData = result.rows;
      return insertStallsFoods(stallData, foodData);
    })
    .catch((err) => {
      console.error("Error during seeding:", err);
      throw err;
    });
}

function createParks() {
  return db.query(
    "CREATE TABLE parks (park_id SERIAL PRIMARY KEY, park_name VARCHAR(50) NOT NULL, year_opened INTEGER NOT NULL, annual_attendance INTEGER NOT NULL);"
  );
}

function createRides() {
  return db.query(
    "CREATE TABLE rides (ride_id SERIAL PRIMARY KEY, park_id INTEGER REFERENCES parks (park_id) ON DELETE CASCADE, ride_name VARCHAR(150) NOT NULL, year_opened INTEGER NOT NULL, votes INTEGER NOT NULL);"
  );
}

function createFoods() {
  return db.query(
    "CREATE TABLE foods (food_id SERIAL PRIMARY KEY, food_name VARCHAR(50) NOT NULL, vegan_option BOOLEAN NOT NULL);"
  );
}

function createStalls() {
  return db.query(
    "CREATE TABLE stalls (stall_id SERIAL PRIMARY KEY, stall_name VARCHAR(50) NOT NULL);"
  );
}

function createStallsFoods() {
  return db.query(
    "CREATE TABLE stalls_foods (stall_food_id SERIAL PRIMARY KEY, stall_id INTEGER REFERENCES stalls(stall_id) ON DELETE CASCADE, food_id INTEGER REFERENCES foods(food_id) ON DELETE CASCADE);"
  );
}

function insertParks(parks) {
  const nestedParks = parks.map((park) => {
    return [park.park_name, park.year_opened, park.annual_attendance];
  });

  const parksSqlString = format(
    `INSERT INTO parks(park_name, year_opened, annual_attendance) VALUES %L;`,
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
    `INSERT INTO rides(ride_name, year_opened, park_id, votes) VALUES %L;`,
    nestedRides
  );

  return db.query(ridesSqlString);
}

function insertFoods(foods) {
  const nestedFoods = foods.map((food) => {
    return [food.food_name, food.vegan_option];
  });

  const foodsSqlString = format(
    "INSERT INTO foods(food_name, vegan_option) VALUES %L RETURNING food_id, food_name;",
    nestedFoods
  );

  return db.query(foodsSqlString).then((result) => {
    return result.rows;
  });
}

function insertStalls(stalls) {
  const nestedStalls = stalls.map((stall) => {
    return [stall.stall_name];
  });

  const stallsSqlString = format(
    "INSERT INTO stalls(stall_name) VALUES %L RETURNING stall_id, stall_name;",
    nestedStalls
  );

  return db.query(stallsSqlString).then((result) => {
    const stallsWithIds = result.rows;

    return stallsWithIds.map((stall) => {
      return {
        stall_id: stall.stall_id,
        stall_name: stall.stall_name,
        foods_served: stalls.find((s) => s.stall_name === stall.stall_name)
          .foods_served,
      };
    });
  });
}

function insertStallsFoods(stalls, foods) {
  const foodMap = foods.reduce((map, food) => {
    map[food.food_name] = food.food_id;
    return map;
  }, {});

  const stallsFoods = [];
  stalls.forEach((stall) => {
    stall.foods_served.forEach((foodName) => {
      if (foodMap[foodName]) {
        stallsFoods.push([stall.stall_id, foodMap[foodName]]);
      }
    });
  });

  const stallsFoodsSqlString = format(
    "INSERT INTO stalls_foods(stall_id, food_id) VALUES %L;",
    stallsFoods
  );

  return db.query(stallsFoodsSqlString);
}

module.exports = seed;
