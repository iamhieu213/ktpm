'use strict'

const ApartmentServices = require("../services/apartment.services");

class ApartmentControllers {
    async getAllApartments(req, res) {
        try {
            const listApartment = await ApartmentServices.getAllApartments();
            res.status(200).json({
                success: true,
                message: 'Lấy danh sách căn hộ thành công',
                data: listApartment
            });
        } catch(error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Lỗi khi lấy danh sách căn hộ",
                error: error.message
            });
        }
    }

    async getResidentByAddressNumber (req,res) {
        try{
           const listResident = await ApartmentServices.getAllResidentsByAddressNumber(req.params.address_number);
           res.status(200).json({
            success: true,
            message : "Lay danh sach thanh cong",
            data : listResident
           })
        }catch(error){
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Lỗi khi lấy danh sách",
                error: error.message
            });
        }
    }

    async findApartmentbyId(req, res) {
        try {
            const apartment = await ApartmentServices.findApartmentbyId(req.params.id);
            if (!apartment) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy căn hộ'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Tìm thấy căn hộ',
                data: apartment
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Lỗi khi tìm căn hộ",
                error: error.message
            });
        }
    }

    async findApartmentbyAddressNumber(req,res){
        try {
            console.log(req.params);
            
            const apartment = await ApartmentServices.findByAddressNumber(req.params.address_number);
            if (!apartment) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy căn hộ'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Tìm thấy căn hộ',
                data: apartment
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Lỗi khi tìm căn hộ",
                error: error.message
            });
        }
    }

    async createApartment(req, res) {
        try {
            // Validate dữ liệu đầu vào
            const { address_number, area, status, type, floor, block } = req.body;
            
            if (!address_number || !area || !status || !type || !floor || !block) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin bắt buộc'
                });
            }

            // Kiểm tra trùng lặp address_number
            const existingApartment = await ApartmentServices.findByAddressNumber(address_number);
            if (existingApartment) {
                return res.status(400).json({
                    success: false,
                    message: 'Số căn hộ đã tồn tại'
                });
            }

            const newApartment = await ApartmentServices.createApartment(req.body);
            res.status(201).json({
                success: true,
                message: 'Tạo căn hộ thành công',
                data: newApartment
            });
        } catch(error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Lỗi khi tạo căn hộ",
                error: error.message
            });
        }
    }

    async updateApartmentbyId(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            console.log("vờ lờ", updateData);
            
            // Kiểm tra căn hộ tồn tại
            const apartment = await ApartmentServices.findApartmentbyId(id);
            if (!apartment) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy căn hộ'
                });
            }

            // Nếu cập nhật address_number, kiểm tra trùng lặp
            if (updateData.address_number && updateData.address_number !== apartment.address_number) {
                const existingApartment = await ApartmentServices.findByAddressNumber(updateData.address_number);
                if (existingApartment) {
                    return res.status(400).json({
                        success: false,
                        message: 'Số căn hộ đã tồn tại'
                    });
                }
            }

            const updatedApartment = await ApartmentServices.updateApartment(id, updateData);
            
            
            res.status(200).json({
                success: true,
                message: 'Cập nhật căn hộ thành công',
                data: updatedApartment
            });
        } catch(error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Lỗi khi cập nhật căn hộ",
                error: error.message
            });
        }
    }

    async deleteApartment(req, res) {
        try {
            const { id } = req.params;

            // Kiểm tra căn hộ tồn tại
            const apartment = await ApartmentServices.findApartmentbyId(id);
            if (!apartment) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy căn hộ'
                });
            }

            // Kiểm tra xem căn hộ có cư dân không
            const hasResidents = await ApartmentResident.findOne({ apartment_id: id });
            if (hasResidents) {
                return res.status(400).json({
                    success: false,
                    message: 'Không thể xóa căn hộ đang có cư dân'
                });
            }

            await ApartmentServices.deleteApartment(id);
            res.status(200).json({
                success: true,
                message: 'Xóa căn hộ thành công'
            });
        } catch(error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Lỗi khi xóa căn hộ",
                error: error.message
            });
        }
    }
}

module.exports = new ApartmentControllers();