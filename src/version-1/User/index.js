import r from "express";
const route = r();
import _validator from "./userReqValidator.js";
import _controller from "./userController.js";

route.get(
    "/get-all",
    _controller.getAll,
);

route.get(
    "/user-details",
    _validator.userDetails,
    _controller.userDetails,
);

export default route;