import React, { useRef } from "react";
import { Modal, Table, Button } from "react-bootstrap";
import { FaFilePdf, FaPrint, FaEdit } from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import "./ManualJournalCSS.css";

const JournalModal = ({ showModal, setShowModal, selectedNote }) => {
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const handlePrint = () => {
    const printContent = modalRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleDownloadPDF = () => {
    const modalContent = modalRef.current;
    if (!modalContent) return alert("No content to download.");
  
    html2canvas(modalContent, {
      scale: 2,
      ignoreElements: (element) => element.classList.contains("no-print"),
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("journal-details.pdf");
    });
  };
  

  const handleEdit = () => {
    navigate("/dashboard/AddNewManualJournals", {
      state: { journalData: selectedNote, isEditing: true },
    });
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="modal-title-custom">Journal Details</Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-body-custom" ref={modalRef}>
        {selectedNote && (
          <div id="printableArea">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="journal-title">JOURNAL {selectedNote.code}</h4>
              <div className="d-flex gap-4 no-print" style={{ fontSize: "15px" }}>
                <FaEdit className="icon-btn text-secondary" style={{ fontSize: "16px" }} onClick={handleEdit} />
                <FaPrint className="icon-btn text-danger" onClick={handlePrint} />
                <FaFilePdf className="icon-btn text-primary" onClick={handleDownloadPDF} />
              </div>
            </div>


            <br />
            <div className="journal-info">
              <p><strong>Notes:</strong> {selectedNote.notes}</p>
              <p><strong>Date:</strong> {selectedNote.date}</p>
              <p><strong>Amount:</strong> {selectedNote.amount}</p>
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
                {selectedNote?.entries?.length > 0 ? (
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
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JournalModal;
