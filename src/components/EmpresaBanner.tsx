import { Info, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { getEmpresaConfig } from '@/utils/empresaStorage';

interface EmpresaBannerProps {
  showEditButton?: boolean;
}

export const EmpresaBanner = ({ showEditButton = false }: EmpresaBannerProps) => {
  const navigate = useNavigate();
  const empresa = getEmpresaConfig();

  return (
    <div className="relative bg-company-banner text-white p-6 rounded-lg shadow-md">
      {showEditButton && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-white hover:bg-white/20"
          onClick={() => navigate('/configuracoes/empresa')}
        >
          <Settings className="h-5 w-5" />
        </Button>
      )}
      
      <div className="flex items-start gap-4">
        {empresa.logo ? (
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
            <img src={empresa.logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold">LOGO</span>
          </div>
        )}
        
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-1">{empresa.nome}</h2>
          <p className="text-sm opacity-90">{empresa.cnpjCpf}</p>
          <p className="text-sm opacity-90">{empresa.endereco}</p>
        </div>
      </div>
    </div>
  );
};
