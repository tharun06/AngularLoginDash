import { Injectable } from '@angular/core';
import * as UserStore from './test-users';
import * as TextEncoding from 'text-encoding';

@Injectable()
export class LocalLoginStrategyService {

  constructor() {
    this.userStore = UserStore.default;
  }

  userStore: any;
  encoder = new TextEncoder('utf-8');
  crypto: SubtleCrypto = window.crypto.subtle;

  attemptLogin(username, password): Promise<any> {
    let users = this.userStore.filter((user) => user.username === username);
    if (users.length < 1) return Promise.reject(`No user found for ${username}`);
    let user = users[0];
    return this.verifyPassword(password, user.password).then((result) => {
      if (result) return user;
      else return Promise.reject('Incorrect password');
    });
  }

  parseHexString(str) { 
    return new Uint8Array(16).map((val, index) => {
      return parseInt(`0x${str[index * 2]}${str[index * 2 + 1]}`);
    }).buffer;
  }

  verifyPassword(password, hash) {
    let hex = hash.substring(0, 32);
    let salt: ArrayBuffer = this.parseHexString(hex);
    return Promise.resolve(this.pbkdf2(password, salt).then((attempt) => {
      return attempt === hash;
    }));
  }

  createPassword(password) {
    let randomBytes = new Uint8Array(16);
    window.crypto.getRandomValues(randomBytes);
    let salt = randomBytes.buffer;
    return this.pbkdf2(password, salt);
  }

  // https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex
  buf2hex(buffer: ArrayBuffer) {
    return Array.prototype.map.call(
      new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)
    ).join('');
  }

  pbkdf2(password, salt) {
    let passwordKey: ArrayBuffer = this.encoder.encode(password).buffer;
    return this.crypto.importKey(
      'raw', 
      passwordKey, 
      { name: 'PBKDF2' }, 
      false, 
      ['deriveBits', 'deriveKey']
    ).then((key) => {
      return this.crypto.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 1000,
          hash: 'SHA-256'
        },
        key,
        { name: 'AES-CBC', length: 256 },
        true,
        [ 'encrypt', 'decrypt' ]
      )
    }).then((webKey) => {
      return this.crypto.exportKey('raw', webKey);
    }).then((buffer) => {
      return this.buf2hex(salt) + this.buf2hex(buffer);
    });
  }

}
