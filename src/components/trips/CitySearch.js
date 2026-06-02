import { useState, useCallback } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { getCities } from '../../api/catalog';
import { parseError } from '../../api/errors';

export default function CitySearch({ value, onChange, onError }) {
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCities = useCallback(async (search) => {
        if (search.length < 2) {
            setOptions([]);
            return;
        }
        setLoading(true);
        try {
            const data = await getCities({ search });
            if (data && Array.isArray(data.results)) {
                setOptions(data.results);
            } else if (data && Array.isArray(data)) {
                setOptions(data);
            } else {
                setOptions([]);
            }
        } catch (err) {
            if (onError) {
                onError(parseError(err));
            }
            setOptions([]);
        } finally {
            setLoading(false);
        }
    }, [onError]);

    return (
        <Autocomplete
            options={options}
            getOptionLabel={(option) => {
                if (option) {
                    return `${option.name || option.city}, ${option.country}`;
                }
                return '';
            }}
            isOptionEqualToValue={(option, val) => {
                if (!option || !val) return false;
                return option.id === val.id;
            }}
            value={value || null}
            onChange={(_, newValue) => onChange && onChange(newValue)}
            inputValue={inputValue}
            onInputChange={(_, newInput) => {
                setInputValue(newInput || '');
                fetchCities(newInput || '');
            }}
            loading={loading}
            filterOptions={(x) => x || []}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search city"
                    placeholder="Start typing city name..."
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
}