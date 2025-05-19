import { useState } from "react";
import Form from "./Form";
import FormField from "./FormField";
import Button from "./Button";
import { HiPencil, HiTrash } from "react-icons/hi2";
import axios from "axios";
import { toast } from "react-toastify";

interface InvoiceFormProps {
    invoice_id: string;
    apartment_address: string;
    invoice_number: string;
    amount: number;
    notes: string;
}

export default function InvoiceForm({ invoice_id, apartment_address, invoice_number, amount, notes }: InvoiceFormProps) {
    const [formValues, setFormValues] = useState({
        apartment_address: apartment_address || "",
        invoice: invoice_number || "",
        amount: amount || 0,
        notes: notes || "",
    });
    
    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [id]: value,
        }));
    };
    
    const handleUpdate = async (e: any) => {
        e.preventDefault();
    
        const data = {
            amount_paid: formValues.amount,
            notes: formValues.notes
        }
    
        try {
            const response = await axios.put(`http://localhost:3000/api/invoice/payment/${invoice_id}`, data);
            toast.success("Update successful!");
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (err) {
            toast.error("Error occurred while updating");
        }
    }
    
    const handleDelete = async (e: any) => {
        e.preventDefault();
    
        try {
            const response = await axios.delete(`http://localhost:3000/api/invoice/payment/${invoice_id}`);
            toast.success("Delete successful!");
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (err) {
            toast.error("Error occurred while deleting");
            console.log(err);
        }
    }

    return (
        <Form width="500px">
            <FormField>
                <FormField.Label label={"Apartment"} />
                <FormField.Input
                    id="apartment"
                    type="text"
                    value={formValues.apartment_address}
                    disabled={true} 
                />
            </FormField>
    
            <FormField>
                <FormField.Label label={"Invoice Number"} />
                <FormField.Input
                    id="invoice"
                    type="text"
                    value={formValues.invoice}
                    disabled={true} 
                />
            </FormField>

            <FormField>
                <FormField.Label label={"Amount"} />
                <FormField.Input
                    id="amount"
                    type="number"
                    value={formValues.amount}
                    onChange={handleChange}
                />
            </FormField>
    
            <label>Notes: </label>
            <Form.TextArea
                id="notes"
                value={formValues.notes}
                onChange={handleChange}
            />
    
            <Form.Buttons>
                <Button variation="danger" size="medium" onClick={handleDelete}>
                    Delete
                    <span>
                        <HiTrash />
                    </span>
                </Button>
                <Button variation="secondary" size="medium" onClick={handleUpdate}>
                    Update
                    <span>
                        <HiPencil />
                    </span>
                </Button>
            </Form.Buttons>
        </Form>
    );
}