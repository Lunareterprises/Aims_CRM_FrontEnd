import React, { useRef } from "react";
import { Modal, Table, Button } from "react-bootstrap";
import { FaFilePdf, FaPrint, FaDownload, FaEdit } from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./ManualJournalCSS.css";
import { useNavigate } from "react-router-dom";

const JournalModal = ({ showModal, setShowModal, selectedNote }) => {
  const modalRef = useRef(null); // Reference to modal content
  const navigate = useNavigate();
  // Function to Print the Modal Content Only
  const handlePrint = () => {
    const printContent = modalRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent; // Replace entire page content with modal content
    window.print();
    document.body.innerHTML = originalContent; // Restore original content
    window.location.reload(); // Reload to reset page
  };

  // Function to Download Modal Content as PDF
  const handleDownloadPDF = () => {
    const modalContent = modalRef.current;
  
    if (!modalContent) {
      alert("No content to download.");
      return;
    }
  
    html2canvas(modalContent, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
  
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("journal-details.pdf");
    });
  };
  
  const handleEdit = () => {
    navigate("/dashboard/AddNewManualJournals", { state: { journalData: selectedNote, isEditing: true } });
  };


  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="modal-title-custom">Journal Details</Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-body-custom" ref={modalRef}>
        {selectedNote && (
          <div id="printableArea">
            <h4 className="journal-title">JOURNAL {selectedNote.code}</h4>

            <div className="journal-info">
              <p><strong>Notes:</strong> {selectedNote.notes}</p>
              <p><strong>Date:</strong> {selectedNote.date}</p>
              <p><strong>Amount:</strong> ₹{selectedNote.amount}</p>
              <p><strong>Reference Number:</strong> {selectedNote.reference}</p>
            </div>

            <Table bordered className="journal-table">
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Contact</th>
                  <th>Debits</th>
                  <th>Credits</th>
                </tr>
              </thead>
              <tbody>
                {selectedNote?.entries && selectedNote.entries.length > 0 ? (
                  selectedNote.entries.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.account || "-"}</td>
                      <td>{entry.contact || "-"}</td>
                      <td>{entry.debits || "-"}</td>
                      <td>{entry.credits || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No entries available</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2"><strong>Sub Total</strong></td>
                  <td><strong>₹{selectedNote.subTotal}</strong></td>
                  <td><strong>₹{selectedNote.subTotal}</strong></td>
                </tr>
                <tr>
                  <td colSpan="2"><strong>Total</strong></td>
                  <td><strong>₹{selectedNote.total}</strong></td>
                  <td><strong>₹{selectedNote.total}</strong></td>
                </tr>
              </tfoot>
            </Table>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="modal-footer-custom">
        <Button variant="light" className="icon-btn" onClick={handleEdit}>
          <FaEdit /> Edit
        </Button>
        <Button variant="light" className="icon-btn" onClick={handlePrint}>
          <FaPrint /> Print
        </Button>
        <Button variant="light" className="icon-btn" onClick={handleDownloadPDF}>
          <FaFilePdf /> PDF
        </Button>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JournalModal;
