export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

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
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: this.rememberElement.checked,
                })
            })
            const result = await response.json()

            if (result.error || !result.accessToken || !result.refreshToken || !result.id || !result.name) {
                this.commonErrorElement.style.display = 'block'
                return
            }

            localStorage.setItem('accessToken', result.accessToken)
            localStorage.setItem('refreshToken', result.refreshToken)
            localStorage.setItem('userInfo', JSON.stringify({Id: result.id, name: result.name}))

            this.openNewRoute('/')
        }
    }
}
