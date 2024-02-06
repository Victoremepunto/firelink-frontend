
// src/setupProxy.js
module.exports = function (app) {
    app.use((req, res, next) => {
      // Set the 'gap-auth' header in the response for all routes
      res.setHeader('gap-auth', 'addrew@localhost');
  
      // Continue to the next middleware
      next();
    });
  };
  