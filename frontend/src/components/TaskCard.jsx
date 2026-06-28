import { useState } from 'react';
import {
  Box, Text, HStack, IconButton, Badge, Tooltip,
} from '@chakra-ui/react';
import { FiTrash2, FiEdit2, FiFlag, FiMove, FiCheck } from 'react-icons/fi';
import { BsPin, BsPinFill } from 'react-icons/bs';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const colorMap = {
  default: '#2a2a3e',
  red: '#4a1a1a', orange: '#4a2e1a', yellow: '#4a3e1a',
  green: '#1a3a1a', teal: '#1a3a3a', blue: '#1a2a4a',
  purple: '#2e1a4a', pink: '#4a1a3a', brown: '#3a2e1a', gray: '#2e2e3e',
};

const statusBadge = { pending: 'gray', dropped: 'gray', 'in-progress': 'blue', done: 'green' };
const nextStatus = { pending: 'in-progress', dropped: 'in-progress', 'in-progress': 'done', done: 'dropped' };
const priorityColor = { low: 'green.400', medium: 'orange.300', high: 'red.400' };

export default function TaskCard({ task, onEdit, onDelete, onTogglePin, onStatusChange, onPriorityChange, onSelect }) {
  const [hover, setHover] = useState(false);
  const isDone = task.status === 'done';

  const {
    attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'box-shadow 0.2s ease',
    opacity: isDragging ? 0.4 : isDone ? 0.65 : undefined,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      position="relative"
      bg={colorMap[task.color] || colorMap.default}
      shadow={hover ? '0 8px 30px rgba(0,0,0,0.35)' : '0 2px 8px rgba(0,0,0,0.2)'}
      borderBottomRadius="xl"
      border="1px solid"
      borderColor={isDone ? 'rgba(72, 187, 120, 0.3)' : 'rgba(255,255,255,0.06)'}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      _hover={{ transform: 'scale(1.02)' }}
      breakinside="avoid"
      {...attributes}
    >
      <Box
        h="5px"
        bg={isDone ? 'green.500' : (priorityColor[task.priority] || 'transparent')}

      />
      <Box p={4} pb={10} cursor="pointer" onClick={() => onSelect(task)}>
        <HStack justify="space-between" align="start">
          <Text
            fontWeight="600"
            fontSize="md"
            noOfLines={2}
            flex={1}
            color={isDone ? 'gray.500' : 'gray.100'}
            textDecoration={isDone ? 'line-through' : undefined}
          >
            {task.title}
          </Text>
          <HStack spacing={1}>
            <Box
              ref={setActivatorNodeRef}
              {...listeners}
              opacity={hover ? 1 : 0.3}
              transition="opacity 0.12s"
              cursor="grab"
              display="flex"
              alignItems="center"
              _active={{ cursor: 'grabbing' }}
            >
              <FiMove size="14px" color="#6b7280" />
            </Box>
            <Tooltip label={task.pinned ? 'Unpin' : 'Pin'}>
              <IconButton
                icon={task.pinned ? <BsPinFill /> : <BsPin />}
                size="xs"
                variant="ghost"
                color={task.pinned ? '#facc15' : 'gray.500'}
                opacity={hover ? 1 : 0}
                transition="opacity 0.12s"
                onClick={(e) => { e.stopPropagation(); onTogglePin(task); }}
                aria-label="Pin"
                _hover={{ bg: 'rgba(255,255,255,0.08)' }}
                rounded="md"
              />
            </Tooltip>
          </HStack>
        </HStack>
        {task.description && (
          <Text
            fontSize="sm"
            color={isDone ? 'gray.600' : 'gray.400'}
            noOfLines={3}
            mt={1.5}
            textDecoration={isDone ? 'line-through' : undefined}
          >
            {task.description}
          </Text>
        )}
      </Box>

      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        px={2.5}
        pb={2}
        pt={1.5}
        opacity={hover ? 1 : 0}
        pointerEvents={hover ? 'auto' : 'none'}
        transition="opacity 0.15s"
      >
        <HStack justify="space-between" spacing={1}>
          <HStack spacing={1.5}>
            <Badge
              colorScheme={statusBadge[task.status]}
              fontSize="10px"
              cursor="pointer"
              rounded="full"
              px={2.5}
              py={0.5}
              onClick={() => onStatusChange(task, nextStatus[task.status])}
              _hover={{ opacity: 0.8 }}
              title="Click to change status"
            >{task.status}</Badge>
            <Badge
              fontSize="10px"
              cursor="pointer"
              variant="outline"
              rounded="full"
              px={2.5}
              py={0.5}
              colorScheme={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'green'}
              onClick={() => onPriorityChange(task, task.priority === 'low' ? 'medium' : task.priority === 'medium' ? 'high' : 'low')}
              _hover={{ opacity: 0.8 }}
              title="Click to change priority"
            >
              <HStack spacing="2px">
                <FiFlag size="10px" />
                <span>{task.priority}</span>
              </HStack>
            </Badge>
          </HStack>

          <HStack spacing={0.5}>
            <Tooltip label="Edit">
              <IconButton
                icon={<FiEdit2 size="13px" />}
                size="xs"
                variant="ghost"
                color="gray.400"
                rounded="full"
                _hover={{ bg: 'rgba(255,255,255,0.08)', color: 'gray.200' }}
                onClick={() => onEdit(task)}
                aria-label="Edit"
              />
            </Tooltip>
            <Tooltip label="Delete">
              <IconButton
                icon={<FiTrash2 size="13px" />}
                size="xs"
                variant="ghost"
                color="gray.400"
                rounded="full"
                _hover={{ bg: 'rgba(255,255,255,0.08)', color: 'red.400' }}
                onClick={() => onDelete(task._id)}
                aria-label="Delete"
              />
            </Tooltip>
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
}
