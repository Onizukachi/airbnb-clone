import { Controller } from "@hotwired/stimulus"
import { getDistance, convertDistance } from 'geolib';
import { isEmpty } from 'lodash-es';

export default class extends Controller {
    static targets = ['property'];

    connect() {
        if (isEmpty(this.element.dataset.latitude) && isEmpty(this.element.dataset.longitude)) {
            window.navigator.geolocation.getCurrentPosition((position) => {
                this.setUserCoordinates({ latitude: position.coords.latitude, longitude: position.coords.longitude })
            });
        }

        this.setDistanceText()
    }

    getUserCoordinates() {
        return {
            latitude: this.element.dataset.latitude,
            longitude: this.element.dataset.longitude
        }
    }

    setUserCoordinates(coordinates) {
        this.element.dataset.latitude = coordinates.latitude;
        this.element.dataset.longitude = coordinates.longitude;
    }

    setDistanceText() {
        this.propertyTargets.forEach((propertyTarget) => {
            let distanceFrom = getDistance(
                this.getUserCoordinates(),
                { latitude: propertyTarget.dataset.propertyLatitude, longitude: propertyTarget.dataset.propertyLongitude }
            );

            propertyTarget.querySelector("#distance-away").textContent = `${Math.round(convertDistance(distanceFrom, 'km'))} kilometers away`;
        });
    }
}
