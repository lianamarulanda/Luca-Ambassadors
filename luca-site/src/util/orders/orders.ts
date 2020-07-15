
export default class orders {

  public orderRequest: any;
  public orderNumber: number;
  public maxQuantity: number;
  public packageSelection: string;
  public inventoryProductMap: any;
  public subtotal: number;

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
        "send_fullfillment_receipt": true,
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
        "total_discounts": "",
        "discount_codes": [
          {
            "code": "influencer%",
            "amount": "",
            "type": "percentage"
          }
        ],
        "line_items": [],
      }
    };
    this.subtotal = 0;
    this.orderNumber = 0;
    this.maxQuantity = 0;
    this.packageSelection = "";
    this.inventoryProductMap = new Map();
  }
}