'use strict'

const ResidentServices = require('../services/residents.services');

class ResidentsControllers {
    async getAllResidents(req, res) {
        try {
            const { filter } = req.query;
            let list;
            if (filter) {
                // filter dạng: name~'keyword'
                const match = filter.match(/name~'([^']+)'/);
                if (match) {
                    const keyword = match[1];
                    list = await ResidentServices.findResidentsByName(keyword);
                } else {
                    list = await ResidentServices.findAllResidents();
                }
            } else {
                list = await ResidentServices.findAllResidents();
            }
            res.status(200).json({
                success: true,
                message: 'Residents List',
                data: list
            });
        }catch(error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Failed to load Residents!"
            })
        }
    }
    async createResident(req, res) {
        console.log(req.body);
        
        try {
            const newResident = await ResidentServices.createResident(req.body);
            res.status(200).json({
                success: true,
                message: 'Resident Created Successfully',
                data: newResident
            })
        }catch(error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Failed to create Resident!",
                error: error
            })
        }
    }
    async findResidentById(req, res) {
        try {
            const resident = await ResidentServices.findResidentById(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Resident Found',
                data: resident
            })
        }catch(error) {
            console.log(error);
            res.status(404).send({
                success: false,
                message: 'Resident Not Found',
            })
        }
    }

    async findResidents (req, res) {
        try {
            const list = await ResidentServices.findResident(req.body);
            res.status(200).json({
                success: true,
                message: 'Residents List',
                data: list
            })
        }catch(error) {
            console.log(error);
            res.status(404).send({
                success: false,
                message: 'Resident Not Found'
            })
        }
    }

    async updateResident(req, res) {
        try {
            const updateResident = await  ResidentServices.updateResident(req.params.id_card_number,req.body);
            res.status(200).json({
                success: true,
                message: 'Resident Updated Successfully',
                data: updateResident
            })
        }catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Failed to update Resident!",
            })
        }
    }

    async deleteResidentById(req, res) {
        console.log(req.params);
        
        try {
            const deleteResident = await  ResidentServices.deleteResident(req.params.id_card_number);
            res.status(200).json({
                success: true,
                message: 'Resident Deleted Successfully',
            })
        }catch(error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Failed to delete Resident!",
                error: error
            })
        }
    }
}

module.exports = new ResidentsControllers();