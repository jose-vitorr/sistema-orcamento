import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Info, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/StatusBadge';
import { getOrcamentos } from '@/utils/localStorage';
import { formatDate } from '@/utils/calculations';
import { Orcamento } from '@/types/orcamento';

const OrcamentosList = () => {
  const navigate = useNavigate();
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadOrcamentos();
  }, []);

  const loadOrcamentos = () => {
    const data = getOrcamentos();
    setOrcamentos(data);
  };

  const filteredOrcamentos = orcamentos.filter(orc =>
    orc.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orc.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-foreground">Orçamentos</h1>
            <Info className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate('/configuracoes/empresa')}
              variant="outline"
              size="icon"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => navigate('/novo')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <FileText className="h-4 w-4 mr-2" />
              Novo orçamento
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número, título ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Budget List */}
        <div className="grid gap-4">
          {filteredOrcamentos.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'Nenhum orçamento encontrado' : 'Nenhum orçamento criado ainda'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => navigate('/novo')}
                  variant="outline"
                  className="mt-4"
                >
                  Criar primeiro orçamento
                </Button>
              )}
            </div>
          ) : (
            filteredOrcamentos.map((orc) => (
              <div
                key={orc.id}
                onClick={() => navigate(`/orcamento/${orc.id}`)}
                className="bg-card border border-border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-lg mb-1">
                      {orc.numero} - {orc.titulo}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {orc.cliente.nome || 'N/A'}
                    </p>
                  </div>
                  
                  <StatusBadge status={orc.status} />
                </div>
                
                <div className="mt-3 text-right">
                  <p className="text-sm text-muted-foreground">
                    {formatDate(orc.dataCriacao)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrcamentosList;
