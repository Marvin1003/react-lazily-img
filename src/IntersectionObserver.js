import React, { Component } from 'react';
// POLYFILL
import 'intersection-observer';
// WEBP SUPPORT DETECTION
import webpSupport from './webpSupport';
// ERROR MESSAGES
import error from './error';

export default class LazyLoading extends Component {
  element = React.createRef();
  count = React.Children.count(this.props.children);

  static defaultProps={
    webp: false,
    waitComplete: true,
    hideTillRender: true,
    clearAttributes: true,
    callback: null,
    root: null,
    rootMargin: '0px',
    threshold: 0
  };

  static defaultKeys = {
    default: 'src',
    responsiveImages: ['srcset', 'webpsrcset'],
    defaultAttr: ['src', 'webpsrc'],
    placeholderAttr: ['placeholder', 'webpplaceholder'],
  };
  
  componentDidMount() {
    // IN CASE THIS.PROPS.CHILDREN IS NULL RETURN
    if(!this.props.children || this.count > 1)
      return;

    this.getElement().then(() => this.createObserver(this.element));
  }
  
  async getElement() {
    this.webp = this.props.webp ? await webpSupport() : this.props.webp;

    // FOR RESPONSIVE IMAGES (PICTURE tag / IMG srcset)
    const srcset = this.element.current.querySelectorAll('[data-srcset]');

    this.responsiveImages = 
      srcset.length > 0 ? srcset : Boolean(this.element.current.dataset.srcset) ? [this.element.current] : null;

    this.element = [this.element.current];

    this.checkAlt();
  }

  checkPlaceholder(elements) {
    elements.forEach((el) => {
      if(el.tagName === 'PICTURE') 
        el.childNodes.forEach((source) => {
          this.dataToSrc(source, LazyLoading.defaultKeys.defaultKesys, LazyLoading.defaultKeys.placeholderAttr);
        });
      else
        this.dataToSrc(el, LazyLoading.defaultKeys.default, LazyLoading.defaultKeys.placeholderAttr);
    });
  }

  checkAlt() {
    // WARN IF NO ALT TEXT IS SET
    this.element.forEach((el) => {
      if((el.tagName === 'PICTURE' && !Boolean(el.querySelector('img').alt)) ||
         (el.tagName === 'IMG' && !el.alt)) 
          error('altWarning');
    })
  }

  createObserver(targets) {
    const options = { 
      root: this.props.root, 
      rootMargin: this.props.rootMargin, 
      threshold: this.props.threshold
    };

    this.observer = new IntersectionObserver(this.callback, options);
    targets.forEach((target) => this.observer.observe(target));
  }

  callback = (entries) => {
    entries.forEach((entry) => {
      if(entry.isIntersecting) {
        // IF WAIT COMPLETE IS ON WAIT UNTIL IMAGE IS FULLY LOADED BEFORE RENDER
        // ELSE INSTANTLY RENDER THE IMAGE
        // WAITCOMPLETE NOT YET SUPPORTED FOR PICTURE - COMING SOON
        this.props.waitComplete && !Boolean(this.responsiveImages)
          ? this.lazyLoading(entry.target)
          : this.applySource(entry.target);
        
        this.observer.unobserve(entry.target);
      } else 
        // ONLY SHOW PLACEHOLDER IF ELEMENT IS NOT IN THE VIEWPORT -- TO PREVENT IMAGE FLASHING
        this.checkPlaceholder(this.element);
    })
  }

  lazyLoading(el) {
    // RENDER WHEN FULLY DOWNLOADED - (WAITCOMPLETE)
    const image = new Image();
    image.src = this.getSource(el, LazyLoading.defaultKeys.defaultAttr);
    image.onload = () => this.applySource(el);
  }

  applySource = (el) => {
    if(el.hasAttribute('data-srcset')) 
        this.dataToSrc(el, LazyLoading.defaultKeys.responsiveImages[0], LazyLoading.defaultKeys.responsiveImages);
    else if(el.tagName === 'PICTURE') {
      this.responsiveImages.forEach((source) => (
        this.dataToSrc(source, LazyLoading.defaultKeys.responsiveImages[0], LazyLoading.defaultKeys.responsiveImages)
      ));
      el = el.querySelector('img')
    } 

    this.dataToSrc(el, LazyLoading.defaultKeys.default, LazyLoading.defaultKeys.defaultAttr);
    
    this.props.callback && this.props.callback();
  }

  dataToSrc(el, srcKey, dataKeys) {
    const src = this.getSource(el, dataKeys);

    if(Boolean(src)) {
      switch(el.tagName) {
        // FALL-THROUGH
        case 'SOURCE':
        case 'IMG':
          el[srcKey] = src;
          break;
        default:
          el.style.backgroundImage = `url(${src})`;
      }

      this.props.clearAttributes && this.clearAttributes(el, dataKeys);

      (this.props.hideTillRender && !this.alreadyVisible) 
      && this.element.forEach((el) => el.style.visibility = 'visible', this.alreadyVisible = true);
    }
  }

  getSource(el, key) {
    if((!this.webp)) {
      if(!el.dataset[key[0]]) 
        error('forgotPassIMG');
      else 
        return el.dataset[key[0]];
      } else {
      if(!el.dataset[key[1]]) {
        error('noWebpIMG');
        // FALLBACK IF PROVIDED
        if(el.dataset[key[0]]) {
          error('fallback');
          return el.dataset[key[0]];
        }
      }
      else 
        return el.dataset[key[1]];
    }
  }

  clearAttributes(el, key) {
    key = Array.isArray(key) ? key : [key];
    key.forEach((datakey) => (
      el.dataset[datakey] && el.removeAttribute(`data-${datakey}`)
    ));
  }

  render() {
    if(this.count === 1)
      return (
        React.cloneElement(React.Children.only(this.props.children), 
        { ref: this.element, style: { visibility: this.props.hideTillRender ? 'hidden' : '' } })
      );
    else if(this.count > 1) 
      return (
        React.Children.map(this.props.children, (child) => (
          <LazyLoading {...this.props}>
            {child}
          </LazyLoading>
        ))
      )
    else {
      error('noChild');
      return null;
    }
  }
}
