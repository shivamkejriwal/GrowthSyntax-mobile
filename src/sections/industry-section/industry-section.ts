import { Component } from '@angular/core';
import { MenuController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { Utils } from '../utils';

const getIconMappings = () => {
    return {
        'Military': 'jet',
        'Office Equipment': 'print',
        'Books': 'book',
        'Publishing': 'book',
        'Paper': 'paper',
        'Newspapers': 'paper',
        'Rental': 'home',
        'Real Estate': 'home',
        'Real Estate Investment Trusts': 'home',
        'Home Furnishings': 'home',
        'Railroads': 'train',
        'Transportation Services': 'train',
        'Retail': 'cart',
        'RETAIL': 'cart',
        'Basic Industries': 'cog',
        'Major Banks': 'cash',
        'Savings Institutions': 'cash',
        'Banks': 'cash',
        'Investment Bankers': 'cash',
        'Investment Managers': 'cash',
        'Commercial Banks': 'cash',
        'Specialty Insurers': 'cash',
        'Property-Casualty Insurers': 'cash',
        'Life Insurance': 'pulse',
        'Accident &Health Insurance': 'pulse',
        'Finance Companies': 'stats',
        'Finance': 'stats',
        'Capital Goods': 'construct',
        'Construction': 'construct',
        'Homebuilding': 'construct',
        'Building Materials': 'construct',
        'Building Products': 'construct',
        'Building operators': 'construct',
        'Business Services': 'construct',
        'General Bldg Contractors - Nonresidential Bldgs': 'construct',
        'Engineering & Construction': 'construct',
        'Tools': 'hammer',
        'Motor Vehicles': 'car',
        'Auto Manufacturing': 'car',
        'Auto Parts': 'car',
        'Automotive Aftermarket': 'car',
        'Biotechnology': 'medkit',
        'Hospital': 'medkit',
        'Healthcare': 'medkit',
        'Health Care': 'medkit',
        'Medical': 'medkit',
        'Medical Electronics': 'medkit',
        'Medical Specialities': 'medkit',
        'Consumer Durables': 'cart',
        'Other Specialty Stores': 'cart',
        'Miscellaneous': 'basket',
        'Consumer Non-Durables': 'pricetags',
        'Public Utilities': 'bulb',
        'Consumer Services': 'contacts',
        'Technology': 'battery-charging',
        'Energy': 'flame',
        'Telecommunications Equipment': 'wifi',
        'Television Services': 'wifi',
        'Broadcasting': 'wifi',
        'Beverages (Production': 'beer',
        'Paints': 'brush',
        'Power Generation': 'flash',
        'Electric Utilities': 'flash',
        'Electrical Products': 'flash',
        'Electronics Distribution': 'flash',
        'Restaurants': 'restaurant',
        'Aerospace': 'plane',
        'Transportation': 'subway',
        'Other Pharmaceuticals': 'flask',
        'Major Pharmaceuticals': 'flask',
        'Specialty Chemicals': 'flask',
        'Agricultural Chemicals': 'flask',
        'Major Chemicals': 'flask',
        'Computer Software': 'laptop',
        'Computer peripheral equipment': 'laptop',
        'Computer Manufacturing': 'laptop',
        'Computer Communications Equipment': 'laptop',
        'Clothing': 'shirt',
        'Catalog': 'shirt',
        'Textiles': 'shirt',
        'Apparel': 'shirt',
        'Consumer Specialties': 'bowtie',
        'Consumer': 'bowtie',
        'Other Consumer Services': 'bowtie',
        'Forest Products': 'leaf',
        'Farming': 'leaf',
        'Oil & Gas Production' :'ios-funnel',
        'Oil Refining' :'ios-funnel',
        'Oil' :'ios-funnel',
        'Integrated oil Companies': 'ios-funnel',
        'Environmental Services': 'leaf',
        'Containers': 'cube',
        'Package Goods': 'cube',
        'Wholesale Distributors': 'cube',
        'Food Chains': 'nutrition',
        'Food Distributors': 'nutrition',
        'Packaged Foods': 'nutrition',
        'Specialty Foods': 'nutrition',
        'Metal Fabrications': 'logo-buffer',
        'Aluminum': 'logo-buffer',
        'Steel': 'logo-buffer',
        'Precious Metals': 'logo-buffer',
        'Movies': 'film',
        'Tobacco': 'no-smoking',
        'Water Supply': 'water',
        'Advertising': 'easel',
        'Miscellaneous manufacturing industries': 'settings',
        'Industrial Machinery': 'settings',
        'Industrial Specialties': 'settings',
        'Precision Instruments': 'settings',
        'Fluid Controls': 'settings',
        'EDP Services': 'briefcase',
        'Oilfield Services': 'briefcase',
        'Diversified Commercial Services': 'briefcase',
        'Diversified Financial Services': 'briefcase',
        'Professional Services': 'briefcase',
        'Recreational Products': 'basketball',
        'Services-Misc. Amusement & Recreation': 'basketball',
        'Consumer Electronics': 'phone-portrait',
        'Other Transportation': 'boat',
        'Marine Transportation': 'boat',
        'Electronic Components': 'camera',
        'Diversified Electronic Products': 'camera',
        'Air Freight': 'plane',
        'Ophthalmic Goods': 'eye',
        'Semiconductors': 'grid',
        'Radio And Television Broadcasting And Communications Equipment': 'megaphone'
    };
}

const getIcon = (name) => {

}

@Component({
  selector: 'industry-section',
  templateUrl: 'industry-section.html'
})
export class IndustrySection {
    industryMapings: any = {};
    industries: any = [];
    isReady: boolean = false;
    constructor(public menuCtrl: MenuController, 
        private afs: AngularFirestore) {
        this.industryMapings = getIconMappings();
        this.getData();
    }

    getData() {
        const collection = this.afs.collection<any>('Industry');
        collection.snapshotChanges(['added'])
        .subscribe(items => {
            this.industries = items.map(item => {
                const data = item.payload.doc.data();
                data.icon = this.getIcon(data.name);
                data.change = Utils.round(data.change/data.open * 100, 2);
                // console.log(data);
                return data;
            });
            this.isReady = true;
        });
    }

    getIcon(name) {
        // data.icon = this.industryMapings[data.name] || '';
        const key = name.split(':')[0];
        if(!this.industryMapings[key]) {
            console.log(`No icon: ${key}`);
        }
        return this.industryMapings[key] || 'square-outline';
    }

    ionViewDidEnter() {
        this.menuCtrl.enable(false,'sidemenu');
      }
}