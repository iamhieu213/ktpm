'use trict'

const vehiclesServices = require('../services/vehicles.services');

class vehicleControllers {
    async createVehicle(req, res) {
        try {
            const newVehicle = await vehiclesServices.createVehicle(req.body);
            res.status(200).json({
                success: true,
                message: "Vehicle created successfully",
                data: newVehicle,
            });
        } catch (error) {
            console.error("Error creating vehicle:", error); 
            res.status(400).json({
                success: false,
                message: "Không thể thêm dữ liệu",
                error: error.message, 
            });
        }
    }
    async getAllVehicle(req,res){
        try{
            const getAllVehicle = await vehiclesServices.getAllVehicle();
            res.status(200).json({
                success: 'true',
                message : 'Get all vehicle successfully',
                data : getAllVehicle
            })

        }catch(error){
            res.status(400).json({
                success: false,
                message: "get All vehicle not found",
                error: error.message
            })
        }
    }

    async deleteVehicle(req, res) {
        try {
            const { id } = req.params;  
    
            if (!id) {
                return res.status(400).json({ success: false, message: "Vehicle ID is required" });
            }
    
            const deletedVehicle = await vehiclesServices.deleteVehicle(id);
    
            if (!deletedVehicle) {
                return res.status(404).json({ success: false, message: "Vehicle not found" });
            }
    
            res.status(200).json({
                success: true,
                message: "Delete vehicle successfully",
                data: deletedVehicle
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
        }
    }
    
    async getAllVehicleById(req,res){
        try{
            const GetVehicleById = await vehiclesServices.getVehicleById(req.params.id);
            res.status(200).json({
                success: 'true',
                message : 'get vehicle by id successfully',
                data : GetVehicleById
            })

        }catch(error){
            res.status(400).json({
                success: false,
                message: "get vehicle not found",
                error: error.message
            })
        }
    }

    async updateVehicle(req,res){
        try{
            const updateVehicle = await vehiclesServices.updateVehicle(req.params.id,req.body);
            if(!updateVehicle){
                throw new Error('vehicle not found');
            }
            res.status(200).json({
                success: 'true',
                message : 'find vehicle by id successfully',
                data : updateVehicle
            })

        }catch(error){
            res.status(400).json({
                success: false,
                message: "find vehicle not found",
                error: error.message
            })
        }
    }

}

module.exports = new vehicleControllers();