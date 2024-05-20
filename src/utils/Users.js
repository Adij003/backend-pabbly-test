/**
 * 
 * Use for a User related functions.
 */

const Cipher = require('./Cipher');
const Helper = require('./Helper');
const Users = require('../models/Users');



module.exports = {

    /**
     * Use to create a new user if not exist in the database.
     */
    signUp: function (userId) {
        return new Promise(async (resolve, reject) => {
            try {

                var [err, duser] = await Helper.to(Users.findOne({ user_id: userId }));

                if (err) {
                    throw err;
                }

                if (duser) {
                    return resolve(duser);
                }

                // Create a new user instance
                const newUser = new Users({
                    user_id: userId,
                    api: {
                        apiKey: Cipher.createSecretKey(10),
                        secretKey: Cipher.createSecretKey(16),
                    }
                });

                // Save the user to the database
                await newUser.save();
                return resolve(newUser);
            } catch (err) {
                return reject(err);
            }
        });
    },
}
