import bcrypt from 'bcryptjs';
import db from '../db.js';

// find a user by email to let them log in
export const findUserByEmail = async (email) => {
    const query = `
      SELECT 
        users.id, 
        users.username, 
        users.email, 
        users.password_hash AS password,
        users.role,
        users.created_at
      FROM users
      WHERE LOWER(users.email) = LOWER($1)
      LIMIT 1
    `;
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
};

// verify password against the hashed password
export const verifyPassword = async (plainPassword, hashedPassword) => {
    const isVerified = await bcrypt.compare(plainPassword, hashedPassword);
    return isVerified;
};
