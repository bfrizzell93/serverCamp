const express = require('express')
const cors = require('./cors')
const authenticate = require('../authenticate')
const Favorite = require('../models/favorite')
const favorite = require('../models/favorite')

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({user: req.user._id})
    .populate('user')
    .populate('campsites') //potential problem with the populate methods
    .then((favorites)=> {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json')
        res.json(favorites)
    })
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=> {
    Favorite.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite){
        if (!favorite.campsites.includes(favorite._id)){
            favorite.campsites.push(favorite._id)
 ////////////////////////////POTENTIAL PROBLEM WITH MY POST///////////////////           
        }
            favorite.save()
           .then((favorite) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
            console.log(favorite.campsites)
          })
          .catch((err) => next(err))
        } else {
            Favorite.create({user:req.user._id, campsites: req.body})
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
            })
            .catch(err => next(err))
        }
    })
    .catch(err=> next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end(
      `PUT operation not supported on /favorites`
    );
  })
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
    Favorite.findOneAndDelete({user: req.user._id })
    .then(favorite => {
        if (favorite) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
        } else {
            res.setHeader('Content-Type', 'text/plain')
            res.end('There are no favorites to delete')
        }
    })
    .catch(err => next(err))
})

favoriteRouter
.route('/:campsiteId')
.get(cors.cors, authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end(
      `GET operation not supported on /favorites/${req.params.campsiteId}`
    );
  })
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if(favorite) {
            if(!favorite.campsites.includes(req.params.campsiteId)){
                favorite.campsites.push(req.params.campsiteId)
                //checking if id in url is already in favorites array
                favorite.save()
                .then(favorite => {
                    console.log('Favorite added', favorite)
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                })
                .catch((err)=> next(err))     
            } else {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/plain");
                    res.end('That campsite is already in the list of favorites!');
            }
            
        } else {
            Favorite.create({
                user: req.user._id,
                campsites: req.params.campsiteId
            })
            .then(favorite=> {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
            })
            .catch(err=> next(err))
        }
    })
    .catch((err)=> next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res)=> {
    res.statusCode = 403;
    res.end(
      `PUT operation not supported on /favorites/${req.params.campsiteId}`
    );
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res, next)=> {
    Favorite.findOne({user: req.user._id})
    .then(favorite=>{
        if (favorite){
            if(favorite.campsites.includes(req.params.campsiteId)){
////////////////FIND A WAY TO FILTER OR SPLICE ///////////////////////////////////////////////////             
                .then(favorite => {
                    console.log('Favorite Removed', favorite)
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                })
                .catch(err=>next(err))
            } else{
                res.setHeader('Content-Type', 'text/plain')
                res.end('This campsite is not in your favorites')
            }
        } else {
            res.setHeader('Content-Type', 'text/plain')
            res.end('You do not have any favorites to delete')
        }
    })
    .catch(err=> next(err))
})













module.exports = favoriteRouter;