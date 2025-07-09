import {Dashboard} from "./components/dashboard";
import {Login} from "./components/login";
import {SignUp} from "./components/sign-up";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title')
        this.contentPageElement = document.getElementById('content')
        this.adminLteStyleElement = document.getElementById('adminlte_style')

        this.init_events()
        this.routes = [
            {
                route: '/',
                title: 'Дашборд',
                filePathTemplate: '/templates/dashboard.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Dashboard()
                },
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/404.html',
                useLayout: false,
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('login-page')
                    document.body.style.height = '100vh'
                    new Login()
                },
                styles: ['icheck-bootstrap.min.css'],
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/sign-up.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('register-page')
                    document.body.style.height = '100vh'
                    new SignUp()
                },
                styles: ['icheck-bootstrap.min.css'],
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
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    const link = document.createElement('link')
                    link.rel = 'stylesheet'
                    link.href = '/css/' + style
                    document.head.insertBefore(link, this.adminLteStyleElement)
                })
            }

            this.titlePageElement.innerText = newRoute.title ? `${newRoute.title} | Freelance Studio` : 'Freelance Studio'

            if (newRoute.filePathTemplate) {
                document.body.className = ''
                let contentBlock = this.contentPageElement
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text())
                    contentBlock = document.getElementById('content-layout')
                    document.body.classList.add('sidebar-mini')
                    document.body.classList.add('layout-fixed')
                } else {
                    document.body.classList.remove('sidebar-mini')
                    document.body.classList.remove('layout-fixed')
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text())
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
