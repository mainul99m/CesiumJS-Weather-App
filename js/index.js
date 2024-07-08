import { TOKEN_CESIUM, TOKEN_WEATHER } from './cesiumConfig.js';
import { locations } from './location.js'
import { flyToLocation } from './cesiumViewer.js';
import { createSelectPlace } from './dropdown.js';

// Your access token can be found at: https://ion.cesium.com/tokens.
Cesium.Ion.defaultAccessToken = TOKEN_CESIUM;

let location = locations[0];

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
// Documentation - https://cesium.com/learn/ion-sdk/ref-doc/Viewer.html
const viewer = new Cesium.Viewer('cesiumContainer', {
  shouldAnimate: true,
  terrain: Cesium.Terrain.fromWorldTerrain(),
  homeButton: false,
  geocoder: false,
  sceneModePicker: false,
  selectionIndicator: false,
  infoBox: false,
  baseLayerPicker: false,
  shadow: true,
  timeline: false,
  shouldAnimate: true,
  animation: true,
});

const scene = viewer.scene;

// initialize the google tileset
let googleTileset;

// Add Google Photorealistic 3D Tileset
// Documentation - https://cesium.com/learn/ion-sdk/ref-doc/GooglePhotorealistic3DTileset.html
// Cesium Asset Depo - https://ion.cesium.com/assetdepot/354307
async function addGooglePhotoRealistic3DTileset(){
  try {
    googleTileset = await Cesium.createGooglePhotorealistic3DTileset();
    viewer.scene.primitives.add(googleTileset);
  } catch (error) {
    console.log(`Failed to load tileset: ${error}`);
  }
}

addGooglePhotoRealistic3DTileset();

flyToLocation(viewer, location);


function removeAllExceptGooglePhotorealistic3DTileset() {
  const primitives = scene.primitives;
  for (let i = primitives.length - 1; i >= 0; i--) {
    if (primitives.get(i) !== googleTileset) {
      primitives.remove(primitives.get(i));
    }
  }
}


// Add snow effect
// Documentation - https://cesium.com/learn/ion-sdk/ref-doc/ParticleSystem.html
// Cesium Sandcastle - https://sandcastle.cesium.com/?src=Particle%20System%20Weather.html
const snowParticleSize = 12.0;
const snowRadius = 15000.0;
const minimumSnowImageSize = new Cesium.Cartesian2(
  snowParticleSize,
  snowParticleSize
);
const maximumSnowImageSize = new Cesium.Cartesian2(
  snowParticleSize * 1.0,
  snowParticleSize * 1.0
);
let snowGravityScratch = new Cesium.Cartesian3();

const snowUpdate = function (particle, dt) {
  snowGravityScratch = Cesium.Cartesian3.normalize(
    particle.position,
    snowGravityScratch
  );
  Cesium.Cartesian3.multiplyByScalar(
    snowGravityScratch,
    Cesium.Math.randomBetween(-30.0, -300.0),
    snowGravityScratch
  );
  particle.velocity = Cesium.Cartesian3.add(
    particle.velocity,
    snowGravityScratch,
    particle.velocity
  );
  const distance = Cesium.Cartesian3.distance(
    scene.camera.position,
    particle.position
  );
  if (distance > snowRadius) {
    particle.endColor.alpha = 0.0;
  } else {
    particle.endColor.alpha = 1.0 / (distance / snowRadius + 0.1);
  }
};

function startSnow() {
  removeAllExceptGooglePhotorealistic3DTileset();
  scene.primitives.add(
    new Cesium.ParticleSystem({
      modelMatrix: new Cesium.Matrix4.fromTranslation(
        scene.camera.position
      ),
      minimumSpeed: -1.0,
      maximumSpeed: 0.0,
      lifetime: 30.0,
      emitter: new Cesium.SphereEmitter(snowRadius),
      startScale: 0.5,
      endScale: 1.0,
      image: "assets/img/snowflake_particle.png",
      emissionRate: 7000.0,
      startColor: Cesium.Color.WHITE.withAlpha(0.0),
      endColor: Cesium.Color.WHITE.withAlpha(1.0),
      minimumImageSize: minimumSnowImageSize,
      maximumImageSize: maximumSnowImageSize,
      updateCallback: snowUpdate,
    })
  );

  scene.skyAtmosphere.hueShift = -0.8;
  scene.skyAtmosphere.saturationShift = -0.7;
  scene.skyAtmosphere.brightnessShift = -0.33;
  scene.fog.density = 0.001;
  scene.fog.minimumBrightness = 0.8;
}


// Add rain effect
const rainParticleSize = 15.0;
const rainRadius = 100000.0;
const rainImageSize = new Cesium.Cartesian2(
  rainParticleSize * 0.25,
  rainParticleSize * 0.75
);
let rainGravityScratch = new Cesium.Cartesian3();
const rainUpdate = function (particle, dt) {
  rainGravityScratch = Cesium.Cartesian3.normalize(
    particle.position,
    rainGravityScratch
  );
  rainGravityScratch = Cesium.Cartesian3.multiplyByScalar(
    rainGravityScratch,
    -1050.0,
    rainGravityScratch
  );

  particle.position = Cesium.Cartesian3.add(
    particle.position,
    rainGravityScratch,
    particle.position
  );

  const distance = Cesium.Cartesian3.distance(
    scene.camera.position,
    particle.position
  );
  if (distance > rainRadius) {
    particle.endColor.alpha = 0.0;
  } else {
    particle.endColor.alpha =
      Cesium.Color.BLUE.alpha / (distance / rainRadius + 0.1);
  }
};

function startRain() {
  removeAllExceptGooglePhotorealistic3DTileset();
  scene.primitives.add(
    new Cesium.ParticleSystem({
      modelMatrix: new Cesium.Matrix4.fromTranslation(
        scene.camera.position
      ),
      speed: -1.0,
      lifetime: 20.0,
      emitter: new Cesium.SphereEmitter(rainRadius),
      startScale: 1.0,
      endScale: 0.5,
      image: "assets/img/circular_particle.png",
      emissionRate: 12000.0,
      startColor: new Cesium.Color(0.27, 0.5, 0.7, 0.0),
      endColor: new Cesium.Color(0.27, 0.5, 0.7, 0.98),
      imageSize: rainImageSize,
      updateCallback: rainUpdate,
    })
  );

  scene.skyAtmosphere.hueShift = -0.97;
  scene.skyAtmosphere.saturationShift = 0.25;
  scene.skyAtmosphere.brightnessShift = -0.4;
  scene.fog.density = 0.00025;
  scene.fog.minimumBrightness = 0.01;
}



// Reset the sky to default values
// Documentation - https://cesium.com/learn/ion-sdk/ref-doc/Scene.html

function resetSky() {
  scene.skyAtmosphere.hueShift = 0.0;
  scene.skyAtmosphere.saturationShift = 0.0;
  scene.skyAtmosphere.brightnessShift = 0.0;
  scene.fog.density = 0.0002; // Reset to default fog density
  scene.fog.minimumBrightness = 0.01; // Reset to default minimum brightness
}

function setModerateClouds() {
  scene.skyAtmosphere.hueShift = -0.05; 
  scene.skyAtmosphere.saturationShift = 0.1; 
  scene.skyAtmosphere.brightnessShift = -0.1; 
  scene.fog.density = 0.0003; 
  scene.fog.minimumBrightness = 0.6;  
}

function setHeavyClouds() {
  scene.skyAtmosphere.hueShift = -0.5;
  scene.skyAtmosphere.saturationShift = 0.0;
  scene.skyAtmosphere.brightnessShift = -0.5;
  scene.fog.density = 0.0025;
  scene.fog.minimumBrightness = 0.3;
}

function resetWeather(){
  resetSky();
  removeAllExceptGooglePhotorealistic3DTileset();
  document.getElementById("temperature").innerText = '-';
  document.getElementById("cityName").innerText = '-';
  document.getElementById("precipitation").innerText = '-';
  document.getElementById("snow").innerText = '-';
  document.getElementById("windSpeed").innerText = '-';
  document.getElementById("cloudCover").innerText = '-';
}


// Fetch weather data from the Weatherbit API
// Documentation - https://www.weatherbit.io/api/weather-current

function getWeather() {
  const apiEndpoint = `https://api.weatherbit.io/v2.0/current?lat=${location.coordinate[1]}&lon=${location.coordinate[0]}&key=${TOKEN_WEATHER}`;

  fetch(apiEndpoint)
    .then(response => response.json())
    .then(data => {
      const temperature = data.data[0].temp; 
      const precipitation = data.data[0].precip;
      const cityName = data.data[0].city_name; 
      const snow = data.data[0].snow;
      const windSpeed = data.data[0].wind_spd;
      const cloud = data.data[0].clouds;

      document.getElementById("temperature").innerText = temperature.toFixed(2);
      document.getElementById("cityName").innerText = cityName;
      document.getElementById("precipitation").innerText = precipitation;
      document.getElementById("snow").innerText = snow;
      document.getElementById("windSpeed").innerText = windSpeed;
      document.getElementById("cloudCover").innerText = cloud

      if (snow > 0) {
        startSnow();
      } else if (precipitation > 0) {
        startRain();
      } else {
        if(cloud > 80){
          setHeavyClouds()
        } else if(cloud > 50){
          setModerateClouds()
        } else {
          resetSky();
        }
      }
      

    })
    .catch(error => console.error('Error fetching weather data:', error));

}



// Create a dropdown menu to select the location
const options = Object.keys(locations).map((key) => {
  return {
    label: locations[key].name,
    value: key,
  };
});

const dropdown = createSelectPlace(options, "dropdown");

// change the location when the dropdown value changes
if (dropdown) {
  dropdown.addEventListener("change", (event) => {
    resetWeather();
    location = locations[event.target.value];
    flyToLocation(viewer, location);
  });
}

const updateWeatherButton = document.getElementById("updateWeather");

updateWeatherButton.addEventListener("click", getWeather);