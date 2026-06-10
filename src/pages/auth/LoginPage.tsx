import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface LoginFormData {
    email: string;
    password: string;
}

export function LoginPage() {
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>();

    async function handleLogin(data: LoginFormData) {
        try {
            setServerError("");

            await signIn(data);

            navigate("/app/dashboard");
        } catch (error) {
            console.error(error);
            setServerError("Email ou senha inválidos.");
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
                    PetShop
                </h1>

                <p className="mb-8 text-center text-sm text-gray-500">
                    Faça login para continuar
                </p>

                <form
                    onSubmit={handleSubmit(handleLogin)}
                    className="space-y-4"
                >
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="admin@gmail.com"
                            className="w-full rounded-lg border border-gray-300 py-2 px-3 outline-none focus:border-blue-500"
                            {...register("email", {
                                required: "Email é obrigatório",
                            })}
                        />

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Senha
                        </label>

                        <input
                            type="password"
                            placeholder="********"
                            className="w-full rounded-lg border border-gray-300 py-2 px-3 outline-none focus:border-blue-500"
                            {...register("password", {
                                required: "Senha é obrigatória",
                            })}
                        />

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {serverError && (
                        <p className="text-sm text-red-500">
                            {serverError}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {isSubmitting ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </section>
        </main>
    );
}