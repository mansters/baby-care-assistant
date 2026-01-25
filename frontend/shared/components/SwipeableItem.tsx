'use client';

import { useState, ReactNode } from 'react';
import {
    LeadingActions,
    SwipeableList,
    SwipeableListItem,
    SwipeAction,
    TrailingActions,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import { Box } from '@mui/material';

export type SwipeDirection = 'none' | 'left' | 'right';

interface SwipeableItemProps {
    /**
     * The unique ID of the item (for key purposes if needed, though usually handled by parent list)
     */
    itemId?: string;
    /**
     * Function to call when leading action (e.g. Edit) is triggered
     */
    onEdit?: () => void;
    /**
     * Function to call when trailing action (e.g. Delete) is triggered
     */
    onDelete?: () => void;
    /**
     * Text label for the Edit action. Defaults to "Edit".
     */
    editLabel?: string;
    /**
     * Text label for the Delete action. Defaults to "Delete".
     */
    deleteLabel?: string;
    /**
     * Children can be a ReactNode or a function that receives the current swipe direction.
     * This allows children (like Cards) to adjust their border radius dynamically.
     */
    children: ReactNode | ((swipeDirection: SwipeDirection) => ReactNode);
}

export default function SwipeableItem({
    onEdit,
    onDelete,
    editLabel = 'Edit',
    deleteLabel = 'Delete',
    children,
}: SwipeableItemProps) {
    const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>('none');

    const handleSwipeStart = (dragDirection: string) => {
        const dir = dragDirection.toLowerCase();
        if (dir === 'left' || dir === 'right') {
            setSwipeDirection(dir as SwipeDirection);
        }
    };

    const handleSwipeEnd = () => {
        setSwipeDirection('none');
    };

    const leadingActions = () => (
        <LeadingActions>
            {onEdit && (
                <SwipeAction onClick={() => onEdit()}>
                    <Box
                        sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 80,
                            height: '100%',
                            borderTopLeftRadius: '8px',
                            borderBottomLeftRadius: '8px',
                        }}
                    >
                        {editLabel}
                    </Box>
                </SwipeAction>
            )}
        </LeadingActions>
    );

    const trailingActions = () => (
        <TrailingActions>
            {onDelete && (
                <SwipeAction
                    destructive={true}
                    onClick={() => onDelete()}
                >
                    <Box
                        sx={{
                            backgroundColor: 'error.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 80,
                            borderTopRightRadius: 8,
                            borderBottomRightRadius: 8,
                        }}
                    >
                        {deleteLabel}
                    </Box>
                </SwipeAction>
            )}
        </TrailingActions>
    );

    return (
        <Box sx={{ position: 'relative' }}>
            <SwipeableList fullSwipe={false} threshold={0.5} style={{ backgroundColor: 'transparent' }}>
                <SwipeableListItem
                    leadingActions={onEdit ? leadingActions() : undefined}
                    trailingActions={onDelete ? trailingActions() : undefined}
                    onSwipeStart={handleSwipeStart}
                    onSwipeEnd={handleSwipeEnd}
                >
                    <Box sx={{ width: '100%' }}>
                        {typeof children === 'function' ? children(swipeDirection) : children}
                    </Box>
                </SwipeableListItem>
            </SwipeableList>
        </Box>
    );
}
