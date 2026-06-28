import { useState, useRef, useEffect } from 'react';
import {
  Box, Input, Textarea, HStack, Button, useToast, Text,
} from '@chakra-ui/react';
import { FiCheck, FiX, FiFlag, FiPlus } from 'react-icons/fi';

const COLORS = [
  'default', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'pink', 'brown', 'gray',
];

const darkSwatches = {
  default: '#3c3f50', red: '#5c2b2b', orange: '#5c3b1e', yellow: '#5c4a1e',
  green: '#1e4a2b', teal: '#1e4a3a', blue: '#1e3a5c',
  purple: '#3b1e5c', pink: '#5c1e3b', brown: '#3b2b1e', gray: '#3c3f43',
};

export default function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [expanded, setExpanded] = useState(!!editingTask);
  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [color, setColor] = useState(editingTask?.color || 'default');
  const [priority, setPriority] = useState(editingTask?.priority || 'medium');
  const [titleError, setTitleError] = useState('');
  const toast = useToast();
  const inputRef = useRef(null);

  useEffect(() => {
    if (expanded && inputRef.current) inputRef.current.focus();
  }, [expanded]);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setColor(editingTask.color || 'default');
      setPriority(editingTask.priority || 'medium');
      setExpanded(true);
    }
  }, [editingTask]);

  const handleClose = () => {
    if (editingTask && onCancel) onCancel();
    setExpanded(false);
    setTitle('');
    setDescription('');
    setColor('default');
    setPriority('medium');
    setTitleError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    if (title.trim().length < 3) {
      setTitleError('Title must be at least 3 characters');
      return;
    }
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), color, priority });
      toast({ title: editingTask ? 'Note updated' : 'Note created', status: 'success', duration: 1500 });
      if (!editingTask) handleClose();
    } catch {
      toast({ title: 'Something went wrong', status: 'error', duration: 2000 });
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      bg={color === 'default' ? '#2a2a3e' : darkSwatches[color]}
      shadow="0 2px 12px rgba(0,0,0,0.2)"
      rounded="xl"
      border="1px solid"
      borderColor="rgba(255,255,255,0.06)"
      transition="all 0.15s"
      maxW="600px"
      mx="auto"
      _focusWithin={{ borderColor: 'rgba(99, 102, 241, 0.3)', shadow: '0 0 0 3px rgba(99, 102, 241, 0.1)' }}
    >
      {!expanded ? (
        <HStack px={4} py={3} spacing={3} cursor="text" onClick={() => setExpanded(true)}>
          <Box
            w="28px" h="28px"
            rounded="lg"
            bg="rgba(255,255,255,0.06)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            <FiPlus size="14px" color="#6b7280" />
          </Box>
          <Text color="gray.500" fontSize="md" userSelect="none">
            Take a note...
          </Text>
        </HStack>
      ) : (
        <Box p={4}>
          <Input
            ref={inputRef}
            placeholder="Title"
            variant="unstyled"
            fontWeight="600"
            fontSize="lg"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setTitleError(''); }}
            isInvalid={!!titleError}
            mb={2}
            color="gray.100"
            _placeholder={{ color: 'gray.500' }}
          />
          {titleError && (
            <Box fontSize="sm" color="red.400" mb={2}>{titleError}</Box>
          )}
          <Textarea
            placeholder="Take a note..."
            variant="unstyled"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            resize="none"
            fontSize="sm"
            color="gray.200"
            _placeholder={{ color: 'gray.500' }}
          />

          <HStack justify="space-between" mt={3}>
            <HStack spacing={1.5}>
              {COLORS.map((c) => (
                <Box
                  key={c}
                  w="26px" h="26px"
                  rounded="full"
                  cursor="pointer"
                  position="relative"
                  bg={darkSwatches[c]}
                  onClick={() => setColor(c)}
                  _hover={{ transform: 'scale(1.15)' }}
                  transition="all 0.12s"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  outline={color === c ? '2px solid' : 'none'}
                  outlineColor={color === c ? '#6366f1' : undefined}
                  outlineOffset="2px"
                >
                  {color === c && <FiCheck size="11px" color="white" />}
                </Box>
              ))}
            </HStack>
          </HStack>

          <HStack justify="space-between" mt={3}>
            <HStack spacing={2}>
              {['low', 'medium', 'high'].map((p) => (
                <Button
                  key={p}
                  size="xs"
                  leftIcon={<FiFlag size="11px" />}
                  variant={priority === p ? 'solid' : 'ghost'}
                  colorScheme={p === 'high' ? 'red' : p === 'medium' ? 'orange' : 'green'}
                  rounded="full"
                  px={3}
                  onClick={() => setPriority(p)}
                  _hover={priority !== p ? { bg: 'rgba(255,255,255,0.06)' } : undefined}
                >
                  {p}
                </Button>
              ))}
            </HStack>
            <HStack spacing={2}>
              {editingTask && (
                <Button size="sm" variant="ghost" leftIcon={<FiX />} onClick={onCancel} rounded="full" color="gray.400">
                  Cancel
                </Button>
              )}
              <Button
                size="sm"
                colorScheme="blue"
                type="submit"
                leftIcon={<FiCheck />}
                rounded="full"
                bg="linear-gradient(135deg, #6366f1, #8b5cf6)"
                _hover={{ bg: 'linear-gradient(135deg, #5558e6, #7c4fed)' }}
                _active={{ bg: 'linear-gradient(135deg, #4f52d9, #6d42e0)' }}
                px={5}
              >
                {editingTask ? 'Update' : 'Add'}
              </Button>
            </HStack>
          </HStack>
        </Box>
      )}
    </Box>
  );
}
