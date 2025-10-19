import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { type ChangeEvent, useState } from 'react';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row' as const,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        margin: '10px',
    },
    button: {
        backgroundColor: '#ee1515',
        color: 'white',
        margin: '0px 5px',
        textTransform: 'none' as const,
    },
};

type Props = {
    onInputSubmit: (value: string) => void;
};

export default function Input(props: Props) {
    const [value, setValue] = useState('');

    const onInput = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setValue(event.target.value);
    };

    const onSubmit = () => {
        if (value.length > 0) props.onInputSubmit(value.toLowerCase());
    };

    return (
        <div style={styles.container}>
            <TextField
                // id="outlined-full-width"
                label='Name or Number'
                style={styles.input}
                placeholder='Charmander'
                // helperText="Type a name or entry number"
                margin='normal'
                variant='outlined'
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={onInput}
                value={value}
                onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                        ev.preventDefault();
                        onSubmit();
                    }
                }}
            />
            <Button
                variant='outlined'
                style={styles.button}
                onClick={onSubmit}>
                Submit
            </Button>
        </div>
    );
}
