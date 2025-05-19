import { useEffect, useState } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Selector from "../../components/Selector";
import Button from "../../components/Button";
import { HiOutlinePlusCircle, HiPencil } from "react-icons/hi2";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import ResidentAddModal from "./ResidentAddModal";
import axios from "axios";
import { toast } from "react-toastify";

interface Resident {
  id: number;
  name: string;
  dob: string;
}

interface Vehicle {
  id: number;
  category: string;
}

interface ApartmentFormProps {
  apartment?: {
    _id: string;
    address_number: number | string;
    status: "Business" | "Residential" | "Vacant" | "";
    area: number | string;
    type?: string;
    floor?: number;
    block?: string;
    number_of_members?: number;
    owner?: string;
    owner_phone?: string;
    residentList?: Resident[];
    vehicleList?: Vehicle[];
  };
  fetchApartments: () => void;
}

export default function ApartmentForm({
  apartment,
  fetchApartments,
}: ApartmentFormProps) {
  const [formValues, setFormValues] = useState({
    addressNumber: apartment?.address_number?.toString() || "",
    status: apartment?.status || "",
    area: apartment?.area?.toString() || "",
    type: apartment?.type || "",
    floor: apartment?.floor?.toString() || "",
    block: apartment?.block || "",
    number_of_members: apartment?.number_of_members?.toString() || "",
    ownerName: apartment?.owner || "",
    ownerPhone: apartment?.owner_phone || "",
    memberIds: apartment?.residentList?.map((r) => r.id) || [],
  });

  useEffect(() => {
  const fetchResidents = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/apartment/getAllResidentByAddressNumber/${apartment?.address_number}`
      );
      const data = res.data.data || []; // dữ liệu cư dân
      setSelectedResidents(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (apartment?.address_number) {
    fetchResidents();
  }
}, [apartment?.address_number]);


  const [selectedResidents, setSelectedResidents] = useState<Resident[]>(
    apartment?.residentList || []
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleResidentsSelect = (newResidents: Resident[]) => {
    
    const updated = [
      ...selectedResidents,
      ...newResidents.filter(
        (nr) => !selectedResidents.some((sr) => sr.id === nr.id)
      ),
    ];
    setSelectedResidents(updated);
    setFormValues((prev) => ({
      ...prev,
      memberIds: updated.map((r) => r.id),
    }));
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    console.log("check form", formValues.memberIds);
    
    try {
      const data = {
        area: Number(formValues.area),
        status: formValues.status,
        type: formValues.type,
        floor: Number(formValues.floor),
        block: formValues.block,
        number_of_members: Number(formValues.number_of_members),
        owner: formValues.ownerName,
        owner_phone: formValues.ownerPhone,
        residents: formValues.memberIds,
      };

      await axios.put(
        `http://localhost:3000/api/apartment/${apartment?._id}`,
        data
      );

      toast.success("Update Successful");
       setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const data = {
      address_number: Number(formValues.addressNumber),
      area: Number(formValues.area),
      status: formValues.status,
      type: formValues.type,
      floor: Number(formValues.floor),
      block: formValues.block,
      number_of_members: Number(formValues.number_of_members),
      owner: formValues.ownerName,
      owner_phone: formValues.ownerPhone,
      residents: formValues.memberIds,
    };

    try {
      await axios.post("http://localhost:3000/api/apartment/create-apartment", data);
      toast.success("Add Apartment Successful");
      setTimeout(() => window.location.reload(), 1500);
      fetchApartments();
      setFormValues({
        addressNumber: "",
        status: "",
        area: "",
        type: "",
        floor: "",
        block: "",
        number_of_members: "",
        ownerName: "",
        ownerPhone: "",
        memberIds: [],
      });
      setSelectedResidents([]);
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra");
    }
  };

  console.log("logg", selectedResidents);
  

  const statusOptions = ["Business", "Residential", "Vacant"];

  return (
    <Form width="800px">
      <label>Room:</label>
      <Form.Fields type="horizontal">
        <FormField>
          <FormField.Label label="Room" />
          <FormField.Input
            id="addressNumber"
            type="text"
            value={formValues.addressNumber}
            onChange={handleChange}
          />
        </FormField>

        <FormField>
          <FormField.Label label="Area" />
          <FormField.Input
            id="area"
            type="text"
            value={formValues.area}
            onChange={handleChange}
          />
        </FormField>
      </Form.Fields>

      <Form.Fields type="horizontal">
        <FormField>
          <FormField.Label label="Type" />
          <FormField.Input
            id="type"
            type="text"
            value={formValues.type}
            onChange={handleChange}
          />
        </FormField>

        <FormField>
          <FormField.Label label="Floor" />
          <FormField.Input
            id="floor"
            type="text"
            value={formValues.floor}
            onChange={handleChange}
          />
        </FormField>
      </Form.Fields>

      <Form.Fields type="horizontal">
        <FormField>
          <FormField.Label label="Block" />
          <FormField.Input
            id="block"
            type="text"
            value={formValues.block}
            onChange={handleChange}
          />
        </FormField>

        <FormField>
          <FormField.Label label="Members" />
          <FormField.Input
            id="number_of_members"
            type="text"
            value={formValues.number_of_members}
            onChange={handleChange}
          />
        </FormField>
      </Form.Fields>

      <Selector
        id="status"
        value={formValues.status}
        onChange={handleChange}
        options={statusOptions}
        label="Status"
      />

      <label>Owner:</label>
      <Form.Fields type="horizontal">
        <FormField>
          <FormField.Label label="Owner Name" />
          <FormField.Input
            id="ownerName"
            type="text"
            value={formValues.ownerName}
            onChange={handleChange}
          />
        </FormField>
        <FormField>
          <FormField.Label label="Phone" />
          <FormField.Input
            id="ownerPhone"
            type="text"
            value={formValues.ownerPhone}
            onChange={handleChange}
          />
        </FormField>
      </Form.Fields>

      <label>Resident:</label>
      <Table columns="1fr 1fr 1fr">
        <Table.Header size="small">
          <div>Name</div>
          <div>DOB</div>
          <div>Status</div>
        </Table.Header>
        {selectedResidents.map((resident) => (
          <Table.Row size="small" key={resident.id}>
            <div>{resident.name}</div>
            <div>{new Date(resident.dob).toLocaleDateString()}</div>
            <div>{resident.status}</div>
          </Table.Row>
        ))}
      </Table>

      <Modal>
        <Modal.Open id="openAddResident">
          <i className="bx bx-plus-circle"></i>
        </Modal.Open>

        <Modal.Window id="openAddResident" name="Add Residents">
          <ResidentAddModal onResidentsSelect={handleResidentsSelect} />
        </Modal.Window>
      </Modal>

      {apartment?.vehicleList && (
        <>
          <label>Vehicle:</label>
          <Table columns="1fr 1fr">
            <Table.Header size="small">
              <div>Number</div>
              <div>Type</div>
            </Table.Header>
            {apartment.vehicleList.map((vehicle) => (
              <Table.Row size="small" key={vehicle.id}>
                <div>{vehicle.id}</div>
                <div>{vehicle.category}</div>
              </Table.Row>
            ))}
          </Table>
        </>
      )}

      {apartment ? (
        <Form.Buttons>
          <Button
            onClick={handleUpdate}
            type="button"
            variation="secondary"
            size="medium"
          >
            Update
            <span>
              <HiPencil />
            </span>
          </Button>
        </Form.Buttons>
      ) : (
        <Form.Buttons>
          <Button
            type="button"
            onClick={handleSubmit}
            size="medium"
            variation="primary"
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
