import { Controller } from "@hotwired/stimulus"
import axios from "axios";

export default class extends Controller {
    HEADERS = { 'ACCEPT': 'application/json' }

    favorite(e) {
        e.preventDefault();

        if (this.element.dataset.userLoggedIn === 'false') {
            return document.querySelector('[data-header-target="userAuthLink"]').click();
        }

        if (this.element.dataset.favorited === 'true') {
            this.doUnfavorite();
        } else {
            this.doFavorite();
        }
    }

    getFavoritePath() {
        return '/api/favorites';
    }

    getUnfavoritePath(favoriteId) {
        return `/api/favorites/${favoriteId}`;
    }

    doFavorite() {
        axios({
            method: 'post',
            url: this.getFavoritePath(),
            data: {
                property_id: this.element.dataset.propertyId,
            },
            headers: this.HEADERS
        }).then((response) => {
            this.element.dataset.favoriteId = response.data.id;
            this.element.setAttribute("fill", "red");
            this.element.dataset.favorited = 'true';
        });
    }

    doUnfavorite() {
        axios({
            method: 'delete',
            url: this.getUnfavoritePath(this.element.dataset.favoriteId),
            headers: this.HEADERS
        }).then((response) => {
            this.element.dataset.favoriteId = '';
            this.element.setAttribute("fill", this.element.dataset.defaultFill);
            this.element.dataset.favorited = 'false';
        })
    }
}