class Services {
  getListProductsApi() {
    const url = "https://6a2f991fc9776ca6c0c5eae3.mockapi.io/Product";

    const promise = axios({
      url: url,
      method: "GET",
    });
    return promise;
  }
 
  addProductApi(prodcut) {
    const url = "https://6a2f991fc9776ca6c0c5eae3.mockapi.io/Product";
    const promise = axios({
      url: url,
      method: "POST",
      data: prodcut,
    });
    return promise;
  }


addProductApi(prodcut) {
    const url = "https://6a2f991fc9776ca6c0c5eae3.mockapi.io/Product";
    const promise = axios({
      url: url,
      method: "POST",
      data: prodcut,
    });
    return promise;
  }
  getProductByIdApi(id) {
    const url = `https://6a2f991fc9776ca6c0c5eae3.mockapi.io/Product/${id}`;
    const promise = axios({
      url: url,
      method: "GET",
    });
    return promise;
    
  }
  deleteProductApi(id) {
    const url = `https://6a2f991fc9776ca6c0c5eae3.mockapi.io/Product/${id}`;
    const promise = axios({
      url: url,
      method: "DELETE",
    });
    return promise;
  }
  updateProductByApi(prodcut) {
    const url = `https://6a2f991fc9776ca6c0c5eae3.mockapi.io/Product/${prodcut.id}`;
    const promise = axios({
      url: url,
      method: "PUT",
      data : prodcut,
    });
    return promise;
  }
}
export default Services;
