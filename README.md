# Wedding Guest Check-in App

This is a simple Flask-based app to help manage guest check-ins at a wedding. Guests will provide their names at the entrance, and the app will display their table number and mark them as arrived in a Google Sheets document.

## Setup

1. Create a Google Sheets document with columns: "Name", "Table", "Status".
2. Obtain Google Sheets API credentials and save them as  in the  directory.
3. Install dependencies:

   ```
   source venv/bin/activate
   pip install -r requirements.txt
   ```

4. Run the app:

   ```
   python app/main.py
   ```

## Usage

- Open the app in a web browser (http://localhost:5000).
- Type the guest's name in the search box.
- Click "Mark Arrived" next to their name when they arrive.

## Dependencies

- Flask
- gspread
- oauth2client

