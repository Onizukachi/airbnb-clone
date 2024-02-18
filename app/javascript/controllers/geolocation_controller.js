import { Controller } from "@hotwired/stimulus"
import { getDistance, convertDistance } from 'geolib';

export default class extends Controller {
    static targets = ['property']

    connect() {
        window.navigator.geolocation.getCurrentPosition((position) => {
            this.propertyTargets.forEach((propertyTarget) => {
                const lon = propertyTarget.dataset.propertyLongitude;
                const lan = propertyTarget.dataset.propertyLatitude;

                let distanceFrom = getDistance(
                { latitude: position.coords.latitude, longitude: position.coords.longitude },
                { latitude: lan, longitude: lon }
                );

                let distanceFromKm = convertDistance(distanceFrom, 'km')
                propertyTarget.querySelector("#distance-away").textContent = `${Math.round(distanceFromKm)} kilometers away`

            })
        })
    }

    calculateDistance(from_lat, from_lon) {
        this.distanceAwayTargets.forEach((el) => {
            getDistance(
                { latitude: from_lat, longitude: from_lon },
                { latitude: "51° 31' N", longitude: "7° 28' E" }
            );
        })
    }

}
