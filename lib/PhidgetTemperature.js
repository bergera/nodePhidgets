var PhidgetTemperature() {
  PhidgetTemperature.super_.call(this, 'PhidgetTemperature');

  var self = this

  this.thermocouples = {};

}

util.inherits(PhidgetTemperature, Phidget);

// PhidgetTemperature.prototype._parsePhidgetSpecificData = function (data) {
//   var self = this;
// }

module.exports.PhidgetTemperature = PhidgetTemperature;
