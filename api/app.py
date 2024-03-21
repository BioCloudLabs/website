from quart import Quart, request
from database import QuartDatabases

app = Quart(__name__)
db = QuartDatabases(app)

@app.route("/")
async def index():
    result = await db.fetch_all("SELECT * FROM mytable")
    return {"data": result}

@app.route("/create_example_table", methods=["POST"])
async def create_example_table():
    try:
        await app.db.execute(
            """
            CREATE TABLE mytable (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                age INT
            )
            """
        )
        return {"message": "Example table created successfully"}
    except asyncpg.exceptions.DuplicateTableError:
        return {"message": "Table already exists"}

if __name__ == "__main__":
    app.run()


@app.route("/")
async def index():
    result = await db.fetch_all("SELECT * FROM mytable")
    return {"data": result}


if __name__ == "__main__":
    app.run()