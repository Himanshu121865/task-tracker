import { useState, useCallback } from 'react';
import {
  VStack, HStack, Input, IconButton,
  useToast, Box, Text, InputGroup, InputLeftElement,
} from '@chakra-ui/react';
import { FiSearch, FiRefreshCw, FiEdit3 } from 'react-icons/fi';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskDetailModal from './components/TaskDetailModal';
import { useTasks } from './hooks/useTasks';

export default function App() {
  const toast = useToast();

  const { tasks, loading, filters, setFilters, fetchTasks, addTask, editTask, removeTask, togglePin, changeColor, changeStatus, changePriority, reorderTasks } = useTasks();
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = async (formData) => {
    if (editingTask) {
      await editTask(editingTask._id, formData);
      setEditingTask(null);
    } else {
      await addTask(formData);
    }
  };

  const handleEdit = (task) => setEditingTask(task);

  const handleDelete = async (id) => {
    try {
      await removeTask(id);
      setSelectedTask(null);
      toast({ title: 'Note deleted', status: 'info', duration: 1500 });
    } catch {
      toast({ title: 'Failed to delete', status: 'error', duration: 2000 });
    }
  };

  const handleTogglePin = async (task) => {
    if (!task) return;
    const updated = await togglePin(task);
    setSelectedTask(updated);
    toast({ title: updated.pinned ? 'Pinned' : 'Unpinned', status: 'info', duration: 1000 });
  };

  const handleColorChange = async (task, color) => {
    if (!task) return;
    const updated = await changeColor(task, color);
    setSelectedTask(updated);
  };

  const handleStatusChange = async (task, status) => {
    if (!task) return;
    const updated = await changeStatus(task, status);
    setSelectedTask(updated);
    toast({ title: `Status: ${status}`, status: 'info', duration: 1000 });
  };

  const handlePriorityChange = async (task, priority) => {
    if (!task) return;
    const updated = await changePriority(task, priority);
    setSelectedTask(updated);
    toast({ title: `Priority: ${priority}`, status: 'info', duration: 1000 });
  };

  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setSearchValue(value);
    setFilters((prev) => ({ ...prev, search: value }));
  }, [setFilters]);

  const handleReorder = async (updates) => {
    await reorderTasks(updates);
  };

  const handleRefresh = () => {
    fetchTasks();
    toast({ title: 'Refreshed', status: 'info', duration: 1000 });
  };

  return (
    <Box minH="100vh">
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex={10}
        bg="rgba(26, 26, 46, 0.85)"
        backdropFilter="blur(12px)"
        borderBottom="1px"
        borderColor="rgba(255,255,255,0.06)"
        px={4}
        py={3}
      >
        <HStack maxW="container.lg" mx="auto" spacing={4}>
          <HStack spacing={2.5} userSelect="none">
            <Box
              w="32px" h="32px"
              rounded="lg"
              bg="linear-gradient(135deg, #6366f1, #8b5cf6)"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FiEdit3 size="16px" color="white" />
            </Box>
            <Text fontWeight="700" fontSize="lg" letterSpacing="-0.02em" color="white">
              Taskflow
            </Text>
          </HStack>

          <InputGroup maxW="520px" flex={1}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="#6b7280" size="15px" />
            </InputLeftElement>
            <Input
              placeholder="Search notes..."
              value={searchValue}
              onChange={handleSearch}
              rounded="full"
              bg="rgba(255,255,255,0.06)"
              border="1px solid"
              borderColor="rgba(255,255,255,0.08)"
              color="gray.200"
              fontSize="sm"
              pl={10}
              _placeholder={{ color: 'gray.500' }}
              _focus={{
                bg: 'rgba(255,255,255,0.09)',
                borderColor: '#6366f1',
                boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.15)',
              }}
              _hover={{ bg: 'rgba(255,255,255,0.08)' }}
              transition="all 0.2s"
            />
          </InputGroup>

          <IconButton
            icon={<FiRefreshCw size="15px" />}
            variant="ghost"
            onClick={handleRefresh}
            aria-label="Refresh"
            rounded="full"
            color="gray.400"
            _hover={{ bg: 'rgba(255,255,255,0.08)', color: 'gray.200' }}
          />
        </HStack>
      </Box>

      <Box maxW="container.lg" mx="auto" px={4} py={6}>
        <VStack spacing={6} align="stretch">
          <TaskForm
            onSubmit={handleSubmit}
            editingTask={editingTask}
            onCancel={() => setEditingTask(null)}
          />

          <TaskList
            tasks={tasks}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onTogglePin={handleTogglePin}
            onChangeColor={handleColorChange}
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
            onSelect={setSelectedTask}
            onReorder={handleReorder}
          />
        </VStack>
      </Box>

      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onEdit={editTask}
        onDelete={handleDelete}
        onTogglePin={handleTogglePin}
        onChangeColor={handleColorChange}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
      />
    </Box>
  );
}
