import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup, Paper } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const COLOR_ACTIVITY = '#4A90D9';
const COLOR_TRANSPORT = '#E8A838';
const COLOR_ACCOMMODATION = '#5BAD6F';

const LABEL = {
    activity: 'Activity',
    transport: 'Transport',
    accommodation: 'Accommodation',
};

export default function CalendarPanel({ trip }) {
    const calendarRef = useRef(null);
    const containerRef = useRef(null);
    const [view, setView] = useState('dayGridMonth');
    const [tooltip, setTooltip] = useState(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new ResizeObserver(() => {
            requestAnimationFrame(() => {
                calendarRef.current?.getApi().updateSize();
            });
        });
        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    const events = useMemo(() => {
        if (!trip) return [];
        const result = [];

        (trip.activities || []).forEach((a) => {
            result.push({
                id: `activity-${a.id}`,
                title: a.activity_title || 'Activity',
                start: `${a.scheduled_date}T${a.start_time}`,
                end: `${a.scheduled_date}T${a.end_time}`,
                color: COLOR_ACTIVITY,
                extendedProps: {
                    type: 'activity',
                    fullTitle: a.activity_title || 'Activity',
                    time: `${a.start_time.slice(0, 5)} – ${a.end_time.slice(0, 5)}`,
                },
            });
        });

        (trip.transport || []).forEach((t) => {
            const start = new Date(t.departure_datetime);
            const end = new Date(t.arrival_datetime);
            const fmt = (d) => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            result.push({
                id: `transport-${t.id}`,
                title: `✈ ${t.departure_point} → ${t.arrival_point}`,
                start: t.departure_datetime,
                end: t.arrival_datetime,
                color: COLOR_TRANSPORT,
                extendedProps: {
                    type: 'transport',
                    fullTitle: `${t.departure_point} → ${t.arrival_point}`,
                    time: `${fmt(start)} – ${fmt(end)}`,
                },
            });
        });

        (trip.accommodation || []).forEach((a) => {
            // FullCalendar treats allDay `end` as exclusive, so we add 1 day
            // to make check_out_date display as inclusive on the calendar.
            const checkOutExclusive = new Date(a.check_out_date);
            checkOutExclusive.setDate(checkOutExclusive.getDate() + 1);
            const checkOutStr = checkOutExclusive.toISOString().slice(0, 10);

            result.push({
                id: `accommodation-${a.id}`,
                title: `🏨 ${a.accommodation_name}`,
                start: a.check_in_date,
                end: checkOutStr,
                color: COLOR_ACCOMMODATION,
                allDay: true,
                extendedProps: {
                    type: 'accommodation',
                    fullTitle: a.accommodation_name,
                    time: `${a.check_in_date} – ${a.check_out_date}`,
                },
            });
        });

        return result;
    }, [trip]);

    function handleViewChange(_, newView) {
        if (!newView) return;
        setView(newView);
        calendarRef.current?.getApi().changeView(newView);
    }

    function handleEventMouseEnter(info) {
        const rect = info.el.getBoundingClientRect();
        setTooltip({
            top: rect.top - 8,
            left: rect.left + rect.width / 2,
            fullTitle: info.event.extendedProps.fullTitle,
            time: info.event.extendedProps.time,
            type: info.event.extendedProps.type,
        });
    }

    function handleEventMouseLeave() {
        setTooltip(null);
    }

    return (
        <Box
            ref={containerRef}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 2,
                '& .fc': { fontFamily: 'inherit', fontSize: '0.8rem' },
                '& .fc-toolbar-title': { fontSize: '1rem', fontWeight: 600 },
                '& .fc-toolbar-chunk': { display: 'flex', alignItems: 'center', gap: '4px' },
                '& .fc-button-group .fc-button': { borderRadius: '4px !important' },
                '& .fc-daygrid-event': { borderRadius: '4px', padding: '1px 4px' },
                '& .fc-event-title': {
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <LegendItem color={COLOR_ACTIVITY} label="Activities" />
                    <LegendItem color={COLOR_TRANSPORT} label="Transport" />
                    <LegendItem color={COLOR_ACCOMMODATION} label="Accommodation" />
                </Box>
                <ToggleButtonGroup value={view} exclusive onChange={handleViewChange} size="small">
                    <ToggleButton value="dayGridMonth">Month</ToggleButton>
                    <ToggleButton value="dayGridWeek">Week</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                initialDate={trip?.start_date || undefined}
                events={events}
                eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                dayMaxEvents={3}
                headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
                height="auto"
                eventMouseEnter={handleEventMouseEnter}
                eventMouseLeave={handleEventMouseLeave}
            />

            {tooltip && (
                <Paper
                    elevation={3}
                    sx={{
                        position: 'fixed',
                        top: tooltip.top,
                        left: tooltip.left,
                        transform: 'translate(-50%, -100%)',
                        px: 1.5,
                        py: 1,
                        maxWidth: 260,
                        zIndex: 1300,
                        pointerEvents: 'none',
                    }}
                >
                    <Typography variant="caption" color="text.secondary" display="block">
                        {LABEL[tooltip.type]}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                        {tooltip.fullTitle}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {tooltip.time}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}

function LegendItem({ color, label }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '2px', backgroundColor: color, flexShrink: 0 }} />
            <Typography variant="caption" color="text.secondary">{label}</Typography>
        </Box>
    );
}