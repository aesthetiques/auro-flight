// Copyright (c) 2021 Alaska Airlines. All right reserved. Licensed under the Apache-2.0 license
// See LICENSE in the project root for license information.

// ---------------------------------------------------------------------

// If use litElement base class
import { LitElement, html, css } from "lit-element";
import styleCss from "./style-flight-css.js";
import "@alaskaairux/auro-flightline";
import "@alaskaairux/auro-flightline/dist/auro-flight-segment";
import "./auro-flight-header";
import "./auro-flight-main";

// See https://git.io/JJ6SJ for "How to document your components using JSDoc"
/**
 * The auro-flight element renders a DoT compliant Flight listing.
 * This design has been tested via the Alaska Legal team for legal compliance.
 * Please DO NOT modify unit tests pertaining to DoT regulations.
 *
 * @attr {Array} flights - Array of flight numbers `['AS 123', 'EK 432']`
 * @attr {Number} duration - String for the duration. `505`
 * @attr {String} departureTime - String for the departure ISO 8601 time. `2022-04-13T12:30:00-04:00`
 * @attr {String} departureStation - String for the departure station. `SEA`
 * @attr {String} arrivalTime - String for the arrival ISO 8601 time. `2022-04-13T12:30:00-04:00`
 * @attr {String} arrivalStation - String for the arrival station. `PVD`
 * @attr {String} reroutedDepartureStation - String for the new departure station for rerouted flights. `PDX`
 * @attr {String} reroutedArrivalStation - String for the new arrival station for rerouted flights. `AVP`
 * @attr {Boolean} ariaHidden - When `true` element will be hidden from screen readers
 * @slot default - anticipates `<auro-flightline>` instance to fill out the flight timeline
 * @slot departureHeader - Text on top of the departure station's time
 * @slot arrivalHeader - Text on top of the arrival station's time
 * @slot footer - Lower section allowing for tertiary content to be attributed to the element. Per **DoT Regulations** do NOT edit the styles contained within this slot
 */

// build the component class
class AuroFlight extends LitElement {

  constructor() {
    super();

    this.ariaHidden = false;
  }

  // function to define props used within the scope of this component
  static get properties() {
    return {
      flights:             { type: Array },
      duration:            { type: Number },
      departureTime:       { type: String },
      departureStation:    { type: String },
      arrivalTime:         { type: String },
      arrivalStation:      { type: String },
      reroutedArrivalStation:   { type: String },
      reroutedDepartureStation: { type: String },
      ariaHidden:          { type: Boolean },

    };
  }

  static get styles() {
    return css`
      ${styleCss}
    `;
  }

  // This function removes a CSS selector if the footer slot is empty
  firstUpdated() {
    const slot = this.shadowRoot.querySelector("#footer"),
      slotWrapper = this.shadowRoot.querySelector("#flightFooter");

    if (!this.unformatted && slot.assignedNodes().length === 0) {
      return slotWrapper.classList.remove("flightFooter");
    }

    return null;
  }

  /**
   * @private
   * @param {number} duration - Number that defines duration of flight in minutes.
   * @returns {string} Number converted to hours and min string for UI.
   */
  convertDuration(duration) {
    const hour = 60;
    const hours = `${parseInt(duration / hour, 10)}h`;
    const calcMins = parseInt(duration % hour, 10);
    const minsString = calcMins === 0 ? '' : `${calcMins}m`;

    return `${hours} ${minsString}`;
  }

  // function that renders the HTML and CSS into  the scope of the component
  render() {
    return html`

      <section aria-hidden="${this.ariaHidden}">
        <auro-flight-header
          flights=${JSON.stringify(this.flights)}
          duration=${this.convertDuration(this.duration)}
          departureTime=${this.departureTime}
          arrivalTime=${this.arrivalTime}
        >
        </auro-flight-header>
        <div class="headerContainer">
          <slot name="departureHeader"></slot>
          <slot name="arrivalHeader"></slot>
        </div>
        <auro-flight-main
          arrivalTime=${this.arrivalTime}
          arrivalStation=${this.arrivalStation}
          departureTime=${this.departureTime}
          departureStation=${this.departureStation}
          reroutedArrivalStation=${this.reroutedArrivalStation}
          reroutedDepartureStation=${this.reroutedDepartureStation}
          duration=${this.duration}
          flights=${JSON.stringify(this.flights)}
        >
          <slot></slot>
        </auro-flight-main>
        <footer class="flightFooter" id="flightFooter">
          <slot name="footer" id="footer"></slot>
        </footer>
      </section>
    `;
  }
}

/* istanbul ignore else */
// define the name of the custom component
if (!customElements.get("auro-flight")) {
  customElements.define("auro-flight", AuroFlight);
}
