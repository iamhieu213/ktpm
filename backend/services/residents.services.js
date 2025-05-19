'use strict'

const Residents = require('../config/models/residents.models')
const Apartment = require('../config/models/apartment.models')
//const Apart_Resident = require('../config/models/apartment_residents.models')
const mongoose = require('mongoose');
class ResidentsServices {

  async findAllResidents(keyword) {
       const regex = new RegExp(keyword, 'i');
       const residents = await Residents.find({
         $or: [
          { name : regex },
          {id_card_number : regex},
          {phone : regex},
          //{address_number : regex}
         ]
       });
       return residents.map(r=> ({
        id : r._id,
        address_number : r.address_number || "NaN",
        id_card_number : r.id_card_number,
        name : r.name,
        gender : r.gender,
        phone : r.phone,
        dob: r.dob,
        status : r.status || "NaN"
       }))
}

    

    async findResidentById (id_card_number) {
        return await Residents.findOne({id_card_number});
    }

    async createResident (data) {
        const {address_number, name, dob, gender,  id_card_number, status, phone} = data;
        if(!name||!dob||!gender||!id_card_number||!phone)throw new Error("Please fill all required fields");
        if(address_number){
          const apartment = await Apartment.findOne({address_number});
          if(!apartment)throw new Error("Apartment not found");
        }
        if(status){
          if(status === "Owner"){
            const ownerExist = await Residents.findOne({
              address_number,
              status : "Owner"
            });
            if(ownerExist)throw new Error("This apartment already has an Owner!")
          }
        }
        await Apartment.updateOne(
          {address_number},
          {$inc: {number_of_members : 1}}
        );

        const newResident = new Residents({
           address_number : address_number || null,
           name, 
           dob,
           gender,
           phone,
           id_card_number,
           status : status || null
        })
        await newResident.save();
        return newResident;
       
    }

    async findResident (data){
        const listResidents = await Residents.find({data});
        return listResidents;
    }
     
    async findResidentByIdCardNumber(query) {
        return await Residents.findOne(query);
    }

  async updateResident(id_card_number, data) {
  console.log("Updating resident with id_card_number:", id_card_number);

  // Tìm resident hiện tại
  const resident = await this.findResidentByIdCardNumber({ id_card_number });
  if (!resident) {
    throw new Error("No existing Resident!");
  }

  const oldAddressNumber = resident.address_number;

  let newApartment = null;
  let oldApartment = null;
  let isChangingApartment = false;

  // Kiểm tra nếu chuyển phòng
  if (data.address_number && data.address_number !== oldAddressNumber) {
    isChangingApartment = true;

    // Tìm phòng mới
    newApartment = await Apartment.findOne({ address_number: data.address_number });
    if (!newApartment) throw new Error("New apartment (address_number) not found!");

    // Tìm phòng cũ
    if (oldAddressNumber) {
      oldApartment = await Apartment.findOne({ address_number: oldAddressNumber });
      if (!oldApartment) throw new Error("Old apartment not found!");
    }
  }

  // Nếu là Owner, kiểm tra xem phòng mới đã có chủ chưa
  if (data.status === "Owner" && data.address_number) {
    const ownerExists = await Residents.findOne({
      address_number: data.address_number,
      status: "Owner",
      id_card_number: { $ne: id_card_number } // loại trừ chính resident này
    });

    if (ownerExists) {
      throw new Error("This apartment already has an Owner!");
    }
  }

  // Cập nhật thông tin resident
  const updatedResident = await Residents.updateOne(
    { id_card_number },
    { $set: data }
  );

  // Nếu chuyển phòng, cập nhật số thành viên của phòng cũ và mới
  if (isChangingApartment) {
    if (oldApartment) {
      await Apartment.updateOne(
        { _id: oldApartment._id },
        { $inc: { number_of_members: -1 } }
      );
    }

    await Apartment.updateOne(
      { _id: newApartment._id },
      { $inc: { number_of_members: 1 } }
    );
  }

  return updatedResident;
}




    async deleteResident(id_card_number) {
      console.log(id_card_number);
      
  if (!id_card_number) {
    throw new Error("Invalid resident ID");
  }

  const resident = await Residents.findOne({ id_card_number: id_card_number });
  if (!resident) {
    throw new Error("Resident not found");
  }

  await Residents.deleteOne({ id_card_number: id_card_number });

  // Cập nhật giảm số lượng thành viên trong căn hộ nếu cần
  await Apartment.updateOne(
    { address_number: resident.address_number },
    { $inc: { number_of_members: -1 } }
  );

  // Xóa liên kết trong Apart_Resident nếu có
  //await Apart_Resident.deleteMany({ resident_id: resident._id });

  return { message: "Resident deleted successfully" };
}

    async findResidentsByName(keyword) {
        // Tìm residents có tên chứa keyword (không phân biệt hoa thường)
        const regex = new RegExp(keyword, 'i');
        const residents = await Residents.find({ name: { $regex: regex } });
        return residents.map(r => ({
            id: r._id,
            address_number: r.address_number || null,
            name: r.name,
            id_card_number: r.id_card_number,
            gender: r.gender,
            phone: r.phone,
            dob: r.dob,
            status: r.status || "Unassigned"
        }));
    }
}

module.exports = new ResidentsServices();