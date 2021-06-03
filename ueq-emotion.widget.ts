import {UeqContents, UeqEmotionOptions, UeqEmotionType} from './ueq-emotion.contents';
import value from '*.json';

const FACE_WIDTH = 70;

const createFace = (i: number, row: {name: string}) => {
  const mouthW = FACE_WIDTH / 2;
  const mouthL = FACE_WIDTH / 4;
  const percent = (i - 1) / 6;
  const hue = Math.floor(percent * 120);
  const mouthSouth = 20 + ((.5 - percent) * 10);
  const faceColor = `hsl(${hue},100%,50%)`;
  const mouthPath = `M ${mouthL} ${mouthSouth} Q ${mouthW} ${percent * 40} ${mouthL + mouthW} ${mouthSouth}`;
  const face = $(`<div class="face" style="background-color:${faceColor};">
    <svg class="mouth" width="60" height="50" xmlns="http://www.w3.org/2000/svg">
      <path class="line" d="${mouthPath}" stroke="black" fill="transparent" stroke-width="3"></path>
    </svg>
    <input type="radio" name="ueq_${row.name}" value="${i}" class="select_${i}" />
  </div>`);
  face.on('click', ($evt) => {
    let target = $($evt.target);
    if (! target.is('div.face')) {
      target = target.parents('div.face');
    }
    const input = target.find('input');
    // unselect all
    const rowInputs = $(`input[name=${input.attr('name')}]`);
    rowInputs.removeAttr('checked');
    input.attr('checked', 'checked').trigger('change');
    // Change face selection class
    rowInputs.parents('div.face').removeClass('selected');
    target.addClass('selected');
  });
  return face;
};

export function init(Survey: any, options?: UeqEmotionOptions) {
  // Default options: UEQ-S with german leichte Sprache
  options = Object.assign({
    type: UeqEmotionType.Short,
    language: 'de_LS'
  }, options);
  const widget = {
    // the widget name. It should be unique and written in lowcase.
    name: 'ueq-emotion',
    // the widget title. It is how it will appear on the toolbox of the SurveyJS Editor/Builder
    title: 'Use Experience Questionnaire with emotion fueled selections',
    // the name of the icon on the toolbox. We will leave it empty to use the standard one
    iconName: 'ueq-emotion',
    // The options
    options,
    // Get the rowContents
    rowContents: UeqContents[options.type],
    // If the widgets depends on third-party library(s) then here you may check if this library(s) is loaded
    widgetIsLoaded() {
      return true;
    },
    // SurveyJS library calls this function for every question to check, if it should use this widget instead of default rendering/behavior
    isFit(question) {
      // we return true if the type of question is textwithbutton
      return question.getType() === 'ueq-emotion';
    },
    // Use this function to create a new class or add new properties or remove unneeded properties from your widget
    // activatedBy tells how your widget has been activated by: property, type or customType
    // property - it means that it will activated if a property of the existing question type is set to particular value, for example
    // inputType = "date" type - you are changing the behaviour of entire question type. For example render radiogroup question differently,
    // have a fancy radio buttons customType - you are creating a new type, like in our example "textwithbutton"
    activatedByChanged(activatedBy) {
      // we do not need to check acticatedBy parameter, since we will use our widget for customType only
      // We are creating a new class and derived it from text question type. It means that text model (properties and fuctions) will be
      // available to us
      Survey.JsonObject.metaData.addClass('ueq-emotion', [], null, 'empty');

      // Add new property(s)
      // For more information go to https://surveyjs.io/Examples/Builder/?id=addproperties#content-docs
      Survey.JsonObject.metaData.addProperties('ueq-emotion', [
        { name: 'buttonText', default: 'Click Me' },
      ]);
    },
    // If you want to use the default question rendering then set this property to true. We do not need any default rendering, we will use
    // our our htmlTemplate
    isDefaultRender: false,
    // You should use it if your set the isDefaultRender to false
    htmlTemplate: '<div><table><tbody class="ueq-body"></tbody></table></div>',
    // The main function, rendering and two-way binding
    afterRender(question, el) {
      // el is our root element in htmlTemplate, is "div" in our case
      // get the text element
      const body = $(el).find('.ueq-body');
      // @ts-ignore
      const lang = require(`./i18n/${this.options.language}.json`);
      for (const row of this.rowContents) {
        const tr = $('<tr>');
        const col1 = $('<th>');
        col1.addClass('item').addClass('item-low').text(lang.translations[row.low]);
        tr.append(col1);
        for (let i = 1; i <= 7; i++) {
          const td = $('<td>');
          td.append(createFace(i, row));
          td.find('input').change(() => {
            const groupValues = $(el).find('input[type=radio]:checked');
            question.value = groupValues.get().reduce((all, cur) => {
              all[cur.getAttribute('name')] = $(cur).val();
              return all;
            }, {});
          });
          tr.append(td);
        }
        const colEnd = $('<th>');
        colEnd.addClass('item').addClass('item-high').text(lang.translations[row.high]);
        tr.append(colEnd);
        body.append(tr);
      }

      // set the changed value into question value
      const onValueChangedCallback = () => {
        if (typeof question.value === 'object') {
          Object.values(question.value).forEach((name, val) => {
            $(el).find(`input[type=radio][name=${name}]`).val(val);
          });
        }
      };
      const onReadOnlyChangedCallback = () => {
        if (question.isReadOnly) {
          $(body).find('input').attr('disabled', 'disabled');
        } else {
          $(body).find('input').removeAttr('disabled');
        }
      };
      // if question becomes readonly/enabled add/remove disabled attribute
      question.readOnlyChangedCallback = onReadOnlyChangedCallback;
      // if the question value changed in the code, for example you have changed it in JavaScript
      question.valueChangedCallback = onValueChangedCallback;
      // set initial value
      onValueChangedCallback();
      // make elements disabled if needed
      onReadOnlyChangedCallback();
    },
    // Use it to destroy the widget. It is typically needed by jQuery widgets
    willUnmount(question, el) {
      // We do not need to clear anything in our simple example
      // Here is the example to destroy the image picker
      // var $el = $(el).find("select");
      // $el.data('picker').destroy();
    },
    onValidateQuestion(sender, opts) {
      console.log(sender, opts);
    }
  };

  // Register our widget in singleton custom widget collection
  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, 'ueq-emotion');

  // Add custom validator
  const UeqEmotionValidator = (params) => {
    const val = Object.keys(params[0]);
    return UeqContents[params[1]].map(x => `ueq_${x.name}`).reduce((prev, cur) => prev && val.indexOf(cur) !== -1, true);
  };
  // Register custom widget validator
  Survey.FunctionFactory.Instance.register('UeqEmotionAspectsCheckedValidator', UeqEmotionValidator);
}
