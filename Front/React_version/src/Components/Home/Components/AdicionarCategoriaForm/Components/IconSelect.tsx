import React from 'react';
import Select, { Props as SelectProps } from 'react-select';

interface OptionType {
    value: string;
    icon: string;
}

const options: OptionType[] = [
    { value: 'Airplane', icon: '/assets/icons/Airplane.svg' },
    { value: 'barcode_scanner', icon: '/assets/icons/barcode_scanner.svg' },
    { value: 'barraquinha', icon: '/assets/icons/barraquinha.svg' },
    { value: 'car-vehicle', icon: '/assets/icons/car-vehicle.svg' },
    { value: 'credit_card', icon: '/assets/icons/credit_card.svg' },
    { value: 'dollar-bill', icon: '/assets/icons/dollar-bill.svg' },
    { value: 'rede', icon: '/assets/icons/rede.svg' },
];

const CustomOption = ({ data, ...props }: any) => (
    <div>
        <img src={data.icon} alt={data.label} />
        <Select components={{ Option: CustomOption }} {...props} />
    </div>
);

const IconSelect = () => (
    <Select
        options={options}
        className='select-icon'
        id='input-icone'
        components={{
            Option: CustomOption,
        }}
        isSearchable={false}
    />
);


export default IconSelect;