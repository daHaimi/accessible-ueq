# SurveyJS Accessible UES-S
A more accessible version of the [UEQ-S](https://www.ueq-online.org) as [SurveyJS](https://surveyjs.io) custom element.

This widget uses smileys as an approach to link emotions to the UEQ-S tiers.

## Usage with angular
The general usage of custom elements is displayed on [SurveyJS Angular CLI](https://github.com/surveyjs/surveyjs_angular_cli).

To add the accessible UEQ-S to you survey, just add this project to your `components` folder and edit your `survey.component.ts`:
```typescript
...
import * as Survey from 'survey-angular';
import {init as initUeqWidget} from './surveyjs-accessible-ueqs/ueq-emotion.widget';
import {UeqEmotionType} from './surveyjs-accessible-ueqs/ueq-emotion.contents';
...
initUeqWidget(Survey, {
  type: UeqEmotionType.Short,
  'en_US'
});

```
Now you can simply add the widget to your survey's HTML:
```html
<survey [json]="json"></survey>
```
and Typescript:
```typescript
  json = {
    title: 'My accessible survey',
    pages: [
      {
        questions: [
          {
            type: 'ueq-emotion',
            name: 'my-emotional-ueqs',
            title: 'Please rate the system you just have been showed',
            validators: [
              {
                type: 'expression',
                text: 'Please provide a rating for every line',
                expression: 'UeqEmotionAspectsCheckedValidator({my-emotional-ueqs}, Short)'
              }
            ]
          }
        ]
      }
    ]
  };
```

## Usage as a web component
You can use the accessible UEQ-S in any web application as a [WebComponent](https://www.webcomponents.org/).
All you need to do is import the javascript file and use the custom HTML element:

1. Install via npm: `npm i surveyjs-accessible-ueqs`
2. Import and use in yout html:
```html
...
<head>
    <script src="./node_modules/surveyjs-accessible-ueqs/dist/ueq-emotion.webcomponent.js"></script>
</head>
...
<body>
...
    <ueq-emotion name="form-element-name"></ueq-emotion>
...
</body>
```

### Styling
The accessible UEQ-S is designed to be accessible as far as possible, even from color schemes.
However, for some applications, it may be necessary to change sizes or colors.
This can be done by setting the elements' css variables. This is even possible per element:
```html
<style>
    /* setting global style */
    ueq-emotion {
        /* Size of an individual smiley face. All sizes will be calculated based on this. */
        --ueq-face-size: 2em; /* default: 4em */
        
        /* Border color of the smiley face. */
        --ueq-border-normal: maroon; /* default: #000000 */
        
        /* Border color of the selected smiley face. */
        --ueq-border-normal: green; /* default: #0000ff */
    }
    .giant-faces {
        --ueq-face-size: 100px;
    }
</style>

<!-- Using global styles -->
<ueq-emotion></ueq-emotion>

<!-- Using "giant-faces" class style -->
<ueq-emotion class="giant-faces"></ueq-emotion>

```

# License
This has been released under [MIT license](LICENSE).
