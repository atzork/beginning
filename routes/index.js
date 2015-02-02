/**
 * Created by sergey on 2/2/15.
 */
var express = require('express');
var router = express.Router();

router.get('/login',function(req,res){
  res.render('login');
});

router.get('/',function(req,res){
  //if(req.session.)
  res.render('index');
});

module.exports = router;