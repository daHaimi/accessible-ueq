# Accessible UEQ(S) WebComponent

<p align="center">
  <img src="https://github.com/daHaimi/accessible-ueq/actions/workflows/build-wc.yml/badge.svg" alt="Build WebComponent" />
  <a href="https://app.fossa.com/projects/git%2Bgithub.com%2FdaHaimi%2Faccessible-ueq?ref=badge_shield" alt="FOSSA Status"><img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2FdaHaimi%2Faccessible-ueq.svg?type=shield"/></a>
  <a href="https://www.npmjs.com/package/accessible-ueq"><img src="https://img.shields.io/npm/v/accessible-ueq.svg" alt="NPM Version"></a>
  <a href="https://www.webcomponents.org/element/accessible-ueq"><img src="https://img.shields.io/badge/webcomponents.org-published-blue.svg" alt="Published on webcomponents.org" /></a>
</p>

This repository provides a more accessible version of the [UEQ-S](https://www.ueq-online.org) through usage with emotional bonding ([Publication](https://doi.org/10.1145/3473856.3473990)) [![DOI:10.1145/3473856.3473990](https://zenodo.org/badge/DOI/10.1145/3473856.3473990.svg)](https://doi.org/10.1145/3473856.3473990).
This widget uses smileys to link emotions to the UEQ tiers.
The development focused on the UEQ-S, if you are looking for the full UEQ, please visit [https://github.com/daHaimi/ueq-element](https://github.com/daHaimi/ueq-element).

You can use the accessible UEQ-S in any web application as a [WebComponent](https://www.webcomponents.org/).
You need to do is import the javascript file and use the custom HTML element.

This WebComponent implements the [ElementInternals](https://yari-demos.prod.mdn.mozit.cloud/en-US/docs/Web/API/ElementInternals) interface
to allow for using the element in classic HTML forms. A plain javascript API is also exposed.

# Getting started
## Using a CDN
You can use the accessible UEQ-S on your website without installing anything using [jsDelivr](https://www.jsdelivr.com):

1. Include and use it in your HTML
```html
...
<head>
    <script type="module" src="https://cdn.jsdelivr.net/npm/accessible-ueq/dist/ueq-emotion.webcomponent.mjs"></script>
</head>
...
<body>
...
    <ueq-emotion name="form-element-name"></ueq-emotion>
...
</body>
```
 
## Using `npm`
1. Install via npm: `npm i accessible-ueq`
2. Import and use in your html:
```html
...
<head>
    <script type="module" src="./node_modules/accessible-ueq/dist/ueq-emotion.webcomponent.mjs"></script>
</head>
...
<body>
...
    <ueq-emotion name="form-element-name"></ueq-emotion>
...
</body>
```

## Receiving data
### Classic HTML
You can use the element inside any HTML `<form>`-element, like an `<input>`.
The provided values will be submitted as JSON-encoded string in the form
```json
{
  "support": <number>,
  "ease": <number>,
  "efficiency": <number>,
  "clarity": <number>,
  "excitement": <number>,
  "interest": <number>,
  "invention": <number>,
  "novelty": <number>
}
```
with numbers from `1 - 7` depending on the selection.

### Access via Javascript
If you want to access the values via javascript rather than submitting an HTML form,
the `value` property will return a javascript object rather than a JSON string.
```javascript
function getUeqValues() {
  const data = document.querySelector('ueq-emotion[name="form-element-name"]').value;
  // data is provided as Javascript object
  console.log(data);
}
``` 

## Live Example
<!--
```
<custom-element-demo>
  <template>
    <script type="module" src="https://cdn.jsdelivr.net/npm/accessible-ueq/dist/ueq-emotion.webcomponent.mjs"></script>
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<ueq-emotion name="ueq-sample" locale="de_LS"></ueq-emotion>
```

## Attributes
There is a set of attributes you can use to personalize your ueq-s

| Attribute     | Mandatory | Type   | Default | Description |
| ------------- | --------- | ------ | ------- | ----------- |
| `name`        | __yes__   | string | -       | Name of the form element. Must conform [`name` attribute specifications for `input` elements](https://www.w3.org/TR/html52/sec-forms.html#naming-form-controls-the-name-attribute). |
| `locale`      | no        | string | en_US   | Locale to be used for translation. |
| `value`       | no        | string | {}      | Set initial value of the element. Must be a JSON-object |
| `multi-field` | no        | bool   | false   | Activates [Multi-Field setting](#multi-field) |
| `type`        | no        | string | 'Short' | Selects if the UEQ-Short should be used or the full UEQ (_not implemented_) |

## Multi-Field
The default behaviour converts all questions into a single form-field containing all values as JSON-string.
If you want to get the single values as separate form fields, you can use the `multi-field` attribute:
```html
 <ueq-emotion name="my-ueq" multi-field></ueq-emotion>
```
This will submit every modality as a single form value in the format:
```javascript
my-ueq[support] = <number>
my-ueq[ease] = <number>
my-ueq[efficiency] = <number>
my-ueq[clarity] = <number>
my-ueq[excitement] = <number>
my-ueq[interest] = <number>
my-ueq[invention] = <number>
my-ueq[novelty] = <number>
```

Accessing the value through javascript will however still deliver a JS-object in the default format.

## Styling
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
        --ueq-border-highlight: green; /* default: #0000ff */
        
        /* Background color of the full element if not valid */
        --ueq-error-highlight: red; /* default: none */
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

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FdaHaimi%2Faccessible-ueq.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FdaHaimi%2Faccessible-ueq?ref=badge_large)
