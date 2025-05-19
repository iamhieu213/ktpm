import { useEffect, useState } from "react";
import Table from "../../components/Table";
import axios from "axios";
import InvoiceRow from "./InvoiceRow";
import Pagination from "../../components/Pagination";
import { FiFilter } from "react-icons/fi";

interface InvoicesTableProps {
  keyword: string;
}

interface Invoice {
  _id: string;
  invoice_number: string;
  name: string;
  description: string;
  amount: number;
  issue_date: string;
  due_date: string;
  type: string;
  status: string;
  invoice_apartment_id: string,
  payment_status?: string;
  apartment_info?: {
    name: string;
    number: string;
  };
}

const InvoiceTable = ({ keyword }: InvoicesTableProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [curPage, setCurPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filterType, setFilterType] = useState<string>("");
  const [sortField, setSortField] = useState<string>("issue_date");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  // GET: All Invoices
  const fetchInvoices = async (page: number = 1) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/invoice/apartment`,
        {
          params: {
            page: page,
            pageSize: pageSize,
            keyword: keyword,
            type: filterType,
            sort: sortField,
            order: sortOrder,
          },
        }
      );
      
      setInvoices(response.data.data.result);
      setTotalPages(response.data.data.totalPages);
      setTotalElements(response.data.data.totalElements);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  useEffect(() => {
    fetchInvoices(curPage);
  }, [keyword, curPage, pageSize, filterType, sortField, sortOrder]);

  const handlePageChange = (page: number) => {
    setCurPage(page);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
    setCurPage(1); 
  };

  const handleSortChange = (field: string) => {
    if (sortField === field) {
      // Nếu đang sort theo field này rồi thì đảo chiều sort
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="invoice-table-container">
      <div className="filters-container">
        <div className="filter">
          <label htmlFor="type-filter">
            <FiFilter /> Invoice Type:
          </label>
          <select
            id="type-filter"
            value={filterType}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="Electricity">Electricity</option>
            <option value="Water">Water</option>
            <option value="Service">Service</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <Table columns="0.5fr 1fr 0.8fr 0.8fr 0.8fr 0.6fr 0.6fr 0.6fr 0.4fr">
        <Table.Header>
          <div className="sortable" onClick={() => handleSortChange("invoice_number")}>
            Invoice ID {sortField === "invoice_number" && (sortOrder === "asc" ? "↑" : "↓")}
          </div>
          <div className="sortable" onClick={() => handleSortChange("name")}>
            Invoice Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
          </div>
          <div className="sortable" onClick={() => handleSortChange("type")}>
            Type {sortField === "type" && (sortOrder === "asc" ? "↑" : "↓")}
          </div>
          <div className="sortable" onClick={() => handleSortChange("amount")}>
            Amount {sortField === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
          </div>
          <div className="sortable" onClick={() => handleSortChange("issue_date")}>
            Issue Date {sortField === "issue_date" && (sortOrder === "asc" ? "↑" : "↓")}
          </div>
          <div className="sortable" onClick={() => handleSortChange("due_date")}>
            Due Date {sortField === "due_date" && (sortOrder === "asc" ? "↑" : "↓")}
          </div>
          <div>Apartment</div>
          <div>Status</div>
          <div>Action</div>
        </Table.Header>

        {invoices.length > 0 ? (
          invoices.map((invoice: Invoice) => (
            <InvoiceRow key={invoice.invoice_apartment_id} invoice={invoice}/>
          ))
        ) : (
          <div className="empty-state">
            <p>No invoices match the search criteria</p>
          </div>
        )}
        
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
};

export default InvoiceTable;