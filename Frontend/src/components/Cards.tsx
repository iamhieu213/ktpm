import styled from "styled-components";
import Card from "./Card";
import { MdFamilyRestroom } from "react-icons/md";
import { PiBuildingApartmentLight } from "react-icons/pi";
import { GiPayMoney } from "react-icons/gi";
import { FaCar } from "react-icons/fa";

import axios from "axios";
import { useEffect, useState } from "react";

const CardsStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 30px;
`;

export default function Cards() {
  const [numOfApartments, setNumOfApartments] = useState<number>(0);
  const [numOfResidents, setNumOfResidents] = useState<number>(0);
  const [numOfVehicles, setNumOfVehicles] = useState<number>(0);
  const [totalAmountLast30Days, setTotalAmountLast30Days] = useState<number>(0);

  // Fetch total apartments when the component mounts
  useEffect(() => {
    const totalApartments = async () => {
      try {
       
        const response = await axios.get(
          "http://localhost:3000/api/apartment?size=999"
        );
        setNumOfApartments(response.data.data.length);
      } catch (error) {
        console.error("Error fetching apartments:", error);
      }
    };

    const totalResidents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/residents?size=999"
        );
        setNumOfResidents(response.data.data.length);
      } catch (error) {
        console.error("Error fetching residents:", error);
      }
    };

    const totalVehicles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/vehicles"
        );
        setNumOfVehicles(response.data.data.length);
      } catch (error) {
        console.error("Error fetching residents:", error);
      }
    };

    const fetchTotalAmountLast30Days = async () => {
      try {
        const endDate = new Date(); // Hôm nay
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30); // Trừ 30 ngày
  
        const response = await axios.get(`http://localhost:3000/api/invoice/statistics/payment` ,{  
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }});
  
        const totalAmount = response.data.data.total_revenue; // Giả sử API trả về đúng như ví dụ trước
        setTotalAmountLast30Days(totalAmount);
      } catch (error) {
        console.error("Lỗi khi lấy tổng tiền thanh toán 30 ngày qua:", error);
      }
    };
  
    totalApartments();
    totalResidents();
    totalVehicles();
    fetchTotalAmountLast30Days();
  }, []);

  return (
    <CardsStyled>
      <Card
        icon={<PiBuildingApartmentLight size={40} />}
        title="Total Apartments"
        value={numOfApartments}
        color="cyan"
        iconDetails="Apartments"
      />

      <Card
        icon={<MdFamilyRestroom size={40} />}
        title="Total Residents"
        value={numOfResidents}
        color="emerald"
        iconDetails="Residents"
      />

      <Card
        icon={<FaCar size={40} />}
        title="Total Vehicles"
        value={numOfVehicles} // Hiển thị giá trị đã chia cho 1 triệu
        color="pink"
        iconDetails="Vehicles"
      />

      <Card
        icon={<GiPayMoney size={40} />}
        title="Last 30 days"
        value={`₫${(totalAmountLast30Days / 1000000).toFixed(2)}M`} // Hiển thị giá trị đã chia cho 1 triệu
        color="purple"
        iconDetails="Open Invoices"
      />
    </CardsStyled>
  );
}
