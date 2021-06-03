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

# License
This has been released under [MIT license](LICENSE).
