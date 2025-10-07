import {cart, removeFromCart,
  calculateCartQuantity} from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { updateQuantity } from '../data/cart.js';

let cartSummaryHtml = '';
cart.forEach((cartItem)=>{

 const productId= cartItem.productId;
 let matchingProduct;

 products.forEach((product)=>{
   if(product.id === productId){
    matchingProduct = product;
   }
 });

cartSummaryHtml+=
` <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: Tuesday, June 21
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
           ${matchingProduct.name}
          </div>
          <div class="product-price">
            ${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
                 Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>

            <span class="update-quantity-link link-primary" data-product-id= ${productId}>
              Update
            </span>

            <input class="quantity-input" data-product-id= ${productId}>

            <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}"> Save </span>

            <span class="delete-quantity-link link-primary js-delete-link" data-product-id= ${productId}"${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          <div class="delivery-option">
            <input type="radio" checked
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Tuesday, June 21
              </div>
              <div class="delivery-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Wednesday, June 15
              </div>
              <div class="delivery-option-price">
                $4.99 - Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Monday, June 13
              </div>
              <div class="delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
});
document.querySelector('.js-order-summary').innerHTML= cartSummaryHtml;

document.querySelectorAll('.js-delete-link').forEach((link)=>{
link.addEventListener('click' , ()=>{
 const productId = link.dataset.productId;
 removeFromCart(productId);

const container= document.querySelector(`.js-cart-item-container-${productId}`);
container.remove(); 
 updateCartQuantity();
});
});
function updateCartQuantity(){
let cartQuantity = 0;

cart.forEach((cartItem) => {
  cartQuantity += cartItem.quantity;
});

document.querySelector('.js-return-to-home-link')
  .innerHTML = `${cartQuantity} items`; }
  updateCartQuantity();

const links = document.querySelectorAll('.link-primary');
links.forEach(link => {
  link.addEventListener('click', () => {

    const productId = link.dataset.productId;

    
    const container= document.querySelector(`.js-cart-item-container-${productId}`).classList.add('is-editing-quantity');

    
    
     link.style.display = 'none';
   
  });
});
  
document.querySelectorAll('.js-save-link').forEach((link) => {
  const productId = link.dataset.productId;
  const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
  const container = document.querySelector(`.js-cart-item-container-${productId}`);
  const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);

  // Handle Enter key
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const value = Number(input.value);

      if (value < 0 || value >= 1000) {
        alert('Quantity must be at least 0 and less than 1000');
        return;
      }

      updateQuantity(productId, value);
      container.classList.remove('is-editing-quantity');
      quantityLabel.innerHTML = value;
      updateCartQuantity();
    }
  });

  // Handle save button click
  link.addEventListener('click', () => {
    const value = Number(input.value);

    if (value < 0 || value >= 1000) {
      alert('Quantity must be at least 0 and less than 1000');
      return;
    }

    updateQuantity(productId, value);
    container.classList.remove('is-editing-quantity');
    quantityLabel.innerHTML = value;
    updateCartQuantity();
  });
});
