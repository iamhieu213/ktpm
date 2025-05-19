'use strict';

const FeesServices = require('../services/fees.services');

class FeesController {
    async getAllFees(req, res) {
        try {
            const listFees = await FeesServices.getAllFees();
            res.status(200).json({
                status: 'success',
                message: 'List of fees',
                list: listFees
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Failed to get all fees",
                error: error.message
            });
        }
    }

    async createFees(req,res){
        
        try{
            const newFees = await FeesServices.createFees(req.body);
            res.status(200).json({
                status : 'success',
                message : 'Fees created successfully',
                newFees : newFees
            })
        }catch(error){
            console.log(error);
            
              res.status(500).json({
                  success : false,
                  message : 'False to create Fees',
                  error : error
              })
        }
    }

    async getFeesById(req,res){
        try{
           const feeId = req.params.id;
           const fee = await FeesServices.getFeesById(feeId);
           res.status(200).json({
            status : 'success',
            message : "Fees found successfully",
            fee : fee
           })
        }catch(error){
            res.status(404).json({
                success : false,
                message : "Fees not fould",
                error : error
            })
        }
    }

    async updateFees(req, res) {
        try {
            const feeId = req.params.id; 
            const updatedFee = await FeesServices.updateFees(feeId, req.body);
    
            res.status(200).json({
                success: true,
                message: "Fee updated successfully",
                updatedFee
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: error.message || "Failed to update Fee",
            });
        }
    }

    async deleteFees(req, res) {
          try{
            const updateFee = await FeesServices.deleteFees(req.params.id);
            res.status(200).json({
                success: true,
                message: "Fee deleted successfully",
                updateFee : updateFee
            });
          }catch(error){
            res.status(404).json({
                success: false,
                message: "Fee not found",
                error: error.message || "Failed to delete Fee"
            })
          }
    }
    
}


module.exports = new FeesController();
