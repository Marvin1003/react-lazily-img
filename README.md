# React Lazily IMG
**React Lazily IMG** is React Wrapper Component to lazy load images. The goal ist to use the convenient known standard HTML tags and just have them lazily loaded.

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
**React Lazily IMG** is powered by the powerful Intersection Observer API. No need of annoying unperformant scroll event listeners and elem.getBoundingClientRect() to check if an element is in the viewport.

MDN: 
>The Intersection Observer API provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or with a top-level document's viewport.

# Documentation

## Code examples
```
import React, { Component } from 'react';
// import React Lazily IMG
import Lazy from 'react-lazily-img';

// import images
import Image1 from './images/1.jpg';
import Image1WebP from './images/1.webp';
import Image1 from './images/2.jpg';
import Image1WebP from './images/2.webp';
import Placeholder from './images/3.jpg';
import PlaceholderWebp from './images/3.webp';

const options = {
  // waits until image is fully downloaded before render if set to true. Not yet supported for the picture tag
  waitComplete: true, 
  // ship a webp version of the picture in supported browser
  webp: true
};

class App extends Component {
  render() {
    return (
      <div className="App">

        <Lazy {...options}>
          <picture>
            <source media="(max-width:799px)" data-srcset={Image1} />
            <source media="(min-width:800px)" data-srcset={Image2} />
            <source type="image/webp" media="(max-width:799px)" data-srcset={Image1WebP} />
            <source type="image/webp" media="(min-width:800px)" data-srcset={Image2WebP} />
            // standard source not yet supported. Comming soon
            <img alt="butterfly" />
          </picture>
        </Lazy>

        <Lazy {...options}>
          // data-webpsrc and data-webpplaceholder only needed 
          // if you enabled webp detection enabled in the options

          // placeholder are optional. Image that are shown until the image is in the viewport

          <img data-placeholder={Placeholder} data-webpplaceholder={PlaceholderWebp} data-src={Image1} data-webpsrc={Image1WebP} alt="butterfly />
        </Lazy>

        // You can also wrap multiple picture in one wrapper but then 
        // you need to wrap it in another container and give every image the data-type="lazy" attribute
        <Lazy {...options}>
          <div>
            <img data-type="lazy" data-src={Image1} alt="butterfly />
            <div data-type="lazy" data-src={Image1} alt="butterfly />
            <picture>
            <source media="(max-width:799px)" data-srcset={Image1} />
            <source media="(min-width:800px)" data-srcset={Image2} />
            // standard source not yet supported. Comming soon
            <img data-type="lazy" alt="butterfly" />
          </picture>
          </div>
        </Lazy>
      </div>
    );
  }
}

export default App;
```
## options
Coming soon.

# Polyfill
For the full support [IntersectionObserver polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) is used.