const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
  .query(`
    SELECT * 
    FROM users
    WHERE email = $1;`, [email])
    .then((result) => result.rows[0])
    .catch((err) => {
      null;
      console.log(err.message);
    });
};
//   let user;
//   for (const userId in users) {
//     user = users[userId];
//     if (user.email.toLowerCase() === email.toLowerCase()) {
//       break;
//     } else {
//       user = null;
//     }
//   }
//   return Promise.resolve(user);
// }
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
  .query(`
    SELECT * 
    FROM users
    WHERE id = $1;`, [id])
    .then((result) => result.rows[0])
    .catch((err) => {
      null;
      console.log(err.message);
    });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const values = [user.name, user.email, user.password];
  return pool
  .query(`
  INSERT INTO users (name, email, password) 
  VALUES ($1, $2, $3)
  returning *;`, values)
    .then((result) => result.rows[0])
    .catch((err) => {
      null;
      console.log(err.message);
    });
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  let temp1 = guest_id
  let temp2 = limit
  const values = [temp1, temp2]
  return pool
  .query(`
    SELECT * 
    FROM reservations
    WHERE guest_id = $1
    LIMIT $2;`, values)
    .then((result) => result.rows)
    .catch((err) => {
      null;
      console.log(err.message);
    });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = (options, limit = 10) => {
  const queryParams = [];
    let queryString = `
    SELECT * 
    FROM properties
    JOIN users ON owner_id = users.id
    JOIN property_reviews ON property_id = properties.id`;

    // for (key in options) {
    //   if (typeof key !== 'undefined') {
    //     queryParams.push(options[key])
    //     queryString =+ `WHERE city LIKE $${}`
    //   }
    // }
    

    if (options.city) {
      if (options.city !== '') {
      queryParams.push(`%${options.city}%`);
      queryString += ` 
      WHERE city LIKE $${queryParams.length} `;
      }
    }

    if(options.owner_id) {
     if(options.owner_id !== '') {
      queryParams.push(`%${options.owner_id}%`);
      queryString += `AND owner_id LIKE $${queryParams.length}`;
     }
    } 
    
    if(options['minimum_price_per_night']) {
      if(Number(options['minimum_price_per_night'])) {
      
      queryParams.push(`${Number(options['minimum_price_per_night']) * 100}`);
      queryString += `\nAND cost_per_night > $${(queryParams.length)}`;
    }
    } 
    
    if(options.maximum_price_per_night) {
      if(Number(options.maximum_price_per_night)) {
      queryParams.push(`${Number((options.maximum_price_per_night))* 100}`);
      queryString += `
      AND cost_per_night < $${(queryParams.length)}`;
    }
    }
    
    if(options.minimum_rating) {
      if(Number(options.minimum_rating)) {
      queryParams.push(`${Number(options.minimum_rating)}`);
      queryString += `
      AND property_reviews.rating >= $${queryParams.length}`;
    }
    }

    queryParams.push(limit);
    queryString += `
    GROUP BY properties.id, users.id, property_reviews.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};`;

    console.log('QS: ', queryString);
    console.log('QP: ', queryParams);
    console.log('options: ', options);

  return pool
    .query(queryString, queryParams)
    .then((result) => result.rows)
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
