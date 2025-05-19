const Apartment = require("../config/models/apartment.models");
const Resident = require("../config/models/residents.models");
const mongoose = require("mongoose")
class ApartmentService {
  // Lấy tất cả căn hộ kèm tên chủ hộ và số điện thoại
  async getAllApartments() {
    try {
      const apartments = await Apartment.find().sort({ address_number: 1 });
      const result = [];

      for (const apartment of apartments) {
        // Tìm chủ hộ trực tiếp từ bảng Resident
        const ownerInfo = await Resident.findOne({
          address_number: apartment.address_number,
          status: "Owner"
        });

        result.push({
          _id: apartment._id,
          address_number: apartment.address_number,
          area: apartment.area,
          status: apartment.status,
          type: apartment.type,
          floor: apartment.floor,
          block: apartment.block,
          number_of_members: apartment.number_of_members,
          owner: ownerInfo?.name || "",
          owner_phone: ownerInfo?.phone || ""
        });
      }

      return result;
    } catch (error) {
      console.error("Error in getAllApartments:", error);
      throw new Error(`Lỗi khi lấy danh sách căn hộ: ${error.message}`);
    }
  }
  
  async getAllResidentsByAddressNumber(address_number){
    const resident = await Resident.find({
      address_number : address_number,
      status : {$ne : "Owner"}
    })
    return resident;
  }
  // Tạo căn hộ mới
  async createApartment(data) {
    try {
      const { address_number, area, status, type, floor, block } = data;

      if (!address_number || !area || !status || !type || !floor || !block) {
        throw new Error("Thiếu thông tin bắt buộc");
      }

      const existingApartment = await this.findByAddressNumber(address_number);
      if (existingApartment) {
        throw new Error("Số căn hộ đã tồn tại");
      }

      const newApartment = new Apartment(data);
      return await newApartment.save();
    } catch (error) {
      throw new Error(`Lỗi khi tạo căn hộ: ${error.message}`);
    }
  }

  // Tìm căn hộ theo address_number
  async findByAddressNumber(address_number) {
    try {
      return await Apartment.findOne({ address_number });
    } catch (error) {
      throw new Error(`Lỗi khi tìm căn hộ: ${error.message}`);
    }
  }

  // Tìm căn hộ theo ID
  async findApartmentbyId(id) {
    try {
      return await Apartment.findById(id);
    } catch (error) {
      throw new Error(`Lỗi khi tìm căn hộ: ${error.message}`);
    }
  }

  // Xoá căn hộ
  async deleteApartment(id) {
    try {
      const apartment = await this.findApartmentbyId(id);
      if (!apartment) {
        throw new Error("Không tìm thấy căn hộ");
      }

      return await Apartment.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Lỗi khi xóa căn hộ: ${error.message}`);
    }
  }




async updateApartment(id, data) {
  try {
    const apartment = await Apartment.findById(id);
    if (!apartment) {
      throw new Error("Không tìm thấy căn hộ");
    }

    // Kiểm tra nếu đổi address_number
    if (data.address_number && data.address_number !== apartment.address_number) {
      const existingApartment = await Apartment.findOne({ address_number: data.address_number });
      if (existingApartment) {
        throw new Error("Số căn hộ mới đã tồn tại");
      }
    }

    const newAddressNumber = data.address_number || apartment.address_number;

    // Cập nhật chủ hộ nếu có
    if (data.owner) {
      let resident = null;

      if (mongoose.Types.ObjectId.isValid(data.owner)) {
        resident = await Resident.findById(data.owner);
      } else {
        resident = await Resident.findOne({ name: data.owner });
      }

      if (!resident) {
        throw new Error("Resident chủ phòng không tồn tại");
      }

      if (resident.address_number && resident.address_number !== apartment.address_number) {
        throw new Error("Resident này đã có phòng khác, không thể làm chủ phòng này");
      }

      data.owner = resident._id;

      await Resident.updateOne(
        { _id: resident._id },
        {
          $set: {
            status: "Owner",
            address_number: newAddressNumber
          }
        }
      );
    }

    // Cập nhật residents (thành viên)
    if (data.residents && Array.isArray(data.residents)) {
      for (const residentId of data.residents) {
        const resident = await Resident.findById(residentId);
        if (!resident) continue;

        // Nếu resident đang ở phòng khác thì cập nhật lại member_quantity phòng cũ
        if (resident.address_number && resident.address_number !== newAddressNumber) {
          // Giảm số thành viên của phòng cũ
          await Apartment.updateOne(
            { address_number: resident.address_number },
            { $inc: { member_quantity: -1 } }
          );
        }

        // Cập nhật address_number và status mới cho resident
        await Resident.updateOne(
          { _id: residentId },
          {
            $set: {
              status: "Family Member",
              address_number: newAddressNumber
            }
          }
        );
      }
    }

    // Tính lại member_quantity mới cho phòng hiện tại
    const memberCount = await Resident.countDocuments({ address_number: newAddressNumber });
    data.member_quantity = memberCount;

    // Cập nhật thông tin căn hộ
    const updatedApartment = await Apartment.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    return updatedApartment;
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật căn hộ: ${error.message}`);
  }
}




}

module.exports = new ApartmentService();
