# PG Theme Parks

Northcoders wants to get all the major theme parks to sign up to a service we will be creating to help theme park lovers find the best rides and food options at all the theme parks in the UK.

Before we can do that, we need to get some sample data into our database so we can get them interested. We have provided you with some js files that contain this sample data.

Your tasks today will involve creating the tables, inserting the data and confirming that all of that data has been added.

## Setup

---

### Task 1

First you will need to create your database. To do this, run the `npm run setup-db` command.

Now you have your database, you can create your database connection. To do this, you'll need to update the `connection.js` file. We have already made the file but you'll need to add the code.

- Install [node-postgres](https://node-postgres.com/)
- Create a new [connection pool](https://node-postgres.com/features/connecting) in the `db/connection.js` file
- Export the connection pool so that it is available for use in other files

---

## Seeding

### Task 2

Now that we can connect to your database, let's start the process of **seeding** it.

The order in which we are going to create our tables depends on the structure of our data. We need to first create the tables that do not reference other tables.

The `parks` table is one that doesn't have any relations.

Update the `createParks` function to create a table called parks in your `seed.js` file.

The table will need:

- park_id : Serial Primary Key
- park_name : VarChar Not Null
- year_opened: INT Not Null
- annual_attendance: INT not null

You can check this has worked by running `npm run seed` and checking the table looks as expected in the `psql` command line.

---

### Task 3

Next you'll need to create the `rides` table and add it to the seed function. You may want to do this with a function, as above.

The table will need:

- a serial primary key of `ride_id`,
- a `park_id` key that will be an `INT` and need to reference the `parks` table's `park_id` column.

It will also need: `ride_name`, `year_opened` and `votes` columns.

Take a look at the data to decide on what data types to make them.

---

### Task 4

Now that we have created our tables we will need to **insert some data** into it.

To do this dynamically, using our data files, you will need to install pg-format:

```zsh
npm install -D pg-format
```

As you can see from the [documentation](https://github.com/datalanche/node-pg-format) for pg-format and the [NC Notes](https://notes.northcoders.com/courses/js-back-end/seeding-with-pg), the `format()` takes two arguments:

- An SQL query string, which can contain a placeholder for the formatted values
- A nested array of the values to be inserted for each record

> It's important to note here that `format()` returns a _string_. It does not make the query for us.

#### 4.1

In order to prepare our data for passing into the `format()` function offered by `pg-format`, we must arrange the values from the data into a nested array.

Create a function called `arrangeParksData()`. This will be used as a _utility function_ within the `insertParks()` function we will create in the next part of this task.

`arrangeParksData()` should take one argument,`parksData`, which will - eventually - be the`parks` data we have required into the module on Line 1.

It should return a nested array of values from the data to it.

```JavaScript
// when passed:
const parks = [
  {
    "park_name": 'Thorpe Park',
    year_opened: 1979,
    annual_attendance: 1700000
  },
  {
    "park_name": 'Alton Towers',
    year_opened: 1980,
    annual_attendance: 2520000
  }
]


arrangeParksData(parks)
// it will return: [[ 'Thorpe Park', 1979, 1700000], ['Alton Towers', 1980, 2520000]]
```

#### 4.2

We're ready to insert some data in to our `parks` table now!

Create a function called `insertParks` and add it to the promise chain in the seed function.

This function should insert all of the parks data that we are requiring in on Line 1 and should utilise the `arrangeParksData()` function you have just defined.

---

### Task 5

Now, we should have some parks data stored in our database, you can complete the `selectParks` function in `models/parks.js`

In order to ensure this is working correctly we have written the tests for you.

Feel free to add a `.only` to the first test to avoid a few errors if you wish.

You can run the tests in the terminal with `npm test`.

If your table creation and inserting has worked as expected, this test should pass once you complete the function.

---

> Before we insert the `rides` to our database we need to address a couple of problems:
>
> The rides columns in our table need to have a `park_id` inserted into them.
>
> However, this `park_id` was created as a `SERIAL PRIMARY KEY` when we inserted the `parks` data into our database. So it exists in our database, but not in the local data we are using for seeding the `rides` table.
>
> The data we have access to _does_ have keys of `park_name` so, in order to be able to insert the rides data into the table we defined earlier, we will need to be able to work out which `park_id` goes with which `park_name`.
>
> We will need access to the rows that have been inserted to the `parks` table.
>
> In order to access all of this data you will need to make sure the `insertParks` function is `returning` the data from the rows.

---

### Task 6

Refactor the `insertParks` function to return all of the data that has been inserted.

---

### Task 7

You should now be able to access the data in the `.then` block after you've inserted the `parks`.

You will need to modify the rides data so that each of the rides, instead of having a `park_name` property, has an appropriate `park_id`.

To do this, create a function called `prepareRidesData`. This function should take two arguments:

1. An array of `rides` objects.
2. An array of `parks` objects. (Returned from the database.)

`prepareRidesData` should return an array of `rides` objects with the appropriate keys on each one.

Think about how you are going to ensure that each ride has the correct `park_id`.

This is a utility function. Write some tests for this function in `utils.test.js` and make sure to use TDD.

```js
[
  {
    ride_name: "Tidal Wave",
    year_opened: 2000,
    park_name: "Thorpe Park",
    votes: 1,
  },
];
```

will become

```js
[
  {
    ride_name: "Tidal Wave",
    year_opened: 2000,
    park_id: 1,
    votes: 1,
  },
];
```

---

### Task 8

Now that we have the modified `rides` data to contain the values our table needs, we need to insert that data into the table.

As before, we should utilise the `format()` function available to us from `pg-format`.

#### 8.1

Create a utility function to arrange the rides data: `arrangeRidesData()`.

It should take one argument, containing rides data, and return a _nested array_ to be passed as a second argument into `format()`.

> _Use T.D.D._

#### 8.2

Now to put it all together! Create an `insertRides()` function.

This function will do the task of inserting the correct rides data into the database. It should take the modified `rides` data and insert it, utilising `pg-format` and the utility function you've just defined and tested.

---

### Task 9

Now that we should have some rides data stored in our database, you can complete the `selectRidesByParkId` function in `models/rides.js`.


---

### Task 10

Complete the `updateParkById` function in models/parks.js.

---

### Task 11

Complete the `removeParkById` function in models/parks.js.

---

---

## Advanced Tasks

###  Task 12

Take a look at the foods and stalls data in the `data` folder - this is a many-to-many relationship. Think about the data types you want to store and which tables you will need to create to build this.

> _Hint:_ You will need to create three tables if you want to store this without duplicating any information.

Update your seed function to create the tables required to store the stalls and food data.

---

### Task 13

Insert the data from foods and stalls into your database.

Do make sure to write some tests for any utility functions that you need to create.

---

### Task 14

Create and test a `getStallById` model. This function should return all the foods that stall stocks, as well as all the stall information.

---

### Task 15

Create and test an `updateStall` model that will add an extra food that stall serves.

---

### Task 16

Create and test a `removeStall` model.

---

---

## Even More Challenges

Still going? 😮 Have a go at building any of the following models:

- `createStall()`
- `selectRides()`
- update your `selectRides` function so it takes an optional minVotes parameter. If it's present, it should only select the rides with votes above the given number
- update your `selectRides` function so it takes an optional openSince parameter. If it's present, it should only select the rides that opened after a given date
