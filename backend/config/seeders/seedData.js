// seedData.js
'use strict'

const mongoose = require("mongoose");
const User = require('../models/users.models');
const Apartment = require('../models/apartment.models');
const Resident = require('../models/residents.models');
const Invoice = require('../models/invoices.models');
const InvoiceApartment = require('../models/invoice_apartment.models');
const Vehicle = require('../models/vehicles.models');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb+srv://nhatnehihi:211004@my-cluster.au67y.mongodb.net/?retryWrites=true&w=majority&appName=my-cluster', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const seedData = async () => {
    try {
        // Xóa tất cả dữ liệu cũ
        await User.deleteMany({});
        await Apartment.deleteMany({});
        await Resident.deleteMany({});
        await Invoice.deleteMany({});
        await InvoiceApartment.deleteMany({});
        await Vehicle.deleteMany({});

        console.log('Đã xóa dữ liệu cũ');

        // Tạo dữ liệu test cho Users
        const users = [
            {
                name: 'Quản trị viên Hệ thống',
                email: 'admin@chungcu.vn',
                password: await bcrypt.hash('admin123', 10),
                auth_type: 'local',
                is_active: true
            },
            {
                name: 'Nhân viên Lễ tân',
                email: 'letan@chungcu.vn',
                password: await bcrypt.hash('staff456', 10),
                auth_type: 'local',
                is_active: true
            }
        ];
        const createdUsers = await User.insertMany(users);
        console.log('Đã tạo dữ liệu Users');

        // Tạo dữ liệu test cho Apartments
        const apartments = [
            {
                address_number: 101,
                area: 65,
                status: 'Residential',
                type: '2B',
                floor: 1,
                block: 'A',
                number_of_members: 2
            },
            {
                address_number: 102,
                area: 80,
                status: 'Residential',
                type: '3B',
                floor: 1,
                block: 'A',
                number_of_members: 4
            },
            {
                address_number: 201,
                area: 120,
                status: 'Business',
                type: '4B',
                floor: 2,
                block: 'B',
                number_of_members: 1
            }
        ];
        const createdApartments = await Apartment.insertMany(apartments);
        console.log('Đã tạo dữ liệu Apartments');

        // Tạo dữ liệu test cho Residents
        const residents = [
            {
                name: 'Nguyễn Văn A',
                dob: new Date('1985-05-15'),
                gender: 1,
                phone: '0901234567',
                id_card_number: '123456789012',
                status: 'Owner',
                id_card_verified_at: new Date()
            },
            {
                name: 'Trần Thị B',
                dob: new Date('1990-08-20'),
                gender: 0,
                phone: '0912345678',
                id_card_number: '234567890123',
                status: 'Family Member',
                id_card_verified_at: new Date()
            },
            {
                name: 'Lê Văn C',
                dob: new Date('1988-03-10'),
                gender: 1,
                phone: '0923456789',
                id_card_number: '345678901234',
                status: 'Owner',
                id_card_verified_at: new Date()
            }
        ];
        const createdResidents = await Resident.insertMany(residents);
        console.log('Đã tạo dữ liệu Residents');

        // Tạo dữ liệu test cho Invoices
        const invoices = [
            {
                invoice_number: 'INV-001-2024',
                name: 'Hóa đơn tiền điện tháng 1/2024',
                description: 'Tiền điện tiêu thụ tháng 1 năm 2024',
                issue_date: new Date('2024-01-01'),
                due_date: new Date('2024-01-15'),
                type: 'Electricity',
                status: 'Active'
            },
            {
                invoice_number: 'INV-002-2024',
                name: 'Hóa đơn tiền nước tháng 1/2024',
                description: 'Tiền nước tiêu thụ tháng 1 năm 2024',
                issue_date: new Date('2024-01-01'),
                due_date: new Date('2024-01-15'),
                type: 'Water',
                status: 'Active'
            },
            {
                invoice_number: 'INV-003-2024',
                name: 'Hóa đơn phí dịch vụ tháng 1/2024',
                description: 'Phí quản lý và dịch vụ tháng 1 năm 2024',
                issue_date: new Date('2024-01-01'),
                due_date: new Date('2024-01-15'),
                type: 'Service',
                status: 'Active'
            },
            {
                invoice_number: 'INV-004-2024',
                name: 'Hóa đơn tiền điện tháng 2/2024',
                description: 'Tiền điện tiêu thụ tháng 2 năm 2024',
                issue_date: new Date('2024-02-01'),
                due_date: new Date('2024-02-15'),
                type: 'Electricity',
                status: 'Active'
            },
            {
                invoice_number: 'INV-005-2024',
                name: 'Hóa đơn tiền nước tháng 2/2024',
                description: 'Tiền nước tiêu thụ tháng 2 năm 2024',
                issue_date: new Date('2024-02-01'),
                due_date: new Date('2024-02-15'),
                type: 'Water',
                status: 'Active'
            },
            {
                invoice_number: 'INV-006-2024',
                name: 'Hóa đơn phí dịch vụ tháng 2/2024',
                description: 'Phí quản lý và dịch vụ tháng 2 năm 2024',
                issue_date: new Date('2024-02-01'),
                due_date: new Date('2024-02-15'),
                type: 'Service',
                status: 'Active'
            },
            {
                invoice_number: 'INV-007-2024',
                name: 'Hóa đơn đóng góp tháng 1/2024',
                description: 'Phí đóng góp quỹ tháng 1 năm 2024',
                issue_date: new Date('2024-01-01'),
                due_date: new Date('2024-01-15'),
                type: 'Contribute',
                status: 'Active'
            }
        ];
        const createdInvoices = await Invoice.insertMany(invoices);
        console.log('Đã tạo dữ liệu Invoices');

        // Tạo dữ liệu test cho InvoiceApartments
        const invoiceApartments = [
            {
                apartment_id: createdApartments[0]._id,
                invoice_id: createdInvoices[0]._id,
                payment_status: 'Paid',
                payment_date: new Date('2024-01-10'),
                payment_method: 'Bank Transfer',
                amount_paid: 500000,
                payment_history: [{
                    amount: 500000,
                    payment_date: new Date('2024-01-10'),
                    payment_method: 'Bank Transfer',
                    notes: 'Thanh toán đầy đủ'
                }],
                notes: 'Đã thanh toán đầy đủ'
            },
            {
                apartment_id: createdApartments[1]._id,
                invoice_id: createdInvoices[1]._id,
                payment_status: 'Unpaid',
                amount_paid: 0,
                payment_history: [],
                notes: 'Chưa thanh toán'
            },
            {
                apartment_id: createdApartments[2]._id,
                invoice_id: createdInvoices[2]._id,
                payment_status: 'Overdue',
                amount_paid: 0,
                payment_history: [],
                notes: 'Quá hạn thanh toán'
            },
            {
                apartment_id: createdApartments[0]._id,
                invoice_id: createdInvoices[3]._id,
                payment_status: 'Paid',
                payment_date: new Date('2024-02-05'),
                payment_method: 'Cash',
                amount_paid: 450000,
                payment_history: [{
                    amount: 450000,
                    payment_date: new Date('2024-02-05'),
                    payment_method: 'Cash',
                    notes: 'Thanh toán tại văn phòng'
                }],
                notes: 'Đã thanh toán bằng tiền mặt'
            },
            {
                apartment_id: createdApartments[1]._id,
                invoice_id: createdInvoices[4]._id,
                payment_status: 'Paid',
                payment_date: new Date('2024-02-12'),
                payment_method: 'Credit Card',
                amount_paid: 350000,
                payment_history: [{
                    amount: 350000,
                    payment_date: new Date('2024-02-12'),
                    payment_method: 'Credit Card',
                    notes: 'Thanh toán qua thẻ tín dụng'
                }],
                notes: 'Đã thanh toán qua thẻ'
            },
            {
                apartment_id: createdApartments[2]._id,
                invoice_id: createdInvoices[5]._id,
                payment_status: 'Unpaid',
                amount_paid: 0,
                payment_history: [],
                notes: 'Chưa thanh toán'
            },
            {
                apartment_id: createdApartments[0]._id,
                invoice_id: createdInvoices[6]._id,
                payment_status: 'Paid',
                payment_date: new Date('2024-01-08'),
                payment_method: 'Bank Transfer',
                amount_paid: 200000,
                payment_history: [{
                    amount: 200000,
                    payment_date: new Date('2024-01-08'),
                    payment_method: 'Bank Transfer',
                    notes: 'Đóng góp quỹ tháng 1'
                }],
                notes: 'Đã đóng góp quỹ'
            }
        ];
        await InvoiceApartment.insertMany(invoiceApartments);
        console.log('Đã tạo dữ liệu InvoiceApartments');

        // Tạo dữ liệu test cho Vehicles
        const vehicles = [
            {
                vehicle_number: '51G-12345',
                category: 'Car',
                apartment_address_number: 101,
                register_date: new Date('2023-01-01'),
                address_id: createdApartments[0]._id
            },
            {
                vehicle_number: '51F-67890',
                category: 'Motorbike',
                apartment_address_number: 102,
                register_date: new Date('2023-02-01'),
                address_id: createdApartments[1]._id
            },
            {
                vehicle_number: '51G-54321',
                category: 'Car',
                apartment_address_number: 201,
                register_date: new Date('2023-03-01'),
                address_id: createdApartments[2]._id
            }
        ];
        await Vehicle.insertMany(vehicles);
        console.log('Đã tạo dữ liệu Vehicles');

        console.log('Hoàn thành việc tạo dữ liệu test!');

    } catch (error) {
        console.error('Lỗi khi tạo dữ liệu test:', error);
    } finally {
        mongoose.disconnect();
    }
};

seedData();