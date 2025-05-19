import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import StatisticsRow from "./StatisticsRow";

interface StatisticsTableProps {
  keyword: string;
}

interface Apartment {
  _id: string;
  address_number: number;
  area: number;
  status: string;
  type: string;
  floor: number;
  block: string;
  number_of_members: number;
  owner: string;
  owner_phone: string;
}

const StatisticsTable = ({ keyword }: StatisticsTableProps) => {
  const [statistics, setStatistics] = useState<Apartment[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [curPage, setCurPage] = useState<number>(1);

  const apiStatistics = async (page: number = 1) => {
    try {
      const url = `http://localhost:3000/api/apartment`;
      const response = await axios.get(url);
      console.log(response.data.data);
      setStatistics(response.data.data);
      setTotalPages(Math.ceil(response.data.data.length / 10));
      setTotalElements(response.data.data.length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    apiStatistics(curPage);
  }, [keyword, curPage]);

  const handlePageChange = (page: number) => {
    setCurPage(page);
  };

  // Calculate pagination
  const startIndex = (curPage - 1) * 10;
  const endIndex = startIndex + 10;
  const currentPageData = statistics.slice(startIndex, endIndex);

  return (
    <Table columns="1fr 1fr 1fr">
      <Table.Header>
        <div>Room</div>
        <div>Total Amount</div>
        <div>Actions</div>
      </Table.Header>

      {currentPageData.map((statistic) => (
        <StatisticsRow key={statistic._id} statistic={statistic} />
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
  );
};

export default StatisticsTable;
