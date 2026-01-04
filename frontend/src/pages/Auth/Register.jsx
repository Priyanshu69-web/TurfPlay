
import { useState } from "react";
import NameInput from "../../components/ui/NameInput";
import EmailInput from "../../components/ui/EmailInput";
import PasswordInput from "../../components/ui/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { toast } from 'react-hot-toast';

const Register = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const navigate = useNavigate()

    const handleChange = e =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post(API_PATHS.AUTH.REGISTER, form);
            toast.success('Registration successful')
            navigate("/login");
        } catch (err) {
            toast.error('Registration failed', err);
        }
    };

    return (
        <>

            <div className="flex items-center justify-center min-h-screen ">
                <div className="card w-full max-w-md shadow-2xl bg-base-100 p-4">
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-center text-2xl font-bold my-2">Register to TurfPlay</h2>
                        <div className="form-control">
                            <label className="label mb-2">
                                <span className="label-text">Name</span>
                            </label>
                            <NameInput name="name" onChange={handleChange} required />
                        </div>
                        <div className="form-control mb-2">
                            <label className="label mb-2">
                                <span className="label-text">Email</span>
                            </label>
                            <EmailInput name="email" type="email" onChange={handleChange} required />
                        </div>
                        <div className="form-control mb-2">
                            <label className="label mb-2">
                                <span className="label-text">Password</span>
                            </label>
                            <PasswordInput name="password" type="password" onChange={handleChange} required />
                        </div>
                        <button className="btn btn-outline">Register</button>
                        <p className="text-[15px] mt-3">
                            Already have an account?{" "}
                            <Link className=" font-medium text-primary underline " to="/login">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div >
        </>
    );
};

export default Register;
