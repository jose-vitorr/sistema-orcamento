import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OrcamentosList from "./pages/OrcamentosList";
import OrcamentoView from "./pages/OrcamentoView";
import OrcamentoForm from "./pages/OrcamentoForm";
import EmpresaConfig from "./pages/EmpresaConfig";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OrcamentosList />} />
          <Route path="/novo" element={<OrcamentoForm />} />
          <Route path="/editar/:id" element={<OrcamentoForm />} />
          <Route path="/orcamento/:id" element={<OrcamentoView />} />
          <Route path="/configuracoes/empresa" element={<EmpresaConfig />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
