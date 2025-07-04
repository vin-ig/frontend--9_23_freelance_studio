import {Dashboard} from "./components/dashboard";
import {Login} from "./components/login";
import {SignUp} from "./components/sign-up";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title')
        this.contentPageElement = document.getElementById('content')

        this.init_events()
        this.routes = [
            {
                route: '/',
                title: 'Дашборд',
                filePathTemplate: '/templates/dashboard.html',
                load: () => {
                    new Dashboard()
                },
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/404.html',
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                load: () => {
                    new Login()
                },
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/sign-up.html',
                load: () => {
                    new SignUp()
                },
            },
        ]
    }

    init_events() {
        window.addEventListener('DOMContentLoaded', this.activate_route.bind(this))
        window.addEventListener('popstate', this.activate_route.bind(this))
    }

    async activate_route() {
        const urlRoute = window.location.pathname
        const newRoute = this.routes.find(item => item.route === urlRoute)
        if (newRoute) {
            this.titlePageElement.innerText = newRoute.title ? `${newRoute.title} | Freelance Studio` : 'Freelance Studio'
            if (newRoute.filePathTemplate) {
                this.contentPageElement.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text())
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load()
        }
        } else {
            console.log('No route found')
            window.location = '/404'
        }
    }
}
