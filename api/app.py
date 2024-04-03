import asyncpg
from quart import Quart, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash
import datetime

app = Quart(__name__)

# Initialize database connection
async def init_db():
    try:
        app.db = await asyncpg.connect(
            user="myappuser",
            password="mysecurepassword",
            database="myappdb",
            host="localhost",
        )
        print("Database connection established successfully")
    except asyncpg.exceptions.PostgresError as e:
        print(f"Error connecting to the database: {e}")

@app.before_serving
async def create_db_connection():
    try:
        await init_db()
    except asyncpg.exceptions.PostgresError as e:
        print(f"Error connecting to the database: {e}")

@app.after_serving
async def close_db_connection():
    await app.db.close()


# Insert sample data
async def insert_data(name, age):
    try:
        await app.db.execute(
            """
            INSERT INTO mytable (name, age) VALUES ($1, $2)
            """,
            name, age
        )
        return {"message": "Data inserted successfully"}
    except asyncpg.exceptions.PostgresError as e:
        return {"error": f"Error inserting data: {e}"}

# Fetch data from the sample table
async def get_data():
    try:
        records = await app.db.fetch("SELECT * FROM mytable")
        print(records)
        return [dict(record) for record in records]
    except asyncpg.exceptions.PostgresError as e:
        return {"error": f"Error fetching data: {e}"}

@app.before_serving
async def create_db_connection():
    try:
        await init_db()
    except asyncpg.exceptions.PostgresError as e:
        print(f"Error connecting to the database: {e}")

@app.after_serving
async def close_db_connection():
    await app.db.close()

# Updated table creation to match the User model
async def create_users_table():
    try:
        await app.db.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                surname VARCHAR(255) NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                role VARCHAR(255) NOT NULL,
                credits INTEGER DEFAULT 0,
                location_id INTEGER
            )
        """)
        print("Users table created successfully")
    except Exception as e:
        print(f"Error creating users table: {e}")


@app.route("/createusers")
async def createusers():
    await create_users_table()
    return jsonify({"message": "Users table created"})

# User login route
@app.route('/login', methods=['POST'])
async def login():
    # ... (same as before)

# Insert user data - simulate registration
async def insert_user(email, password, name, surname, role, location_id):
    hashed_password = generate_password_hash(password)
    try:
        await app.db.execute("""
            INSERT INTO users (email, password, name, surname, role, location_id) 
            VALUES ($1, $2, $3, $4, $5, $6)
            """,
            email, hashed_password, name, surname, role, location_id
        )
        print(f"User {email} inserted successfully")
    except Exception as e:
        print(f"Error inserting user: {e}")


# Fetch all users
async def get_all_users():
    try:
        users = await app.db.fetch("SELECT id, email, name, surname, created_at, updated_at, role, credits, location_id FROM users")
        return [dict(user) for user in users]
    except Exception as e:
        print(f"Error fetching users: {e}")
        return {"error": f"Error fetching users: {e}"}

@app.route("/users", methods=['GET'])
async def users():
    users = await get_all_users()
    return jsonify(users)

@app.route("/register", methods=['POST'])
async def register():
    data = await request.get_json()
    await insert_user(
        data['email'], data['password'], data['name'],
        data['surname'], data['role'], data['location_id']
    )
    return jsonify({"message": "User registered successfully"})

if __name__ == "__main__":
    app.run()
