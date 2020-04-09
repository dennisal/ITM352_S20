// product objects
product1 = { 'name': 'small gumball', 'price': 0.02 }; //product 1's information
product2 = { 'name': 'medium gumball', 'price': 0.05 }; //product 2's information
product3 = { 'name': 'large gumball', 'price': 0.07 }; //product 3's information

// array of all products
products = [product1, product2, product3]; //assembling each product under one name (array): products
cart_quantities = [2, 0, 4]; // corresponds to products array
// loop to input each product into the following string
for (i = 0; i < products.length; i++) {
    console.log(`The extended price for product ${products[i].name} is ${products[i].price * cart_quantities[i]}`);
}