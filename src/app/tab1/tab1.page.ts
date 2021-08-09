import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { GroceriesService } from '../providers/groceries.service';
import { InputDialogService } from '../providers/input-dialog.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  title = "Grocery";
  items = [];
  errorMessage: string;

  constructor(public navCtrl: NavController, 
    public toastCtrl: ToastController, 
    public alertCtrl: AlertController, 
    public dataService: GroceriesService, 
    public inputDialogService: InputDialogService, 
    public socialSharing: SocialSharing) 
    {dataService.dataChanged$.subscribe((dataChanged: boolean) => {
      this.loadItems();
    });
    this.loadItems();
  }

  ionViewDidLoad() {
    this.loadItems();
  }

  loadItems() {
    this.dataService.getItems()
      .subscribe(
        items => this.items = items,
        error => this.errorMessage = <any>error
      );
  }

  removeItem(id) {
    this.dataService.removeItem(id);
  }

  async shareItem(item, index) {
    console.log("Sharing Item - ", item, index);
    const toast = await this.toastCtrl.create({
      color: 'dark',
      message: 'Sharing Item - ' + index + " ...",
      duration: 2500
    });

    await toast.present();

    let message = "Grocery Item - Name: " + item.name + " - Quantity: " + item.quantity;
    let subject = "Shared via Groceries app";

    this.socialSharing.share(message, subject).then(() => {    
      console.log("Shared successfully!");
    }).catch((error) => {
      console.error("Error while sharing ", error);
    });    

  }

  editItem(item, index) {
    console.log("Editing Item - ", item, index);
    this.inputDialogService.itemPrompt(item, index);
  }

  addItem() {
    console.log("Adding Item");
    this.inputDialogService.itemPrompt();
  }
}
