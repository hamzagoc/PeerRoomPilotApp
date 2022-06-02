import { useRef, useState } from 'react';

function useStateWithRef(initialValue) {
    const stateRef = useRef(initialValue);
    const [state, setState] = useState(initialValue);

    const setValue = (p) => {
        if (typeof p === 'function') {
            const value = p(stateRef.current);
            stateRef.current = value;
            setState(value);
            return;
        }
        stateRef.current = p;
        setState(p);
    };

    const getState = () => {
        return stateRef.current;
    }
    return [state, getState, setValue];
}

export default useStateWithRef;