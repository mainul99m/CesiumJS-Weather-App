// Fly the camera to the given location(longitude, latitude, and height, with the given heading and pitch).
export function flyToLocation(viewer, location) {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(...location.coordinate),
        orientation: {
            heading: Cesium.Math.toRadians(location.heading),
            pitch: Cesium.Math.toRadians(location.pitch),
        }
    });
}