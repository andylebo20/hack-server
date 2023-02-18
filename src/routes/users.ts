import expressRouter from "express-promise-router";
import { UserController } from "src/controllers/UserController";

const router = expressRouter();

router.get("/properties", UserController.getProperties);
router.get("/property/:id", UserController.getPropertyById);
router.get("/checkout-url/:id", UserController.getCheckoutUrlForPropertyId);
router.get("/booking-data", UserController.getBookingData);

// router.post("/book", UserController.bookProperty);
router.post("/property", UserController.createNewProperty);
router.post("/invoice-webhook", UserController.invoiceWebhook);

export default router;
