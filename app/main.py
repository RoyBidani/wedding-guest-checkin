import gspread
from oauth2client.service_account import ServiceAccountCredentials
from flask import Flask, render_template, request, jsonify
from threading import Lock
import time

app = Flask(__name__)

# Google Sheets credentials and configuration
scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name("app/credentials.json", scope)
client = gspread.authorize(creds)

# Update this with your spreadsheet ID
SPREADSHEET_ID = "151adBmDd7zr11_vXYpcjanSdsd1kjOT4H17x-gs8jhM"
sheet = client.open_by_key(SPREADSHEET_ID).sheet1

# Lock for thread safety
lock = Lock()

CACHE_DURATION = 60
last_cache_time = 0
cached_records = []

def get_guest_list():
    global last_cache_time, cached_records
    current_time = time.time()
    if current_time - last_cache_time > CACHE_DURATION:
        with lock:
            cached_records = sheet.get_all_records()
        last_cache_time = current_time
    return cached_records

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@app.route("/search", methods=["POST"])
def search():
    query = request.form["query"].lower()
    if query.startswith("0") and len(query) > 1:
        query = query[1:]

    all_records = get_guest_list()
    matches = [
        {
            "Name": record.get("Name", ""),  # Use .get to safely access the 'Name' key
            "PhoneNum": record.get("PhoneNum", ""),  # Same for 'PhoneNum'
            "Table": record.get("Table", ""),
            "Status": record.get("Status", "")
        }
        for record in all_records if query in record.get("Name", "").lower() or query in str(record.get("PhoneNum", ""))
    ]
    return jsonify(matches)


@app.route("/mark_arrived", methods=["POST"])
def mark_arrived():
    name = request.form["name"]
    with lock:
        all_records = sheet.get_all_records()
        for idx, record in enumerate(all_records, start=2):
            if record["Name"] == name:
                sheet.update_cell(idx, 3, "Arrived")
                sheet.format(f"C{idx}", {"backgroundColor": {"red": 0, "green": 1, "blue": 0}})
                return jsonify({"status": "success", "table": record["Table"]})
    return jsonify({"status": "failed"}), 404

@app.route("/unmark_arrived", methods=["POST"])
def unmark_arrived():
    name = request.form["name"]
    with lock:
        all_records = sheet.get_all_records()
        for idx, record in enumerate(all_records, start=2):
            if record["Name"] == name:
                sheet.update_cell(idx, 3, "")
                sheet.format(f"C{idx}", {"backgroundColor": {"red": 1, "green": 1, "blue": 1}})
                return jsonify({"status": "success"})
    return jsonify({"status": "failed"}), 404

@app.route("/add_guest", methods=["POST"])
def add_guest():
    name = request.form["name"]
    phone = request.form["phone"]
    with lock:
        all_records = sheet.get_all_records()
        new_row = [name, phone, "Arrived"]  # Default to table 15, customize as needed
        sheet.append_row(new_row)
        idx = len(all_records) + 2
        sheet.format(f"C{idx}", {"backgroundColor": {"red": 0, "green": 1, "blue": 0}})
        return jsonify({"status": "success"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

