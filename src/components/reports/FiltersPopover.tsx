import React, {FC} from 'react';
import {IconButton, InputLabel, MenuItem, Popover, Select, SelectChangeEvent, Tooltip} from "@mui/material";
import {MdFilterAlt} from "react-icons/md";

interface FiltersPopoverProps {
    initialFilter: string | 'all';
    onChange: (filter: string | 'all') => void;
    cities: string[];
}

const FiltersPopover: FC<FiltersPopoverProps> = ({initialFilter, onChange, cities}) => {
    const [filter, setFilter] = React.useState<string | 'all'>(initialFilter);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (e: SelectChangeEvent) => {
        setFilter(e.target.value);
        onChange(e.target.value);
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <Tooltip placement="top" title="Filters">
                <IconButton aria-describedby={id} onClick={handleClick}>
                    <MdFilterAlt/>
                </IconButton>
            </Tooltip>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                sx={{marginTop: '1rem'}}
            >
                <div className={'p-4 w-48 space-y-2'}>
                    <InputLabel id={'city-filter-label'}>City</InputLabel>
                    <Select
                        labelId={'city-filter-label'}
                        id='city-filter'
                        value={filter}
                        onChange={handleChange}
                        sx={{width: '100%'}}>
                        <MenuItem value='all'>All</MenuItem>
                        {cities.map((city) => (
                            <MenuItem key={city} value={city}>{city}</MenuItem>
                        ))}
                    </Select>
                </div>
            </Popover>
        </div>
    );
};

export default FiltersPopover;
