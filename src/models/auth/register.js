import db from '../db.js';

// does the user exist in the database
export const emailExists = async (email) => {
    const query = `
        SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) as exists
    `;
    const result = await db.query(query, [email]);
    return result.rows[0].exists;
};


// saves the new user to the database
export const saveUser = async (username, email, hashedPassword) => {
    const query = `
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, username, email, created_at
    `;
    const result = await db.query(query, [username, email, hashedPassword]);
    return result.rows[0];
};

// gets all of the users from the database
export const getAllUsers = async () => {
    const query = `
        SELECT id, username, email, role, created_at
        FROM users
        ORDER BY created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

// gets a user from the db by their id
export const getUserById = async (id) => {
    const query = `
        SELECT 
            users.id,
            users.username,
            users.email,
            users.role,
            users.created_at
        FROM users
        WHERE users.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
};

// update a user
export const updateUser = async (id, username, email) => {
    const query = `
        UPDATE users 
        SET username = $1, email = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING id, username, email, updated_at
    `;
    const result = await db.query(query, [username, email, id]);
    return result.rows[0] || null;
};

// delete a user
export const deleteUser = async (id) => {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
};
