import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from '@/components/RichTextEditor';
import { PriceItemCard } from '@/components/PriceItemCard';
import { EmpresaBanner } from '@/components/EmpresaBanner';
import { getOrcamentoById, saveOrcamento, getNextNumero } from '@/utils/localStorage';
import { calculateSubtotal, calculateTotal, formatCurrency } from '@/utils/calculations';
import { Orcamento, OrcamentoItem } from '@/types/orcamento';
import { useToast } from '@/hooks/use-toast';

const OrcamentoForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<Orcamento>({
    id: crypto.randomUUID(),
    numero: '',
    titulo: '',
    status: 'em_aberto',
    ocultarNumero: false,
    cliente: {
      nome: '',
      celular: '',
      email: '',
      cpfCnpj: '',
      endereco: '',
    },
    relatorioInicial: '',
    ocultarRelatorio: false,
    descricaoAtividades: '',
    imagens: [],
    itens: [],
    desconto: 0,
    descontoTipo: 'R$',
    subtotal: 0,
    total: 0,
    apresentarPrecos: {
      quantidadeTipo: true,
      valorUnitario: true,
      subtotal: true,
      valorTotal: true,
    },
    metodosPagemento: [],
    condicoesContrato: '',
    ocultarCondicoes: false,
    observacoes: '',
    ocultarObservacoes: false,
    dataCriacao: new Date().toISOString(),
    dataAtualizacao: new Date().toISOString(),
  });

  useEffect(() => {
    if (id) {
      const data = getOrcamentoById(id);
      if (data) {
        setFormData(data);
      }
    } else {
      setFormData(prev => ({ ...prev, numero: getNextNumero() }));
    }
  }, [id]);

  useEffect(() => {
    const subtotal = calculateSubtotal(formData.itens);
    const total = calculateTotal(subtotal, formData.desconto, formData.descontoTipo);
    setFormData(prev => ({ ...prev, subtotal, total }));
  }, [formData.itens, formData.desconto, formData.descontoTipo]);

  const addItem = () => {
    const newItem: OrcamentoItem = {
      id: crypto.randomUUID(),
      nome: '',
      tipo: 'serviço',
      quantidade: 1,
      precoUnitario: 0,
      desconto: 0,
      total: 0,
    };
    setFormData(prev => ({ ...prev, itens: [...prev.itens, newItem] }));
  };

  const updateItem = (index: number, item: OrcamentoItem) => {
    setFormData(prev => ({
      ...prev,
      itens: prev.itens.map((it, i) => (i === index ? item : it)),
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itens: prev.itens.filter((_, i) => i !== index),
    }));
  };

  const togglePaymentMethod = (method: string) => {
    setFormData(prev => ({
      ...prev,
      metodosPagemento: prev.metodosPagemento.includes(method)
        ? prev.metodosPagemento.filter(m => m !== method)
        : [...prev.metodosPagemento, method],
    }));
  };

  const handleSubmit = () => {
    if (!formData.titulo.trim()) {
      toast({
        title: 'Título obrigatório',
        description: 'Por favor, adicione um título ao orçamento.',
        variant: 'destructive',
      });
      return;
    }

    const dataToSave = {
      ...formData,
      dataAtualizacao: new Date().toISOString(),
    };

    saveOrcamento(dataToSave);
    toast({
      title: isEditing ? 'Orçamento atualizado' : 'Orçamento criado',
      description: 'Suas alterações foram salvas com sucesso.',
    });
    navigate(`/orcamento/${formData.id}`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            {isEditing ? 'Editar Orçamento' : 'Novo Orçamento'}
          </h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Banner */}
        <EmpresaBanner showEditButton={true} />

        {/* Form */}
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Título do orçamento</label>
            <Input
              placeholder="Ex: Projeto de reforma"
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
            />
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.ocultarNumero}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ocultarNumero: checked as boolean }))}
              />
              <label className="text-sm text-muted-foreground">Ocultar número serial do documento</label>
            </div>
          </div>

          {/* Client Data */}
          <div className="space-y-3">
            <h3 className="font-semibold">Dados do Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Nome"
                value={formData.cliente.nome}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  cliente: { ...prev.cliente, nome: e.target.value }
                }))}
              />
              <Input
                placeholder="Celular"
                value={formData.cliente.celular}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  cliente: { ...prev.cliente, celular: e.target.value }
                }))}
              />
              <Input
                placeholder="Email"
                value={formData.cliente.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  cliente: { ...prev.cliente, email: e.target.value }
                }))}
              />
              <Input
                placeholder="CPF/CNPJ"
                value={formData.cliente.cpfCnpj}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  cliente: { ...prev.cliente, cpfCnpj: e.target.value }
                }))}
              />
            </div>
            <Input
              placeholder="Endereço"
              value={formData.cliente.endereco}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                cliente: { ...prev.cliente, endereco: e.target.value }
              }))}
            />
          </div>

          {/* Initial Report */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Relatório inicial</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Ocultar</span>
                <Switch
                  checked={formData.ocultarRelatorio}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ocultarRelatorio: checked }))}
                />
              </div>
            </div>
            <RichTextEditor
              value={formData.relatorioInicial}
              onChange={(value) => setFormData(prev => ({ ...prev, relatorioInicial: value }))}
              placeholder="Descreva o relatório inicial..."
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold">Descrição das atividades</h3>
            <RichTextEditor
              value={formData.descricaoAtividades}
              onChange={(value) => setFormData(prev => ({ ...prev, descricaoAtividades: value }))}
              placeholder="Descreva as atividades..."
            />
          </div>

          {/* Price Items */}
          <div className="space-y-3">
            <h3 className="font-semibold">Preços</h3>
            {formData.itens.map((item, index) => (
              <PriceItemCard
                key={item.id}
                item={item}
                onChange={(updated) => updateItem(index, updated)}
                onRemove={() => removeItem(index)}
              />
            ))}
            <Button
              type="button"
              onClick={addItem}
              variant="outline"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo item
            </Button>
          </div>

          {/* Discount */}
          <div className="space-y-2">
            <h3 className="font-semibold">Desconto</h3>
            <div className="flex gap-2">
              <Select
                value={formData.descontoTipo}
                onValueChange={(value: 'R$' | '%') => setFormData(prev => ({ ...prev, descontoTipo: value }))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="R$">R$</SelectItem>
                  <SelectItem value="%">%</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="0,00"
                value={formData.desconto || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, desconto: parseFloat(e.target.value) || 0 }))}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-accent p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">{formatCurrency(formData.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Desconto:</span>
              <span className="font-medium">
                {formData.desconto > 0 ? `-${formatCurrency(formData.desconto)}` : '-'}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
              <span>Total:</span>
              <span>{formatCurrency(formData.total)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h3 className="font-semibold">Métodos de pagamento</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['pix', 'crédito', 'débito', 'dinheiro', 'transferência', 'boleto', 'cheque'].map((method) => (
                <Button
                  key={method}
                  type="button"
                  variant={formData.metodosPagemento.includes(method) ? 'default' : 'outline'}
                  onClick={() => togglePaymentMethod(method)}
                  className="capitalize"
                >
                  {method}
                </Button>
              ))}
            </div>
          </div>

          {/* Contract Conditions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Condições de contrato</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Ocultar</span>
                <Switch
                  checked={formData.ocultarCondicoes}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ocultarCondicoes: checked }))}
                />
              </div>
            </div>
            <RichTextEditor
              value={formData.condicoesContrato}
              onChange={(value) => setFormData(prev => ({ ...prev, condicoesContrato: value }))}
              placeholder="Descreva as condições do contrato..."
            />
          </div>

          {/* Observations */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Observações</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Ocultar</span>
                <Switch
                  checked={formData.ocultarObservacoes}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ocultarObservacoes: checked }))}
                />
              </div>
            </div>
            <RichTextEditor
              value={formData.observacoes}
              onChange={(value) => setFormData(prev => ({ ...prev, observacoes: value }))}
              placeholder="Adicione observações..."
            />
          </div>
        </div>
      </div>

      {/* Fixed Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={handleSubmit}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrcamentoForm;
