import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddInvoice = ({ showtask, handleClosetask, empIdtask }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const targetData = {
      task: data.taskname,
      e_id: empIdtask,
      description: data.Description,
      from_date: data.startdate,
      end_date: data.endDate,
    };

    try {
      const token = sessionStorage.getItem('user_token');
      const user_id = sessionStorage.getItem('user_id');
      const response = await axios.post('https://lunarsenterprises.com:6002/engineers/add-task', targetData, {
        headers: {
          Authorization: `Bearer ${token}`,
          user_id: user_id,
        },
      });

      if (response.data.result ===true) {
        alert(response.data.message || "Task added successfully");
        reset(); // Reset form fields after submission
        handleClosetask(); // Close the modal
      } else {
        alert(response.data.message || "Failed to add task");
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error("An error occurred while adding the task.");
    }
  };

  return (
    <Modal show={showtask} onHide={handleClosetask} fullscreen>
      <ToastContainer />
      <Modal.Header closeButton>
        <Modal.Title>Add Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="taskname">
            <Form.Label>Name Of Task</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Name Of Task"
              {...register('taskname', {
                required: 'Task Name is required',
                pattern: {
                  value: /^[A-Za-z\s]*$/,
                  message: 'Only text is allowed',
                },
              })}
            />
            {errors.taskname && <span className="text-danger">{errors.taskname.message}</span>}
          </Form.Group>

          <Form.Group controlId="Description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Description"
              {...register('Description', {
                required: 'Description is required',
                pattern: { value: /^[A-Za-z\s]*$/, message: 'Only text is allowed' },
              })}
            />
            {errors.Description && <span className="text-danger">{errors.Description.message}</span>}
          </Form.Group>

          <Form.Group controlId="startdate">
            <Form.Label>From Date</Form.Label>
            <Form.Control
              type="date"
              {...register('startdate', { required: 'Start Date is required' })}
            />
            {errors.startdate && <span className="text-danger">{errors.startdate.message}</span>}
          </Form.Group>

          <Form.Group controlId="endDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              {...register('endDate', { required: 'End Date is required' })}
            />
            {errors.endDate && <span className="text-danger">{errors.endDate.message}</span>}
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddInvoice;
