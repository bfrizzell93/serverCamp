const express = require("express");

const Campsite = require('../models/campsite')
const campsiteRouter = express.Router();

campsiteRouter
  .route("/")
  
  .get((req, res, next) => {
    Campsite.find()
    .then( campsites => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json')
      res.json(campsites)
    })
    //res.end("Will send all the campsites to you");    no longer needed after json data sent to client
    .catch(err => next(err)) //pass err to error handler in express app
  })
  .post((req, res, next) => {
    Campsite.create(req.body) //express will automatically convert req data to json 
    .then(campsite => {
      console.log("Campsite Created ", campsite);
      res.statusCode = 200;
      res.setHeader('Content-type', 'application/json')
      res.json(campsite)
    })
    .catch(err => next(err))
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /campsites");
  })
  .delete((req, res, next) => {
    Campsite.deleteMany()
    .then(response => {
      res.statusCode = 200;
      res.setHeader('Content-type', 'application/json')
      res.json(response)
    })
    .catch(err => next(err))
  });

campsiteRouter
  .route("/:campsiteId")


  .get((req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .then(campsite => {
      res.statusCode = 200;
      res.setHeader('Content-type', 'application/json')
      res.json(campsite)
    })
    .catch(err => next(err))
  })

  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /campsites/${req.params.campsiteId}`
    );
  })

  .put((req, res, next) => {
    Campsite.findByIdAndUpdate(req.params.campsiteId, {
      $set: req.body
    }, {new: true})
    .then(campsite => {
      res.statusCode = 200;
      res.setHeader('Content-type', 'application/json')
      res.json(campsite)
    })
    .catch(err => next(err))
  })

  .delete((req, res, next) => {
    Campsite.findByIdAndDelete(req.params.campsiteId)
    .then(response => {
      res.statusCode = 200;
      res.setHeader('Content-type', 'application/json')
      res.json(response)
    })
  });

module.exports = campsiteRouter;
