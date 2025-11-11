import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Settings, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { EmpresaBanner } from '@/components/EmpresaBanner';
import { getOrcamentoById, saveOrcamento } from '@/utils/localStorage';
import { formatCurrency, formatDate } from '@/utils/calculations';
import { Orcamento, OrcamentoStatus } from '@/types/orcamento';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const OrcamentoView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orcamento, setOrcamento] = useState<Orcamento | null>(null);

  useEffect(() => {
    if (id) {
      const data = getOrcamentoById(id);
      if (data) {
        setOrcamento(data);
      } else {
        toast({
          title: 'Orçamento não encontrado',
          variant: 'destructive',
        });
        navigate('/');
      }
    }
  }, [id]);

  const handleStatusChange = (newStatus: OrcamentoStatus) => {
    if (orcamento) {
      const updated = { ...orcamento, status: newStatus, dataAtualizacao: new Date().toISOString() };
      saveOrcamento(updated);
      setOrcamento(updated);
      toast({
        title: 'Status atualizado',
        description: 'O status do orçamento foi alterado com sucesso.',
      });
    }
  };

  const handleGenerateLink = () => {
    const link = `${window.location.origin}/orcamento/${orcamento.id}`;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link copiado!',
      description: 'O link do orçamento foi copiado para a área de transferência.',
    });
  };

  const handleSavePDF = () => {
    toast({
      title: 'Gerando PDF',
      description: 'Funcionalidade de PDF em desenvolvimento.',
    });
  };

  if (!orcamento) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Visualização</h1>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Ações
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => navigate(`/editar/${orcamento.id}`)}>
                ✏️ Editar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleGenerateLink}>
                🔗 Gerar link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSavePDF}>
                📄 Salvar PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div>
                <StatusBadge status={orcamento.status} onClick={() => {}} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleStatusChange('em_aberto')}>
                Em aberto
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('aprovado')}>
                Aprovado
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('recusado')}>
                Recusado
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('em_analise')}>
                Em análise
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('cancelado')}>
                Cancelado
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Document */}
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-lg">
          {/* Banner */}
          <div className="p-6">
            <EmpresaBanner showEditButton={false} />
          </div>

          <div className="p-6 space-y-6">
            {/* Title */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">{orcamento.titulo}</h3>
              {!orcamento.ocultarNumero && (
                <p className="text-muted-foreground">[{orcamento.numero}]</p>
              )}
            </div>

            {/* Client Info */}
            <div className="border-t border-b border-border py-4">
              <h4 className="font-semibold mb-2">Cliente:</h4>
              <p className="text-foreground">{orcamento.cliente.nome}</p>
              {orcamento.cliente.email && <p className="text-sm text-muted-foreground">{orcamento.cliente.email}</p>}
              {orcamento.cliente.celular && <p className="text-sm text-muted-foreground">{orcamento.cliente.celular}</p>}
            </div>

            {/* Prices Table */}
            <div>
              <h4 className="font-semibold mb-3">Preços</h4>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium">Item</th>
                      {orcamento.apresentarPrecos.quantidadeTipo && (
                        <th className="text-center p-3 text-sm font-medium">Qtde.</th>
                      )}
                      {orcamento.apresentarPrecos.valorUnitario && (
                        <th className="text-right p-3 text-sm font-medium">Unitário</th>
                      )}
                      {orcamento.apresentarPrecos.subtotal && (
                        <th className="text-right p-3 text-sm font-medium">Total</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {orcamento.itens.map((item) => (
                      <tr key={item.id} className="border-t border-border">
                        <td className="p-3">{item.nome}</td>
                        {orcamento.apresentarPrecos.quantidadeTipo && (
                          <td className="p-3 text-center">{item.quantidade} {item.tipo}</td>
                        )}
                        {orcamento.apresentarPrecos.valorUnitario && (
                          <td className="p-3 text-right">{formatCurrency(item.precoUnitario)}</td>
                        )}
                        {orcamento.apresentarPrecos.subtotal && (
                          <td className="p-3 text-right">{formatCurrency(item.total)}</td>
                        )}
                      </tr>
                    ))}
                    {orcamento.apresentarPrecos.valorTotal && (
                      <tr className="border-t-2 border-border bg-accent font-semibold">
                        <td className="p-3" colSpan={3}>Total</td>
                        <td className="p-3 text-right">{formatCurrency(orcamento.total)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="text-center">
                <div className="border-t border-foreground pt-2">
                  <p className="text-sm">Minha Empresa LTDA.</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-foreground pt-2">
                  <p className="text-sm">{orcamento.cliente.nome || 'Cliente'}</p>
                </div>
              </div>
            </div>

            {/* Date */}
            <p className="text-center text-sm text-muted-foreground">
              Data de criação: {formatDate(orcamento.dataCriacao)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrcamentoView;
