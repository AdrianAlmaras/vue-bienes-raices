

// Formato a precio
export const priceProperty =  (price) => 
        //console.log(price);
        Number(price).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
