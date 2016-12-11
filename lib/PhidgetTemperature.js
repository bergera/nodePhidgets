// http://www.phidgets.com/docs/1048_User_Guide#API
var PhidgetTemperatureSensor = function() {
  PhidgetTemperatureSensor.super_.call(this, 'PhidgetTemperatureSensor');

  var self = this;
  
  /**
   * [read-only]
   * 
   * @property ambientTemperature {Number}
   */
  Object.defineProperty(this, 'ambientTemperature', {
    enumerable: true,
    get: function() {
      return self._ambientTemperature;
    }
  });

  /**
   * [read-only]
   * 
   * @property ambientTemperatureMax {Number}
   */
  Object.defineProperty(this, 'ambientTemperatureMax', {
    enumerable: true,
    get: function() {
      return self._ambientTemperatureMax;
    }
  });

  /**
   * [read-only]
   * 
   * @property ambientTemperatureMin {Number}
   */
  Object.defineProperty(this, 'ambientTemperatureMin', {
    enumerable: true,
    get: function() {
      return self._ambientTemperatureMin;
    }
  });

  /**
   * [read-only]
   * 
   * @property inputs.count
   * @property inputs[int].temperature {Number}
   * @property inputs[int].temperatureMax {Number}
   * @property inputs[int].temperatureMin {Number}
   * @property inputs[int].temperatureChangeTrigger {Number}
   * @property inputs[int].potential {Number}
   * @property inputs[int].potentialMax {Number}
   * @property inputs[int].potentialMin {Number}
   * @property inputs[int].thermocoupleType {String}
   */
  this.inputs = {};

  /** @private */
  this._ambientTemperature = undefined;

  /** @private */
  this._ambientTemperatureMax = undefined;

  /** @private */
  this._ambientTemperatureMin = undefined;

  /** @private */
  this._validThermocoupleTypes = [
    PhidgetTemperatureSensor.THERMOCOUPLE_TYPES.J,
    PhidgetTemperatureSensor.THERMOCOUPLE_TYPES.K,
    PhidgetTemperatureSensor.THERMOCOUPLE_TYPES.E,
    PhidgetTemperatureSensor.THERMOCOUPLE_TYPES.T
  ];

};


/**
 * [read-only]
 * 
 * @property THERMOCOUPLE_TYPES {Object}
 */
Object.defineProperty(PhidgetTemperatureSensor, 'THERMOCOUPLE_TYPES', {
  enumerable: true,
  writable: false,
  value: {
    J: +0,
    K: +1,
    E: +2,
    T: +3
  }
});

util.inherits(PhidgetTemperatureSensor, Phidget);

PhidgetTemperatureSensor.prototype.setTemperatureChangeTrigger = function(index, value) {

  var self = this;
  if (self.ready !== true) { return self; }

  value = Number(value);

  if (isNaN(value) || value < 0) {
    throw new Error('TemperatureChangeTrigger must be a floating-point number greater than or equal to 0');
  }

  index = [].concat(index);

  for (var i = 0; i < index.length; i++) {
    var pos = Number(index[i]);
    if (!self.inputs[pos]) { self.inputs[pos] = {}; }
    self.inputs[pos].temperatureChangeTrigger = value;
    self._sendPck(self._makePckString('TemperatureChangeTrigger', pos), value, true);
  }

  return self;
}

PhidgetTemperatureSensor.prototype.setThermocoupleType = function(index, value) {

  var self = this;
  if (self.ready !== true) { return self; }

  // value may be a string ('J', 'K', 'E', or 'T'), or one of the values
  // specified in the THERMOCOUPLE_TYPES enum
  if ('string' === typeof value) {
    if (!PhidgetTemperatureSensor.THERMOCOUPLE_TYPES.hasOwnProperty(value.toUpperCase())) {
      throw new Error('Unsupported thermocouple type: ' + value);
    }

    value = PhidgetTemperatureSensor.THERMOCOUPLE_TYPES[value.toUpperCase()];
  } else {
    value = Number(value);

    if (isNaN(value) || (self._validThermocoupleTypes.indexOf(value) < 0)) {
      throw new Error('ThermocoupleType must be one of PhidgetTemperatureSensor.THERMOCOUPLE_TYPES');
    }
  }

  index = [].concat(index);

  for (var i = 0; i < index.length; i++) {
    var pos = Number(index[i]);
    if (!self.inputs[pos]) { self.inputs[pos] = {}; }
    self.inputs[pos].thermocoupleType = value;
    self._sendPck(self._makePckString('ThermocoupleType', pos), value, true);
  }

  return self;
}

PhidgetTemperatureSensor.prototype._parsePhidgetSpecificData = function (data) {
  var self = this;
  var camelizedKeyword = data.keyword.charAt(0).toLowerCase() + data.keyword.slice(1);
  var eventData = {
    value: Number(data.value)
  };

  if (data.keyword === 'AmbientTemperature') {
    self._ambientTemperature = eventData.value;

  } else if (data.keyword === 'AmbientTemperatureMax') {
    self._ambientTemperatureMax = eventData.value;

  } else if (data.keyword === 'AmbientTemperatureMin') {
    self._ambientTemperatureMin = eventData.value;

  } else if (data.keyword === 'TemperatureInputCount') {
    // self._temperatureInputCount = eventData.value;
    self.inputs.count = eventData.value;

  } else if (data.hasOwnProperty('index')) {
    if (!self.inputs[data.index]) { self.inputs[data.index] = {}; }

    eventData.index = data.index;

    self.inputs[data.index][camelizedKeyword] = eventData.value;

  } else {
    // unsupported event type
    return;
  }

  self.ready && self.emit(camelizedKeyword, self, eventData);
}

module.exports.PhidgetTemperatureSensor = PhidgetTemperatureSensor;
