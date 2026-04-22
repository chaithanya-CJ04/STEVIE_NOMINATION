const { EventEmitter } = require('events');

/**
 * Safe Event Dispatcher
 * Ensures asynchronous, non-blocking execution with global error protection.
 */
class EventDispatcher {
  constructor() {
    this.emitter = new EventEmitter();
    this.emitter.on('error', (err) => {
      console.error('🔥 [CRITICAL] Event Dispatcher Error:', err.message);
    });
  }

  /**
   * Register a sidecar listener
   */
  subscribe(eventName, handler) {
    // We wrap every handler in a safety layer
    this.emitter.on(eventName, async (payload) => {
      try {
        await handler(payload);
      } catch (err) {
        console.error(`⚠️ [SIDECAR FAILURE] Event: ${eventName} | Details: ${err.message}`);
        // Here we could implement a retry-queue or fallback logging
      }
    });
  }

  /**
   * Publish an event to all sidecars
   */
  publish(eventName, payload) {
    // Non-blocking fire!
    setImmediate(() => {
      this.emitter.emit(eventName, payload);
    });
  }
}

module.exports = new EventDispatcher();
