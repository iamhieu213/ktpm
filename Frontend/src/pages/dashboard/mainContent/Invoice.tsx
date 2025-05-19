import Row from "../../../components/Row";
import Heading from "../../../components/Heading";
import Modal from "../../../components/Modal";
import Search from "../../../components/Search";
import InvoiceTable from "../../../features/invoices/InvoiceTable";
import { useState, useEffect } from "react";
import axios from "axios";
import UtilityBill from "../../../components/UtilityBill";
import { toast } from "react-toastify";

export default function Invoice() {

  const [keyword, setKeyword] = useState('')

  return (
    <Modal>
      <Row type="horizontal">
        <Heading as="h1">Invoices</Heading>
        <Search setKeyword={setKeyword} keyword={keyword}></Search>
      </Row>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <Modal.Open id="createInvoice">
          <button
            className="btTdn"
            style={{
              backgroundColor: "#667BC6",
              color: "white",
              fontWeight: "400",
              padding: "9px 8px",
              border: "none",
              borderRadius: "16px",
              fontSize: "16px",
              cursor: "pointer",
              width: "155px",
            }}
          >
            Create Invoice +
          </button>
        </Modal.Open>

        <Modal.Open id="addUtility">
          <button
            className="btTdn"
            style={{
              backgroundColor: "#708871",
              color: "white",
              fontWeight: "400",
              padding: "7px 8px",
              border: "none",
              borderRadius: "16px",
              fontSize: "16px",
              cursor: "pointer",
              width: "145px",
            }}
          >
            Add Utility Bill +
          </button>
        </Modal.Open>
      </div>

      <InvoiceTable keyword={keyword}/>

      <Modal.Window id="createInvoice" name="Create Invoice">
        <InvoiceTDN />
      </Modal.Window>

      <Modal.Window id="addUtility" name="Add Utility Bill">
        <UtilityBill />
      </Modal.Window>
    </Modal>
  );
}


function InvoiceTDN() {
  const [formValues, setFormValues] = useState({
    apartmentType: "",
    feeType: "",
    amount: "",
  });

  const [selectedFee, setSelectedFee] = useState<string>("");
  const [feeOptions, setFeeOptions] = useState<any[]>([]);
  const [apartmentOptions, setApartmentOption] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseFee = await axios.get("http://localhost:3000/api/invoice");
        const dataFee = responseFee.data.data.result;

        const responseApartment = await axios.get("http://localhost:3000/api/apartment");
        const dataApartment = responseApartment.data.data;

        setFeeOptions(dataFee);
        setApartmentOption(dataApartment);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));

    if (id === "feeType") {
      const selectedFee = feeOptions.find((fee) => fee.name === value);
      if (selectedFee) {
        setSelectedFee(value);
      }
    }
  };

  const saveForm = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      apartment_id: formValues.apartmentType,
      invoice_id: formValues.feeType,
      amount_paid: parseFloat(formValues.amount) || 0,
    };

    try {
      await axios.post("http://localhost:3000/api/invoice/apartment", payload);
      toast.success("Create Invoice Successful");
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Có lỗi xảy ra");
    }

    // Reset form
    setFormValues({
      apartmentType: "",
      feeType: "",
      amount: "",
    });
    setSelectedFee("");
  };

  return (
    <div style={invoiceStyles.container}>
      <form style={invoiceStyles.form}>
        <div style={invoiceStyles.leftColumn}>
          <div style={invoiceStyles.row}>
            <label className="font-bold">Apartment: </label>
            <select
              style={invoiceStyles.input}
              id="apartmentType"
              value={formValues.apartmentType}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {apartmentOptions.map((apartment, index) => (
                <option key={index} value={apartment._id}>
                  {apartment.address_number}
                </option>
              ))}
            </select>
          </div>

          <div style={invoiceStyles.row}>
            <label className="font-bold">Fee: </label>
            <select
              style={invoiceStyles.input}
              id="feeType"
              value={formValues.feeType}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {feeOptions.map((fee, index) => (
                <option key={index} value={fee._id}>
                  {fee.name}
                </option>
              ))}
            </select>
          </div>

          <div style={invoiceStyles.row}>
            <label className="font-bold">Amount: </label>
            <input
              type="number"
              id="amount"
              style={invoiceStyles.input}
              value={formValues.amount}
              onChange={handleChange}
              placeholder="Enter amount"
            />
          </div>

          <div style={invoiceStyles.row}>
            <p><strong>Selected Fee:</strong> {selectedFee}</p>
          </div>
        </div>
      </form>

      <button style={invoiceStyles.saveButton} onClick={saveForm}>
        Save
      </button>
    </div>
  );
}



const invoiceStyles = {
  container: {
    position: "relative",
    top: "8px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  btTdn: {
    display: "inline-flex",
  },
  form: {
    width: "800px",
    display: "flex",
    gap: "20px",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: 1,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  addButton: {
    backgroundColor: "#18BB4C",
    color: "white",
    padding: "8px 8px",
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
  },
  saveButton: {
    position: "relative",
    top: "15px",
    background: "#4caf50",
    color: "white",
    padding: "8px 28px",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    cursor: "pointer",
    alignSelf: "center",
  },
};