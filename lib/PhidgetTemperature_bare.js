// http://www.phidgets.com/docs/1048_User_Guide#API
var PhidgetTemperature = function() {
  PhidgetTemperature.super_.call(this, 'PhidgetTemperature');
};

util.inherits(PhidgetTemperature, Phidget);

PhidgetTemperature.prototype._parsePhidgetSpecificData = function (data) {
  console.log(data);
}

module.exports.PhidgetTemperature = PhidgetTemperature;
