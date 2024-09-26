# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Set FLASK_APP to the full path if main.py is in a subfolder
ENV FLASK_APP=app/main.py

# Run the command to start the Flask app
CMD ["flask", "run", "--host=0.0.0.0"]

