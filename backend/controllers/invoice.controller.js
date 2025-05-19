const InvoiceService = require("../services/invoice.services");

// Tạo hóa đơn mới
const createInvoice = async (req, res) => {
    try {
        const invoiceData = req.body;
        const result = await InvoiceService.createInvoice(invoiceData);
        return res.status(201).json({
            message: "Tạo hóa đơn thành công",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Lấy danh sách hóa đơn
const getInvoices = async (req, res) => {
    try {
        const { 
            page = 1, 
            pageSize = 10, 
            type 
        } = req.query;

        const result = await InvoiceService.getInvoices({ 
            page: parseInt(page), 
            pageSize: parseInt(pageSize), 
            type 
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

// Lấy chi tiết hóa đơn
const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await InvoiceService.getInvoiceById(id);
        if (!result) {
            return res.status(404).json({
                message: "Không tìm thấy hóa đơn"
            });
        }
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

// Cập nhật hóa đơn
const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const result = await InvoiceService.updateInvoice(id, updateData);
        if (!result) {
            return res.status(404).json({
                message: "Không tìm thấy hóa đơn"
            });
        }
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

// Xóa hóa đơn
const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await InvoiceService.deleteInvoice(id);
        if (!result) {
            return res.status(404).json({
                message: "Không tìm thấy hóa đơn"
            });
        }
        return res.status(200).json({
            message: "Xóa hóa đơn thành công"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Thống kê doanh thu
const getRevenueStatistics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const result = await InvoiceService.getRevenueStatistics(startDate, endDate);
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

module.exports = {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
    getRevenueStatistics
}; 