# Firelink Frontend
Frontend React SPA for the Firelink project: a web GUI for Bonfire. See the [firelink-backend](https://github.com/RedHatInsights/firelink-backend) for the other half of this app.

## Development Setup
You'll need node installed. 
```bash
# Install dependencies
$ npm install
# Start the app
$ npm start
```

The frontend will be served out on `localhost:5000`

To work on the app you'll need the backend running as well. You will need to clone [firelink-backend](https://github.com/RedHatInsights/firelink-backend), run the app, and then run the dev proxy that ensures the frontend and backend can talk to eachother. The [firelink-backend](https://github.com/RedHatInsights/firelink-backend) `README.md` contains instructions on how to get up and running.

## Building

```bash
$ docker build -t firelink-frontend:latest .
$ docker run -p 8000:8000 firelink-frontend:latest
```