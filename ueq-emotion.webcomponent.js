import "regenerator-runtime/runtime";
import {css, html, LitElement} from 'lit-element';
import {customElement, property} from 'lit/decorators.js';
import {UeqContents, UeqEmotionType} from "./ueq-emotion.contents";
import i18n from "./i18n/i18n";

@customElement('ueq-emotion')
export class UeqEmotion extends LitElement {
    static DEFAULT_LOCALE = 'en_US';
    static formAssociated = true;

    @property({type: String}) name;
    @property({type: Object, reflect: true}) value;
    @property({type: Boolean, attribute: 'multi-field'}) multiField = false;
    @property({type: String}) locale = UeqEmotion.DEFAULT_LOCALE;
    @property({type: String}) type = UeqEmotionType.Short;

    _valueContainer;
    _internals;

    constructor() {
        super();
        // Language valid?
        if (!i18n[this.locale]) {
            console.error(`could not find locale '${this.locale}'. Valid locales are: `, Object.keys(i18n));
            this.locale = UeqEmotion.DEFAULT_LOCALE;
        }
        this._internals = this.attachInternals();
        this.checkValidity();
    }

    static get styles() {
        return css`
          :host {
            --face-size: var(--ueq-face-size, 60px);
            --border-normal: var(--ueq-border-normal, #000000);
            --border-highlight: var(--ueq-border-highlight, #0000ff);
            --error-highlight: var(--ueq-error-highlight, none);
            font-family: Roboto, "Helvetica Neue", sans-serif;
          }

          :host(:invalid) .container {
            background-color: var(--error-highlight);
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
            box-shadow: 0 0 20px var(--border-highlight),
            0 0 20px var(--border-highlight),
            0 0 20px var(--border-highlight),
            0 0 20px var(--border-highlight);
            border-color: var(--border-highlight);
          }

          .face.selected .decals circle {
            fill: var(--border-highlight);
          }

          .face.selected .line {
            stroke: var(--border-highlight);
          }

          .face .decals {
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

    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        UeqContents[this.type].forEach(obj => {
            if (this.value[obj.name]) {
                this._activateItem(this.shadowRoot.querySelector(
                    `input[name="${obj.name}"][value="${this.value[obj.name]}"]`
                ));
            }
        });
    }

    get validity() {
        return this._internals.getValidity();
    }

    checkValidity() {
        const allFieldsFilled = this.shadowRoot.querySelectorAll('input[type=radio]:checked').length === 8;
        if (allFieldsFilled) {
            this._internals.setValidity({});
        } else {
            this._internals.setValidity({valueMissing: true}, this._t('error fields missing'));
        }
        return allFieldsFilled;
    }

    _t(key) {
        if (!i18n[this.locale].translations[key]) {
            return `%${key}%`;
        }
        return i18n[this.locale].translations[key];
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
          <svg class="decals" viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
            <circle r="10" cx="25" cy="40" fill="black"></circle>
            <circle r="10" cx="85" cy="40" fill="black"></circle>
            <path class="line" d="${mouthPath}" stroke="black" fill="transparent" stroke-width="5"></path>
          </svg>
          <input type="radio" name="${UeqContents[this.type][rowIndex].name}" value="${faceIndex}" class="select_${faceIndex}" />
        </div>`;
    }

    _renderRow(rowData, rowIndex) {
        const x = [html`<span class="item item-low">${this._t(rowData.low)}</span>`];
        for (let i = 1; i <= 7; i++) {
            x.push(this._renderFace(rowIndex, i));
        }
        x.push(html`<span class="item item-high">${this._t(rowData.high)}</span>`);
        return x;
    }

    _addPublicFormElement() {
        if (this.multiField) {
            this._valueContainer = [];
            UeqContents[this.type].forEach((row, i) => {
                const elm = document.createElement('input');
                elm.setAttribute('type', 'hidden');
                elm.setAttribute('name', `${this.name}[${row.name}]`);
                this.appendChild(elm);
                this._valueContainer.push(elm);
            })
        } else {
            this._valueContainer = document.createElement('input');
            this._valueContainer.setAttribute('type', 'hidden');
            this._valueContainer.setAttribute('name', this.name);
            this.appendChild(this._valueContainer);
        }
    }

    _faceClickCallback($evt) {
        let target = $evt.target;
        if (! target.matches('div.face')) {
            target = target.closest('div.face');
        }
        const input = target.querySelector('input');
        // unselect whole row
        const rowInputs = this.shadowRoot.querySelectorAll(`input[name=${input.getAttribute('name')}]`);
        rowInputs.forEach(input => {
            input.removeAttribute('checked');
            input.closest('div.face').classList.remove('selected')
        });
        this._activateItem(input);
    }

    _activateItem(input) {
        input.setAttribute('checked', 'checked');
        input.dispatchEvent(new Event('change'));
        input.closest('div.face').classList.add('selected');
        this._changeOption();
    }

    _changeOption() {
        if (this.multiField) {
            this._changeMulti();
        } else {
            this._changeSingle();
        }
        this.checkValidity();
    }

    _changeSingle() {
        this._valueContainer.value = JSON.stringify(
            [].slice.call(this.shadowRoot.querySelectorAll('input[type=radio]:checked'))
                .reduce((all, cur) => {
                    all[cur.getAttribute('name')] = cur.getAttribute('value');
                    return all;
                }, {})
        );
    }

    _changeMulti() {
        [].slice.call(this.shadowRoot.querySelectorAll('input[type=radio]:checked'))
            .forEach((cur, i) => {
                this._valueContainer[i].setAttribute('value', cur.getAttribute('value'));
            });
    }
}
