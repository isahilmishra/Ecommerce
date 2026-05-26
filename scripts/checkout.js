
import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import '../data/cart-class.js'
import '../data/backend-practice.js'
import { loadProducts , loadProductsFetch } from '../data/products.js';
import { loadCart } from '../data/cart.js';
// Example usage

async function loadPage() {
  try{
    // throw 'errror1';

    await loadProductsFetch();
    // throw 'error2';
    const value = await new Promise((resolve , reject)=>{
      loadCart(()=>{
        // reject('error3');
        resolve('value3');
      });
    });
  } catch(error){
    console.log('unexpected error. please try again later')
  }
 

  renderOrderSummary();
  renderPaymentSummary();
}
loadPage();

/*
Promise.all([
  loadProductsFetch(),
  new Promise((resolve)=>{
    loadCart(()=>{
      resolve();
    })
  })
]).then(()=>{
  renderOrderSummary();
  renderPaymentSummary();
})
*/
// new Promise((resolve)=>{
//   loadProducts(()=>{
//     resolve();
//   });
// }).then(()=>{
//   return new Promise((resolve)=>{
//     loadCart(()=>{
//       resolve();
//     })
//   })
// }).then(()=>{
//     renderOrderSummary();
//     renderPaymentSummary();
// })


// loadProducts(()=>{
//   renderOrderSummary();
//   renderPaymentSummary();
// });
