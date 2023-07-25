const tableBody = document.getElementById("tableBody");

const fetchProducts = () => {
  axios.get("https://modified-alloy-392605.oa.r.appspot.com/products")
    .then((res) => {
      const data = res.data.data;
      tableBody.innerHTML = "";
      data.forEach((item) => {
        tableBody.innerHTML += `
          <tr>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
            <td>${item.description}</td>
            <td>
              <button onclick="updateProduct(${item.id}, 'name')">Edit Name</button>
              <button onclick="updateProduct(${item.id}, 'price')">Edit Price</button>
              <button onclick="updateProduct(${item.id}, 'quantity')">Edit Quantity</button>
              <button class="delete-button" data-product-id="${item.id}">Delete</button>
            </td>
          </tr>
        `;
      });

      const deleteButtons = document.querySelectorAll(".delete-button");
      deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const productIdToDelete = button.dataset.productId;
          deleteProduct(productIdToDelete);
        });
      });
    })
    .catch((err) => {
      console.log(err);
      alert("Error fetching product data");
    });
};


fetchProducts();


const updateProduct = (id, field) => {
  const newValue = prompt(`Enter new ${field}:`);

  if (!newValue) {
    alert("Field cannot be empty!");
    return;
  }

  axios.put(`https://modified-alloy-392605.oa.r.appspot.com/product/${id}`, {
    [field]: newValue,
  })
    .then((res) => {
      console.log(res);
      alert("Product Edited");
      fetchProducts();
    })
    .catch((err) => {
      console.log(err);
      alert("Error editing product");
    });
};

const deleteProduct = (id) => {
  axios.delete(`https://modified-alloy-392605.oa.r.appspot.com/product/${id}`)
    .then((res) => {
      if (res.data && res.data.message === "Product Found") {
        console.log(res);
        alert("Product Deleted");
        fetchProducts();
      } else {
        console.log(res);
        alert("Product not found or already deleted");
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Error deleting product");
    });
};


const itemForm = document.getElementById("itemForm");
itemForm.addEventListener("submit", (event) => {
  event.preventDefault();
  axios.post("https://modified-alloy-392605.oa.r.appspot.com/product", {
    name: document.getElementById("itemName").value,
    price: document.getElementById("itemPrice").value,
    quantity: document.getElementById("itemQuantity").value,
    description: document.getElementById("itemDescription").value,
  })
    .then((res) => {
      console.log(res);
      alert("Product Added");
      fetchProducts();
    })
    .catch((err) => {
      console.log(err);
      alert("Error adding product");
    });
});



fetchProducts();