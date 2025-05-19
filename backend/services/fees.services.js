const FeesModel = require('../config/models/fees.models'); 

class FeesServices {
    //in ra danh sach phi
    async getAllFees() {
        return await FeesModel.find({}); 
    }
    //them phi moi
    async createFees(data) {
        const { name, description, fee_type_enum, unit_price } = data;
        
        if (!name || !description || !fee_type_enum || unit_price === undefined) {
            throw new Error("Missing required fields");
        }

        
        const newFees = new FeesModel({ 
            name: name,
            description: description,
            fee_type_enum: fee_type_enum, 
            unit_price: unit_price 
        });

        return await newFees.save();
    }
    

    //tim kiem fees
    async getFeesById(id){
        if(!id){
            throw new Error('Fee ID is required');
        }
        const fees = await FeesModel.findById({_id : id});
        if(!id){
            throw new Error("Fee not fould!");
        }
        return fees;
    }
 
    async updateFees(id, data) {
        const { name, description, fee_type_enum, unit_price } = data;
    
    
        if (!id || Object.keys(data).length === 0) {
            throw new Error("Missing required fields or ID");
        }
    
    
        const updatedFee = await FeesModel.findByIdAndUpdate(
            id,
            {
                name,
                description,
                fee_type_enum,
                unit_price,
                updated_at: Date.now() 
            },
            { new: true, runValidators: true } 
        );
    
        if (!updatedFee) {
            throw new Error("Fee not found");
        }
    
        return updatedFee;
    }
    
    async deleteFees(id) {
           return await FeesModel.findByIdAndDelete({_id : id});
    }
    
    
}

module.exports = new FeesServices(); 
