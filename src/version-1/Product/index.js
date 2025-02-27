import r from "express";
const route = r();
import _productValidator from "./productReqValidator.js";
import _productController from "./productController.js";

route.post(
    "/add",
    _productValidator.addProducts,
    _productController.addProducts,
);

route.get(
    "/get",
    //_productValidator.getProducts,
    _productController.getProducts,
);

route.get(
    "/get-all",
    _productController.getAll,
);

export default route;