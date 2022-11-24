const mongoose = require('mongoose')
const Schema = mongoose.Schema


const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    campsites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campsite'
    }]

    //the square brackets will allow us to store the campsites ids as an array
})

module.exports = mongoose.model('Favorite', favoriteSchema);