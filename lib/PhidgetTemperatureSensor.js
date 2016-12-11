/**
 * The `PhidgetTemperatureSensor` class allows you receive data from PhidgetTemperatureSensor boards.
 *
 * As of this writing, this class has only been tested with a
 * [1048_0 - PhidgetTemperatureSensor 4-input](http://www.phidgets.com/products.php?product_id=1048), but
 * should be compatible with any PhidgetTemperatureSensor board.
 * 
 * ```JavaScript
 * var PhidgetTemperatureSensor = require('phidgets').PhidgetTemperatureSensor;
 * 
 * var pts = new PhidgetTemperatureSensor();
 * 
 * function onReady() {
 * 
 *    var inputIndex = 0;
 *    
 *    // set the ThermocoupleType to K
 *    pts.setThermocoupleType(inputIndex, PhidgetTemperatureSensor.THERMOCOUPLE_TYPES.TYPE_K);
 * 
 *    // receive temperature events when the temperature changes by at least 2 degrees Celsius (default is 0.5)
 *    pts.setTemperatureChangeTrigger(inputIndex, 2);
 *    
 *    pts.on('temperature', function (emitter, data) {
 *      if (data.index === inputIndex) {
 *        console.log('Temperature: ' + data.value);
 *      }
 *    });
 * 
 * }
 * 
 * pts.addListener('opened', onReady);
 * 
 * pts.open();
 * ```
 * 
 * This object extends the `Phidget` object which itself extends Node.js'
 * [`events.EventEmitter` object](https://nodejs.org/api/events.html#events_class_events_eventemitter).
 * See that object's documentation for more inherited methods and properties.
 *
 * @class PhidgetTemperatureSensor
 * @constructor
 * @extends Phidget
 * @author Andrew Berger <andrew@andrewberger.net>
 */
var PhidgetTemperatureSensor = function() {
  PhidgetTemperatureSensor.super_.call(this, 'PhidgetTemperatureSensor');

  var self = this;
  
  /**
   * [read-only] The last known ambient temperature of the sensor (where the inputs connect to the board), in degrees celsius.
   * 
   * @property ambientTemperature {Number}
   * @instance
   */
  Object.defineProperty(this, 'ambientTemperature', {
    enumerable: true,
    get: function() {
      return self._ambientTemperature;
    }
  });

  /**
   * [read-only] The highest possible ambient temperature value which can be returned by the sensor, in degrees celsius.
   * 
   * @property ambientTemperatureMax {Number}
   * @instance
   */
  Object.defineProperty(this, 'ambientTemperatureMax', {
    enumerable: true,
    get: function() {
      return self._ambientTemperatureMax;
    }
  });

  /**
   * [read-only] The lowest possible ambient temperature value which can be returned by the sensor, in degrees celsius.
   * 
   * @property ambientTemperatureMin {Number}
   * @instance
   */
  Object.defineProperty(this, 'ambientTemperatureMin', {
    enumerable: true,
    get: function() {
      return self._ambientTemperatureMin;
    }
  });

  /**
   * [read-only] An object containing data about each input on the device.
   *
   * @property inputs {Object}
   * 
   * @property inputs.count {int} The number of inputs available on the device.
   * 
   * @property inputs[int].temperature {Number} The input's last known temperature in degrees celsius.
   * 
   * @property inputs[int].temperatureMax {Number} The highest temperature possible for the given input,
   * based on thermocouple type.
   * 
   * @property inputs[int].temperatureMin {Number} The lowest temperature possible for the given input,
   * based on thermocouple type.
   * 
   * @property inputs[int].temperatureChangeTrigger {Number} The input's temperature change trigger, in
   * degrees celsius.
   * 
   * @property inputs[int].potential {Number} The input's last known voltage.
   * 
   * @property inputs[int].potentialMax {Number} The highest voltage possible for the given input,
   * based on thermocouple type.
   * 
   * @property inputs[int].potentialMin {Number} The lowest voltage possible for the given input,
   * based on thermocouple type.
   * 
   * @property inputs[int].thermocoupleType {int} The type of thermocouple attached to the given input. Value 
   * corresponds to a value from PhidgetTemperatureSensor.THERMOCOUPLE_TYPES.
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


/**
 * [read-only] An enum of supported thermocouple types. Support for other thermocouple types,
 * and voltage sources other than thermocouples in the valid range (between potentialMin and
 * potentialMax) can be achieved using potential.
 * 
 * @property THERMOCOUPLE_TYPES {Object}
 * @property THERMOCOUPLE_TYPES.TYPE_J {int} Integer value represent a J-type thermocouple.
 * @property THERMOCOUPLE_TYPES.TYPE_K {int} Integer value represent a K-type thermocouple.
 * @property THERMOCOUPLE_TYPES.TYPE_E {int} Integer value represent a E-type thermocouple.
 * @property THERMOCOUPLE_TYPES.TYPE_T {int} Integer value represent a T-type thermocouple.
 */
Object.defineProperty(PhidgetTemperatureSensor, 'THERMOCOUPLE_TYPES', {
  enumerable: true,
  writable: false,
  value: {
    TYPE_J: 0,
    TYPE_K: 1,
    TYPE_E: 2,
    TYPE_T: 3
  }
});

/** @private */
Object.defineProperty(PhidgetTemperatureSensor, '_thermocoupleTypesArray', {
  writable: false,
  value: [
    PhidgetTemperatureSensor.THERMOCOUPLE_TYPES.TYPE_J,
    PhidgetTemperatureSensor.THERMOCOUPLE_TYPES.TYPE_K,
    PhidgetTemperatureSensor.THERMOCOUPLE_TYPES.TYPE_E,
    PhidgetTemperatureSensor.THERMOCOUPLE_TYPES.TYPE_T
  ]
});

/**
 * Sets the change trigger for an input. This is the amount by which the sensed temperature must
 * change between TemperatureChangeEvents. By default this is set to 0.5. Setting TemperatureChangeTrigger
 * to 0 will cause all temperature updates to fire events. This is helpful for applications that are
 * implementing their own filtering.
 * 
 * @method setTemperatureChangeTrigger
 * @param index {int|Array} The input's number (or an array of input numbers)
 * @param value {Number} The TemperatureChangeTigger value to set
 * @returns {PhidgetTemperatureSensor} Returns the PhidgetTemperatureSensor to allow method chaining.
 * @chainable
 */
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


/**
 * Sets the thermocouple type for an input. The possible values are 'J', 'K', 'E', and 'T', or one of
 * the values in the PhidgetTemperatureSensor.THERMOCOUPLE_TYPES enum. Support for other thermocouple types,
 * and voltage sources other than thermocouples in the valid range (between potentialMin and
 * potentialMax) can be achieved using potential.
 * 
 * @method setThermocoupleType
 * @param index {int|Array} The input's index (or an array of input indices)
 * @param value {string|Number} The ThermocoupleType to set
 * @returns {PhidgetTemperatureSensor} Returns the PhidgetTemperatureSensor to allow method chaining.
 * @chainable
 */
PhidgetTemperatureSensor.prototype.setThermocoupleType = function(index, value) {

  var self = this;
  if (self.ready !== true) { return self; }

  if ('string' === typeof value) {
    if (!PhidgetTemperatureSensor.THERMOCOUPLE_TYPES.hasOwnProperty(value.toUpperCase())) {
      throw new Error('Unsupported thermocouple type: ' + value);
    }

    value = PhidgetTemperatureSensor.THERMOCOUPLE_TYPES['TYPE_' + value.toUpperCase()];
  } else {
    value = Number(value);

    if (isNaN(value) || (PhidgetTemperatureSensor._thermocoupleTypesArray.indexOf(value) < 0)) {
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

/** @private See overridden method for details. */
PhidgetTemperatureSensor.prototype._parsePhidgetSpecificData = function (data) {
  
  var self = this;

  // keywords which should result in an emitted event
  var emittableEvents = [

    // @TODO is this event necessary?
    /**
     * The sensor's ambient temperature has changed.
     *
     * @event ambientTemperature
     * @param {PhidgetTemperatureSensor} emitter The actual PhidgetTemperatureSensor object that emitted the
     * event.
     * @param {Object} data An object containing the sensor data and related information
     * @param {Number} data.value The sensor's new ambient temperature.
     */
    'AmbientTemperature',

    /**
     * The calculated temperature of the given input has changed by more than temperatureChangeTrigger.
     * This value is dependent on the sensor's ambient temperature, the input's thermocouple type, and
     * the input's potential.
     *
     * @event temperature
     * @param {PhidgetTemperatureSensor} emitter The actual PhidgetTemperatureSensor object that emitted the
     * event.
     * @param {Object} data An object containing the sensor data and related information
     * @param {int} data.index The input's index number
     * @param {Number} data.value The input's new temperature.
     */
    'Temperature',

    // @TODO it may be useful to return the last known AmbientTemperature with this event, as its
    // most likely use is in calculating temperature from a voltage source other than a J K E or T thermocouple.
    /**
     * The potential (voltage) of the given input has changed.
     *
     * @event potential
     * @param {PhidgetTemperatureSensor} emitter The actual PhidgetTemperatureSensor object that emitted the
     * event.
     * @param {Object} data An object containing the sensor data and related information
     * @param {int} data.index The input's index number
     * @param {Number} data.value The input's new potential.
     */
    'Potential'
  ];

  // keywords which relate to a specific input, and have a useful data.index value
  var inputSpecificEvents = [
    'Temperature',
    'TemperatureMax',
    'TemperatureMin',
    'Potential',
    'PotentialMax',
    'PotentialMin',
    'ThermocoupleType',
    'TemperatureChangeTrigger'
  ];

  // emitted event names and properties on each input must be camelCase
  var camelizedKeyword = data.keyword.charAt(0).toLowerCase() + data.keyword.slice(1);

  // the value emitted by an emittableEvent
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
    self.inputs.count = eventData.value;

  } else if (inputSpecificEvents.indexOf(data.keyword) >= 0) {
    if (!self.inputs[data.index]) { self.inputs[data.index] = {}; }

    eventData.index = data.index;

    self.inputs[data.index][camelizedKeyword] = eventData.value;

  } else {
    // unhandled event
    return;
  }

  if (self.ready && (emittableEvents.indexOf(data.keyword) >= 0)) {
    self.emit(camelizedKeyword, self, eventData);
  }
}

module.exports.PhidgetTemperatureSensor = PhidgetTemperatureSensor;
