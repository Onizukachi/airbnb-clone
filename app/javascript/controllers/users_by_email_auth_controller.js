import { Controller } from "@hotwired/stimulus"
import axios from 'axios';

export default class extends Controller {
    static targets = [ "email", "submit", "emailWrapper", "invalidSvg", "errorMessage" ];
    connect() {
        this.submitTarget.addEventListener('click', (e) => {
            e.preventDefault();

            if (this.emailTarget.value.length === 0) {
                this.emailWrapperTarget.classList.remove('focus-within:ring-1');
                this.emailWrapperTarget.classList.remove('focus-within:ring-black');
                this.emailWrapperTarget.classList.remove('focus-within:border-black');
                this.emailWrapperTarget.classList.add('invalid-inset-input-text-field');
                this.invalidSvgTarget.classList.remove('hidden');
                this.errorMessageTarget.classList.remove('hidden');
            } else {
                axios.get('/api/users_by_email', {
                    params: { email: this.emailTarget.value },
                    headers: {
                        'ACCEPT': 'application/json'
                    }
                }).then((response) => {
                    Turbo.visit('/users/sign_in');
                }).catch((response) => {
                    Turbo.visit('/users/sign_up');
                })
            }
        })
    }
}