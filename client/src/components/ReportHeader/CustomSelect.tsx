import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { getComboOptions } from '../../api/reportParams';

type CustomSelectProps = {
    comboSql: string;
    name: string;
    onChange: (value: any) => void;
};

const CustomSelect: React.FC<CustomSelectProps> = ({ comboSql, name, onChange }) => {
    const [loading, setLoading] = useState(true);
    const [options, setOptions] = useState([]);
    const [authToken] = useLocalStorage('AUTH_TOKEN', undefined);

    useEffect(() => {
        (async () => {
            if (authToken) {
                const opts = await getComboOptions(authToken, comboSql);
                setOptions(opts.map((o: any) => ({ label: o[name], value: o[name] })));
                setLoading(false);
            }
        })();
    }, []);

    return <Select onChange={onChange} options={options} loading={loading}></Select>;
};

export default CustomSelect;
