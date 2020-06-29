export default class orders {

  public orderRequest: any;
  constructor() {
    this.orderRequest = {
      "order": {
        "customer": {
          "first_name": "",
          "last_name": "",
          "email" : "",
        },
        "test": true,
        "email": "", 
        "send_receipt": true,
        "shipping_address": {          
          "first_name": "",
          "last_name": "",
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
  }
  public printRequest() {
    console.log("ORDER REQUEST FROM CONTEXT: " + this.orderRequest.order.line_items);
    console.log("ORDER REQUEST ADDRESS " + this.orderRequest.order.shipping_address.address1);
  }
}