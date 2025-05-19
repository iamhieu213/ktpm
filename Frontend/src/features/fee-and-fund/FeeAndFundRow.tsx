import Table from "../../components/Table";
import Tag from "../../components/Tag";
import Modal from "../../components/Modal";
import FeeAndFundForm from "./FeeAndFundForm";
import { formatDate } from "../../utils/helpers";

type FeeType = 'Electricity' | 'Water' | 'Service' | 'Other';

interface FeeAndFundProps {
  feeOrFund: {
    invoice_number: string;
    name: string;
    description: string;
    issue_date: string;
    due_date: string;
    status: string;
    type: FeeType;
  };
}

export default function FeeAndFundRow({ feeOrFund }: FeeAndFundProps) {
  const { invoice_number, name, description, issue_date, due_date, status, type } = feeOrFund;

  const statusStyled: Record<FeeType, string> = {
    Electricity: "pink",
    Water: "green",
    Service: "yellow",
    Other: "gray"
  };

  return (
    <Table.Row>
      <div>{invoice_number}</div>
      <div>{name}</div>
      <div>{description}</div>
      <div>{formatDate(issue_date)}</div>
      <div>{formatDate(due_date)}</div>
      <div>{status}</div>
      <Tag type={statusStyled[type]}>{type}</Tag>

      <Modal>
        <Modal.Open id="details">
          <button>Details</button>
        </Modal.Open>

        <Modal.Window id="details" name="Fee and Fund Details">
          <FeeAndFundForm feeOrFund={feeOrFund} />
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}
