import Services from "../../services/api.js";
import Product from "../models/Product.js";
import Validation from "../models/validation.js";
const valid = new Validation();
const services = new Services();
let allProducts = [];
function getId(id) {
  return document.getElementById(id);
}
function getListProducts() {
  services
    .getListProductsApi()
    .then(function (result) {
      allProducts = result.data; // lưu lại
      renderUI(allProducts);
    })
    .catch(function (error) {
      console.log(error);
    });
}
//bam vao nut them moi
getId("btnThemSP").onclick = function () {
  resetForm();
  resetValidation();

  openModal();

  getId("modalTitle").innerHTML = "Add Product";

  getId("modalFooter").innerHTML = `
    <button
      onclick="handleAddProduct()"
      class="bg-green-500 text-white px-4 py-2 rounded"
    >
      Add Product
    </button>
  `;
};
//add product

function handleAddProduct() {
  const name = getId("TenSP").value;
  const price = getId("GiaSP").value;
  const screen = getId("ScreenSP").value;
  const backCamera = getId("BackCameraSP").value;
  const frontCamera = getId("FrontCameraSP").value;
  const image = getId("HinhSP").value;
  const type = getId("LoaiSP").value;
  const desc = getId("MoTa").value;

  let isValid = true;

  isValid =
    valid.checkEmpty(name, "tbTenSP", "*Tên không được để trống") &&
    valid.checkName(name, "tbTenSP", "*Tên không hợp lệ") &&
    isValid;

  isValid =
    valid.checkEmpty(price, "tbGia", "*Giá không được để trống") &&
    valid.checkPrice(price, "tbGia", "*Giá phải lớn hơn 0") &&
    isValid;

  isValid =
    valid.checkEmpty(screen, "tbManHinh", "*Không được để trống") && isValid;

  isValid =
    valid.checkEmpty(backCamera, "tbCameraSau", "*Không được để trống") &&
    isValid;

  isValid =
    valid.checkEmpty(frontCamera, "tbCameraTruoc", "*Không được để trống") &&
    isValid;

  isValid =
    valid.checkEmpty(image, "tbHinh", "*Không được để trống") &&
    valid.checkImage(
      image,
      "tbHinh",
      "*URL phải có đuôi .jpg .jpeg .png .gif .webp",
    ) &&
    isValid;

  isValid =
    valid.checkEmpty(desc, "tbMoTa", "*Mô tả không được để trống") && isValid;

  if (!isValid) return;

  const product = new Product(
    "",
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    image,
    type,
    desc,
  );

  services.addProductApi(product).then(function () {
    alert(`Thêm thành công : ${name}`);
    closeModal();
    getListProducts();
  });
}
window.handleAddProduct = handleAddProduct;
//reset validation
function resetValidation() {
  getId("tbTenSP").innerHTML = "";
  getId("tbTenSP").style.display = "none";

  getId("tbGia").innerHTML = "";
  getId("tbGia").style.display = "none";

  getId("tbManHinh").innerHTML = "";
  getId("tbManHinh").style.display = "none";

  getId("tbCameraSau").innerHTML = "";
  getId("tbCameraSau").style.display = "none";

  getId("tbCameraTruoc").innerHTML = "";
  getId("tbCameraTruoc").style.display = "none";

  getId("tbHinh").innerHTML = "";
  getId("tbHinh").style.display = "none";

  getId("tbLoai").innerHTML = "";
  getId("tbLoai").style.display = "none";

  getId("tbMoTa").innerHTML = "";
  getId("tbMoTa").style.display = "none";
}
function handleDelete(id) {
  const promise = services.deleteProductApi(id);
  promise
    .then(function (result) {
      const data = result.data;
      console.log(data);
      alert(`Delete san pham:${data.name}`);

      //render lai
      getListProducts();
    })
    .catch(function (error) {
      console.log(error);
    });
}
window.handleDelete = handleDelete;
function resetForm() {
  getId("TenSP").value = "";
  getId("GiaSP").value = "";
  getId("ScreenSP").value = "";
  getId("BackCameraSP").value = "";
  getId("FrontCameraSP").value = "";
  getId("HinhSP").value = "";
  getId("LoaiSP").value = "iphone";
  getId("MoTa").value = "";
}
function handelEdit(id) {
  resetValidation();
  openModal();
  console.log(id);
  getId("modalTitle").innerHTML = "Edit Product";
  const btnUpdate = `
<button
  onclick="handleUpdateProduct('${id}')"
  class="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg shadow"
>
  Update Product
</button>
`;
  getId("modalFooter").innerHTML = btnUpdate;
  const promise = services.getProductByIdApi(id);
  promise
    .then(function (result) {
      const data = result.data;
      //Dom toi cac the input show cac thuoc tinh tu data
      getId("TenSP").value = data.name;
      getId("GiaSP").value = data.price;
      getId("ScreenSP").value = data.screen;
      getId("BackCameraSP").value = data.backCamera;
      getId("FrontCameraSP").value = data.frontCamera;
      getId("HinhSP").value = data.img;
      getId("LoaiSP").value = data.type;
      getId("MoTa").value = data.desc;
    })
    .catch(function (error) {
      console.log(error);
    });
}
window.handelEdit = handelEdit;
function handleUpdateProduct(id) {
  console.log(id);
  //dom toi san pham neu nguoi ta co thay doi
  const name = getId("TenSP").value;
  const price = getId("GiaSP").value;
  const screen = getId("ScreenSP").value;
  const backCamera = getId("BackCameraSP").value;
  const frontCamera = getId("FrontCameraSP").value;
  const img = getId("HinhSP").value;
  const type = getId("LoaiSP").value;
  const desc = getId("MoTa").value;
  const prodcut = new Product(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    type,
    desc,
  );
  console.log(prodcut);
  const promise = services.updateProductByApi(prodcut);
  promise
    .then(function (result) {
      const data = result.data;
      alert(`cap nhat thanh cong:${data.name}`);
      getListProducts();
      closeModal();

      document.getElementsByClassName("close")[0].click();
      resetForm();
    })
    .catch(function (error) {
      console.log(error);
    });
}
window.handleUpdateProduct = handleUpdateProduct;

function renderUI(list) {
  let content = "";

  for (let i = 0; i < list.length; i++) {
    const product = list[i];

    content += `
      <tr>
        <td class="border p-2">${i + 1}</td>

        <td class="border p-2">${product.name}</td>

        <td class="border p-2">$${product.price}</td>

        <td class="border p-2">${product.screen}</td>

        <td class="border p-2">${product.backCamera}</td>

        <td class="border p-2">${product.frontCamera}</td>

        <td class="border p-2">
          <img
            src="${product.img}"
            alt="${product.name}"
            width="60"
          />
        </td>
        
        <td class="border p-2">${product.type}</td>

        <td class="border p-2">${product.desc}</td>


        <td class="border p-2 flex flex-col gap-3">
          <button
            class="bg-red-500 text-white px-3 py-1 rounded"
            onclick="handleDelete('${product.id}')"
          >
            Delete
          </button>

          <button
            class="bg-blue-500 text-white px-3 py-1 rounded ml-2"
            onclick="handelEdit('${product.id}')"
          >
            Edit
          </button>
        </td>
      </tr>
    `;
  }

  getId("tblDanhSachSP").innerHTML = content;
  getId("TenSP").addEventListener("input", function () {
    if (this.value.trim() === "") {
      valid.checkEmpty(this.value, "tbTenSP", "*Tên không được để trống");
    } else {
      valid.checkName(this.value, "tbTenSP", "*Tên không hợp lệ");
    }
  });

  getId("GiaSP").addEventListener("input", function () {
    if (valid.checkEmpty(this.value, "tbGia", "*Giá không được để trống")) {
      valid.checkPrice(this.value, "tbGia", "*Giá phải lớn hơn 0");
    }
  });

  getId("ScreenSP").addEventListener("input", function () {
    valid.checkEmpty(
      this.value,
      "tbManHinh",
      "*Thông tin màn hình không được để trống",
    );
  });

  getId("BackCameraSP").addEventListener("input", function () {
    valid.checkEmpty(
      this.value,
      "tbCameraSau",
      "*Thông tin camera sau không được để trống",
    );
  });

  getId("FrontCameraSP").addEventListener("input", function () {
    valid.checkEmpty(
      this.value,
      "tbCameraTruoc",
      "*Thông tin camera trước không được để trống",
    );
  });

  getId("HinhSP").addEventListener("input", function () {
    if (valid.checkEmpty(this.value, "tbHinh", "*Không được để trống")) {
      valid.checkImage(
        this.value,
        "tbHinh",
        "*URL phải có đuôi .jpg .jpeg .png .gif .webp",
      );
    }
  });

  getId("MoTa").addEventListener("input", function () {
    valid.checkEmpty(this.value, "tbMoTa", "*Mô tả không được để trống");
  });
}
//chu nang tim kiem
function handleSearch(keyword) {
  const filtered = allProducts.filter((product) =>
    product.name.toLowerCase().includes(keyword.toLowerCase()),
  );

  renderUI(filtered);
}
getId("searchInput").addEventListener("input", function () {
  handleSearch(this.value);
});
//tang/giam
getId("sortPrice").addEventListener("change", function () {
  handleSort(this.value);
});
function handleSort(type) {
  let result = [...allProducts]; // copy mảng gốc

  if (type === "asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (type === "desc") {
    result.sort((a, b) => b.price - a.price);
  }

  renderUI(result);
}
getListProducts();
