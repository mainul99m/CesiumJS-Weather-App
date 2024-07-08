import { TOKEN_CESIUM, TOKEN_WEATHER } from './cesiumConfig.js';
import { locations } from './location.js'
import { flyToLocation } from './cesiumViewer.js';

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


// Add Cesium OSM Buildings, a global 3D buildings layer.
const buildingTileset = await Cesium.createOsmBuildingsAsync();
viewer.scene.primitives.add(buildingTileset);   

flyToLocation(viewer, location);
