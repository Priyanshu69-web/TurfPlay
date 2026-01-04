import { useState } from "react";
import EmailInput from "../../components/ui/EmailInput";
import PasswordInput from "../../components/ui/PasswordInput";
import { Link, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, formData, { withCredentials: true }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const token = response.data.token;
            const user = await login(token);
            toast.success("Login successful");

            const role = user?.role;

            if (role === 1) {
                navigate("/admin/dashboard");
            } else {
                navigate("/user/dashboard");
            }
        } catch (error) {
            toast.error("Login failed: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen ">
                <div className="card w-full max-w-md shadow-2xl bg-base-100">
                    <form onSubmit={handleSubmit} className="card-body">
                        <h2 className="text-center text-2xl font-bold">Login to TurfPlay</h2>
                        <div className="form-control">
                            <label className="label mb-2">
                                <span className="label-text">Email</span>
                            </label>
                            <EmailInput name="email" value={formData.email}
                                onChange={handleChange} required />

                        </div>
                        <div className="form-control">
                            <label className="label mb-2">
                                <span className="label-text">Password</span>
                            </label>
                            <PasswordInput name="password" value={formData.password}
                                onChange={handleChange}
                                required />
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-outline ">Login</button>
                        </div>
                        <p className="text-[15px] mt-3">
                            Don't have an account?{" "}
                            <Link className=" font-medium text-primary underline " to="/register">
                                Signup
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
