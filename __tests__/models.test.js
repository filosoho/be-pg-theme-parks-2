const db = require("../db/connection.js");
const { seed } = require("../db/seed");

const {
  selectParks,
  updateParkById,
  removeParkById,
} = require("../models/parks");
const { selectRidesByParkId } = require("../models/rides");

beforeEach(() => {
  return seed();
});

afterAll(() => {
  if (db.end) db.end();
});

describe("selectParks()", () => {
  test("should resolve with parks array", () => {
    return selectParks().then((parks) => {
      expect(parks).toBeInstanceOf(Array);
      expect(parks).toHaveLength(4);
    });
  });
  test("each park should have the correct keys", () => {
    return selectParks().then((parks) => {
      parks.forEach((park) => {
        expect(park).toHaveProperty("park_id", expect.any(Number));
        expect(park).toHaveProperty("park_name", expect.any(String));
        expect(park).toHaveProperty("year_opened", expect.any(Number));
        expect(park).toHaveProperty("annual_attendance", expect.any(Number));
      });
    });
  });
});

describe("selectRidesByParkId()", () => {
  test("resolves with an array", () => {
    return selectRidesByParkId(3).then((rides) => {
      expect(rides).toBeInstanceOf(Array);
      expect(rides).toHaveLength(4);
    });
  });
  test("rides have correct keys", () => {
    return selectRidesByParkId(3).then((rides) => {
      rides.forEach((ride) => {
        expect(ride).toHaveProperty("ride_name", expect.any(String));
        expect(ride).toHaveProperty("park_name", expect.any(String));
        expect(ride).toHaveProperty("votes", expect.any(Number));
        expect(ride).toHaveProperty("year_opened", expect.any(Number));
      });
    });
  });
});

describe("updateParkById()", () => {
  it("returns the updated park", () => {
    const parkUpdates = {
      park_name: "Chessington Earth of Experiences",
      annual_attendance: 0,
    };
    return updateParkById(3, parkUpdates)
      .then((park) => {
        expect(park).toEqual({
          park_id: 3,
          year_opened: 1987,
          ...parkUpdates,
        });
      })
      .then(() => {
        return db.query("SELECT * FROM parks WHERE park_id=3");
      })
      .then(({ rows: [park] }) => {
        expect(park).toHaveProperty("annual_attendance", 0);
        expect(park).toHaveProperty("park_name", "Chessington Earth of Experiences");
      });
  });
  it("updates the database with the correct information", () => {
    const parkUpdates = {
      park_name: "Chessington Earth of Experiences",
      annual_attendance: 0,
    };
    return updateParkById(3, parkUpdates)
      .then(() => {
        return db.query("SELECT * FROM parks WHERE park_id=3");
      })
      .then(({ rows: [park] }) => {
        expect(park.annual_attendance).toBe(0);
        expect(park.park_name).toBe("Chessington Earth of Experiences");
      });
  });
});

describe("removeParkById()", () => {
  test("should return undefined", () => {
    return removeParkById(2).then((response) => {
      expect(response).toBeUndefined();
    });
  });
  test("park has been removed from the database", () => {
    return removeParkById(2).then(() => {
      return db
        .query("SELECT * FROM parks WHERE park_id=2;")
        .then(({ rowCount }) => {
          expect(rowCount).toBe(0);
        });
    });
  });
});
