import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormGroupProps,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

export type CheckboxOptionValue = string | number;

export interface CheckboxOption {
  label: string;
  value: CheckboxOptionValue;
}

interface CheckboxListProps extends Omit<FormGroupProps, 'onChange'> {
  values: CheckboxOptionValue[] | null;
  options: CheckboxOption[];
  onChange?: (values: CheckboxOptionValue[] | null) => any;
}

export const CheckboxList: React.FC<CheckboxListProps> = ({
  options = [],
  onChange,
  values,
  sx,
  ...rest
}) => {
  const [checkValues, setCheckValues] = useState<CheckboxOptionValue[] | null>(
    values
  );
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (checked: boolean, value: CheckboxOption['value']) => {
    if (checkValues === null && checked) {
      setCheckValues([value]);
    } else if (checkValues !== null && checked) {
      setCheckValues([...checkValues, value]);
    } else if (checkValues !== null && !checked) {
      const newValues = checkValues.filter((v) => v !== value);
      if (newValues.length > 0) {
        setCheckValues(newValues);
      } else {
        setCheckValues(null);
      }
    }
  };

  useEffect(() => {
    if (onChange && checkValues?.length !== values?.length) {
      onChange(checkValues);
    }
  }, [checkValues]);

  useEffect(() => {
    setCheckValues(values);
  }, [values]);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <Box>
      {/* Search field */}
      <TextField
        size="small"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClearSearch} edge="end">
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          width: '100%',
          mb: 1,
        }}
      />

      {/* Scrollable checkbox list */}
      <Box
        sx={{
          maxHeight: '300px',
          overflowY: 'auto',
          pr: 1,
        }}
      >
        <FormGroup
          sx={{
            display: 'inline-flex',
            ...sx,
          }}
          {...rest}
        >
          {filteredOptions.map((option, i) => (
            <FormControlLabel
              key={`${option}-${i}`}
              label={option.label}
              control={
                <Checkbox
                  checked={
                    !!checkValues && checkValues.indexOf(option.value) > -1
                  }
                  value={option.value}
                  onChange={(e, checked) => handleChange(checked, option.value)}
                  sx={{
                    pr: 1,
                    pl: 1,
                    pb: 0,
                    pt: 0,
                  }}
                />
              }
              sx={{
                '&:not(:last-child)': {
                  mb: 1,
                },
              }}
            />
          ))}
        </FormGroup>
      </Box>
    </Box>
  );
};
