import React, { Component } from 'react';
// POLYFILL
import 'intersection-observer';
import webpSupport from './webpSupport';

export default class LazyLoading extends Component {
  element = React.createRef();

  static defaultProps={
    webp: false,
    waitComplete: true,
    rootMargin: '0px 0px 0px 0px',
    threshold: 0
  };

  static defaultKeys = {
    default: 'src',
    sourcetag: 'srcset',
    defaultAttr: ['src', 'webpsrc'],
    placeHolderAttr: ['placeholder', 'webpplaceholder'],
  };

  static errorHandling = {
    documentation: 'Documentation: https://github.com/Marvin1003/react-lazily-img',
    message: {
      noChild: 'You forgot to pass a child. React Lazily IMG only works as wrapper.',
      altWarning: "Consider using an ALT-Text. It's important for SEO and accessibility",
      fallback: "Fallback - the non webp version is used even though this browser supports webp.",
      noWebpIMG: "You enabled WebP support. The Browser you are currently using also does but you didn't provide a webp image. Pass the webp version in the attribute: 'data-webpsrc'.",
      forgotPassIMG: "You probably forgot to pass the image."
    }
  };

  static errorMessage(message) {
    console.warn(`${message} ${LazyLoading.errorHandling.documentation}`);
  }

  componentDidMount() {
    // IN CASE THERE THIS.PROPS.CHILDREN IS NULL RETURN
    if(!this.element.current)
      return;

    this.getElement().then(() => this.createObserver(this.element));
  }
  
  componentDidCatch(error, info) {
    console.log(error, info);
  }

  async getElement() {
    if(this.props.webp)
      await this.checkWebp();
    else 
      this.webp = this.props.webp;

    // IF MULTIPLE IMAGES NESTED INSIDE ON WRAPPER
    this.elements = this.element.current.querySelectorAll('[data-type="lazy"]');

    // IF PICTURE TAG IS USED
    this.pictureSources = this.element.current.querySelectorAll('[data-srcset]');

    this.element = this.elements && this.elements.length > 0 ? this.elements : [this.element.current];

    if(this.element[0].tagName !== 'PICTURE') 
      this.checkAltAndPlaceholder(this.element);
    else if(this.pictureSources) 
      this.checkAltAndPlaceholder(this.pictureSources[0].parentNode.childNodes);
  }

  checkAltAndPlaceholder(elements) {
    elements.forEach((el) => {
      this.checkAlt(el);
      if(el.dataset.placeholder && el.tagName === 'SOURCE') 
        this.dataToSrc(el, LazyLoading.defaultKeys.sourcetag, LazyLoading.defaultKeys.placeHolderAttr);
      else 
        el.dataset.placeholder 
          && this.dataToSrc(el, LazyLoading.defaultKeys.default, LazyLoading.defaultKeys.placeHolderAttr);
    });
  }

  async checkWebp() {
    this.webp = await webpSupport();
    return this.webp;
  }

  checkAlt(el) {
    // WARN IF NO ALT TEXT IS SET
    if(el.tagName === 'IMG' && !el.alt) 
      LazyLoading.errorMessage(LazyLoading.errorHandling.message.altWarning);
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
        // WAITCOMPLETE NOT YET SUPPORTED FOR PICTURE - COMING SOON
        this.props.waitComplete && this.pictureSources.length === 0
          ? this.lazyLoading(entry.target)
          : this.applySource(entry.target);
        
        this.observer.unobserve(entry.target);
      }
    })
  }

  async lazyLoading(el) {
    // LOAD MASTER IMAGE
    const image = new Image();
    image.src = this.getSource(el, LazyLoading.defaultKeys.defaultAttr);
    console.log(image.src);
    image.onload = () => this.applySource(el);
  }

  applySource = (el) => {
    if(!el.dataset.src) {
      this.pictureSources.forEach((source) => (
        this.dataToSrc(source, LazyLoading.defaultKeys.sourcetag, [LazyLoading.defaultKeys.sourcetag], true)
      ));
      el = el.querySelector('img')
    }

    this.dataToSrc(el, LazyLoading.defaultKeys.default, LazyLoading.defaultKeys.defaultAttr);
    
    this.props.callback && this.props.callback();
  }

  dataToSrc(el, srcKey, dataKeys, pictureTag) {
    const src = this.getSource(el, dataKeys, pictureTag);

    switch(el.tagName) {
      // FALL-THROUGH
      case 'SOURCE':
      case 'IMG':
        el[srcKey] = src;
        break;
      default:
        el.style.backgroundImage = `url(${src})`;
    }
  }

  getSource(el, key, pictureTag = false) {
    if((!this.props.webp || !this.webp || pictureTag)) {
      if(!el.dataset[key[0]]) 
        LazyLoading.errorMessage(LazyLoading.errorHandling.message.forgotPassIMG);
      else 
        return el.dataset[key[0]];

      } else {
      if(!el.dataset[key[1]]) {
        LazyLoading.errorMessage(LazyLoading.errorHandling.message.noWebpIMG);
        // FALLBACK IF PROVIDED
        if(el.dataset[key[0]]) {
          LazyLoading.errorMessage(LazyLoading.errorHandling.message.fallback);
          return el.dataset[key[0]];
        }
      }
      else 
        return el.dataset[key[1]];
    }
  }

  render() {
    if(this.props.children)
      return (
        React.cloneElement(React.Children.only(this.props.children), { ref: this.element })
      );
    else {
      LazyLoading.errorMessage(LazyLoading.errorHandling.message.noChild);
      return null;
    }
  }
}
