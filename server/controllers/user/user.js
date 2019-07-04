const _ = require('lodash');
const { User } = require('../../models/user.model');

var userById = async (req, res) => {
  let params = _.pick(req.params, ['id']);

  try {
    let user = await User.findUserById(params.id);
    res.send(user);
  } catch (error) {
    console.log('ERROR', error);
    res.status(400).send({errCode: 400, text: 'User not found'});
  }
}

var me = (req, res) => {
  let user = _.pick(req.user, ['username', 'email', 'firstName', 'lastName', 'status', '_id'])
  if (user) {
    res.status(200).send(user);
  } else {
    res.status(401);
  }
}

var updateUserInfo = async (req, res) => {
  let params = _.pick(req.params, ['id']);
  let info = _.pick(req.body, ['username', 'email', 'lastName', 'firstName']);
  if (params, info) {
    User.updateInfo(params.id, info)
    .then((user) => {
      if (user) {
        let r = _.pick(user, ['username', 'email', 'lastName', 'firstName', 'status'])
        res.status(200).send(r);
      }
    }).catch((error) => {
      console.log('err ====', error)
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
    })
  }
}
var updateUserPassword = (req, res) => {
  let user = req.user;
  let params = _.pick(req.params, ['id']);
  let body = _.pick(req.body, ['oldPassword', 'password']);
  if (user && `${user['_id']}` === params.id) {
    User.updatePassword(user['_id'], user.password, body)
    .then((user) => {
      res.status(200).send(user);
    }).catch((err) => {
      res.status(400).send(err);
    })
  }
}

module.exports = {
  updateUserInfo,
  updateUserPassword,
  me,
  userById
};