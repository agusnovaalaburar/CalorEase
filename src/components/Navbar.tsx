// src/components/Navbar.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal"; // 👈 cambio importante: import por default
import { Bot, User, Menu, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<"login" | "register">("login");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // ✅ Detectar token al cargar
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    // 🧩 Escuchar cambios locales (desde AuthModal)
    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  const handleAuthChange = () => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setMobileMenuOpen(false);
    window.dispatchEvent(new Event("authChange")); // 🔄 notificar logout
  };

  const handleAuthClick = (type: "login" | "register") => {
    setAuthType(type);
    setShowAuthModal(true);
    setMobileMenuOpen(false);
  };

  const handleChatBotClick = () => {
    navigate("/chat-bot");
    setMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-card">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg">
                  C
                </span>
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CalorEase
              </span>
            </div>

            {/* Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={handleChatBotClick}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Bot size={18} />
                <span>Chat-Bot</span>
              </button>

              <button
                onClick={() => scrollToSection("about")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Sobre nosotros
              </button>

              {!isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAuthClick("login")}
                    className="flex items-center space-x-2"
                  >
                    <User size={18} />
                    <span>Iniciar sesión</span>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleAuthClick("register")}
                    className="bg-gradient-accent hover:bg-accent/90"
                  >
                    Crear cuenta
                  </Button>
                </>
              ) : (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white"
                >
                  <LogOut size={18} />
                  <span>Cerrar sesión</span>
                </Button>
              )}
            </div>

            {/* Mobile */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden animate-fade-up">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-card border-t border-border">
                <button
                  onClick={handleChatBotClick}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-left text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                >
                  <Bot size={18} />
                  <span>Chat-Bot</span>
                </button>

                <button
                  onClick={() => scrollToSection("about")}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted w-full text-left"
                >
                  Sobre nosotros
                </button>

                <div className="pt-2 border-t border-border space-y-2">
                  {!isAuthenticated ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAuthClick("login")}
                        className="w-full justify-start"
                      >
                        <User size={18} className="mr-2" />
                        Iniciar sesión
                      </Button>

                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleAuthClick("register")}
                        className="w-full bg-gradient-accent hover:bg-accent/90"
                      >
                        Crear cuenta
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full flex items-center justify-start bg-red-500 hover:bg-red-600 text-white"
                    >
                      <LogOut size={18} className="mr-2" />
                      Cerrar sesión
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
            <div className="p-6">
              <AuthModal type={authType} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
