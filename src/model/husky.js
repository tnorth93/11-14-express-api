'use strict';

const uuid = require('uuid/v1');

class Husky {
  constructor(name, description) {
    this.id = uuid();
    this.timestamp = new Date();
    this.name = name;
    this.description = description;
  }
}

module.exports = Husky;
