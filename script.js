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
        // Add new files to the selected files array
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Only accept images
            if (!file.type.startsWith('image/')) {
                showStatus('Solo se permiten imágenes', 'error');
                continue;
            }
            
            selectedFiles.push(file);
            
            // Create preview item
            createPreviewItem(file);
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
        
        reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.dataset.filename = file.name;
            
            const img = document.createElement('img');
            img.src = e.target.result;
            
            const removeBtn = document.createElement('div');
            removeBtn.className = 'preview-remove';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                removeFile(file.name);
                previewItem.remove();
            });
            
            previewItem.appendChild(img);
            previewItem.appendChild(removeBtn);
            previewContainer.appendChild(previewItem);
        };
        
        reader.readAsDataURL(file);
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
        
        // Upload to Google Drive
        uploadToGoogleDrive(selectedFiles);
    });
}

// Upload files to Google Drive via Apps Script
function uploadToGoogleDrive(files) {
    // URL del Google Apps Script
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzDiNg7fR32PWd8Ckh2TJ76ZJwHj3M88SXDCWEb0mNdgOepMoru61SYXFFNF9dH7wU_Xg/exec';
    
    // Preparar los archivos para el envío
    const filePromises = files.map(file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                resolve({
                    filename: file.name,
                    mimeType: file.type,
                    data: e.target.result,
                    bytes: file.size
                });
            };
            
            reader.onerror = function() {
                reject(new Error('Error al leer el archivo ' + file.name));
            };
            
            reader.readAsDataURL(file);
        });
    });
    
    // Procesar todos los archivos y enviarlos
    Promise.all(filePromises)
        .then(fileDataArray => {
            // Preparar los datos para enviar al servidor
            const payload = {
                files: fileDataArray
            };
            
            // Enviar al servidor de Google Apps Script usando fetch con mode: 'no-cors'
            return fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'no-cors' // Importante para evitar errores CORS
            })
            .then(() => {
                // Con mode:'no-cors' no podemos leer la respuesta, así que asumimos éxito
                showStatus('¡Fotos subidas con éxito!', 'success');
                
                // Limpiar selección
                const previewContainer = document.getElementById('preview-container');
                const uploadPreview = document.getElementById('upload-preview');
                const uploadButton = document.getElementById('upload-button');
                const fileInput = document.getElementById('file-input');
                
                // Reset all elements
                previewContainer.innerHTML = '';
                uploadPreview.style.display = 'none';
                fileInput.value = '';
                
                // Re-enable upload button
                uploadButton.disabled = false;
                
                // AÑADIR ESTA LÍNEA para vaciar el array de archivos seleccionados
                selectedFiles = [];
                
                return { success: true };
            });
        })
        .catch(error => {
            console.error('Error al subir fotos:', error);
            showStatus('Error: ' + error.message, 'error');
            
            // Re-enable upload button in case of error
            document.getElementById('upload-button').disabled = false;
        });
}