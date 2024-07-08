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
