import { Injectable, Inject } from '@angular/core';
import { Meta,Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
declare var seoData:any;
@Injectable()
export class SeoService {

  constructor(private title:Title,private meta: Meta, @Inject(DOCUMENT) private doc) { }

  generateTags(config) {
    config = config || {};
    this.meta.updateTag({ name: 'description', content: config.description || seoData.default.description });
    this.title.setTitle(config.title || seoData.default.title);
    this.createLinkForCanonicalURL();
  }

  createLinkForCanonicalURL() {
    let link: HTMLLinkElement = this.doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.doc.head.appendChild(link);
    link.setAttribute('href', this.doc.URL);
  }





}