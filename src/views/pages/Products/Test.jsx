import React, { useState, useEffect } from "react";
import { Table, Button, InputGroup, FormControl, Pagination } from "react-bootstrap";
import axios from "axios";

const PaginatedProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(13); // Items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch Products
  const fetchProducts = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await axios.post("https://lunarsenterprises.com:5016/crm/item/list", {
        page_no: page,
        limit: limit,
        search: search,
      });

      if (response.data.result) {
        setProducts(response.data.list);
        setTotalItems(response.data.total_count);
        setTotalPages(Math.ceil(response.data.total_count / limit));
        setCurrentPage(page);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Page Change
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      fetchProducts(page, searchTerm);
    }
  };

  // Handle Search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    fetchProducts(1, e.target.value); // Reset to page 1 on search
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h3>Products</h3>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </InputGroup>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Name</th>
            <th>Unit</th>
            <th>Price</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center">
                Loading...
              </td>
            </tr>
          ) : products.length > 0 ? (
            products.map((item, index) => (
              <tr key={item.i_id}>
                <td>{(currentPage - 1) * limit + index + 1}</td>
                <td>{item.i_type}</td>
                <td>{item.i_name}</td>
                <td>{item.i_unit}</td>
                <td>{item.i_price}</td>
                <td>{item.i_description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination>
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
};

export default PaginatedProducts;
