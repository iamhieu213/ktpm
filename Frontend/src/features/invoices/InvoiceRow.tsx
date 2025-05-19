import Modal from "../../components/Modal";
import Table from "../../components/Table";
import "./invoice.css";
import { useState , useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import InvoiceForm from "../../components/InvoiceForm";

export default function InvoiceRow({ invoice }: any) {
  const {
    invoice_apartment_id,
    amount,
    issue_date,
    due_date,
    description,
    invoice_number,
    name,
    payment_status,
    apartment_info,
  } = invoice;

  const [isPaying, setIsPaying] = useState(false);

  function formatDate(dateString: any) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const isPaid = payment_status === "Paid";

  return (
    <Table.Row>
      <div>{invoice_number}</div>
      <div>{name}</div>
      <div>{description}</div>
      <div>{amount.toLocaleString() } đ</div>
      <div>{formatDate(issue_date)}</div>
      <div>{formatDate(due_date)}</div>
      <div>{apartment_info.address_number}</div>
      <div>
      <Modal.Open id={`payment-${invoice_apartment_id}`}>
          <button
             className={`btn-pay ${isPaying ? "loading" : ""}`}
             disabled={isPaid || isPaying}
          >
            {isPaid ? "Paid" : isPaying ? "Loading..." : "Pay"}
          </button>
        </Modal.Open>
      </div>
      <div className="action-cell">
        <Modal>
          <Modal.Open id={`update-${invoice_apartment_id}`}>
            <button className="btn-details">
              Details
            </button>
          </Modal.Open>

          <Modal.Window id={`update-${invoice_apartment_id}`} name="Cập nhật">
            <InvoiceForm 
              invoice_id={invoice_apartment_id}
              apartment_address={`${apartment_info.address_number}`}
              invoice_number={invoice_number}
              amount={amount}
              notes={description}
            />
          </Modal.Window>
        </Modal>
      </div>
      <Modal.Window id={`payment-${invoice_apartment_id}`} name="Thanh toán">
        <PaymentForm invoiceId={invoice_apartment_id} />
      </Modal.Window>
    </Table.Row>
  );
}

interface PaymentFormProps {
  invoiceId: string; 
  onPaymentSuccess?: () => void; 
}

function PaymentForm( {invoiceId } : PaymentFormProps) {
  const [formValues, setFormValues] = useState({
    amount: "",
    payment_method: "",
    notes: ""
  });
  
  const [hoveredButton, setHoveredButton] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSubmit = async () => {
    const dataPayment = {
        amount: formValues.amount || "", 
        payment_method: formValues.payment_method || "",
        notes: formValues.notes || ""
    }

    try {
        const response = await axios.post(
            `http://localhost:3000/api/invoice/payment/${invoiceId}`, 
            dataPayment
        );

        if (response.data.message === "Ghi nhận thanh toán thành công") {
            toast.success("Thanh toán thành công!");
            
            // Reset form
            setFormValues({
                amount: "",
                payment_method: "",
                notes: ""
            });

            // Close modal and reload after a slightly longer delay
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    } catch (error) {
        console.error("Lỗi khi thanh toán:", error);
        toast.error("Có lỗi xảy ra khi thanh toán");
    }
  };
  
  const handleFocus = (id: string) => {
    setFocusedInput(id);
  };
  
  const handleBlur = () => {
    setFocusedInput(null);
  };
  
  return (
    <div style={styles.container}>
      <div>
        <div style={styles.formGroup}>
          <label htmlFor="amount" style={styles.label}>
            Amount (VND)
          </label>
          <input
            id="amount"
            type="String"
            value={formValues.amount}
            onChange={handleChange}
            placeholder="Nhập số tiền"
            style={{
              ...styles.input,
              ...(focusedInput === "amount" ? styles.inputFocus : {})
            }}
            onFocus={() => handleFocus("amount")}
            onBlur={handleBlur}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="payment_method" style={styles.label}>
            Payment Method
          </label>
          <select
            id="payment_method"
            value={formValues.payment_method}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(focusedInput === "payment_method" ? styles.inputFocus : {})
            }}
            onFocus={() => handleFocus("payment_method")}
            onBlur={handleBlur}
          >
            <option value="">Select payment method</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfers</option>
            <option value="Credit Card">Credut Card</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="notes" style={styles.label}>
            Notes
          </label>
          <textarea
            id="notes"
            value={formValues.notes}
            onChange={handleChange}
            placeholder="Add notes (optional)"
            style={{
              ...styles.textarea,
              ...(focusedInput === "notes" ? styles.inputFocus : {})
            }}
            onFocus={() => handleFocus("notes")}
            onBlur={handleBlur}
          />
        </div>
      </div>
      
      <button 
        onClick={handleSubmit}
        style={{
          ...styles.button,
          ...(hoveredButton ? styles.buttonHover : {})
        }}
        onMouseEnter={() => setHoveredButton(true)}
        onMouseLeave={() => setHoveredButton(false)}
      >
        Xác nhận thanh toán
      </button>
      
      {formValues.amount && formValues.payment_method && (
        <div style={styles.preview}>
          <h3 style={styles.previewTitle}>Thông tin thanh toán:</h3>
          <p style={styles.previewText}>
            Số tiền: <span style={styles.previewValue}>{formValues.amount} VND</span>
          </p>
          <p style={styles.previewText}>
            Phương thức: <span style={styles.previewValue}>{formValues.payment_method}</span>
          </p>
          {formValues.notes && (
            <p style={styles.previewText}>
              Ghi chú: {formValues.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#fff",
    maxWidth: "1000px",
    minWidth: "500px",
    width: "600px",
    margin: "0 auto",
  },
  formGroup: {
    marginBottom: "16px"
  },
  label: {
    display: "block",
    fontSize: "16px",
    fontWeight: "500",
    color: "#444",
    marginBottom: "4px"
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box" as const
  },
  inputFocus: {
    outline: "none",
    borderColor: "#1D4ED8",
    boxShadow: "0 0 0 2px rgba(29, 78, 216, 0.2)"
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    minHeight: "96px",
    resize: "vertical" as const,
    boxSizing: "border-box" as const
  },
  button: {
    width: "100%",
    padding: "10px 16px",
    backgroundColor: "#1D4ED8",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "15px",
    fontWeight: "500", 
    cursor: "pointer",
    marginTop: "24px"
  },
  buttonHover: {
    backgroundColor: "#1e40af"
  },
  preview: {
    marginTop: "24px",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "4px",
    border: "1px solid #eee"
  },
  previewTitle: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#444",
    marginBottom: "8px"
  },
  previewText: {
    fontSize: "14px",
    color: "#555",
    margin: "4px 0"
  },
  previewValue: {
    fontWeight: "500"
  }
};