export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        if (!localStorage.getItem('accessToken') || !localStorage.getItem('refreshToken')) {
            return this.openNewRoute('/login')
        }

        this.logout().then()
    }

    async logout() {
        await fetch('http://localhost:3000/api/logout', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                refreshToken: localStorage.getItem('refreshToken'),
            })
        })

        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userInfo')

        this.openNewRoute('/login')
    }
}
