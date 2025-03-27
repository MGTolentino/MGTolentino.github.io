// Configuración de tu proyecto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAhDO33NidZrb56OTrObx7Lj2xupjDkdfM",
    authDomain: "xv-caro-3532a.firebaseapp.com",
    projectId: "xv-caro-3532a",
    storageBucket: "xv-caro-3532a.appspot.com",
    messagingSenderId: "64636102051",
    appId: "1:64636102051:web:0fb6016c8d50309b4a2616"
  };
  
  console.log('Antes de inicializar Firebase');

  // Inicializar Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Crear referencia al servicio de Storage
  const storage = firebase.storage();
  
  // Referencia a la carpeta donde se guardarán las fotos
  const storageRef = storage.ref('xv-caro-fotos');
  
  console.log('Firebase inicializado correctamente');
  console.log('Storage disponible:', !!firebase.storage);

  console.log('Bucket de almacenamiento:', firebaseConfig.storageBucket);

