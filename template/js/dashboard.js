const checkAuthGET = async () => {
  const response = await fetch("/user/session/valid", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  });

  const myJson = await response.json();

  if (myJson.message != "Token Valid") {
    window.location.href = "/page/login";
  } else {
    document.getElementById("username").innerHTML = myJson.username
  }
};

checkAuthGET();

const productListGET = async () => {
  const response = await fetch("/product/list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  });

  const myJson = await response.json();
  console.log(myJson)

  document.getElementById("product-body").innerHTML = ""

  let listProd = []

  if (myJson.error == undefined) {
    listProd = myJson
  }

  listProd.forEach((e) => {
    document.getElementById("product-body").innerHTML += `
    <div class="card text-gray-500">
      <i class="fa fa-trash" style="cursor: pointer" onclick="productDELETE(` + e.ID + `)"></i>
      <i class="fa fa-pencil-square-o" style="cursor: pointer" data-toggle="modal" data-target="#bootstrapModal" onclick="modalUpdateProduct(` + e.ID + `,'`+ e.Name +`',`+ e.price +`,`+ e.stock +`,`+ e.discount +`,'`+ e.type +`')"></i>
      <span class="badge badge-success">Discount ` + e.discount + `%</span>
      <h4>` + e.Name + `</h4>
      <ul>
        <li>Price: <p class="price">Rp. ` + e.price + `</p></li>
        <li>Stock: <p class="price">` + e.stock + `</p></li>
      </ul>
      <button class="btn" onclick="addCartPOST(` + e.ID + `,'`+ e.Name +`',`+ e.price +`,`+ e.stock +`,`+ e.discount +`,'`+ e.type +`')"><i class="fa fa-cart-plus"></i></button>
    </div>
  `
  })  
};

productListGET();

function modalChangeProfile() {
  document.getElementById("modal-label").innerHTML = "Change Image Profile"

  document.getElementById("modal-body").innerHTML = `
    <form method="post" action="/user/img/update-profile" enctype="multipart/form-data">
      <div class="navbar">
          <img src="/user/img/profile" alt="Avatar" class="avatar">
          <label class="menu">Update Profile: </label>
          <input type="file" name="file-avatar" required />
          <input type="submit">
      </div>
    </form>
  `
}

function modalAddProduct() {
  document.getElementById("modal-label").innerHTML = "Add Product"

  document.getElementById("modal-body").innerHTML = `
  <table>
    <tbody>
      <tr>
        <td><label>Product Name &nbsp;&nbsp;</label></td>
        <td>: <input type="text" id="pname" class="input-product"></td>
      </tr>
      <tr>
        <td><label>Price &nbsp;&nbsp;</label></td>
        <td>: <input type="number" id="price" class="input-product"></td>
      </tr>
      <tr>
        <td><label>Stock &nbsp;&nbsp;</label></td>
        <td>: <input type="number" id="stock" class="input-product"></td>
      </tr>
      <tr>
        <td><label>Discount &nbsp;&nbsp;</label></td>
        <td>: <input type="number" id="discount" class="input-product"></td>
      </tr>
      <tr>
        <td><label>Type &nbsp;&nbsp;</label></td>
        <td>: 
          <select id="type" class="input-product">
            <option value="fruit">Fruit</option>
            <option value="vegetable">Vegetable</option>
            <option value="seafood">Sea Food</option>
            <option value="drink">Drink</option>
          </select>
        </td>
      </tr>
    </tbody>
  </table>
  `

  document.getElementById("modal-footer").innerHTML = `
    <button type="button" class="btn btn-primary" onclick="addProductPOST()" data-bs-dismiss="modal">Submit</button>
  `
}

function modalUpdateProduct(id, name, price, stock, discount, type) {
  document.getElementById("modal-label").innerHTML = "Update Product"

  document.getElementById("modal-body").innerHTML = `
  <table>
    <tbody>
      <tr>
        <td><label>Product Name &nbsp;&nbsp;</label></td>
        <td>: <input type="text" id="pname" class="input-product" value="`+ name +`"></td>
      </tr>
      <tr>
        <td><label>Price &nbsp;&nbsp;</label></td>
        <td>: <input type="number" id="price" class="input-product" value="`+ price +`"></td>
      </tr>
      <tr>
        <td><label>Stock &nbsp;&nbsp;</label></td>
        <td>: <input type="number" id="stock" class="input-product" value="`+ stock +`"></td>
      </tr>
      <tr>
        <td><label>Discount &nbsp;&nbsp;</label></td>
        <td>: <input type="number" id="discount" class="input-product" value="`+ discount +`"></td>
      </tr>
      <tr>
        <td><label>Type &nbsp;&nbsp;</label></td>
        <td>: 
          <select id="type" class="input-product" value="`+ type +`">
            <option value="fruit">Fruit</option>
            <option value="vegetable">Vegetable</option>
            <option value="seafood">Sea Food</option>
            <option value="drink">Drink</option>
          </select>
        </td>
      </tr>
    </tbody>
  </table>
  `

  document.getElementById("modal-footer").innerHTML = `
    <button type="button" class="btn btn-primary" onclick="updateProductPUT(` + id + `)" data-bs-dismiss="modal">Submit</button>
  `
}

const addProductPOST = async () => {
  let productName = document.getElementById("pname").value;
  let price = document.getElementById("price").value;
  let stock = document.getElementById("stock").value;
  let discount = document.getElementById("discount").value;
  let type = document.getElementById("type").value;

  let data = {
    name: productName,
    price: Number(price),
    stock: Number(stock),
    discount: Number(discount),
    type: type,
  };

  const response = await fetch("/product/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  const myJson = await response.json();

  if (myJson.error === undefined) {
    pushNotify("success", myJson.username, myJson.message);
    productListGET();
  } else {
    pushNotify("error", "Error", myJson.error);
  }
};

const updateProductPUT = async (id) => {
  let productName = document.getElementById("pname").value;
  let price = document.getElementById("price").value;
  let stock = document.getElementById("stock").value;
  let discount = document.getElementById("discount").value;
  let type = document.getElementById("type").value;

  let data = {
    name: productName,
    price: Number(price),
    stock: Number(stock),
    discount: Number(discount),
    type: type,
  };

  const response = await fetch("/product/update?id=" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  const myJson = await response.json();

  if (myJson.error === undefined) {
    pushNotify("success", myJson.username, myJson.message);
    productListGET();
  } else {
    pushNotify("error", "Error", myJson.error);
  }
};

const productDELETE = async (id) => {
  const response = await fetch("/product/delete?id=" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  });

  const myJson = await response.json();

  if (myJson.error === undefined) {
    pushNotify("success", myJson.username, myJson.message);
    productListGET();
  } else {
    pushNotify("error", "Error", myJson.error);
  }
};

const listCartGET = async () => {
  const response = await fetch("/cart/list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  });

  const myJson = await response.json();
  console.log(myJson)

  document.getElementById("cart-body").innerHTML = ""
  payBtn = document.getElementById("pay-button")

  let listCart = []

  if (myJson.error == undefined) {
    listCart = myJson
    payBtn.style.display = "block"
  } else {
    payBtn.style.display = "none"
  }

  listCart.forEach((e) => {
    document.getElementById("cart-body").innerHTML += `
    <div class="card text-gray-500">
      <h4>` + e.name + `</h4>
      <ul>
        <li>Total Price: <p class="price">Rp. ` + e.total_price + `</p></li>
        <li>Quantity: <p class="price">` + e.quantity + `</p></li>
      </ul>
      <button class="btn" onclick="cartDELETE(` + e.id +  `,`+ e.product_id +`)"><i class="fa fa-cart-arrow-down"></i></button>
    </div>
    `
  })
};

listCartGET();

const addCartPOST = async (id, name, price, stock, discount, type) => {
  let data = {
    ID: id,
    name: name,
    price: Number(price),
    stock: Number(stock),
    discount: Number(discount),
    type: type,
  };

  const response = await fetch("/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  const myJson = await response.json();

  if (myJson.error === undefined) {
    pushNotify("success", myJson.username, myJson.message);
    listCartGET();
    productListGET();
  } else {
    pushNotify("error", "Error", myJson.error);
  }
};

const cartDELETE = async (id, prodId) => {
  const response = await fetch("/cart/delete?id=" + id +"&product_id=" + prodId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  });

  const myJson = await response.json();

  if (myJson.error === undefined) {
    pushNotify("success", myJson.username, myJson.message);
    listCartGET();
    productListGET();
  } else {
    pushNotify("error", "Error", myJson.error);
  }
};

function modalPay() {
  document.getElementById("modal-label").innerHTML = "Pay All Items"

  document.getElementById("modal-body").innerHTML = `
    <h3>Pay</h3>
    <table>
    <tbody>
      <tr>
        <td><label>Add your Money &nbsp;&nbsp;</label></td>
        <td>: <input type="number" id="money"></td>
      </tr>
    </tbody>
  </table>

  `

  document.getElementById("modal-footer").innerHTML = `
    <button type="button" class="btn btn-primary" onclick="payCartPOST()" data-bs-dismiss="modal">Submit</button>
  `
}

function pushNotify(status, title, message) {
  new Notify({
    status: status,
    title: title,
    text: message,
    effect: "fade",
    speed: 100,
    customClass: null,
    customIcon: null,
    showIcon: true,
    showCloseButton: true,
    autoclose: true,
    autotimeout: 3000,
    gap: 20,
    distance: 20,
    type: 1,
    position: "right top",
  });
}
