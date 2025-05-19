import Table from "../../components/Table";
import ResidentRow from "./ResidentRow";
import Pagination from "../../components/Pagination";
import { useEffect, useState } from "react";

interface ResidentsTableProps {
  keyword: string;
}

export default function ResidentsTable({ keyword }: ResidentsTableProps) {
  const [residents, setResidents] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [curPage, setCurPage] = useState<number>(1);

  const apiResidents = async (page: number = 1) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/residents?size=10&page=${page}&filter=name~'${keyword}'`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.data);
      
      setResidents(data.data);
      setTotalPages(data.data.totalPages);
      setTotalElements(data.data.totalElements);
    } catch (error) {
      console.error("Failed to fetch residents:", error);
    }
  };

  useEffect(() => {
    apiResidents(curPage);
  }, [keyword, curPage]);

  const handlePageChange = (page: number) => {
    setCurPage(page);
  };

  return (
    <Table columns="0.5fr 1fr 1.5fr 1.5fr 1.5fr 1fr 1fr 1fr 1fr">
      <Table.Header>
        <div>STT</div>
        <div>Room</div>
        <div>Name</div>
        <div>CCCD</div>
        <div>Phone</div>
        <div>Gender</div>
        <div>DOB</div>
        <div>Status</div>
        <div>Actions</div>
      </Table.Header>

      {residents.map((resident, index) => (
        <ResidentRow key={resident._id} resident={resident} index={index} />
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
}
