import { OrcamentoStatus } from '@/types/orcamento';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: OrcamentoStatus;
  onClick?: () => void;
  className?: string;
}

const statusConfig = {
  em_aberto: {
    label: 'Em aberto',
    className: 'bg-status-open text-foreground',
  },
  aprovado: {
    label: 'Aprovado',
    className: 'bg-status-approved text-white',
  },
  recusado: {
    label: 'Recusado',
    className: 'bg-status-rejected text-white',
  },
  em_analise: {
    label: 'Em análise',
    className: 'bg-status-analysis text-white',
  },
  cancelado: {
    label: 'Cancelado',
    className: 'bg-status-canceled text-white',
  },
};

export const StatusBadge = ({ status, onClick, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all',
        config.className,
        onClick && 'cursor-pointer hover:opacity-80',
        className
      )}
      onClick={onClick}
    >
      {config.label}
    </span>
  );
};
