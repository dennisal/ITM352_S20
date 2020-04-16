// product objects
product1 = { 'name': 'small gumball', 'price': 0.02 }; //product 1's information
product2 = { 'name': 'medium gumball', 'price': 0.05 }; //product 2's information
product3 = { 'name': 'large gumball', 'price': 0.07 }; //product 3's information

[
    {
    "brand": "HTC",
    "price": 40.00,
    "image": "http://dport96.github.io/ITM352/morea/080.flow-control-II/HTC.jpg"
    },
    {
    "brand": "Apple",
    "price": 75.00,
    "image": "http://dport96.github.io/ITM352/morea/080.flow-control-II/iphone-3gs.jpg"
    },
    {
    "brand": "Nokia",
    "price": 35.00,
    "image": "http://dport96.github.io/ITM352/morea/080.flow-control-II/Nokia.jpg"
    },
    {
    "brand": "Samsung",
    "price": 45.00,
    "image": "http://dport96.github.io/ITM352/morea/080.flow-control-II/Samsung.jpg"
    },
    {
    "brand": "Blackberry",
    "price": 10.00,
    "image": "http://dport96.github.io/ITM352/morea/080.flow-control-II/Blackberry.jpg"
    }
  ]

// array of all products
products = [product1, product2, product3]; //assembling each product under one name (array): products
cart_quantities = [2, 0, 4]; // corresponds to products array
// loop to input each product into the following string
for (i = 0; i < products.length; i++) {
    console.log(`The extended price for product ${products[i].name} is ${products[i].price * cart_quantities[i]}`);
}