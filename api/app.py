import asyncpg
from quart import Quart, jsonify

app = Quart(__name__)

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

async def get_data():
    try:
        records = await app.db.fetch("SELECT * FROM mytable")
        print(records)
        return [dict(record) for record in records]
    except asyncpg.exceptions.PostgresError as e:
        return {"error": f"Error fetching data: {e}"}

@app.route("/createexample")
async def createexample():
    result = await create_example_table()
    return jsonify({"data": result})

@app.route("/addexampledata")
async def addexample():
    result = await insert_data('Pepe', 19)
    return {"data": result}

@app.route("/showdata")
async def showdata():
    result = await get_data()
    print(result[0]) 
    return jsonify({"data": result})

if __name__ == "__main__":
    app.run()