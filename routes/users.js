var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  if (req.session.loginedname) {
    res.send({
      code: 1,
      message: "logined",
      loginedname: req.session.loginedname
    });
  }
});

module.exports = router;
