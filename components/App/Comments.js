import {Component, h} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import Form from "./Form.js"
import Api from "./Api.js"
import Format from "./Format.js"
import Modal from "./Modal.js"
import DynamicComponent from "./DynamicComponent.js"

const html = htm.bind(h)

/**
 * Comments area component
 *
 * Usage:
 *
 * <${Comments} class="App\\Models\\Rocket" entity=${el.id} comments=${el.comments} />
 *
 * Comments must be an array of available comments in order. Use Comment::getFor(...) for this.
 * The array might be changed internally on save / delete, everything is reset if comments prop changes.
 *
 * Props:
 *
 * - class (the class name of the object that's commented)
 * - entity (the element id that's commented)
 * - comments (the comments object)
 * - notitle (optional, set this to hide the title with comment count)
 */
export default class Comments extends Component {
    state = {
        comment: '',
        comments: []
    }

    componentDidMount() {
        if (this.props.comments) {
            this.setState({
                ...this.state,
                comments: this.props.comments
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (JSON.stringify(prevProps.comments) != JSON.stringify(this.props.comments) && this.props.comments) {
            // Comments prop changed -> update
            this.setState({
                ...this.state,
                comment: '',
                comments: this.props.comments
            })
        }
    }

    onInput = ev => {
        this.setState({...this.state, [ev.target.name]: ev.target.value})
    }

    saveComment = ev => {
        if (this.state.comment.length > 1) {
            ev.preventDefault()
            Api.post('/api/comment', {
                comment: this.state.comment,
                class: this.props.class,
                entity: this.props.entity
            }).then(data => {
                if (data && data.status && data.status == 'ok') {
                    // Success
                    this.setState({
                        ...this.state,
                        comments: data.comments,
                        comment: ''
                    })
                }
            })
        }
    }

    deleteComment = ev => {
        ev.preventDefault()
        let id = ev.currentTarget.dataset.id
        if (id) {
            Modal.ShowConfirmationModal({
                title: 'Delete comment',
                description: 'Do you really want to delete this comment?',
                confirmText: '<span class="material-symbols-outlined icon-1-5x me-2">delete_forever</span> Delete',
                cancelText: 'Cancel',
                style: 'danger',
                onConfirm: (ev) => {
                    ev.preventDefault()
                    DynamicComponent.hideModal(ev.currentTarget.dataset.modalid)

                    Api.delete('/api/comment/' + id)
                        .then(data => {
                            if (data && data.status && data.status == 'ok') {
                                // Success
                                this.setState({
                                    ...this.state,
                                    comments: data.comments
                                })
                            } else {
                                // Error
                            }
                        })
                }
            })
        }
    }

    Comment = (props, state, context) => {
        let comment = props.comment
        return html`
            <div class="card card-body">
                <div class="d-flex flex-row">
                    <div>
                        <img src=${comment.user.profile_pic} alt="Avatar" class="rounded-circle"
                             style="max-height: 5rem; width: auto"/>
                    </div>
                    <div class="ms-3 flex-grow-1">
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <h5 class="h5" title=${Format.DateLong(comment.created_at)}>
                                    ${comment.user.display_name} • ${Format.DateForHumans(comment.created_at)},
                                    ${Format.Time(comment.created_at)}</h5>
                            </div>
                            <div>
                                ${comment.user.id == window.neopren.user.id && html`
                                    <a href="#" onClick=${this.deleteComment} data-id=${comment.id} title="Delete">
                                        <span class="material-symbols-outlined text-muted icon-1-25x">delete</span>
                                    </a>
                                `}
                            </div>
                        </div>
                        <p innerHTML=${Format.nl2br(comment.comment)}></p>
                    </div>
                </div>
            </div>
        `
    }

    render(props, state, context) {
        return html`
            <div class="row text-start">
                ${!Boolean(props.notitle) && html`
                    <div class="col-12 mb-2">
                        <h3 class="h3">
                            ${this.state.comments.length < 1 && html`No Comments`}
                            ${this.state.comments.length == 1 && html`1 Comment`}
                            ${this.state.comments.length > 1 && html`${this.state.comments.length} Comments`}
                        </h3>
                    </div>
                `}
                <div class="col-12 mb-3">
                    <div>
                        <${Form.Textarea} name="comment" value=${this.state.comment} change=${this.onInput}/>
                    </div>
                    <div class="d-flex mt-3">
                        <button type="button" class="btn btn-primary btn-icon ms-auto" onClick=${this.saveComment}>
                            <span class="material-symbols-outlined me-2">add_comment</span> Add Comment
                        </button>
                    </div>

                </div>
                ${this.state.comments && this.state.comments.length > 0 && Object.entries(this.state.comments).map(([k, v]) => html`
                    <div class="col-12 mb-2">
                        <${this.Comment} comment=${v}/>
                    </div>
                `)}
            </div>
        `
    }

}
