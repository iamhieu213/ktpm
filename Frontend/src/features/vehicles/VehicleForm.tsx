import { useState } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Selector from "../../components/Selector";
import Button from "../../components/Button";
import { HiOutlinePlusCircle, HiPencil, HiTrash } from "react-icons/hi2";
import axios from "axios";
import { toast } from "react-toastify";

export default function VehicleForm({ vehicle }: any) {
  const [formValues, setFormValues] = useState({
    apartmentId: vehicle?.apartmentId || "",
    registerDate: vehicle?.registerDate || "",
    id: vehicle?.id || "",
    category: vehicle?.category || "",
  });
  const vehicleTypeOptions = ["Motorbike", "Car"];

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();

    try {
      console.log(formValues.apartmentId);
      const response = await axios.delete(`http://localhost:3000/api/vehicles/${vehicle._id}`);
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      toast.success("Delete vehicle successfull!");
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const vehicleData = {
      category: formValues.category,
      address_number: formValues.apartmentId,
      vehicle_number: formValues.id,
    };

    console.log(vehicleData);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/vehicles/createVehicle", vehicleData
      );
      toast.success("Add vehicle successfull");
      setFormValues({
        apartmentId:  "",
        registerDate:  "",
        id:  "",
        category:  "",
       });
       setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Có lỗi xảy ra");
      console.log(error);
    }
  };

  return (
    <Form width="400px" onSubmit={handleSubmit}>
      <Form.Fields>
        <FormField>
          <FormField.Label label={"Room"} />
          <FormField.Input
            id="apartmentId"
            type="text"
            value={formValues.apartmentId}
            onChange={handleChange}
          />
        </FormField>

        {/* <FormField>
          <FormField.Label label={"Date"} />
          <FormField.Input
            id="ownerName"
            type="text"
            value={formValues.registerDate}
            onChange={handleChange}
          />
        </FormField> */}

        <FormField>
          <FormField.Label label={"Number"} />
          <FormField.Input
            id="id"
            type="text"
            value={formValues.id}
            onChange={handleChange}
          />
        </FormField>
      </Form.Fields>

      <Selector
        value={formValues.category}
        onChange={handleChange}
        id="category"
        options={vehicleTypeOptions}
        label={"Type:"}
      ></Selector>

      {vehicle ? (
        <Form.Buttons>
          <Button variation="danger" size="medium" onClick={handleDelete}>
            Delete
            <span>
              <HiTrash />
            </span>
          </Button>
          {/* <Button variation="secondary" size="medium">
            Update
            <span>
              <HiPencil />
            </span>
          </Button> */}
        </Form.Buttons>
      ) : (
        <Form.Buttons>
        <Button type="submit" size="medium" variation="primary">
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
