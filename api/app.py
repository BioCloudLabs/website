import asyncpg
from quart import Quart, jsonify, request
from werkzeug.security import check_password_hash

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

# Sample table creation
async def create_example_table():
    try:
        await app.db.execute(
            """
            CREATE TABLE IF NOT EXISTS mytable (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                age INT
            )
            """
        )
        return {"message": "Example table created successfully"}
    except asyncpg.exceptions.DuplicateTableError:
        return {"message": "Table already exists"}

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

# Routes for sample operations
@app.route("/createexample")
async def createexample():
    result = await create_example_table()
    return jsonify({"data": result})

@app.route("/addexampledata")
async def addexample():
    result = await insert_data('Pepe', 19)
    return jsonify({"data": result})

@app.route("/showdata")
async def showdata():
    result = await get_data()
    return jsonify({"data": result})

# User login route
@app.route('/login', methods=['POST'])
async def login():
    data = await request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    try:
        # Fetch the user from your database
        user_record = await app.db.fetchrow("SELECT * FROM users WHERE username=$1", username)

        if user_record and check_password_hash(user_record['password'], password):
            # Authentication successful
            return jsonify({"message": "Login successful"}), 200
        else:
            # Authentication failed
            return jsonify({"error": "Invalid username or password"}), 401
    except asyncpg.exceptions.PostgresError as e:
        print(f"Database query error: {e}")
        return jsonify({"error": "An error occurred while processing your request"}), 500

if __name__ == "__main__":
    app.run()
