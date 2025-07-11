import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/')
        }

        this.emailElement = document.getElementById('email')
        this.passwordElement = document.getElementById('password')
        this.rememberElement = document.getElementById('remember')
        this.commonErrorElement = document.getElementById('common-error')

        document.getElementById('process-button').addEventListener('click', this.login.bind(this))
    }

    validate_form() {
        let isValid = true

        if (this.emailElement.value && this.emailElement.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            this.emailElement.classList.remove('is-invalid')
        } else {
            this.emailElement.classList.add('is-invalid')
            isValid = false
        }

        if (this.passwordElement.value) {
            this.passwordElement.classList.remove('is-invalid')
        } else {
            this.passwordElement.classList.add('is-invalid')
            isValid = false
        }

        return isValid
    }

    async login() {
        this.commonErrorElement.style.display = 'none'

        if (this.validate_form()) {
            const result = await HttpUtils.request('/login', 'POST', {
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberElement.checked,
            })

            if (result.error || !result.response || (result.response && (!result.response.accessToken || !result.response.refreshToken || !result.response.id || !result.response.name))) {
                this.commonErrorElement.style.display = 'block'
                return
            }

            AuthUtils.setAuthInfo(result.response.accessToken, result.response.refreshToken, {Id: result.response.id, name: result.response.name})

            this.openNewRoute('/')
        }
    }
}
