# Weather App

A simple web application that fetches and displays weather data based on the user's location or a user-inputted location. This project uses the OpenWeatherMap API to provide real-time weather information.

## Features

- Fetches weather data for the user's current location or a user-inputted location.
- Displays current weather conditions, temperature, humidity, and wind speed.
- Simple and responsive UI.

## Getting Started

### Prerequisites

- A modern web browser
- An API key from OpenWeatherMap. You can get one by signing up [here](https://home.openweathermap.org/users/sign_up).

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Jv2350/PRODIGY_WD_05
    cd PRODIGY_WD_05
    ```

2. Open the `index.html` file in your browser to see the app in action.

### Usage

1. Open the `index.html` file in a web browser.
2. Enter a location in the input field and click the "Search" button to fetch the weather data.
3. The weather information for the specified location will be displayed.

### Configuration

- Open the `script.js` file.
- Replace `YOUR_API_KEY` with your OpenWeatherMap API key.

```javascript
const API_KEY = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
