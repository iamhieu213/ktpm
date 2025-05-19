import Tag from "../../components/Tag";
import { capitalize } from "../../utils/helpers";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import ApartmentForm from "./ApartmentForm";

interface ApartmentProps {
  apartment: {
    _id: string;
    address_number: number;
    area: number;
    status: "Business" | "Residential" | "Vacant" | string;
    type: string;
    floor: number;
    block: string;
    number_of_members: number;
    owner?: string;
    owner_phone?: string;
  };
}

export default function ApartmentRow({ apartment }: ApartmentProps) {
  const {
    address_number,
    area,
    status,
    type,
    floor,
    block,
    number_of_members,
    owner,
    owner_phone,
  } = apartment;

  const statusStyled = {
    Vacant: "red",
    Business: "blue",
    Residential: "yellow",
  };

  return (
    <Table.Row>
      <div>{address_number}</div>
      <div>{owner || "N/A"}</div>
      <div>{area}</div>
      <div>{owner_phone || "N/A"}</div>
      <div>
        <Tag type={statusStyled[status] || "gray"}>
          {capitalize(status)}
        </Tag>
      </div>
      <div>{type}</div>
      <div>{floor}</div>
      <div>{block}</div>
      <div>{number_of_members}</div>
      
      
      <Modal>
        <Modal.Open id="details">
          <button>Details</button>
        </Modal.Open>

        <Modal.Window id="details" name="Apartment Details">
          <ApartmentForm apartment={apartment} fetchApartments={() => {}} />
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}
