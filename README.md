# React Lazily IMG
**React Lazily IMG** is React Wrapper Component to lazy load images. The goal ist to use the powerful HTML tags like <Picture> and let the wrapper do the work.

# Features
* **WebP detection**
* **Placeholder** 
* **Picture tag support**
* **SRC && Background image support**
* **First render when image is downloaded**
* **Customize percentage of visibility**
* **Custom Callback when image is rendered**

# Demo
Coming soon.

# How does it work ?
**React Lazily IMG** is powered by the powerful Intersection Observer API. No need of annoying unperformant scroll event listeners and elem.getBoundingClientRect() to check if an element is in the viewport.

MDN: 
>The Intersection Observer API provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or with a top-level document's viewport.

# Documentation
Coming soon.

# Polyfill
For the full support [IntersectionObserver polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) is used.