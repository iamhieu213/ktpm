import { useState } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import Selector from "../../components/Selector";
import { HiOutlinePlusCircle, HiPencil, HiTrash } from "react-icons/hi2";
import axios from "axios";
import { toast } from "react-toastify";

export default function ResidentForm({ resident, onCloseModal }: any) {
  const [formValues, setFormValues] = useState({
    
    id_card_number: resident?.id_card_number || "",
    name: resident?.name || "",
    dob: resident?.dob || "",
    phone : resident?.phone || "",
    address_number: resident?.address_number || "",
    status: resident?.status || "Family Member",
    cic: resident?.cic || "",
    gender: resident?.gender || "",
  });

  const statusOptions = ["Owner",  "Family Member", "Guest"];
  const genderOptions = ["Male", "Female"];

  const   handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleAddResident = async (e: any) => {
  e.preventDefault();

  const data = {
     
    id_card_number: formValues.id_card_number,
    name: formValues.name,
    dob: formValues.dob,
    phone : formValues.phone,
    address_number: Number(formValues.address_number),
    status: formValues.status,
    gender: formValues.gender === "Male" ? 1 : 0,
  };

  console.log(data);

  try {
    const response = await axios.post(
      "http://localhost:3000/api/residents/create-residents",
      data
    );

    toast.success(`Add Resident Successfull!`);

    setTimeout(() => {
      window.location.reload();
    }, 1000);

  } catch (err: any) {
    console.log("API error response:", err.response);

    // Lấy message lỗi backend trả về
    const backendMessage = err.response?.data?.message || "Có lỗi xảy ra!";

    // Hiển thị đúng format: "Error: <message>"
    toast.error(`Error: ${backendMessage}`);

    console.error("API error:", backendMessage);
  }
};
  const handleDelete = async () => {
    try {
      console.log(formValues.id_card_number);
      const response = await axios.delete(`http://localhost:3000/api/residents/${formValues.id_card_number}`)
      // console.log(response.data);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      toast.success("Delete successful");
    } catch (err) {
      toast.error("Có lỗi xảy ra!!")
      console.error(err);
    }
  }

  const handleUpdate = async () => {
  if (!formValues.id_card_number) {
    toast.error("Không tìm thấy ID resident để cập nhật!");
    return;
  }

  const data = {
    id_card_number: formValues.id_card_number,
    name: formValues.name,
    dob: formValues.dob,
    phone: formValues.phone,
    address_number: Number(formValues.address_number),
    status: formValues.status,
    gender: formValues.gender === "Male" ? 1 : 0,
  };

  try {
    const response = await axios.put(
      `http://localhost:3000/api/residents/${formValues.id_card_number}`,
      data  
    );
    toast.success("Resident updated successfully!");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (err) {
    console.error("Có lỗi xảy ra!!");
    const message = err.response?.data?.message || "Cập nhật thất bại!";
    toast.error(`Error: ${message}`);
  }
};


  return (
    <Form width="400px">
      <div>
        <label>Information:</label>
        <Form.Fields>
          <FormField>
            <FormField.Label label={"Name"} />
            <FormField.Input
              id="name"
              type="name"
              value={formValues.name}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <FormField.Label label={"DOB"} />
            <FormField.Input
              id="dob"
              type="date"
              value={formValues.dob}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <FormField.Label label={"CCCD"} />
            <FormField.Input
              id="id_card_number"
              type="text"
              value={formValues.id_card_number}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <FormField.Label label={"Phone"} />
            <FormField.Input
              id="phone"
              type="text"
              value={formValues.phone}
              onChange={handleChange}
            />
          </FormField>
          <Selector
            value={formValues.gender}
            onChange={handleChange}
            id="gender"
            options={genderOptions}
            label={"Gender:"}
          ></Selector>
        </Form.Fields>
      </div>
      <div>
        <label>Room:</label>
        <Form.Fields>
          <FormField>
            <FormField.Label label={"Room"} />
            <FormField.Input
              id="address_number"
              type="search"
              value={formValues.address_number}
              onChange={handleChange}
            />
          </FormField>
          
          <FormField>
            <FormField.Label label={"Status"} />
            <FormField.Select
              id="status"
              options={statusOptions}
              value={formValues.status}
              onChange={handleChange}
            />
          </FormField>
        </Form.Fields>
      </div>

      {resident ? (
        <Form.Buttons>
          <Button type="button" onClick={handleDelete} variation="danger" size="medium">
            Delete
            <span>
              <HiTrash />
            </span>
          </Button>
          <Button type="button" variation="secondary" onClick={handleUpdate} size="medium">
            Update
            <span>
              <HiPencil />
            </span>
          </Button>
        </Form.Buttons>
      ) : (
        <Form.Buttons>
          <Button
            onClick={handleAddResident}
            size="medium"
            variation="primary"
            type="submit"
          >
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

