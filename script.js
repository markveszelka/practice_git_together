console.log('Hellobello');


function orderElement(data) {
    return `<div class="order">
            <button class="deleteOrder">x</button>
            <p class="orderProdName">${data.name}</p>
            <div>
            <p class="cartQ">${data.quantity}m</input>
            </div>
            <p class="orderPrice">Price: ${data.price} HUF</p>
            </div>`;
  }
  