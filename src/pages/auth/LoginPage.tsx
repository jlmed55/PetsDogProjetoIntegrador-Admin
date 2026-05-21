import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';


interface LoginFormData {
    email: string;
    password: string;
}

export function LoginPage() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [severError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>();

    async function handleLogin(data: LoginFormData) {
        console.log(data);
    
        try {
            setServerError("");
            
            await signIn(data);
            
            navigate("app/dashboard");
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <main className=" flex min-h-screen items-center justify-center bg -gray-100 px-4">
            <section className="w-full max-wp-md rounded-2x1 bg-white p-8 shadow-lg ">
                <h1 className="mb-2 text-center text-2x1 font-bold text=gray-800">
                    restaurante
                </h1>
                <p className="mb-b text center text-sm text-gray-500">

                </p>
                <form onSubmit={handleSubmit(handleLogin)} className="space-y-4" >
                    <div >
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input type="email"
                            className="w-full rounded-lg border border-gray-300 py-2 outline-none focus:border-blue-500 "
                            placeholder="admin@gmail.com"
                            {...register("email", { required: "Email é obrigatório" })}
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.email.message}
                        </p>
                    )}


                    <div >
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Senha
                        </label>
                        <input type="password"
                            className="w-full rounded-lg border border-gray-300 py-2 outline-none focus:border-blue-500 "
                            placeholder="*********"
                            {...register("password", { required: "Senha é obrigatória" })}
                        />
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.password.message}
                        </p>
                    )}
                    {
                        severError && (
                            <p className="mt-1 text-sm text-red-500">
                                {severError}
                            </p>
                        )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className='w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white trasition houver:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300'
                    >
                        {isSubmitting ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </section>
        </main>
    );
}
