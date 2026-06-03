import { ArrowLeft } from "lucide-react";

type Props = {
    onBack: () => void;
    disabled?: boolean;
}

function BackButton({ onBack, disabled = false }: Props) {
    return (
        <button
            className="backButton"
            type="button"
            onClick={onBack}
            disabled={disabled}
            aria-label="Voltar para a tela anterior"
        >
            <ArrowLeft size={18} strokeWidth={2.5} aria-hidden="true" />
            Voltar
        </button>
    );
}

export default BackButton;
