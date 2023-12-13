const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'api',
  password: 'alya',
  port: 5432
});

const getUsers = async (request, response) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
    response.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    response.status(500).send('Internal Server Error');
  }
};

const getUserById = async (request, response) => {
  const id = parseInt(request.params.id);

  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    response.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    response.status(500).send('Internal Server Error');
  }
};

const createUser = (request, response) => {
  const { name, email } = request.body
  
  pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id', [name, email], (error, results) => {
  if (error) {
  throw error
  }
  response.status(201).send(`User added with ID: ${results.rows[0].id}\n`);
  });
  };

const updateUser = async (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  try {
    await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id]);
    response.status(200).send(`User modified with ID: ${id}`);
  } catch (error) {
    console.error('Error updating user:', error);
    response.status(500).send('Internal Server Error');
  }
};

const deleteUser = async (request, response) => {
  const id = parseInt(request.params.id);

  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    response.status(200).send(`User deleted with ID: ${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    response.status(500).send('Internal Server Error');
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
