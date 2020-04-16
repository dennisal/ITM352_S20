/*
Copied template: product_data.js from Lab13
Array of tour services
*/

services =
  [
    {
      "tour": "Madrid",
      "description": "Tapas and wine tasting",
      "price": 85.00,
      "image": https://st3.idealista.com/cms/archivos/2018-06/news/madrid%20gtres.jpg?fv=fgKZ4mOm,
    },
    {
      "tour": "Seville",
      "description": "Skip the line and enjoy a guided tour of the Royal Alcázar of Seville followed by a relaxing carriage ride to Plaza de España",
      "price": 40.00,
      "image": https://i.insider.com/5a04dad87101ad1c676ef75c?width=889&format=jpeg,
    },
    {
      "tour": "Granada",
      "description": "Private tour of the Alhambra and General Life area",
      "price": 150.00,
      "image": https://www.roadaffair.com/wp-content/uploads/2019/03/alhambra-granada-spain-shutterstock_336721367-1024x683.jpg,
    },
    {
      "tour": "Barcelona",
      "description": "Skip the line and enjoy a guided tour of La Sagrada Familia",
      "price": 100.00,
      "image": https://remember-travel.ro/wp-content/uploads/barcelona-city-break-img2.jpg,
    },
    {
      "tour": "Valencia",
      "description": "Sail along the coast with tapas and wine",
      "price": 140.00,
      "image": https://feature.veltra.com/en/promotion/ctg_img/32510.jpg,
    }
  ];

//Allows services to be got by server and be displayed on other pages, granted the information is not undefined
if (typeof module != 'undefined') {
  module.exports.services = services;
}
