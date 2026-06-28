import { useState, useEffect, useRef } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
  Input, Textarea, HStack, Box, IconButton, Badge, Tooltip,
} from '@chakra-ui/react';
import { FiTrash2, FiFlag, FiCheck } from 'react-icons/fi';
import { BsPin, BsPinFill } from 'react-icons/bs';

const colorMap = {
  default: '#2a2a3e',
  red: '#4a1a1a', orange: '#4a2e1a', yellow: '#4a3e1a',
  green: '#1a3a1a', teal: '#1a3a3a', blue: '#1a2a4a',
  purple: '#2e1a4a', pink: '#4a1a3a', brown: '#3a2e1a', gray: '#2e2e3e',
};

const statusBadge = { pending: 'gray', dropped: 'gray', 'in-progress': 'blue', done: 'green' };
const nextStatus = { pending: 'in-progress', dropped: 'in-progress', 'in-progress': 'done', done: 'dropped' };

const PALETTE = [
  'default', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'pink', 'brown', 'gray',
];

const darkSwatches = {
  default: '#3c3f50', red: '#5c2b2b', orange: '#5c3b1e', yellow: '#5c4a1e',
  green: '#1e4a2b', teal: '#1e4a3a', blue: '#1e3a5c',
  purple: '#3b1e5c', pink: '#5c1e3b', brown: '#3b2b1e', gray: '#3c3f43',
};

export default function TaskDetailModal({ task, isOpen, onClose, onEdit, onDelete, onTogglePin, onChangeColor, onStatusChange, onPriorityChange }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const titleRef = useRef(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
    }
  }, [task]);

  useEffect(() => {
    if (isOpen && titleRef.current) {
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (!task) return;
    const updates = {};
    if (title.trim() !== task.title) updates.title = title.trim();
    if (description.trim() !== (task.description || '')) updates.description = description.trim();
    if (Object.keys(updates).length > 0) onEdit(task._id, updates);
    onClose();
  };

  const isDefault = task && task.color === 'default';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered motionPreset="scale">
      <ModalOverlay bg="rgba(0,0,0,0.6)" backdropFilter="blur(4px)" />
      <ModalContent
        bg={task ? (isDefault ? '#2a2a3e' : colorMap[task.color]) : '#2a2a3e'}
        border="1px solid"
        borderColor="rgba(255,255,255,0.08)"
        rounded="xl"
        overflow="hidden"
      >
        <Box h="5px" bg={task ? (statusBadge[task.status] === 'green' ? '#48bb78' : statusBadge[task.status] === 'blue' ? '#4299e1' : '#718096') : 'transparent'} />
        <ModalCloseButton
          color="whiteAlpha.700"
          bg="rgba(0,0,0,0.3)"
          _hover={{ bg: 'rgba(0,0,0,0.5)', color: 'white' }}
          rounded="full"
          top={3}
          right={3}
        />
        <ModalBody p={5}>
          <Input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="unstyled"
            fontWeight="600"
            fontSize="xl"
            color="gray.100"
            placeholder="Title"
            mb={3}
            _placeholder={{ color: 'gray.500' }}
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="unstyled"
            fontSize="sm"
            color="gray.300"
            placeholder="Take a note..."
            resize="none"
            _placeholder={{ color: 'gray.500' }}
          />

          <HStack justify="space-between" mt={5}>
            <HStack spacing={1.5}>
              {PALETTE.map((c) => (
                <Tooltip key={c} label={c} fontSize="xs">
                  <Box
                    w="26px" h="26px"
                    rounded="full"
                    cursor="pointer"
                    position="relative"
                    bg={darkSwatches[c]}
                    onClick={() => onChangeColor(task, c)}
                    _hover={{ transform: 'scale(1.15)' }}
                    transition="all 0.12s"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    outline={task && task.color === c ? '2px solid' : 'none'}
                    outlineColor={task && task.color === c ? '#6366f1' : undefined}
                    outlineOffset="2px"
                  >
                    {task && task.color === c && <FiCheck size="11px" color="white" />}
                  </Box>
                </Tooltip>
              ))}
            </HStack>
          </HStack>

          <HStack justify="space-between" mt={4} pt={3} borderTop="1px solid" borderColor="rgba(255,255,255,0.06)">
            <HStack spacing={2}>
              <Badge
                colorScheme={statusBadge[task?.status] || 'gray'}
                fontSize="11px"
                px={3}
                py={1}
                cursor="pointer"
                rounded="full"
                onClick={() => onStatusChange(task, nextStatus[task?.status])}
                _hover={{ opacity: 0.8 }}
              >
                {task?.status || 'dropped'}
              </Badge>
              <Badge
                fontSize="11px"
                px={3}
                py={1}
                cursor="pointer"
                variant="outline"
                rounded="full"
                colorScheme={task?.priority === 'high' ? 'red' : task?.priority === 'medium' ? 'orange' : 'green'}
                onClick={() => onPriorityChange(task, task?.priority === 'low' ? 'medium' : task?.priority === 'medium' ? 'high' : 'low')}
                _hover={{ opacity: 0.8 }}
              >
                <HStack spacing="3px">
                  <FiFlag size="11px" />
                  <span>{task?.priority || 'medium'}</span>
                </HStack>
              </Badge>

              <Tooltip label={task?.pinned ? 'Unpin' : 'Pin'}>
                <IconButton
                  icon={task?.pinned ? <BsPinFill /> : <BsPin />}
                  size="sm"
                  variant="ghost"
                  color={task?.pinned ? '#facc15' : 'gray.500'}
                  rounded="full"
                  _hover={{ bg: 'rgba(255,255,255,0.08)' }}
                  onClick={() => onTogglePin(task)}
                  aria-label="Pin"
                />
              </Tooltip>

              <Tooltip label="Delete">
                <IconButton
                  icon={<FiTrash2 size="15px" />}
                  size="sm"
                  variant="ghost"
                  color="gray.400"
                  rounded="full"
                  _hover={{ bg: 'rgba(255,255,255,0.08)', color: 'red.400' }}
                  onClick={() => { onDelete(task._id); onClose(); }}
                  aria-label="Delete"
                />
              </Tooltip>
            </HStack>

          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
