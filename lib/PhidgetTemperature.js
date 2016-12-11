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
    writable: false,
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
    writable: false,
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
    writable: false,
    get: function() {
      return self._ambientTemperatureMin;
    }
  });

  /**
   * [read-only]
   * 
   * @property supportedThermocoupleTypes {Array}
   */
  Object.defineProperty(this, 'supportedThermocoupleTypes', {
    enumerable: true,
    writable: false,
    value: ['J', 'K', 'E', 'T']
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

};

util.inherits(PhidgetTemperatureSensor, Phidget);

PhidgetTemperatureSensor.prototype.setTemperatureChangeTrigger = function(index, value) {

}

PhidgetTemperatureSensor.prototype.setThermocoupleType = function(index, value) {

}

PhidgetTemperatureSensor.prototype._parsePhidgetSpecificData = function (data) {
  var self = this;

  if (data.keyword === 'AmbientTemperature') {
    self._ambientTemperature = parseFloat(data.value);

    /**
     *
     * @event ambientTemperature
     * @param {PhidgetTemperatureSensor} emitter The actual PhidgetTemperatureSensor object that emitted the
     * event.
     * @param {Object} data An object containing information about the event.
     * @param {Number} data.temperature The thermocouple's new temperature.
     */
    self.ready && self.emit(
        "ambientTemperature",
        self,
        {
          "temperature": self.ambientTemperature
        }
    );

  } else if (data.keyword === 'Potential') {
    if (!self.inputs[data.index]) { self.inputs[data.index] = {}; }
    self.inputs[data.index].potential = parseFloat(data.value);

    /**
     *
     * @event potential
     * @param {PhidgetTemperatureSensor} emitter The actual PhidgetTemperatureSensor object that emitted the
     * event.
     * @param {Object} data An object containing information about the event.
     * @param {int} data.index The output's index number.
     * @param {Number} data.potential The thermocouple's new potential.
     */
    self.ready && self.emit(
        "potential",
        self,
        {
          "index": data.index,
          "potential": self.inputs[data.index].potential
        }
    );

  } else if (data.keyword === 'Temperature') {
    if (!self.inputs[data.index]) { self.inputs[data.index] = {}; }
    self.inputs[data.index].temperature = parseFloat(data.value);

    /**
     *
     * @event temperature
     * @param {PhidgetTemperatureSensor} emitter The actual PhidgetTemperatureSensor object that emitted the
     * event.
     * @param {Object} data An object containing information about the event.
     * @param {int} data.index The output's index number.
     * @param {Number} data.temperature The thermocouple's new temperature.
     */
    self.ready && self.emit(
        "temperature",
        self,
        {
          "index": data.index,
          "temperature": self.inputs[data.index].temperature
        }
    );

  }

}

module.exports.PhidgetTemperatureSensor = PhidgetTemperatureSensor;
