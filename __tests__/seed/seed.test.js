const db = require("../../db/connection");
const seed = require("../../db/seed");

beforeAll(() => seed());
afterAll(() => db.end());

describe("seed", () => {
  describe("parks table", () => {
    test("parks table exists", () => {
      return db
        .query(
          `SELECT EXISTS (
                    SELECT FROM 
                        information_schema.tables 
                    WHERE 
                        table_name = 'parks'
                    );`
        )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        });
    });
    test("parks table has park_id column as serial primary key", () => {
      return db
        .query(
          `SELECT column_name, data_type, column_default
                    FROM information_schema.columns
                    WHERE table_name = 'parks'
                    AND column_name = 'park_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("park_id");
          expect(column.data_type).toBe("integer");
          expect(column.column_default).toBe(
            "nextval('parks_park_id_seq'::regclass)"
          );
        });
    });
    test("parks table has park_name column", () => {
      return db
        .query(
          `SELECT column_name, data_type, column_default
                    FROM information_schema.columns
                    WHERE table_name = 'parks'
                    AND column_name = 'park_name';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("park_name");
        });
    });
    test("parks table has park_id column", () => {
      return db
        .query(
          `SELECT column_name
                      FROM information_schema.columns
                      WHERE table_name = 'parks'
                      AND column_name = 'park_name';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("park_name");
        });
    });
    test("parks table has year_opened column", () => {
      return db
        .query(
          `SELECT column_name
                      FROM information_schema.columns
                      WHERE table_name = 'parks'
                      AND column_name = 'year_opened';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("year_opened");
        });
    });
    test("parks table has annual_attendance column", () => {
      return db
        .query(
          `SELECT column_name
                        FROM information_schema.columns
                        WHERE table_name = 'parks'
                        AND column_name = 'annual_attendance';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("annual_attendance");
        });
    });
  });
  describe("rides table", () => {
    test("rides table exists", () => {
      return db
        .query(
          `SELECT EXISTS (
                      SELECT FROM 
                          information_schema.tables 
                      WHERE 
                          table_name = 'rides'
                      );`
        )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        });
    });
    test("rides table has ride_id column as serial primary key", () => {
      return db
        .query(
          `SELECT column_name, data_type, column_default
                      FROM information_schema.columns
                      WHERE table_name = 'rides'
                      AND column_name = 'ride_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("ride_id");
          expect(column.data_type).toBe("integer");
          expect(column.column_default).toBe(
            "nextval('rides_ride_id_seq'::regclass)"
          );
        });
    });
    test("rides table has park_id column as integer", () => {
      return db
        .query(
          `SELECT column_name, data_type
                        FROM information_schema.columns
                        WHERE table_name = 'rides'
                        AND column_name = 'park_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("park_id");
          expect(column.data_type).toBe("integer");
        });
    });
    test("rides table has ride_name column", () => {
      return db
        .query(
          `SELECT column_name
                        FROM information_schema.columns
                        WHERE table_name = 'rides'
                        AND column_name = 'ride_name';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("ride_name");
        });
    });
    test("rides table has year_opened column", () => {
      return db
        .query(
          `SELECT column_name
                          FROM information_schema.columns
                          WHERE table_name = 'rides'
                          AND column_name = 'year_opened';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("year_opened");
        });
    });
    test("rides table has votes column", () => {
      return db
        .query(
          `SELECT column_name
                            FROM information_schema.columns
                            WHERE table_name = 'rides'
                            AND column_name = 'votes';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("votes");
        });
    });
  });

  describe("data insertion", () => {
    test("parks data has been inserted correctly", () => {
      return db.query(`SELECT * FROM parks;`).then(({ rows: parks }) => {
        expect(parks).toHaveLength(4);
        parks.forEach((park) => {
          expect(park).toHaveProperty("park_id");
          expect(park).toHaveProperty("park_name");
          expect(park).toHaveProperty("year_opened");
          expect(park).toHaveProperty("annual_attendance");
        });
      });
    });
    test("rides data has been inserted correctly", () => {
      return db.query(`SELECT * FROM rides;`).then(({ rows: rides }) => {
        expect(rides).toHaveLength(20);
        rides.forEach((ride) => {
          expect(ride).toHaveProperty("ride_id");
          expect(ride).toHaveProperty("ride_name");
          expect(ride).toHaveProperty("park_id", expect.any(Number));
          expect(ride).toHaveProperty("year_opened");
          expect(ride).toHaveProperty("votes");
        });
      });
    });
  });
});
