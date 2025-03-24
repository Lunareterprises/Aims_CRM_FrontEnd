import React from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import '../Report/Report.css'
function Report() {
    return (
        <Container fluid className="p-4 bg-light">
            <Row>
                <Col md={3} className="bg-white p-3 sidebar">
                    <Form.Control type="text" placeholder="Search reports" className="mb-4" />
                    <ul className="list-unstyled">
                        <li>Favorites</li>
                        <li>Custom Reports</li>
                        <li>Scheduled Reports</li>
                        <li className="mt-3">Report Category</li>
                        <li className="active">Business Overview</li>
                        <li>Sales</li>
                        <li>Receivables</li>
                        <li>Payments Received</li>
                        <li>Recurring Invoices</li>
                        <li>Payables</li>
                        <li>Purchases and Expenses</li>
                        <li>Taxes</li>
                    </ul>
                </Col>
                <Col md={9} className="bg-white p-3">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="h4">Reports Center</h1>
                        <Button variant="primary">Create Custom Report</Button>
                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Report Name</th>
                                <th>Type</th>
                                <th>Created By</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Profit and Loss</td>
                                <td>Profit and Loss</td>
                                <td>System Generated</td>
                            </tr>
                            <tr>
                                <td>Profit and Loss (Schedule III)</td>
                                <td>Profit and Loss</td>
                                <td>System Generated</td>
                            </tr>
                            <tr>
                                <td>Horizontal Profit and Loss</td>
                                <td>Horizontal Profit and Loss</td>
                                <td>System Generated</td>
                            </tr>
                            <tr>
                                <td>Cash Flow Statement</td>
                                <td>Cash Flow Statement</td>
                                <td>System Generated</td>
                            </tr>
                            {/* Add more rows as needed */}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

export default Report;
