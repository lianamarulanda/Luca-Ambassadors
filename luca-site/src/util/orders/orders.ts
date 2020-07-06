
export default class orders {

  public orderRequest: any;
  public addressError: boolean;
  public productError: boolean;
  public orderNumber: number;
  public maxQuantity: number;

  constructor() {
    this.orderRequest = {
      "order": {
        "customer": {
          "first_name": "Liana",
          "last_name": "Marulanda",
          "email" : "lianamarulanda@gmail.com",
        },
        "test": true,
        "email": "lianamarulanda@gmail.com", 
        "send_receipt": true,
        "shipping_address": {          
          "first_name": "Liana",
          "last_name": "Marulanda",
          "address1": "",
          "address2": "",
          "city": "",
          "province": "",
          "country": "",
          "zip": ""
        },
        "line_items": [],
      }
    };
    this.addressError = false;
    this.productError = false;
    this.orderNumber = 0;
    this.maxQuantity = 0;
  }
}