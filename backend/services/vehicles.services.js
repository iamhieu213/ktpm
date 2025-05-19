const vehicleModel = require("../config/models/vehicles.models");
const Apartment = require("../config/models/apartment.models");

class VehiclesServices {
    async createVehicle(data) {
        const { category, address_number, vehicle_number } = data;

        
        const apartment = await Apartment.findOne({ address_number: address_number });
        if (!apartment) {
            throw new Error("Address apartment not found");
        }

     
        const newVehicle = new vehicleModel({
            category: category,
            apartment_address_number: address_number,
            register_date: new Date(),
            address_id: apartment._id,
            vehicle_number
        });

        return await newVehicle.save();
    }

    async getAllVehicle(){
            return await vehicleModel.find({});
    }

    async deleteVehicle(id){
        return await vehicleModel.findByIdAndDelete(id);
    }
    async getVehicleById(id){
        return await vehicleModel.find({address_id : id});
    }
    
    async findVehicleById(id){
        return await vehicleModel.findOne({_id : id});
    }
    async updateVehicle(id , data){
        const vehicle = await this.findVehicleById({_id : id});
        if(!vehicle){
            throw new Error("Vehicle not found");
    }
    return await vehicleModel.updateOne({_id: id}, { $set: data });


    }

}

module.exports = new VehiclesServices();
