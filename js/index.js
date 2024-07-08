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
    location = locations[event.target.value];
    flyToLocation(viewer, location);
  });
}

const startSnowButton = document.getElementById("startSnow");

startSnowButton.addEventListener("click", startSnow);