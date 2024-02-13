import {Component, h, render} from './node_modules/preact/dist/preact.module.js'
import htm from './node_modules/htm/dist/htm.module.js'
import Aside from './js/components/App/Aside.js'
import Toolbar from './js/components/App/Toolbar.js'

const html = htm.bind(h)

// Global neopren UI handling module

// Neopren menu toggle
window.neoprenMenuToggle = function(event) {
    event.preventDefault()
    let aside = document.getElementById('neopren-aside')
    if(aside.classList.contains('hidden')) {
        // Hidden -> show
        aside.classList.remove('hidden')
        document.body.classList.remove('sidebar-is-hidden')
        document.body.classList.add('sidebar-is-visible')
        localStorage.setItem('aside_status', 'show')
    } else {
        // Show -> hide
        aside.classList.add('hidden')
        document.body.classList.remove('sidebar-is-visible')
        document.body.classList.add('sidebar-is-hidden')
        localStorage.setItem('aside_status', 'hidden')
    }
}

document.querySelectorAll('.neopren-menu-toggle').forEach(function(element) {
    element.addEventListener("click", window.neoprenMenuToggle)
})

// Aside
let aside_render_element = document.getElementById('neopren-aside')
if(aside_render_element !== null) {
    render(html`<${Aside} />`, aside_render_element)
}

// Toolbar
let toolbar_render_element = document.getElementById('neopren-toolbar')
if(toolbar_render_element !== null) {
    render(html`<${Toolbar} contentNav=${toolbar_render_element.dataset.contentnav} />`, toolbar_render_element)
}

// Content nav
window.neoprenContentMenuToggle = function(event) {
    if(event) {
        event.preventDefault()
    }
    let aside = document.getElementById('neopren-content-nav')
    let content_section = document.getElementById('neopren-content-section')

    let hiddenclass = 'hidden-content-nav'
    if(aside.classList.contains('content-nav-small')) {
        hiddenclass = 'hidden-content-nav-small'
    }

    if(aside.classList.contains('hidden')) {
        // Hidden -> show
        aside.classList.remove('hidden')
        content_section.classList.remove(hiddenclass)
    } else {
        // Show -> hide
        aside.classList.add('hidden')
        content_section.classList.add(hiddenclass)
    }
}
