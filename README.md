# Cesium.js Weather Application

This project demonstrates the capabilities of Cesium.js, focusing on three core elements along with the integration of a RESTful API to create a weather application.

## Core Elements

1. **Implementation of GooglePhotoRealistic3DTileset**
2. **Implementation of Camera Movement**
3. **Implementation of Cesium Particles**

Additionally, the project integrates the Weatherbit API to provide real-time weather data.

## Implementation Details

### 1. Implementation of GooglePhotoRealistic3DTileset

**Objective:**  
Integrate Google’s Photorealistic 3D Tiles into Cesium.js, providing highly detailed 3D models of the Earth.

**Steps:**
- Obtain an access token from Cesium Ion.
- Initialize the Cesium Viewer.
- Load and add the Google Photorealistic 3D Tileset to the scene.

### 2. Implementation of Camera Movement

**Objective:**  
Navigate the camera to different locations using predefined coordinates.

**Steps:**
- Define locations with coordinates.
- Create a function to fly the camera to the specified location.
- Attach event listeners to UI elements for interaction.

### 3. Implementation of Cesium Particles

**Objective:**  
Simulate weather effects (e.g., rain and snow) using Cesium’s particle system.

**Steps:**
- Define particle properties such as size, emission rate, and update behavior.
- Create functions to start the particle systems for snow and rain.

### Integration of Weatherbit API

**Objective:**  
Fetch real-time weather data and update the Cesium scene based on the weather conditions.

**Steps:**
- Obtain an API key from Weatherbit.
- Fetch weather data using the Fetch API.
- Update the scene and UI elements with the weather data.
- Trigger particle effects based on the weather conditions.

## Getting Started

### Prerequisites

- [Cesium Ion Account](https://cesium.com/ion/)
- [Weatherbit API Account](https://www.weatherbit.io/)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/mainul99m/CesiumJS-Weather-App.git
    CesiumJS-Weather-App
    ```

2. Obtain your API keys:
    - **Cesium Ion Token**: Sign up at [Cesium Ion](https://cesium.com/ion/) and get your access token.
    - **Weatherbit API Key**: Sign up at [Weatherbit](https://www.weatherbit.io/) and get your API key.

3. Configure your API keys:
    - Create a file `js/cesiumConfig.js` with the following content:
    ```javascript
    const TOKEN_CESIUM = "YOUR_API_KEY_HERE";
    const TOKEN_WEATHER = "YOUR_API_KEY_HERE";
    export { TOKEN_CESIUM, TOKEN_WEATHER };
    ```


# Contributors
1. Kazi Mainul Islam
2. Mathimenaka Ramasamy
3. Ayesha Anwar
