import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, Button, Row, Col, InputGroup, Table } from 'react-bootstrap'
import { FaSearch, FaTrash } from 'react-icons/fa'
import axios from 'axios'

const AddProject = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()


  const handleShow = () => setShowModal(true)
  const handleClose = () => setShowModal(false)

  const [users, setUsers] = useState([
    { id: 1, username: 'rahillunar123', email: 'rahillunar123@gmail.com' },
  ])
  const [tasks, setTasks] = useState([{ id: 1, taskName: '', description: '', billable: true }])

  const addUser = () => {
    setUsers([...users, { id: users.length + 1, username: '', email: '' }])
  }

  const removeUser = (id) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  const addTask = () => {
    setTasks([...tasks, { id: tasks.length + 1, taskName: '', description: '', billable: false }])
  }

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const onSubmit = async (data) => {
    console.log('Form Submitted:', data)

    try {
      const response = await axios.post(
        'http://localhost:3001/projects',
        data,

        {
          headers: {},
        },
      )
    } catch (error) {
      console.log('Error:', error)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded bg-white">
      <h3>New Project</h3>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="text-danger">Project Name*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter project name"
              {...register('projectName', { required: 'Project Name is required' })}
              isInvalid={errors.projectName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.projectName?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Project Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter project code"
              {...register('projectCode')}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="text-danger">Customer Name*</Form.Label>
            <InputGroup>
              <Form.Select {...register('customerName', { required: 'Customer Name is required' })}>
                <option value="">Select customer</option>
                <option value="customer1">Customer 1</option>
                <option value="customer2">Customer 2</option>
              </Form.Select>
              <Button variant="primary">
                <FaSearch />
              </Button>
            </InputGroup>
            <Form.Control.Feedback type="invalid" className="d-block">
              {errors.customerName?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="text-danger">Billing Method*</Form.Label>
            <Form.Select {...register('billingMethod', { required: 'Billing Method is required' })}>
              <option value="">Select billing method</option>
              <option value="hourly">Hourly</option>
              <option value="fixed">Fixed</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid" className="d-block">
              {errors.billingMethod?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Max. 2000 characters"
              {...register('description')}
            />
          </Form.Group>
        </Col>
      </Row>

      <h4>Budget</h4>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Cost Budget</Form.Label>
            <InputGroup>
              <Form.Control type="number" placeholder="Enter amount" {...register('costBudget')} />
              <InputGroup.Text>INR</InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Revenue Budget</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                {...register('revenueBudget')}
              />
              <InputGroup.Text>INR</InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Hours Budget Type</Form.Label>
            <InputGroup>
              <Form.Control type="number" placeholder="Enter amount" {...register('costBudget')} />
              <InputGroup.Text>INR</InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Date Budget Type</Form.Label>
            <InputGroup>
              <Form.Control type="date" placeholder="Enter amount" {...register('revenueBudget')} />
              {/* <InputGroup.Text>INR</InputGroup.Text> */}
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      <h4>Users</h4>
      <div className="p-4">
        <h4>Users</h4>
        <Table bordered>
          <thead>
            <tr>
              <th>S.NO</th>
              <th>USER</th>
              <th>EMAIL</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>
                  <Form.Control
                    type="text"
                    defaultValue={user.username}
                    {...register(`users[${index}].username`)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="email"
                    defaultValue={user.email}
                    {...register(`users[${index}].email`)}
                  />
                </td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => removeUser(user.id)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="primary" onClick={addUser}>
          + Add User
        </Button>

        <h4 className="mt-4">Project Tasks</h4>
        <Table bordered>
          <thead>
            <tr>
              <th>S.NO</th>
              <th>TASK NAME</th>
              <th>DESCRIPTION</th>
              <th>BILLABLE</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td>
                  <Form.Control
                    type="text"
                    {...register(`tasks[${index}].taskName`)}
                    placeholder="Task Name"
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    {...register(`tasks[${index}].description`)}
                    placeholder="Description"
                  />
                </td>
                <td>
                  <Form.Check
                    type="checkbox"
                    defaultChecked={task.billable}
                    {...register(`tasks[${index}].billable`)}
                  />
                </td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => removeTask(task.id)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="primary" onClick={addTask}>
          + Add Project Task
        </Button>
      </div>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}

export default AddProject
