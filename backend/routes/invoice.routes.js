const express = require("express");
const router = express.Router();
const InvoiceController = require("../controllers/invoice.controller");
const InvoiceApartmentController = require("../controllers/invoice_apartment.controller");

// Routes cho InvoiceApartment (more specific routes first)
router.post("/apartment", InvoiceApartmentController.createInvoiceApartment);
router.get("/apartment", InvoiceApartmentController.getApartmentInvoices);
router.post("/payment/:id", InvoiceApartmentController.recordPayment);
router.get("/payment/history/:id", InvoiceApartmentController.getPaymentHistory);
router.get("/statistics/payment", InvoiceApartmentController.getPaymentStatistics);
router.delete("/payment/:id", InvoiceApartmentController.deleteInvoiceApartment);
router.put("/payment/:id", InvoiceApartmentController.updateInvoiceApartment);
router.get("/:apartment_id/payments", InvoiceApartmentController.getApartmentPayments);

// Routes cho Invoice (more generic routes last)
router.post("/", InvoiceController.createInvoice);
router.get("/", InvoiceController.getInvoices);
router.get("/statistics/revenue", InvoiceController.getRevenueStatistics);
router.get("/:id", InvoiceController.getInvoiceById);
router.put("/:id", InvoiceController.updateInvoice);
router.delete("/:id", InvoiceController.deleteInvoice);

module.exports = router; 