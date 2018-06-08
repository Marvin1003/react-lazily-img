import React, { Component } from 'react';
// POLYFILL
import 'intersection-observer';
import './test.css';
import webpSupport from './webpSupport';

export default class LazyLoading extends Component {
  static defaultProps={
    webp: false,
    waitComplete: true,
    rootMargin: '0px 0px 0px 0px',
    threshold: 0
  }

  element = React.createRef();

  componentDidMount() {
    this.getElement().then(() => this.createObserver(this.element));
  }

  async getElement() {
    await this.checkWebp();

    this.elements = this.element.current.querySelectorAll('[data-type="lazy"]');
    this.pictureSources = this.element.current.querySelectorAll('[data-srcset]');


    if(this.pictureSources.length > 0) {
      this.pictureWebpSources = [...this.element.current.querySelectorAll('[type="image/webp"]')];
      if(this.pictureWebpSources.length > 0 && this.webp) {
        this.pictureSources.forEach((source) => (
          !this.pictureWebpSources.includes(source) && source.parentNode.removeChild(source))
        );
      }
    }

    this.element = this.elements && this.elements.length > 0 ? this.elements : [this.element.current];
    this.element.forEach((el) => {
      this.checkAlt(el);
      el.dataset.placeholder && this.noResponsiveImages(el, ['placeholder', 'webpplaceholder']);
    });
  }

  async checkWebp() {
    this.webp = await webpSupport();
    return this.webp;
  }

  checkAlt(el) {
    // WARN IF NO ALT TEXT IS SET
    if(el.tagName === 'IMG' && !el.alt) 
      console.warn("Consider using an ALT-Text. It's important for SEO and accessibility.");
  }

  createObserver(targets) {
    const options = { rootMargin: this.props.rootMargin, threshold: this.props.threshold } || { };

    this.observer = new IntersectionObserver(this.callback, options);
    targets.forEach((target) => this.observer.observe(target));
  }

  
  callback = (entries) => {
    entries.forEach((entry) => {
      if(entry.isIntersecting) {
        // IF WAIT COMPLETE IS ON WAIT UNTIL IMAGE IS FULLY LOADED BEFORE RENDER
        // ELSE INSTANTLY RENDER THE IMAGE
        this.props.waitComplete 
          ? this.lazyLoading(entry.target)
          : this.applySource(entry.target);
        
        this.observer.unobserve(entry.target);
      }
    })
  }

  async lazyLoading(el) {
    // LOAD MASTER IMAGE
    const image = new Image();
    image.src = this.src;
    image.onload = () => this.applySource(el);
  }

  applySource = (el) => {
    if(el.dataset.src)
      this.noResponsiveImages(el, ['src', 'webpsrc']);
    else {
      this.pictureSources.forEach((source) => (
        source.srcset = source.getAttribute('data-srcset'), source.removeAttribute('data-srcset')
      ));
    }

    this.props.callback && this.props.callback();
  }

  noResponsiveImages(el, key) {
    const src = !this.props.webp || !this.webp ? el.dataset[key[0]] : el.dataset[key[1]];

    switch(el.tagName) {
      case 'IMG': 
        el.src = src;
        break;
      default:
        el.style.backgroundImage = `url(${src})`;
    }
  }

  render() {
    return (
      React.cloneElement(React.Children.only(this.props.children), { ref: this.element })
    );
  }
}
