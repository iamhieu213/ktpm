const InvoiceApartmentService = require("../services/invoice_apartment.service");

// Tạo liên kết hóa đơn với căn hộ
const createInvoiceApartment = async (req, res) => {
    try {
        const { apartment_id, invoice_id, amount_paid } = req.body;
        const result = await InvoiceApartmentService.createInvoiceApartment(apartment_id, invoice_id, amount_paid);
        return res.status(201).json({
            message: "Tạo liên kết hóa đơn thành công",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Lấy danh sách hóa đơn của căn hộ
const getApartmentInvoices = async (req, res) => {
    try {
        const { 
            page = 1, 
            pageSize = 10, 
            keyword = '', 
            type, 
            status, 
            sort = 'issue_date', 
            order = 'desc' 
        } = req.query;

        const result = await InvoiceApartmentService.getInvoices({ 
            page: parseInt(page), 
            pageSize: parseInt(pageSize), 
            keyword, 
            type, 
            status, 
            sort, 
            order 
        });

        

        return res.status(200).json({
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Ghi nhận thanh toán
const recordPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, payment_method, notes } = req.body;

        // Validate required fields
        if (!amount || !payment_method) {
            return res.status(400).json({
                message: "Số tiền và phương thức thanh toán là bắt buộc"
            });
        }

        // Validate payment method
        const validPaymentMethods = ["Cash", "Bank Transfer", "Credit Card", "Other"];
        if (!validPaymentMethods.includes(payment_method)) {
            return res.status(400).json({
                message: "Phương thức thanh toán không hợp lệ"
            });
        }

        const paymentData = {
            amount,
            payment_method,
            notes
        };

        const result = await InvoiceApartmentService.recordPayment(id, paymentData);
        return res.status(200).json({
            message: "Ghi nhận thanh toán thành công",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Lấy lịch sử thanh toán
const getPaymentHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await InvoiceApartmentService.getPaymentHistory(id);
        return res.status(200).json({
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Thống kê thanh toán
const getPaymentStatistics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({
                    message: "Định dạng ngày không hợp lệ. Vui lòng sử dụng định dạng YYYY-MM-DD"
                });
            }
            
            if (start > end) {
                return res.status(400).json({
                    message: "Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc"
                });
            }
        }

        const result = await InvoiceApartmentService.getPaymentStatistics(startDate, endDate);
        return res.status(200).json({
            message: "Lấy thống kê thanh toán thành công",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};

const deleteInvoiceApartment = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await InvoiceApartmentService.deleteInvoiceApartment(id);
        return res.status(200).json({
            message: "Xóa hóa đơn thành công",
            data: result            
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        }); 
    }
};

const updateInvoiceApartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount_paid, notes } = req.body;
        const result = await InvoiceApartmentService.updateInvoiceApartment(id, { amount_paid, notes });
        return res.status(200).json({
            message: "Cập nhật hóa đơn thành công",
            data: result            
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        }); 
    }
};

const getApartmentPayments = async (req, res) => {
    try {
        const { apartment_id } = req.params;
        const { startDate, endDate } = req.query;

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({
                    message: "Định dạng ngày không hợp lệ. Vui lòng sử dụng định dạng YYYY-MM-DD"
                });
            }
            
            if (start > end) {
                return res.status(400).json({
                    message: "Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc"
                });
            }
        }

        const result = await InvoiceApartmentService.getApartmentPayments(apartment_id, startDate, endDate);
        return res.status(200).json({
            message: "Lấy lịch sử thanh toán thành công",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Lấy tổng số tiền hóa đơn cho tất cả căn hộ
const getTotalInvoiceAmounts = async (req, res) => {
    try {
        const result = await InvoiceApartmentService.getTotalInvoiceAmounts();
        return res.status(200).json({
            message: "Lấy tổng số tiền hóa đơn thành công",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};

module.exports = {
    createInvoiceApartment,
    getApartmentInvoices,
    recordPayment,
    getPaymentHistory,
    getPaymentStatistics,
    deleteInvoiceApartment,
    updateInvoiceApartment,
    getApartmentPayments,
    getTotalInvoiceAmounts
}; 