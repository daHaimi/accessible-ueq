import "regenerator-runtime/runtime";
import {css, html, LitElement} from 'lit-element';
import {customElement, property} from 'lit/decorators.js';
import {UeqContents, UeqEmotionType} from "./ueq-emotion.contents";
import i18n from "./i18n/i18n";

@customElement('ueq-emotion')
export class UeqEmotion extends LitElement {
    static DEFAULT_LOCALE = 'en_US';

    @property({type: String}) name;
    @property({type: String}) locale = UeqEmotion.DEFAULT_LOCALE;
    @property({type: String}) type = UeqEmotionType.Short;

    _valueContainer;

    constructor() {
        super();
        // Language valid?
        if (!i18n[this.locale]) {
            console.error(`could not find locale '${this.lang}'. Valid locales are: `, Object.keys(i18n));
            this.lang = UeqEmotion.DEFAULT_LOCALE;
        }
    }

    _t(key) {
        if (!i18n[this.locale].translations[key]) {
            return `%${key}%`;
        }
        return i18n[this.locale].translations[key];
    }

    static get styles() {
        return css`
          :host {
            --face-size: var(--ueq-face-size, 60px);
            --border-normal: var(--ueq-border-normal, #000000);
            --border-highlight: var(--ueq-border-highlight, #0000ff);
            font-family: Roboto, "Helvetica Neue", sans-serif;
          }

          .container {
            display: grid;
            grid-template-columns: 2fr repeat(7, 1fr) 2fr;
            grid-template-rows: auto;
          }
          
          span.item {
            padding-top: calc(var(--face-size) / 3);
            font-size: calc(var(--face-size) / 2.5);
          }

          .item-low {
            text-align: right;
          }

          .face {
            width: var(--face-size);
            height: var(--face-size);
            border: 3px solid var(--border-normal);
            border-radius: var(--face-size);
            cursor: pointer;
            margin: calc(var(--face-size) / 10) auto;
          }

          .face.selected {
            box-shadow: 0 0 20px #0000ff, 0 0 20px #0000ff, 0 0 20px #0000ff, 0 0 20px #0000ff;
            border-color: var(--border-highlight);
          }

          .face.selected:before,
          .face.selected:after {
            background-color: var(--border-highlight);
          }

          .face.selected .line {
            stroke: var(--border-highlight);
          }

          .face .mouth {
            margin-top: 10%;
            padding: 0 15%;
          }

          .face input {
            display: none;
          }
        `;
    }

    render() {
        this._addPublicFormElement();
        const x = UeqContents[this.type].map((row, i) => this._renderRow(row, i));
        return html`<div class="container">${x}</div>`;
    }

    _renderFace(rowIndex, faceIndex) {
        const percent = (faceIndex - 1) / 6;
        const hue = Math.floor(percent * 120);
        const mouthSouth = 90 + ((.5 - percent) * 10);
        const mouthRound = 90 + ((percent - .5) * 80);
        const faceColor = `hsl(${hue},100%,50%)`;
        const mouthPath = `M 5 ${mouthSouth} Q 55 ${mouthRound} 105 ${mouthSouth}`;
        return html`
        <div class="face" style="background-color: ${faceColor}" @click="${this._faceClickCallback}">
          <svg class="mouth" viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
              <circle r="10" cx="25" cy="40" fill="black"></circle>
              <circle r="10" cx="85" cy="40" fill="black"></circle>
            <path class="line" d="${mouthPath}" stroke="black" fill="transparent" stroke-width="5"></path>
          </svg>
          <input type="radio" name="ueq_${rowIndex}" value="${faceIndex}" class="select_${faceIndex}" />
        </div>`;
    }

    _renderRow(rowData, rowIndex) {
        const x = [html`<span class="item item-low">${this._t(rowData.low)}</span>`];
        for (let i = 1; i <= 7; i++) {
            x.push(this._renderFace(rowIndex, i));
        }
        x.push(html`<span class="item item-high">${this._t(rowData.high)}</span>`);
        console.log(x);
        return x;
    }

    _addPublicFormElement() {
        this._valueContainer = document.createElement('input');
        this._valueContainer.setAttribute('type', 'hidden');
        this._valueContainer.setAttribute('name', this.name);
        this.appendChild(this._valueContainer);
    }

    _faceClickCallback($evt) {
        let target = $evt.target;
        if (! target.matches('div.face')) {
            target = target.closest('div.face');
        }
        const input = target.querySelector('input');
        // unselect all
        const rowInputs = this.shadowRoot.querySelectorAll(`input[name=${input.getAttribute('name')}]`);
        rowInputs.forEach(input => {
            input.removeAttribute('checked');
            input.closest('div.face').classList.remove('selected')
        });
        input.setAttribute('checked', 'checked');
        input.dispatchEvent(new Event('change'));
        target.classList.add('selected');
    }
}
