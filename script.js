console.log('Hellobello');
const url = 'http://127.0.0.1:9000/';

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

const fetchData = async () => {
  const textileResponse = await fetch(`${url}api/textiles`);
  const textileData = await textileResponse.json();
  const colorsResponse = await fetch(`${url}api/colors`);
  const colorsData = await colorsResponse.json();
  buildDom(textileData.textiles, colorsData.colors);
  addProductsToDataList(textileData.textiles);
};

function getParameterElementById(element) {
  return document.getElementById(element);
}

function divElement(id, content) {
  return `<div id=${id}>${content || ''}</div>`;
}

const addProductsToDataList = (data) => {
  // UPDATE: LIST IS SORTED A TO Z
  const sortedData = data.sort(function (a, b) {
    if (a.name > b.name) {
      return -1;
    }
    if (a.name < b.name) {
      return 1;
    }
    return 0;
  });
  sortedData.forEach((product) => {
    document.getElementById('products').insertAdjacentHTML('afterbegin', `<option value='${product.name}'></option>`);
  });
};

function searchProductByName() {
  getParameterElementById('search').addEventListener('input', (event) => {
    document.querySelectorAll('.name').forEach((product) => {
      if (product.innerHTML.includes(event.target.value)) {
        product.parentNode.parentNode.style.display = 'flex';
        const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
        allCheckboxes.forEach((checkbox) => {
          if (checkbox.checked === true) {
            // UPDATED, UNCHECK IF TEXTILE SELECTED FROM LIST
            checkbox.checked = false;
          }
        });
      } else {
        product.parentNode.parentNode.style.display = 'none';
      }
    });
  });
}

function checkCheckBox(id) {
  const checkBoxElement = getParameterElementById(id);
  checkBoxElement.addEventListener('change', function () {
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    const checkedColors = [];
    allCheckboxes.forEach((checkbox) => {
      if (checkbox.checked === true) {
        checkedColors.push(checkbox.value);
        getParameterElementById('search').value = ''; // HERE IS PLUS ONE LINE
      }
    });
    if (checkedColors.length) {
      document.querySelectorAll('.color').forEach((p) => {
        const text = p.innerHTML;
        if (checkedColors.every((color) => text.includes(color))) {
          p.parentNode.parentNode.style.display = 'flex';
        } else {
          p.parentNode.parentNode.style.display = 'none';
        }
      });
    } else {
      document.querySelectorAll('.color').forEach((p) => {
        p.parentNode.parentNode.style.display = 'flex';
      });
    }
  });
}

function checkBoxEventListeners() {
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkCheckBox(checkbox.value);
  });
}

function goToOrderPageMyCart() {
  getParameterElementById('mycart').addEventListener('click', () => {
    window.location = `${url}api/order`;
  });
}

function serveImages () {
  const viscoseImage =
    'https://static.fibre2fashion.com/MemberResources/LeadResources/8/2019/1/Buyer/19158530/Images/19158530_0_viscose-fabric.jpg';
  const polyesterImage =
    'https://static.fibre2fashion.com/MemberResources/LeadResources/8/2017/4/Seller/17128112/Images/17128112_0_polyester-fabric.jpg?tr=w-320,h-320,cm-pad_resize,bg-F3F3F3';
  const netImage =
    'https://static.fibre2fashion.com/MemberResources/LeadResources/8/2016/12/Seller/16123050/Images/16123050_1_hard-net-fabrics-250x250.jpg?tr=w-320,h-320,cm-pad_resize,bg-F3F3F3';
  const polyamidImage =
    'https://static.fibre2fashion.com/MemberResources/LeadResources/8/2018/12/Seller/18157071/Images/18157071_0_nylon-fabric.jpg?tr=w-320,h-320,cm-pad_resize,bg-F3F3F3';
  const cottonImage =
    'https://static.fibre2fashion.com/MemberResources/LeadResources/8/2022/5/Seller/22202855/Images/22202855_0_images.jpg?tr=w-320,h-320,cm-pad_resize,bg-F3F3F3';
  const puntoImage =
    'https://cdn.shopify.com/s/files/1/1116/5366/articles/FG_Ponte_Roma_fabric_yellow_800x.jpg?v=1605546007';
  const frenchTerryImage = 'https://createfashionbrand.com/wp-content/uploads/2021/02/Tecidos-3a.jpg';
  const imagesUrl = [viscoseImage, cottonImage, frenchTerryImage, polyamidImage, puntoImage, polyesterImage, netImage];
  return imagesUrl;
}

function buildDom(textiles, colors) {
  buildHeader();
  buildFilterBar();
  buildProductCards();
  buildQuantityInputAndAddToCartButton();

  function buildHeader () {
    getParameterElementById('root').insertAdjacentHTML(
      'afterbegin',
      divElement(
        'header',
        '<h1 id="webshopTitle"><a href="http://127.0.0.1:9000/textiles/list">TEXTILE WEBSHOP</a></h1>',
      ),
    );
    getParameterElementById('header').insertAdjacentHTML(
      'afterbegin',
      '<button id="mycart"><i class="fa-solid fa-cart-shopping"></i> My cart </button>',
    );
  }

  function buildFilterBar () {
    getParameterElementById('root').insertAdjacentHTML('beforeend', divElement('filter'));
    getParameterElementById('root').insertAdjacentHTML('beforeend', divElement('container'));
    getParameterElementById('filter').insertAdjacentHTML(
      'beforeend',
      '<input type="search" id="search" list="products">',
    );
    getParameterElementById('filter').insertAdjacentHTML('beforeend', '<datalist id="products"></datalist>');
    getParameterElementById('filter').insertAdjacentHTML('beforeend', divElement('checkbox'));
    colors.forEach((color) => {
      getParameterElementById('checkbox').insertAdjacentHTML(
        'beforeend',
        `<input type="checkbox" value="${color.name}" id="${color.name}"><label for="${color.name}">${color.name}</label> `,
      );
    });
  }

  function buildProductCards() {
    textiles.forEach((textile, index) => {
      getParameterElementById('container').insertAdjacentHTML(
        'beforeend',
        divElement(`product-container-${index} class="product-container"`),
      );
      getParameterElementById(`product-container-${index}`).insertAdjacentHTML(
        'beforeend',
        divElement('image', `<img class="image" src=${serveImages()[index]}></img>`),
      );
      getParameterElementById(`product-container-${index}`).insertAdjacentHTML(
        'beforeend',
        divElement(
          `textile-name-${index} class="product"`,
          `<h2 class="name">${textile.name}</h2>
          <p>COMPONENTS: ${textile.ingredients}</p>
          <p class="price">PRICE: ${textile.price}</p>
          <p class="color">COLORS: ${matchColors(textile, colors)}</p>
          <div class="checkout"><input class="quantity" type="number" min="0" value="0">m<button class="addToCart"><i class="fa-solid fa-cart-plus"></i></button></input></div>`,
        ),
      );
    });
  }

  function buildQuantityInputAndAddToCartButton () {
    const quantityInputs = document.querySelectorAll('.quantity');
    quantityInputs.forEach((inputfield) => {
      // inputfield.addEventListener('click', function () { // IN COMMENT TO AVOID AUTODELETE OF VALUE
      //   inputfield.value = '';
      // });
      inputfield.addEventListener('focusout', function () {
        if (inputfield.value === '') {
          inputfield.value = 0;
        }
      });
    });
    const orderPackage = {
      name: '',
      quantity: '',
      price: '',
    };
    const addToCartButtons = document.querySelectorAll('.addToCart');
    addToCartButtons.forEach((button) => {
      button.addEventListener('click', function () {
        const quantity = button.parentNode.querySelector('input').value;
        if (quantity > 0) {
          const productDiv = button.parentNode.parentNode;
          orderPackage.name = productDiv.querySelector('h2').textContent;
          orderPackage.quantity = Number(quantity);
          const singlePrice = productDiv.querySelector('.price').textContent.split(':')[1];
          orderPackage.price = Number(quantity) * Number(singlePrice);
          fetch('http://127.0.0.1:9000/ordering', {
            method: 'POST',
            body: JSON.stringify(orderPackage),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          }).then((resp) => {
            if (resp.status === 200) {
              alert('Added to cart');
            }
          });
        }
      });
    });
  }
}

function addFormToDom() {
  const orderUrl = 'http://127.0.0.1:9000/api/order';
  getParameterElementById('root').insertAdjacentHTML(
    'beforeend',
    divElement(
      'form',
      `<form action="${orderUrl}" method="POST">
    <label for="fname"></label>
    <input type="text" id="fname" name="fname" placeholder="First name" required><br><br>
    <label for="lname"></label>
    <input type="text" id="lname" name="lname" placeholder="Last name" required><br><br>
    <label for="email"></label>
    <input type="email" id="email" name="email" placeholder="Email" required><br><br>
    <label for="city"></label>
    <input type="text" id="city" name="city" placeholder="City" required><br><br>
    <label for="steet"></label>
    <input type="text" id="street" name="street" placeholder="Street" required><br><br>
    <input type="submit" value="Submit order">
    </form>`,
    ),
  );
}

function matchColors(textile, colors) {
  const colorArray = [];
  textile.colors.forEach((colorNumber) => {
    colors.forEach((color) => {
      if (colorNumber === color.id) {
        colorArray.push(color.name);
      }
    });
  });
  return colorArray;
}

function orderPageBuildDom() {
  getParameterElementById('root').insertAdjacentHTML(
    'afterbegin',
    divElement(
      'header',
      '<h1 id="webshopTitle"><a href="http://127.0.0.1:9000/textiles/list">TEXTILE WEBSHOP</a></h1>',
    ),
  );
  getParameterElementById('header').insertAdjacentHTML(
    'afterbegin',
    '<button id="mycart"><i class="fa-solid fa-cart-shopping"></i> My cart </button>',
  );
  getParameterElementById('header').insertAdjacentHTML('afterend', '<div id="orders"></div>');
  document.getElementById('orders').insertAdjacentHTML('afterbegin', '<h1 id="orderTitle">Orders</h1>');
}

async function fetchCurrentOrders() {
  const resp = await fetch('http://127.0.0.1:9000/api/currentorders');
  const orders = await resp.json();
  orders.orders.forEach((order) => {
    document.getElementById('orders').insertAdjacentHTML('beforeend', orderElement(order));
  });
  if (document.querySelectorAll('.order').length > 0) {
    document.getElementById('orders').insertAdjacentHTML('beforeend', '<button id="emptyCart">Delete Orders</button>');
  } else {
    document
      .getElementById('orders')
      .insertAdjacentHTML('beforeend', '<p id="noOrders">Add items to cart on the webshop page</p>');
  }
  if (document.getElementById('emptyCart')) {
    document.getElementById('emptyCart').addEventListener('click', function () {
      fetch('http://127.0.0.1:9000/api/deleteorders', {
        method: 'DELETE',
      });
      location.href = 'http://127.0.0.1:9000/cart';
    });
  }
  fetchDeleteOrder();
}

function fetchDeleteOrder() {
  const deleteOrderButtons = document.querySelectorAll('.deleteOrder');
  const obj = {
    name: '',
  };
  deleteOrderButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const parentDiv = button.parentNode;
      obj.name = parentDiv.querySelector('.orderProdName').textContent;
      fetch('http://127.0.0.1:9000/api/deletesingle', {
        method: 'DELETE',
        body: JSON.stringify(obj),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      parentDiv.remove();
      if (document.getElementById('orders').childNodes.length < 3) {
        document.getElementById('emptyCart').style.display = 'none';
        document
          .getElementById('orders')
          .insertAdjacentHTML('beforeend', '<p id="noOrders">Add items to cart on the webshop page</p>');
      }
    });
  });
}

function myCartEventListener() {
  document.getElementById('mycart').addEventListener('click', function () {
    location.href = 'http://127.0.0.1:9000/cart';
  });
}

const loadEvent = async () => {
  if (location.href === 'http://127.0.0.1:9000/cart') {
    addFormToDom();
    orderPageBuildDom();
    fetchCurrentOrders();
  } else if (location.href === 'http://127.0.0.1:9000/textiles/list') {
    await fetchData();
    searchProductByName();
    checkBoxEventListeners();
    goToOrderPageMyCart();
  }
  myCartEventListener();
};

window.addEventListener('load', loadEvent);
