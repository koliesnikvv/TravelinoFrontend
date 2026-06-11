import { useState, useEffect, useRef, useCallback } from 'react';
import { Box } from '@mui/material';

const CALENDAR_MIN_WIDTH = 300;
const CALENDAR_MAX_WIDTH = 900;
const CALENDAR_DEFAULT_WIDTH = 420;

export default function CalendarResizePanel({ children }) {
    const [width, setWidth] = useState(CALENDAR_DEFAULT_WIDTH);
    const dragState = useRef(null);

    const onMouseDown = useCallback((e) => {
        dragState.current = { startX: e.clientX, startWidth: width };
        e.preventDefault();
    }, [width]);

    useEffect(() => {
        function onMouseMove(e) {
            if (!dragState.current) return;
            const delta = dragState.current.startX - e.clientX;
            const next = Math.min(CALENDAR_MAX_WIDTH, Math.max(CALENDAR_MIN_WIDTH, dragState.current.startWidth + delta));
            setWidth(next);
        }
        function onMouseUp() {
            dragState.current = null;
        }
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    return (
        <Box sx={{ flexShrink: 0, position: 'relative', width }}>
            <Box
                onMouseDown={onMouseDown}
                sx={{
                    position: 'absolute',
                    left: -4,
                    top: 0,
                    bottom: 0,
                    width: 8,
                    cursor: 'ew-resize',
                    zIndex: 1,
                    borderRadius: 1,
                    '&:hover': { backgroundColor: 'primary.main', opacity: 0.3 },
                }}
            />
            {children}
        </Box>
    );
}