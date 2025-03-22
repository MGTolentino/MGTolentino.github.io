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

// Setup file upload functionality
function setupFileUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const uploadButton = document.getElementById('upload-button');
    const uploadPreview = document.getElementById('upload-preview');
    const previewContainer = document.getElementById('preview-container');
    const uploadStatus = document.getElementById('upload-status');
    
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
        
        // Show loading status
        showStatus('Subiendo fotos...', 'loading');
        
        // Here we'll replace this with the actual Google Drive upload later
        // For now, just simulate an upload with a timeout
        setTimeout(() => {
            showStatus('¡Fotos subidas con éxito!', 'success');
            
            // Clear selected files and preview
            selectedFiles = [];
            previewContainer.innerHTML = '';
            uploadPreview.style.display = 'none';
            uploadButton.disabled = true;
            fileInput.value = '';
        }, 2000);
    });
    
    // Show status message
    function showStatus(message, type) {
        uploadStatus.textContent = message;
        uploadStatus.className = 'upload-status';
        
        if (type) {
            uploadStatus.classList.add(`${type}-message`);
        }
    }
}

// This function will be implemented later to handle the Google Drive upload
function uploadToGoogleDrive(files) {
    // We'll implement this in the next step
    console.log('Ready to upload files to Google Drive:', files);
}