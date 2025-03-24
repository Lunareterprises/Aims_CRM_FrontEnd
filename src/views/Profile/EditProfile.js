import React from "react";
import { useForm } from "react-hook-form";
import "../Profile/EditProfile.css";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { data } from "autoprefixer";

function EditProfile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    alert("Profile updated!");
    console.log("Updated Profile:", data);
  };

  const ProfileForm = async () => {
const edit = new FormData();
data.append("name",)


    try {
      const response =await axios.post('http://localhost:3000/api/user', {})
    } catch (error) {
      
    }

  }

  return (
    <div className="edit-profile container mt-5">
      <h1 className="mb-4">Edit Profile</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            {...register("name", { required: "Name is required" })}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Enter a valid email",
              },
            })}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            {...register("address", { required: "Address is required" })}
            isInvalid={!!errors.address}
          />
          <Form.Control.Feedback type="invalid">
            {errors.address?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="companyName">
          <Form.Label>Company Name</Form.Label>
          <Form.Control
            type="text"
            {...register("companyName", { required: "Company Name is required" })}
            isInvalid={!!errors.companyName}
          />
          <Form.Control.Feedback type="invalid">
            {errors.companyName?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Button type="submit"  variant="primary">
          Save
        </Button>

        {/* <Button type="submit" variant="primary">
          Save
        </Button> */}
      </Form>
    </div>
  );
}

export default EditProfile;
