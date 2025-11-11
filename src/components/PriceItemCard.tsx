import { useState, useEffect } from 'react';
import { OrcamentoItem } from '@/types/orcamento';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { X, GripVertical } from 'lucide-react';
import { calculateItemTotal, formatCurrency } from '@/utils/calculations';

interface PriceItemCardProps {
  item: OrcamentoItem;
  onChange: (item: OrcamentoItem) => void;
  onRemove: () => void;
}

export const PriceItemCard = ({ item, onChange, onRemove }: PriceItemCardProps) => {
  const [localItem, setLocalItem] = useState(item);

  useEffect(() => {
    const total = calculateItemTotal(localItem);
    const updatedItem = { ...localItem, total };
    setLocalItem(updatedItem);
    onChange(updatedItem);
  }, [localItem.quantidade, localItem.precoUnitario, localItem.desconto]);

  const updateField = (field: keyof OrcamentoItem, value: any) => {
    setLocalItem(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <Input
          placeholder="Nome do item"
          value={localItem.nome}
          onChange={(e) => updateField('nome', e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select value={localItem.tipo} onValueChange={(value) => updateField('tipo', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="serviço">Serviço</SelectItem>
            <SelectItem value="produto">Produto</SelectItem>
            <SelectItem value="hora">Hora</SelectItem>
            <SelectItem value="unidade">Unidade</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Quantidade"
          value={localItem.quantidade || ''}
          onChange={(e) => updateField('quantidade', parseFloat(e.target.value) || 0)}
          min="0"
          step="0.01"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Preço unitário</label>
          <Input
            type="number"
            placeholder="0,00"
            value={localItem.precoUnitario || ''}
            onChange={(e) => updateField('precoUnitario', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Desconto (R$)</label>
          <Input
            type="number"
            placeholder="0,00"
            value={localItem.desconto || ''}
            onChange={(e) => updateField('desconto', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="pt-2 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Valor do item:</span>
          <span className="text-lg font-semibold text-foreground">
            {formatCurrency(localItem.total)}
          </span>
        </div>
      </div>
    </div>
  );
};
