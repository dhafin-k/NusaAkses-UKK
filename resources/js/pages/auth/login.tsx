import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { Form, Head } from '@inertiajs/react';

export default function Login({ canRegister }: { canRegister: boolean }) {
    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 md:p-0 overflow-hidden">
            {/* Dark blue gradient background - Parking theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900"></div>

            {/* Efek cahaya decorative - subtle blue tones */}
            <div className="absolute top-1/4 -left-40 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-40 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-blue-400/8 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-md">
                <Head title="Log in - NusaAkses" />

                    {/* <div className="mb-8 text-center">
                        <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">NusaAkses</div>
                        <p className="text-xs text-gray-400 mt-1">Parking Management System</p>
                    </div> */}
                {/* Main card box */}
                <div className="bg-white/8 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/15 shadow-2xl">
                    {/* Logo/Brand */}

                    {/* Header */}
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">Login</h2>
                    <p className="text-gray-300 mb-8 text-center">Parking Management System</p>

                    <Form
                        {...store.form()}
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="font-semibold text-gray-200">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        className="h-12 bg-white/8 border border-white/15 rounded-xl text-white placeholder:text-gray-500 focus:bg-white/15 focus:border-blue-400 focus:ring-0 transition-all"
                                        placeholder="you@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="font-semibold text-gray-200">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        className="h-12 bg-white/8 border border-white/15 rounded-xl text-white placeholder:text-gray-500 focus:bg-white/15 focus:border-blue-400 focus:ring-0 transition-all"
                                        placeholder="••••••••"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-4 h-12 w-full rounded-xl bg-linear-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 font-semibold transition-all shadow-lg hover:shadow-blue-500/50"
                                    disabled={processing}
                                >
                                    {processing && <Spinner className="mr-2" />}
                                    Sign In
                                </Button>

                                    {/* {canRegister && (
                                        <p className="mt-6 text-center text-sm text-gray-300">
                                            Don't have an account?{' '}
                                            <TextLink href={register()} className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                                                Create one
                                            </TextLink>
                                        </p>
                                    )} */}
                            </>
                        )}
                    </Form>
                </div>

                {/* Footer text */}
                <p className="text-center text-xs text-gray-400 mt-8">© 2026 NusaAkses. All rights reserved.</p>
            </div>
        </div>
    );
}
