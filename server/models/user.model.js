const _ = require('lodash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  status: {
    type: String
  },
  password: {
    type: String,
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJson = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email', 'firstName', 'lastName', 'status', 'username']);
};

UserSchema.methods.createUser = function () {
  let user = this;

  if (user && user._id) {
    let access = 'confirm';
    let token = jwt.sign({ _id: user._id.toHexString(), username: user.username }, process.env.JWT_SECRET).toString();

    user.tokens.push({ access, token });

    return user.save().then((u) => {
      return u;
    })
  } else {
    return Promise.reject({ code: 400, error: 'User empty' });
  }
}

UserSchema.statics.findByCredentials = function (username, password) {
  var User = this;

  return User.findOne({ username }).then((user) => {
    if (!user) {
      return Promise.reject({ error: 'username' });
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject({ error: 'password' });
        }
      });
    });
  });
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString();

  user.tokens = user.tokens.concat([{ access, token }]);

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.updateInfo = function (id, info) {
  var User = this;

  return User.findOneAndUpdate({ '_id': id }, info, (err, res) => {
    if (err)  return Promise.reject(err);
    if (res) {
      return Promise.resolve(res);
    }
    
  })
}
UserSchema.statics.updatePassword = function (userId, userPass, passwords) {
  var User = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(passwords.oldPassword, userPass, (err, res) => {
      if (res) {
        User.findOne({ '_id': userId }).then((us) => {
          if (us) {
            us.password = passwords.password;
            us.save().then((res) => {
              return resolve(res);
            });
          }
        }).catch(err => {
          return reject(err)
        })
      } else {
        reject({ errCode: 11999, error: 'Password dont mutch' });
      }
    });
  });
}

UserSchema.statics.findUserById = function (id) {
  var User = this;

  return User.findOne({ '_id': id }).then((user) => {
    if (user) {
      console.log('GET USER', user);
      
      return Promise.resolve(user.toJson());
    } else {
      return Promise.reject('User not found');
    }
  });
}

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.methods.removeToken = function (token) {
  var user = this;
  return user.updateOne({
    $pull: {
      tokens: { token }
    }
  })
};

UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };