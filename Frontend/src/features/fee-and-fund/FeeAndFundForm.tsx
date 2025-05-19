import { useState } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Selector from "../../components/Selector";
import Button from "../../components/Button";
import { HiOutlinePlusCircle, HiPencil, HiTrash } from "react-icons/hi2";
import axios from "axios";
import { toast } from "react-toastify";

export default function FeeAndFundForm({ feeOrFund }: any) {
  const [formValues, setFormValues] = useState({
    name: feeOrFund?.name || "",
    description: feeOrFund?.description || "",
    type: feeOrFund?.type || "",
    issue_date: feeOrFund?.issue_date ? new Date(feeOrFund.issue_date).toISOString().split('T')[0] : "",
    due_date: feeOrFund?.due_date ? new Date(feeOrFund.due_date).toISOString().split('T')[0] : "",
  });

  const typeOptions = ["Electricity", "Water", "Service", "Other"];

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
      name: formValues.name,
      type: formValues.type,
      issue_date: formValues.issue_date,
      due_date: formValues.due_date,
      description: formValues.description,
    }

    try {
      const response = await axios.put(`http://localhost:3000/api/invoice/${feeOrFund._id}`, data);
      
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
      const response = await axios.delete(`http://localhost:3000/api/invoice/${feeOrFund._id}`);

      toast.success("Delete successful!");

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      toast.error("Error occurred while deleting");
      console.log(err);
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    const data = {
      name: formValues.name,
      type: formValues.type,
      issue_date: formValues.issue_date,
      due_date: formValues.due_date,
      description: formValues.description,
    }

    try {
      await axios.post("http://localhost:3000/api/invoice", data);

      toast.success(`Add ${formValues.name} successful!`);

      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (err) {
      toast.error("Error occurred while adding");
      console.error(err);
    }
  };

  return (
    <Form width="500px">
      <Selector
        value={formValues.type}
        onChange={handleChange}
        id="type"
        options={typeOptions}
        label={"Type:"}
      />

      <FormField>
        <FormField.Label label={"Name"} />
        <FormField.Input
          id="name"
          type="text"
          value={formValues.name}
          onChange={handleChange}
        />
      </FormField>

      <FormField>
        <FormField.Label label={"Issue Date"} />
        <FormField.Input
          id="issue_date"
          type="date"
          value={formValues.issue_date}
          onChange={handleChange}
        />
      </FormField>

      <FormField>
        <FormField.Label label={"Due Date"} />
        <FormField.Input
          id="due_date"
          type="date"
          value={formValues.due_date}
          onChange={handleChange}
        />
      </FormField>

      <label>Description: </label>
      <Form.TextArea
        id="description"
        value={formValues.description}
        onChange={handleChange}
      />

      {feeOrFund ? (
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
      ) : (
        <Form.Buttons>
          <Button size="medium" variation="primary" onClick={handleSubmit}>
            Add
            <span>
              <HiOutlinePlusCircle />
            </span>
          </Button>
        </Form.Buttons>
      )}
    </Form>
  );
}
