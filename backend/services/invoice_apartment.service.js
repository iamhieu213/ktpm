const InvoiceApartment = require('../config/models/invoice_apartment.models');
const Invoice = require('../config/models/invoices.models');
const mongoose = require('mongoose');

class InvoiceApartmentService {

    async getInvoices({
        page = 1,
        pageSize = 10,
        keyword = '',
        type,
        status,
        sort = 'issue_date',
        order = 'desc'
      }) {
        try {
          const query = {};
      

          if (keyword) {
            query.$or = [
              { 'invoice.invoice_number': { $regex: keyword, $options: 'i' } },
              { 'invoice.name': { $regex: keyword, $options: 'i' } },
              { 'invoice.description': { $regex: keyword, $options: 'i' } }
            ];
          }
      
          if (type) query['invoice.type'] = type;
          if (status) query.payment_status = status;
      
          const skip = (page - 1) * pageSize;
          const sortField = sort || 'invoice.issue_date';
      
          const sortObj = {};
          sortObj[sortField] = order === 'asc' ? 1 : -1;
      
          const result = await InvoiceApartment.aggregate([
            {
              $lookup: {
                from: 'invoices',
                localField: 'invoice_id',
                foreignField: '_id',
                as: 'invoice'
              }
            },
            { $unwind: { path: '$invoice', preserveNullAndEmptyArrays: true } },
      
            {
              $lookup: {
                from: 'apartments',
                localField: 'apartment_id',
                foreignField: '_id',
                as: 'apartment'
              }
            },
            { $unwind: { path: '$apartment', preserveNullAndEmptyArrays: true } },
      
            // Thêm trường phụ để lọc/sắp xếp
            {
              $addFields: {
                'invoice_number': '$invoice.invoice_number',
                'name': '$invoice.name',
                'description': '$invoice.description',
                'issue_date': '$invoice.issue_date',
                'due_date': '$invoice.due_date',
                'type': '$invoice.type',
                'status': '$invoice.status'
              }
            },
      
            { $match: query },
      
            { $sort: sortObj },
            { $skip: skip },
            { $limit: pageSize },
      
            {
              $project: {
                invoice_apartment_id: '$_id',
                amount: '$amount_paid',
                payment_status: 1,
                payment_date: 1,
                payment_method: 1,
                notes: 1,
      
                invoice_number: 1,
                name: 1,
                description: 1,
                issue_date: 1,
                due_date: 1,
                type: 1,
                status: 1,
      
                apartment_info: {
                  address_number: { $ifNull: ['$apartment.address_number', 'N/A'] },
                  block: { $ifNull: ['$apartment.block', 'N/A'] },
                  floor: { $ifNull: ['$apartment.floor', 'N/A'] },
                  type: { $ifNull: ['$apartment.type', 'N/A'] },
                  status: { $ifNull: ['$apartment.status', 'N/A'] }
                }
              }
            }
          ]);
      
          const totalElements = await InvoiceApartment.countDocuments(query);
          const totalPages = Math.ceil(totalElements / pageSize);
      
          return {
            result,
            totalPages,
            totalElements
          };
      
        } catch (err) {
          console.error('Lỗi getInvoices:', err);
          throw new Error('Không thể lấy danh sách hóa đơn');
        }
      }


    async recordPayment(invoiceApartmentId, paymentData) {
        try {
            const invoiceApartment = await InvoiceApartment.findById(invoiceApartmentId);
            if (!invoiceApartment) {
                throw new Error('Không tìm thấy hóa đơn');
            }

            // Tạo bản ghi lịch sử thanh toán
            const paymentHistory = {
                amount: paymentData.amount,
                payment_date: new Date(),
                payment_method: paymentData.payment_method,
                notes: paymentData.notes || null
            };

            // Cập nhật trạng thái thanh toán và thêm vào lịch sử
            const response = await InvoiceApartment.findByIdAndUpdate(
                invoiceApartmentId,
                {
                    $set: {
                        payment_status: "Paid",
                        payment_date: new Date(),
                        payment_method: paymentData.payment_method,
                        notes: paymentData.notes
                    },
                    $push: {
                        payment_history: paymentHistory
                    }
                },
                { new: true }
            );

            return {
                success: true,
                message: 'Thanh toán thành công',
                data: response
            };

        } catch (error) {
            throw new Error(`Lỗi khi ghi nhận thanh toán: ${error.message}`);
        }
    }

    // Lấy báo cáo thanh toán
    async getPaymentReport(startDate, endDate) {
        try {
            return await InvoiceApartment.aggregate([
                {
                    $match: {
                        payment_date: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }
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
                        _id: "$apartment_id",
                        total_invoices: { $sum: 1 },
                        total_amount: { $sum: "$invoice.amount" },
                        total_paid: { $sum: "$amount_paid" },
                        total_late_fee: { $sum: "$late_fee.amount" }
                    }
                }
            ]);
        } catch (error) {
            throw new Error(`Lỗi khi lấy báo cáo: ${error.message}`);
        }
    }

    async deleteInvoiceApartment(invoiceApartmentId) {
        try {
            const invoiceApartment = await InvoiceApartment.findById(invoiceApartmentId);
            if (!invoiceApartment) {
                throw new Error('Không tìm thấy hóa đơn');
            }  
            await InvoiceApartment.findByIdAndDelete(invoiceApartmentId);
            return true;
        } catch (error) {
            throw new Error(`Lỗi khi xóa hóa đơn: ${error.message}`);
        }
    }   
    
    async createInvoiceApartment(apartment_id, invoice_id, amount_paid = 0) {
        try {
            // Check if the invoice exists
            const invoice = await Invoice.findById(invoice_id);
            if (!invoice) {
                throw new Error('Invoice not found');
            }

            // Create new invoice apartment
            const newInvoiceApartment = new InvoiceApartment({
                apartment_id,
                invoice_id,
                payment_status: "Unpaid",
                amount_paid: amount_paid,
            });

            const savedInvoiceApartment = await newInvoiceApartment.save();
            return savedInvoiceApartment;
        } catch (error) {
            throw new Error(`Error creating invoice apartment: ${error.message}`);
        }
    }

    async updateInvoiceApartment(invoiceApartmentId, updateData) {
        try {
            const invoiceApartment = await InvoiceApartment.findById(invoiceApartmentId);
            if (!invoiceApartment) {
                throw new Error('Không tìm thấy hóa đơn');
            }

            // Cập nhật số tiền và ghi chú
            const updatedInvoiceApartment = await InvoiceApartment.findByIdAndUpdate(
                invoiceApartmentId,
                {
                    amount_paid: updateData.amount_paid,
                    notes: updateData.notes
                },
                { new: true }
            );

            return updatedInvoiceApartment;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật hóa đơn: ${error.message}`);
        }
    }

    // Thống kê thanh toán
    async getPaymentStatistics(startDate, endDate) {
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
                    $lookup: {
                        from: "apartments",
                        localField: "apartment_id",
                        foreignField: "_id",
                        as: "apartment"
                    }
                },
                {
                    $unwind: "$apartment"
                },
                {
                    $group: {
                        _id: {
                            type: "$invoice.type",
                            month: { $month: "$payment_date" },
                            year: { $year: "$payment_date" }
                        },
                        total_amount: { $sum: "$amount_paid" },
                        total_invoices: { $sum: 1 },
                        apartments: { $addToSet: "$apartment.address_number" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        type: "$_id.type",
                        month: "$_id.month",
                        year: "$_id.year",
                        total_amount: 1,
                        total_invoices: 1,
                        total_apartments: { $size: "$apartments" }
                    }
                },
                {
                    $sort: {
                        year: 1,
                        month: 1,
                        type: 1
                    }
                }
            ]);


            // Tính tổng doanh thu
            const totalRevenue = result.reduce((sum, item) => sum + item.total_amount, 0);

            return {
                statistics: result,
                total_revenue: totalRevenue
            };
        } catch (error) {
            throw new Error(`Lỗi khi thống kê thanh toán: ${error.message}`);
        }
    }

    async getApartmentPayments(apartment_id, startDate, endDate) {
        if (!apartment_id) throw new Error("Thiếu apartment_id");
    
        const matchDate = {};
        if (startDate) matchDate.$gte = new Date(startDate);
        if (endDate) matchDate.$lte = new Date(endDate);
    
        const pipeline = [
            { $match: { apartment_id: new mongoose.Types.ObjectId(apartment_id) } },
            { $unwind: "$payment_history" },
            ...(startDate || endDate ? [{ $match: { "payment_history.payment_date": matchDate } }] : []),
            {
                $lookup: {
                    from: "invoices",
                    localField: "invoice_id",
                    foreignField: "_id",
                    as: "invoice_info"
                }
            },
            { $unwind: "$invoice_info" },
            {
                $project: {
                    _id: 0,
                    invoice_id: 1,
                    amount: "$payment_history.amount",
                    payment_date: "$payment_history.payment_date",
                    payment_method: "$payment_history.payment_method",
                    notes: "$payment_history.notes",
                    invoice_number: "$invoice_info.invoice_number",
                    invoice_name: "$invoice_info.name"
                }
            }
        ];
    
        const payments = await InvoiceApartment.aggregate(pipeline);
        const total_amount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    
        return { payments, total_amount };
    }

    // Lấy tổng số tiền hóa đơn cho tất cả căn hộ
    async getTotalInvoiceAmounts() {
        try {
          const result = await InvoiceApartment.aggregate([
            {
              $match: {
                invoice_id: { $type: "objectId" },
                apartment_id: { $type: "objectId" },
              },
            },
            {
              $lookup: {
                from: "invoices",
                localField: "invoice_id",
                foreignField: "_id",
                as: "invoice",
              },
            },
            { $unwind: "$invoice" },
      
            // Chỉ giữ những hóa đơn đã thanh toán
            {
              $match: {
                payment_status: "Paid",
              },
            },
      
            {
              $lookup: {
                from: "apartments",
                localField: "apartment_id",
                foreignField: "_id",
                as: "apartment",
              },
            },
            { $unwind: "$apartment" },
      
            {
              $group: {
                _id: "$apartment_id",
                name: { $first: "$apartment.address_number" },
                totalAmount: { $sum: "$amount_paid" },
                paidAmount: { $sum: "$amount_paid" },
                contributionAmount: {
                  $sum: {
                    $cond: [
                      { $eq: ["$invoice.type", "Contribute"] },
                      "$amount_paid",
                      0,
                    ],
                  },
                },
              },
            },
      
            {
              $project: {
                _id: 0,
                name: 1,
                totalAmount: 1,
                paidAmount: 1,
                contributionAmount: 1,
              },
            },
      
            { $limit: 5 },
          ]);
      
          return result;
        } catch (error) {
          throw new Error(`Lỗi khi lấy tổng số tiền hóa đơn: ${error.message}`);
        }
      }
}

module.exports = new InvoiceApartmentService(); 