const mongoose = require('mongoose');

try {
     // Connection mongodb database
     mongoose.connect('mongodb://localhost:27017/test')
     .then(() => console.log('Mongodb Connected!'));

} catch (error) {
    
    console.log(`Database error =>`, error)
}