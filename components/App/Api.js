import {Component, h, render} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'

const html = htm.bind(h)

/**
 * API access
 */
export default class Api {

    static request = (method, url, body) => {
        method = method.toUpperCase()
        url = this.buildUrl(url)

        console.debug('API ' + method + ': ' + url)

        // Make body a JSON string if set
        if(typeof body === 'object' || Array.isArray(body)) {
            body = JSON.stringify(body)
        }

        let config = {
            method: method,
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
        }

        if(body) {
            config.body = body
        }

        return fetch(url, config).then(response => response.json())
    }
    static get = (url) => {
        return this.request('GET', url)
    }

    static post = (url, body) => {
        return this.request('POST', url, body)
    }

    static put = (url, body) => {
        return this.request('PUT', url, body)
    }

    static delete = (url) => {
        return this.request('DELETE', url)
    }

    static buildUrl = (url) => {
        if(url.includes('://')) {
            // Full URL already provided
            return url
        }

        // Remove trailing slashes
        url = url.replace(/^\/|\/$/g, '')

        return window.neopren.baseUrl + '/' + url
    }
}