import {useState, useCallback} from 'react';
import {Autocomplete, TextField, CircularProgress} from '@mui/material';
import {getCities} from '../../api/catalog';
import {parseError} from '../../api/errors';

export default function CitySearch({value, onChange, onError}) {
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
            const data = await getCities({search});
            setOptions(data.results);
        } catch (err) {
            onError(parseError(err));
        } finally {
            setLoading(false);
        }
    }, [onError]);

    return (
        <Autocomplete
            options={options}
            getOptionLabel={(option) => `${option.city}, ${option.country}`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={value}
            onChange={(_, newValue) => onChange(newValue)}
            inputValue={inputValue}
            onInputChange={(_, newInput) => {
                setInputValue(newInput);
                fetchCities(newInput);
            }}
            loading={loading}
            filterOptions={(x) => x}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="City"
                    placeholder="Start typing..."
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress size={20}/> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
}