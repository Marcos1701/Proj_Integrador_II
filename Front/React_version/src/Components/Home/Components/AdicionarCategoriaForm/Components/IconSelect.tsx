import { useState } from 'react';
import './IconSelect.css';

interface OptionType {
    value: string;
    icon: string;
    label?: string;
}

const options: OptionType[] = [
    { value: 'barraquinha', label: 'Barraquinha', icon: '/assets/icons/barraquinha.svg' },
    { value: 'Airplane', label: 'Avião', icon: '/assets/icons/Airplane.svg' },
    { value: 'barcode_scanner', icon: '/assets/icons/barcode_scanner.svg', label: 'Codigo de barras' },
    { value: 'car-vehicle', label: 'Carro', icon: '/assets/icons/car-vehicle.svg' },
    { value: 'credit_card', label: 'Cartão de crédito', icon: '/assets/icons/credit_card.svg' },
    { value: 'dollar-bill', label: 'Dinheiro', icon: '/assets/icons/dollar-bill.svg' },
    { value: 'internet', label: 'Internet', icon: '/assets/icons/internet.svg' },
];

export const IconSelect = (
    { setIcone }: { setIcone: React.Dispatch<React.SetStateAction<string>> }
) => {
    const [value, setValue] = useState<OptionType>(options[0]);

    const handleChange = (value: OptionType) => {
        console.log(value);
        setValue(value);
        setIcone(value.value);
    };

    return (
        <div className="label-element-div" id='select-div'>
            <label className="label-icone" htmlFor="input-icone">Ícone</label>
            <div className="icon-select">
                <img src={value.icon} alt={value.value} />
                <select value={value.value} onChange={(e) => handleChange(options.find(option => option.value === e.target.value) as OptionType)}>
                    {options.map((option) => (
                        <option key={option.value} value={option.value} >
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );

};