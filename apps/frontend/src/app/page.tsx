import Image from 'next/image';
import { AnimatedDemoImage } from './AnimatedDemoImage';
import { LoginForm } from './LoginForm';
import backgroundImage from '../files/figma_file1.png';
import demoImage from '../files/figma_file2.png';

export default function LoginPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf8] text-[#262633]">
      <section className="relative mx-auto grid min-h-screen w-full max-w-[1440px] overflow-hidden bg-white lg:grid-cols-[50.3%_49.7%]">
        <div className="absolute left-8 top-7 z-20 flex items-center gap-2.5">
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] bg-[#ff6845] shadow-[0_10px_20px_rgba(255,104,69,0.22)]">
            <span className="h-4 w-4 rounded-full bg-white/90 shadow-[8px_-4px_0_-4px_rgba(255,255,255,0.7)]" />
          </span>
          <span className="text-[20px] font-extrabold tracking-[-0.04em] text-[#33221c]">Obliq</span>
        </div>

        <div className="relative flex min-h-screen items-center justify-center px-6 pb-12 pt-24 lg:px-10">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_28%_47%,rgba(255,104,69,0.05),transparent_34%),linear-gradient(90deg,#fff7f3_0%,#ffffff_62%)]" />
          <div className="relative w-full max-w-[392px] rounded-[26px] border border-[#f1efee] bg-white px-10 pb-10 pt-9 shadow-[0_18px_0_6px_rgba(20,20,20,0.025),0_42px_90px_rgba(32,26,23,0.10)]">
            <div className="mb-10 text-center">
              <h1 className="text-[26px] font-bold tracking-[-0.04em] text-[#2a2b35]">Login</h1>
              <p className="mt-2 text-[14px] font-medium text-[#b0b2bf]">Enter your details to continue</p>
            </div>

            <LoginForm />
          </div>
        </div>

        <div className="relative hidden min-h-screen items-center overflow-hidden pr-8 lg:flex">
          <div className="relative h-[calc(100vh-56px)] max-h-[780px] min-h-[620px] w-full overflow-hidden rounded-[18px]">
            <Image alt="Orange abstract background" className="object-cover" fill priority src={backgroundImage} sizes="50vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/5" />
            <AnimatedDemoImage src={demoImage} />
          </div>
        </div>
      </section>
    </main>
  );
}
