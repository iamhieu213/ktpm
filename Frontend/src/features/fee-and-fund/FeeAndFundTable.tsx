import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import FeeAndFundRow from "./FeeAndFundRow";
import { useEffect, useState } from "react";
import axios from "axios";
import FeeAndFundForm from "./FeeAndFundForm";

interface FeeAndFundTableProps {
  keyword: string;
}

export default function FeeAndFundTable({ keyword }: FeeAndFundTableProps) {
  const [feesAndFunds, setFeesAndFunds] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [curPage, setCurPage] = useState<number>(1);
  const [isFormVisible, setIsFormVisible] = useState(false); // State điều khiển việc hiển thị form
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const types = [
    { value: "Electricity", label: "Điện" },
    { value: "Water", label: "Nước" },
    { value: "Service", label: "Dịch vụ" },
    { value: "Other", label: "Khác" }
  ];

  const apiFeesAndFunds = async (page: number = 1) => {
    try {
      const params = {
        page,
        pageSize: 10,
        type: selectedType || undefined
      };

      const response = await axios.get('http://localhost:3000/api/invoice', { params });

      if (keyword) {
        setFeesAndFunds([response.data.data]);
        setTotalPages(1);
        setTotalElements(1);
      } else {
        setFeesAndFunds(response.data.data.result);
        setTotalPages(response.data.data.totalPages);
        setTotalElements(response.data.data.totalElements);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    apiFeesAndFunds(curPage);
  }, [curPage, selectedType]);

  const handlePageChange = (page: number) => {
    setCurPage(page);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
    setCurPage(1);
  };

  return (
    <div>
      <div className="filter-section">
        <select 
          value={selectedType || ''} 
          onChange={handleTypeChange}
          className="type-filter"
        >
          <option value="">Tất cả loại</option>
          {types.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <Table columns="0.5fr 1fr 2fr 1fr  1fr 1fr 1fr 1fr">
        <Table.Header>
          <div>ID</div>
          <div>Name</div>
          <div>Description</div>
          <div>Issue Date</div>
          <div>Due Date</div>
          <div>Status</div>
          <div>Type</div>
          <div>Actions</div>
        </Table.Header>

        {feesAndFunds.map((feeOrFund: any) => (
          <FeeAndFundRow key={feeOrFund._id} feeOrFund={feeOrFund} />
        ))}
        <Table.Footer>
          <Pagination
            totalPages={totalPages}
            curPage={curPage}
            totalElements={totalElements}
            onPageChange={handlePageChange}
          />
        </Table.Footer>
      </Table>
    </div>
  );
}
