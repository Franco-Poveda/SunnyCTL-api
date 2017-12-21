"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

let bcrypt = require("bcryptjs");
let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    min: 3,
    max: 128
  },
  lastName: {
    type: String,
    required: true,
    min: 3,
    max: 128
  },
  email: {
    required: true,
    type: String,
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: function(email) {
      return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
    }
  },
  password:  {
    type:String,
    required: true,
    min: 6,
    max: 64
  },
  created: { type: Date, required: true, default: Date.now },
  role: {type: String, enum: ["user", "admin"], default: "user"}
});

// Before saving the user, hash the password
userSchema.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function (error, hash) {
      if (error) {
        return next(error);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

// Omit the password when returning a user
userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  }
});

var User = mongoose.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=user.js.map