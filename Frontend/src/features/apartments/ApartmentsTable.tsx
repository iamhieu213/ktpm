import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import ApartmentRow from "./ApartmentRow";

const PAGE_SIZE = 5;

interface Apartment {
  _id: string;
  address_number: number;
  area: number;
  status: string;
  type: string;
  floor: number;
  block: string;
  number_of_members: number;
  owner?: string;
  owner_phone?: string;
}

interface ApartmentsTableProps {
  keyword: string;
}

export default function ApartmentsTable({ keyword }: ApartmentsTableProps) {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [curPage, setCurPage] = useState<number>(1);

  const apiApartments = async (page: number = 1) => {
    try {
      let url: string;
      console.log(keyword);
      
      if (keyword) {
        url = `http://localhost:3000/api/apartment/${keyword}`;
      } else {
        url = `http://localhost:3000/api/apartment?page=${page}&size=${PAGE_SIZE}`;
      }
      const response = await axios.get(url);
      
      if (keyword) {
        setApartments([response.data.data]);
        setTotalPages(1);
        setTotalElements(1);
      } else {
        // Nếu backend trả về { data: { results: [...], totalPages, totalElements } }
        const data = response.data.data;
        setApartments(data.results || data); 
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || data.length || 0);
      }
    } catch (error) {
      console.error("Error fetching apartments:", error);
    }
  };

  useEffect(() => {
    apiApartments(curPage);
  }, [curPage, keyword]);

  const handlePageChange = (page: number) => {
    setCurPage(page);
  };

  return (
    <Table columns="1.5fr 2fr 2fr 1.5fr 1.2fr 1.2fr 1.5fr 1.5fr 2fr 1fr">
      <Table.Header>
        <div>Room</div>
        <div>Owner</div>
        <div>Area</div>
        <div>Owner Phone</div>
        <div>Status</div>
        <div>Type</div>
        <div>Floor</div>
        <div>Block</div>
        <div>Members</div>
        
        <div>Action</div>
      </Table.Header>

      {apartments.map((apartment) => (
        <ApartmentRow key={apartment._id} apartment={apartment} />
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
