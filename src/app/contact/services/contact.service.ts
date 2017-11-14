import {Injectable} from '@angular/core';
import {Contact} from '../contact';
import * as _ from 'lodash';

@Injectable()
export class ContactService {

  localStorageKey: string;

  constructor() {
    this.localStorageKey = 'ca-contacts';
    this.initializeLocalStorage();
  }

  public findContacts(): Contact[] {
    return this.readLocalStorageContacts();
  }

  public findContactById(id: number): Contact {
    const contacts = this.readLocalStorageContacts();
    return _.find(contacts, {'id': id});
  }

  public saveContact(contact: Contact) {
    let contacts = this.readLocalStorageContacts();
    if (!contact.id) {
      const lastSaved = _.maxBy(contacts, 'id') as Contact;
      contact.id = lastSaved ? lastSaved.id + 1 : 1;
      contacts.push(contact);
    } else {
      contacts = _.map(contacts, function (c: Contact) {
        return c.id === contact.id ? contact : c;
      });
    }
    this.writeLocalStorageContacts(contacts);
    return this.findContactById(contact.id);
  }

  public deleteContact(id: number) {
    const contacts = this.readLocalStorageContacts();
    _.remove(contacts, {'id': id});
    this.writeLocalStorageContacts(contacts);
  }

  private getInitialContacts(): Contact[] {
    return [
      new Contact(1, 'Marko', 'Paananen', '0406663333', 'Tapionkatu 7', 'Imatra'),
      new Contact(2, 'Hessu', 'Hopo', '04511992266', 'Nollakatu 0', 'Hanhivaara')
    ];
  }

  private initializeLocalStorage() {
    if (!localStorage.getItem(this.localStorageKey)) {
      localStorage.setItem(this.localStorageKey, JSON.stringify([]));
      this.writeLocalStorageContacts(this.getInitialContacts());
    }
  }

  private readLocalStorageContacts(): Contact[] {
    const data = localStorage.getItem(this.localStorageKey);
    return JSON.parse(data) as Contact[];
  }

  private writeLocalStorageContacts(contacts) {
    const data = JSON.stringify(contacts);
    localStorage.setItem(this.localStorageKey, data);
  }
}
