import { useState, useEffect } from "react";
import axios from "axios";
import Table from "../../components/Table";
import Modal from "../../components/Modal";

interface StatisticsProps {
  statistic: {
    _id: string;
    address_number: number;
  };
}

interface Payment {
  invoice_id: string;
  invoice_number : string;
  payment_date: string;
  payment_method: string;
  amount: number;
  note: string;
}

export default function StatisticsRow({ statistic }: StatisticsProps) {
  const { address_number, _id } = statistic;
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/invoice/${_id}/payments`);
      
      if (response.data.data && response.data.data.payments) {
        setPayments(response.data.data.payments);
        setTotalAmount(response.data.data.total_amount || 0);
      } else {
        setPayments([]);
        setTotalAmount(0);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments([]);
      setTotalAmount(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch payments when component mounts
  useEffect(() => {
    fetchPayments();
  }, [_id]);

  return (
    <Table.Row>
      <div>{address_number}</div>
      <div>{totalAmount.toLocaleString('vi-VN')} VND</div>
      <Modal>
        <Modal.Open id="details">
          <button>Payment History</button>
        </Modal.Open>

        <Modal.Window id="details" name="Payment History" style={{ width: '800px', maxHeight: '80vh', overflowY: 'auto' }}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>
              <Table columns="1.5fr 2fr 1.5fr 2fr 3fr">
                <Table.Header>
                  <div>Date</div>
                  <div>Invoice ID</div>
                  <div>Amount</div>
                  <div>Payment Method</div>
                  <div>Note</div>
                </Table.Header>
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <Table.Row key={payment.invoice_id}>
                      <div>{new Date(payment.payment_date).toLocaleDateString()}</div>
                      <div>{payment.invoice_number}</div>
                      <div>{payment.amount.toLocaleString('vi-VN')} VND</div>
                      <div>{payment.payment_method}</div>
                      <div>{payment.note || '-'}</div>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No payment history found</div>
                  </Table.Row>
                )}
              </Table>
            </div>
          )}
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}
