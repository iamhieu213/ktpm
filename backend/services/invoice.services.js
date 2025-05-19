"use strict";

const Invoice = require('../config/models/invoices.models');
const InvoiceApartment = require('../config/models/invoice_apartment.models');
const Apartment = require('../config/models/apartment.models');

class InvoiceService {

    async generateInvoiceNumber(type, issueDate) {
        const date = new Date(issueDate);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
      
        const typePrefixMap = {
          Electricity: "ELE",
          Water: "WAT",
          Service: "SRV",
          Other: "OTH"
        };
      
        const prefix = typePrefixMap[type] || "OTHR";
        const baseCode = `${prefix}-${month}${year}`;
      
        if (type === "Other") {
          const regex = new RegExp(`^${prefix}-${month}${year}-\\d{3}$`);
          const count = await Invoice.countDocuments({
            invoice_number: { $regex: regex }
          });
      
          const sequence = String(count + 1).padStart(3, "0");
          return `${baseCode}-${sequence}`;
        }
      
        return baseCode;
      }
      
    // Tạo hóa đơn mới
    async createInvoice({name , type , issue_date , due_date , description}) {
        try {
            
            const invoice_number = await this.generateInvoiceNumber(type, issue_date);
            const invoice = new Invoice({name , type , issue_date , due_date , description, invoice_number})
            return await invoice.save();
        } catch (error) {
            throw new Error(`Lỗi khi tạo hóa đơn: ${error.message}`);
        }
    }

    async getInvoices({ page = 1, pageSize = 10, type }) {
        try {
            const query = { status: "Active" };
            
            // Add type filter if provided
            if (type) {
                query.type = type;
            }

            // Calculate skip value for pagination
            const skip = (page - 1) * pageSize;

            // Get total count for pagination
            const totalElements = await Invoice.countDocuments(query);
            const totalPages = Math.ceil(totalElements / pageSize);

            // Get paginated results
            const invoices = await Invoice.find(query)
                .skip(skip)
                .limit(pageSize)
                .sort({ created_at: -1 });

            return {
                result: invoices,
                totalPages,
                totalElements,
                currentPage: page,
                pageSize
            };
      
        } catch (err) {
            console.error('Lỗi getInvoices:', err);
            throw new Error('Không thể lấy danh sách hóa đơn');
        }
    }

    async getInvoiceById(id) {
        try {
            return await Invoice.findById(id)
                .populate('created_by', 'name email');
        } catch (error) {
            throw new Error(`Lỗi khi lấy chi tiết hóa đơn: ${error.message}`);
        }
    }

    async updateInvoice(id, updateData) {
        try {
            const invoice = await Invoice.findById(id);
            if (!invoice) {
                return null;
            }

            // Kiểm tra nếu hóa đơn đã được thanh toán thì không cho phép cập nhật
            const invoiceApartment = await InvoiceApartment.findOne({ 
                invoice_id: id,
                payment_status: "Paid"
            });

            if (invoiceApartment) {
                throw new Error('Không thể cập nhật hóa đơn đã được thanh toán');
            }

            // Cập nhật thông tin hóa đơn
            Object.assign(invoice, updateData);
            return await invoice.save();
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật hóa đơn: ${error.message}`);
        }
    }

    // Xóa hóa đơn
    async deleteInvoice(id) {
        try {
            const invoice = await Invoice.findById(id);
            if (!invoice) {
                return null;
            }

            const invoiceApartment = await InvoiceApartment.findOne({ 
                invoice_id: id,
                payment_status: "Paid"
            });

            if (invoiceApartment) {
                throw new Error('Không thể xóa hóa đơn đã được thanh toán');
            }

            // Xóa hóa đơn
            await Invoice.findByIdAndDelete(id);
            // Xóa các liên kết với căn hộ
            await InvoiceApartment.deleteMany({ invoice_id: id });

            return true;
        } catch (error) {
            throw new Error(`Lỗi khi xóa hóa đơn: ${error.message}`);
        }
    }

    // Thống kê doanh thu
    async getRevenueStatistics(startDate, endDate) {
        try {
            const matchStage = {
                payment_status: "Paid"
            };

            if (startDate && endDate) {
                matchStage.payment_date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }

            const result = await InvoiceApartment.aggregate([
                {
                    $match: matchStage
                },
                {
                    $lookup: {
                        from: "invoices",
                        localField: "invoice_id",
                        foreignField: "_id",
                        as: "invoice"
                    }
                },
                {
                    $unwind: "$invoice"
                },
                {
                    $group: {
                        _id: "$invoice.type",
                        total_revenue: { $sum: "$amount_paid" },
                        total_invoices: { $sum: 1 },
                        average_amount: { $avg: "$amount_paid" }
                    }
                },
                {
                    $project: {
                        type: "$_id",
                        total_revenue: 1,
                        total_invoices: 1,
                        average_amount: 1,
                        _id: 0
                    }
                }
            ]);

            return result;
        } catch (error) {
            throw new Error(`Lỗi khi thống kê doanh thu: ${error.message}`);
        }
    }
}

module.exports = new InvoiceService();