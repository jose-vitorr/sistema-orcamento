import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import InputMask from 'react-input-mask';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getEmpresaConfig, saveEmpresaConfig } from '@/utils/empresaStorage';
import { useToast } from '@/hooks/use-toast';

export default function EmpresaConfig() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState(() => getEmpresaConfig());
  const [logoPreview, setLogoPreview] = useState(formData.logo);

  useEffect(() => {
    setLogoPreview(formData.logo);
  }, [formData.logo]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpe?g|svg\+xml)$/)) {
      toast({
        title: 'Formato inválido',
        description: 'Por favor, selecione uma imagem PNG, JPG ou SVG',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setLogoPreview(base64);
      setFormData(prev => ({ ...prev, logo: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Por favor, preencha o nome da empresa',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.email.trim()) {
      toast({
        title: 'Email obrigatório',
        description: 'Por favor, preencha o email da empresa',
        variant: 'destructive',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Email inválido',
        description: 'Por favor, insira um email válido',
        variant: 'destructive',
      });
      return;
    }

    saveEmpresaConfig(formData);
    toast({
      title: 'Configurações salvas',
      description: 'Os dados da empresa foram atualizados com sucesso',
    });
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Editar Empresa</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {/* Logo Section */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6">
                <Label className="text-base font-semibold mb-4 block">Logo da Empresa</Label>
                
                <div className="aspect-square w-full max-w-[200px] mx-auto mb-3 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-primary-foreground font-bold text-lg">LOGO TIPO</span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground text-center mb-4">
                  Salve a edição para visualizar a imagem
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                />

                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Carregar logo
                </Button>
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                {/* Nome da empresa */}
                <div>
                  <Label htmlFor="nome" className="text-sm font-medium">
                    Nome da empresa <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nome"
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    className="mt-1.5"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1.5"
                    required
                  />
                </div>

                {/* CNPJ/CPF */}
                <div>
                  <Label htmlFor="cnpjCpf" className="text-sm font-medium">
                    CNPJ/CPF
                  </Label>
                  <InputMask
                    mask={formData.cnpjCpf.replace(/\D/g, '').length <= 11 ? '999.999.999-99' : '99.999.999/9999-99'}
                    value={formData.cnpjCpf}
                    onChange={(e) => setFormData(prev => ({ ...prev, cnpjCpf: e.target.value }))}
                  >
                    {(inputProps: any) => (
                      <Input {...inputProps} id="cnpjCpf" type="text" className="mt-1.5" />
                    )}
                  </InputMask>
                </div>

                {/* Telefone 1 */}
                <div>
                  <Label htmlFor="telefone1" className="text-sm font-medium">
                    Telefone 1
                  </Label>
                  <InputMask
                    mask="(99) 99999-9999"
                    value={formData.telefone1}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefone1: e.target.value }))}
                  >
                    {(inputProps: any) => (
                      <Input {...inputProps} id="telefone1" type="tel" className="mt-1.5" />
                    )}
                  </InputMask>
                </div>

                {/* Telefone 2 */}
                <div>
                  <Label htmlFor="telefone2" className="text-sm font-medium">
                    Telefone 2
                  </Label>
                  <InputMask
                    mask="(99) 99999-9999"
                    value={formData.telefone2}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefone2: e.target.value }))}
                  >
                    {(inputProps: any) => (
                      <Input {...inputProps} id="telefone2" type="tel" className="mt-1.5" />
                    )}
                  </InputMask>
                </div>

                {/* Endereço */}
                <div>
                  <Label htmlFor="endereco" className="text-sm font-medium">
                    Endereço
                  </Label>
                  <Input
                    id="endereco"
                    type="text"
                    value={formData.endereco}
                    onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>

                {/* Atividades */}
                <div>
                  <Label htmlFor="atividades" className="text-sm font-medium">
                    Atividades da empresa
                  </Label>
                  <div className="relative mt-1.5">
                    <Textarea
                      id="atividades"
                      value={formData.atividades}
                      onChange={(e) => setFormData(prev => ({ ...prev, atividades: e.target.value }))}
                      placeholder="Pesquisar atividades"
                      className="min-h-[100px] pr-10"
                    />
                    {formData.atividades && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => setFormData(prev => ({ ...prev, atividades: '' }))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer Button */}
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
            <div className="container mx-auto">
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold"
              >
                Salvar
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
