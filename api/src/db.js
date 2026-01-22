const admin = require('firebase-admin');

function initializaFirestore(){
    // verific daca firebase NU a mai fost initializat deja 
    // ma asigur ca firebase sa se initializez o singura data  
    if(admin.apps.length === 0){ 
        admin.initializeApp({
        credential: admin.credential.cert(require('./serviceAccount.json'))
        });
    }
    
    return admin.firestore(); 
}

const db = initializaFirestore(); 

module.exports = db; 