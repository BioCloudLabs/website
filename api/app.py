from quart import Quart
from flask_smorest import Api
from quart_cors import cors
from dotenv import load_dotenv
import time
import os

load_dotenv()

app = Quart(__name__, static_folder="out", static_url_path="/")
app.config["API_TITLE"] = os.getenv("API_TITLE")
app.config["API_VERSION"] = os.getenv("API_VERSION")
app.config["OPENAPI_VERSION"] = os.getenv("OPENAPI_VERSION")

api = Api(app)

@app.route("/")
async def index():
    return {"message": "Hello World"}

@app.route("/api/time")
async def get_current_time():
    return {"time": time.time()}

if __name__ == "__main__":
    app.run(debug=True, port=8080, host="0.0.0.0")