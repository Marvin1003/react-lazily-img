# React Lazily IMG
**React Lazily IMG** is a React Wrapper Component to lazily load images. The goal is to use the convenient and known standard HTML tags and just have them lazily loaded.

# Features
* **Picture tag and IMG srcset support**
* **Webp detection**
* **Placeholder** 
* **HTML && CSS image support**
* **First render when image is downloaded**
* **Customize percentage of visibility**
* **Custom Callback when image is rendered**

# Installation
`npm install react-lazily-img --save`

# Demo
Coming soon.

# How does it work ?
**React Lazily IMG** is powered by the performant Intersection Observer API. No need of annoying unperformant scroll event listeners and elem.getBoundingClientRect() to check if an element is in the viewport.

MDN: 
>The Intersection Observer API provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or with a top-level document's viewport.

# Documentation

## Code examples
### Picture tag
```jsx
import React from 'react';

// import React Lazily IMG
import Lazy from 'react-lazily-img';

// import images
import Image1 from './images/1.jpg';
import Image1WebP from './images/1.webp';

import Image2 from './images/2.jpg';
import Image2WebP from './images/2.webp';

import Image3 from './images/3.jpg';
import Image3WebP from './images/3.webp';

import Placeholder from './images/placeholder.jpg';
import PlaceholderWebp from './images/placeholder.webp';

// You dont need to set webp to true when working with a picture tag as its has a webp detection on its own. 

const options = {
  waitComplete: false, 
  webp: false
};

const App (props) => (
  <div className="App">
    <Lazy {...options}>
      <picture>
        <source type="image/webp" media="(min-width:600px)" data-srcset={Image1WebP} />
        <source type="image/webp" media="(min-width:500px)" data-srcset={Image2WebP} />
        <source media="(min-width:600px)" data-srcset={Image1} />
        <source media="(min-width:500px)" data-srcset={Image2} />
        <img data-src={Image3} data-webpsrc={Image3WebP} alt="butterfly" />
      </picture>
    </Lazy>
  </div>
);
```
### IMG srcset
```jsx
<Lazy {...options}>
  <img 
    data-srcset={`
      ${Image1} 320w,
      ${Image3} 480w,
      ${Image2} 800w`}
    data-webpsrcset={`
      ${Image1WebP} 320w,
      ${Image3WebP} 480w,
      ${Image2WebP} 800w`}
    sizes="
      (max-width: 320px) 280px,
      (max-width: 480px) 440px,
      800px"
    alt="butterfly"
    data-src={Image1}
    data-webpsrc={Image1WebP}
  /> 
</Lazy>
```
### IMG tag
```jsx
<Lazy {...options}>
  // data-webpsrc and the optional data-webpplaceholder are only needed 
  // if you enable webp detection in the options

  // placeholder are optional. Image that is shown until the image is in the viewport

  <img data-placeholder={Placeholder} data-webpplaceholder={PlaceholderWebp} data-src={Image1} data-webpsrc={Image1WebP} alt="butterfly" />
</Lazy>
```
### DIV tag - CSS background
```jsx
<Lazy {...options}>
  <div data-src={Image1} data-webpsrc={Image1WebP} />
</Lazy>
```
### Placeholder
A placeholder is an image that is shown until the image is in the viewport.
data-webpsrc and the optional data-webpplaceholder are only needed if you enable webp detection in the options.
```jsx
<Lazy {...options}>
  <img data-placeholder={Placeholder} data-webpplaceholder={PlaceholderWebp} data-src={Image1} data-webpsrc={Image1WebP} alt="butterfly" />
</Lazy>
```
### Multiple images in one wrapper
You can also place multiple images in one wrapper
```jsx
<Lazy {...options}>
  <img data-src={Image1} alt="butterfly" />
  <div data-src={Image1} />
  <picture>
    <source media="(min-width:600px)" data-srcset={Image1} />
    <source media="(min-width:500px)" data-srcset={Image2} />
    <img data-src={Image3} alt="butterfly" />
  </picture>
</Lazy>
```
## options
|Option|Description|value|default|
|:-----|:-----|:-----|:-----|
|`waitComplete`|Wait until the image is fully downloaded before rendering. Doesn't yet support the picture tag.|bool|`true`|
|`webp`|Ship a webp version if Browser supports it. No need to enable it when working with picture tag as it has its own detection (`type="image/webp"` - see code examples.). You need to pass the webp version of your picture in `data-webpsrc={Image}`.|bool|`false`|
|`hideTillRender`|Hides the image until its rendered as you would otherwise see the alt tag.|bool|`true`|
|`clearAttribute`|Clear the data-attributes you used to pass the image after its rendered.|bool|`true`|
|`callback`|Takes a custom callback thats executed after the image is rendered.|func|`null`|
|`root`|The element that is used as the viewport to check the visiblity of a target.|elem|browser viewport|
|`rootMargin`|Similair to the CSS 'margin' property. It manipulates the elements bounding box. Same syntax as in CSS with either an absolute length or a percentage.|px \|\| %|`0px 0px 0px 0px`|
|`threshold`|Indicate at what percentage of the target's visibility the observer's callback should be executed. i.e at an visibility above 50%: `0.5`|num (0 -> 1)|`0`|

### Example
```jsx
const options = {
  waitComplete: true, 
  webp: true
  hideTillRender: true,
  clearAttributes: true,
  callback: () => console.log("Rendered!"),
  root: document.querySelector('#scrollArea'),
  rootMargin: '50px 0px',
  threshold: 0.75
};

<Lazy {...options}>
  // image
</Lazy>
```


# Polyfill
For the full support [IntersectionObserver polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) is used.