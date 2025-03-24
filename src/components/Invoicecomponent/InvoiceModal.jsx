
import React from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Button, Table, Modal } from "react-bootstrap";
import { BiCloudDownload } from "react-icons/bi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const GenerateInvoice = () => {
  const invoiceElement = document.querySelector("#invoiceCapture");
  if (!invoiceElement) {
    console.error("Invoice element not found");
    return;
  }

  html2canvas(invoiceElement).then((canvas) => {
    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [612, 792],
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");
  });
};

const InvoiceModal = ({
  showModal,
  closeModal,
  info = {},
  currency = "USD",
  total = 0,
  items = [],
  taxAmount = 0,
  discountAmount = 0,
  subTotal = 0,
}) => {
  const CreateInvoice = async () => {
    const invoiceData = {
      due_date: info.dueDate || "2025-06-15",
      type: "sales",
      billFromName: info.billFrom || "Tech Innovators Ltd.",
      billFromEmail: info.billFromEmail || "contact@techinnovators.com",
      billFromBilling:
        info.billFromAddress || "123 Tech Park, Silicon Valley, CA",
      billToName: info.billTo || "John Doe",
      billToEmail: info.billToEmail || "john.doe@example.com",
      billToBilling: info.billToAddress || "456 Oak Street, New York, NY",
      items: items.map((item) => ({
        itemName: item.name || "Unknown Item",
        itemDescription: item.description || "No Description",
        qty: item.quantity || 1,
        price: item.price || 0,
      })),
      subTotal: subTotal || 0,
      discount: discountAmount || 0,
      tax: taxAmount || 0,
      total: total || 0,
      currency: currency,
      taxRate: info.taxRate || 10.0,
      discountRate: info.discountRate || 5.0,
    };

    try {
      const tokencheck = sessionStorage.getItem("token");

      const response = await axios.post(
        "https://lunarsenterprises.com:5016/crm/invoice/create",
        invoiceData,
        {
          headers: {
            Authorization: `Bearer ${tokencheck}`,
          },
        }
      );
      console.log("Invoice Created:", response.data);
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  return (
    <Modal show={showModal} onHide={closeModal} size="lg" centered>
      <div id="invoiceCapture">
        <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
          <div className="w-100">
            <h4 className="fw-bold my-2">
              {info.billFrom || "John Uberbacher"}
            </h4>
            <h6 className="fw-bold text-secondary mb-1">
              Invoice Number: {info.invoiceNumber || "N/A"}
            </h6>
          </div>
          <div className="text-end ms-4">
            <h6 className="fw-bold mt-1 mb-2">Amount Due:</h6>
            <h5 className="fw-bold text-secondary">
              {currency} {total}
            </h5>
          </div>
        </div>
        <div className="p-4">
          <Row className="mb-4">
            <Col md={4}>
              <div className="fw-bold">Billed From:</div>
              <div>{info.billFrom || "N/A"}</div>
              <div>{info.billFromAddress || "N/A"}</div>
              <div>{info.billFromEmail || "N/A"}</div>
            </Col>
            <Col md={4}>
              <div className="fw-bold">Billed to:</div>
              <div>{info.billTo || "N/A"}</div>
              <div>{info.billToAddress || "N/A"}</div>
              <div>{info.billToEmail || "N/A"}</div>
            </Col>
            <Col md={4}>
              <div className="fw-bold mt-2">Date Of Issue:</div>
              <div>{info.dateOfIssue || "N/A"}</div>
            </Col>
          </Row>
          <Table className="mb-0">
            <thead>
              <tr>
                <th>QTY</th>
                <th>DESCRIPTION</th>
                <th className="text-end">PRICE</th>
                <th className="text-end">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.quantity || 1}</td>
                    <td>
                      {item.name || "Item"} -{" "}
                      {item.description || "No Description"}
                    </td>
                    <td className="text-end">
                      {currency} {item.price || 0}
                    </td>
                    <td className="text-end">
                      {currency} {(item.price || 0) * (item.quantity || 1)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No items available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <Table>
            <tbody>
              <tr className="text-end">
                <td></td>
                <td className="fw-bold">SUBTOTAL</td>
                <td>
                  {currency} {subTotal}
                </td>
              </tr>
              {taxAmount > 0 && (
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold">TAX</td>
                  <td>
                    {currency} {taxAmount}
                  </td>
                </tr>
              )}
              {discountAmount > 0 && (
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold">DISCOUNT</td>
                  <td>
                    {currency} {discountAmount}
                  </td>
                </tr>
              )}
              <tr className="text-end">
                <td></td>
                <td className="fw-bold">TOTAL</td>
                <td>
                  {currency} {total}
                </td>
              </tr>
            </tbody>
          </Table>
          {info.notes && (
            <div className="bg-light py-3 px-4 rounded">{info.notes}</div>
          )}
        </div>
      </div>
      <div className="pb-4 px-4">
        <Row>
          <Col md={6}></Col>
          <Col md={6}>
            <Button
              variant="outline-primary"
              className="w-100"
              onClick={CreateInvoice}
            >
              <BiCloudDownload className="me-2" />
              Create & Save Invoice
            </Button>
            <Button
              variant="outline-secondary"
              className="w-100 mt-2"
              onClick={GenerateInvoice}
            >
              Download Copy
            </Button>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default InvoiceModal;
