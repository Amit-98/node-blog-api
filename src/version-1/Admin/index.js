import r from "express";
const route = r();
import _adminValidator from "./adminReqValidator.js";
import _adminController from  "./adminController.js";
 
route.post(
   "/category/add",
   _adminValidator.categoryAdd,
   _adminController.categoryAdd
);

route.post(
   "/category/edit",
   _adminValidator.categoryEdit,
   _adminController.categoryEdit
);

route.post(
   "/category/remove",
   _adminValidator.categoryRemove,
   _adminController.categoryRemove
);

route.get(
   "/category/get",
   _adminController.categoryGetAll
);

export default route;