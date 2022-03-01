import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore, private http: HttpClient) { }

  addContact(contact: any) {
    return new Promise((resolve, reject) => {
     this.firestore.collection('contact')
        .doc(contact.docID)
        .set((({ content, email_id, name }) => ({ content, email_id, name }))(contact))
        .then(() => {
            this.http.post(environment.APIBASEUR + 'api/sendmail', contact).subscribe(() => {
            resolve();
          })
        }).catch(err => {
          console.log('An error occured while saving to DB')
          reject();
        })
    })
  }
}
