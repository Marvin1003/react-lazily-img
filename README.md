# React Lazily IMG
**React Lazily IMG** is React Wrapper Component to lazy load images. The goal ist to use the convenient and known standard HTML tags and just have them lazily loaded.

# Features
* **Webp detection**
* **Placeholder** 
* **Picture tag support**
* **SRC && Background image support**
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
```
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

import Placeholder from './images/3.jpg';
import PlaceholderWebp from './images/3.webp';

const options = {
  // waits until image is fully downloaded before render if set to true. Not yet supported for the picture tag
  waitComplete: true, 
  // ship a webp version of the picture in supported browser
  webp: true
};

const App (props) => (
  <div className="App">
    <Lazy {...options}>
      <picture>
        <source media="(min-width:600px)" data-srcset={Image1} />
        <source media="(min-width:500px)" data-srcset={Image2} />
        <source type="image/webp" media="(min-width:600px)" data-srcset={Image1WebP} />
        <source type="image/webp" media="(min-width:500px)" data-srcset={Image2WebP} />
        <img data-src={Image3} data-webpsrc={Image3WebP} alt="butterfly" />
      </picture>
    </Lazy>
  </div>
);
```
### IMG tag
```
<Lazy {...options}>
  // data-webpsrc and the optional data-webpplaceholder are only needed 
  // if you enable webp detection in the options

  // placeholder are optional. Image that is shown until the image is in the viewport

  <img data-placeholder={Placeholder} data-webpplaceholder={PlaceholderWebp} data-src={Image1} data-webpsrc={Image1WebP} alt="butterfly />
</Lazy>
```
### DIV tag - CSS background
```
<Lazy {...options}>
  <div data-src={Image1} data-webpsrc={Image1WebP} />
</Lazy>
```
### Placeholder
A placeholder is an image that is shown until the image is in the viewport.
data-webpsrc and the optional data-webpplaceholder are only needed if you enable webp detection in the options.
```
<Lazy {...options}>
  <img data-placeholder={Placeholder} data-webpplaceholder={PlaceholderWebp} data-src={Image1} data-webpsrc={Image1WebP} alt="butterfly />
</Lazy>
```
### Multiple images in one wrapper
Every image needs the data-type="lazy" and if you have you use a picture tag the img inside needs the data-type="lazy".
You also need to wrap it in another container.
```
<Lazy {...options}>
  <div>
    <img data-type="lazy" data-src={Image1} alt="butterfly />
    <div data-type="lazy" data-src={Image1} />
    <picture>
      <source media="(min-width:600px)" data-srcset={Image1} />
      <source media="(min-width:500px)" data-srcset={Image2} />
      <img data-src={Image3} data-type="lazy" alt="butterfly" />
    </picture>
  </div>
</Lazy>
```
## options
Coming soon.

# Polyfill
For the full support [IntersectionObserver polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) is used.