/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  Scale
} from 'chart.js';
  
Chart.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
);

class LogAxis extends Scale {
  constructor(cfg) {
    super(cfg);
    this._startValue = undefined;
    this._valueRange = 0;
    const log = cfg.chart.config.options.scales.y.log || [2, Math.log2];
    this._base = log[0];
    this._log = log[1];
  }
  parse(raw, index) {
    const value = LinearScale.prototype.parse.apply(this, [raw, index]);
    return isFinite(value) ? value : null;
  }
  determineDataLimits() {
    const { min, max } = this.getMinMax(true);
    this.min = isFinite(min) ? min : null;
    this.max = isFinite(max) ? max : null;
  }
  buildTicks() {
    const ticks = [],
      aMin = Math.abs(this.min),
      aMax = Math.abs(this.max);
    if (aMin <= this._base) {
      ticks.push({ value: this._base * Math.sign(this.min) });
    }
    let v,
      power = Math.floor(
        (aMin > this._base ? Math.sign(this.min) : 1) *
          this._log(this.options.beginAtZero && this.min > 0 ? 1 : aMin > this._base ? aMin : 1)
      ),
      maxPower = Math.ceil(
        (aMax > this._base ? Math.sign(this.max) : 1) *
          this._log(this.options.beginAtZero && this.max < 0 ? 1 : aMax > this._base ? aMax : 1)
      );
    while (power <= maxPower) {
      ticks.push({ value: Math.sign(power) * Math.pow(this._base, Math.abs(power)) });
      power += 1;
    }
    if (aMax <= this._base) {
      ticks.push({ value: this._base * Math.sign(this.max) });
    }
    v = ticks.map((x) => x.value);
    this.min = Math.min(...v);
    this.max = Math.max(...v);
    return ticks;
  }
  getLogVal(v) {
    var aV = Math.abs(v);
    return aV > this._base ? Math.sign(v) * this._log(aV) : v / this._base;
  }
  configure() {
    /* @protected*/
    const start = this.min;
    super.configure();
    this._startValue = this.getLogVal(start);
    this._valueRange = this.getLogVal(this.max) - this.getLogVal(start);
  }
  getPixelForValue(value) {
    if (value === undefined) {
      value = this.min;
    }
    return this.getPixelForDecimal((this.getLogVal(value) - this._startValue) / this._valueRange);
  }
  getValueForPixel(pixel) {
    const decimal = this.getLogVal(this.getDecimalForPixel(pixel));
    return Math.pow(2, this._startValue + decimal * this._valueRange);
  }
}
LogAxis.id = 'custom_log';
LogAxis.defaults = {};
export default LogAxis;
