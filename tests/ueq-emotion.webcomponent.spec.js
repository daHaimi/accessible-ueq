import {expect, assert} from '@esm-bundle/chai';
import {fixture} from '@open-wc/testing';
import {UeqEmotion} from "../dist/ueq-emotion.webcomponent";

describe('ueq-emotion', () => {

  const AWESOME_BUTTON_TAG = 'ueq-emotion';

  it('displays default element', async () => {
    const elName = 'ueq-test';
    const ueqElement = await fixture(`<${AWESOME_BUTTON_TAG} name="${elName}"></${AWESOME_BUTTON_TAG}>`);
    assert.instanceOf(ueqElement, UeqEmotion);
    // Value empty
    expect(ueqElement.getAttribute('value')).equal('{}');

    const shRoot = ueqElement.shadowRoot;
    const elContents = shRoot.querySelector('.container');
    expect(elContents.children.length).equal(9 * 8); // 7 + 2 elements per line; 8 lines
    expect(elContents.querySelectorAll('div.face').length).eq(7 * 8);

    // None selected
    expect(elContents.querySelectorAll('div.face.selected').length).eq(0);

    // translation checks
    const labels = elContents.querySelectorAll('span.item');
    expect(labels.length).eq(16);
    const germanElement = await fixture(`<${AWESOME_BUTTON_TAG} name="${elName}" locale="de_DE"></${AWESOME_BUTTON_TAG}>`);
    const germanLabels = germanElement.shadowRoot.querySelectorAll('.container span.item');
    expect(germanLabels.length).eq(16);
    expect(germanLabels).not.eq(labels);
  });

  it('displays default element with default values', async () => {
    const elName = 'ueq-test';
    const initialValue = JSON.stringify({
      ease: 1,
      excitement: 5,
      novelty: 7
    });
    const ueqElement = await fixture(`<${AWESOME_BUTTON_TAG} name="${elName}" value='${initialValue}'></${AWESOME_BUTTON_TAG}>`);
    assert.instanceOf(ueqElement, UeqEmotion);
    // Value empty
    expect(ueqElement.getAttribute('value')).equal(initialValue);

    const shRoot = ueqElement.shadowRoot;
    const elContents = shRoot.querySelector('.container');
    expect(elContents.children.length).equal(9 * 8); // 7 + 2 elements per line; 8 lines
    expect(elContents.querySelectorAll('div.face').length).eq(7 * 8);

    // None selected
    expect(elContents.querySelectorAll('div.face.selected').length).eq(3);
  });

  it('displays correct elements when selecting', async () => {
    const elName = 'ueq-test';
    const ueqElement = await fixture(`<${AWESOME_BUTTON_TAG} name="${elName}"></${AWESOME_BUTTON_TAG}>`);
    assert.instanceOf(ueqElement, UeqEmotion);
    // Value empty
    expect(ueqElement.getAttribute('value')).equal('{}');

    const shRoot = ueqElement.shadowRoot;
    const elContents = shRoot.querySelector('.container');

    // None selected
    expect(elContents.querySelectorAll('div.face.selected').length).eq(0);

    // Select support - face 1
    elContents.querySelectorAll('div.face')[1].dispatchEvent(new Event('click'));
    await ueqElement.updateComplete;
    expect(elContents.querySelectorAll('div.face.selected').length).eq(1);
    expect(ueqElement.getAttribute('value')).equal('{"support":2}');

    // Select 2 more
    elContents.querySelectorAll('div.face')[10].dispatchEvent(new Event('click'));
    elContents.querySelectorAll('div.face')[23].dispatchEvent(new Event('click'));
    await ueqElement.updateComplete;
    expect(elContents.querySelectorAll('div.face.selected').length).eq(3);
    expect(ueqElement.getAttribute('value')).equal('{"support":2,"ease":4,"clarity":3}');

    // Reselect first
    elContents.querySelectorAll('div.face')[6].dispatchEvent(new Event('click'));
    await ueqElement.updateComplete;
    expect(elContents.querySelectorAll('div.face.selected').length).eq(3);
    expect(ueqElement.getAttribute('value')).equal('{"support":7,"ease":4,"clarity":3}');
  });

  it('displays correct elements when selecting with multi-field setting', async () => {
    const elName = 'ueq-test';
    const ueqElement = await fixture(`<${AWESOME_BUTTON_TAG} name="${elName}" multi-field></${AWESOME_BUTTON_TAG}>`);
    assert.instanceOf(ueqElement, UeqEmotion);
    // Value empty
    expect(ueqElement.getAttribute('value')).equal('{}');

    const shRoot = ueqElement.shadowRoot;
    const elContents = shRoot.querySelector('.container');
    expect(elContents.querySelectorAll('div.face.selected').length).eq(0);

    // Select support - face 1
    elContents.querySelectorAll('div.face')[1].dispatchEvent(new Event('click'));
    await ueqElement.updateComplete;
    expect(elContents.querySelectorAll('div.face.selected').length).eq(1);
    expect(ueqElement.getAttribute('value')).equal('{"support":2}');

    // Select 2 more
    elContents.querySelectorAll('div.face')[10].dispatchEvent(new Event('click'));
    elContents.querySelectorAll('div.face')[23].dispatchEvent(new Event('click'));
    await ueqElement.updateComplete;
    expect(elContents.querySelectorAll('div.face.selected').length).eq(3);
    let expectations = {
      'support':2,
      'ease':4,
      'clarity':3
    };
    expect(ueqElement.getAttribute('value')).equal(JSON.stringify(expectations));

    // Reselect first
    elContents.querySelectorAll('div.face')[6].dispatchEvent(new Event('click'));
    await ueqElement.updateComplete;
    expect(elContents.querySelectorAll('div.face.selected').length).eq(3);
    expectations = {
      'support':7,
      'ease':4,
      'clarity':3
    };
    expect(ueqElement.getAttribute('value')).equal(JSON.stringify(expectations));
  });

  it('Check form value (single element)', async () => {
    const elName = 'ueq-test';
    const initialValue = JSON.stringify({
      ease: 1,
      excitement: 5,
      novelty: 7
    });
    const tmp = await fixture(
        `<div><form name="foo"><${AWESOME_BUTTON_TAG} name="${elName}" value='${initialValue}'></${AWESOME_BUTTON_TAG}></form></div>`
    );
    const formEl = tmp.querySelector('form');
    const ueqElement = formEl.querySelector(AWESOME_BUTTON_TAG);
    expect(ueqElement.validity.valid).eq(false);
    expect(ueqElement.validity.valueMissing).eq(true);

    const faces = ueqElement.shadowRoot.querySelectorAll('div.face');
    faces[1].dispatchEvent(new Event('click')); // support
    faces[15].dispatchEvent(new Event('click')); // efficiency
    faces[22].dispatchEvent(new Event('click')); // clarity
    faces[36].dispatchEvent(new Event('click')); // interest
    faces[44].dispatchEvent(new Event('click')); // invention
    await ueqElement.updateComplete;

    expect(ueqElement.validity.valid).eq(true);
    expect(ueqElement.validity.valueMissing).eq(false);
    expect(formEl.elements[0].name).eq(elName);
    expect(formEl.elements[0].value).deep.equal({
      support: 2,
      ease: 1,
      efficiency: 2,
      clarity: 2,
      excitement: 5,
      interest: 2,
      invention: 3,
      novelty: 7
    });
  });

  it('Check form value (multi element)', async () => {
    const elName = 'ueq-test';
    const initialValue = JSON.stringify({
      ease: 1,
      excitement: 5,
      novelty: 7
    });
    const tmp = await fixture(
        `<div><form name="foo"><${AWESOME_BUTTON_TAG} name="${elName}" value='${initialValue}' multi-field></${AWESOME_BUTTON_TAG}></form></div>`
    );
    const formEl = tmp.querySelector('form');
    const ueqElement = formEl.querySelector(AWESOME_BUTTON_TAG);
    expect(ueqElement.validity.valid).eq(false);
    expect(ueqElement.validity.valueMissing).eq(true);

    const faces = ueqElement.shadowRoot.querySelectorAll('div.face');
    faces[1].dispatchEvent(new Event('click')); // support
    faces[15].dispatchEvent(new Event('click')); // efficiency
    faces[22].dispatchEvent(new Event('click')); // clarity
    faces[36].dispatchEvent(new Event('click')); // interest
    faces[44].dispatchEvent(new Event('click')); // invention
    await ueqElement.updateComplete;

    expect(ueqElement.validity.valid).eq(true);
    expect(ueqElement.validity.valueMissing).eq(false);
    expect(formEl.elements[0].name).eq(elName);
    expect(formEl.elements[0].value).deep.equal({
      support: 2,
      ease: 1,
      efficiency: 2,
      clarity: 2,
      excitement: 5,
      interest: 2,
      invention: 3,
      novelty: 7
    });
  });

});
