import {h} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'

const html = htm.bind(h);

/**
 * Components for forms
 */
export default class Form {
    static Input = (props, state, context) => {
        let params = this.getParams(props.params)

        let type = props.type
        if (!type) {
            type = 'text'
        }

        let changehandler = props.change
        if (type == 'file') {
            changehandler = (e) => props.change(e)
        }

        let focusouthandler = props.focusout

        return html`
            <input type=${type} class="form-control" id=${"input-" + props.name} name=${props.name} value=${props.value} onInput=${changehandler} onFocusOut=${focusouthandler} ...${params} />
        `
    }

    static Textarea = (props, state, context) => {
        let params = this.getParams(props.params)

        let rows = props.rows
        if (!rows) {
            rows = 5
        }

        return html`
            <textarea class="form-control" id=${"input-" + props.name} name=${props.name} rows=${rows}
                      value=${props.value} onInput=${props.change} ...${params}/>
        `
    }

    static Select = (props, state, context) => {
        let params = this.getParams(props.params)
        return html`
            <select name=${props.name} id=${"input-" + props.name} value=${props.value}
                    onInput=${props.change}
                    class=${props.size == 'lg' ? 'form-control form-control-lg' : 'form-control'} ...${params}>
                ${Object.entries(props.options).map(([k, v]) => html`
                    <option value=${k}>${v}</option>
                `)}
            </select>
        `
    }

    static Label = (props, state, context) => {
        return html`
            <label for=${"input-" + props.name} class="form-label">${props.label}</label>
        `
    }

    static InputWithLabel = (props, state, context) => {
        return html`
            <${this.Label} ...${props}/>
            <${this.Input} ...${props}/>
        `
    }

    static TextareaWithLabel = (props, state, context) => {
        return html`
            <${this.Label} ...${props}/>
            <${this.Textarea} ...${props}/>
        `
    }

    static SelectWithLabel = (props, state, context) => {
        return html`
            <${this.Label} ...${props}/>
            <${this.Select} ...${props}/>
        `
    }

    static getParams = (input) => {
        let params = {}
        if (typeof input == 'string') {
            params = JSON.parse(input)
        }
        if (typeof input == 'object') {
            params = input
        }
        return params
    }

    static convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result)
            }
            fileReader.onerror = (error) => {
                reject(error)
            }
        })
    }

    static Checkbox = (props, state, context) => {
        let id = props.name + "_" + props.value
        return html`
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value=${props.value} id=${id}
                       name=${props.name}
                       onClick=${props.change} checked=${props.checked} ...${props}/>
                <label class="form-check-label" for=${id}>
                    ${props.label}
                    ${props.children}
                </label>
            </div>
        `
    }

}