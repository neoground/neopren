import {Component, createRef, h} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import Cropper from '../../node_modules/cropperjs/dist/cropper.esm.js'
import Compressor from '../../node_modules/compressorjs/dist/compressor.esm.js'
import Format from "../App/Format.js"

const html = htm.bind(h)

/**
 * A file upload component
 *
 * Upload a single or multiple files. Crop, rotate, compress images.
 *
 * To get the files data, simply create a reference and call this.fileUploadRef.getFilesData().
 *
 * The main component was created by GPT-4o in 15-20 tries. But code is understandable,
 * only a bit of black magic. This was extended, and so we got here in just a few hours.
 */
export default class FileUpload extends Component {
    constructor() {
        super();
        this.state = {
            files: [],
            cropping: false,
            currentFileIndex: null,
            croppedDataUrl: null,
            isDragging: false
        };
        this.dropzoneRef = createRef();
        this.fileInputRef = createRef();
        this.cropperImageRef = createRef();
        this.cropper = null;
    }

    handleDragEnter = (event) => {
        event.preventDefault();
        this.setState({ isDragging: true });
    };

    handleDragLeave = (event) => {
        event.preventDefault();
        this.setState({ isDragging: false });
    };

    handleDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        this.processFiles(files);
    };

    handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        this.processFiles(files);
    };

    openFileDialog = () => {
        if (this.fileInputRef.current) {
            this.fileInputRef.current.click();
        }
    };

    processFiles = (files) => {
        if (!this.props.multiple) {
            files = files.slice(0, 1);
        }
        this.setState({ files: [...this.state.files, ...files], isDragging: false }, () => {
            if (this.state.files.length === 1 && files[0].type.startsWith('image/') && this.props.enableCropping) {
                this.startCropping(0);
            }
        });
    };

    startCropping = (index) => {
        const file = this.state.files[index];
        const reader = new FileReader();
        reader.onload = (event) => {
            this.setState({
                currentFileIndex: index,
                cropping: true,
                croppedDataUrl: event.target.result
            }, this.initializeCropper);
        };
        reader.readAsDataURL(file);
    };

    initializeCropper = () => {
        const aspectRatio = this.props.aspectRatio ? this.parseAspectRatio(this.props.aspectRatio) : NaN;
        const image = this.cropperImageRef.current;
        this.cropper = new Cropper(image, {
            aspectRatio,
            viewMode: 1,
            rotatable: true,
            background: true,
            modal: true,
            autoCropArea: 1,
            responsive: true,
            guides: true,
        });
    };

    parseAspectRatio = (ratio) => {
        const [width, height] = ratio.split(':').map(Number);
        return width / height;
    };

    applyCrop = () => {
        const canvas = this.cropper.getCroppedCanvas();
        canvas.toBlob((blob) => {
            let currentFileIndex = this.state.currentFileIndex
            let originalFile = this.state.files[currentFileIndex];
            const croppedFile = new File([blob], originalFile.name, { type: originalFile.type });
            this.compressAndAddFile(croppedFile, currentFileIndex);
        });
    };


    compressAndAddFile = (file, index) => {
        new Compressor(file, {
            quality: 0.8,
            maxWidth: this.props.maxWidth || Infinity,
            maxHeight: this.props.maxHeight || Infinity,
            success: (compressedFile) => {
                const files = [...this.state.files];
                files[index] = compressedFile;

                this.cropper.destroy();
                this.setState({ files: files, cropping: false, croppedDataUrl: null, currentFileIndex: null });
            }
        });
    };

    removeFile = (index) => {
        const files = this.state.files.filter((_, i) => i !== index);
        this.setState({files});
    };

    // Convert file to base64 string
    fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    // Get all files' details
    getFilesData = async () => {
        return await Promise.all(this.state.files.map(async (file) => {
            const base64 = await this.fileToBase64(file);
            return {
                filename: file.name,
                extension: file.name.split('.').pop().toLowerCase(),
                size: file.size,
                type: file.type,
                last_modified: new Date(file.lastModified).toISOString(),
                base64
            };
        }));
    };

    render(props, state, context) {
        let thumbnail_size = 50
        if(!this.props.multiple) {
            thumbnail_size = 100
        }

        return html`
            <div>
                ${(this.props.multiple || (!this.props.multiple && this.state.files.length < 1)) && html`
                    <div class="dropzone border border-2 rounded p-4 mb-3 d-flex flex-column justify-content-center align-items-center position-relative"
                         ref=${this.dropzoneRef}
                         onDrop=${this.handleDrop}
                         onDragEnter=${this.handleDragEnter}
                         onDragOver=${(e) => e.preventDefault()}
                         onDragLeave=${this.handleDragLeave}
                         style=${this.state.isDragging ? 'background: rgba(255, 255, 255, 0.2)' : ''}>
                        <input type="file"
                               multiple=${this.props.multiple}
                               accept=${this.props.accept}
                               onChange=${this.handleFileSelect}
                               ref=${this.fileInputRef}
                               class="form-control d-none" />
                        <div class="mb-2">
                            ${this.props.multiple ? html`Drag and drop files here` : html`Drag and drop file here`}
                        </div>
                        <div>
                            <button type="button" class="btn btn-primary btn-icon" onClick=${this.openFileDialog}>
                                <span class="material-symbols-outlined me-2">upload</span>
                                ${this.props.multiple ? html`Select Files` : html`Select File`}
                            </button>
                        </div>
                    </div>
                `}
                <div class="list-group">
                    ${this.state.files.map((file, index) => html`
                        <div class="list-group-item d-flex align-items-center justify-content-between">
                            <div class="me-2 d-flex align-items-center">
                                ${file.type.startsWith('image/') ? html`
                                    <img src=${URL.createObjectURL(file)} alt="Thumbnail" class="me-3 rounded" 
                                         style=${"width: " + thumbnail_size + "px; height: " + thumbnail_size + "px; object-fit: cover;"} />
                                ` : html`
                                    <span class="material-symbols-outlined me-4" style="font-size: 2.75rem">
                                        ${this.getSymbolForFileType(file.type)}
                                    </span>
                                `}

                                <div>
                                ${file.name}<br /><span class="text-muted">${Format.Bytes(file.size)}</span>
                                </div>
                            </div>
                            
                            <div class="btn-group">
                                ${file.type.startsWith('image/') && this.props.enableCropping && !this.state.cropping && html`
                                    <button class="btn btn-icon btn-primary" title="Edit and Crop Image" 
                                            onClick=${() => this.startCropping(index)}>
                                        <span class="material-symbols-outlined text-white">tune</span>
                                    </button>
                                `}

                                <button class="btn btn-icon btn-danger" title="Remove" 
                                        onClick=${() => this.removeFile(index)}>
                                    <span class="material-symbols-outlined text-white">delete</span>
                                </button>
                            </div>
                        </div>
                    `)}
                </div>
                ${this.state.cropping && html`
                    <div class="position-fixed top-50 start-50 translate-middle card card-body shadow-lg p-3" style="z-index: 1050;">
                        <img ref=${this.cropperImageRef} src=${this.state.croppedDataUrl} alt="Cropping Image" class="w-100" />
                        
                        <div class="d-flex align-items-center justify-content-between mt-3">
                            <div>
                                <div class="btn-group me-3">
                                    <button class="btn btn-icon btn-secondary" title="Zoom Out"
                                            onClick=${(e) => { e.preventDefault(); this.cropper.zoom(-0.1) }}>
                                        <span class="material-symbols-outlined">zoom_out</span>
                                    </button>
                                    <button class="btn btn-icon btn-secondary" title="Zoom In"
                                            onClick=${(e) => { e.preventDefault(); this.cropper.zoom(0.1) }}>
                                        <span class="material-symbols-outlined">zoom_in</span>
                                    </button>
                                </div>
                                <div class="btn-group me-3">
                                    <button class="btn btn-icon btn-secondary" title="Rotate 90° counterclockwise"
                                            onClick=${(e) => { e.preventDefault(); this.cropper.rotate(-90) }}>
                                        <span class="material-symbols-outlined">rotate_left</span>
                                    </button>
                                    <button class="btn btn-icon btn-secondary" title="Rotate 90° clockwise"
                                            onClick=${(e) => { e.preventDefault(); this.cropper.rotate(90) }}>
                                        <span class="material-symbols-outlined">rotate_right</span>
                                    </button>
                                    <button class="btn btn-icon btn-secondary" title="Mirror horizontally"
                                            onClick=${(e) => { e.preventDefault(); if(this.cropper.getImageData().scaleX == 1) { this.cropper.scaleX(-1) } else { this.cropper.scaleX(1) }  }}>
                                        <span class="material-symbols-outlined">swap_horiz</span>
                                    </button>
                                    <button class="btn btn-icon btn-secondary" title="Mirror vertically"
                                            onClick=${(e) => { e.preventDefault(); if(this.cropper.getImageData().scaleY == 1) { this.cropper.scaleY(-1) } else { this.cropper.scaleY(1) } }}>
                                        <span class="material-symbols-outlined">swap_vert</span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <button class="btn btn-primary btn-icon ms-auto" 
                                        onClick=${(e) => {e.preventDefault(); e.currentTarget.disabled = true; this.applyCrop()}}>
                                    <span class="material-symbols-outlined me-2">save</span>
                                    Apply Changes</button>
                            </div>
                        </div>
                        
                        
                    </div>
                `}
            </div>
        `;
    }

    getSymbolForFileType(fileType) {
        const fileTypeMapping = {
            'application/pdf': 'picture_as_pdf',
            'text/plain': 'description',
            'application/zip': 'folder_zip',
            'application/msword': 'description',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'description',
            'application/vnd.ms-excel': 'table_chart',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'table_chart',
            'application/vnd.ms-powerpoint': 'slideshow',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'slideshow',
            'text/csv': 'grid_on',
            'video/*': 'movie', // wildcard for all video types
            'audio/*': 'music_note', // wildcard for all audio types
            'image/*': 'image', // wildcard for all image types
            'text/*': 'description' // wildcard for all text types
        };

        // Check for exact match first
        if (fileTypeMapping[fileType]) {
            return fileTypeMapping[fileType];
        }

        // Check for wildcard match
        const [type] = fileType.split('/');
        const wildcardType = `${type}/*`;
        if (fileTypeMapping[wildcardType]) {
            return fileTypeMapping[wildcardType];
        }

        // Default icon if no match is found
        return 'draft';
    }
}
