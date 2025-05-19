const express = require("express");
const router = express.Router();
const InvoiceApartmentController = require("../controllers/invoice_apartment.controller");

// Routes cho InvoiceApartment
router.get("/total", InvoiceApartmentController.getTotalInvoiceAmounts);

module.exports = router; 