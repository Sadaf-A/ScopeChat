"use client"
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Auth() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("signin");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSignUp = async () => {
    setIsLoading(true);
    setError("");
    
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      setError(error.message);
      console.error(error);
    } else {
      console.log("Check your email for verification!", data);
    }
    
    setIsLoading(false);
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    setError("");
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      setError(error.message);
      console.error("Login Error:", error);
      setIsLoading(false);
      return;
    }
  
    console.log("Logged in successfully!", data);
  
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Session Error:", sessionError);
    } else {
      console.log("Current Session:", sessionData);
    }
  
    setIsLoading(false);
    router.push("/");
  };
  
  return (
    <main className="flex items-center justify-center min-h-screen bg-black text-gray-200 overflow-hidden">
      {/* Dynamic background grid */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-green-500 to-transparent"></div>
          <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-green-500 to-transparent"></div>
        </div>
        <div className="h-full w-full grid grid-cols-12 grid-rows-12">
          {Array.from({ length: 12 * 12 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-green-900/20"></div>
          ))}
        </div>
      </div>
      
      {/* Animated gradient orbs */}
      <div 
        className="fixed w-96 h-96 rounded-full bg-gradient-to-r from-green-600/30 to-emerald-400/30 blur-3xl opacity-30 animate-pulse"
        style={{ 
          left: `calc(${mousePosition.x}px - 12rem)`,
          top: `calc(${mousePosition.y}px - 12rem)`,
          transition: 'left 0.5s ease-out, top 0.5s ease-out'
        }}
      ></div>
      <div className="fixed top-1/4 left-1/3 w-64 h-64 rounded-full bg-green-800/20 blur-3xl opacity-50 animate-blob"></div>
      <div className="fixed bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-emerald-600/20 blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      
      <section className="w-full max-w-md relative z-10">
        <article className="backdrop-blur-sm bg-gray-900/80 shadow-[0_0_25px_10px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden border border-green-500/30">
          {/* Cyberpunk-style header */}
          <header className="relative h-20 bg-gradient-to-r from-green-900 via-green-500 to-green-900 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <div className="w-full h-px bg-green-300 animate-scanline opacity-70"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-2xl font-mono tracking-wider text-black font-bold mix-blend-difference">
                {mode === "signin" ? "ACCESS SYSTEM" : "NEW IDENTITY"}
              </h1>
            </div>
            <div className="absolute top-0 right-0 p-2 font-mono text-xs text-green-300">SECURE CONNECTION</div>
          </header>
          
          <div className="p-8">
            {/* Mode toggle */}
            <nav className="flex w-full mb-6 relative">
              <div className="absolute inset-0 bg-gray-800 rounded-md"></div>
              <button 
                className={`relative w-1/2 py-3 z-10 font-mono transition-all duration-300 ${mode === "signin" ? "text-green-400" : "text-gray-500"}`}
                onClick={() => setMode("signin")}
                aria-pressed={mode === "signin"}
                aria-label="Sign in mode"
              >
                <span className="relative z-10">SIGN IN</span>
                {mode === "signin" && (
                  <span className="absolute inset-0 bg-gray-700 rounded-md border-l-2 border-t-2 border-green-500"></span>
                )}
              </button>
              <button 
                className={`relative w-1/2 py-3 z-10 font-mono transition-all duration-300 ${mode === "signup" ? "text-green-400" : "text-gray-500"}`}
                onClick={() => setMode("signup")}
                aria-pressed={mode === "signup"}
                aria-label="Sign up mode"
              >
                <span className="relative z-10">SIGN UP</span>
                {mode === "signup" && (
                  <span className="absolute inset-0 bg-gray-700 rounded-md border-r-2 border-t-2 border-green-500"></span>
                )}
              </button>
            </nav>
            
            {error && (
              <aside className="relative mb-6 p-4 bg-red-900/30 rounded-md overflow-hidden" role="alert" aria-live="assertive">
                <div className="absolute inset-0 w-full h-full bg-red-900/20">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                </div>
                <p className="font-mono text-red-400 text-sm relative z-10">{error}</p>
              </aside>
            )}
            
            <form onSubmit={(e) => {
              e.preventDefault();
              mode === "signin" ? handleSignIn() : handleSignUp();
            }}>
              <fieldset className="space-y-5">
                <legend className="sr-only">{mode === "signin" ? "Sign In" : "Create Account"}</legend>
                
                <div className="relative">
                  <label htmlFor="email" className="block mb-2 text-xs font-mono text-green-400">EMAIL_ADDRESS</label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      required
                      className="w-full px-4 py-3 bg-gray-800/80 border border-green-900 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all font-mono placeholder-gray-600"
                      placeholder="user@domain.com"
                      onChange={(e) => setEmail(e.target.value)}
                      aria-required="true"
                      autoComplete="email"
                    />
                    <div className="absolute top-0 right-0 mt-3 mr-3 w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true"></div>
                  </div>
                </div>
                
                <div className="relative">
                  <label htmlFor="password" className="block mb-2 text-xs font-mono text-green-400">PASSWORD</label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      required
                      className="w-full px-4 py-3 bg-gray-800/80 border border-green-900 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all font-mono placeholder-gray-600"
                      placeholder="••••••••••••"
                      onChange={(e) => setPassword(e.target.value)}
                      aria-required="true"
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    />
                    <div className="absolute top-0 right-0 mt-3 mr-3 w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true"></div>
                  </div>
                </div>
              </fieldset>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 relative group overflow-hidden"
                aria-busy={isLoading}
              >
                <div className="absolute inset-0 w-full h-full transition-all duration-300 bg-gradient-to-r from-green-600 via-green-500 to-green-600 group-hover:opacity-90 group-active:opacity-100"></div>
                <div className="absolute inset-0 w-3/4 h-full transform -skew-x-12 bg-green-400/30 group-hover:animate-shine" aria-hidden="true"></div>
                <div className="relative px-4 py-3 bg-transparent font-mono font-bold tracking-wider text-black text-center">
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      PROCESSING...
                    </span>
                  ) : (
                    mode === "signin" ? "INITIALIZE SESSION" : "CREATE ACCOUNT"
                  )}
                </div>
              </button>
            </form>
            
            {mode === "signin" && (
              <div className="mt-4 text-center">
                <a href="#" className="text-xs font-mono text-green-400 hover:text-green-300 inline-block border-b border-green-800 hover:border-green-400 transition-colors">
                  RESET ACCESS CREDENTIALS
                </a>
              </div>
            )}
            
            <footer className="mt-6 pt-6 border-t border-green-900/40 flex justify-between items-center">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></div>
                <p className="text-xs font-mono text-green-400">SECURE PROTOCOL</p>
              </div>
              <time dateTime={new Date().toISOString()} className="text-xs font-mono text-gray-500">
                {new Date().toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' })}
              </time>
            </footer>
          </div>
        </article>
      </section>
    </main>
  );
}