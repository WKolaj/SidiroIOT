/**
 * @description Tick Id normalization type
 */
const TickIdNormalizeType = {
  noNormalization: "noNormalization",
  setTickAsBeginOfInterval: "setTickAsBeginOfInterval",
  setTickAsEndOfInterval: "setTickAsEndOfInterval",
  sendOnlyIfTickFitsSendingInterval: "sendOnlyIfTickFitsSendingInterval",
};

/**
 * @description class for normalizing tick id before sending
 */
class TickIdNormalizer {
  /**
   * @description sending interval
   */
  get SendingInterval() {
    return this._sendingInterval;
  }

  /**
   * @description Type of normalization
   */
  get NormalizationType() {
    return this._normalizationType;
  }

  /**
   * @description class for normalizing tick id before sending
   * @param {Number} sendingInterval sending interval
   * @param {TickIdNormalizeType} normalizationType type of normalization
   */
  constructor(sendingInterval, normalizationType) {
    this._sendingInterval = sendingInterval;
    this._normalizationType = normalizationType;
  }

  /**
   * @description Method for calculating the begin tick of interval
   * @param {Number} tickId actual tick id
   */
  _calculateIntervalBeginTick(tickId) {
    //If tick id is a begining/end of interval - begin interval should be always sendingInterval smaller
    if (tickId % this.SendingInterval === 0)
      return tickId - this.SendingInterval;
    else return tickId - (tickId % this.SendingInterval);
  }

  /**
   * @description Method for calculating the end tick of interval
   * @param {Number} tickId actual tick id
   */
  _calculateIntervalEndTick(tickId) {
    //If tick id is a begining/end of interval - end interval is always exactly the value
    if (tickId % this.SendingInterval === 0) return tickId;
    return tickId - (tickId % this.SendingInterval) + this.SendingInterval;
  }

  /**
   * @description Method for normalizing TickId, Returns new normalized tick id or null id data should not be send
   * @param {Number} tickId Tick id to normalize
   */
  normalizeTickId(tickId) {
    switch (this.NormalizationType) {
      case TickIdNormalizeType.noNormalization:
        return tickId;
      case TickIdNormalizeType.setTickAsBeginOfInterval:
        if (tickId == null) return tickId;
        return this._calculateIntervalBeginTick(tickId);
      case TickIdNormalizeType.setTickAsEndOfInterval:
        if (tickId == null) return tickId;
        return this._calculateIntervalEndTick(tickId);
      case TickIdNormalizeType.sendOnlyIfTickFitsSendingInterval:
        if (tickId == null) return tickId;
        if (tickId === this._calculateIntervalEndTick(tickId)) return tickId;
        else return null;
      default:
        return tickId;
    }
  }
}

module.exports.TickIdNormalizer = TickIdNormalizer;
module.exports.TickIdNormalizeType = TickIdNormalizeType;
