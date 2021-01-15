import { Injectable } from "@angular/core";

@Injectable()
export class LocalStorageService {
  private localstorage = window.localStorage;
  getValue (key: string) {
    let result = (this.localstorage) ? localStorage.getItem(key) : '';
    return result;
  }

  setValue (key: string, value: any) {
    // if (!localStorage.getItem(key)) {
      
    // } else {
    //   localStorage.key = value
    // }
    localStorage.setItem(key, value)
  }

  deleteKey (key: string) {
    localStorage.removeItem(key)
  }

  deleteAll () {
    localStorage.clear()
  }
}