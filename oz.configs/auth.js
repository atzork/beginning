/**
 * Created by sergey on 2/26/15.
 */

module.exports = function Auth(excludeUrl) {
  var config = require('../oz.configs/env');
  var resolveExclude = false;
  excludeUrl = excludeUrl || [];

  return function(req, res, next) {
    if (excludeUrl && (excludeUrl.indexOf(req.originalUrl) !== -1)) {
      resolveExclude = true;
    }

    if (!req.user && !resolveExclude) {
      console.error('Не авторизированный пользователь пришел');
      return req.xhr
        ? res.set(401).send({
            success: false,
            data: null,
            error: {typeError: 'http-401', message: config.get('errorStatus:http-401')}
          })
        : res.redirect('/login');
    }
    return next();
  };
};
