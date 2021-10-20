export function init(Survey: any, options?: { type: string, language: string }) {
  // Default options: UEQ-S with german leichte Sprache
  options = Object.assign({
    type: 'Short',
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
    htmlTemplate: `<ueq-emotion name="ueq-internal" type="${options.type}" locale="${options.language}"></ueq-emotion>`,
    // The main function, rendering and two-way binding
    afterRender(question, el) {
      // set the changed value into question value
      el.addEventListener('click', () => {
        question.value = el.value;
      });
      const onValueChangedCallback = () => {};
      const onReadOnlyChangedCallback = () => {
        if (question.isReadOnly) {
          el.setAttribute('disabled', 'disabled');
        } else {
          el.removeAttribute('disabled');
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
}
