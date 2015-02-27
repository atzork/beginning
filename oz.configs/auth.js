function AuthentificationMiddleware(app) {
  this.excludeUrls = [];
  this.config = app.get('config');
}
AuthentificationMiddleware.prototype.setExclude = function setExclude(excludeUrls) {
  if (excludeUrls) {
    this.excludeUrls = excludeUrls;
  }
};
AuthentificationMiddleware.prototype.action = function action() {
  var self = this;
  return function (req, res, next) {
    var resolveExclude = false;
    if (self.excludeUrls && (self.excludeUrls.indexOf(req.originalUrl) !== -1)) {
      resolveExclude = true;
    }

    if (!req.user && !resolveExclude) {
      console.error('Не авторизированный пользователь пришел на ', req.originalUrl);
      return req.xhr ?
        res
          .set(401)
          .send({
            success: false,
            data: null,
            error: {message: self.config.get('errorStatus:http-401')}
          })
        : res.redirect('/login');
    }
    return next();
  };
};

module.exports.Auth = AuthentificationMiddleware;
