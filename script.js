document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    initParticles();
    
    // Set up file upload functionality
    setupFileUpload();
});

// Initialize particles background
function initParticles() {
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#ff6b9d"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#ff6b9d",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });
}

// Función global para mostrar mensajes de estado
function showStatus(message, type) {
    const uploadStatus = document.getElementById('upload-status');
    if (!uploadStatus) return;
    
    uploadStatus.textContent = message;
    uploadStatus.className = 'upload-status';
    
    if (type) {
        uploadStatus.classList.add(`${type}-message`);
    }
}

// Setup file upload functionality
function setupFileUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const uploadButton = document.getElementById('upload-button');
    const uploadPreview = document.getElementById('upload-preview');
    const previewContainer = document.getElementById('preview-container');
    
    let selectedFiles = [];
    
    // Click on upload area to select files
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    });
    
    // Handle file selection via input
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            handleFiles(fileInput.files);
        }
    });
    
    // Handle the selected files
function handleFiles(files) {
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB para imágenes
    const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB para videos
    
    let rejectedFiles = 0;
    
    // Add new files to the selected files array
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Verificar si es imagen o video
        if (file.type.startsWith('image/')) {
            // Verificar tamaño de la imagen
            if (file.size > MAX_IMAGE_SIZE) {
                showStatus(`La imagen "${file.name}" excede el límite de 5MB`, 'error');
                rejectedFiles++;
                continue;
            }
        } else if (file.type.startsWith('video/')) {
            // Verificar tamaño del video
            if (file.size > MAX_VIDEO_SIZE) {
                showStatus(`El video "${file.name}" excede el límite de 20MB`, 'error');
                rejectedFiles++;
                continue;
            }
        } else {
            // No es ni imagen ni video
            showStatus('Solo se permiten imágenes y videos', 'error');
            rejectedFiles++;
            continue;
        }
        
        selectedFiles.push(file);
        
        // Create preview item
        createPreviewItem(file);
    }
    
    // Mostrar mensaje si se rechazaron archivos
    if (rejectedFiles > 0) {
        showStatus(`Se rechazaron ${rejectedFiles} archivo(s) por exceder el tamaño permitido`, 'warning');
    }
    
    // Show the preview section if there are files
    if (selectedFiles.length > 0) {
        uploadPreview.style.display = 'block';
        uploadButton.disabled = false;
    } else {
        uploadPreview.style.display = 'none';
        uploadButton.disabled = true;
    }
}
    
   // Create a preview item for a file
function createPreviewItem(file) {
    const reader = new FileReader();
    const previewItem = document.createElement('div');
    previewItem.className = 'preview-item';
    previewItem.dataset.filename = file.name;
    
    // Mostrar indicador visual del tipo de archivo
    const typeIndicator = document.createElement('div');
    typeIndicator.className = 'file-type-indicator';
    
    reader.onload = function(e) {
        if (file.type.startsWith('image/')) {
            // Crear preview para imagen
            const img = document.createElement('img');
            img.src = e.target.result;
            previewItem.appendChild(img);
            
            // Indicador de tipo imagen
            typeIndicator.innerHTML = '<i class="fas fa-image"></i>';
        } 
        else if (file.type.startsWith('video/')) {
            // Crear preview para video
            const video = document.createElement('video');
            video.controls = true;
            video.muted = true;
            video.src = e.target.result;
            video.className = 'video-preview';
            
            // Miniatura estática para el video
            const videoThumb = document.createElement('div');
            videoThumb.className = 'video-thumbnail';
            videoThumb.innerHTML = '<i class="fas fa-play-circle"></i>';
            
            // Al hacer clic en la miniatura, mostrar el video
            videoThumb.addEventListener('click', function() {
                videoThumb.style.display = 'none';
                video.style.display = 'block';
                video.play();
            });
            
            previewItem.appendChild(videoThumb);
            previewItem.appendChild(video);
            
            // Indicador de tipo video
            typeIndicator.innerHTML = '<i class="fas fa-video"></i>';
        }
        
        // Mostrar tamaño del archivo
        const fileSize = document.createElement('div');
        fileSize.className = 'file-size';
        
        if (file.size < 1024 * 1024) {
            fileSize.textContent = `${(file.size / 1024).toFixed(1)} KB`;
        } else {
            fileSize.textContent = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
        }
        
        previewItem.appendChild(fileSize);
        previewItem.appendChild(typeIndicator);
        
        // Botón de eliminar
        const removeBtn = document.createElement('div');
        removeBtn.className = 'preview-remove';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            removeFile(file.name);
            previewItem.remove();
        });
        
        previewItem.appendChild(removeBtn);
        previewContainer.appendChild(previewItem);
    };
    
    if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
        reader.readAsDataURL(file);
    }
}
    
    // Remove a file from the selected files array
    function removeFile(filename) {
        selectedFiles = selectedFiles.filter(file => file.name !== filename);
        
        if (selectedFiles.length === 0) {
            uploadPreview.style.display = 'none';
            uploadButton.disabled = true;
        }
    }
    
    // Upload button click handler
    uploadButton.addEventListener('click', () => {
        if (selectedFiles.length === 0) return;
        
        // Disable button to prevent multiple uploads
        uploadButton.disabled = true;
        
        // Show loading status
        showStatus('Subiendo fotos...', 'loading');
        
        // Upload to Firebase Storage
        uploadToFirebaseStorage(selectedFiles, () => {
            // Esta función limpiará el array correctamente
            selectedFiles = [];
        });
    });
}

// Subir archivos a Firebase Storage
function uploadToFirebaseStorage(files, clearFilesCallback) {
    if (!files || files.length === 0) {
        showStatus('No hay archivos para subir', 'error');
        return;
    }
    
    let completedUploads = 0;
    let failedUploads = 0;
    
    // Mostrar progreso inicial
    showStatus(`Subiendo 0/${files.length} fotos...`, 'loading');
    
    // Procesar cada archivo
    files.forEach((file, index) => {
        // Crear un nombre único para el archivo
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}_${file.name}`;
        
        // Convertir el archivo a un Blob para la subida
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileBlob = new Blob([e.target.result], { type: file.type });
            
            // Crear metadata para el archivo
            const metadata = {
                contentType: file.type
            };
            
            // Referencia al archivo en Firebase Storage
            const fileRef = storageRef.child(fileName);
            
            // Subir el archivo con metadata
            const uploadTask = fileRef.put(fileBlob, metadata);
            
            // Monitorear el progreso de la subida
            uploadTask.on('state_changed', 
                // Progreso
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    showStatus(`Subiendo ${completedUploads}/${files.length} fotos... (${progress}% de la foto actual)`, 'loading');
                },
                // Error
                (error) => {
                    console.error('Error al subir archivo:', error);
                    failedUploads++;
                    checkAllUploadsComplete();
                },
                // Completado
                () => {
                    completedUploads++;
                    checkAllUploadsComplete();
                }
            );
        };
        
        reader.onerror = function() {
            console.error("Error al leer el archivo:", file.name);
            failedUploads++;
            checkAllUploadsComplete();
        };
        
        // Leer el archivo como ArrayBuffer
        reader.readAsArrayBuffer(file);
    });
    
    // Función para verificar si todas las subidas están completas
    function checkAllUploadsComplete() {
        if (completedUploads + failedUploads === files.length) {
            if (failedUploads === 0) {
                showStatus(`¡${completedUploads} foto(s) subidas con éxito!`, 'success');
                
                // Limpiar la previsualización
                clearPreview();
                
                // Llamar al callback para limpiar el array
                if (clearFilesCallback) clearFilesCallback();
            } else {
                showStatus(`Subidas ${completedUploads} foto(s), fallaron ${failedUploads}`, 'error');
            }
            
            // Reactivar el botón de subida
            document.getElementById('upload-button').disabled = false;
        }
    }
    
    // Función para limpiar la previsualización
    function clearPreview() {
        const previewContainer = document.getElementById('preview-container');
        const uploadPreview = document.getElementById('upload-preview');
        const fileInput = document.getElementById('file-input');
        
        previewContainer.innerHTML = '';
        uploadPreview.style.display = 'none';
        fileInput.value = '';
    }
}