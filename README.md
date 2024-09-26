Here’s a detailed `README.md` file for your **Wedding Guest Check-in App** project. You can adapt it as needed, depending on specific project details:

---

# Wedding Guest Check-in App

This web-based application allows users to manage guest check-ins at a wedding event. It provides real-time updates of guest statuses, the ability to search guests by name or phone number, and easily mark them as "checked-in". It also features the ability to add new guests to the list during the event.

## Features

- **Guest Search**: Search guests by name or phone number.
- **Check-In Guests**: Easily mark guests as "Arrived" and track their check-in status.
- **Add New Guests**: Add new guests directly during the event using a simple modal form.
- **Real-time Synchronization**: The app synchronizes data with a Google Sheet for real-time updates.
- **Mobile Friendly**: Responsive design to be used on different devices, including tablets and mobile phones.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Flask (Python)
- **Database**: Google Sheets (via gspread API)
- **Docker**: Containerized deployment for easy distribution
- **Google Sheets API**: For real-time guest list synchronization

## Prerequisites

To run the project locally, ensure you have the following installed:

- [Python 3.x](https://www.python.org/)
- [Docker](https://www.docker.com/)
- [Google Cloud Console Project & Service Account Key](https://console.cloud.google.com/)

### Google Sheets Setup

1. Create a Google Sheets file for the guest list.
2. Set up a Google Cloud project and create a service account with access to the Sheets and Drive APIs.
3. Download the service account JSON key file and save it as `credentials.json` in the `app/` directory.

## Getting Started

### Clone the repository

```bash
git clone https://github.com/roybidani/wedding-checkin-app.git
cd wedding-checkin-app
```

### Google Sheets Credentials Setup

1. Create a Google Cloud service account and enable Google Sheets and Google Drive APIs.
2. Download the `credentials.json` file and place it in the `app/` directory.

### Install Dependencies

If you're running the app without Docker, install the required Python packages:

```bash
pip install -r requirements.txt
```

### Running the App

To run the app locally using Flask:

```bash
python3 app/main.py
```

The app will be available at `http://localhost:5000`.

### Running with Docker

1. Build the Docker image:

```bash
docker build -t wedding-checkin-app .
```

2. Run the Docker container:

```bash
docker run -d -p 5000:5000 --name wedding-checkin-app wedding-checkin-app
```

This will start the app and expose it on port 5000 of your local machine. Access it at `http://localhost:5000`.

### Pushing to Docker Hub

1. Log in to Docker:

```bash
docker login
```

2. Tag the image:

```bash
docker tag wedding-checkin-app roybidani/wedding-checkin-app:latest
```

3. Push the image to Docker Hub:

```bash
docker push roybidani/wedding-checkin-app:latest
```

## Usage

1. Open the app in your web browser.
2. Search for guests by entering their name or phone number in the search box.
3. Click the "Check-In" button to mark them as arrived.
4. Add new guests using the "Add Guest" button.


## Future Improvements

- **Guest table assignment**: Allow users to assign tables to guests.
- **CSV Import/Export**: Add support for importing/exporting guest lists from/to CSV.
- **Enhanced Analytics**: Provide statistics on guest check-ins in real-time.
- **Notifications**: Add email or SMS notifications when guests arrive.
