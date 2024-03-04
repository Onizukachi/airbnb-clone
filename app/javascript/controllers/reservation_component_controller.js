import { Controller } from "@hotwired/stimulus"
import { Datepicker } from "vanillajs-datepicker";
import { isEmpty } from "lodash-es";

// Connects to data-controller="reservation-component"
export default class extends Controller {
    static targets = ["checkin", "checkout", "numOfNights", "nightlyTotal", "serviceFee", "total"]

    connect() {
        this.checkinPicker = new Datepicker(this.checkinTarget, {
            minDate: this.element.dataset.defaultCheckinDate
        });

        this.checkoutPicker = new Datepicker(this.checkoutTarget, {
            minDate: this.element.dataset.defaultCheckoutDate
        });

        this.checkinTarget.addEventListener('changeDate', (e) => {
            const date = new Date(e.target.value);
            date.setDate(date.getDate() + 1);
            this.checkoutPicker.setOptions({
                minDate: date
            });

            this.updateNightlyTotal();
        });

        this.checkoutTarget.addEventListener('changeDate', (e) => {
            const date = new Date(e.target.value);
            date.setDate(date.getDate() - 1);
            this.checkinPicker.setOptions({
                maxDate: date
            });

            this.updateNightlyTotal();
        });
    }

    numberOfNights() {
        if (isEmpty(this.checkinTarget.value) || isEmpty(this.checkoutTarget.value)) {
            return 0
        }

        let checkinDate = new Date(this.checkinTarget.value);
        let checkoutDate = new Date(this.checkoutTarget.value);

        return (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24)
    }

    calculateNightlyTotal() {
        return (this.numberOfNights() * this.element.dataset.nightlyPrice).toFixed(2)
    }

    updateNightlyTotal() {
        this.numOfNightsTarget.textContent = this.numberOfNights();
        this.nightlyTotalTarget.textContent = this.calculateNightlyTotal();
        this.updateServiceFee();
    }

    calculateServiceFee() {
        return (this.calculateNightlyTotal() * this.element.dataset.serviceFee).toFixed(2)
    }

    updateServiceFee() {
        this.serviceFeeTarget.textContent = this.calculateServiceFee();
        this.updateTotal();
    }

    updateTotal() {
        console.log(this.calculateNightlyTotal())
        console.log( this.element.dataset.cleaningFee)
        console.log( this.calculateServiceFee())
        this.totalTarget.textContent = (parseFloat(this.calculateNightlyTotal()) + parseFloat(this.element.dataset.cleaningFee) + parseFloat(this.calculateServiceFee())).toFixed(2)
    }
}
