import { Controller } from "@hotwired/stimulus"
import { Datepicker } from "vanillajs-datepicker";
import { isEmpty } from "lodash-es";
import Swal from 'sweetalert2'

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

            if (!isEmpty(this.checkoutTarget.value)) {
                this.updateNightlyTotal();
            }
        });

        this.checkoutTarget.addEventListener('changeDate', (e) => {
            const date = new Date(e.target.value);
            date.setDate(date.getDate() - 1);
            this.checkinPicker.setOptions({
                maxDate: date
            });

            if (!isEmpty(this.checkinTarget.value)) {
                this.updateNightlyTotal();
            }
        });
    }

    numberOfNights() {
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

    calculateTotal() {
        return (parseFloat(this.calculateNightlyTotal()) + parseFloat(this.element.dataset.cleaningFee) + parseFloat(this.calculateServiceFee())).toFixed(2)
    }

    updateTotal() {
        this.totalTarget.textContent = this.calculateTotal();
    }

    buildReservationParams() {
        let params = {
            checkin_date: this.checkinTarget.value,
            checkout_date: this.checkoutTarget.value,
            subtotal: this.nightlyTotalTarget.textContent,
            cleaning_fee: this.element.dataset.cleaningFee,
            service_fee: this.serviceFeeTarget.textContent,
            total: this.totalTarget.textContent
        }

        return new URLSearchParams(params).toString();
    }

    buildSubmitUrl(url) {
        return `${url}?${this.buildReservationParams()}`;
    }

    submitReservationComponent(e) {
        if (isEmpty(this.checkinTarget.value) || isEmpty(this.checkoutTarget.value)) {
            Swal.fire({
                icon: "error",
                text: "Please select both the checking and the checkout dates",
            });
        } else {
            Turbo.visit(this.buildSubmitUrl(e.target.dataset.submitUrl))
        }
    }
}
