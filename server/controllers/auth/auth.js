const _ = require('lodash');
const { User } = require('../../models/user.model');

var registerUser = async (req, res) => {
  let body = _.pick(req.body, ['username', 'email', 'password', 'firstName', 'lastName']);
  body.status = 'inactive';
  let user = new User(body);

  try {
    await user.createUser();
    res.status(200).send({ code: 200, text: 'Success' });
  } catch (error) {
    if (error.code === 11000) {
      var field = error.errmsg.split("index: ")[1];
      field = field.split(" dup key")[0];
      field = field.substring(0, field.lastIndexOf("_"));
      res.status(400).send({
        code: 400,
        errCode: 11000,
        index: field
      });
    } else res.status(400).send(error);
  }
}

var login = (req, res) => {
  let body = _.pick(req.query, ['username', 'password']);
  User.findByCredentials(body.username, body.password).then((user) => {
    if (user.status === 'inactive') {
      res.status(400).send({ errCode: 2001, text: "confirm account" })
    } else if (user.status === 'delete') {
      res.status(400).send({ errCode: 40010 })
    } else {
      return user.generateAuthToken().then((token) => {
        console.log(user);
        
        res.status(200).header('x-auth', token).send(user.toJson());
      });
    }
  }).catch((error) => {
    res.status(400).send({ errCode: 40010 });
  });
}

var logout = (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
}, () => {
    res.status(400).send();
});
}

module.exports = {
  registerUser,
  login,
  logout
}